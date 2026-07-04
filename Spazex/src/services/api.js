// Lightweight frontend-only mock API using localStorage
const wait = (ms = 250) => new Promise((res) => setTimeout(res, ms));

const STORAGE_KEYS = {
  inventory: 'spazex_inventory',
  sales: 'spazex_sales',
  invoices: 'spazex_invoices',
  suppliers: 'spazex_suppliers'
};

const read = (key, fallback = []) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (e) {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  if (key.includes(STORAGE_KEYS.inventory)) {
    window.dispatchEvent(new Event('spazex_inventory_updated'));
  }
  if (key.includes(STORAGE_KEYS.sales)) {
    window.dispatchEvent(new Event('spazex_sales_updated'));
  }
  if (key.includes(STORAGE_KEYS.invoices)) {
    window.dispatchEvent(new Event('spazex_invoices_updated'));
  }
};

export const getUserKey = (baseKey) => {
  try {
    const user = JSON.parse(localStorage.getItem('spazex_user') || 'null');
    return user && user.uid ? `${baseKey}_${user.uid}` : baseKey;
  } catch (e) {
    return baseKey;
  }
};

// Inventory
export const getInventory = async () => {
  await wait();
  return read(getUserKey(STORAGE_KEYS.inventory), []);
};

export const saveInventory = async (items) => {
  await wait();
  write(getUserKey(STORAGE_KEYS.inventory), items || []);
  return items;
};

export const addInventoryItem = async (item) => {
  const key = getUserKey(STORAGE_KEYS.inventory);
  const items = read(key, []);
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const newItem = { id, ...item };
  items.unshift(newItem);
  write(key, items);
  await wait();
  return newItem;
};

export const updateInventoryItem = async (id, changes) => {
  const key = getUserKey(STORAGE_KEYS.inventory);
  const items = read(key, []);
  const updated = items.map((it) => (it.id === id ? { ...it, ...changes } : it));
  write(key, updated);
  await wait();
  return updated.find((i) => i.id === id);
};

export const removeInventoryItem = async (id) => {
  const key = getUserKey(STORAGE_KEYS.inventory);
  let items = read(key, []);
  items = items.filter((it) => it.id !== id);
  write(key, items);
  await wait();
  return true;
};

// Sales
export const getSales = async () => {
  await wait();
  return read(getUserKey(STORAGE_KEYS.sales), []);
};

export const addSale = async (sale) => {
  const key = getUserKey(STORAGE_KEYS.sales);
  const sales = read(key, []);
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const newSale = { id, createdAt: new Date().toISOString(), ...sale };
  sales.unshift(newSale);
  write(key, sales);
  await wait();
  return newSale;
};

export const removeSale = async (id) => {
  const key = getUserKey(STORAGE_KEYS.sales);
  const sales = read(key, []);
  const updated = sales.filter((item) => item.id !== id);
  write(key, updated);
  await wait();
  return true;
};

// Invoices
export const getInvoices = async () => {
  await wait();
  return read(getUserKey(STORAGE_KEYS.invoices), []);
};

export const addInvoice = async (invoice) => {
  const key = getUserKey(STORAGE_KEYS.invoices);
  const invoices = read(key, []);
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const newInv = { id, createdAt: new Date().toISOString(), ...invoice };
  invoices.unshift(newInv);
  write(key, invoices);
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
