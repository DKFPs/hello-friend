import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Check, ChevronDown, ExternalLink, Search, ShieldCheck, Clock3, LibraryBig } from "lucide-react";
import { EXTERNAL_CHECKOUT_URL, heroImage, siteSources, themes } from "../../data/site";
import { SiteHeader } from "./SiteHeader";
import { Timeline } from "./Timeline";

const faqs = [
  ["O que é o Arquivo Lula?", "É uma plataforma editorial que organiza informações sobre a trajetória política, os governos e acontecimentos relacionados a Luiz Inácio Lula da Silva, com links para fontes consultáveis."],
  ["O material já é o e-book completo?", "Nesta fase, o site apresenta a estrutura do produto. O e-book definitivo será conectado posteriormente ao checkout externo."],
  ["O conteúdo é atualizado?", "A estrutura foi pensada para receber novos acontecimentos e referências. A data de corte de cada edição deverá aparecer de forma explícita no produto."],
  ["Onde encontro as referências?", "A seção Fontes reúne links para acervos públicos e institucionais usados como ponto de partida da pesquisa."],
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HomePage() {
  const [search, setSearch] = useState("");
  const filteredThemes = useMemo(
    () => themes.filter(([title, text]) => (title + " " + text).toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  const checkout = () => {
    if (EXTERNAL_CHECKOUT_URL.startsWith("#")) {
      scrollTo("ebook");
      return;
    }
    window.location.href = EXTERNAL_CHECKOUT_URL;
  };

  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <section id="inicio" className="hero-section">
          <div className="shell hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">ARQUIVO EDITORIAL • ATUALIZÁVEL</span>
              <h1>Uma trajetória política contada em contexto.</h1>
              <p className="hero-lead">Navegue por biografia, governos, temas, acontecimentos e referências de Luiz Inácio Lula da Silva em uma experiência feita para consulta rápida e leitura profunda.</p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => scrollTo("trajetoria")}>Explorar trajetória <ArrowRight size={17} /></button>
                <button className="btn btn-ghost" onClick={() => scrollTo("ebook")}>Conhecer o e-book</button>
              </div>
              <div className="hero-trust">
                <span><ShieldCheck size={16} /> fontes consultáveis</span>
                <span><Clock3 size={16} /> conteúdo por período</span>
                <span><LibraryBig size={16} /> estrutura editorial</span>
              </div>
            </div>
            <div className="hero-media">
              <div className="hero-image-wrap">
                <img src={heroImage} alt="Luiz Inácio Lula da Silva em reunião institucional, foto do acervo da Presidência da República" />
                <div className="image-credit">Foto: Ricardo Stuckert / Presidência da República</div>
              </div>
              <div className="hero-float-card">
                <span className="eyebrow">PONTO DE PARTIDA</span>
                <strong>1945 → presente</strong>
                <p>Uma linha do tempo para entender os principais períodos da trajetória presidencial.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="ticker"><div className="shell ticker-row"><span>1945</span><i/><span>1970s</span><i/><span>1980</span><i/><span>2002</span><i/><span>2003–2010</span><i/><span>2022</span><i/><span>2023–</span></div></section>

        <section id="trajetoria" className="section shell">
          <div className="section-heading">
            <div><span className="eyebrow">01 • TRAJETÓRIA</span><h2>De Garanhuns à Presidência</h2></div>
            <p>Lula nasceu em 27 de outubro de 1945, em Garanhuns, Pernambuco. Sua trajetória profissional passou pela metalurgia e sua atuação pública ganhou projeção no movimento sindical.</p>
          </div>
          <div className="story-grid">
            <article className="story-card story-card-large"><span className="story-number">01</span><h3>Origens e trabalho</h3><p>Infância em Pernambuco, migração para São Paulo e formação como torneiro mecânico são partes centrais da biografia disponível em acervos públicos.</p><button className="text-link" onClick={() => scrollTo("fontes")}>Ver referências <ArrowRight size={15}/></button></article>
            <article className="story-card"><span className="story-number">02</span><h3>Movimento sindical</h3><p>A partir do final da década de 1960, Lula passou a atuar no movimento sindical e, em 1975, tornou-se presidente do Sindicato dos Metalúrgicos de São Bernardo do Campo e Diadema.</p></article>
            <article className="story-card"><span className="story-number">03</span><h3>Entrada na política</h3><p>Participou da fundação do Partido dos Trabalhadores e construiu uma trajetória eleitoral que culminou na eleição presidencial de 2002.</p></article>
          </div>
        </section>

        <section id="governos" className="section section-dark">
          <div className="shell">
            <div className="section-heading">
              <div><span className="eyebrow">02 • GOVERNOS</span><h2>Três períodos presidenciais para consultar</h2></div>
              <p>O projeto organiza o conteúdo por mandato, permitindo acompanhar medidas, acontecimentos, indicadores e fontes de cada período.</p>
            </div>
            <div className="government-grid">
              {[
                ["01","2003–2006","Primeiro mandato","Posse em 1º de janeiro de 2003 e quatro anos de governo."],
                ["02","2007–2010","Segundo mandato","Segundo período presidencial iniciado em 1º de janeiro de 2007."],
                ["03","2023–","Terceiro mandato","Novo mandato iniciado em 1º de janeiro de 2023, com conteúdo atualizável."],
              ].map(([no,period,title,text]) => <article className="gov-card" key={no}><div className="gov-top"><span>{no}</span><small>{period}</small></div><h3>{title}</h3><p>{text}</p><button onClick={() => scrollTo("timeline")} className="text-link">Ver linha do tempo <ArrowRight size={15}/></button></article>)}
            </div>
          </div>
        </section>

        <section id="temas" className="section shell">
          <div className="section-heading">
            <div><span className="eyebrow">03 • TEMAS</span><h2>Encontre o assunto que você procura</h2></div>
            <p>Uma estrutura modular para transformar o site em uma biblioteca digital conforme o conteúdo do e-book cresce.</p>
          </div>
          <div id="busca" className="search-box"><Search size={19}/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por tema..." aria-label="Buscar por tema"/></div>
          <div className="theme-grid">{filteredThemes.map(([title,text],index)=><article className="theme-card" key={title}><span>{String(index+1).padStart(2,"0")}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>

        <section id="timeline" className="section section-paper">
          <div className="narrow">
            <div className="section-heading centered"><span className="eyebrow">04 • LINHA DO TEMPO</span><h2>Uma leitura cronológica</h2><p>Os marcos abaixo usam como ponto de partida informações presentes em acervos públicos e institucionais.</p></div>
            <Timeline/>
          </div>
        </section>

        <section id="controversias" className="section shell">
          <div className="section-heading">
            <div><span className="eyebrow">05 • CONTROVÉRSIAS</span><h2>Fatos, alegações e desdobramentos separados</h2></div>
            <p>O conteúdo futuro desta área deverá apresentar contexto, cronologia, status e fontes, sem transformar alegações em fatos.</p>
          </div>
          <div className="controversy-box"><div className="controversy-icon"><ShieldCheck size={22}/></div><div><h3>Critério editorial</h3><p>Em temas controversos, o site exibirá a fonte, a data, o que foi alegado, o que foi oficialmente registrado e os desdobramentos conhecidos.</p></div></div>
        </section>

        <section id="ebook" className="ebook-section">
          <div className="shell ebook-grid">
            <div className="ebook-copy">
              <span className="eyebrow">06 • E-BOOK</span>
              <h2>O arquivo completo, organizado para consulta.</h2>
              <p>Uma futura edição reunirá os conteúdos do portal em um único material digital, com capítulos, cronologia, tabelas, referências e recortes por tema.</p>
              <div className="check-list">{["Linha do tempo ampliada","Capítulos por governo e tema","Referências e links consultáveis","Estrutura preparada para futuras atualizações"].map(item=><span key={item}><Check size={16}/> {item}</span>)}</div>
              <button className="btn btn-primary btn-large" onClick={checkout}>Acessar o e-book <ArrowRight size={18}/></button>
              <small className="checkout-note">O botão está preparado para receber seu checkout externo.</small>
            </div>
            <div className="book-mockup" aria-label="Mockup do e-book">
              <div className="book-cover"><span>ARQUIVO</span><strong>LULA</strong><p>Trajetória política, governos, acontecimentos e fontes</p><div className="book-line"/><small>Edição digital</small></div>
              <div className="book-page page-back"/>
              <div className="book-page page-front"><span className="eyebrow">SUMÁRIO</span><b>Biografia</b><b>Governos</b><b>Temas</b><b>Controvérsias</b><b>Fontes</b></div>
            </div>
          </div>
        </section>

        <section id="fontes" className="section shell">
          <div className="section-heading">
            <div><span className="eyebrow">07 • FONTES</span><h2>Comece pela documentação</h2></div>
            <p>O portal prioriza acervos públicos, institucionais e registros que possam ser consultados pelo leitor.</p>
          </div>
          <div className="source-list">{siteSources.map(source=><a className="source-row" href={source.url} target="_blank" rel="noreferrer" key={source.url}><div><span className="eyebrow">REFERÊNCIA</span><strong>{source.name}</strong></div><ExternalLink size={18}/></a>)}</div>
        </section>

        <section className="section section-dark faq-section">
          <div className="shell faq-grid">
            <div><span className="eyebrow">08 • FAQ</span><h2>Perguntas frequentes</h2><p>Uma seção simples para reduzir dúvidas antes da compra do material.</p></div>
            <div className="faq-list">{faqs.map(([question,answer])=><FaqItem question={question} answer={answer} key={question}/>)}</div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="shell footer-grid">
          <div><div className="brand footer-brand"><span className="brand-mark">AL</span><span><strong>Arquivo Lula</strong><small>documentos • trajetória • contexto</small></span></div><p>Projeto editorial informativo. O site organiza conteúdos e referências para facilitar a consulta.</p></div>
          <div className="footer-links"><button onClick={()=>scrollTo("inicio")}>Início</button><button onClick={()=>scrollTo("fontes")}>Fontes</button><button onClick={()=>scrollTo("ebook")}>E-book</button></div>
        </div>
        <div className="shell footer-bottom"><span>© 2026 Arquivo Lula</span><span>Conteúdo com data de corte e fontes por edição.</span></div>
      </footer>

      <div className="mobile-cta"><button className="btn btn-primary" onClick={checkout}><BookOpen size={17}/> Acessar o e-book</button></div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open,setOpen] = useState(false);
  return <div className="faq-item"><button onClick={()=>setOpen(value=>!value)} aria-expanded={open}><span>{question}</span><ChevronDown size={18} className={open ? "rotate-180" : ""}/></button>{open && <p>{answer}</p>}</div>;
}
