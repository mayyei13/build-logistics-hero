import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import Navigation from "@/components/layout/Navigation";
import DashboardCards from "@/components/dashboard/DashboardCards";
import OrdersList from "@/components/orders/OrdersList";
import CreateOrderForm from "@/components/orders/CreateOrderForm";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'almacen' | 'gerente'>('admin');
  const [userName, setUserName] = useState('');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (email: string, role: 'admin' | 'almacen' | 'gerente', name: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserName(name);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardCards userRole={userRole} onNavigate={handleNavigate} />;
      case 'pedidos':
        return <OrdersList userRole={userRole} onNavigate={handleNavigate} />;
      case 'nuevo-pedido':
        return <CreateOrderForm userRole={userRole} onNavigate={handleNavigate} />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Página en Desarrollo</h2>
            <p className="text-muted-foreground">Esta funcionalidad estará disponible próximamente.</p>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        userRole={userRole} 
        userName={userName} 
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      
      <main className="md:pl-64 min-h-screen">
        <div className="p-6">
          {renderCurrentPage()}
        </div>
      </main>
    </div>
  );
};

export default Index;
