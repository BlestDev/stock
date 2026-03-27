import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Download, Printer } from 'lucide-react';

interface ResellerClient {
  id: string;
  clients?: { name: string };
  current_balance: number;
}

interface Journal {
  id: string;
  journal_date: string;
  transaction_type: string;
  quantity_change: number;
  quantity_remaining: number;
  unit_price: number;
  amount: number;
  notes: string;
  products?: { name: string; sku: string };
}

export default function ResellerJournal() {
  const [resellers, setResellers] = useState<ResellerClient[]>([]);
  const [selectedReseller, setSelectedReseller] = useState<string>('');
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    loadResellers();
  }, []);

  useEffect(() => {
    if (selectedReseller) {
      loadJournals();
    }
  }, [selectedReseller, dateFrom, dateTo]);

  const loadResellers = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('reseller_clients')
      .select('*, clients(name)')
      .eq('user_id', user.id)
      .order('created_at');

    if (data) {
      setResellers(data);
      if (data.length > 0) {
        setSelectedReseller(data[0].id);
      }
    }
    setLoading(false);
  };

  const loadJournals = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !selectedReseller) return;

    let query = supabase
      .from('reseller_journals')
      .select('*, products(name, sku)')
      .eq('reseller_client_id', selectedReseller)
      .eq('user_id', user.id);

    if (dateFrom) {
      query = query.gte('journal_date', dateFrom);
    }
    if (dateTo) {
      query = query.lte('journal_date', dateTo);
    }

    const { data } = await query.order('journal_date', { ascending: true });

    if (data) setJournals(data);
  };

  const handlePrint = () => {
    const reseller = resellers.find(r => r.id === selectedReseller);
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    const journalHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Journal - ${reseller?.clients?.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; }
          .info { margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .total { font-weight: bold; text-align: right; }
          .print-button { display: none; }
        </style>
      </head>
      <body>
        <h1>Journal Client Revendeur</h1>
        <div class="info">
          <p><strong>Client:</strong> ${reseller?.clients?.name}</p>
          <p><strong>Balance courante:</strong> ${reseller?.current_balance.toFixed(2)} €</p>
          ${dateFrom ? `<p><strong>Période:</strong> du ${new Date(dateFrom).toLocaleDateString('fr-FR')} au ${dateTo ? new Date(dateTo).toLocaleDateString('fr-FR') : 'aujourd\'hui'}</p>` : ''}
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Produit</th>
              <th>Type</th>
              <th>Quantité</th>
              <th>Restant</th>
              <th>Prix unitaire</th>
              <th>Montant</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${journals.map(j => `
              <tr>
                <td>${new Date(j.journal_date).toLocaleDateString('fr-FR')}</td>
                <td>${j.products?.name} (${j.products?.sku})</td>
                <td>${
                  j.transaction_type === 'consignment_given' ? 'Consignation donnée' :
                  j.transaction_type === 'sale_recorded' ? 'Vente enregistrée' :
                  'Ajustement'
                }</td>
                <td>${j.quantity_change}</td>
                <td>${j.quantity_remaining}</td>
                <td>${j.unit_price.toFixed(2)} €</td>
                <td>${j.amount.toFixed(2)} €</td>
                <td>${j.notes}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p style="margin-top: 20px; text-align: right;">
          <strong>Total restant:</strong> ${journals.reduce((sum, j) => sum + j.amount, 0).toFixed(2)} €
        </p>
      </body>
      </html>
    `;

    printWindow.document.write(journalHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const selectedResellerData = resellers.find(r => r.id === selectedReseller);

  if (loading) {
    return <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Journal Client Revendeur</h1>
          <p className="text-slate-600 mt-1">Suivi détaillé des mouvements de consignation et ventes</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Printer className="w-5 h-5" />
          Imprimer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Client Revendeur</label>
          <select
            value={selectedReseller}
            onChange={(e) => setSelectedReseller(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
          <label className="block text-sm font-medium text-slate-700 mb-2">Du</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Au</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setDateFrom('');
              setDateTo('');
            }}
            className="w-full bg-slate-300 hover:bg-slate-400 text-slate-800 px-4 py-2 rounded-lg transition"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {selectedResellerData && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-600">Client</p>
              <p className="text-xl font-bold text-slate-800">{selectedResellerData.clients?.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Balance courante</p>
              <p className={`text-xl font-bold ${selectedResellerData.current_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {selectedResellerData.current_balance.toFixed(2)} €
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Total mouvement</p>
              <p className="text-xl font-bold text-slate-800">
                {journals.reduce((sum, j) => sum + j.amount, 0).toFixed(2)} €
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Quantité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Restant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Prix unit.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {journals.map((journal) => (
                <tr key={journal.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {new Date(journal.journal_date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {journal.products?.name} ({journal.products?.sku})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      journal.transaction_type === 'consignment_given' ? 'bg-blue-100 text-blue-800' :
                      journal.transaction_type === 'sale_recorded' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {journal.transaction_type === 'consignment_given' ? 'Consignation donnée' :
                       journal.transaction_type === 'sale_recorded' ? 'Vente enregistrée' : 'Ajustement'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {journal.quantity_change > 0 ? '+' : ''}{journal.quantity_change}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {journal.quantity_remaining}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {journal.unit_price.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {journal.amount.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {journal.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {journals.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              Aucune transaction trouvée pour ce revendeur
            </div>
          )}
        </div>

        {journals.length > 0 && (
          <div className="p-6 border-t border-slate-200 flex justify-end">
            <div className="text-right">
              <p className="text-sm text-slate-600 mb-1">Total de cette période:</p>
              <p className="text-2xl font-bold text-slate-900">
                {journals.reduce((sum, j) => sum + j.amount, 0).toFixed(2)} €
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
