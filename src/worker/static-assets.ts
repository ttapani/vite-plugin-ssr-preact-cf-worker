import type { Request as CfRequest } from "@cloudflare/workers-types";
import manifestJSON from "__STATIC_CONTENT_MANIFEST";
let manifest = JSON.parse(manifestJSON);
import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

// CF does not seem to export this
type Evt = {
  request: Request;
  waitUntil: (promise: Promise<any>) => void;
};

/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = false;

export async function handleStaticAssets(
  request: CfRequest,
  // We know CF injects `__STATIC_CONTENT` (just like `__STATIC_CONTENT_MANIFEST`), maybe `npx wrangler types` could help?
  env: any,
  ctx: ExecutionContext
) {
  let options: Record<string, any> = {
    ASSET_NAMESPACE: env.__STATIC_CONTENT,
    ASSET_MANIFEST: manifest,
  };

  const event: Evt = {
    request: request as Request,
    waitUntil(promise) {
      return ctx.waitUntil(promise);
    },
  };

  /**
   * You can add custom logic to how we fetch your assets
   * by configuring the function `mapRequestToAsset`
   */
  // options.mapRequestToAsset = handlePrefix(/^\/docs/)

  try {
    if (DEBUG) {
      // Customize caching
      options.cacheControl = {
        bypassCache: true,
      };
    }
    const page = await getAssetFromKV(event, options);

    // Allow headers to be altered
    const response = new Response(page.body, page);

    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "unsafe-url");
    response.headers.set("Feature-Policy", "none");

    return response;
  } catch (e: any) {
    // If an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          ...options,
          mapRequestToAsset: (req) =>
            new Request(`${new URL(req.url).origin}/404.html`, req),
        });

        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 404,
        });
      } catch (e) {}
    }

    return new Response(e.message || e.toString(), { status: 500 });
  }
}
