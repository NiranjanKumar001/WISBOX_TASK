import React, { useEffect, useState } from "react";
import { useSocket } from "./context/SocketContext";
import CustomerHeader from "./components/CustomerHeader";
import StoreSelector from "./components/StoreSelector";
import CustomerBoard from "./components/CustomerBoard";

const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

export default function App() {
  const { socket } = useSocket();
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState("store_01");
  const [orders, setOrders] = useState([]);
  const [lastUpdatedOrderId, setLastUpdatedOrderId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch stores on mount
  useEffect(() => {
    async function fetchStores() {
      try {
        const response = await fetch(`${API_BASE_URL}/stores`);
        const data = await response.json();
        setStores(data);
        if (data.length > 0) {
          setSelectedStoreId(data[0].storeId);
        }
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStores();
  }, []);

  // Fetch orders when selected store changes & join socket room
  useEffect(() => {
    if (!selectedStoreId) {
      return;
    }

    async function fetchOrders() {
      try {
        const response = await fetch(`${API_BASE_URL}/orders?storeId=${selectedStoreId}`);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    }

    fetchOrders();

    if (socket) {
      socket.emit("join_store", selectedStoreId);
    }
  }, [selectedStoreId, socket]);

  // Socket event listeners for real-time storefront updates
  useEffect(() => {
    if (!socket) {
      return;
    }

    function handleStoreCreated(newStore) {
      setStores((prevStores) => {
        const exists = prevStores.some((s) => s.storeId === newStore.storeId);
        if (exists) {
          return prevStores;
        }
        return [...prevStores, newStore];
      });
    }

    function handleStoreDeleted(data) {
      const deletedStoreId = data.storeId;
      setStores((prevStores) => {
        const updated = prevStores.filter((s) => s.storeId !== deletedStoreId);
        if (selectedStoreId === deletedStoreId && updated.length > 0) {
          setSelectedStoreId(updated[0].storeId);
        }
        return updated;
      });
    }

    function handleOrderCreated(newOrder) {
      if (newOrder.storeId === selectedStoreId) {
        setOrders((prevOrders) => {
          const exists = prevOrders.some((order) => order.id === newOrder.id);
          if (exists) {
            return prevOrders;
          }
          return [newOrder, ...prevOrders];
        });
      }
    }

    function handleOrderUpdated(updatedOrder) {
      if (updatedOrder.storeId === selectedStoreId) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );
        setLastUpdatedOrderId(updatedOrder.id);
      }
    }

    socket.on("store_created", handleStoreCreated);
    socket.on("store_deleted", handleStoreDeleted);
    socket.on("order_created", handleOrderCreated);
    socket.on("order_updated", handleOrderUpdated);

    return () => {
      socket.off("store_created", handleStoreCreated);
      socket.off("store_deleted", handleStoreDeleted);
      socket.off("order_created", handleOrderCreated);
      socket.off("order_updated", handleOrderUpdated);
    };
  }, [socket, selectedStoreId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        <div className="text-center">
          <div className="w-9 h-9 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-black font-bold text-sm">Loading Customer Display Board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black pb-16">
      <CustomerHeader isMuted={isMuted} setIsMuted={setIsMuted} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <StoreSelector
          stores={stores}
          selectedStoreId={selectedStoreId}
          setSelectedStoreId={setSelectedStoreId}
        />
        <CustomerBoard
          orders={orders}
          lastUpdatedOrderId={lastUpdatedOrderId}
          isMuted={isMuted}
        />
      </main>
    </div>
  );
}
