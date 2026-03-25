import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, CreditCard as Edit, Trash2, Search } from 'lucide-react';

interface Sale {
  id: string;
  sale_number: string;
  sale_date: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  notes: string;
  client_id: string | null;
  clients?: { name: string };
}

interface Client {
  id: string;
  name: string;
}

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [formData, setFormData] = useState({
    sale_number: '',
    client_id: '',
    sale_date: new Date().toISOString().split('T')[0],
    subtotal: 0,
    tax_amount: 0,
    discount_amount: 0,
    total_amount: 0,
    payment_status: 'pending',
    payment_method: 'cash',
    notes: '',
  });

  useEffect(() => {
    loadSales();
    loadClients();
  }, []);

  const loadSales = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('sales')
      .select('*, clients(name)')
      .eq('user_id', user.id)
      .order('sale_date', { ascending: false });

    if (data) setSales(data);
    setLoading(false);
  };

  const loadClients = async () => {
    const { data } = await supabase.from('clients').select('id, name').order('name');
    if (data) setClients(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (editingSale) {
      await supabase.from('sales').update(formData).eq('id', editingSale.id);
    } else {
      await supabase.from('sales').insert([{ ...formData, user_id: user.id }]);
    }

    setShowModal(false);
    setEditingSale(null);
    resetForm();
    loadSales();
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setFormData({
      sale_number: sale.sale_number,
      client_id: sale.client_id || '',
      sale_date: sale.sale_date,
      subtotal: sale.subtotal,
      tax_amount: sale.tax_amount,
      discount_amount: sale.discount_amount,
      total_amount: sale.total_amount,
      payment_status: sale.payment_status,
      payment_method: sale.payment_method,
      notes: sale.notes,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette vente?')) {
      await supabase.from('sales').delete().eq('id', id);
      loadSales();
    }
  };

  const resetForm = () => {
    setFormData({
      sale_number: '',
      client_id: '',
      sale_date: new Date().toISOString().split('T')[0],
      subtotal: 0,
      tax_amount: 0,
      discount_amount: 0,
      total_amount: 0,
      payment_status: 'pending',
      payment_method: 'cash',
      notes: '',
    });
  };

  const filteredSales = sales.filter(sale =>
    sale.sale_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.clients?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-slate-800">Ventes</h1>
          <p className="text-slate-600 mt-1">Gérez vos ventes</p>
        </div>
        <button
          onClick={() => {
            setEditingSale(null);
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Vente
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une vente..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">N° Vente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Méthode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{sale.sale_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{sale.clients?.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {new Date(sale.sale_date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {sale.total_amount.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{sale.payment_method}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      sale.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                      sale.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {sale.payment_status === 'paid' ? 'Payé' :
                       sale.payment_status === 'partial' ? 'Partiel' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(sale)} className="text-blue-600 hover:text-blue-900 mr-3">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(sale.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSales.length === 0 && (
            <div className="text-center py-12 text-slate-500">Aucune vente trouvée</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingSale ? 'Modifier la vente' : 'Nouvelle vente'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">N° Vente</label>
                  <input
                    type="text"
                    value={formData.sale_number}
                    onChange={(e) => setFormData({ ...formData, sale_number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Client</label>
                  <select
                    value={formData.client_id}
                    onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.sale_date}
                    onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sous-total (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.subtotal}
                    onChange={(e) => setFormData({ ...formData, subtotal: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">TVA (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.tax_amount}
                    onChange={(e) => setFormData({ ...formData, tax_amount: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Remise (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discount_amount}
                    onChange={(e) => setFormData({ ...formData, discount_amount: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Total (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.total_amount}
                    onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Méthode de paiement</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="cash">Espèces</option>
                    <option value="card">Carte</option>
                    <option value="transfer">Virement</option>
                    <option value="check">Chèque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Statut paiement</label>
                  <select
                    value={formData.payment_status}
                    onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="pending">En attente</option>
                    <option value="partial">Partiel</option>
                    <option value="paid">Payé</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  {editingSale ? 'Mettre à jour' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSale(null);
                    resetForm();
                  }}
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
