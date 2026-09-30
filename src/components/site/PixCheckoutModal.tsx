import { useEffect, useState } from "react";
import { Check, Clipboard, Download, Loader2, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { checkPixTransaction, createPixDeposit } from "../../lib/pluspix.functions";
import { createEbookDownloadLink } from "../../server/payments/ebook-delivery";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

function qrSource(value: string) {
  if (!value) return "";
  if (value.startsWith("data:image/")) return value;
  if (value.startsWith("base64:")) return "data:image/png;base64," + value.slice(7);
  return value;
}

async function unlockDownload(transactionId: string, payerDocument: string) {
  try {
    const result = await createEbookDownloadLink({
      data: { transactionId, payerDocument: onlyDigits(payerDocument) },
    });
    return result.downloadPath;
  } catch (caught) {
    throw caught instanceof Error ? caught : new Error("Não foi possível preparar o download.");
  }
}

export function PixCheckoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [payerName, setPayerName] = useState("");
  const [payerDocument, setPayerDocument] = useState("");
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState<{ transactionId: string; qrcodeUrl: string; copyPaste: string; status: string } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [downloadPath, setDownloadPath] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    if (!open || !payment?.transactionId) return;
    const normalized = payment.status.trim().toUpperCase();
    if (["COMPLETO", "PAGO", "PAID"].includes(normalized)) return;

    let active = true;
    let attempts = 0;
    let interval = 0;
    const maxAttempts = 36;

    const poll = async () => {
      if (!active || attempts >= maxAttempts) return;
      attempts += 1;

      try {
        const result = await checkPixTransaction({
          data: { transactionId: payment.transactionId },
        });

        if (!active) return;

        const transactionState = result.transactionState.trim().toUpperCase();
        setPayment((current) => current ? {
          ...current,
          status: result.transactionState,
        } : current);

        if (["COMPLETO", "PAGO", "PAID"].includes(transactionState)) {
          window.clearInterval(interval);
          if (active) {
            void unlockDownload(payment.transactionId, payerDocument)
              .then((path) => setDownloadPath(path))
              .catch((caught) => setError(caught instanceof Error ? caught.message : "Não foi possível preparar o download."));
          }
        }
      } catch {
        // Falhas temporárias de consulta não interrompem o polling.
      }
    };

    void poll();
    interval = window.setInterval(() => {
      void poll();
      if (attempts >= maxAttempts) window.clearInterval(interval);
    }, 5000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [open, payment?.transactionId]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    setDownloadPath("");
    try {
      const result = await createPixDeposit({
        data: { payerName: payerName.trim(), payerDocument: onlyDigits(payerDocument) },
      });
      setPayment(result);
      if (["COMPLETO", "PAGO", "PAID"].includes(result.status.trim().toUpperCase())) {
        void unlockDownload(result.transactionId, onlyDigits(payerDocument))
          .then((path) => setDownloadPath(path))
          .catch((caught) => setError(caught instanceof Error ? caught.message : "Não foi possível preparar o download."));
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível gerar o Pix.");
    } finally {
      setLoading(false);
    }
  };

  const checkNow = async () => {
    if (!payment?.transactionId || checking) return;
    setChecking(true);
    setError("");
    try {
      const result = await checkPixTransaction({
        data: { transactionId: payment.transactionId },
      });
      setPayment((current) => current ? {
        ...current,
        status: result.transactionState,
      } : current);
      if (["COMPLETO", "PAGO", "PAID"].includes(result.transactionState.trim().toUpperCase())) {
        void unlockDownload(payment.transactionId, payerDocument)
          .then((path) => setDownloadPath(path))
          .catch((caught) => setError(caught instanceof Error ? caught.message : "Não foi possível preparar o download."));
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível consultar o pagamento.");
    } finally {
      setChecking(false);
    }
  };

  const copy = async () => {
    if (!payment?.copyPaste) return;
    await navigator.clipboard.writeText(payment.copyPaste);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const close = () => {
    if (!loading && !downloadLoading && !checking) {
      setPayment(null);
      setDownloadPath("");
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
            {["COMPLETO", "PAGO", "PAID"].includes(payment.status.trim().toUpperCase()) ? (
              <>
                <div className="pix-success" role="status">
                  <Check size={22} />
                  <div>
                    <strong>Pagamento confirmado</strong>
                    <span>A transação foi confirmada pela Plus Pix.</span>
                  </div>
                </div>
                <p className="pix-lead">Seu pagamento foi identificado. O próximo passo é liberar o acesso ao e-book.</p>
              </>
            ) : (
              <p className="pix-lead">
                A cobrança foi criada e está com status <strong>{payment.status}</strong>. O site consulta a Plus Pix automaticamente até a confirmação.
              </p>
            )}
            {payment.copyPaste ? (
              <div className="pix-qr">
                <QRCodeSVG
                  value={payment.copyPaste.trim()}
                  size={280}
                  level="M"
                  boostLevel={false}
                  marginSize={4}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  title="QR Code Pix para pagamento"
                  aria-label="QR Code Pix para pagamento"
                />
              </div>
            ) : payment.qrcodeUrl ? (
              <div className="pix-qr"><img src={qrSource(payment.qrcodeUrl)} alt="QR Code para pagamento Pix"/></div>
            ) : (
              <div className="pix-error">A Plus Pix não retornou um código de pagamento para gerar o QR Code.</div>
            )}
            <button className="pix-copy" onClick={copy} disabled={!payment.copyPaste}>{copied ? <Check size={17}/> : <Clipboard size={17}/>} {copied ? "Código copiado" : "Copiar Pix Copia e Cola"}</button>
            {payment.copyPaste && <textarea readOnly value={payment.copyPaste} aria-label="Pix Copia e Cola"/>}
            <button className="btn btn-secondary full-width pix-check-now" onClick={checkNow} disabled={checking || ["COMPLETO", "PAGO", "PAID"].includes(payment.status.trim().toUpperCase())}>
              {checking ? <><Loader2 size={16} className="spin"/> Consultando pagamento...</> : "Já paguei · Verificar agora"}
            </button>
            {["COMPLETO", "PAGO", "PAID"].includes(payment.status.trim().toUpperCase()) && (
              <div className="pix-download-area">
                {downloadPath ? (
                  <>
                    <a className="btn btn-primary full-width pix-download" href={downloadPath}>
                      <Download size={17}/> Baixar e-book
                    </a>
                    <p className="pix-download-note">Link seguro válido por 15 minutos. O servidor confirma novamente o pagamento no momento do download.</p>
                  </>
                ) : (
                  <div className="pix-warning">
                    {downloadLoading ? "Preparando seu link seguro de download..." : "Pagamento confirmado. Preparando o download..."}
                  </div>
                )}
              </div>
            )}
            <div className="pix-transaction">Transação: {payment.transactionId || "gerada pela Plus Pix"}</div>
            {!["COMPLETO", "PAGO", "PAID"].includes(payment.status.trim().toUpperCase()) && (
              <div className="pix-warning">A confirmação automática está ativa por consulta à API. O sistema fará novas verificações por até 3 minutos.</div>
            )}
            <button className="btn btn-ghost full-width" onClick={close} disabled={downloadLoading}>Fechar</button>
          </>
        )}
      </div>
    </div>
  );
}
