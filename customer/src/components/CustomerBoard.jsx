import React, { useEffect, useState } from "react";
import { Clock, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

function playReadyChime(isMuted) {
  if (isMuted) {
    return;
  }
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return;
    }
    const ctx = new AudioContext();

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.5);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(987.77, ctx.currentTime + 0.15);
    gain2.gain.setValueAtTime(0.4, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.8);
  } catch (error) {
    console.error("Audio chime error:", error);
  }
}

export default function CustomerBoard({ orders, lastUpdatedOrderId, isMuted }) {
  const [pulseOrderId, setPulseOrderId] = useState(null);

  useEffect(() => {
    if (!lastUpdatedOrderId) {
      return;
    }

    const updatedOrder = orders.find((o) => o.id === lastUpdatedOrderId);
    if (updatedOrder && updatedOrder.status === "READY") {
      setPulseOrderId(lastUpdatedOrderId);
      playReadyChime(isMuted);

      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Ignore if confetti unavailable
      }

      const timer = setTimeout(() => {
        setPulseOrderId(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [lastUpdatedOrderId, orders, isMuted]);

  const preparingOrders = orders.filter(
    (o) => o.status === "PLACED" || o.status === "PREPARING"
  );
  const readyOrders = orders.filter((o) => o.status === "READY");

  return (
    <div className="space-y-6">
      
      {/* Title Banner */}
      <div className="bg-white p-5 rounded-[20px] border-2 border-black shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Storefront Live Order Status Display
          </h2>
          <p className="text-xs text-slate-600 font-semibold mt-0.5">
            Real-time pickup status board. Listen for audio chime when your order is ready.
          </p>
        </div>
      </div>

      {/* Side by Side Customer Status Buckets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bucket 1: PREPARING */}
        <div className="bg-white border-2 border-black rounded-[20px] p-5 shadow-xs flex flex-col">
          <div className="flex items-center space-x-2.5 pb-3.5 mb-4 border-b-2 border-black">
            <Clock className="w-5 h-5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
            <div>
              <h3 className="text-xs font-black text-slate-900 tracking-wider uppercase">
                PREPARING IN KITCHEN
              </h3>
              <p className="text-[11px] text-amber-800 font-extrabold">
                {preparingOrders.length} order{preparingOrders.length === 1 ? "" : "s"} in progress
              </p>
            </div>
          </div>

          {preparingOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-400 flex-1 flex flex-col items-center justify-center">
              <Clock className="w-10 h-10 mb-2 opacity-40 text-slate-400" />
              <p className="text-xs font-bold text-slate-700">No orders preparing right now</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
              {preparingOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-amber-50/80 border-2 border-black p-4 rounded-xl flex items-center justify-between shadow-xs"
                >
                  <div>
                    <span className="text-xl font-black text-slate-900 tracking-tight">
                      {order.orderId}
                    </span>
                    <span className="block text-xs font-extrabold text-slate-800 mt-0.5">
                      {order.customerName}
                    </span>
                  </div>
                  <span className="text-[10px] px-3 py-1 rounded-full bg-amber-200 text-amber-950 font-black border-2 border-black uppercase tracking-wider">
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bucket 2: READY FOR PICKUP */}
        <div className="bg-white border-2 border-black rounded-[20px] p-5 shadow-xs flex flex-col">
          <div className="flex items-center space-x-2.5 pb-3.5 mb-4 border-b-2 border-black">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-xs font-black text-slate-900 tracking-wider uppercase">
                READY FOR PICKUP
              </h3>
              <p className="text-[11px] text-emerald-800 font-extrabold">
                {readyOrders.length} order{readyOrders.length === 1 ? "" : "s"} ready to collect
              </p>
            </div>
          </div>

          {readyOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-400 flex-1 flex flex-col items-center justify-center">
              <CheckCircle2 className="w-10 h-10 mb-2 opacity-40 text-slate-400" />
              <p className="text-xs font-bold text-slate-700">No ready orders at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1">
              {readyOrders.map((order) => {
                const isPulsing = pulseOrderId === order.id;
                return (
                  <div
                    key={order.id}
                    className={`bg-emerald-50/80 border-2 border-black p-4 rounded-xl flex items-center justify-between shadow-xs transition-all ${
                      isPulsing
                        ? "bg-emerald-200 animate-ready-pulse ring-4 ring-emerald-500/40"
                        : ""
                    }`}
                  >
                    <div>
                      <span className="text-xl font-black text-emerald-950 tracking-tight">
                        {order.orderId}
                      </span>
                      <span className="block text-xs font-black text-slate-900 mt-0.5">
                        {order.customerName}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-[10px] uppercase tracking-wider border-2 border-black shadow-xs">
                        READY
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
