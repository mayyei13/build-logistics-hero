import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  Truck, 
  CheckCircle, 
  MoreHorizontal,
  Plus 
} from "lucide-react";

interface OrdersListProps {
  userRole: 'admin' | 'almacen' | 'gerente';
  onNavigate: (page: string, orderId?: string) => void;
}

const mockOrders = [
  {
    id: "PED-2024-001",
    fecha: "2024-01-15",
    obra: "Torre Central",
    administrador: "Juan Pérez",
    estado: "Entregado",
    total: 15420.50,
    tieneGuia: true
  },
  {
    id: "PED-2024-002", 
    fecha: "2024-01-16",
    obra: "Residencial Norte",
    administrador: "Ana García",
    estado: "En Proceso",
    total: 8750.00,
    tieneGuia: true
  },
  {
    id: "PED-2024-003",
    fecha: "2024-01-16", 
    obra: "Plaza Comercial",
    administrador: "Carlos López",
    estado: "Pendiente",
    total: 22100.75,
    tieneGuia: false
  },
  {
    id: "PED-2024-004",
    fecha: "2024-01-17",
    obra: "Torre Central", 
    administrador: "Juan Pérez",
    estado: "Orden Compra",
    total: 5600.00,
    tieneGuia: false
  }
];

export default function OrdersList({ userRole, onNavigate }: OrdersListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [dateFilter, setDateFilter] = useState("todos");

  const getStatusBadge = (status: string) => {
    const variants = {
      "Pendiente": "secondary",
      "En Proceso": "default", 
      "Entregado": "default",
      "Orden Compra": "destructive"
    } as const;

    const colors = {
      "Pendiente": "bg-warning text-warning-foreground",
      "En Proceso": "bg-primary text-primary-foreground",
      "Entregado": "bg-success text-success-foreground", 
      "Orden Compra": "bg-destructive text-destructive-foreground"
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status}
      </Badge>
    );
  };

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.obra.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.administrador.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todos" || order.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
        {userRole === 'admin' && (
          <Button onClick={() => onNavigate('nuevo-pedido')}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Pedido
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por #pedido, obra o administrador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="En Proceso">En Proceso</SelectItem>
                <SelectItem value="Entregado">Entregado</SelectItem>
                <SelectItem value="Orden Compra">Orden de Compra</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Fecha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las fechas</SelectItem>
                <SelectItem value="hoy">Hoy</SelectItem>
                <SelectItem value="semana">Esta semana</SelectItem>
                <SelectItem value="mes">Este mes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#Pedido</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Obra</TableHead>
                  <TableHead>Administrador</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Guía</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{new Date(order.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>{order.obra}</TableCell>
                    <TableCell>{order.administrador}</TableCell>
                    <TableCell>{getStatusBadge(order.estado)}</TableCell>
                    <TableCell>${order.total.toLocaleString()}</TableCell>
                    <TableCell>
                      {order.tieneGuia ? (
                        <Badge variant="default" className="bg-success text-success-foreground">
                          Sí
                        </Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onNavigate('detalle-pedido', order.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Detalle
                          </DropdownMenuItem>
                          
                          {order.tieneGuia && (
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Ver Guía
                            </DropdownMenuItem>
                          )}
                          
                          {!order.tieneGuia && userRole === 'almacen' && order.estado === 'Pendiente' && (
                            <DropdownMenuItem>
                              <Truck className="mr-2 h-4 w-4" />
                              Generar Guía
                            </DropdownMenuItem>
                          )}
                          
                          {userRole === 'almacen' && order.estado === 'En Proceso' && (
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Marcar Entregado
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}