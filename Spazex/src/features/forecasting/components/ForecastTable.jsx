import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/formatters';
import { FiShoppingCart, FiZap } from 'react-icons/fi';

const ForecastTable = ({ rows = [], onRestock }) => {
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
            <tr key={r.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-700 font-semibold">{r.name}</td>
              <td className="px-4 py-3 text-sm text-gray-700 text-right font-medium">{r.predicted}</td>
              <td className="px-4 py-3 text-sm text-gray-700 text-right">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${r.suggestOrder > 0 ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                  {r.suggestOrder}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 text-right font-bold">{formatCurrency(r.predicted * r.price)}</td>
              <td className="px-4 py-3 text-sm text-gray-700 text-right">
                <div className="flex justify-end gap-2 text-xs">
                  <Link 
                    to={`/suppliers?item=${encodeURIComponent(r.name)}`} 
                    className="inline-flex items-center gap-1 bg-[#E8F9FF] text-gray-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-[#C4D9FF] hover:text-gray-900 transition-colors"
                  >
                    <FiShoppingCart className="w-3.5 h-3.5" />
                    <span>Quote</span>
                  </Link>

                  {r.suggestOrder > 0 && (
                    <button
                      onClick={() => onRestock && onRestock(r.id, r.suggestOrder)}
                      className="inline-flex items-center gap-1 bg-[#C5BAFF] text-gray-800 px-3 py-1.5 rounded-lg font-bold hover:bg-[#b0a4ff] hover:text-black transition-colors"
                      title="One-click add stock to inventory"
                    >
                      <FiZap className="w-3.5 h-3.5" />
                      <span>Restock</span>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ForecastTable;
