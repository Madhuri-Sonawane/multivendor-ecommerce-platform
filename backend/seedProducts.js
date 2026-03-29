const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const Seller = require("./models/Seller");

dotenv.config();

const seedProducts = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerce-multivendor";
    await mongoose.connect(uri.replace("localhost", "127.0.0.1"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB");

    const seller = await Seller.findOne({ isApproved: true });
    if (!seller) {
      console.log("No approved seller found in DB. Cannot seed.");
      process.exit();
    }

    const products = [
      {
        seller: seller._id,
        title: "iPhone 15 Pro Max",
        description: "The ultimate iPhone with titanium body and A17 Pro chip.",
        price: 130000,
        mrp: 159900,
        stock: 50,
        category: "Mobiles",
        subCategory: "Mobiles",
        brand: "Apple"
      },
      {
        seller: seller._id,
        title: "Samsung Galaxy S24 Ultra",
        description: "AI-powered, incredible camera, S-Pen included.",
        price: 115000,
        mrp: 129999,
        stock: 30,
        category: "Mobiles",
        subCategory: "Mobiles",
        brand: "Samsung"
      },
      {
        seller: seller._id,
        title: "OnePlus 12R",
        description: "Flagship killer with Snapdragon 8 Gen 2.",
        price: 39999,
        mrp: 42999,
        stock: 100,
        category: "Mobiles",
        subCategory: "Mobiles",
        brand: "OnePlus"
      },
      {
        seller: seller._id,
        title: "Apple 20W USB-C Power Adapter",
        description: "Fast, efficient charging for your iPhone.",
        price: 1699,
        mrp: 1900,
        stock: 200,
        category: "Mobiles",
        subCategory: "Chargers",
        brand: "Apple"
      },
      {
        seller: seller._id,
        title: "Samsung 45W Super Fast Charger",
        description: "Quick charge your galaxy devices safely.",
        price: 2499,
        mrp: 2999,
        stock: 150,
        category: "Mobiles",
        subCategory: "Chargers",
        brand: "Samsung"
      },
      {
        seller: seller._id,
        title: "Apple AirPods Pro (2nd Gen)",
        description: "Active Noise Cancellation and MagSafe Case.",
        price: 20900,
        mrp: 24900,
        stock: 60,
        category: "Mobiles",
        subCategory: "Earbuds",
        brand: "Apple"
      },
      {
        seller: seller._id,
        title: "Samsung Galaxy Buds 2 Pro",
        description: "24-bit Hi-Fi audio, intelligent ANC.",
        price: 9999,
        mrp: 14999,
        stock: 45,
        category: "Mobiles",
        subCategory: "Earbuds",
        brand: "Samsung"
      },
      {
        seller: seller._id,
        title: "OnePlus Buds Pro 2",
        description: "Co-created with Dynaudio, Spatial Audio.",
        price: 8999,
        mrp: 11999,
        stock: 80,
        category: "Mobiles",
        subCategory: "Earbuds",
        brand: "OnePlus"
      }
    ];

    await Product.insertMany(products);
    console.log("Seeding Success! Added Mobile products.");
    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedProducts();
