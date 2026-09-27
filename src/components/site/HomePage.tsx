import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, BookOpen, Check, ChevronDown, ExternalLink, Menu, Search, ShieldCheck, Sparkles, X } from "lucide-react";
import { chapters, ebook, heroImage, siteSources, themes, timeline } from "../../data/site";
import { BookPreview } from "./BookPreview";
import { CheckoutButton } from "./CheckoutButton";
import { MotionReveal } from "../motion/MotionReveal";

const faqs = [
  ["O que é este e-book?", "É um material digital organizado por períodos e temas sobre a trajetória política de Luiz Inácio Lula da Silva, com contexto e referências para consulta."],
  ["Quais assuntos são abordados?", "A estrutura contempla biografia, governos, economia, políticas sociais, relações internacionais, controvérsias, linha do tempo e fontes."],
  ["O conteúdo possui fontes?", "Sim. A proposta editorial é indicar referências consultáveis e separar fatos documentados de alegações ou interpretações."],
  ["O material possui data de corte?", "Cada edição deverá informar claramente sua data de corte, para que o leitor saiba até quando o conteúdo foi atualizado."],
  ["Posso ler pelo celular?", "Sim. O e-book será disponibilizado em formato digital compatível com celular, tablet e computador."],
  ["Como funciona o pagamento?", "O botão de compra leva para a página de pagamento, onde você informa os dados do pagador e gera o Pix. A confirmação é consultada automaticamente na Plus Pix."],
];

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

export function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [stickyVisible, setStickyVisible] = useState(false);

  const filteredThemes = useMemo(
    () => themes.filter(([title, text]) => (title + " " + text).toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, window.scrollY / max * 100) : 0);
      setStickyVisible(window.scrollY > 520);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="site-shell">
      <div className="reading-progress"><span style={{ width: progress + "%" }}/></div>

      <header className="sales-header">
        <div className="shell sales-header-row">
          <button className="brand" onClick={() => scrollTo("inicio")} aria-label="Início">
            <span className="brand-mark">AL</span>
            <span><strong>Arquivo Lula</strong><small>documentos • trajetória • contexto</small></span>
          </button>
          <nav className="desktop-sales-nav" aria-label="Navegação">
            <button onClick={() => scrollTo("conteudo")}>Conteúdo</button>
            <button onClick={() => scrollTo("preview")}>Por dentro</button>
            <button onClick={() => scrollTo("fontes")}>Fontes</button>
            <button onClick={() => scrollTo("ebook")}>E-book</button>
          </nav>
          <div className="sales-nav-actions">
            <button className="header-buy desktop-only" onClick={() => scrollTo("ebook")}>Ver oferta <ArrowRight size={15}/></button>
            <button className="mobile-menu-trigger" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>{menuOpen ? <X size={22}/> : <Menu size={22}/>}</button>
          </div>
        </div>
        {menuOpen && <div className="mobile-sales-menu">
          {[[ "Conteúdo","conteudo" ],[ "Por dentro","preview" ],[ "Fontes","fontes" ],[ "E-book","ebook" ]].map(([label,id]) => <button key={id} onClick={() => { scrollTo(id); setMenuOpen(false); }}>{label}</button>)}
        </div>}
      </header>

      <main>
        <section id="inicio" className="sales-hero">
          <div className="shell sales-hero-grid">
            <MotionReveal className="sales-hero-copy">
              <span className="eyebrow">E-BOOK DIGITAL • ARQUIVO EDITORIAL</span>
              <h1>{ebook.title}</h1>
              <p>{ebook.subtitle}</p>
              <div className="hero-badges">
                <span><ShieldCheck size={15}/> Fontes consultáveis</span>
                <span><BookOpen size={15}/> Leitura digital</span>
                <span>Conteúdo organizado</span>
              </div>
              <div className="sales-hero-actions">
                <CheckoutButton className="btn-large">Acessar o e-book</CheckoutButton>
                <button className="btn btn-ghost btn-large" onClick={() => scrollTo("preview")}>Ver por dentro <ArrowDown size={16}/></button>
              </div>
              <small className="hero-note">O pagamento é gerado com Pix. A confirmação automática será ligada após configurarmos o retorno de status da Plus Pix.</small>
            </MotionReveal>

            <MotionReveal className="sales-hero-visual" delay={120}>
              <div className="hero-photo">
                <img src={heroImage} alt="Luiz Inácio Lula da Silva em evento institucional. Foto: Ricardo Stuckert/Presidência da República."/>
                <div className="photo-caption">Foto: Ricardo Stuckert / Presidência da República</div>
              </div>
              <div className="hero-book-card">
                <div className="mini-book"><span>ARQUIVO</span><strong>LULA</strong><small>trajetória • governos • fontes</small></div>
                <div><span className="eyebrow">PRODUTO DIGITAL</span><b>Uma edição pensada para consulta</b><p>{ebook.description}</p></div>
              </div>
            </MotionReveal>
          </div>
        </section>

        <section className="trust-strip"><div className="shell trust-grid"><span>História política</span><i/><span>Períodos presidenciais</span><i/><span>Temas</span><i/><span>Acontecimentos</span><i/><span>Referências</span></div></section>

        <section id="conteudo" className="section sales-section">
          <div className="shell">
            <MotionReveal><div className="sales-heading"><div><span className="eyebrow">01 • CONTEÚDO</span><h2>Veja o que está dentro.</h2></div><p>Uma estrutura editorial para transformar um assunto amplo em blocos fáceis de navegar, consultar e aprofundar.</p></div></MotionReveal>
            <div className="chapter-grid">
              {chapters.map(([number,title,text],index)=><MotionReveal key={number} delay={index*45} className="chapter-card"><span className="chapter-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowRight size={17} className="chapter-arrow"/></MotionReveal>)}
            </div>
          </div>
        </section>

        <section id="preview" className="section preview-section">
          <div className="shell preview-grid">
            <MotionReveal>
              <span className="eyebrow">02 • POR DENTRO</span>
              <h2>Veja a estrutura antes de comprar.</h2>
              <p>Deslize no celular, use as setas no desktop ou toque para ampliar a prévia.</p>
              <div className="preview-proof">{["Capa","Sumário","Linha do tempo","Referências"].map(item=><span key={item}><Check size={15}/>{item}</span>)}</div>
            </MotionReveal>
            <BookPreview/>
          </div>
        </section>

        <section className="section timeline-sales-section">
          <div className="shell">
            <MotionReveal><div className="sales-heading"><div><span className="eyebrow">03 • CRONOLOGIA</span><h2>Uma história organizada por datas.</h2></div><p>Um recorte de apresentação. A edição completa amplia contexto e referências.</p></div></MotionReveal>
            <div className="timeline-mini-grid">
              {timeline.map((item,index)=><MotionReveal key={item.year} delay={index*45} className="timeline-mini-card"><span>{item.year}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></MotionReveal>)}
            </div>
          </div>
        </section>

        <section className="section values-section">
          <div className="shell">
            <MotionReveal><div className="sales-heading centered-sales"><span className="eyebrow">04 • DIFERENCIAIS</span><h2>Feito para facilitar a consulta.</h2><p>O material reúne os principais blocos em uma estrutura editorial única, sem substituir a consulta às fontes originais.</p></div></MotionReveal>
            <div className="value-grid">{[
              ["Organização","Capítulos e períodos separados para encontrar o assunto com menos atrito."],
              ["Contexto","Acontecimentos apresentados com datas e recortes que ajudam na compreensão."],
              ["Consulta","Estrutura pensada para leitura rápida e aprofundamento."],
              ["Referências","Fontes indicadas para verificar e continuar a pesquisa."],
            ].map(([title,text],index)=><MotionReveal key={title} delay={index*70} className="value-card"><Sparkles size={18}/><h3>{title}</h3><p>{text}</p></MotionReveal>)}</div>
          </div>
        </section>

        <section id="fontes" className="section sources-sales-section">
          <div className="shell sources-grid">
            <MotionReveal><span className="eyebrow">05 • FONTES</span><h2>Pesquisa que começa pela documentação.</h2><p>Referências públicas e institucionais formam a base do projeto editorial.</p><button className="btn btn-ghost" onClick={() => scrollTo("ebook")}>Ver oferta <ArrowRight size={15}/></button></MotionReveal>
            <div className="source-list">{siteSources.map((source,index)=><MotionReveal key={source.url} delay={index*60} className="source-row"><a href={source.url} target="_blank" rel="noreferrer"><div><span className="eyebrow">REFERÊNCIA</span><strong>{source.name}</strong></div><ExternalLink size={17}/></a></MotionReveal>)}</div>
          </div>
        </section>

        <section className="section theme-sales-section">
          <div className="shell"><MotionReveal><div className="sales-heading"><div><span className="eyebrow">06 • TEMAS</span><h2>Conteúdo dividido por assunto.</h2></div><p>Pesquise uma categoria para explorar a proposta do material.</p></div></MotionReveal>
            <div className="search-box search-sales"><Search size={18}/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Buscar tema..." aria-label="Buscar tema"/></div>
            <div className="theme-chip-grid">{filteredThemes.map(([title,text],index)=><MotionReveal key={title} delay={index*40} className="theme-sales-card"><span>{String(index+1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p></MotionReveal>)}</div>
          </div>
        </section>

        <section id="ebook" className="offer-section">
          <div className="shell offer-grid">
            <MotionReveal className="offer-copy"><span className="eyebrow">07 • OFERTA</span><h2>Tenha a edição completa reunida em um único e-book.</h2><p>{ebook.description}</p><div className="offer-list">{["Linha do tempo ampliada","Capítulos por governo e tema","Referências e links consultáveis","Leitura digital em múltiplos dispositivos"].map(item=><span key={item}><Check size={16}/>{item}</span>)}</div></MotionReveal>
            <MotionReveal className="offer-card" delay={120}>
              <div className="offer-cover"><span>ARQUIVO</span><strong>LULA</strong><small>UMA TRAJETÓRIA POLÍTICA EM PERSPECTIVA</small></div>
              <div className="offer-meta"><span className="eyebrow">{ebook.availabilityText}</span><h3>{ebook.title}</h3><div className="price-row"><del>{ebook.oldPrice}</del><strong>{ebook.price}</strong></div><p>O pagamento é gerado via Pix diretamente pela integração segura com a Plus Pix.</p><CheckoutButton className="full-width">Acessar o e-book</CheckoutButton><small>O QR Code e o Pix Copia e Cola aparecem aqui mesmo.</small></div>
            </MotionReveal>
          </div>
        </section>

        <section className="section faq-sales-section">
          <div className="shell faq-sales-grid">
            <MotionReveal><span className="eyebrow">08 • FAQ</span><h2>Perguntas frequentes.</h2><p>Informação clara antes do clique de compra.</p></MotionReveal>
            <div className="faq-list">{faqs.map(([question,answer],index)=><div className="faq-item" key={question}><button onClick={()=>setFaqOpen(faqOpen===index?null:index)} aria-expanded={faqOpen===index}><span>{question}</span><ChevronDown size={18} className={faqOpen===index?"rotate-180":""}/></button>{faqOpen===index&&<div className="faq-answer"><p>{answer}</p></div>}</div>)}</div>
          </div>
        </section>

        <section className="final-cta"><div className="shell final-cta-inner"><MotionReveal><span className="eyebrow">ARQUIVO LULA</span><h2>Trajetória, governos, temas e referências organizados para consulta.</h2><CheckoutButton className="btn-large">Acessar o e-book</CheckoutButton></MotionReveal></div></section>
      </main>

      <footer className="footer"><div className="shell footer-grid"><div><div className="brand footer-brand"><span className="brand-mark">AL</span><span><strong>Arquivo Lula</strong><small>documentos • trajetória • contexto</small></span></div><p>Projeto editorial informativo. Consulte as fontes indicadas e o contexto original de cada informação.</p></div><div className="footer-links"><button onClick={()=>scrollTo("conteudo")}>Conteúdo</button><button onClick={()=>scrollTo("fontes")}>Fontes</button><button onClick={()=>scrollTo("ebook")}>E-book</button></div></div><div className="shell footer-bottom"><span>© 2026 Arquivo Lula</span><span>Projeto editorial informativo</span></div></footer>

      <div className={"mobile-sticky-cta " + (stickyVisible ? "visible" : "")}><div><span className="eyebrow">E-BOOK DIGITAL</span><strong>{ebook.title}</strong></div><CheckoutButton>Acessar</CheckoutButton></div>
    </div>
  );
}
