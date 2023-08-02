import { render as renderPreact, hydrate } from "preact";
import { PageShell } from "./PageShell";

// Enable client routing
export const clientRouting = true;

export async function render(pageContext: any) {
  const { Page, pageProps } = pageContext;

  const page = (
    <PageShell pageContext={pageContext}>
      <Page {...pageProps} />
    </PageShell>
  );

  const body = document.querySelector("body")!;

  // SPA
  if (body.innerHTML === "" || !pageContext.isHydration) {
    renderPreact(page, body);
    // SSR
  } else {
    hydrate(page, body);
  }
}
