import React from 'react';

import { lazy, Suspense } from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom';
// import { ConsoleNavigator } from './console-navigator';
import { ConsoleFallbacker } from './console-fallbacker';


const LazyConsole = lazy(() => import("../layout-console/layout-console").then(({ LayoutConsole: Console }) => ({ default: Console })));

export const Base: React.FC = () => {

  return (
    <div>
      <HashRouter>
        <Routes>
          <Route path="/" element={
            <Suspense fallback={<ConsoleFallbacker />}>
              <LazyConsole />
            </Suspense>
          } />

          {/* ---------- */}
          {/* <Route path="/console" element={
            <Suspense fallback={<ConsoleFallbacker />}>
              <LazyConsole />
            </Suspense>
          } /> */}
          {/* ---------- */}
          {/* <Route path="/" element={
            <ConsoleNavigator />
          } /> */}

        </Routes>
      </HashRouter>
    </div>
  )
}
