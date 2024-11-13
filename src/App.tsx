// src/App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Loading from './pages/Loading';
import routes from './routes';

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          {routes.map(({ path, element, children }, index) => (
            <Route key={index} path={path} element={element}>
              {children?.map((child, childIndex) => (
                <Route
                  key={childIndex}
                  path={child.path}
                  element={child.element}
                />
              ))}
            </Route>
          ))}
        </Routes>
      </Suspense>
    </Router>
  </AuthProvider>
);

export default App;
