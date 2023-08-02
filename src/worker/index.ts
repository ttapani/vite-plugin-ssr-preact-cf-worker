import type {
  ExportedHandler,
  Request as CfRequest,
  Response as CfResponse,
} from "@cloudflare/workers-types";
import { handleSsr } from "./ssr";
import { handleStaticAssets } from "./static-assets";

async function handleFetchEvent(
  request: CfRequest,
  env: unknown,
  ctx: ExecutionContext
): Promise<CfResponse> {
  if (!isAssetUrl(request.url)) {
    const response = await handleSsr(request.url);
    if (response !== null) return response;
  }
  const response = await handleStaticAssets(request, env, ctx);
  return response;
}

function isAssetUrl(url: string) {
  const { pathname } = new URL(url);
  return pathname.startsWith("/assets/");
}

const handler: ExportedHandler = {
  async fetch(request, env, ctx) {
    try {
      return await handleFetchEvent(request, env, ctx);
    } catch (e) {
      console.warn(e);
      return new Response("Internal Error", { status: 500 });
    }
  },
};

export default handler;
