import { createFileRoute } from "@tanstack/react-router";
import { authorizeEbookDownload } from "../../lib/ebook-delivery.functions";
import { buildEbookPdf } from "../../server/ebook-pdf";

export const Route = createFileRoute("/download/ebook")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const token = new URL(request.url).searchParams.get("token") ?? "";
          await authorizeEbookDownload(token);
          return new Response(buildEbookPdf(), {
            status: 200,
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": 'attachment; filename="arquivo-lula-ebook.pdf"',
              "Cache-Control": "private, no-store, max-age=0",
              "X-Content-Type-Options": "nosniff",
            },
          });
        } catch (error) {
          return new Response(error instanceof Error ? error.message : "Link de download inválido.", {
            status: 403,
            headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
          });
        }
      },
    },
  },
});
