import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-site text-white grid place-items-center px-6">
      <div className="max-w-md text-center">
        <span className="eyebrow">Arquivo Lula</span>
        <h1 className="mt-4 text-6xl font-bold tracking-tight">404</h1>
        <p className="mt-4 text-zinc-400">Esta página não existe ou foi movida.</p>
        <Link to="/" className="btn btn-primary mt-7">Voltar ao início</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, { boundary: "root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen bg-site text-white grid place-items-center px-6">
      <div className="max-w-lg text-center">
        <span className="eyebrow">Arquivo Lula</span>
        <h1 className="mt-4 text-2xl font-semibold">Não foi possível carregar a página</h1>
        <p className="mt-3 text-zinc-400">Ocorreu um erro inesperado. Tente novamente ou volte ao início.</p>
        <div className="mt-7 flex justify-center gap-3">
          <button className="btn btn-primary" onClick={() => { router.invalidate(); reset(); }}>
            Tentar novamente
          </button>
          <Link to="/" className="btn btn-secondary">Início</Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "Arquivo Lula | Trajetória, governos e acontecimentos" },
      {
        name: "description",
        content: "Portal informativo sobre a trajetória política de Luiz Inácio Lula da Silva, seus governos, acontecimentos, temas e fontes.",
      },
      { name: "author", content: "Arquivo Lula" },
      { property: "og:title", content: "Arquivo Lula | Trajetória, governos e acontecimentos" },
      {
        property: "og:description",
        content: "Uma experiência editorial para navegar pela trajetória, governos, temas e referências relacionadas a Lula.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
