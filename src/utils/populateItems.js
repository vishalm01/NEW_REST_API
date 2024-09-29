const mongoose = require("mongoose");
const Item = require("../models/items"); // Adjust this path based on where your models folder is located

const mongoURI = `mongodb://localhost:27017/your_db_name`; // Use your local MongoDB connection string

async function populateItems() {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    const items = [
      { itemName: "Egg", MRP: 6.0, Rate: 5.5 },
      { itemName: "Carrot", MRP: 55.0, Rate: 50.0 },
      { itemName: "Spinach", MRP: 10.0, Rate: 8.0 },
      { itemName: "Lady's Finger", MRP: 60.0, Rate: 55.0 },
      { itemName: "Beetroot", MRP: 45.0, Rate: 40.0 },
      { itemName: "Beans", MRP: 65.0, Rate: 60.0 },
      { itemName: "Cauliflower", MRP: 25.0, Rate: 20.0 },
      { itemName: "Mushroom", MRP: 45.0, Rate: 40.0 },
      { itemName: "Brinjal", MRP: 40.0, Rate: 35.0 },
      { itemName: "Tomato", MRP: 35.0, Rate: 30.0 },
      { itemName: "Onion (Small)", MRP: 55.0, Rate: 50.0 },
      { itemName: "Onion (Big)", MRP: 45.0, Rate: 40.0 },
      { itemName: "Potato", MRP: 30.0, Rate: 25.0 },
      { itemName: "Coconut", MRP: 25.0, Rate: 20.0 },
    ];

    await Item.insertMany(items);
    console.log("Items have been populated successfully");

    mongoose.disconnect();
  } catch (error) {
    console.error("Error populating items:", error);
  }
}

populateItems();
