import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Printer, Download } from 'lucide-react';

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string | null;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_status: string;
  notes: string;
  clients?: { name: string; address: string; email: string; phone: string };
}

interface Settings {
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  tax_rate: number;
  currency: string;
}

export default function InvoicePrint() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [invoicesResult, settingsResult] = await Promise.all([
      supabase
        .from('invoices')
        .select('*, clients(name, address, email, phone)')
        .eq('user_id', user.id)
        .order('invoice_date', { ascending: false }),
      supabase
        .from('settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
    ]);

    if (invoicesResult.data) {
      setInvoices(invoicesResult.data);
      if (invoicesResult.data.length > 0) {
        setSelectedInvoice(invoicesResult.data[0].id);
      }
    }
    if (settingsResult.data) {
      setSettings(settingsResult.data);
    }
    setLoading(false);
  };

  const handlePrint = () => {
    const invoice = invoices.find(i => i.id === selectedInvoice);
    if (!invoice || !settings) return;

    const printWindow = window.open('', '', 'height=800,width=900');
    if (!printWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Facture ${invoice.invoice_number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: white; }
          .container { max-width: 900px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
          .company-info h1 { margin: 0; font-size: 28px; }
          .company-info p { margin: 5px 0; color: #666; }
          .invoice-info { text-align: right; }
          .invoice-info h2 { margin: 0; font-size: 24px; color: #0066cc; }
          .invoice-info p { margin: 5px 0; }
          .details { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
          .detail-section h3 { margin-top: 0; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
          .detail-section p { margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .amount-right { text-align: right; }
          .totals { float: right; width: 300px; margin: 20px 0; }
          .totals div { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd; }
          .totals .total { font-weight: bold; font-size: 16px; border-top: 2px solid #000; border-bottom: none; }
          .notes { clear: both; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px; }
          .notes h4 { margin-top: 0; }
          @media print { body { margin: 0; padding: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="company-info">
              <h1>${settings.company_name}</h1>
              <p>${settings.company_address}</p>
              <p>Tél: ${settings.company_phone}</p>
              <p>Email: ${settings.company_email}</p>
            </div>
            <div class="invoice-info">
              <h2>FACTURE</h2>
              <p><strong>N°:</strong> ${invoice.invoice_number}</p>
              <p><strong>Date:</strong> ${new Date(invoice.invoice_date).toLocaleDateString('fr-FR')}</p>
              ${invoice.due_date ? `<p><strong>Échéance:</strong> ${new Date(invoice.due_date).toLocaleDateString('fr-FR')}</p>` : ''}
            </div>
          </div>

          <div class="details">
            <div class="detail-section">
              <h3>Client</h3>
              <p><strong>${invoice.clients?.name}</strong></p>
              ${invoice.clients?.address ? `<p>${invoice.clients.address}</p>` : ''}
              ${invoice.clients?.phone ? `<p>Tél: ${invoice.clients.phone}</p>` : ''}
              ${invoice.clients?.email ? `<p>Email: ${invoice.clients.email}</p>` : ''}
            </div>
            <div class="detail-section">
              <h3>Statut</h3>
              <p><strong>${
                invoice.payment_status === 'paid' ? 'PAYÉE' :
                invoice.payment_status === 'partial' ? 'PARTIELLEMENT PAYÉE' :
                'EN ATTENTE'
              }</strong></p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th class="amount-right">Quantité</th>
                <th class="amount-right">Prix unitaire</th>
                <th class="amount-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Services facturés</td>
                <td class="amount-right">1</td>
                <td class="amount-right">${invoice.subtotal.toFixed(2)} €</td>
                <td class="amount-right">${invoice.subtotal.toFixed(2)} €</td>
              </tr>
            </tbody>
          </table>

          <div class="totals">
            <div>
              <span>Sous-total:</span>
              <span>${invoice.subtotal.toFixed(2)} €</span>
            </div>
            ${invoice.discount_amount > 0 ? `
            <div>
              <span>Remise:</span>
              <span>-${invoice.discount_amount.toFixed(2)} €</span>
            </div>
            ` : ''}
            <div>
              <span>TVA (${Math.round(invoice.tax_amount / (invoice.subtotal - invoice.discount_amount) * 100)}%):</span>
              <span>${invoice.tax_amount.toFixed(2)} €</span>
            </div>
            <div class="total">
              <span>TOTAL À PAYER:</span>
              <span>${invoice.total_amount.toFixed(2)} €</span>
            </div>
          </div>

          ${invoice.notes ? `
          <div class="notes">
            <h4>Notes:</h4>
            <p>${invoice.notes}</p>
          </div>
          ` : ''}

          <div style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>Merci pour votre confiance</p>
            <p>Document généré automatiquement le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Impression Facture</h1>
          <p className="text-slate-600 mt-1">Imprimez et visualisez vos factures</p>
        </div>
        <button
          onClick={handlePrint}
          disabled={!selectedInvoice}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-lg transition"
        >
          <Printer className="w-5 h-5" />
          Imprimer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <label className="block text-sm font-medium text-slate-700 mb-3">Sélectionner une facture</label>
        <select
          value={selectedInvoice}
          onChange={(e) => setSelectedInvoice(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Sélectionner une facture</option>
          {invoices.map(invoice => (
            <option key={invoice.id} value={invoice.id}>
              {invoice.invoice_number} - {invoice.clients?.name} - {invoice.total_amount.toFixed(2)} € - {new Date(invoice.invoice_date).toLocaleDateString('fr-FR')}
            </option>
          ))}
        </select>
      </div>

      {selectedInvoice && invoices.find(i => i.id === selectedInvoice) && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="max-w-4xl mx-auto border-2 border-slate-300 p-8 bg-white">
            {settings && (() => {
              const invoice = invoices.find(i => i.id === selectedInvoice)!;
              return (
                <>
                  <div className="flex justify-between mb-8 pb-6 border-b-2 border-slate-300">
                    <div>
                      <h2 className="text-2xl font-bold">{settings.company_name}</h2>
                      <p className="text-sm text-slate-600">{settings.company_address}</p>
                      <p className="text-sm text-slate-600">Tél: {settings.company_phone}</p>
                    </div>
                    <div className="text-right">
                      <h1 className="text-3xl font-bold text-blue-600">FACTURE</h1>
                      <p className="text-sm">{invoice.invoice_number}</p>
                      <p className="text-sm">{new Date(invoice.invoice_date).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="font-bold mb-2">Client</h3>
                      <p className="font-bold">{invoice.clients?.name}</p>
                      {invoice.clients?.address && <p className="text-sm">{invoice.clients.address}</p>}
                      {invoice.clients?.phone && <p className="text-sm">Tél: {invoice.clients.phone}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-sm"><strong>Statut:</strong> {
                        invoice.payment_status === 'paid' ? 'Payée' :
                        invoice.payment_status === 'partial' ? 'Partiellement payée' : 'En attente'
                      }</p>
                    </div>
                  </div>

                  <table className="w-full mb-8">
                    <thead>
                      <tr className="border-b-2 border-slate-300">
                        <th className="text-left py-2">Description</th>
                        <th className="text-right py-2">Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="py-2">Services facturés</td>
                        <td className="text-right py-2">{invoice.subtotal.toFixed(2)} €</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="flex justify-end mb-8">
                    <div className="w-80">
                      <div className="flex justify-between py-2 border-b border-slate-200">
                        <span>Sous-total:</span>
                        <span>{invoice.subtotal.toFixed(2)} €</span>
                      </div>
                      {invoice.discount_amount > 0 && (
                        <div className="flex justify-between py-2 border-b border-slate-200">
                          <span>Remise:</span>
                          <span>-{invoice.discount_amount.toFixed(2)} €</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-b border-slate-200">
                        <span>TVA:</span>
                        <span>{invoice.tax_amount.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between py-3 border-t-2 border-slate-300 font-bold text-lg">
                        <span>TOTAL:</span>
                        <span>{invoice.total_amount.toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>

                  {invoice.notes && (
                    <div className="border-t-2 border-slate-300 pt-4">
                      <h4 className="font-bold mb-2">Notes:</h4>
                      <p className="text-sm">{invoice.notes}</p>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
