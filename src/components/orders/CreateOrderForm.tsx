import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  AlertTriangle,
  CheckCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateOrderFormProps {
  onNavigate: (page: string) => void;
  userRole: 'admin' | 'almacen' | 'gerente';
}

interface OrderLine {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  subtotal: number;
  availableStock: number;
}

const mockProducts = [
  { id: "1", name: "Cemento Portland 50kg", sku: "CEM-001", price: 185.50, stock: 120 },
  { id: "2", name: "Arena Fina m³", sku: "ARE-001", price: 650.00, stock: 45 },
  { id: "3", name: "Grava 3/4 m³", sku: "GRA-001", price: 720.00, stock: 32 },
  { id: "4", name: "Varilla 1/2 6m", sku: "VAR-001", price: 145.75, stock: 8 },
  { id: "5", name: "Block 15x20x40", sku: "BLO-001", price: 12.50, stock: 850 }
];

const mockObras = [
  { id: "1", name: "Torre Central" },
  { id: "2", name: "Residencial Norte" },
  { id: "3", name: "Plaza Comercial" }
];

export default function CreateOrderForm({ onNavigate, userRole }: CreateOrderFormProps) {
  const { toast } = useToast();
  const [selectedObra, setSelectedObra] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addOrderLine = () => {
    const newLine: OrderLine = {
      id: Date.now().toString(),
      productId: "",
      productName: "",
      sku: "",
      quantity: 1,
      price: 0,
      subtotal: 0,
      availableStock: 0
    };
    setOrderLines([...orderLines, newLine]);
  };

  const updateOrderLine = (lineId: string, field: keyof OrderLine, value: any) => {
    setOrderLines(lines => 
      lines.map(line => {
        if (line.id === lineId) {
          const updatedLine = { ...line, [field]: value };
          
          if (field === 'productId') {
            const product = mockProducts.find(p => p.id === value);
            if (product) {
              updatedLine.productName = product.name;
              updatedLine.sku = product.sku;
              updatedLine.price = product.price;
              updatedLine.availableStock = product.stock;
            }
          }
          
          if (field === 'quantity' || field === 'price') {
            updatedLine.subtotal = updatedLine.quantity * updatedLine.price;
          }
          
          return updatedLine;
        }
        return line;
      })
    );
  };

  const removeOrderLine = (lineId: string) => {
    setOrderLines(lines => lines.filter(line => line.id !== lineId));
  };

  const getTotalAmount = () => {
    return orderLines.reduce((total, line) => total + line.subtotal, 0);
  };

  const getStockIssues = () => {
    return orderLines.filter(line => line.quantity > line.availableStock && line.productId);
  };

  const handleSubmit = async () => {
    if (!selectedObra || orderLines.length === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar una obra y agregar al menos un producto",
        variant: "destructive"
      });
      return;
    }

    const invalidLines = orderLines.filter(line => !line.productId || line.quantity <= 0);
    if (invalidLines.length > 0) {
      toast({
        title: "Error", 
        description: "Todas las líneas deben tener un producto y cantidad válida",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const stockIssues = getStockIssues();
    
    if (stockIssues.length > 0) {
      toast({
        title: "Orden de Compra Generada",
        description: `Se generó la orden de compra #OC-2024-${Math.floor(Math.random() * 1000)} debido a stock insuficiente`,
        variant: "default"
      });
    } else {
      toast({
        title: "Pedido Registrado",
        description: `Pedido #PED-2024-${Math.floor(Math.random() * 1000)} creado y guía de salida generada`,
        variant: "default"
      });
    }

    setIsLoading(false);
    setTimeout(() => onNavigate('pedidos'), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => onNavigate('pedidos')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <h1 className="text-3xl font-bold">Nuevo Pedido</h1>
      </div>

      {/* General Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="obra">Obra</Label>
              <Select value={selectedObra} onValueChange={setSelectedObra}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar obra" />
                </SelectTrigger>
                <SelectContent>
                  {mockObras.map(obra => (
                    <SelectItem key={obra.id} value={obra.id}>
                      {obra.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={new Date().toISOString().split('T')[0]}
                readOnly
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              placeholder="Comentarios adicionales..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Order Lines */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Productos</CardTitle>
            <Button onClick={addOrderLine}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Producto
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {orderLines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay productos agregados. Haga clic en "Agregar Producto" para comenzar.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderLines.map((line) => (
                    <TableRow key={line.id}>
                      <TableCell>
                        <Select 
                          value={line.productId} 
                          onValueChange={(value) => updateOrderLine(line.id, 'productId', value)}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Seleccionar producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockProducts.map(product => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{line.sku}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={line.quantity}
                          onChange={(e) => updateOrderLine(line.id, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>${line.price.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">${line.subtotal.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{line.availableStock}</span>
                          {line.quantity > line.availableStock && line.productId && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Insuficiente
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOrderLine(line.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {orderLines.length > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total del Pedido:</span>
                <span>${getTotalAmount().toFixed(2)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alerts */}
      {getStockIssues().length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Hay {getStockIssues().length} producto(s) con stock insuficiente. 
            Se generará una orden de compra para estos productos.
          </AlertDescription>
        </Alert>
      )}

      {orderLines.length > 0 && getStockIssues().length === 0 && (
        <Alert className="border-success bg-success/10">
          <CheckCircle className="h-4 w-4 text-success" />
          <AlertDescription className="text-success-foreground">
            Todos los productos tienen stock disponible. Se generará la guía de salida automáticamente.
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={handleSubmit} disabled={isLoading || orderLines.length === 0}>
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Procesando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Registrar Pedido
            </>
          )}
        </Button>
        
        <Button variant="outline" onClick={() => onNavigate('pedidos')}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}