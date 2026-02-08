const mongoose = require("mongoose");
const Card = require("./src/models/Card");

mongoose.connect("mongodb://127.0.0.1/TCG_Pokemon_Cards");

async function seed() {
  const cards = [
    // Pokemon 
    {
      name: "Oddish",
      image:
        "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_1.png",
      price: 50,
      stock: 5,
    },
    {
      name: "Gloom",
      image:
        "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_2.png",
      price: 60,
      stock: 4,
    },
    {
      name: "Vileplume",
      image:
        "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_3.png",
      price: 90,
      stock: 2,
    },
    {
      name: "Charmander",
      image:
        "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_11.png",
      price: 70,
      stock: 6,
    },
    {
      name: "Moltres",
      image:
        "https://dz3we2x72f7ol.cloudfront.net/expansions/phantasmal-flames/es-mx/8BXG_LA_14.png",
      price: 150,
      stock: 1,
    },
    // Digimon
    {
      name: "Yokomon",
      image: "https://images.digimoncard.io/images/cards/BT1-001.jpg",
      price: 40,
      stock: 5,
    },
    {
      name: "DarkTyrannomon",
      image: "https://images.digimoncard.io/images/cards/BT1-019.jpg",
      price: 80,
      stock: 3,
    },
    {
      name: "Gabumon",
      image: "https://images.digimoncard.io/images/cards/BT1-029.jpg",
      price: 55,
      stock: 4,
    },
    {
      name: "Omnimon",
      image: "https://images.digimoncard.io/images/cards/BT1-084.jpg",
      price: 200,
      stock: 1,
    },
    {
      name: "RagnaLoardmon",
      image: "https://images.digimoncard.io/images/cards/BT3-019.jpg",
      price: 120,
      stock: 2,
    },
    // Yu-Gi-Oh 
    {
      name: "Blue-Eyes White Dragon",
      image: "https://images.ygoprodeck.com/images/cards/89631139.jpg",
      price: 180,
      stock: 2,
    },
    {
      name: "Dark Magician",
      image: "https://images.ygoprodeck.com/images/cards/46986414.jpg",
      price: 160,
      stock: 3,
    },
    {
      name: "Pot of Greed",
      image: "https://images.ygoprodeck.com/images/cards/55144522.jpg",
      price: 90,
      stock: 5,
    },
    {
      name: "Monster Reborn",
      image: "https://images.ygoprodeck.com/images/cards/83764718.jpg",
      price: 75,
      stock: 4,
    },
    {
      name: "Obelisk the tormentor",
      image: "https://images.ygoprodeck.com/images/cards/10000000.jpg",
      price: 220,
      stock: 1,
    },
  ];

  await Card.insertMany(cards);

  console.log("Cartas creadas ");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});