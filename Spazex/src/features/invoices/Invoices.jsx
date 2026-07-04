import React from 'react';
import { getInvoices } from '../../services/api';
import useSWR from 'swr';

const statusStyles = {
  Paid: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Overdue: 'bg-red-100 text-red-700',
};

const Invoices = () => {
  const fetcher = async () => await getInvoices();
  const { data: invoices = [] } = useSWR('invoices', fetcher);

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Invoices</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Track invoices from dashboard sales by payment method and status.</p>
        </div>
        <button className="w-full sm:w-auto bg-[#C4D9FF] text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-[#C5BAFE] transition-all">
          + New Invoice
        </button>
      </div>

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
