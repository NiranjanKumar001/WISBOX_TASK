import React, { useState } from "react";
import { Plus, Trash2, MapPin } from "lucide-react";
import CreateStoreModal from "./CreateStoreModal";

export default function StoreSelector({ stores, selectedStoreId, setSelectedStoreId, onCreateStore, onDeleteStore }) {
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

  function handleDeleteClick(e, store) {
    e.stopPropagation();

    if (stores.length === 1) {
      alert("Cannot delete the last remaining store!");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete store "${store.name}"?`
    );

    if (confirmDelete && onDeleteStore) {
      onDeleteStore(store.storeId);
    }
  }

  return (
    <div className="bg-white border-2 border-black rounded-[20px] p-4 shadow-xs mb-6">
      
      {/* Store Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Store Tabs */}
        <div className="flex flex-wrap items-center gap-2.5">
          {stores.map((store) => {
            const isSelected = store.storeId === selectedStoreId;
            return (
              <div
                key={store.storeId}
                className={`group flex items-center rounded-full border-2 border-black transition-all shadow-xs ${
                  isSelected
                    ? "bg-sky-200 text-slate-950 font-black"
                    : "bg-white text-slate-800 hover:bg-slate-100 font-bold"
                }`}
              >
                <button
                  onClick={() => setSelectedStoreId(store.storeId)}
                  className="flex items-center space-x-1.5 px-4 py-2 text-xs"
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? "text-slate-950" : "text-slate-700"}`} />
                  <span>{store.name}</span>
                </button>

                {onDeleteStore && (
                  <button
                    onClick={(e) => handleDeleteClick(e, store)}
                    title={`Delete ${store.name}`}
                    className="pr-3 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600 hover:text-rose-800" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Add New Store Button */}
          {onCreateStore && (
            <button
              onClick={() => setIsStoreModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border-2 border-black text-xs font-extrabold transition-all shadow-xs"
              title="Add New Vendor Store"
            >
              <Plus className="w-4 h-4 text-emerald-900" />
              <span>Add Store</span>
            </button>
          )}
        </div>

      </div>

      {/* Modal to add store */}
      {onCreateStore && (
        <CreateStoreModal
          isOpen={isStoreModalOpen}
          onClose={() => setIsStoreModalOpen(false)}
          onCreateStore={onCreateStore}
        />
      )}

    </div>
  );
}
