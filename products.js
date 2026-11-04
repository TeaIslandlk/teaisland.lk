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
  
};

// The three collections, shown as big tiles and as shop filters
// "model" = lifestyle photo of one person wearing one tee (drop the file in /images).
// "image" = flat mockup, used automatically until the model photo exists.
const COLLECTIONS = [
  { tag: "Signature",    line: "Our mark, in minimal tea line art.",      model: "images/shop-signature-green.jpg", image: "images/shop-signature-green.jpg" },
  { tag: "Golden Buds",  line: "Hand-painted gold tea buds.",              model: "images/shop-buds-white.jpg",      image: "images/shop-buds-white.jpg" },
  { tag: "Botanical",    line: "The tea flower, in full colour.",          model: "images/shop-botanical-white.jpg", image: "images/shop-botanical-white.jpg" },
  { tag: "Tea Time",     line: "The tea ritual, with a smile.",            model: "images/shop-teatime-green.jpg",   image: "images/shop-teatime-green.jpg" }
];

// Hero: models rotate automatically, three show at once
const HERO = [
  { tag: "Signature",   name: "The Sprout",  img: "images/shop-signature-green.jpg" },
  { tag: "Tea Time",    name: "Say When",    img: "images/shop-teatime-green.jpg" },
  { tag: "Golden Buds", name: "Golden Bud",  img: "images/shop-buds-white.jpg" },
  { tag: "Botanical",   name: "Tea Blossom", img: "images/shop-botanical-white.jpg" }
];

// Products: one per theme, each in White, Black and Forest Green.
const PRODUCTS = [
  { id: "sprout", tag: "Signature", name: "The Sprout", line: "Two leaves, one stem. Our mark.",
    desc: "The Tea Island Sprout, drawn in a single minimal line. Printed A4-size on the chest. Black comes printed in gold.", price: 3290,
    images: { white: "images/shop-signature-white.jpg", black: "images/shop-signature-black.jpg", green: "images/shop-signature-green.jpg" } },
  { id: "tea-blossom", tag: "Botanical", name: "Tea Blossom", line: "The tea flower, in full colour.",
    desc: "A flowering tea branch, true to life, in full colour. Printed A4-size on the chest.", price: 3490,
    images: { white: "images/shop-botanical-white.jpg", black: "images/shop-botanical-black.jpg", green: "images/shop-botanical-green.jpg" } },
  { id: "golden-bud", tag: "Golden Buds", name: "Golden Bud", line: "Hand-painted gold tea bud.",
    desc: "A tea bud in gold watercolour. Printed A4-size on the chest. Our premium piece.", price: 3990,
    images: { white: "images/shop-buds-white.jpg", black: "images/shop-buds-black.jpg", green: "images/shop-buds-green.jpg" } },
  { id: "say-when", tag: "Tea Time", name: "Say When", line: "The tea ritual, with a smile.",
    desc: "A teapot pouring into a cup, with a wink: say when. Printed A4-size on the chest.", price: 3290,
    images: { white: "images/shop-teatime-white.jpg", black: "images/shop-teatime-black.jpg", green: "images/shop-teatime-green.jpg" } }
];

