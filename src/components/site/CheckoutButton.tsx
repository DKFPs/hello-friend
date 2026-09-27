import { useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { EXTERNAL_CHECKOUT_URL } from "../../data/site";
import { PixCheckoutModal } from "./PixCheckoutModal";

export function CheckoutButton({ children = "Acessar o e-book", className = "" }: { children?: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("ebook_checkout_click"));
    if (EXTERNAL_CHECKOUT_URL.startsWith("#")) {
      setOpen(true);
      return;
    }
    window.location.href = EXTERNAL_CHECKOUT_URL;
  };

  return (
    <>
      <button className={"btn btn-primary btn-checkout " + className} onClick={handleClick}>
        {children}<ArrowUpRight size={17}/>
      </button>
      <PixCheckoutModal open={open} onClose={() => setOpen(false)}/>
    </>
  );
}
