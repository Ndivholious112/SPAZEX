import React from 'react';
import { formatCurrency } from '../../../utils/formatters';

const SalesTable = ({ rows }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm text-gray-500">Date</th>
            <th className="px-4 py-3 text-left text-sm text-gray-500">Order #</th>
            <th className="px-4 py-3 text-left text-sm text-gray-500">Customer</th>
            <th className="px-4 py-3 text-right text-sm text-gray-500">Amount</th>
            <th className="px-4 py-3 text-right text-sm text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-3 text-sm text-gray-700">{r.date}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{r.order}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{r.customer}</td>
              <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatCurrency(r.amount)}</td>
              <td className="px-4 py-3 text-sm text-right">
                <span className={`px-3 py-1 rounded-full text-xs ${r.status === 'Paid' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
