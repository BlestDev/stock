import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, CreditCard as Edit, Trash2, Search } from 'lucide-react';

interface ResellerClient {
  id: string;
  clients?: { name: string };
}

interface Product {
  id: string;
  name: string;
  sku: string;
}

interface Consignment {
  id: string;
  reseller_client_id: string;
  product_id: string;
  quantity_given: number;
  quantity_remaining: number;
  unit_price: number;
  total_value: number;
  status: string;
  reseller_clients?: { clients?: { name: string } };
  products?: { name: string; sku: string };
}

export default function Consignments() {
  const [consignments, setConsignments] = useState<Consignment[]>([]);
  const [resellers, setResellers] = useState<ResellerClient[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingConsignment, setEditingConsignment] = useState<Consignment | null>(null);
  const [formData, setFormData] = useState({
    reseller_client_id: '',
    product_id: '',
    quantity_given: 0,
    unit_price: 0,
    status: 'active',
  });

  useEffect(() => {
    loadConsignments();
    loadResellers();
    loadProducts();
  }, []);

  const loadConsignments = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('consignments')
      .select('*, reseller_clients(clients(name)), products(name, sku)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setConsignments(data);
    setLoading(false);
  };

  const loadResellers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('reseller_clients')
      .select('id, clients(name)')
      .eq('user_id', user.id)
      .order('created_at');
    if (data) setResellers(data);
  };

  const loadProducts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('products')
      .select('id, name, sku, sale_price')
      .eq('user_id', user.id)
      .order('name');
    if (data) setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const total_value = formData.quantity_given * formData.unit_price;

    if (editingConsignment) {
      await supabase
        .from('consignments')
        .update({
          ...formData,
          quantity_remaining: formData.quantity_given,
          total_value,
        })
        .eq('id', editingConsignment.id);
    } else {
      await supabase
        .from('consignments')
        .insert([{
          ...formData,
          quantity_remaining: formData.quantity_given,
          total_value,
          user_id: user.id,
        }]);

      await supabase
        .from('consignment_balances')
        .insert([{
          reseller_client_id: formData.reseller_client_id,
          transaction_type: 'consignment_given',
          amount: total_value,
          reference_id: null,
          notes: `Consignation donnée`,
          user_id: user.id,
        }]);

      const { data: resellerData } = await supabase
        .from('reseller_clients')
        .select('current_balance')
        .eq('id', formData.reseller_client_id)
        .single();

      if (resellerData) {
        await supabase
          .from('reseller_clients')
          .update({ current_balance: resellerData.current_balance + total_value })
          .eq('id', formData.reseller_client_id);
      }
    }

    setShowModal(false);
    setEditingConsignment(null);
    resetForm();
    loadConsignments();
  };

  const handleEdit = (consignment: Consignment) => {
    setEditingConsignment(consignment);
    setFormData({
      reseller_client_id: consignment.reseller_client_id,
      product_id: consignment.product_id,
      quantity_given: consignment.quantity_given,
      unit_price: consignment.unit_price,
      status: consignment.status,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette consignation?')) {
      await supabase.from('consignments').delete().eq('id', id);
      loadConsignments();
    }
  };

  const resetForm = () => {
    setFormData({
      reseller_client_id: '',
      product_id: '',
      quantity_given: 0,
      unit_price: 0,
      status: 'active',
    });
  };

  const filteredConsignments = consignments.filter(consignment =>
    consignment.reseller_clients?.clients?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consignment.products?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-slate-800">Consignations</h1>
          <p className="text-slate-600 mt-1">Gérez les produits confiés aux revendeurs</p>
        </div>
        <button
          onClick={() => {
            setEditingConsignment(null);
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Consignation
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher une consignation..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Donné</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Restant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Prix unitaire</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Valeur totale</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredConsignments.map((consignment) => (
                <tr key={consignment.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {consignment.reseller_clients?.clients?.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {consignment.products?.name} ({consignment.products?.sku})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {consignment.quantity_given}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={consignment.quantity_remaining > 0 ? 'text-orange-600' : 'text-green-600'}>
                      {consignment.quantity_remaining}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {consignment.unit_price.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {consignment.total_value.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      consignment.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      consignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {consignment.status === 'active' ? 'Actif' :
                       consignment.status === 'completed' ? 'Complété' : 'Annulé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(consignment)} className="text-blue-600 hover:text-blue-900 mr-3">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(consignment.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredConsignments.length === 0 && (
            <div className="text-center py-12 text-slate-500">Aucune consignation trouvée</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingConsignment ? 'Modifier consignation' : 'Nouvelle consignation'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Produit</label>
                <select
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Sélectionner un produit</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Quantité donnée</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.quantity_given}
                  onChange={(e) => setFormData({ ...formData, quantity_given: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Prix unitaire (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unit_price}
                  onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Statut</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="active">Actif</option>
                  <option value="completed">Complété</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  {editingConsignment ? 'Mettre à jour' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingConsignment(null);
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
