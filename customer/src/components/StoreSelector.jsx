import React from "react";
import { MapPin } from "lucide-react";

export default function StoreSelector({ stores, selectedStoreId, setSelectedStoreId }) {
  return (
    <div className="bg-white border-2 border-black rounded-[20px] p-4 shadow-xs mb-6">
      
      {/* Store Tabs */}
      <div className="flex flex-wrap items-center gap-2.5">
        {stores.map((store) => {
          const isSelected = store.storeId === selectedStoreId;
          return (
            <button
              key={store.storeId}
              onClick={() => setSelectedStoreId(store.storeId)}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full border-2 border-black text-xs font-black transition-all ${
                isSelected
                  ? "bg-sky-200 text-slate-950 shadow-xs"
                  : "bg-white text-slate-800 hover:bg-slate-100"
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-slate-950" : "text-slate-700"}`} />
              <span>{store.name}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
