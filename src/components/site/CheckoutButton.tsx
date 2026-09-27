import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { EXTERNAL_CHECKOUT_URL } from "../../data/site";

export function CheckoutButton({ children = "Acessar o e-book", className = "" }: { children?: ReactNode; className?: string }) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("ebook_checkout_click"));
    if (EXTERNAL_CHECKOUT_URL.startsWith("#")) {
      document.getElementById("ebook")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    window.location.href = EXTERNAL_CHECKOUT_URL;
  };

  return <button className={"btn btn-primary btn-checkout " + className} onClick={handleClick}>{children}<ArrowUpRight size={17} /></button>;
}
