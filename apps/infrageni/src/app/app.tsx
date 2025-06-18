import '../styles.css';

import { Route, Routes, Link } from 'react-router-dom';
import InfraBuilder from './infrabuilder/infra-builder';
import Navbar from './components/navbar/navbar';

export function App() {
  return (
    <div className="min-h-screen bg-mesh-light dark:bg-mesh-dark">
      <Navbar />

      {/* Main Content with top padding for fixed navbar */}
      <main className="pt-20">
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] p-4 sm:p-6 md:p-8">
                <div className="glass-card glass-card-hover max-w-md w-full p-4 sm:p-6 md:p-8 text-center">
                  <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Welcome to InfraGeni
                  </h1>
                  <p className="text-black/80 dark:text-white/80 mb-6">
                    This is the generated root route with a beautiful glass morphism design.
                  </p>
                  <Link
                    to="/page-2"
                    className="glass-button glass-button-hover inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg"
                  >
                    Go to Page 2
                  </Link>
                </div>
              </div>
            }
          />
          <Route
            path="/page-2"
            element={
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] p-4 sm:p-6 md:p-8">
                <div className="glass-card glass-card-hover max-w-md w-full p-4 sm:p-6 md:p-8 text-center">
                  <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-primary bg-clip-text text-transparent">
                    Page 2
                  </h1>
                  <p className="text-black/80 dark:text-white/80 mb-6">
                    Another beautiful page with glass morphism styling.
                  </p>
                  <Link
                    to="/"
                    className="glass-button glass-button-hover inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            }
          />
          <Route
            path="/infra-builder"
            element={<InfraBuilder />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
