import React, { useState } from "react";
import { X, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CreateOrderModal({ isOpen, onClose, storeId, onCreateOrder }) {
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([
    { name: "Cold Brew", quantity: 1 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  function handleAddItem() {
    setItems([...items, { name: "", quantity: 1 }]);
  }

  function handleRemoveItem(index) {
    if (items.length === 1) {
      return;
    }
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  }

  function handleItemChange(index, field, value) {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!customerName.trim()) {
      alert("Please enter customer name");
      return;
    }

    const validItems = items.filter((item) => item.name.trim() !== "");
    if (validItems.length === 0) {
      alert("Please add at least one item with a valid name");
      return;
    }

    setIsSubmitting(true);
    await onCreateOrder({
      storeId: storeId,
      customerName: customerName.trim(),
      items: validItems
    });
    setIsSubmitting(false);

    setCustomerName("");
    setItems([{ name: "Cold Brew", quantity: 1 }]);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs">
      <div className="bg-white border-2 border-black rounded-[20px] w-full max-w-md p-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b-2 border-black">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-sky-100 text-sky-950 border-2 border-black">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h3 className="text-base font-black text-slate-900">Create New Kitchen Order</h3>
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
              Customer Name
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah T."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-white border-2 border-black rounded-xl px-4 py-2.5 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-900">
                Order Items
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-xs text-sky-700 hover:text-sky-900 flex items-center gap-1 font-black underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Item name (e.g. Cold Brew)"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, "name", e.target.value)}
                    className="flex-1 bg-white border-2 border-black rounded-xl px-3 py-2 text-xs text-slate-900 font-extrabold focus:outline-none focus:border-sky-500"
                    required
                  />
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 1)}
                    className="w-14 bg-white border-2 border-black rounded-xl px-2 py-2 text-xs text-slate-900 font-black text-center focus:outline-none focus:border-sky-500"
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-rose-600 hover:text-rose-800 p-1 rounded-lg hover:bg-slate-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
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
              className="px-5 py-2 rounded-full text-xs font-black bg-amber-300 hover:bg-amber-400 text-slate-950 shadow-xs disabled:opacity-50 border-2 border-black"
            >
              {isSubmitting ? "Creating..." : "Place Order"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
