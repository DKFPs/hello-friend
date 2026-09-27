import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { CHECKOUT_PATH } from "../../data/site";

export function CheckoutButton({ children = "Acessar o e-book", className = "" }: { children?: ReactNode; className?: string }) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("ebook_checkout_click"));
    window.location.href = CHECKOUT_PATH;
  };

  return (
    <button className={"btn btn-primary btn-checkout " + className} onClick={handleClick}>
      {children}<ArrowUpRight size={17}/>
    </button>
  );
}
