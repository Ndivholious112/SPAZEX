import React from 'react';

const NewSale = ({ onAdd }) => {
  const [open, setOpen] = React.useState(false);
  const [customer, setCustomer] = React.useState('');
  const [amount, setAmount] = React.useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!customer || !amount) return;
    onAdd && onAdd({ id: Date.now(), date: new Date().toLocaleDateString(), order: `#${Math.floor(Math.random()*9000)+1000}`, customer, amount: parseFloat(amount), status: 'Paid' });
    setCustomer('');
    setAmount('');
    setOpen(false);
  };

  return (
    <div>
      <button onClick={() => setOpen(true)} className="bg-[#C4D9FF] text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-[#C5BAFE] transition-all">+ New Sale</button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form onSubmit={submit} className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">New Sale</h3>
            <label className="block text-sm text-gray-600">Customer</label>
            <input value={customer} onChange={(e)=>setCustomer(e.target.value)} className="w-full px-3 py-2 border rounded-lg mb-3" />
            <label className="block text-sm text-gray-600">Amount</label>
            <input value={amount} onChange={(e)=>setAmount(e.target.value)} type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg mb-4" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={()=>setOpen(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-[#C4D9FF]">Add</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewSale;
