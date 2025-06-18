import '../styles.css';

import { Route, Routes, Link } from 'react-router-dom';
import InfraBuilder from './infrabuilder/infra-builder';
import Navbar from './components/navbar/navbar';

export function App() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Navbar />
      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}

      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
        <Route
          path="/infra-builder"
          element={<InfraBuilder />}
        />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
