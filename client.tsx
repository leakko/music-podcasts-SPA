import hydrate from "ultra/hydrate.js";
import App from "./src/app.tsx";

// React Router
import { BrowserRouter } from "react-router-dom";

import { HelmetProvider } from "react-helmet-async";

// React Query
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/common/react-query/query-client.ts";
declare const __REACT_QUERY_DEHYDRATED_STATE: unknown;

function ClientApp() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={__REACT_QUERY_DEHYDRATED_STATE}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Hydrate>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

hydrate(document, <ClientApp />);
