const WIDTH = 595;
const HEIGHT = 842;
const MARGIN = 54;

const pages = [
  { title: "LULA", body: [
    "uma trajetoria politica em perspectiva",
    "Governos, acontecimentos, temas e referencias reunidos em uma edicao digital de consulta."
  ]},
  { title: "Nota editorial", body: [
    "Este material foi organizado com finalidade informativa e de consulta. O texto distingue fatos documentados, descricoes institucionais e controversias que exigem consulta as fontes originais.",
    "As referencias principais desta edicao incluem materiais publicos da Presidencia da Republica, Secretaria-Geral da Presidencia e Arquivo Nacional."
  ]},
  { title: "01 | Quem e Lula", body: [
    "Luiz Inacio Lula da Silva nasceu em 27 de outubro de 1945, em Garanhuns, Pernambuco. A familia migrou para Sao Paulo e, na juventude, ele trabalhou em diferentes atividades antes de se formar como torneiro mecanico.",
    "Na decada de 1960, entrou em contato com o movimento sindical no ABC paulista. Em 1975 foi eleito presidente do Sindicato dos Metalurgicos de Sao Bernardo do Campo e Diadema. Em 1980 participou da fundacao do Partido dos Trabalhadores.",
    "Depois de disputar eleicoes presidenciais anteriores, foi eleito em 2002 e tomou posse em 1 de janeiro de 2003. Foi reeleito em 2006 e iniciou o segundo mandato em 1 de janeiro de 2007. Em 2022 foi eleito novamente e tomou posse para o terceiro mandato em 1 de janeiro de 2023."
  ]},
  { title: "02 | Linha do tempo", body: [
    "1945 - Nascimento em Garanhuns, Pernambuco.",
    "1975 - Eleito presidente do Sindicato dos Metalurgicos de Sao Bernardo do Campo e Diadema.",
    "1980 - Participacao na fundacao do Partido dos Trabalhadores.",
    "1986 - Eleito deputado federal mais votado do pais, segundo a biografia institucional.",
    "1989 - Disputa a Presidencia da Republica e chega ao segundo turno.",
    "2002 - Eleito Presidente da Republica.",
    "2003 - Posse e inicio do primeiro mandato.",
    "2007 - Inicio do segundo mandato.",
    "2010 - Encerramento do segundo mandato.",
    "2022 - Nova eleicao presidencial.",
    "2023 - Posse para o terceiro mandato."
  ]},
  { title: "03 | Primeiro mandato: 2003-2006", body: [
    "O primeiro mandato foi iniciado em 1 de janeiro de 2003. A documentacao institucional do periodo inclui mensagens presidenciais ao Congresso Nacional e registros administrativos.",
    "Entre os temas recorrentes nas fontes estao economia, politicas sociais, educacao, saude, infraestrutura e relacoes internacionais. Resultados e interpretacoes devem ser analisados separadamente, com apoio de estatisticas e estudos independentes."
  ]},
  { title: "04 | Segundo mandato: 2007-2010", body: [
    "O segundo mandato teve inicio em 1 de janeiro de 2007 e terminou em 31 de dezembro de 2010. A Biblioteca da Presidencia disponibiliza mensagens presidenciais e documentos produzidos durante o periodo.",
    "Esses registros permitem acompanhar prioridades declaradas, justificativas de politicas e a agenda institucional. Para avaliar efeitos, recomenda-se consultar dados e pesquisas de outras fontes."
  ]},
  { title: "05 | Terceiro mandato: desde 2023", body: [
    "Luiz Inacio Lula da Silva tomou posse para um terceiro mandato em 1 de janeiro de 2023. A Presidencia mantem agenda oficial, atos normativos, noticias, discursos e outros registros publicos.",
    "Esta edicao trata o terceiro mandato como um capitulo atualizavel. Cada nova versao deve registrar a data de corte das informacoes."
  ]},
  { title: "06 | Temas para consulta", body: [
    "Economia: politica economica, inflacao, emprego, renda e atividade economica.",
    "Educacao: programas, investimentos e politicas educacionais.",
    "Saude: sistema de saude, programas federais e medidas governamentais.",
    "Infraestrutura: obras, investimentos e projetos estruturantes.",
    "Assistencia social: programas de transferencia de renda e protecao social.",
    "Meio ambiente: politicas ambientais, Amazonia, energia e compromissos internacionais.",
    "Relacoes internacionais: agenda externa, viagens, cupulas e acordos.",
    "Controversias: investigacoes, disputas e acontecimentos que exigem consulta a fontes."
  ]},
  { title: "07 | Controversias e leitura critica", body: [
    "Controversias politicas podem envolver investigacoes, decisoes judiciais, disputas partidarias, alegacoes publicas e interpretacoes divergentes.",
    "Uma leitura responsavel exige identificar quem fez a afirmacao, qual documento a sustenta, em que data ocorreu, qual foi o resultado institucional ou judicial e se houve contestacao.",
    "O objetivo deste material e fornecer um ponto de partida documental, nao substituir a pesquisa individual."
  ]},
  { title: "08 | Fontes principais", body: [
    "Secretaria-Geral da Presidencia - Biografia completa",
    "https://www.gov.br/secretariageral/pt-br/centrais-de-conteudo/biblioteca-da-pr/galeria-dos-ex-presidentes/luiz-inacio-lula-da-silva/biografia-completa",
    "Secretaria-Geral da Presidencia - Dados do ex-Presidente",
    "https://www.gov.br/secretariageral/pt-br/centrais-de-conteudo/biblioteca-da-pr/galeria-dos-ex-presidentes/luiz-inacio-lula-da-silva",
    "Biblioteca da Presidencia - Acervo",
    "https://biblioteca.presidencia.gov.br/presidencia/ex-presidentes/luiz-inacio-lula-da-silva/biografia",
    "Arquivo Nacional - Centro de Referencia",
    "https://presidentes.an.gov.br/index.php/centro-de-referencia-de-acervos-presidenciais/assuntos/biografias/204-luiz-inacio-lula-da-silva"
  ]}
];

function wrap(text: string, width = 90) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? line + " " + word : word;
    if (next.length > width && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function esc(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export function buildEbookPdf() {
  const objects: string[] = [];
  const add = (value: string) => { objects.push(value); return objects.length; };
  const pagesId = add("");
  const fontId = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  const kids: number[] = [];

  pages.forEach((page, index) => {
    const ops = [
      "q", "0.035 0.047 0.063 rg", "0 0 595 842 re f", "Q",
      "BT", "/F1 22 Tf", "0.83 0.68 0.30 rg", "1 0 0 1 54 770 Tm", "(" + esc(page.title) + ") Tj",
      "/F1 9 Tf", "0.82 0.83 0.85 rg"
    ];
    let y = 742;
    for (const paragraph of page.body) {
      for (const line of wrap(paragraph)) {
        ops.push("1 0 0 1 54 " + y + " Tm", "(" + esc(line) + ") Tj");
        y -= 14;
        if (y < 70) break;
      }
      y -= 10;
      if (y < 70) break;
    }
    ops.push("/F1 7 Tf", "0.40 0.43 0.46 rg", "1 0 0 1 54 28 Tm", "(Arquivo Lula | Edicao digital) Tj", "1 0 0 1 525 28 Tm", "(" + (index + 1) + ") Tj", "ET");
    const stream = ops.join("\n") + "\n";
    const streamId = add("<< /Length " + stream.length + " >>\nstream\n" + stream + "endstream");
    kids.push(add("<< /Type /Page /Parent " + pagesId + " 0 R /MediaBox [0 0 " + WIDTH + " " + HEIGHT + "] /Resources << /Font << /F1 " + fontId + " 0 R >> >> /Contents " + streamId + " 0 R >>"));
  });

  objects[pagesId - 1] = "<< /Type /Pages /Count " + kids.length + " /Kids [" + kids.map((id) => id + " 0 R").join(" ") + "] >>";
  const catalogId = add("<< /Type /Catalog /Pages " + pagesId + " 0 R >>");

  let pdf = "%PDF-1.4\n%\xE2\xE3\xCF\xD3\n";
  const offsets = [0];
  for (let i = 0; i < objects.length; i += 1) {
    offsets.push(pdf.length);
    pdf += (i + 1) + " 0 obj\n" + objects[i] + "\nendobj\n";
  }
  const xref = pdf.length;
  pdf += "xref\n0 " + (objects.length + 1) + "\n0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i += 1) pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  pdf += "trailer\n<< /Size " + (objects.length + 1) + " /Root " + catalogId + " 0 R >>\nstartxref\n" + xref + "\n%%EOF";
  return new TextEncoder().encode(pdf);
}
