import { renderPage } from "vite-plugin-ssr/server";

export async function handleSsr(url: string) {
  const pageContextInit = {
    urlOriginal: url,
  };
  const pageContext = await renderPage(pageContextInit);
  const { httpResponse } = pageContext;
  if (!httpResponse) {
    return null;
  } else {
    const { body, statusCode: status } = httpResponse;
    const headers = new Headers({ "content-type": httpResponse.contentType });
    return new Response(body, { headers, status });
  }
}
