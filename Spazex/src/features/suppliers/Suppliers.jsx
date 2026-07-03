import React, { useEffect, useState } from 'react';
import './Suppliers.css';

const communityDirectory = {
  'Soweto, Orlando West': [
    { name: 'Orlando Cash & Carry', phone: '011 123 4567', rating: 4.8, note: 'Fast delivery on staple goods' },
    { name: 'Soweto Wholesale Depot', phone: '011 234 8910', rating: 4.6, note: 'Good for bread and milk stock' },
    { name: 'Mzanzi Foods', phone: '011 345 6789', rating: 4.5, note: 'Trusted by local spaza shops' },
  ],
  default: [
    { name: 'Local Stock Partner', phone: '011 987 6543', rating: 4.4, note: 'Verified supplier network' },
    { name: 'Reliable Wholesaler', phone: '011 876 5432', rating: 4.3, note: 'Order basics with a single tap' },
  ],
};

const Suppliers = () => {
  const [location] = useState('Soweto, Orlando West');
  const [communitySuppliers, setCommunitySuppliers] = useState([]);
  const [personalSuppliers, setPersonalSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({ name: '', phone: '' });

  useEffect(() => {
    setCommunitySuppliers(communityDirectory[location] || communityDirectory.default);
  }, [location]);

  const handleAddSupplier = (e) => {
    e.preventDefault();
    if (!newSupplier.name.trim() || !newSupplier.phone.trim()) return;
    setPersonalSuppliers((prev) => [...prev, { ...newSupplier, note: 'Added by you' }]);
    setNewSupplier({ name: '', phone: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 spx-suppliers">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Suppliers</h1>
          <p className="text-gray-600 mt-2">Instant supplier options plus easy personal onboarding.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="btn-primary">Quick-Snap Invoice</button>
          <button className="btn-secondary">Sync WhatsApp Contacts</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-6">
          <section className="card p-6">
            <div className="section-header">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Community Trust</h2>
                <p className="text-gray-600 mt-1">Top verified wholesalers near {location}.</p>
              </div>
              <span className="badge">Recommended</span>
            </div>

            <div className="space-y-3 mt-6">
              {communitySuppliers.map((supplier) => (
                <div key={supplier.name} className="supplier-card">
                  <div>
                    <p className="font-semibold text-gray-900">{supplier.name}</p>
                    <p className="text-sm text-gray-600">{supplier.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-700">{supplier.phone}</p>
                    <p className="text-sm text-green-700">{supplier.rating} ★</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-6">
            <div className="section-header">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add your own supplier</h2>
                <p className="text-gray-600 mt-1">No need for long data entry — just name and number.</p>
              </div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleAddSupplier}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="field-label">
                  Name
                  <input
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                    className="field-input"
                    placeholder="Supplier name"
                    required
                  />
                </label>
                <label className="field-label">
                  Phone
                  <input
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    className="field-input"
                    placeholder="Phone number"
                    required
                  />
                </label>
              </div>
              <button type="submit" className="btn-primary w-full sm:w-auto">Save Supplier</button>
            </form>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card p-6 bg-[#F8FAFC]">
            <h2 className="text-xl font-semibold text-gray-900">Why this works</h2>
            <p className="text-gray-600 mt-3">You start with trusted local wholesalers, then add personal contacts from WhatsApp or invoices later. That means no blank screen and no extra work at setup.</p>
          </section>

          <section className="card p-6">
            <div className="section-header">
              <h2 className="text-xl font-semibold text-gray-900">Your suppliers</h2>
            </div>

            {personalSuppliers.length ? (
              <div className="space-y-3 mt-4">
                {personalSuppliers.map((supplier) => (
                  <div key={supplier.name} className="supplier-card">
                    <div>
                      <p className="font-semibold text-gray-900">{supplier.name}</p>
                      <p className="text-sm text-gray-600">{supplier.note}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-700">{supplier.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-4">No personal suppliers yet. Add one quickly with name and phone.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Suppliers;
