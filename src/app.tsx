import useAsset from "ultra/hooks/use-asset.js";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const HomePage = lazy(() => import("./pages/Home.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const DefaultLayout = lazy(() => import("./layouts/DefaultLayout.tsx"));

const App: React.FC = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Ultra</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={useAsset("/favicon.ico")} />
        <link rel="stylesheet" href={useAsset("/style.css")} />
      </head>
      <body>
        <Suspense>
          <Routes>
              <Route path="/" element={<DefaultLayout />}>
                <Route index element={<HomePage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
          </Routes>
        </Suspense>
      </body>
    </html>
  );
}

export default App;
