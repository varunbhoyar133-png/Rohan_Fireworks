import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Boxes,
  AlertTriangle,
  FileText,
  IndianRupee,
  ArrowRight,
  Plus,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { inventoryAPI, enquiriesAPI, productsAPI } from '../../services/api';

export const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUnits: 0,
    totalValuation: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });

  const [lowStockList, setLowStockList] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invData, lowData, enqData] = await Promise.all([
        inventoryAPI.getOverview(),
        inventoryAPI.getLowStock(),
        enquiriesAPI.getAll({ limit: 5 }),
      ]);

      if (invData.stats) setStats(invData.stats);
      if (lowData.products) setLowStockList(lowData.products);
      if (enqData.enquiries) setRecentEnquiries(enqData.enquiries);
    } catch (err) {
      console.error('Error fetching admin dashboard overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-100">
            Store Performance Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time inventory levels, stock warnings, and festive customer enquiries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-midnight-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            to="/admin/products?action=new"
            className="px-4 py-2.5 rounded-xl bg-festive-gradient text-midnight-950 text-xs font-bold flex items-center gap-1.5 shadow-gold hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Products */}
        <div className="p-5 rounded-2xl bg-midnight-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Fireworks</span>
            <div className="p-2 rounded-lg bg-midnight-950 text-festive-gold">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-2xl text-slate-100">
            {stats.totalProducts}
          </div>
          <Link
            to="/admin/products"
            className="text-[11px] text-festive-gold hover:underline font-medium inline-flex items-center gap-1 pt-1"
          >
            Manage Products <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Total Inventory Units */}
        <div className="p-5 rounded-2xl bg-midnight-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Units in Stock</span>
            <div className="p-2 rounded-lg bg-midnight-950 text-emerald-400">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-2xl text-slate-100">
            {stats.totalUnits.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            Physical stock count
          </span>
        </div>

        {/* Stock Valuation */}
        <div className="p-5 rounded-2xl bg-midnight-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Inventory Valuation</span>
            <div className="p-2 rounded-lg bg-midnight-950 text-amber-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-2xl text-slate-100">
            ₹{stats.totalValuation.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            Total catalogue asset value
          </span>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-5 rounded-2xl bg-midnight-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Low Stock Alerts</span>
            <div className="p-2 rounded-lg bg-midnight-950 text-amber-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-2xl text-amber-400">
            {stats.lowStockCount}
          </div>
          <Link
            to="/admin/inventory"
            className="text-[11px] text-amber-400 hover:underline font-medium inline-flex items-center gap-1 pt-1"
          >
            Review Low Stock <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Customer Enquiries */}
        <div className="p-5 rounded-2xl bg-midnight-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Enquiries</span>
            <div className="p-2 rounded-lg bg-midnight-950 text-festive-orange">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-bold text-2xl text-slate-100">
            {recentEnquiries.length}
          </div>
          <Link
            to="/admin/enquiries"
            className="text-[11px] text-festive-orange hover:underline font-medium inline-flex items-center gap-1 pt-1"
          >
            View Quotations <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Low Stock Warning Banner if applicable */}
      {stats.lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <strong className="text-amber-300 font-semibold block sm:inline mr-2">
                Inventory Alert:
              </strong>
              <span>
                There are {stats.lowStockCount} item(s) running below their low-stock threshold. Restock before festive rush!
              </span>
            </div>
          </div>
          <Link
            to="/admin/inventory"
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-midnight-950 font-bold whitespace-nowrap self-start sm:self-auto hover:bg-amber-400 transition-colors"
          >
            Manage Inventory
          </Link>
        </div>
      )}

      {/* Grid: Low Stock Table & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Table */}
        <div className="rounded-3xl bg-midnight-900 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Low Stock Warnings
            </h2>
            <Link
              to="/admin/inventory"
              className="text-xs text-festive-gold hover:underline font-semibold"
            >
              View All
            </Link>
          </div>

          {lowStockList.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              All fireworks products have healthy stock levels above threshold.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="pb-2">Product Name</th>
                    <th className="pb-2">SKU</th>
                    <th className="pb-2 text-right">Available</th>
                    <th className="pb-2 text-right">Threshold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {lowStockList.slice(0, 5).map((p) => (
                    <tr key={p._id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 font-medium text-slate-100 truncate max-w-[150px]">
                        {p.name}
                      </td>
                      <td className="py-2.5 font-mono text-[11px] text-slate-400">
                        {p.sku}
                      </td>
                      <td className="py-2.5 text-right font-bold text-amber-400">
                        {p.stock} units
                      </td>
                      <td className="py-2.5 text-right text-slate-400">
                        {p.lowStockThreshold}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Enquiries Table */}
        <div className="rounded-3xl bg-midnight-900 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-display font-bold text-lg text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-festive-gold" />
              Recent Festive Enquiries
            </h2>
            <Link
              to="/admin/enquiries"
              className="text-xs text-festive-gold hover:underline font-semibold"
            >
              View All
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No customer enquiries submitted yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="text-[10px] uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="pb-2">Ref #</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2 text-right">Est. Value</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {recentEnquiries.slice(0, 5).map((enq) => (
                    <tr key={enq._id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 font-mono text-[11px] text-festive-gold">
                        {enq.enquiryNumber}
                      </td>
                      <td className="py-2.5">
                        <span className="font-medium text-slate-100 block">
                          {enq.customerName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {enq.city}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-bold text-slate-100">
                        ₹{enq.totalEstimatedValue?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-festive-gold/15 text-festive-gold border border-festive-gold/30">
                          {enq.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
