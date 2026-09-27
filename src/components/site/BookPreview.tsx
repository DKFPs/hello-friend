import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { ebookPreviewImages } from "../../data/site";
import { MotionReveal } from "../motion/MotionReveal";

export function BookPreview() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const current = ebookPreviewImages[active];

  const step = (direction: number) => {
    setActive((value) => (value + direction + ebookPreviewImages.length) % ebookPreviewImages.length);
  };

  const Paper = ({ large = false }: { large?: boolean }) => (
    <div className={"preview-paper " + (large ? "preview-paper-large " : "") + "preview-" + current.type}>
      {current.type === "cover" && <><span className="paper-overline">ARQUIVO • EDIÇÃO DIGITAL</span><strong>LULA</strong><h3>Uma trajetória política em perspectiva</h3><div className="paper-rule"/><span className="paper-small">Governos • acontecimentos • referências</span></>}
      {current.type === "contents" && <><span className="paper-kicker">SUMÁRIO</span><h3>O conteúdo reunido em um único material</h3>{["Biografia","Governos","Economia","Políticas sociais","Controvérsias","Linha do tempo","Fontes"].map((item,index)=><div className="paper-row" key={item}><span>{String(index+1).padStart(2,"0")}</span><b>{item}</b></div>)}</>}
      {current.type === "timeline" && <><span className="paper-kicker">LINHA DO TEMPO</span><h3>Marcos organizados por data</h3><div className="mini-timeline">{["1945","1975","1980","2002","2003","2007","2022","2023"].map(year=><div key={year}><span>{year}</span><i/></div>)}</div></>}
      {current.type === "sources" && <><span className="paper-kicker">REFERÊNCIAS</span><h3>Fontes para aprofundar</h3>{["Planalto","Arquivo Nacional","Biblioteca da Presidência","Câmara e Senado"].map(item=><div className="source-chip" key={item}>{item}</div>)}</>}
      {!large && <button className="preview-expand" aria-label="Ampliar" onClick={(event) => { event.stopPropagation(); setOpen(true); }}><Maximize2 size={15}/></button>}
    </div>
  );

  return (
    <>
      <MotionReveal className="preview-shell">
        <div
          className="preview-stage"
          onClick={() => setOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setOpen(true); }}
          aria-label={"Abrir prévia: " + current.label}
        >
          <Paper/>
        </div>
        <div className="preview-controls">
          <button className="preview-arrow" onClick={() => step(-1)} aria-label="Prévia anterior"><ChevronLeft size={18}/></button>
          <div className="preview-dots">
            {ebookPreviewImages.map((item,index)=><button key={item.label} onClick={() => setActive(index)} className={index === active ? "active" : ""} aria-label={"Mostrar " + item.label}/>)}
          </div>
          <button className="preview-arrow" onClick={() => step(1)} aria-label="Próxima prévia"><ChevronRight size={18}/></button>
        </div>
        <p className="preview-caption">{current.label} • deslize no mobile • toque para ampliar</p>
      </MotionReveal>

      {open && <div className="preview-lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
        <div className="lightbox-inner" onClick={(event) => event.stopPropagation()}>
          <button className="lightbox-close" onClick={() => setOpen(false)} aria-label="Fechar">×</button>
          <Paper large />
        </div>
      </div>}
    </>
  );
}
