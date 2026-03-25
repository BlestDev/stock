import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, CreditCard as Edit, Trash2, Search } from 'lucide-react';

interface Purchase {
  id: string;
  purchase_number: string;
  purchase_date: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  notes: string;
  supplier_id: string | null;
  suppliers?: { name: string };
}

interface Supplier {
  id: string;
  name: string;
}

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [formData, setFormData] = useState({
    purchase_number: '',
    supplier_id: '',
    purchase_date: new Date().toISOString().split('T')[0],
    subtotal: 0,
    tax_amount: 0,
    discount_amount: 0,
    total_amount: 0,
    payment_status: 'pending',
    payment_method: 'transfer',
    notes: '',
  });

  useEffect(() => {
    loadPurchases();
    loadSuppliers();
  }, []);

  const loadPurchases = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('purchases')
      .select('*, suppliers(name)')
      .eq('user_id', user.id)
      .order('purchase_date', { ascending: false });

    if (data) setPurchases(data);
    setLoading(false);
  };

  const loadSuppliers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase.from('suppliers').select('id, name').eq('user_id', user.id).order('name');
    if (data) setSuppliers(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (editingPurchase) {
      await supabase.from('purchases').update(formData).eq('id', editingPurchase.id);
    } else {
      await supabase.from('purchases').insert([{ ...formData, user_id: user.id }]);
    }

    setShowModal(false);
    setEditingPurchase(null);
    resetForm();
    loadPurchases();
  };

  const handleEdit = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setFormData({
      purchase_number: purchase.purchase_number,
      supplier_id: purchase.supplier_id || '',
      purchase_date: purchase.purchase_date,
      subtotal: purchase.subtotal,
      tax_amount: purchase.tax_amount,
      discount_amount: purchase.discount_amount,
      total_amount: purchase.total_amount,
      payment_status: purchase.payment_status,
      payment_method: purchase.payment_method,
      notes: purchase.notes,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet achat?')) {
      await supabase.from('purchases').delete().eq('id', id);
      loadPurchases();
    }
  };

  const resetForm = () => {
    setFormData({
      purchase_number: '',
      supplier_id: '',
      purchase_date: new Date().toISOString().split('T')[0],
      subtotal: 0,
      tax_amount: 0,
      discount_amount: 0,
      total_amount: 0,
      payment_status: 'pending',
      payment_method: 'transfer',
      notes: '',
    });
  };

  const filteredPurchases = purchases.filter(purchase =>
    purchase.purchase_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.suppliers?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-slate-800">Achats</h1>
          <p className="text-slate-600 mt-1">Gérez vos achats</p>
        </div>
        <button
          onClick={() => {
            setEditingPurchase(null);
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Nouvel Achat
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un achat..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">N° Achat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Fournisseur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Méthode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {purchase.purchase_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {purchase.suppliers?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {new Date(purchase.purchase_date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {purchase.total_amount.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{purchase.payment_method}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      purchase.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                      purchase.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {purchase.payment_status === 'paid' ? 'Payé' :
                       purchase.payment_status === 'partial' ? 'Partiel' : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(purchase)} className="text-blue-600 hover:text-blue-900 mr-3">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(purchase.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPurchases.length === 0 && (
            <div className="text-center py-12 text-slate-500">Aucun achat trouvé</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingPurchase ? 'Modifier l\'achat' : 'Nouvel achat'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">N° Achat</label>
                  <input
                    type="text"
                    value={formData.purchase_number}
                    onChange={(e) => setFormData({ ...formData, purchase_number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fournisseur</label>
                  <select
                    value={formData.supplier_id}
                    onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Sélectionner un fournisseur</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
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
                  {editingPurchase ? 'Mettre à jour' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPurchase(null);
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
