import React from 'react';
import { formatCurrency } from '../../../utils/formatters';
import { FiTrash2 } from 'react-icons/fi';

const SalesTable = ({ rows, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm text-gray-500">Date</th>
            <th className="px-4 py-3 text-left text-sm text-gray-500">Order #</th>
            <th className="px-4 py-3 text-left text-sm text-gray-500">Customer</th>
            <th className="px-4 py-3 text-left text-sm text-gray-500">Product Details</th>
            <th className="px-4 py-3 text-right text-sm text-gray-500">Amount</th>
            <th className="px-4 py-3 text-right text-sm text-gray-500">Status</th>
            <th className="px-4 py-3 text-right text-sm text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-700">{r.date}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{r.order}</td>
              <td className="px-4 py-3 text-sm text-gray-700 font-semibold">{r.customer}</td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {r.productName ? `${r.quantity || 1}x ${r.productName}` : 'N/A'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 text-right font-bold">{formatCurrency(r.amount)}</td>
              <td className="px-4 py-3 text-sm text-right">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${r.status === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                  {r.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-right">
                <button 
                  onClick={() => onDelete && onDelete(r.id)} 
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Delete sale and restore stock"
                >
                  <FiTrash2 className="inline w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                No sales recorded. Click "+ New Sale" to start.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
