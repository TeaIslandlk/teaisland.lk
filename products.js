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
  freeDeliveryOver: 9800,           // free delivery from this subtotal (0 = never free); 9,800 = 2 tees at LKR 4,900
  sizes: ["S", "M", "L", "XL", "XXL"],
  tiktok: "https://www.tiktok.com/@teaislandfy",
  instagram: "",                    // add the Instagram link here when the account is ready
  facebook: "",                     // add the Facebook Page link here

  announcement: "Now taking pre-orders on WhatsApp  ·  Prepaid by bank transfer  ·  Free delivery on 2 or more tees",

  // Shown in the bag and added to the WhatsApp order message once filled in.
  bank: { bankName: "", accountName: "", accountNumber: "", branch: "" },

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

// The three tee colours
const COLOURS = {
  white: { name: "White",        hex: "#F4F2EC" },
  green: { name: "Forest Green", hex: "#134931" },
  black: { name: "Black",        hex: "#1C1C1C" }
};

// The four collections, shown as big tiles and as shop rows.
// Tiles open as: Signature (green), Golden Buds (white), Blossom (black), Tea Time (green), boy-girl-boy-girl; then they shuffle through every photo of their theme.
const COLLECTIONS = [
  { tag: "Signature",   line: "Our mark, in minimal tea line art.",  model: "images/sprout-green-ma.jpg",  image: "images/sprout-green-ma.jpg" },
  { tag: "Golden Buds", line: "Small buds, golden moments.",         model: "images/bud2-white-wb.jpg",    image: "images/bud2-white-wb.jpg" },
  { tag: "Blossom",     line: "The tea flower, in full colour.",     model: "images/blossom-black-mb.jpg", image: "images/blossom-black-mb.jpg" },
  { tag: "Tea Time",    line: "The tea ritual, with a smile.",       model: "images/teatime-green-wa.jpg", image: "images/teatime-green-wa.jpg" }
];

const HERO = [
  { tag: "Signature",   name: "The Sprout",   img: "images/sprout-green-mb.jpg" },
  { tag: "Blossom",     name: "Tea Blossom",  img: "images/blossom-white-wa.jpg" },
  { tag: "Golden Buds", name: "Golden Sprig", img: "images/bud3-white-mb.jpg" },
  { tag: "Tea Time",    name: "Tea Time",     img: "images/teatime-white-wa.jpg" }
];

// Photos with a busy background (to be re-shot): never used as a card cover while another photo exists.
const AVOID_COVER = ["images/bud1-black-ma.jpg", "images/bud2-black-wa.jpg", "images/bud1-green-wb.jpg", "images/teatime-black-mb.jpg"];

// Products: 7 designs, each in White, Black and Forest Green.
// images[colour] = every model photo of that tee (the first is a fallback; the shop picks the cover so boys and girls alternate).
const PRODUCTS = [
  { id: "sprout", tag: "Signature", name: "The Sprout", line: "Two leaves, one stem. Our mark.",
    desc: "The Tea Island Sprout, drawn in a single minimal line. Printed A4-size on the chest. Dark green on White, gold on Black, cream on Forest Green.", price: 4900,
    images: { white: ["images/sprout-white-ma.jpg", "images/sprout-white-wb.jpg", "images/sprout-white-mb.jpg", "images/sprout-white-wa.jpg"], black: ["images/sprout-black-ma.jpg", "images/sprout-black-wb.jpg", "images/sprout-black-mb.jpg", "images/sprout-black-wa.jpg"], green: ["images/sprout-green-ma.jpg", "images/sprout-green-wb.jpg", "images/sprout-green-mb.jpg", "images/sprout-green-wa.jpg"] } },
  { id: "leaf", tag: "Signature", name: "The Leaf", line: "Nine leaves, one quiet grid.",
    desc: "Nine fine leaf outlines in a 3 x 3 grid. Printed A4-size on the chest. Dark green on White, gold on Black, pale gold on Forest Green.", price: 4900,
    images: { white: ["images/leaf-white-ma.jpg", "images/leaf-white-wb.jpg", "images/leaf-white-mb.jpg", "images/leaf-white-wa.jpg"], black: ["images/leaf-black-ma.jpg", "images/leaf-black-wb.jpg", "images/leaf-black-mb.jpg", "images/leaf-black-wa.jpg"], green: ["images/leaf-green-ma.jpg", "images/leaf-green-wb.jpg", "images/leaf-green-mb.jpg", "images/leaf-green-wa.jpg"] } },
  { id: "bud1", tag: "Golden Buds", name: "Golden Bud", line: "A single gold bud, drawn clean.",
    desc: "A simple three-leaf tea bud in flat gold. Printed A4-size on the chest.", price: 4900,
    images: { white: ["images/bud1-white-wa.jpg"], black: ["images/bud1-black-ma.jpg", "images/bud1-black-mb.jpg"], green: ["images/bud1-green-wb.jpg"] } },
  { id: "bud2", tag: "Golden Buds", name: "Golden Burst", line: "Gold watercolour leaves in bloom.",
    desc: "A burst of tea leaves in gold watercolour. Printed A4-size on the chest.", price: 4900,
    images: { white: ["images/bud2-white-ma.jpg", "images/bud2-white-wb.jpg"], black: ["images/bud2-black-wa.jpg"], green: ["images/bud2-green-mb.jpg"] } },
  { id: "bud3", tag: "Golden Buds", name: "Golden Sprig", line: "Five tall gold leaves, one sprig.",
    desc: "A tall sprig of five tea leaves in gold. Printed A4-size on the chest.", price: 4900,
    images: { white: ["images/bud3-white-wb.jpg", "images/bud3-white-mb.jpg"], black: ["images/bud3-black-ma.jpg", "images/bud3-black-wb.jpg"], green: ["images/bud3-green-ma.jpg", "images/bud3-green-wa.jpg"] } },
  { id: "tea-blossom", tag: "Blossom", name: "Tea Blossom", line: "The tea flower, in full colour.",
    desc: "A flowering tea branch, true to life, in full colour. Printed A4-size on the chest.", price: 4900,
    images: { white: ["images/blossom-white-ma.jpg", "images/blossom-white-wb.jpg", "images/blossom-white-mb.jpg", "images/blossom-white-wa.jpg"], black: ["images/blossom-black-ma.jpg", "images/blossom-black-wb.jpg", "images/blossom-black-mb.jpg", "images/blossom-black-wa.jpg"], green: ["images/blossom-green-ma.jpg", "images/blossom-green-wb.jpg", "images/blossom-green-mb.jpg", "images/blossom-green-wa.jpg"] } },
  { id: "the-pour", tag: "Tea Time", name: "Tea Time", line: "Tea, poured with a smile.",
    desc: "A watercolour teapot pouring into a splashing cup. No words, just the ritual. Printed A4-size on the chest.", price: 4900,
    images: { white: ["images/teatime-white-ma.jpg", "images/teatime-white-wb.jpg", "images/teatime-white-mb.jpg", "images/teatime-white-wa.jpg"], black: ["images/teatime-black-ma.jpg", "images/teatime-black-wb.jpg", "images/teatime-black-mb.jpg", "images/teatime-black-wa.jpg"], green: ["images/teatime-green-ma.jpg", "images/teatime-green-wb.jpg", "images/teatime-green-mb.jpg", "images/teatime-green-wa.jpg"] } }
];

// Shop order: one line per design, colours left to right (White, Black, Forest Green).
// "start" = who is on the left of that line ("m" boy, "w" girl); the line then alternates boy / girl.
const SHOP_ORDER = [
  { id: "sprout",      start: "m" },   // 1  The Sprout
  { id: "bud1",        start: "w" },   // 2  Golden Bud
  { id: "leaf",        start: "m" },   // 3  The Leaf
  { id: "the-pour",    start: "w" },   // 4  Tea Time
  { id: "tea-blossom", start: "m" },   // 5  Tea Blossom
  { id: "bud3",        start: "w" },   // 6  Golden Sprig
  { id: "bud2",        start: "m" }    // 7  Golden Burst
];
