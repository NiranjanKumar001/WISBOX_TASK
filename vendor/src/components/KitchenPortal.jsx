import React, { useState } from "react";
import { Play, CheckCircle2, XCircle, Plus, Clock, User, Package } from "lucide-react";
import CreateOrderModal from "./CreateOrderModal";

export default function KitchenPortal({ orders, storeId, onUpdateStatus, onCreateOrder }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");

  let filteredOrders = orders;
  if (statusFilter !== "ALL") {
    filteredOrders = orders.filter((order) => order.status === statusFilter);
  }

  function getStatusBadge(status) {
    if (status === "PLACED") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-200 text-sky-950 border-2 border-black uppercase tracking-wider shadow-2xs">
          PLACED
        </span>
      );
    }
    if (status === "PREPARING") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-200 text-amber-950 border-2 border-black uppercase tracking-wider shadow-2xs">
          PREPARING
        </span>
      );
    }
    if (status === "READY") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white border-2 border-black uppercase tracking-wider shadow-2xs">
          READY FOR PICKUP
        </span>
      );
    }
    if (status === "CANCELLED") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-200 text-rose-950 border-2 border-black uppercase tracking-wider shadow-2xs">
          CANCELLED
        </span>
      );
    }
    return null;
  }

  function getCardBgStyle(status) {
    if (status === "PLACED") {
      return "bg-sky-50/80";
    }
    if (status === "PREPARING") {
      return "bg-amber-50/80";
    }
    if (status === "READY") {
      return "bg-emerald-50/80";
    }
    if (status === "CANCELLED") {
      return "bg-rose-50/60 opacity-85";
    }
    return "bg-white";
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-[20px] border-2 border-black shadow-xs">
        
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            All Kitchen Orders
          </h2>
          <p className="text-xs text-slate-600 font-semibold mt-0.5">
            Manage live incoming kitchen tickets and update status in real time.
          </p>
        </div>

        {/* Action Button & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "PLACED", "PREPARING", "READY", "CANCELLED"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition-all border-2 border-black ${
                statusFilter === filter
                  ? "bg-sky-200 text-slate-950 shadow-xs"
                  : "bg-white text-slate-800 hover:bg-slate-100"
              }`}
            >
              {filter}
            </button>
          ))}

          {/* Create Order Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-full bg-amber-300 hover:bg-amber-400 text-slate-950 text-xs font-black border-2 border-black shadow-xs transition-all ml-1"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>New Order</span>
          </button>
        </div>

      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[20px] border-2 border-black shadow-xs">
          <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-black text-slate-900">No Orders Found</h3>
          <p className="text-xs text-slate-500 font-bold mt-1">No orders match the selected filter for this kitchen.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const itemCount = Array.isArray(order.items)
              ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
              : 0;

            return (
              <div
                key={order.id}
                className={`border-2 border-black rounded-[20px] p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${getCardBgStyle(order.status)}`}
              >
                <div>
                  
                  {/* Top Row: Timestamp on left, Status Badge on right */}
                  <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-700 pb-2.5 border-b-2 border-black/20">
                    <span className="flex items-center space-x-1.5 text-slate-800 font-extrabold">
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                      <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                    {getStatusBadge(order.status)}
                  </div>

                  {/* Second Row: Customer Subtitle & Avatar */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-slate-900" />
                      <span className="text-xs font-extrabold text-slate-900">
                        {order.customerName}
                      </span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-sky-200 text-slate-950 font-black text-[11px] flex items-center justify-center border-2 border-black shadow-2xs">
                      {order.customerName.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Order ID Title */}
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
                    {order.orderId}
                  </h3>

                  {/* Items Box */}
                  <div className="bg-white/90 border-2 border-black rounded-xl p-3.5 mb-4 shadow-2xs">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                      Order Items
                    </span>
                    <ul className="space-y-1.5">
                      {Array.isArray(order.items) &&
                        order.items.map((item, idx) => (
                          <li key={idx} className="text-xs font-black text-slate-900 flex justify-between">
                            <span>{item.name}</span>
                            <span className="font-black bg-slate-100 px-2 py-0.5 rounded-md border border-black">
                              x{item.quantity}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>

                </div>

                {/* Card Footer Row: Count on left, Solid Pill Action Button on right */}
                <div className="pt-3 border-t-2 border-black/20 flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    {itemCount} item{itemCount === 1 ? "" : "s"}
                  </span>

                  {/* Action Button */}
                  <div className="flex items-center space-x-1">
                    
                    {/* From PLACED -> PREPARING */}
                    {order.status === "PLACED" && (
                      <button
                        onClick={() => onUpdateStatus(order.id, "PREPARING")}
                        className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-amber-300 hover:bg-amber-400 text-slate-950 text-xs font-black border-2 border-black shadow transition-all"
                      >
                        <Play className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                        <span>Start Preparing</span>
                      </button>
                    )}

                    {/* From PREPARING -> READY */}
                    {order.status === "PREPARING" && (
                      <button
                        onClick={() => onUpdateStatus(order.id, "READY")}
                        className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black border-2 border-black shadow transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Ready</span>
                      </button>
                    )}

                    {/* Cancel Button */}
                    {order.status !== "CANCELLED" && (
                      <button
                        onClick={() => onUpdateStatus(order.id, "CANCELLED")}
                        className="p-2 rounded-full bg-white hover:bg-rose-100 text-slate-800 border-2 border-black text-xs font-black transition-all"
                        title="Cancel Order"
                      >
                        <XCircle className="w-4 h-4 text-rose-600" />
                      </button>
                    )}

                    {order.status === "CANCELLED" && (
                      <span className="text-xs text-rose-700 font-black italic">
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <CreateOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        storeId={storeId}
        onCreateOrder={onCreateOrder}
      />

    </div>
  );
}
