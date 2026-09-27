import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { ebook } from "../data/site";
import { PixCheckoutModal } from "../components/site/PixCheckoutModal";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
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
          </div>

          <div className="checkout-payment-card">
            <PixCheckoutModal open={true} onClose={() => { window.location.href = "/"; }}/>
          </div>
        </section>
      </div>
    </main>
  );
}
