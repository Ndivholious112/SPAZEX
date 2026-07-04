import React, { useState } from 'react';
import { getInvoices } from '../../services/api';
import api from '../../services/api';
import useSWR, { mutate } from 'swr';

const statusStyles = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Overdue: 'bg-red-100 text-red-700',
};

const Invoices = () => {
  const fetcher = async () => await getInvoices();
  const { data: invoices = [] } = useSWR('invoices', fetcher);

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    saleRef: '',
    paymentMethod: 'card',
    amount: '',
    date: new Date().toISOString().slice(0,10),
    dueDate: '',
    status: 'Pending'
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const saveInvoice = async () => {
    const payload = {
      saleRef: form.saleRef || `manual-${Date.now().toString(36)}`,
      paymentMethod: form.paymentMethod,
      amount: parseFloat(form.amount) || 0,
      date: form.date,
      dueDate: form.dueDate || '',
      status: form.status || 'Pending'
    };
    try {
      const created = await api.addInvoice(payload);
      // refresh SWR cache
      const latest = await api.getInvoices();
      mutate('invoices', latest, false);
      setShowAddModal(false);
      // reset form
      setForm({ saleRef: '', paymentMethod: 'card', amount: '', date: new Date().toISOString().slice(0,10), dueDate: '', status: 'Pending' });
      console.debug('Manual invoice created', created);
    } catch (e) {
      console.error('Failed to create manual invoice', e);
      alert('Failed to create invoice. See console for details.');
    }
  };

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Invoices</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Track invoices from dashboard sales by payment method and status.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto bg-[#C4D9FF] text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-[#C5BAFE] transition-all">
          + New Invoice
        </button>
      </div>

      {/* Add Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold">Create Invoice</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Sale Reference</label>
                <input name="saleRef" value={form.saleRef} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. sale-1234 or order #" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Payment Method</label>
                <select name="paymentMethod" value={form.paymentMethod} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-lg">
                  <option value="card">Card</option>
                  <option value="cash">Cash</option>
                  <option value="eft">EFT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Amount (R)</label>
                <input name="amount" value={form.amount} onChange={handleFormChange} type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg" placeholder="0.00" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Date</label>
                  <input name="date" value={form.date} onChange={handleFormChange} type="date" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Due Date</label>
                  <input name="dueDate" value={form.dueDate} onChange={handleFormChange} type="date" className="w-full px-3 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <select name="status" value={form.status} onChange={handleFormChange} className="w-full px-3 py-2 border rounded-lg">
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button onClick={saveInvoice} className="px-4 py-2 rounded-lg bg-blue-600 text-white">Save Invoice</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Total Invoices</p>
          <p className="text-2xl font-bold text-gray-800">{invoices.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">Outstanding</p>
          <p className="text-2xl font-bold text-gray-800">{invoices.filter((invoice) => invoice.status !== 'Paid').length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:col-span-2 xl:col-span-1">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-2xl font-bold text-gray-800">R {invoices.reduce((total, invoice) => total + invoice.amount, 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-[11px] sm:text-xs font-semibold text-gray-600 uppercase">Invoice</th>
                <th className="px-3 sm:px-6 py-3 text-left text-[11px] sm:text-xs font-semibold text-gray-600 uppercase">Sale</th>
                <th className="px-3 sm:px-6 py-3 text-left text-[11px] sm:text-xs font-semibold text-gray-600 uppercase">Payment</th>
                <th className="px-3 sm:px-6 py-3 text-left text-[11px] sm:text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-3 sm:px-6 py-3 text-left text-[11px] sm:text-xs font-semibold text-gray-600 uppercase">Due</th>
                <th className="px-3 sm:px-6 py-3 text-left text-[11px] sm:text-xs font-semibold text-gray-600 uppercase">Amount</th>
                <th className="px-3 sm:px-6 py-3 text-left text-[11px] sm:text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 font-medium text-gray-800">{invoice.id}</td>
                  <td className="px-3 sm:px-6 py-4 text-gray-600">{invoice.saleRef}</td>
                  <td className="px-3 sm:px-6 py-4 text-gray-600">{invoice.paymentMethod}</td>
                  <td className="px-3 sm:px-6 py-4 text-gray-600">{invoice.date}</td>
                  <td className="px-3 sm:px-6 py-4 text-gray-600">{invoice.dueDate}</td>
                  <td className="px-3 sm:px-6 py-4 text-gray-600">R {invoice.amount.toLocaleString()}</td>
                  <td className="px-3 sm:px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[invoice.status] || 'bg-gray-100 text-gray-700'}`}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden space-y-3 p-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Invoice</p>
                  <p className="font-semibold text-gray-900">{invoice.id}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyles[invoice.status] || 'bg-gray-100 text-gray-700'}`}>
                  {invoice.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Sale</p>
                  <p>{invoice.saleRef}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Payment</p>
                  <p>{invoice.paymentMethod}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Date</p>
                  <p>{invoice.date}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Due</p>
                  <p>{invoice.dueDate}</p>
                </div>
                <div className="col-span-2 space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">Amount</p>
                  <p className="font-semibold text-gray-900">R {invoice.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Invoices;
