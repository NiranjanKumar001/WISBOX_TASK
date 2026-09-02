const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding database...");

  // Delete existing data to start clean
  await prisma.order.deleteMany({});
  await prisma.store.deleteMany({});

  // Seed 3 stores
  const store1 = await prisma.store.create({
    data: {
      storeId: "store_01",
      name: "Downtown Central Kitchen",
      location: "Bhubaneswar Central"
    }
  });

  const store2 = await prisma.store.create({
    data: {
      storeId: "store_02",
      name: "Westside Hub Kitchen",
      location: "Westside Hub"
    }
  });

  const store3 = await prisma.store.create({
    data: {
      storeId: "store_03",
      name: "Airport Terminal Kitchen",
      location: "Bhubaneswar Airport"
    }
  });

  console.log("Created 3 stores:", store1.name, store2.name, store3.name);

  // Seed initial mock orders for Store 1
  await prisma.order.createMany({
    data: [
      {
        orderId: "ORD-1041",
        storeId: "store_01",
        customerName: "Rahul M.",
        items: [
          { name: "Paneer Butter Masala", quantity: 1 },
          { name: "Garlic Naan", quantity: 2 }
        ],
        status: "PLACED"
      },
      {
        orderId: "ORD-1042",
        storeId: "store_01",
        customerName: "Sarah T.",
        items: [
          { name: "Cold Brew", quantity: 2 },
          { name: "Avocado Toast", quantity: 1 }
        ],
        status: "PREPARING"
      },
      {
        orderId: "ORD-1043",
        storeId: "store_01",
        customerName: "Amit K.",
        items: [
          { name: "Chicken Biryani", quantity: 1 },
          { name: "Raita", quantity: 1 }
        ],
        status: "READY"
      }
    ]
  });

  // Seed initial mock orders for Store 2
  await prisma.order.createMany({
    data: [
      {
        orderId: "ORD-2010",
        storeId: "store_02",
        customerName: "Priya S.",
        items: [
          { name: "Iced Latte", quantity: 1 },
          { name: "Croissant", quantity: 2 }
        ],
        status: "PREPARING"
      },
      {
        orderId: "ORD-2011",
        storeId: "store_02",
        customerName: "David P.",
        items: [
          { name: "Veggie Burger", quantity: 1 },
          { name: "French Fries", quantity: 1 }
        ],
        status: "READY"
      }
    ]
  });

  // Seed initial mock orders for Store 3
  await prisma.order.createMany({
    data: [
      {
        orderId: "ORD-3005",
        storeId: "store_03",
        customerName: "Anita R.",
        items: [
          { name: "Espresso", quantity: 2 },
          { name: "Muffin", quantity: 1 }
        ],
        status: "PLACED"
      }
    ]
  });

  console.log("Database seeded successfully!");
}

seed()
  .catch((error) => {
    console.error("Error seeding database:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
