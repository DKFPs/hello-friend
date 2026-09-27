import { useState } from "react";
import { Menu, Search, X } from "lucide-react";

const links = [
  ["Trajetória", "trajetoria"],
  ["Governos", "governos"],
  ["Temas", "temas"],
  ["Linha do tempo", "timeline"],
  ["Controvérsias", "controversias"],
  ["Fontes", "fontes"],
  ["E-book", "ebook"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <header className="site-header">
      <div className="shell nav-row">
        <button className="brand" onClick={() => scrollTo("inicio")} aria-label="Ir para o início">
          <span className="brand-mark">AL</span>
          <span><strong>Arquivo Lula</strong><small>documentos • trajetória • contexto</small></span>
        </button>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}
        </nav>
        <div className="nav-actions">
          <button className="icon-btn" onClick={() => scrollTo("busca")} aria-label="Pesquisar"><Search size={19} /></button>
          <button className="mobile-menu-btn" onClick={() => setOpen((value) => !value)} aria-label={open ? "Fechar menu" : "Abrir menu"}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && <div className="mobile-nav">{links.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}</div>}
    </header>
  );
}
