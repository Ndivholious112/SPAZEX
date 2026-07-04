// Lightweight frontend-only mock API using localStorage
const wait = (ms = 250) => new Promise((res) => setTimeout(res, ms));

const read = (key, fallback = []) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (e) {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Inventory
export const getInventory = async () => {
  await wait();
  return read('spazex_inventory', []);
};

export const saveInventory = async (items) => {
  await wait();
  write('spazex_inventory', items || []);
  return items;
};

export const addInventoryItem = async (item) => {
  const items = read('spazex_inventory', []);
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const newItem = { id, ...item };
  items.unshift(newItem);
  write('spazex_inventory', items);
  await wait();
  return newItem;
};

export const updateInventoryItem = async (id, changes) => {
  const items = read('spazex_inventory', []);
  const updated = items.map((it) => (it.id === id ? { ...it, ...changes } : it));
  write('spazex_inventory', updated);
  await wait();
  return updated.find((i) => i.id === id);
};

export const removeInventoryItem = async (id) => {
  let items = read('spazex_inventory', []);
  items = items.filter((it) => it.id !== id);
  write('spazex_inventory', items);
  await wait();
  return true;
};

// Sales
export const getSales = async () => {
  await wait();
  return read('spazex_sales', []);
};

export const addSale = async (sale) => {
  const sales = read('spazex_sales', []);
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const newSale = { id, createdAt: new Date().toISOString(), ...sale };
  sales.unshift(newSale);
  write('spazex_sales', sales);
  await wait();
  return newSale;
};

// Invoices
export const getInvoices = async () => {
  await wait();
  return read('spazex_invoices', []);
};

export const addInvoice = async (invoice) => {
  const invoices = read('spazex_invoices', []);
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const newInv = { id, createdAt: new Date().toISOString(), ...invoice };
  invoices.unshift(newInv);
  write('spazex_invoices', invoices);
  await wait();
  return newInv;
};

// Suppliers
export const getSuppliers = async () => {
  await wait();
  return read('spazex_suppliers', []);
};

export const addSupplier = async (supplier) => {
  const list = read('spazex_suppliers', []);
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const newS = { id, ...supplier };
  list.unshift(newS);
  write('spazex_suppliers', list);
  await wait();
  return newS;
};

export default {
  getInventory,
  saveInventory,
  addInventoryItem,
  updateInventoryItem,
  removeInventoryItem,
  getSales,
  addSale,
  getInvoices,
  addInvoice,
  getSuppliers,
  addSupplier,
};
