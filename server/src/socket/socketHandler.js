function setupSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Socket joins a specific store room
    socket.on("join_store", (storeId) => {
      if (!storeId) {
        return;
      }

      // Leave any previously joined store rooms first
      const rooms = Array.from(socket.rooms);
      for (const room of rooms) {
        if (room.startsWith("store:")) {
          socket.leave(room);
        }
      }

      const roomName = `store:${storeId}`;
      socket.join(roomName);
      console.log(`Socket ${socket.id} joined room ${roomName}`);
    });

    // Socket leaves a store room
    socket.on("leave_store", (storeId) => {
      if (!storeId) {
        return;
      }
      const roomName = `store:${storeId}`;
      socket.leave(roomName);
      console.log(`Socket ${socket.id} left room ${roomName}`);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = setupSocketHandlers;
