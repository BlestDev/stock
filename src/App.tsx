import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Clients from './pages/Clients';
import Sales from './pages/Sales';
import Purchases from './pages/Purchases';
import Expenses from './pages/Expenses';
import Movements from './pages/Movements';
import Invoices from './pages/Invoices';
import Resellers from './pages/Resellers';
import Consignments from './pages/Consignments';
import ResellerPayments from './pages/ResellerPayments';
import Categories from './pages/Categories';
import SettingsPage from './pages/Settings';
import Suppliers from './pages/Suppliers';
import ResellerJournal from './pages/ResellerJournal';
import InvoicePrint from './pages/InvoicePrint';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'clients':
        return <Clients />;
      case 'sales':
        return <Sales />;
      case 'purchases':
        return <Purchases />;
      case 'expenses':
        return <Expenses />;
      case 'movements':
        return <Movements />;
      case 'invoices':
        return <Invoices />;
      case 'resellers':
        return <Resellers />;
      case 'consignments':
        return <Consignments />;
      case 'reseller-payments':
        return <ResellerPayments />;
      case 'categories':
        return <Categories />;
      case 'units':
        return <Categories />;
      case 'suppliers':
        return <Suppliers />;
      case 'reseller-journal':
        return <ResellerJournal />;
      case 'invoice-print':
        return <InvoicePrint />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
