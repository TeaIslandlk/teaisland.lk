// ============================================================
//  TEA ISLAND – store settings & products
//  Edit this file to change prices, add products, or swap photos.
// ============================================================

const STORE = {
  name: "Tea Island",
  whatsapp: "94716556155",     // international format, no + or spaces (0716556155 -> 94716556155)
  currency: "LKR",
  deliveryFee: 450,            // flat delivery fee
  freeDeliveryOver: 10000,     // free delivery above this subtotal (set to 0 to disable)
  sizes: ["S", "M", "L", "XL"],
  tiktok: "https://www.tiktok.com/@teaislandfy",

  // Thin bar at the very top of the page
  announcement: "Pre-order on WhatsApp  ·  Island-wide delivery  ·  Free delivery over LKR 10,000",

  // Small trust points under the hero (edit freely, keep 3-4)
  trust: [
    ["Pre-order on WhatsApp", "Send your order in one tap"],
    ["Island-wide delivery", "Straight to your door"],
    ["Cash on delivery", "Pay when it arrives"]
  ],

  // Products shown in the hero picture (use product ids)
  heroIds: ["sand-leaf-grid", "signature-t", "forest-sprout"],

  // Options listed in the Filter panel. Options with no products show greyed out as (0).
  // Add or rename freely; a product's size/fabric/weight/type must match one of these.
  filterSizes: ["XS", "S", "M", "L", "XL", "XXL"],
  fabricTypes: ["100% Cotton", "Linen", "Rayon Blended", "Cotton Spandex", "Corduroy"],
  fabricWeights: ["Cotton Spandex", "Heavy Cotton", "Light Weight", "Premium Heavy Weight", "Premium Medium Weight", "Premium Mid weight"],
  productTypes: ["T-shirts", "Oversized Tees", "Crop Tops", "Tank Tops"],

  // Size guide popup. Leave empty to hide the link.
  // Example row: ["S", "18 in", "26 in"]
  sizeGuideHead: ["Size", "Chest (flat)", "Length"],
  sizeGuide: []
};

// Customer reviews. Leave empty until you have real ones; the section hides itself.
// Example: { name: "Nimali", text: "Super soft and the print looks great." }
const REVIEWS = [];

// Collections shown as big tiles. "tag" must match a product's tag below.
// heroId picks which product's photo fills the tile.
const COLLECTIONS = [
  { tag: "Botanical", title: "Botanical", line: "Leaves and sprouts from the island", heroId: "forest-sprout" },
  { tag: "Signature", title: "Signature", line: "The gold T, in deep green", heroId: "signature-t" },
  { tag: "Tea Time",  title: "Tea Time",  line: "For the first-cup-of-the-day people", heroId: "teapot-white" }
];

// To use a real photo, put the file in /images and set  image: "images/my-photo.jpg"
// Without a photo, a drawn t-shirt preview is shown using color / ink / motif.
// motif options: leaves, sprout, cup, branch, circle, logo
// badge (optional): text shown on the corner of the card, e.g. "New"
// Optional per product (filters appear automatically once you fill them in):
//   sizes: ["M","L"]            sizes this tee is offered in (default: all STORE.sizes)
//   soldOut: true               shows "Sold out" and disables ordering
//   type: "T-shirts"            product type (see STORE.productTypes)
//   fabric: "100% Cotton"       fabric type (see STORE.fabricTypes)
//   weight: "Light Weight"      fabric weight (see STORE.fabricWeights)
const PRODUCTS = [
  {
    id: "sand-leaf-grid", tag: "Botanical", badge: "New",
    name: "Leaf Collection Tee",
    type: "T-shirts",
    fabric: "100% Cotton",
    price: 3490,
    color: "#d8c79a", ink: "#2f6b3a", motif: "leaves",
    desc: "Tea-leaf studies in a neat grid. Soft sand cotton.",
    image: "images/leaf-collection.jpg"
  },
  {
    id: "forest-sprout", tag: "Botanical",
    name: "Forest Sprout Tee",
    type: "T-shirts",
    fabric: "100% Cotton",
    price: 3290,
    color: "#2f6b3a", ink: "#f3f1e8", motif: "sprout",
    desc: "A single tea sprout, minimal and fresh. Forest green.",
    image: "images/forest-sprout.jpg"
  },
  {
    id: "teapot-white", tag: "Tea Time",
    name: "Slow Pour Tee",
    type: "T-shirts",
    fabric: "100% Cotton",
    price: 3290,
    color: "#f4f2ec", ink: "#2b2b2b", motif: "cup",
    desc: "For those who live for the first cup of the day. White.",
    image: "images/slow-pour.jpg"
  },
  {
    id: "olive-branch", tag: "Botanical",
    name: "Olive Leaf Tee",
    type: "T-shirts",
    fabric: "100% Cotton",
    price: 3490,
    color: "#5a6b3c", ink: "#f3f1e8", motif: "branch",
    desc: "Fine-line tea branch on olive. Relaxed fit.",
    image: null
  },
  {
    id: "teal-circle", tag: "Botanical",
    name: "Moon Leaf Tee",
    type: "T-shirts",
    fabric: "100% Cotton",
    price: 3490,
    color: "#2a8a85", ink: "#f3f1e8", motif: "circle",
    desc: "A tea leaf inside a circle. Calm teal.",
    image: null
  },
  {
    id: "signature-t", tag: "Signature", badge: "Signature",
    name: "Signature Gold T Tee",
    type: "T-shirts",
    fabric: "100% Cotton",
    price: 3990,
    color: "#0b2a1c", ink: "#d9b75b", motif: "logo",
    desc: "Our gold monogram on deep green. The Tea Island signature.",
    image: "images/signature-t.jpg"
  }
];
