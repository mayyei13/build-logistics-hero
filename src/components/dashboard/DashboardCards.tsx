import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ClipboardList, 
  Package, 
  AlertTriangle, 
  TrendingUp,
  Plus,
  Eye
} from "lucide-react";

interface DashboardCardsProps {
  userRole: 'admin' | 'almacen' | 'gerente';
  onNavigate: (page: string) => void;
}

export default function DashboardCards({ userRole, onNavigate }: DashboardCardsProps) {
  const adminCards = [
    {
      title: "Mis Pedidos Recientes",
      value: "12",
      description: "Últimos 7 días",
      icon: ClipboardList,
      color: "text-primary",
      action: () => onNavigate('pedidos')
    },
    {
      title: "En Proceso",
      value: "3",
      description: "Pendientes de entrega",
      icon: Package,
      color: "text-warning",
      action: () => onNavigate('pedidos')
    }
  ];

  const almacenCards = [
    {
      title: "Pedidos Pendientes",
      value: "8",
      description: "Requieren preparación",
      icon: ClipboardList,
      color: "text-warning",
      action: () => onNavigate('pedidos')
    },
    {
      title: "Listos para Entrega",
      value: "5",
      description: "Guías generadas",
      icon: Package,
      color: "text-success",
      action: () => onNavigate('guias')
    },
    {
      title: "Stock Bajo",
      value: "15",
      description: "Productos críticos",
      icon: AlertTriangle,
      color: "text-destructive",
      action: () => onNavigate('productos')
    }
  ];

  const gerenteCards = [
    {
      title: "Pedidos del Mes",
      value: "142",
      description: "+12% vs mes anterior",
      icon: ClipboardList,
      color: "text-primary",
      action: () => onNavigate('reportes')
    },
    {
      title: "Órdenes de Compra",
      value: "8",
      description: "Pendientes de recepción",
      icon: Package,
      color: "text-warning",
      action: () => onNavigate('compras')
    },
    {
      title: "Stock Crítico",
      value: "23",
      description: "Productos bajo mínimo",
      icon: AlertTriangle,
      color: "text-destructive",
      action: () => onNavigate('productos')
    },
    {
      title: "Eficiencia",
      value: "94%",
      description: "Entregas a tiempo",
      icon: TrendingUp,
      color: "text-success",
      action: () => onNavigate('reportes')
    }
  ];

  const cards = {
    admin: adminCards,
    almacen: almacenCards,
    gerente: gerenteCards
  }[userRole];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Resumen</h2>
        {userRole === 'admin' && (
          <Button onClick={() => onNavigate('nuevo-pedido')}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Pedido
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2 p-0 h-auto text-xs"
                  onClick={card.action}
                >
                  <Eye className="mr-1 h-3 w-3" />
                  Ver detalles
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Acciones Rápidas</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {userRole === 'admin' && (
            <>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('nuevo-pedido')}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Plus className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-medium">Crear Pedido</h4>
                      <p className="text-sm text-muted-foreground">Solicitar materiales</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('pedidos')}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <ClipboardList className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-medium">Mis Pedidos</h4>
                      <p className="text-sm text-muted-foreground">Ver estado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          
          {userRole === 'almacen' && (
            <>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('guias')}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Package className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-medium">Generar Guías</h4>
                      <p className="text-sm text-muted-foreground">Preparar entregas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('productos')}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-8 w-8 text-warning" />
                    <div>
                      <h4 className="font-medium">Stock Crítico</h4>
                      <p className="text-sm text-muted-foreground">Revisar inventario</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {userRole === 'gerente' && (
            <>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onNavigate('reportes')}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-medium">Reportes</h4>
                      <p className="text-sm text-muted-foreground">Análisis de datos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Actividad Reciente</h3>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Pedido #PED-2024-001 entregado</p>
                  <p className="text-xs text-muted-foreground">Obra: Torre Central - hace 2 horas</p>
                </div>
                <Badge variant="default">Entregado</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Orden de compra #OC-2024-045 generada</p>
                  <p className="text-xs text-muted-foreground">Proveedor: CEMEX - hace 4 horas</p>
                </div>
                <Badge variant="secondary">Enviada</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Stock bajo: Cemento Portland</p>
                  <p className="text-xs text-muted-foreground">Quedan 15 sacos - hace 6 horas</p>
                </div>
                <Badge variant="destructive">Crítico</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}