import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Plus,
  Minus,
  AlertTriangle,
  History,
  CheckCircle,
  RefreshCw,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  X,
} from 'lucide-react';

import { inventoryAPI, productsAPI } from '../../services/api';

export const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUnits: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Stock Adjustment Modal State
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustType, setAdjustType] = useState('INCREASE'); // 'INCREASE' | 'DECREASE' | 'SET'
  const [changeAmount, setChangeAmount] = useState('');
  const [reason, setReason] = useState('Received Festive Shipment');
  const [note, setNote] = useState('');
  const [adjustError, setAdjustError] = useState('');
  const [adjusting, setAdjusting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const [prodData, logData, overviewData] = await Promise.all([
        productsAPI.getAll({ limit: 100, includeHidden: 'true' }),
        inventoryAPI.getLogs({ limit: 30 }),
        inventoryAPI.getOverview(),
      ]);

      setProducts(prodData.products || []);
      setLogs(logData.logs || []);
      if (overviewData.stats) setStats(overviewData.stats);
    } catch (err) {
      console.error('Error fetching inventory data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const openAdjustModal = (product) => {
    setSelectedProduct(product);
    setAdjustType('INCREASE');
    setChangeAmount('');
    setReason('Received Festive Shipment');
    setNote('');
    setAdjustError('');
    setIsAdjustModalOpen(true);
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    setAdjustError('');

    const amount = Number(changeAmount);
    if (isNaN(amount) || amount <= 0) {
      setAdjustError('Please specify a positive number of units.');
      return;
    }

    if (adjustType === 'DECREASE' && amount > selectedProduct.stock) {
      setAdjustError(
        `Cannot deduct ${amount} units. Current stock is only ${selectedProduct.stock}. Negative inventory is prevented.`
      );
      return;
    }

    setAdjusting(true);

    try {
      await inventoryAPI.adjustStock({
        productId: selectedProduct._id,
        change: amount,
        type: adjustType,
        reason,
        note,
      });

      setSuccessToast(`Stock updated successfully for "${selectedProduct.name}".`);
      setIsAdjustModalOpen(false);
      fetchInventoryData();
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      setAdjustError(err.message || 'Error recording inventory adjustment.');
    } finally {
      setAdjusting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.category?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">
            Inventory & Stock Audit Logs
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain real-time stock levels, record shipment receipts, and inspect audit adjustment history.
          </p>
        </div>

        <button
          onClick={fetchInventoryData}
          disabled={loading}
          className="p-2.5 rounded-xl bg-midnight-900 border border-slate-800 text-slate-300 hover:text-white transition-colors self-start sm:self-auto flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-midnight-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Units in Stock</span>
            <Boxes className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-display font-bold text-2xl text-slate-100">
            {stats.totalUnits.toLocaleString('en-IN')} units
          </div>
          <span className="text-[11px] text-slate-400">Across {stats.totalProducts} firework catalogue items</span>
        </div>

        <div className="p-5 rounded-2xl bg-midnight-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-display font-bold text-2xl text-amber-400">
            {stats.lowStockCount} items
          </div>
          <span className="text-[11px] text-slate-400">Items at or below low-stock threshold</span>
        </div>

        <div className="p-5 rounded-2xl bg-midnight-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Out of Stock</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="font-display font-bold text-2xl text-rose-400">
            {stats.outOfStockCount} items
          </div>
          <span className="text-[11px] text-slate-400">Currently zero inventory</span>
        </div>
      </div>

      {/* Real-Time Stock Table */}
      <div className="rounded-2xl bg-midnight-900 border border-slate-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <h2 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
            <Boxes className="w-4 h-4 text-festive-gold" />
            Current Fireworks Stock Levels
          </h2>

          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Filter by product or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-midnight-950 border border-slate-700 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-festive-gold"
            />
            <Search className="absolute left-3 top-2 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-midnight-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Firework Item</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Available Stock</th>
                <th className="p-3 text-right">Threshold</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProducts.map((p) => {
                const isLow = p.stock <= (p.lowStockThreshold || 10);
                const isOut = p.stock <= 0;

                return (
                  <tr key={p._id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-100">{p.name}</td>
                    <td className="p-3 font-mono text-[11px] text-festive-gold">{p.sku}</td>
                    <td className="p-3 text-slate-400">{p.category?.name || 'Unassigned'}</td>
                    <td className="p-3 text-right font-bold text-slate-100 text-sm">
                      {p.stock}
                    </td>
                    <td className="p-3 text-right text-slate-400">{p.lowStockThreshold}</td>
                    <td className="p-3 text-center">
                      {isOut ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 text-[10px] font-bold animate-pulse">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium">
                          Optimal
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => openAdjustModal(p)}
                        className="px-3 py-1.5 rounded-lg bg-festive-gold/15 hover:bg-festive-gold text-festive-gold hover:text-midnight-950 border border-festive-gold/30 text-xs font-bold transition-all"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Adjustment Audit History Log */}
      <div className="rounded-2xl bg-midnight-900 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
            <History className="w-4 h-4 text-festive-gold" />
            Inventory Adjustment Audit Trail
          </h2>
          <span className="text-xs text-slate-400">
            Recorded change history with operator & reasons
          </span>
        </div>

        {logs.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No inventory adjustments recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-midnight-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3 text-right">Change</th>
                  <th className="p-3 text-right">New Quantity</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {logs.map((log) => {
                  const isPositive = log.change > 0;
                  const dateStr = new Date(log.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  });

                  return (
                    <tr key={log._id} className="hover:bg-slate-800/40">
                      <td className="p-3 text-slate-400 whitespace-nowrap">{dateStr}</td>
                      <td className="p-3 font-semibold text-slate-100">{log.productName}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-400">{log.sku}</td>
                      <td className="p-3 text-right">
                        <span
                          className={`inline-flex items-center gap-0.5 font-bold px-2 py-0.5 rounded ${
                            isPositive
                              ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-950/70 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {isPositive ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {isPositive ? `+${log.change}` : log.change}
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-slate-100">
                        {log.newStock}
                      </td>
                      <td className="p-3">
                        <span className="font-medium text-slate-200 block">
                          {log.reason}
                        </span>
                        {log.note && (
                          <span className="text-[10px] text-slate-400 block">
                            {log.note}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-400">{log.adjustedBy || 'Admin'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjust Stock Modal */}
      {isAdjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-midnight-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-midnight-900 border border-festive-gold/30 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAdjustModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-lg text-slate-100">
              Adjust Stock Quantity
            </h3>

            <div className="p-3 rounded-xl bg-midnight-950 border border-slate-800 text-xs text-slate-300">
              <span className="block font-semibold text-slate-100 text-sm">
                {selectedProduct.name}
              </span>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span>SKU: {selectedProduct.sku}</span>
                <span>
                  Current Stock:{' '}
                  <strong className="text-festive-gold text-xs">
                    {selectedProduct.stock} units
                  </strong>
                </span>
              </div>
            </div>

            {adjustError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{adjustError}</span>
              </div>
            )}

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Adjustment Action
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('INCREASE')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${
                      adjustType === 'INCREASE'
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-midnight-950 border-slate-700 text-slate-300'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add (+)
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType('DECREASE')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${
                      adjustType === 'DECREASE'
                        ? 'bg-rose-600 border-rose-500 text-white'
                        : 'bg-midnight-950 border-slate-700 text-slate-300'
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                    Deduct (-)
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustType('SET')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-colors ${
                      adjustType === 'SET'
                        ? 'bg-festive-gold border-festive-gold text-midnight-950'
                        : 'bg-midnight-950 border-slate-700 text-slate-300'
                    }`}
                  >
                    Set Exact
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Units Count *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={changeAmount}
                  onChange={(e) => setChangeAmount(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-festive-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Adjustment Reason *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-festive-gold"
                >
                  <option value="Received Festive Shipment">Received Festive Shipment</option>
                  <option value="Direct Store Floor Sale">Direct Store Floor Sale</option>
                  <option value="Festive Pre-Order Allotment">Festive Pre-Order Allotment</option>
                  <option value="Damaged / Discarded Stock">Damaged / Discarded Stock</option>
                  <option value="Stock Audit Correction">Stock Audit Correction</option>
                  <option value="Customer Return">Customer Return</option>
                  <option value="Other">Other Adjustment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Internal Audit Note (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Verified batch from Sivakasi factory"
                  className="w-full bg-midnight-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-festive-gold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={adjusting}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-festive-gradient text-midnight-950 hover:shadow-gold disabled:opacity-50 transition-all"
                >
                  {adjusting ? 'Updating Stock...' : 'Save Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
