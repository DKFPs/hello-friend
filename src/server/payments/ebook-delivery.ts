import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const API = "https://api-pluspix.squareweb.app";
const PRICE = 29.95;
const COMPLETE = new Set(["COMPLETO", "PAGO", "PAID"]);

function creds() {
  const id = process.env["PLUSPIX_CLIENT_ID"];
  const secret = process.env["PLUSPIX_CLIENT_SECRET"];
  if (!id || !secret) throw new Error("Pagamento Pix não configurado.");
  return { id, secret };
}

async function transaction(transactionId: string) {
  const { id, secret } = creds();
  const response = await fetch(API + "/api/transactions/check", {
    method: "POST",
    headers: {
      "x-client-id": id,
      "x-client-secret": secret,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transactionId }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.transaction) throw new Error("Não foi possível confirmar o pagamento.");
  return {
    transactionId: String(body.transaction.transactionId ?? transactionId),
    value: Number(body.transaction.value ?? 0),
    state: String(body.transaction.transactionState ?? ""),
    type: String(body.transaction.transactionType ?? ""),
  };
}

function b64url(value: string) {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromB64url(value: string) {
  const padding = "===".slice((value.length + 3) % 4);
  return atob(value.replace(/-/g, "+").replace(/_/g, "/") + padding);
}

async function sign(data: string) {
  const secret = process.env["EBOOK_DOWNLOAD_SECRET"] || process.env["PLUSPIX_CLIENT_SECRET"];
  if (!secret) throw new Error("Chave de assinatura do download não configurada.");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return b64url(binary);
}

async function signedToken(transactionId: string, payerDocument: string) {
  const payload = b64url(JSON.stringify({
    transactionId,
    payerDocumentLast4: payerDocument.slice(-4),
    exp: Date.now() + 15 * 60 * 1000,
  }));
  return payload + "." + await sign(payload);
}

export const createEbookDownloadLink = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({
    transactionId: z.string().trim().min(1).max(160),
    payerDocument: z.string().trim().regex(/^\d{11}$/, "CPF deve conter 11 dígitos."),
  }).parse(input))
  .handler(async ({ data }) => {
    const paid = await transaction(data.transactionId);
    const state = paid.state.trim().toUpperCase();
    if (!COMPLETE.has(state)) throw new Error("O pagamento ainda não foi confirmado.");
    if (paid.type && paid.type.toUpperCase() !== "DEPOSITO") throw new Error("Transação inválida para este produto.");
    if (Math.abs(paid.value - PRICE) > 0.01) throw new Error("O valor confirmado não corresponde ao e-book.");
    const token = await signedToken(paid.transactionId, data.payerDocument);
    return { downloadPath: "/download/ebook?token=" + encodeURIComponent(token), expiresInMinutes: 15 };
  });

export async function authorizeEbookDownload(token: string) {
  const [payload, provided] = token.split(".");
  if (!payload || !provided) throw new Error("Link de download inválido.");
  if ((await sign(payload)) !== provided) throw new Error("Link de download inválido.");
  const data = JSON.parse(fromB64url(payload)) as { transactionId?: string; exp?: number };
  if (!data.transactionId || !data.exp || data.exp < Date.now()) throw new Error("Link de download expirado.");
  const paid = await transaction(data.transactionId);
  if (!COMPLETE.has(paid.state.trim().toUpperCase())) throw new Error("Pagamento não confirmado.");
  if (paid.type && paid.type.toUpperCase() !== "DEPOSITO") throw new Error("Transação inválida para este produto.");
  if (Math.abs(paid.value - PRICE) > 0.01) throw new Error("Valor da transação incompatível com o produto.");
  return paid.transactionId;
}
