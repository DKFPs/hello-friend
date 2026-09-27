import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const DepositSchema = z.object({
  payerName: z.string().trim().min(3).max(120),
  payerDocument: z.string().trim().regex(/^\d{11}$/, "CPF deve conter 11 dígitos."),
});

export const createPixDeposit = createServerFn({ method: "POST" })
  .validator((input: unknown) => DepositSchema.parse(input))
  .handler(async ({ data }) => {
    const clientId = process.env.PLUSPIX_CLIENT_ID;
    const clientSecret = process.env.PLUSPIX_CLIENT_SECRET;
    const amountRaw = process.env.EBOOK_PRICE_AMOUNT;

    if (!clientId || !clientSecret) {
      throw new Error("Pagamento Pix não configurado: faltam as credenciais do servidor.");
    }

    const amount = Number(amountRaw);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Pagamento Pix não configurado: EBOOK_PRICE_AMOUNT inválido.");
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
      throw new Error("A Plus Pix não conseguiu criar a cobrança. Tente novamente.");
    }

    return {
      transactionId: String(payload.transactionId ?? ""),
      qrcodeUrl: String(payload.qrcodeUrl ?? ""),
      copyPaste: String(payload.copyPaste ?? ""),
      status: String(payload.status ?? "PENDENTE"),
    };
  });
