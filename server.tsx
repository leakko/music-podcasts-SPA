import { serve } from "https://deno.land/std@0.176.0/http/server.ts";
import { type Context, createServer } from "ultra/server.ts";
import App from "./src/app.tsx";

// Twind
import { createHeadInsertionTransformStream } from "ultra/stream.ts";
import { stringify, tw } from "./src/common/twind/twind.ts";

// React Router
import { StaticRouter } from "react-router-dom/server";

// React Helmet Async
import { HelmetProvider } from "react-helmet-async";
import useServerInsertedHTML from "ultra/hooks/use-server-inserted-html.js";

// React Query
import { QueryClientProvider } from "@tanstack/react-query";
import { useDehydrateReactQuery } from "./src/common/react-query/useDehydrateReactQuery.tsx";
import { queryClient } from "./src/common/react-query/query-client.ts";

const server = await createServer({
  importMapPath: import.meta.resolve("./importMap.json"),
  browserEntrypoint: import.meta.resolve("./client.tsx"),
});

// deno-lint-ignore no-explicit-any
const helmetContext: Record<string, any> = {};

function ServerApp({ context }: { context: Context }) {
  useServerInsertedHTML(() => {
    const { helmet } = helmetContext;
    return (
      <>
        {helmet.title.toComponent()}
        {helmet.priority.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        {helmet.script.toComponent()}
      </>
    );
  });

  useDehydrateReactQuery(queryClient);

  const requestUrl = new URL(context.req.url);

  return (
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={new URL(context.req.url).pathname}>
          <App />
        </StaticRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

server.get("*", async (context) => {
  // clear query cache
  queryClient.clear();

  /**
   * Render the request
   */
  let result = await server.render(<ServerApp context={context} />);

  // Inject the style tag into the head of the streamed response
  const stylesInject = createHeadInsertionTransformStream(() => {
    if (Array.isArray(tw.target)) {
      return Promise.resolve(stringify(tw.target));
    }

    throw new Error("Expected tw.target to be an instance of an Array");
  });

  result = result.pipeThrough(stylesInject);

  return context.body(result, 200, {
    "content-type": "text/html; charset=utf-8",
  });
});
if (import.meta.main) {
  serve(server.fetch);
}
export default server;
