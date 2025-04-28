import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompanyProvider } from './context/CompanyContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { EmailPage } from './pages/Email';
import { Customers } from './pages/Customers';
import { CompanyScorer } from './pages/CompanyScorer';
import { useAuth } from './context/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CompanyProvider>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/customers" replace />} />
              <Route
                path="/customers"
                element={
                  <PrivateRoute>
                    <Customers />
                  </PrivateRoute>
                }
              />
              <Route
                path="/leads"
                element={
                  <PrivateRoute>
                    <Leads />
                  </PrivateRoute>
                }
              />
              <Route
                path="/email"
                element={
                  <PrivateRoute>
                    <EmailPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/company-scorer"
                element={
                  <PrivateRoute>
                    <CompanyScorer />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Layout>
        </CompanyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;