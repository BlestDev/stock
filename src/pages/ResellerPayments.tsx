import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Search } from 'lucide-react';

interface ResellerClient {
  id: string;
  current_balance: number;
  clients?: { name: string };
}

interface ResellerSale {
  id: string;
  reseller_client_id: string;
  sale_date: string;
  quantity_sold: number;
  total_revenue: number;
  amount_paid: number;
  payment_date: string | null;
  notes: string;
  reseller_clients?: { clients?: { name: string } };
}

export default function ResellerPayments() {
  const [resellers, setResellers] = useState<ResellerClient[]>([]);
  const [sales, setSales] = useState<ResellerSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReseller, setSelectedReseller] = useState<ResellerClient | null>(null);
  const [formData, setFormData] = useState({
    reseller_client_id: '',
    sale_date: new Date().toISOString().split('T')[0],
    quantity_sold: 0,
    total_revenue: 0,
    notes: '',
  });
  const [paymentData, setPaymentData] = useState({
    reseller_client_id: '',
    amount_paid: 0,
    payment_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [resellersResult, salesResult] = await Promise.all([
      supabase
        .from('reseller_clients')
        .select('*, clients(name)')
        .eq('user_id', user.id)
        .order('created_at'),
      supabase
        .from('reseller_sales')
        .select('*, reseller_clients(clients(name))')
        .eq('user_id', user.id)
        .order('sale_date', { ascending: false })
    ]);

    if (resellersResult.data) setResellers(resellersResult.data);
    if (salesResult.data) setSales(salesResult.data);
    setLoading(false);
  };

  const handleSaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('reseller_sales').insert([{
      ...formData,
      user_id: user.id,
    }]);

    setShowModal(false);
    resetForm();
    loadData();
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const reseller = resellers.find(r => r.id === paymentData.reseller_client_id);
    if (!reseller) return;

    const newBalance = Math.max(0, reseller.current_balance - paymentData.amount_paid);

    await Promise.all([
      supabase
        .from('reseller_sales')
        .insert([{
          reseller_client_id: paymentData.reseller_client_id,
          sale_date: new Date().toISOString().split('T')[0],
          quantity_sold: 0,
          total_revenue: 0,
          amount_paid: paymentData.amount_paid,
          payment_date: paymentData.payment_date,
          user_id: user.id,
        }]),
      supabase
        .from('reseller_clients')
        .update({ current_balance: newBalance })
        .eq('id', paymentData.reseller_client_id),
      supabase
        .from('consignment_balances')
        .insert([{
          reseller_client_id: paymentData.reseller_client_id,
          transaction_type: 'payment_received',
          amount: -paymentData.amount_paid,
          notes: `Paiement reçu`,
          user_id: user.id,
        }])
    ]);

    setShowPaymentModal(false);
    setPaymentData({
      reseller_client_id: '',
      amount_paid: 0,
      payment_date: new Date().toISOString().split('T')[0],
    });
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette vente?')) {
      await supabase.from('reseller_sales').delete().eq('id', id);
      loadData();
    }
  };

  const resetForm = () => {
    setFormData({
      reseller_client_id: '',
      sale_date: new Date().toISOString().split('T')[0],
      quantity_sold: 0,
      total_revenue: 0,
      notes: '',
    });
  };

  const filteredSales = sales.filter(sale =>
    sale.reseller_clients?.clients?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Ventes & Paiements Revendeurs</h1>
          <p className="text-slate-600 mt-1">Enregistrez les ventes et paiements des revendeurs</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            Nouvelle Vente
          </button>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            Enregistrer Paiement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {resellers.map(reseller => (
          <div key={reseller.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <h3 className="font-bold text-slate-800">{reseller.clients?.name}</h3>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Balance:</span>
                <span className={`font-bold ${reseller.current_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {reseller.current_balance.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Revendeur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Quantité vendue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Revenu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Paiement</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {sale.reseller_clients?.clients?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {new Date(sale.sale_date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {sale.quantity_sold}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {sale.total_revenue.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={sale.amount_paid > 0 ? 'text-green-600' : 'text-slate-600'}>
                      {sale.amount_paid.toFixed(2)} €
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(sale.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSales.length === 0 && (
            <div className="text-center py-12 text-slate-500">Aucune transaction trouvée</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Enregistrer une vente revendeur</h2>
            </div>

            <form onSubmit={handleSaleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Revendeur</label>
                <select
                  value={formData.reseller_client_id}
                  onChange={(e) => setFormData({ ...formData, reseller_client_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Sélectionner un revendeur</option>
                  {resellers.map(reseller => (
                    <option key={reseller.id} value={reseller.id}>
                      {reseller.clients?.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date de vente</label>
                <input
                  type="date"
                  value={formData.sale_date}
                  onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Quantité vendue</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.quantity_sold}
                  onChange={(e) => setFormData({ ...formData, quantity_sold: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Revenu total (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.total_revenue}
                  onChange={(e) => setFormData({ ...formData, total_revenue: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Enregistrer un paiement</h2>
            </div>

            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Revendeur</label>
                <select
                  value={paymentData.reseller_client_id}
                  onChange={(e) => {
                    setPaymentData({ ...paymentData, reseller_client_id: e.target.value });
                    const selected = resellers.find(r => r.id === e.target.value);
                    setSelectedReseller(selected || null);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Sélectionner un revendeur</option>
                  {resellers.map(reseller => (
                    <option key={reseller.id} value={reseller.id}>
                      {reseller.clients?.name} (Balance: {reseller.current_balance.toFixed(2)} €)
                    </option>
                  ))}
                </select>
              </div>

              {selectedReseller && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-sm text-slate-600">Balance actuelle:</p>
                  <p className="text-xl font-bold text-red-600">{selectedReseller.current_balance.toFixed(2)} €</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Montant payé (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentData.amount_paid}
                  onChange={(e) => setPaymentData({ ...paymentData, amount_paid: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date de paiement</label>
                <input
                  type="date"
                  value={paymentData.payment_date}
                  onChange={(e) => setPaymentData({ ...paymentData, payment_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Confirmer Paiement
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
