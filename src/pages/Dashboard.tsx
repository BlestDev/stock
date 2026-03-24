import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { TrendingUp, TrendingDown, Package, Users, ShoppingCart, DollarSign, AlertTriangle } from 'lucide-react';

interface Stats {
  totalProducts: number;
  totalClients: number;
  totalSales: number;
  totalRevenue: number;
  lowStockProducts: number;
  pendingInvoices: number;
  monthlyRevenue: number;
  monthlySales: number;
}

interface TopProduct {
  name: string;
  total_quantity: number;
  total_revenue: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalClients: 0,
    totalSales: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    pendingInvoices: 0,
    monthlyRevenue: 0,
    monthlySales: 0,
  });
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [
      productsResult,
      clientsResult,
      salesResult,
      lowStockResult,
      invoicesResult,
      topProductsResult
    ] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('clients').select('id', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('sales').select('id, total_amount, sale_date').eq('user_id', user.id),
      supabase.from('products').select('id').eq('user_id', user.id).lt('stock_quantity', supabase.raw('min_stock')),
      supabase.from('invoices').select('id').eq('user_id', user.id).eq('payment_status', 'pending'),
      supabase.from('sale_items')
        .select('product_id, quantity, total, products(name)')
        .limit(5)
    ]);

    const salesData = salesResult.data || [];
    const totalRevenue = salesData.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlySalesData = salesData.filter(sale => {
      const saleDate = new Date(sale.sale_date);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });
    const monthlyRevenue = monthlySalesData.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);

    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
    (topProductsResult.data || []).forEach((item: any) => {
      const productName = item.products?.name || 'Unknown';
      if (!productSales[productName]) {
        productSales[productName] = { name: productName, quantity: 0, revenue: 0 };
      }
      productSales[productName].quantity += item.quantity || 0;
      productSales[productName].revenue += item.total || 0;
    });

    const topProductsList = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(p => ({ name: p.name, total_quantity: p.quantity, total_revenue: p.revenue }));

    setStats({
      totalProducts: productsResult.count || 0,
      totalClients: clientsResult.count || 0,
      totalSales: salesData.length,
      totalRevenue,
      lowStockProducts: lowStockResult.data?.length || 0,
      pendingInvoices: invoicesResult.count || 0,
      monthlyRevenue,
      monthlySales: monthlySalesData.length,
    });

    setTopProducts(topProductsList);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Produits',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      trend: '+12%'
    },
    {
      title: 'Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'bg-green-500',
      trend: '+8%'
    },
    {
      title: 'Ventes ce mois',
      value: stats.monthlySales,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      trend: '+23%'
    },
    {
      title: 'Revenu Total',
      value: `${stats.totalRevenue.toFixed(2)} €`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      trend: '+15%'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Tableau de Bord</h1>
        <p className="text-slate-600 mt-1">Vue d'ensemble de votre activité</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  {card.trend}
                </div>
              </div>
              <h3 className="text-slate-600 text-sm font-medium">{card.title}</h3>
              <p className="text-2xl font-bold text-slate-800 mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Top 5 Ventes</h2>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Aucune vente pour le moment</p>
            ) : (
              topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{product.name}</p>
                      <p className="text-sm text-slate-500">{product.total_quantity} unités vendues</p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-800">{product.total_revenue.toFixed(2)} €</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Alertes</h2>
          <div className="space-y-3">
            {stats.lowStockProducts > 0 && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Stock Faible</p>
                  <p className="text-sm text-red-700">
                    {stats.lowStockProducts} produit{stats.lowStockProducts > 1 ? 's' : ''} en dessous du seuil minimum
                  </p>
                </div>
              </div>
            )}

            {stats.pendingInvoices > 0 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Factures en attente</p>
                  <p className="text-sm text-yellow-700">
                    {stats.pendingInvoices} facture{stats.pendingInvoices > 1 ? 's' : ''} non payée{stats.pendingInvoices > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}

            {stats.lowStockProducts === 0 && stats.pendingInvoices === 0 && (
              <div className="flex items-center justify-center py-8 text-slate-500">
                <p>Aucune alerte pour le moment</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="font-medium text-slate-800 mb-3">Revenu Mensuel</h3>
            <p className="text-3xl font-bold text-green-600">{stats.monthlyRevenue.toFixed(2)} €</p>
            <p className="text-sm text-slate-500 mt-1">
              Basé sur {stats.monthlySales} vente{stats.monthlySales > 1 ? 's' : ''} ce mois
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
