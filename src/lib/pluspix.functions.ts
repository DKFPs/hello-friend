import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getPlusPixConfigStatus = createServerFn({ method: "GET" }).handler(() => ({
  configured: Boolean(process.env['PLUSPIX_CLIENT_ID'] && process.env['PLUSPIX_CLIENT_SECRET']),
  amount: 23.47,
}));

const DepositSchema = z.object({
  payerName: z.string().trim().min(3).max(120),
  payerDocument: z.string().trim().regex(/^\d{11}$/, "CPF deve conter 11 dígitos."),
});

export const checkPixTransaction = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({
      transactionId: z.string().trim().min(1).max(160),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const clientId = process.env['PLUSPIX_CLIENT_ID'];
    const clientSecret = process.env['PLUSPIX_CLIENT_SECRET'];

    if (!clientId || !clientSecret) {
      throw new Error("Pagamento Pix não configurado: faltam as credenciais do servidor.");
    }

    const response = await fetch("https://api-pluspix.squareweb.app/api/transactions/check", {
      method: "POST",
      headers: {
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactionId: data.transactionId,
      }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.transaction) {
      console.error("Plus Pix status error:", response.status, payload);
      throw new Error("Não foi possível consultar o status do pagamento.");
    }

    return {
      transactionId: String(payload.transaction.transactionId ?? data.transactionId),
      value: Number(payload.transaction.value ?? 0),
      transactionState: String(payload.transaction.transactionState ?? "DESCONHECIDO"),
      transactionType: String(payload.transaction.transactionType ?? ""),
      createdAt: String(payload.transaction.createdAt ?? ""),
    };
  });

export const createPixDeposit = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => DepositSchema.parse(input))
  .handler(async ({ data }) => {
    const clientId = process.env['PLUSPIX_CLIENT_ID'];
    const clientSecret = process.env['PLUSPIX_CLIENT_SECRET'];
    const amountRaw = process.env['EBOOK_PRICE_AMOUNT'] || "23.47";

    if (!clientId || !clientSecret) {
      throw new Error("Pagamento Pix não configurado: faltam as credenciais do servidor.");
    }

    // Aceita formatos como "23.47", "23,47", "R$ 23,47" ou "1.234,56".
    let cleaned = amountRaw.replace(/[^\d.,]/g, "");
    if (cleaned.includes(",")) cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    let amount = Math.round(Number(cleaned) * 100) / 100;
    if (!Number.isFinite(amount) || amount <= 0) {
      console.error("EBOOK_PRICE_AMOUNT inválido, usando 23.47:", amountRaw);
      amount = 23.47;
    }

    const response = await fetch("https://api-pluspix.squareweb.app/api/v1/deposit", {
      method: "POST",
      headers: {
        "x-client-id": clientId,
        "x-client-secret": clientSecret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        description: "E-book Arquivo Lula",
        payerName: data.payerName,
        payerDocument: data.payerDocument,
      }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.success) {
      console.error("Plus Pix deposit error:", response.status, payload);
      throw new Error(response.status === 401 ? "Credenciais da Plus Pix inválidas. Verifique o Client ID e o Client Secret." : "A Plus Pix não conseguiu criar a cobrança. Tente novamente.");
    }

    return {
      transactionId: String(payload.transactionId ?? ""),
      qrcodeUrl: String(payload.qrcodeUrl ?? ""),
      copyPaste: String(payload.copyPaste ?? ""),
      status: String(payload.status ?? "PENDENTE"),
    };
  });
