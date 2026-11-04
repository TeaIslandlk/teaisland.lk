// ============================================================
//  TEA ISLAND – store settings & products
//  Edit this file to change prices, add products or swap photos.
// ============================================================

const STORE = {
  name: "Tea Island",
  tagline: "Pure Ceylon. Elevated.",
  whatsapp: "94716556155",          // 071 655 6155 in international format, no + or spaces
  whatsappDisplay: "071 655 6155",
  currency: "LKR",
  deliveryFee: 450,                 // flat island-wide delivery fee
  freeDeliveryOver: 10000,          // free delivery above this subtotal (0 = never free)
  sizes: ["S", "M", "L", "XL", "XXL"],
  tiktok: "https://www.tiktok.com/@teaislandfy",
  instagram: "",                    // add the Instagram link here when the account is ready
  facebook: "",                     // add the Facebook Page link here

  announcement: "Pre-order on WhatsApp  ·  Island-wide delivery  ·  Free delivery over LKR 10,000",

  sizeGuideHead: ["Size", "Chest (in)", "Length (in)"],
  sizeGuide: [
    ["S", "19¾", "27"],
    ["M", "20¾", "28"],
    ["L", "21¾", "29"],
    ["XL", "22¾", "30"],
    ["XXL", "23¾", "31"]
  ],
  sizeNote: "Unisex fit. Women usually take one size smaller."
};

// The four tee colours
const COLOURS = {
  white: { name: "White",        hex: "#F4F2EC" },
  green: { name: "Forest Green", hex: "#14472F" },
  black: { name: "Black",        hex: "#1C1C1C" },
  beige: { name: "Beige",        hex: "#E3D3AE" }
};

// The three collections, shown as big tiles and as shop filters
// "model" = lifestyle photo of one person wearing one tee (drop the file in /images).
// "image" = flat mockup, used automatically until the model photo exists.
const COLLECTIONS = [
  { tag: "Signature", line: "Our mark, in minimal tea line art.",    model: "images/model-signature.jpg", image: "images/signature-sprout-green.jpg" },
  { tag: "Botanical", line: "The tea plant in real colour and gold.", model: "images/model-botanical.jpg", image: "images/botanical-tea-blossom-white.jpg" },
  { tag: "Tea Time",  line: "The tea ritual, with a smile.",          model: "images/model-teatime.jpg",   image: "images/teatime-plain-tea-two-sugars-green.jpg" }
];

// Hero: one tee per theme, White and Green only, shuffled automatically
const HERO = ["Signature", "Botanical", "Tea Time"];

// Products. "images" lists one photo per colour the tee comes in.
// badge (optional): small label on the card, e.g. "New" or "Limited"
// soldOut: true  shows "Sold out" and stops ordering
const PRODUCTS = [
  {
    id: "sprout", tag: "Signature", badge: "Our mark",
    name: "The Sprout",
    line: "Two leaves, one stem. Our mark.",
    desc: "The Tea Island Sprout, drawn in a single minimal line. Printed A4-size on the chest. Black comes printed in gold.",
    price: 3290,
    images: {
      white: "images/signature-sprout-white.jpg",
      green: "images/signature-sprout-green.jpg",
      black: "images/signature-sprout-black.jpg",
      beige: "images/signature-sprout-beige.jpg"
    }
  },
  {
    id: "leaf-collection", tag: "Botanical", badge: "New",
    name: "Leaf Collection",
    line: "Tea-leaf studies, set in a grid.",
    desc: "A collector's sheet of real tea leaves, each one drawn from life. Printed A4-size on the chest.",
    price: 3490,
    images: {
      white: "images/botanical-leaf-collection-white.jpg",
      green: "images/botanical-leaf-collection-green.jpg",
      black: "images/botanical-leaf-collection-black.jpg",
      beige: "images/botanical-leaf-collection-beige.jpg"
    }
  },
  {
    id: "tea-blossom", tag: "Botanical", badge: "New",
    name: "Tea Blossom",
    line: "The tea flower, in full colour.",
    desc: "A flowering tea branch, true to life, in full colour. Printed A4-size on the chest.",
    price: 3490,
    images: {
      white: "images/botanical-tea-blossom-white.jpg",
      green: "images/botanical-tea-blossom-green.jpg",
      black: "images/botanical-tea-blossom-black.jpg",
      beige: "images/botanical-tea-blossom-beige.jpg"
    }
  },
  {
    id: "tea-burst", tag: "Botanical", badge: "Limited",
    name: "Tea Burst",
    line: "Hand-painted gold, on Forest Green.",
    desc: "A burst of gold watercolour tea leaves on deep Forest Green. Our premium piece.",
    price: 3990,
    images: { green: "images/botanical-gold-bloom-green.jpg" }
  },
  {
    id: "gold-bud", tag: "Botanical", badge: "Limited",
    name: "Golden Bud",
    line: "The first bud of the flush, in gold.",
    desc: "The tender bud every plucker looks for, painted in gold watercolour on black.",
    price: 3990,
    images: { black: "images/botanical-gold-bud-black.jpg" }
  },
  {
    id: "gold-sprig", tag: "Botanical",
    name: "Golden Sprig",
    line: "A gold tea sprig, soft and light.",
    desc: "A gold watercolour tea sprig. White and Beige carry two different sprigs from the same series.",
    price: 3790,
    images: {
      white: "images/botanical-gold-sprig-a-white.jpg",
      beige: "images/botanical-gold-sprig-b-beige.jpg"
    }
  },
  {
    id: "plain-tea", tag: "Tea Time", badge: "Fan favourite",
    name: "Plain Tea, Two Sugars",
    line: "No negotiations.",
    desc: "For everyone who orders exactly this, every single time.",
    price: 3290,
    images: { green: "images/teatime-plain-tea-two-sugars-green.jpg" }
  },
  {
    id: "say-when", tag: "Tea Time",
    name: "Say When",
    line: "The slow pour of the first cup.",
    desc: "A hand-drawn teapot mid-pour, for the first-cup-of-the-day people.",
    price: 3290,
    images: { beige: "images/teatime-say-when-beige.jpg" }
  },
  {
    id: "tea-person", tag: "Tea Time",
    name: "Definitely a Tea Person",
    line: "Coffee? Never heard of it.",
    desc: "A hand-drawn cup and a line that settles the argument.",
    price: 3290,
    images: { black: "images/teatime-i-m-definitely-a-tea-person-black.jpg" }
  },
  {
    id: "the", tag: "Tea Time",
    name: "තේ",
    line: "Tea, in Sinhala.",
    desc: "තේ: the one word every Sri Lankan knows by heart.",
    price: 3290,
    images: { white: "images/teatime-tea-white.jpg" }
  }
];
