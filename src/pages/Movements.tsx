import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Movement {
  id: string;
  movement_type: string;
  quantity: number;
  movement_date: string;
  notes: string;
  products?: { name: string; sku: string };
}

export default function Movements() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovements();
  }, []);

  const loadMovements = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('stock_movements')
      .select('*, products(name, sku)')
      .eq('user_id', user.id)
      .order('movement_date', { ascending: false });

    if (data) setMovements(data);
    setLoading(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Mouvements de Stock</h1>
        <p className="text-slate-600 mt-1">Historique des mouvements de stock</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Produit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Quantité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {movements.map((movement) => (
                <tr key={movement.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {new Date(movement.movement_date).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {movement.products?.name} ({movement.products?.sku})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      movement.movement_type === 'in' ? 'bg-green-100 text-green-800' :
                      movement.movement_type === 'out' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {movement.movement_type === 'in' ? 'Entrée' :
                       movement.movement_type === 'out' ? 'Sortie' : 'Ajustement'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      {movement.movement_type === 'in' ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={movement.movement_type === 'in' ? 'text-green-600' : 'text-red-600'}>
                        {movement.movement_type === 'in' ? '+' : ''}{movement.quantity}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{movement.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {movements.length === 0 && (
            <div className="text-center py-12 text-slate-500">Aucun mouvement enregistré</div>
          )}
        </div>
      </div>
    </div>
  );
}
