import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatters';

const ForecastTable = ({ rows = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm text-gray-500">Product</th>
            <th className="px-4 py-3 text-right text-sm text-gray-500">Predicted Units</th>
            <th className="px-4 py-3 text-right text-sm text-gray-500">Suggested Order</th>
            <th className="px-4 py-3 text-right text-sm text-gray-500">Predicted Revenue</th>
            <th className="px-4 py-3 text-right text-sm text-gray-500">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-3 text-sm text-gray-700">{r.name}</td>
              <td className="px-4 py-3 text-sm text-gray-700 text-right">{r.predicted}</td>
              <td className="px-4 py-3 text-sm text-gray-700 text-right">{r.suggestOrder}</td>
              <td className="px-4 py-3 text-sm text-gray-700 text-right">{formatCurrency(r.predicted * r.price)}</td>
              <td className="px-4 py-3 text-sm text-gray-700 text-right">
                <Link to={`/suppliers?item=${encodeURIComponent(r.name)}`} className="inline-block bg-[#C4D9FF] text-gray-800 px-3 py-1 rounded-md font-medium hover:bg-[#C5BAFE]">
                  Order
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ForecastTable;
