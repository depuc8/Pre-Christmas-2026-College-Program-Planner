/*
  EDIT THIS FILE to update the planner.
  - Add or edit checklist entries in `tasks`.
  - Add or edit vendor cards in `vendors`.
  - Update last year's reference figures in `expenses2025` only when you have verified records.
  Keep each task `id` unique so saved ticks remain associated with the right task.
*/
window.PRE_CHRISTMAS_DATA = {
  tasks: [
    {
      id: "decoration-items",
      category: "Decoration & setup",
      title: "Buy decoration materials",
      detail: "Source the required decoration items from the local Bihta market. Confirm the list and quantities with the team.",
      vendorId: "local-decoration"
    },
    {
      id: "flex-printing",
      category: "Decoration & setup",
      title: "Finalize and print the flex",
      detail: "Confirm design, dimensions, spelling, quantity, and collection date before printing.",
      vendorId: "raj-digital"
    },
    {
      id: "balloon-decoration",
      category: "Decoration & setup",
      title: "Arrange balloon decoration",
      detail: "Discuss the design, quantity, setup time, and whether installation is included.",
      vendorId: "gopi-brother"
    },
    {
      id: "candles",
      category: "Decoration & setup",
      title: "Buy candles",
      detail: "Purchase from the local Bihta market. Confirm quantity and type needed.",
      vendorId: "local-candles"
    },
    {
      id: "plates",
      category: "Decoration & setup",
      title: "Arrange plates",
      detail: "Buy plates from the local market. Confirm the expected number of attendees and quantity required.",
      vendorId: "local-plates"
    },
    {
      id: "cupcakes",
      category: "Food & refreshments",
      title: "Order cupcakes",
      detail: "Confirm quantity, flavour, price, and pickup/delivery timing.",
      vendorId: "pista-house"
    },
    {
      id: "drinks",
      category: "Food & refreshments",
      title: "Arrange drinks (Swing)",
      detail: "Contact the first shop in the food court. Confirm rate, quantity, and serving arrangements.",
      vendorId: "swing"
    },
    {
      id: "veg-patties",
      category: "Food & refreshments",
      title: "Order veg patties",
      detail: "Wini Cakes is the first contact; Monginies is listed as an alternate. Compare availability and rates.",
      vendorId: "wini-cakes"
    },
    {
      id: "cake",
      category: "Food & refreshments",
      title: "Arrange the program cake",
      detail: "Any suitable local bakery can be considered. Purple Happiness is a listed option; confirm design, size, and timing.",
      vendorId: "purple-happiness"
    },
    {
      id: "chocolates",
      category: "Food & refreshments",
      title: "Buy chocolates",
      detail: "Source from the local market. Decide quantity and budget before purchasing.",
      vendorId: "local-chocolates"
    },
    {
      id: "dinner",
      category: "Food & refreshments",
      title: "Coordinate dinner",
      detail: "Discuss menu, headcount, cost per plate, serving time, and delivery/setup with Vimal Bhaiya.",
      vendorId: "vimal-bhaiya"
    },
    {
      id: "sound-system",
      category: "Stage & technical",
      title: "Book the sound system",
      detail: "Confirm speakers, microphones, operator, setup/check time, and total charges.",
      vendorId: "martin-sound"
    }
  ],

  vendors: [
    { id: "local-decoration", category: "Decoration", item: "Decoration items", name: "Local Bihta market", contact: "", note: "Confirm exact items and quantities with the team." },
    { id: "raj-digital", category: "Printing", item: "Flex", name: "Raj Digital Press", contact: "70049 13012", note: "Confirm dimensions, design, rate, and delivery/pickup." },
    { id: "pista-house", category: "Food", item: "Cupcakes", name: "Pista House", contact: "95700 03300", note: "Confirm quantity, flavours, and order timing." },
    { id: "swing", category: "Drinks", item: "Drinks (Swing)", name: "Food court · first shop", contact: "+91 95725 44000", note: "Listed as the first shop in the food court." },
    { id: "wini-cakes", category: "Food", item: "Veg patties", name: "Wini Cakes", contact: "82941 29387", note: "Primary contact; Monginies is listed as an alternate." },
    { id: "monginies", category: "Food · alternate", item: "Veg patties", name: "Monginies", contact: "0088730 05500", note: "Alternate option. Verify this number before calling; it is reproduced as supplied." },
    { id: "local-candles", category: "Decoration", item: "Candles", name: "Local Bihta market", contact: "", note: "Confirm type and quantity required." },
    { id: "martin-sound", category: "Technical", item: "Sound system", name: "Martin", contact: "+91 63012 43589", note: "Confirm equipment, operator, setup time, and charges." },
    { id: "purple-happiness", category: "Food", item: "Program cake", name: "Purple Happiness", contact: "074929 29092", note: "Listed as a local bakery option; any suitable local bakery can be considered." },
    { id: "local-chocolates", category: "Food", item: "Chocolates", name: "Local market", contact: "", note: "Decide quantity and budget before buying." },
    { id: "vimal-bhaiya", category: "Dinner", item: "Dinner", name: "Vimal Bhaiya", contact: "+916201053824", note: "Confirm menu, headcount, per-plate rate, and serving time." },
    { id: "gopi-brother", category: "Decoration", item: "Balloon decoration", name: "Gopi brother", contact: "+918019136177", note: "Discuss design, quantity, setup, and installation charges." },
    { id: "local-plates", category: "Supplies", item: "Plates", name: "Local market", contact: "", note: "Confirm quantity based on the expected headcount." }
  ],

  expenses2025: [
    { item: "Decoration", amount: 3080 },
    { item: "Flex", amount: 5000 },
    { item: "Cake (Pista House)", amount: 5200 },
    { item: "Drinks", amount: 2500 },
    { item: "Veg patties", amount: 3250 },
    { item: "Candles", amount: 400 },
    { item: "Sound system", amount: 5000 },
    { item: "Auto", amount: 600 },
    { item: "Cake", amount: 780 },
    { item: "Chocolates", amount: 300 },
    { item: "Food", amount: 9000 },
    { item: "Balloons", amount: 5500 },
    { item: "Plates", amount: 215 },
    { item: "Batteries", amount: 120 },
    { item: "Aman Bhaiya", amount: 1500 },
    { item: "Sweet", amount: 500 }
  ]
};
