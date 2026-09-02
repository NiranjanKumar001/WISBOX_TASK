import React, { useState } from "react";
import { X, Store } from "lucide-react";

export default function CreateStoreModal({ isOpen, onClose, onCreateStore }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a store name");
      return;
    }

    setIsSubmitting(true);
    await onCreateStore({
      name: name.trim(),
      location: location.trim()
    });
    setIsSubmitting(false);

    setName("");
    setLocation("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
      <div className="bg-white border-2 border-black rounded-[20px] w-full max-w-md p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b-2 border-black">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-sky-100 text-sky-950 border-2 border-black">
              <Store className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-slate-900">Add New Vendor Store</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
              Store Name
            </label>
            <input
              type="text"
              placeholder="e.g. Eastside Plaza Kitchen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border-2 border-black rounded-xl px-4 py-2.5 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5">
              Location / Branch
            </label>
            <input
              type="text"
              placeholder="e.g. Bhubaneswar East"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white border-2 border-black rounded-xl px-4 py-2.5 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t-2 border-black flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-black text-slate-800 hover:bg-slate-100 border-2 border-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-full text-xs font-black bg-sky-300 hover:bg-sky-400 text-slate-950 shadow-xs disabled:opacity-50 border-2 border-black"
            >
              {isSubmitting ? "Creating..." : "Add Store"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
