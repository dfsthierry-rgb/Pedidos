import React, { useState, useMemo, useEffect } from 'react';
import { Sun, Moon, Edit2, Plus, AlertCircle, Search, X, BarChart2, Clock, Package, Truck, CheckCircle2, ShoppingCart, XCircle, Ban, Hexagon, User } from 'lucide-react';

type ProductionType = 'Interna' | 'Externa';
type InternalStatus = 'Aguardando Máquina' | 'Em Produção' | 'Finalizado';
type ExternalStatus = 'Em Cotação' | 'Comprado' | 'Em Produção' | 'Em Trânsito' | 'Chegando' | 'Entregue';
type AnalysisStatus = 'Não Analisado' | 'Analisado' | 'Solicitada Produção' | 'Solicitada Importação' | 'Cancelado';
type CancelReason = 'Cliente Desistiu pelo Tempo' | 'Preço' | 'Desistência Fornecedor' | 'Pedido Errado';
type Status = InternalStatus | ExternalStatus | 'Cancelado' | 'Aguardando Responsável';

interface Order {
  id: string;
  requestDate: string;
  createdAt: string;
  requestedBy: string;
  salesperson: string;
  customer: string;
  document: string;
  skuCode: string;
  skuDescription: string;
  mesh: string;
  wire: string;
  opening: string;
  edge: string;
  width: string;
  qtyMeters: number;
  stock: number;
  consumptionMonth: number;
  productionType: ProductionType;
  status: Status;
  expectedDelivery: string;
  analysisStatus: AnalysisStatus;
  lastUpdate: string;
  statusUpdatedAt?: string;
  assignedUser: string | null;
  canceledReason?: CancelReason;
  actionStartedAt?: string;
  finishedAt?: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    requestDate: '18/03/2026',
    createdAt: '2026-03-18T08:00:00',
    requestedBy: 'Ana Silva',
    salesperson: 'Carlos Mendes',
    customer: 'Indústria ABC Ltda',
    document: '12.345.678/0001-90',
    skuCode: '00002400',
    skuDescription: 'Tela Inox AISI 316 M50 f35 - 38 mm',
    mesh: 'M50',
    wire: 'f35',
    opening: '38 mm',
    edge: 'Lisa',
    width: '1,00m',
    qtyMeters: 4800,
    stock: 100,
    consumptionMonth: 500,
    productionType: 'Interna',
    status: 'Aguardando Máquina',
    expectedDelivery: '',
    analysisStatus: 'Não Analisado',
    lastUpdate: '2026-03-18T08:00:00',
    statusUpdatedAt: '2026-03-18T08:00:00',
    assignedUser: null,
  },
  {
    id: '2',
    requestDate: '10/03/2026',
    createdAt: '2026-03-10T09:00:00',
    requestedBy: 'Beatriz Souza',
    salesperson: 'Daniel Costa',
    customer: 'Construtora XYZ',
    document: '98.765.432/0001-10',
    skuCode: '00001040',
    skuDescription: 'Tela Inox AISI 304 M14 f0,25mm - Plana - I - 1,00m',
    mesh: 'M14',
    wire: 'f0,25mm',
    opening: 'Plana',
    edge: 'I',
    width: '1,00m',
    qtyMeters: 2500,
    stock: 0,
    consumptionMonth: 1000,
    productionType: 'Externa',
    status: 'Em Cotação',
    expectedDelivery: '2026-05-01',
    analysisStatus: 'Analisado',
    lastUpdate: '2026-03-12T10:00:00',
    statusUpdatedAt: '2026-03-12T10:00:00',
    actionStartedAt: '2026-03-12T10:00:00',
    assignedUser: 'Daniel Fernandes',
  },
  {
    id: '3',
    requestDate: '01/03/2026',
    createdAt: '2026-03-01T14:30:00',
    requestedBy: 'Carla Dias',
    salesperson: 'Eduardo Lima',
    customer: 'Serralheria 123',
    document: '45.123.890/0001-55',
    skuCode: '00001707',
    skuDescription: 'Tela Inox AISI 304 M8 f0,56mm - Plana - I - 1,00m',
    mesh: 'M8',
    wire: 'f0,56mm',
    opening: 'Plana',
    edge: 'I',
    width: '1,00m',
    qtyMeters: 3000,
    stock: 500,
    consumptionMonth: 1500,
    productionType: 'Interna',
    status: 'Finalizado',
    expectedDelivery: '2026-03-15',
    analysisStatus: 'Solicitada Produção',
    lastUpdate: '2026-03-15T16:00:00',
    statusUpdatedAt: '2026-03-15T16:00:00',
    actionStartedAt: '2026-03-02T09:00:00',
    finishedAt: '2026-03-15T16:00:00',
    assignedUser: 'Gabriel',
  },
  {
    id: '4',
    requestDate: '15/03/2026',
    createdAt: '2026-03-15T09:15:00',
    requestedBy: 'Fernanda Alves',
    salesperson: 'Gustavo Rocha',
    customer: 'Filtros & Cia',
    document: '33.444.555/0001-88',
    skuCode: '0051017',
    skuDescription: 'Tecido Inox AISI 304 M40 f0,18mm - Plana - I - 0,025m',
    mesh: 'M40',
    wire: 'f0,18mm',
    opening: 'Plana',
    edge: 'I',
    width: '0,025m',
    qtyMeters: 1500,
    stock: 200,
    consumptionMonth: 300,
    productionType: 'Externa',
    status: 'Cancelado',
    expectedDelivery: '2026-04-10',
    analysisStatus: 'Não Analisado',
    lastUpdate: '2026-03-17T11:00:00',
    statusUpdatedAt: '2026-03-17T11:00:00',
    assignedUser: null,
    canceledReason: 'Cliente Desistiu pelo Tempo',
    finishedAt: '2026-03-17T11:00:00',
  }
];

const INTERNAL_USERS = ['Daniel Francisco', 'Gabriel'];
const EXTERNAL_USERS = ['Daniel Fernandes', 'Ednei Zampese'];

const STATUS_ICONS: Record<string, React.ReactNode> = {
  'Aguardando Responsável': <User className="w-4 h-4" />,
  'Aguardando Máquina': <Clock className="w-4 h-4" />,
  'Em Produção': <BarChart2 className="w-4 h-4" />,
  'Finalizado': <CheckCircle2 className="w-4 h-4" />,
  'Em Cotação': <ShoppingCart className="w-4 h-4" />,
  'Comprado': <Package className="w-4 h-4" />,
  'Em Trânsito': <Truck className="w-4 h-4" />,
  'Chegando': <AlertCircle className="w-4 h-4" />,
  'Entregue': <CheckCircle2 className="w-4 h-4" />,
  'Cancelado': <XCircle className="w-4 h-4" />,
};

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h1>Algo deu errado no App</h1>
          <pre>{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [filterTab, setFilterTab] = useState<'Todas' | 'Interna' | 'Externa' | 'Não Analisado' | 'Cancelado'>('Todas');
  const [filterStatus, setFilterStatus] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [actionModalOrder, setActionModalOrder] = useState<Order | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);

  // Action Modal Form State
  const [actionProductionType, setActionProductionType] = useState<ProductionType>('Interna');
  const [actionStatus, setActionStatus] = useState<string>('');
  const [actionUser, setActionUser] = useState<string>('');
  const [actionAnalysis, setActionAnalysis] = useState<AnalysisStatus>('Não Analisado');
  const [actionExpectedDelivery, setActionExpectedDelivery] = useState<string>('');
  const [actionError, setActionError] = useState<string>('');

  // Theme State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Edit Order State
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [formData, setFormData] = useState<Partial<Order>>({
    requestDate: new Date().toISOString().split('T')[0],
    requestedBy: '',
    salesperson: '',
    customer: '',
    document: '',
    skuCode: '',
    skuDescription: '',
    mesh: '',
    wire: '',
    opening: '',
    edge: '',
    width: '',
    qtyMeters: 0,
    productionType: 'Interna'
  });

  // Cancel Modal Form State
  const [cancelReason, setCancelReason] = useState<CancelReason>('Cliente Desistiu pelo Tempo');

  // Current Date for calculations
  const TODAY = new Date();

  const getMinDeliveryDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysDiff = (startIso: string, endIso?: string) => {
    const start = new Date(startIso);
    const end = endIso ? new Date(endIso) : TODAY;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTimeDiffString = (startIso: string, endIso?: string) => {
    const start = new Date(startIso);
    const end = endIso ? new Date(endIso) : TODAY;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const isDelayed = (order: Order) => {
    if (order.status === 'Cancelado' || order.status === 'Finalizado' || order.status === 'Entregue') return false;
    return getDaysDiff(order.statusUpdatedAt || order.lastUpdate) > 2;
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      let matchTab = false;
      if (filterTab === 'Todas') matchTab = true;
      else if (filterTab === 'Interna') matchTab = order.productionType === 'Interna';
      else if (filterTab === 'Externa') matchTab = order.productionType === 'Externa';
      else if (filterTab === 'Não Analisado') matchTab = order.analysisStatus === 'Não Analisado';
      else if (filterTab === 'Cancelado') matchTab = order.status === 'Cancelado';

      const matchStatus = filterStatus === 'Todos' || order.status === filterStatus;
      const matchSearch = order.skuCode.includes(searchTerm) || 
                          order.skuDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.document.includes(searchTerm);
      return matchTab && matchStatus && matchSearch;
    });
  }, [orders, filterTab, filterStatus, searchTerm]);

  const summary = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach(order => {
      let matchTab = false;
      if (filterTab === 'Todas') matchTab = true;
      else if (filterTab === 'Interna') matchTab = order.productionType === 'Interna';
      else if (filterTab === 'Externa') matchTab = order.productionType === 'Externa';
      else if (filterTab === 'Não Analisado') matchTab = order.analysisStatus === 'Não Analisado';
      else if (filterTab === 'Cancelado') matchTab = order.status === 'Cancelado';

      if (matchTab) {
        counts[order.status] = (counts[order.status] || 0) + 1;
      }
    });
    return counts;
  }, [orders, filterTab]);

  const availableStatuses = filterTab === 'Interna' 
    ? ['Aguardando Responsável', 'Aguardando Máquina', 'Em Produção', 'Finalizado', 'Cancelado']
    : filterTab === 'Externa'
    ? ['Aguardando Responsável', 'Em Cotação', 'Comprado', 'Em Produção', 'Em Trânsito', 'Chegando', 'Entregue', 'Cancelado']
    : filterTab === 'Cancelado'
    ? ['Cancelado']
    : ['Aguardando Responsável', 'Aguardando Máquina', 'Em Produção', 'Finalizado', 'Em Cotação', 'Comprado', 'Em Trânsito', 'Chegando', 'Entregue', 'Cancelado'];

  const openEditModal = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      requestDate: order.requestDate.split('T')[0],
      requestedBy: order.requestedBy,
      salesperson: order.salesperson,
      customer: order.customer,
      document: order.document,
      skuCode: order.skuCode,
      skuDescription: order.skuDescription,
      mesh: order.mesh,
      wire: order.wire,
      opening: order.opening,
      edge: order.edge,
      width: order.width,
      qtyMeters: order.qtyMeters,
      productionType: order.productionType
    });
    setIsNewOrderModalOpen(true);
  };

  const openNewOrderModal = () => {
    setEditingOrder(null);
    setFormData({
      requestDate: new Date().toISOString().split('T')[0],
      requestedBy: '',
      salesperson: '',
      customer: '',
      document: '',
      skuCode: '',
      skuDescription: '',
      mesh: '',
      wire: '',
      opening: '',
      edge: '',
      width: '',
      qtyMeters: 0,
      productionType: 'Interna'
    });
    setIsNewOrderModalOpen(true);
  };

  const saveOrder = () => {
    if (editingOrder) {
      setOrders(orders.map(o => o.id === editingOrder.id ? { ...o, ...formData } as Order : o));
    } else {
      const newOrder: Order = {
        ...formData,
        id: `PED-${Math.floor(Math.random() * 10000)}`,
        createdAt: new Date().toISOString(),
        stock: 0,
        consumptionMonth: 0,
        status: 'Aguardando Responsável',
        analysisStatus: 'Não Analisado',
        lastUpdate: new Date().toISOString(),
      } as Order;
      setOrders([newOrder, ...orders]);
    }
    setIsNewOrderModalOpen(false);
  };

  const openActionModal = (order: Order) => {
    setActionModalOrder(order);
    setActionProductionType(order.productionType);
    setActionStatus(order.status);
    setActionUser(order.assignedUser || '');
    setActionAnalysis(order.analysisStatus);
    setActionExpectedDelivery(order.expectedDelivery || '');
    setActionError('');
  };

  const saveAction = () => {
    if (!actionModalOrder) return;
    
    const hasStartedAnalysis = actionAnalysis !== 'Não Analisado' || actionStatus !== 'Aguardando Responsável';
    if (hasStartedAnalysis && !actionExpectedDelivery) {
      setActionError('É obrigatório informar a Data Prevista de Entrega ao iniciar a análise ou alterar o status.');
      return;
    }

    if (actionExpectedDelivery && actionExpectedDelivery !== actionModalOrder.expectedDelivery) {
      const minDate = getMinDeliveryDate();
      if (actionExpectedDelivery < minDate) {
        setActionError('A Data Prevista de Entrega deve ser posterior a hoje.');
        return;
      }
    }
    
    const isFinished = actionStatus === 'Finalizado' || actionStatus === 'Entregue' || actionStatus === 'Cancelado';
    
    setOrders(orders.map(o => {
      if (o.id === actionModalOrder.id) {
        const statusChanged = o.status !== actionStatus;
        return {
          ...o,
          productionType: actionProductionType,
          status: actionStatus as Status,
          assignedUser: actionUser || null,
          analysisStatus: actionAnalysis,
          expectedDelivery: actionExpectedDelivery,
          lastUpdate: TODAY.toISOString(),
          statusUpdatedAt: statusChanged ? TODAY.toISOString() : (o.statusUpdatedAt || o.lastUpdate),
          actionStartedAt: o.actionStartedAt || (actionUser ? TODAY.toISOString() : undefined),
          finishedAt: isFinished ? (o.finishedAt || TODAY.toISOString()) : undefined
        };
      }
      return o;
    }));
    setActionModalOrder(null);
  };

  const saveCancel = () => {
    if (!cancelModalOrder) return;
    setOrders(orders.map(o => {
      if (o.id === cancelModalOrder.id) {
        return {
          ...o,
          status: 'Cancelado',
          analysisStatus: 'Cancelado',
          canceledReason: cancelReason,
          lastUpdate: TODAY.toISOString(),
          statusUpdatedAt: TODAY.toISOString(),
          finishedAt: TODAY.toISOString()
        };
      }
      return o;
    }));
    setCancelModalOrder(null);
  };

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-bg-main text-text-muted font-sans selection:bg-blue-500/30 transition-colors duration-200">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-bg-main border-b border-border-color transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 bg-yellow-500/10 rounded-xl border border-yellow-500/20 overflow-hidden">
            <img 
              src="./logo.svg"
              alt="BeeMesh Logo" 
              className="w-6 h-6 object-contain relative z-10"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
            <Hexagon className="w-6 h-6 text-yellow-500 absolute hidden" />
          </div>
          <h1 className="text-xl font-bold text-text-main tracking-wide">Bee Mesh System</h1>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTheme}
            className="text-text-faint hover:text-yellow-500 transition-colors"
            title={theme === 'dark' ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-slate-900 font-bold text-sm">
            DA
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6 max-w-[100vw] overflow-hidden">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-text-main">Solicitações Produção / Compras</h2>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Buscar SKU, Cliente, CNPJ..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-bg-card border border-border-light/50 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 w-64 placeholder:text-slate-600"
              />
            </div>
            
            <div className="flex items-center bg-bg-card border border-border-light/50 rounded-md p-1">
              <button 
                onClick={() => { setFilterTab('Todas'); setFilterStatus('Todos'); }}
                className={`px-3 py-1.5 text-sm rounded ${filterTab === 'Todas' ? 'bg-border-color text-text-main' : 'text-text-faint hover:text-slate-200'}`}
              >
                Todas
              </button>
              <button 
                onClick={() => { setFilterTab('Interna'); setFilterStatus('Todos'); }}
                className={`px-3 py-1.5 text-sm rounded ${filterTab === 'Interna' ? 'bg-border-color text-text-main' : 'text-text-faint hover:text-slate-200'}`}
              >
                Interna
              </button>
              <button 
                onClick={() => { setFilterTab('Externa'); setFilterStatus('Todos'); }}
                className={`px-3 py-1.5 text-sm rounded ${filterTab === 'Externa' ? 'bg-border-color text-text-main' : 'text-text-faint hover:text-slate-200'}`}
              >
                Externa
              </button>
              <button 
                onClick={() => { setFilterTab('Não Analisado'); setFilterStatus('Todos'); }}
                className={`px-3 py-1.5 text-sm rounded ${filterTab === 'Não Analisado' ? 'bg-border-color text-text-main' : 'text-text-faint hover:text-slate-200'}`}
              >
                Não Analisado
              </button>
              <button 
                onClick={() => { setFilterTab('Cancelado'); setFilterStatus('Todos'); }}
                className={`px-3 py-1.5 text-sm rounded ${filterTab === 'Cancelado' ? 'bg-border-color text-text-main' : 'text-text-faint hover:text-slate-200'}`}
              >
                Cancelado
              </button>
            </div>

            <button 
              onClick={() => setIsNewOrderModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Pedido
            </button>
          </div>
        </div>

        {/* Process Summary */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-text-faint mb-3 uppercase tracking-wider">Resumo do Processo (Filtro Rápido)</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterStatus('Todos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                filterStatus === 'Todos' 
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                  : 'bg-bg-card border-border-color/60 text-text-faint hover:border-slate-600'
              }`}
            >
              <span className="font-medium">Todos</span>
              <span className="bg-border-color/80 px-2 py-0.5 rounded-full text-xs">
                {orders.filter(order => {
                  if (filterTab === 'Todas') return true;
                  if (filterTab === 'Interna') return order.productionType === 'Interna';
                  if (filterTab === 'Externa') return order.productionType === 'Externa';
                  if (filterTab === 'Não Analisado') return order.analysisStatus === 'Não Analisado';
                  if (filterTab === 'Cancelado') return order.status === 'Cancelado';
                  return false;
                }).length}
              </span>
            </button>

            {availableStatuses.map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  filterStatus === status 
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                    : 'bg-bg-card border-border-color/60 text-text-faint hover:border-slate-600'
                }`}
              >
                {STATUS_ICONS[status]}
                <span className="font-medium">{status}</span>
                <span className="bg-border-color/80 px-2 py-0.5 rounded-full text-xs">
                  {summary[status] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-bg-main border border-border-color/60 rounded-lg overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-faint uppercase bg-bg-card/50 border-b border-border-color/60">
                <tr>
                  <th className="px-4 py-4 font-medium whitespace-nowrap w-[140px] min-w-[140px] sticky left-0 bg-bg-card z-20 border-r border-border-color/60">Data Solicitação</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap w-[160px] min-w-[160px] sticky left-[140px] bg-bg-card z-20 border-r border-border-color/60">Solicitado por</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap w-[160px] min-w-[160px] sticky left-[300px] bg-bg-card z-20 border-r border-border-color/60">Vendedor</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap w-[200px] min-w-[200px] sticky left-[460px] bg-bg-card z-20 border-r border-border-color/60 shadow-[4px_0_12px_rgba(0,0,0,0.3)]">Cliente</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap">CNPJ/CPF</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap">Código SKU</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap min-w-[250px]">Descrição SKU</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap">Malha</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap">Fio</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap">Abertura</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap">Borda</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap">Largura</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap text-right">Qtde (m)</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap text-right">Estoque</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap text-right">Consumo/Mês</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap">Produção</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap">Status</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap">Prev. Entrega</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap min-w-[220px]">Status Análise & Tempos</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap">Responsável (Ação)</th>
                  <th className="px-4 py-4 font-medium whitespace-nowrap text-center sticky right-0 bg-bg-card/90 backdrop-blur-sm border-l border-border-color/60">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.map((order) => {
                  const delayed = isDelayed(order);
                  const totalTime = getTimeDiffString(order.createdAt, order.finishedAt);
                  const phaseTime = getTimeDiffString(order.statusUpdatedAt || order.lastUpdate, order.finishedAt);
                  const actionTime = order.actionStartedAt ? getTimeDiffString(order.actionStartedAt, order.finishedAt) : '0d 0h';
                  const forecastDays = order.expectedDelivery ? getDaysDiff(order.createdAt, order.expectedDelivery) : null;
                  
                  return (
                    <tr key={order.id} className={`hover:bg-bg-card/40 transition-colors group ${order.status === 'Cancelado' ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-3 whitespace-nowrap text-text-muted w-[140px] min-w-[140px] sticky left-0 bg-bg-main group-hover:bg-bg-card z-10 transition-colors border-r border-border-color/60">{order.requestDate}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-text-muted w-[160px] min-w-[160px] sticky left-[140px] bg-bg-main group-hover:bg-bg-card z-10 transition-colors border-r border-border-color/60">{order.requestedBy}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-text-faint w-[160px] min-w-[160px] sticky left-[300px] bg-bg-main group-hover:bg-bg-card z-10 transition-colors border-r border-border-color/60">{order.salesperson}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-200 w-[200px] min-w-[200px] sticky left-[460px] bg-bg-main group-hover:bg-bg-card z-10 transition-colors border-r border-border-color/60 shadow-[4px_0_12px_rgba(0,0,0,0.3)]">{order.customer}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-text-faint">{order.document}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-text-faint">{order.skuCode}</td>
                      <td className="px-4 py-3 text-text-muted truncate max-w-[250px]" title={order.skuDescription}>{order.skuDescription}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-text-faint">{order.mesh}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-text-faint">{order.wire}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-text-faint">{order.opening}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-text-faint">{order.edge}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-text-faint">{order.width}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right font-medium text-slate-200">{order.qtyMeters.toLocaleString('pt-BR')}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-text-faint">{order.stock.toLocaleString('pt-BR')}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-text-faint">{order.consumptionMonth.toLocaleString('pt-BR')}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          order.productionType === 'Interna' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {order.productionType}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-text-muted">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className={order.status === 'Cancelado' ? 'text-red-500' : 'text-slate-500'}>
                              {STATUS_ICONS[order.status]}
                            </span>
                            <span className={order.status === 'Cancelado' ? 'text-red-400 font-medium' : ''}>
                              {order.status}
                            </span>
                          </div>
                          {order.status === 'Cancelado' && order.canceledReason && (
                            <span className="text-[10px] text-red-400/80 uppercase tracking-wider">
                              Motivo: {order.canceledReason}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-text-muted">
                        {order.expectedDelivery ? (
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{formatDate(order.expectedDelivery)}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-slate-500">Prazo Total:</span>
                              <strong className="text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/30 shadow-[0_0_8px_rgba(251,191,36,0.25)] px-1.5 py-0.5 rounded">{forecastDays}d</strong>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-600 italic">A definir</span>
                        )}
                      </td>
                      <td className={`px-4 py-3 whitespace-nowrap transition-colors ${delayed ? 'bg-red-500/5' : ''}`}>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${delayed ? 'text-red-400' : 'text-text-muted'}`}>
                              {order.analysisStatus}
                            </span>
                            {delayed && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-500 border border-red-500/30">
                                <AlertCircle className="w-3 h-3" />
                                Necessita Ação
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1 text-[11px] text-text-faint bg-bg-main p-2 rounded border border-border-color/50 w-full max-w-[220px]">
                            <div className="flex justify-between items-center">
                              <span>Total (desde solicitação):</span>
                              <strong className="text-amber-400 bg-amber-400/10 border border-amber-400/30 shadow-[0_0_8px_rgba(251,191,36,0.25)] px-1.5 py-0.5 rounded">{totalTime}</strong>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>No Status Atual:</span>
                              <strong className="text-amber-400 bg-amber-400/10 border border-amber-400/30 shadow-[0_0_8px_rgba(251,191,36,0.25)] px-1.5 py-0.5 rounded">{phaseTime}</strong>
                            </div>
                            {order.actionStartedAt && (
                              <div className="flex justify-between items-center">
                                <span>Tempo de Ação:</span>
                                <strong className="text-amber-400 bg-amber-400/10 border border-amber-400/30 shadow-[0_0_8px_rgba(251,191,36,0.25)] px-1.5 py-0.5 rounded">{actionTime}</strong>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-blue-400">
                        {order.assignedUser ? order.assignedUser : <span className="text-slate-600 italic">Não atribuído</span>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center sticky right-0 bg-bg-main group-hover:bg-bg-card transition-colors border-l border-border-color/60">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => openEditModal(order)}
                            className="text-slate-500 hover:text-green-400 transition-colors mr-3" 
                            title="Editar Pedido"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openActionModal(order)}
                            className="text-slate-500 hover:text-blue-400 transition-colors" 
                            title="Ações / Editar Status"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {order.status !== 'Cancelado' && (
                            <button 
                              onClick={() => setCancelModalOrder(order)}
                              className="text-slate-500 hover:text-red-400 transition-colors" 
                              title="Cancelar Solicitação"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={21} className="px-4 py-8 text-center text-slate-500">
                      Nenhum pedido encontrado com os filtros atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* New Order Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card border border-border-light rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-color">
              <h3 className="text-lg font-semibold text-text-main">Nova Solicitação de Pedido Especial</h3>
              <button onClick={() => setIsNewOrderModalOpen(false)} className="text-text-faint hover:text-text-main transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                {/* Section 1: Dados do Cliente */}
                <div className="md:col-span-3 pb-2 border-b border-border-color">
                  <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Dados do Cliente & Solicitação</h4>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-faint">Data Solicitação</label>
                  <input type="date" className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-blue-500" value={formData.requestDate} onChange={e => setFormData({...formData, requestDate: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-faint">Solicitado por</label>
                  <select className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-blue-500" value={formData.requestedBy} onChange={e => setFormData({...formData, requestedBy: e.target.value})}><option value="">Selecione...</option><option value="Débora">Débora</option><option value="Inaê">Inaê</option></select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-faint">Vendedor</label>
                  <input type="text" className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-blue-500" placeholder="Nome do vendedor" value={formData.salesperson} onChange={e => setFormData({...formData, salesperson: e.target.value})} />
                </div>
                
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-text-faint">Cliente</label>
                  <input type="text" className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-blue-500" placeholder="Razão Social / Nome" value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-faint">CNPJ / CPF</label>
                  <input type="text" className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-blue-500" placeholder="00.000.000/0000-00" value={formData.document} onChange={e => setFormData({...formData, document: e.target.value})} />
                </div>

                {/* Section 2: Dados do Produto */}
                <div className="md:col-span-3 pb-2 pt-4 border-b border-border-color">
                  <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Especificações do Produto (SKU)</h4>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-faint">Código SKU</label>
                  <input type="text" className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-blue-500" placeholder="Ex: 00002400" value={formData.skuCode} onChange={e => setFormData({...formData, skuCode: e.target.value})} />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-medium text-text-faint">Descrição SKU</label>
                  <input type="text" className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-blue-500" placeholder="Descrição completa do produto" value={formData.skuDescription} onChange={e => setFormData({...formData, skuDescription: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-faint">Malha</label>
                  <input type="text" className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-blue-500" placeholder="Ex: M50" value={formData.mesh} onChange={e => setFormData({...formData, mesh: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-faint">Fio</label>
                  <input type="text" className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-blue-500" placeholder="Ex: f35" value={formData.wire} onChange={e => setFormData({...formData, wire: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-faint">Abertura</label>
                  <input type="text" className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-blue-500" placeholder="Ex: 38 mm" value={formData.opening} onChange={e => setFormData({...formData, opening: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-faint">Borda</label>
                  <input type="text" className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-blue-500" placeholder="Ex: Lisa" value={formData.edge} onChange={e => setFormData({...formData, edge: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-faint">Largura</label>
                  <input type="text" className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-blue-500" placeholder="Ex: 1,00m" value={formData.width} onChange={e => setFormData({...formData, width: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-faint">Quantidade (Metros)</label>
                  <input type="number" className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-blue-500" placeholder="0" value={formData.qtyMeters} onChange={e => setFormData({...formData, qtyMeters: Number(e.target.value)})} />
                </div>

                {/* Section 3: Produção (Apenas Filtro) */}
                <div className="md:col-span-3 pb-2 pt-4 border-b border-border-color">
                  <h4 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Direcionamento</h4>
                </div>

                <div className="space-y-1.5 md:col-span-1">
                  <label className="text-xs font-medium text-text-faint">Tipo de Produção (Filtro)</label>
                  <select className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-blue-500">
                    <option value="Interna">Interna</option>
                    <option value="Externa">Externa (Importação)</option>
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">O responsável e o status serão definidos na tela de Ações.</p>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-border-color bg-bg-main/50 flex justify-end gap-3">
              <button 
                onClick={() => setIsNewOrderModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={saveOrder}
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                {editingOrder ? "Salvar Alterações" : "Salvar Solicitação"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action / Edit Modal */}
      {actionModalOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card border border-border-light rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-color">
              <h3 className="text-lg font-semibold text-text-main">Ações do Pedido</h3>
              <button onClick={() => setActionModalOrder(null)} className="text-text-faint hover:text-text-main transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="bg-bg-main p-3 rounded-lg border border-border-color">
                <p className="text-sm text-text-muted"><span className="text-slate-500">SKU:</span> {actionModalOrder.skuCode}</p>
                <p className="text-sm text-text-muted"><span className="text-slate-500">Cliente:</span> {actionModalOrder.customer}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-muted">Tipo de Produção</label>
                <select 
                  value={actionProductionType}
                  onChange={(e) => {
                    const newType = e.target.value as ProductionType;
                    setActionProductionType(newType);
                    if (newType !== actionModalOrder.productionType) {
                      setActionStatus('Aguardando Responsável');
                      setActionUser('');
                      if (actionAnalysis === 'Cancelado') setActionAnalysis('Não Analisado');
                    } else {
                      setActionStatus(actionModalOrder.status);
                      setActionUser(actionModalOrder.assignedUser || '');
                      setActionAnalysis(actionModalOrder.analysisStatus);
                    }
                  }}
                  className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-blue-500"
                >
                  <option value="Interna">Interna</option>
                  <option value="Externa">Externa (Importação)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-muted">Status do Pedido</label>
                <select 
                  value={actionStatus}
                  onChange={(e) => setActionStatus(e.target.value)}
                  className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-blue-500"
                >
                  <option value="Aguardando Responsável">Aguardando Responsável</option>
                  {actionProductionType === 'Interna' ? (
                    <>
                      <option value="Aguardando Máquina">Aguardando Máquina</option>
                      <option value="Em Produção">Em Produção</option>
                      <option value="Finalizado">Finalizado</option>
                    </>
                  ) : (
                    <>
                      <option value="Em Cotação">Em Cotação</option>
                      <option value="Comprado">Comprado</option>
                      <option value="Em Produção">Em Produção</option>
                      <option value="Em Trânsito">Em Trânsito</option>
                      <option value="Chegando">Chegando</option>
                      <option value="Entregue">Entregue</option>
                    </>
                  )}
                  {actionStatus === 'Cancelado' && <option value="Cancelado">Cancelado</option>}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-muted">Status da Análise</label>
                <select 
                  value={actionAnalysis}
                  onChange={(e) => setActionAnalysis(e.target.value as AnalysisStatus)}
                  className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-blue-500"
                >
                  <option value="Não Analisado">Não Analisado</option>
                  <option value="Analisado">Analisado</option>
                  <option value="Solicitada Produção">Solicitada Produção</option>
                  <option value="Solicitada Importação">Solicitada Importação</option>
                  {actionAnalysis === 'Cancelado' && <option value="Cancelado">Cancelado</option>}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-muted">Responsável (Ação)</label>
                <select 
                  value={actionUser}
                  onChange={(e) => setActionUser(e.target.value)}
                  className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-blue-500"
                >
                  <option value="">Selecione o responsável...</option>
                  {actionProductionType === 'Interna' 
                    ? INTERNAL_USERS.map(user => <option key={user} value={user}>{user}</option>)
                    : EXTERNAL_USERS.map(user => <option key={user} value={user}>{user}</option>)
                  }
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-muted">Data Prevista de Entrega <span className="text-red-400">*</span></label>
                <input 
                  type="date"
                  min={getMinDeliveryDate()}
                  value={actionExpectedDelivery}
                  onChange={(e) => {
                    setActionExpectedDelivery(e.target.value);
                    if (e.target.value) setActionError('');
                  }}
                  className={`w-full bg-bg-main border rounded-md px-3 py-2 text-sm text-text-main focus:outline-none ${actionError ? 'border-red-500/50 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50' : 'border-border-light focus:border-blue-500'}`}
                />
              </div>
            </div>

            {actionError && (
              <div className="px-6 py-3 bg-red-500/10 border-t border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {actionError}
              </div>
            )}

            <div className="px-6 py-4 border-t border-border-color bg-bg-main/50 flex justify-end gap-3">
              <button 
                onClick={() => setActionModalOrder(null)}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={saveAction}
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Atualizar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card border border-red-900/50 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-color bg-red-950/20">
              <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                <Ban className="w-5 h-5" />
                Cancelar Solicitação
              </h3>
              <button onClick={() => setCancelModalOrder(null)} className="text-text-faint hover:text-text-main transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <p className="text-sm text-text-muted">
                Tem certeza que deseja cancelar a solicitação do SKU <strong>{cancelModalOrder.skuCode}</strong> para o cliente <strong>{cancelModalOrder.customer}</strong>?
              </p>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-muted">Motivo do Cancelamento</label>
                <select 
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value as CancelReason)}
                  className="w-full bg-bg-main border border-border-light rounded-md px-3 py-2 text-sm text-text-main focus:outline-none focus:border-red-500/50"
                >
                  <option value="Cliente Desistiu pelo Tempo">Cliente Desistiu pelo Tempo</option>
                  <option value="Preço">Preço</option>
                  <option value="Desistência Fornecedor">Desistência Fornecedor</option>
                  <option value="Pedido Errado">Pedido Errado</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border-color bg-bg-main/50 flex justify-end gap-3">
              <button 
                onClick={() => setCancelModalOrder(null)}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors"
              >
                Voltar
              </button>
              <button 
                onClick={saveCancel}
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </ErrorBoundary>
  );
}
