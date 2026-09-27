import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { ebook } from "../data/site";
import { PixCheckoutModal } from "../components/site/PixCheckoutModal";
import { getPlusPixConfigStatus } from "../server/payments/pluspix";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const [gatewayReady, setGatewayReady] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    void getPlusPixConfigStatus()
      .then((result) => {
        if (active) setGatewayReady(result.configured);
      })
      .catch(() => {
        if (active) setGatewayReady(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="checkout-page">
      <div className="checkout-page-shell">
        <div className="checkout-topbar">
          <Link to="/" className="checkout-back"><ArrowLeft size={16}/> Voltar</Link>
          <span className="eyebrow">ARQUIVO LULA • PAGAMENTO</span>
        </div>

        <section className="checkout-layout">
          <div className="checkout-info">
            <span className="eyebrow">E-BOOK DIGITAL</span>
            <h1>Finalize sua compra</h1>
            <p>Você está adquirindo uma edição digital organizada sobre a trajetória política de Luiz Inácio Lula da Silva.</p>

            <div className="checkout-product">
              <div>
                <span className="eyebrow">{ebook.availabilityText}</span>
                <h2>{ebook.title}</h2>
                <p>Acesso ao material digital após a confirmação do pagamento.</p>
              </div>
              <div className="checkout-price">
                <del>{ebook.oldPrice}</del>
                <strong>{ebook.price}</strong>
              </div>
            </div>

            <div className="checkout-trust">
              <ShieldCheck size={18}/>
              <span>Pagamento Pix processado pela integração com a Plus Pix.</span>
            </div>

            <div className={"checkout-gateway-status " + (gatewayReady === true ? "ready" : gatewayReady === false ? "error" : "")}>
              {gatewayReady === true ? <CheckCircle2 size={16}/> : <ShieldCheck size={16}/>}
              <span>
                {gatewayReady === true
                  ? "Gateway Pix configurado no servidor."
                  : gatewayReady === false
                    ? "O servidor não encontrou as Secrets da Plus Pix. Confira as variáveis no Lovable."
                    : "Verificando a configuração do gateway..."}
              </span>
            </div>
          </div>

          <div className="checkout-payment-card">
            <PixCheckoutModal open={true} onClose={() => { window.location.href = "/"; }}/>
          </div>
        </section>
      </div>
    </main>
  );
}
