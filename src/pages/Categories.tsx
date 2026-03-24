import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, CreditCard as Edit, Trash2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Unit {
  id: string;
  name: string;
  symbol: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [unitForm, setUnitForm] = useState({ name: '', symbol: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [categoriesResult, unitsResult] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('units').select('*').order('name'),
    ]);

    if (categoriesResult.data) setCategories(categoriesResult.data);
    if (unitsResult.data) setUnits(unitsResult.data);
    setLoading(false);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('categories').insert([categoryForm]);
    setShowCategoryModal(false);
    setCategoryForm({ name: '', description: '' });
    loadData();
  };

  const handleUnitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('units').insert([unitForm]);
    setShowUnitModal(false);
    setUnitForm({ name: '', symbol: '' });
    loadData();
  };

  const deleteCategory = async (id: string) => {
    if (confirm('Supprimer cette catégorie?')) {
      await supabase.from('categories').delete().eq('id', id);
      loadData();
    }
  };

  const deleteUnit = async (id: string) => {
    if (confirm('Supprimer cette unité?')) {
      await supabase.from('units').delete().eq('id', id);
      loadData();
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Catégories & Unités</h1>
        <p className="text-slate-600 mt-1">Gérez les catégories et unités de mesure</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Catégories</h2>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition text-sm"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>

          <div className="divide-y divide-slate-200">
            {categories.map((category) => (
              <div key={category.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">{category.name}</p>
                  <p className="text-sm text-slate-500">{category.description}</p>
                </div>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="p-8 text-center text-slate-500">Aucune catégorie</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Unités de Mesure</h2>
            <button
              onClick={() => setShowUnitModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition text-sm"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>

          <div className="divide-y divide-slate-200">
            {units.map((unit) => (
              <div key={unit.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <p className="font-medium text-slate-900">{unit.name}</p>
                  <p className="text-sm text-slate-500">Symbole: {unit.symbol}</p>
                </div>
                <button
                  onClick={() => deleteUnit(unit.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {units.length === 0 && (
              <div className="p-8 text-center text-slate-500">Aucune unité</div>
            )}
          </div>
        </div>
      </div>

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Nouvelle catégorie</h2>
            </div>

            <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUnitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">Nouvelle unité</h2>
            </div>

            <form onSubmit={handleUnitSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                <input
                  type="text"
                  value={unitForm.name}
                  onChange={(e) => setUnitForm({ ...unitForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Kilogramme"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Symbole</label>
                <input
                  type="text"
                  value={unitForm.symbol}
                  onChange={(e) => setUnitForm({ ...unitForm, symbol: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="kg"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Créer
                </button>
                <button
                  type="button"
                  onClick={() => setShowUnitModal(false)}
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
