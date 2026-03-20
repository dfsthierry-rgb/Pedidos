const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add formData state
const stateRegex = /const \[editingOrder, setEditingOrder\] = useState<Order \| null>\(null\);/;
const stateReplacement = `const [editingOrder, setEditingOrder] = useState<Order | null>(null);

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
  });`;

code = code.replace(stateRegex, stateReplacement);

// Add openEditModal and openNewOrderModal functions
const funcRegex = /const openActionModal = \(order: Order\) => \{/;
const funcReplacement = `const openEditModal = (order: Order) => {
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
        id: \`PED-\${Math.floor(Math.random() * 10000)}\`,
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

  const openActionModal = (order: Order) => {`;

code = code.replace(funcRegex, funcReplacement);

// Replace "Nova Solicitação" button onClick
code = code.replace(/onClick=\{() => setIsNewOrderModalOpen\(true\)\}/g, 'onClick={openNewOrderModal}');

// Add Edit button to table rows
const editBtnRegex = /<button\s*onClick=\{\(\) => openActionModal\(order\)\}/;
const editBtnReplacement = `<button 
                            onClick={() => openEditModal(order)}
                            className="text-slate-500 hover:text-green-400 transition-colors mr-3" 
                            title="Editar Pedido"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openActionModal(order)}`;

code = code.replace(editBtnRegex, editBtnReplacement);

// Update New Order Modal inputs
code = code.replace(/<input type="date" className="([^"]+)" \/>/g, '<input type="date" className="$1" value={formData.requestDate} onChange={e => setFormData({...formData, requestDate: e.target.value})} />');
code = code.replace(/<select className="([^"]+)">\s*<option value="">Selecione...<\/option>\s*<option value="Débora">Débora<\/option>\s*<option value="Inaê">Inaê<\/option>\s*<\/select>/g, '<select className="$1" value={formData.requestedBy} onChange={e => setFormData({...formData, requestedBy: e.target.value})}><option value="">Selecione...</option><option value="Débora">Débora</option><option value="Inaê">Inaê</option></select>');
code = code.replace(/<input type="text" className="([^"]+)" placeholder="Nome do vendedor" \/>/g, '<input type="text" className="$1" placeholder="Nome do vendedor" value={formData.salesperson} onChange={e => setFormData({...formData, salesperson: e.target.value})} />');
code = code.replace(/<input type="text" className="([^"]+)" placeholder="Razão Social \/ Nome" \/>/g, '<input type="text" className="$1" placeholder="Razão Social / Nome" value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} />');
code = code.replace(/<input type="text" className="([^"]+)" placeholder="00\.000\.000\/0000-00" \/>/g, '<input type="text" className="$1" placeholder="00.000.000/0000-00" value={formData.document} onChange={e => setFormData({...formData, document: e.target.value})} />');
code = code.replace(/<input type="text" className="([^"]+)" placeholder="Ex: 00002400" \/>/g, '<input type="text" className="$1" placeholder="Ex: 00002400" value={formData.skuCode} onChange={e => setFormData({...formData, skuCode: e.target.value})} />');
code = code.replace(/<input type="text" className="([^"]+)" placeholder="Descrição completa do produto" \/>/g, '<input type="text" className="$1" placeholder="Descrição completa do produto" value={formData.skuDescription} onChange={e => setFormData({...formData, skuDescription: e.target.value})} />');
code = code.replace(/<input type="text" className="([^"]+)" placeholder="Ex: M50" \/>/g, '<input type="text" className="$1" placeholder="Ex: M50" value={formData.mesh} onChange={e => setFormData({...formData, mesh: e.target.value})} />');
code = code.replace(/<input type="text" className="([^"]+)" placeholder="Ex: f35" \/>/g, '<input type="text" className="$1" placeholder="Ex: f35" value={formData.wire} onChange={e => setFormData({...formData, wire: e.target.value})} />');
code = code.replace(/<input type="text" className="([^"]+)" placeholder="Ex: 38 mm" \/>/g, '<input type="text" className="$1" placeholder="Ex: 38 mm" value={formData.opening} onChange={e => setFormData({...formData, opening: e.target.value})} />');
code = code.replace(/<input type="text" className="([^"]+)" placeholder="Ex: Lisa" \/>/g, '<input type="text" className="$1" placeholder="Ex: Lisa" value={formData.edge} onChange={e => setFormData({...formData, edge: e.target.value})} />');
code = code.replace(/<input type="text" className="([^"]+)" placeholder="Ex: 1,00m" \/>/g, '<input type="text" className="$1" placeholder="Ex: 1,00m" value={formData.width} onChange={e => setFormData({...formData, width: e.target.value})} />');
code = code.replace(/<input type="number" className="([^"]+)" placeholder="0" \/>/g, '<input type="number" className="$1" placeholder="0" value={formData.qtyMeters} onChange={e => setFormData({...formData, qtyMeters: Number(e.target.value)})} />');
code = code.replace(/<select className="([^"]+)">\s*<option>Interna<\/option>\s*<option>Externa<\/option>\s*<\/select>/g, '<select className="$1" value={formData.productionType} onChange={e => setFormData({...formData, productionType: e.target.value as ProductionType})}><option value="Interna">Interna</option><option value="Externa">Externa</option></select>');

// Replace Salvar button onClick
code = code.replace(/<button onClick=\{\(\) => setIsNewOrderModalOpen\(false\)\} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">/g, '<button onClick={saveOrder} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">');

// Update Modal Title
code = code.replace(/<h3 className="text-lg font-semibold text-white">Nova Solicitação de Pedido Especial<\/h3>/g, '<h3 className="text-lg font-semibold text-text-main">{editingOrder ? "Editar Solicitação" : "Nova Solicitação de Pedido Especial"}</h3>');

fs.writeFileSync('src/App.tsx', code);
