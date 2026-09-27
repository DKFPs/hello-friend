import { useState } from "react";
import { Check, Clipboard, Loader2, X } from "lucide-react";
import { createPixDeposit } from "../../server/payments/pluspix";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

function qrSource(value: string) {
  if (!value) return "";
  if (value.startsWith("data:image/")) return value;
  if (value.startsWith("base64:")) return "data:image/png;base64," + value.slice(7);
  return value;
}

export function PixCheckoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [payerName, setPayerName] = useState("");
  const [payerDocument, setPayerDocument] = useState("");
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<{ transactionId: string; qrcodeUrl: string; copyPaste: string; status: string } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await createPixDeposit({
        data: { payerName: payerName.trim(), payerDocument: onlyDigits(payerDocument) },
      });
      setPayment(result);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível gerar o Pix.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!payment?.copyPaste) return;
    await navigator.clipboard.writeText(payment.copyPaste);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const close = () => {
    if (!loading) {
      setPayment(null);
      setError("");
      onClose();
    }
  };

  return (
    <div className="pix-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="pix-modal" role="dialog" aria-modal="true" aria-labelledby="pix-title">
        <button className="pix-close" onClick={close} aria-label="Fechar"><X size={20}/></button>

        {!payment ? (
          <>
            <span className="eyebrow">CHECKOUT PIX</span>
            <h2 id="pix-title">Gerar seu pagamento</h2>
            <p className="pix-lead">Informe os dados do pagador. Eles serão enviados ao servidor para criar a cobrança na Plus Pix.</p>

            <form onSubmit={submit} className="pix-form">
              <label>Nome do pagador<input required minLength={3} value={payerName} onChange={(e) => setPayerName(e.target.value)} placeholder="Seu nome completo"/></label>
              <label>CPF do pagador<input required inputMode="numeric" value={payerDocument} onChange={(e) => setPayerDocument(onlyDigits(e.target.value))} placeholder="Somente números" maxLength={11}/></label>
              {error && <div className="pix-error">{error}</div>}
              <button className="btn btn-primary full-width" disabled={loading}>
                {loading ? <><Loader2 size={17} className="spin"/> Gerando Pix...</> : "Gerar Pix"}
              </button>
            </form>
          </>
        ) : (
          <>
            <span className="eyebrow">PAGAMENTO GERADO</span>
            <h2 id="pix-title">Pague via Pix</h2>
            <p className="pix-lead">A cobrança foi criada e está com status <strong>{payment.status}</strong>.</p>
            {payment.qrcodeUrl && <div className="pix-qr"><img src={qrSource(payment.qrcodeUrl)} alt="QR Code para pagamento Pix"/></div>}
            <button className="pix-copy" onClick={copy}>{copied ? <Check size={17}/> : <Clipboard size={17}/>} {copied ? "Código copiado" : "Copiar Pix Copia e Cola"}</button>
            {payment.copyPaste && <textarea readOnly value={payment.copyPaste} aria-label="Pix Copia e Cola"/>}
            <div className="pix-transaction">Transação: {payment.transactionId || "gerada pela Plus Pix"}</div>
            <div className="pix-warning">A confirmação automática da compra será ativada quando o webhook/status da Plus Pix estiver configurado.</div>
            <button className="btn btn-ghost full-width" onClick={close}>Fechar</button>
          </>
        )}
      </div>
    </div>
  );
}
