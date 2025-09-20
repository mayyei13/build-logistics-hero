import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Package, 
  ClipboardList, 
  Truck, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Menu,
  LogOut,
  Settings,
  Home
} from "lucide-react";

interface NavigationProps {
  userRole: 'admin' | 'almacen' | 'gerente';
  userName: string;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Navigation({ userRole, userName, onNavigate, currentPage }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'pedidos', label: 'Pedidos', icon: ClipboardList },
    ];

    const roleItems = {
      admin: [
        { id: 'productos', label: 'Productos', icon: Package },
      ],
      almacen: [
        { id: 'productos', label: 'Inventario', icon: Package },
        { id: 'guias', label: 'Guías de Salida', icon: Truck },
        { id: 'compras', label: 'Órdenes de Compra', icon: ShoppingCart },
      ],
      gerente: [
        { id: 'productos', label: 'Inventario', icon: Package },
        { id: 'guias', label: 'Guías de Salida', icon: Truck },
        { id: 'compras', label: 'Órdenes de Compra', icon: ShoppingCart },
        { id: 'proveedores', label: 'Proveedores', icon: Users },
        { id: 'reportes', label: 'Reportes', icon: BarChart3 },
        { id: 'usuarios', label: 'Usuarios', icon: Settings },
      ]
    };

    return [...commonItems, ...roleItems[userRole]];
  };

  const menuItems = getMenuItems();

  const NavigationContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold text-primary">AlmacénPro</h2>
        <p className="text-sm text-muted-foreground mt-1">Sistema de Gestión</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Button
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">
                  {userRole === 'admin' ? 'Admin. de Obra' : 
                   userRole === 'almacen' ? 'Enc. de Almacén' : 'Gerente'}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-card border-r border-border">
          <NavigationContent />
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-card">
          <h1 className="text-lg font-semibold text-primary">AlmacénPro</h1>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <NavigationContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}