export interface ArrayMethodDoc {
  name: string;
  category: "Iteration" | "Search" | "Mutating" | "Transformation" | "Inspection" | "String & Join" | "Advanced";
  isMutating: boolean;
  description: string;
  syntax: string;
  exampleCode: string;
  output: string;
  useCase: string;
}

export const JS_ARRAY_METHODS_DOCS: ArrayMethodDoc[] = [
  // 1. Iteration & Transformation
  {
    name: "map()",
    category: "Transformation",
    isMutating: false,
    description: "Btencha' array gedida b-nafs el-size ba3d ma t-apply function mo3ayana 3ala kol 3onsor fel array el-asleya mn ghair ma t-mutate el-original.",
    syntax: "const newArr = arr.map((item, index) => { return newItem; })",
    exampleCode: `const prices = [100, 200, 300];\nconst pricesWithVAT = prices.map(p => p * 1.14);\nconsole.log(pricesWithVAT);`,
    output: `[114, 228, 342]`,
    useCase: "🛒 E-Commerce: Ta3deel as3ar el-products b-edafat el-dareeba (VAT) aw stikhraj list b-asma' el-products bas."
  },
  {
    name: "filter()",
    category: "Transformation",
    isMutating: false,
    description: "Btencha' array gedida fiha bas el-3anasir elly b-t-fulfill shart mo3ayan (true/false).",
    syntax: "const filtered = arr.filter((item) => condition)",
    exampleCode: `const products = [\n  { name: "Shirt", inStock: true },\n  { name: "Pants", inStock: false },\n  { name: "Shoes", inStock: true }\n];\nconst available = products.filter(p => p.inStock);`,
    output: `[{ name: "Shirt", inStock: true }, { name: "Shoes", inStock: true }]`,
    useCase: "📦 Inventory: Fltrat el-products el-muta7a bas fel-stock aw el-products elly 3aleha discount."
  },
  {
    name: "forEach()",
    category: "Iteration",
    isMutating: false,
    description: "Bte3mel loop 3ala kol 3onsor fel array w b-run function mo3ayana 3aleeh (mesh btrag3 array gedida).",
    syntax: "arr.forEach((item, index) => { /* do something */ })",
    exampleCode: `const users = ["Yaseen", "Ahmed", "Sarah"];\nusers.forEach(u => console.log(\`Sending email to \${u}\`));`,
    output: `// Output:\n// Sending email to Yaseen\n// Sending email to Ahmed\n// Sending email to Sarah`,
    useCase: "📧 Notifications: Send email/SMS notifications l-list of users aw analytics tracking."
  },

  // 2. Search & Inspection
  {
    name: "find()",
    category: "Search",
    isMutating: false,
    description: "Btrag3 awel 3onsor fel array b-y-fulfill el-shart (true). Law mfeesh, btrag3 undefined.",
    syntax: "const found = arr.find((item) => condition)",
    exampleCode: `const users = [\n  { id: "u1", name: "Yaseen" },\n  { id: "u2", name: "Ahmed" }\n];\nconst user = users.find(u => u.id === "u1");`,
    output: `{ id: "u1", name: "Yaseen" }`,
    useCase: "👤 Auth & Profiles: Geeb el-user record al-kaamel mn el-database b-استخدام el-id."
  },
  {
    name: "findIndex()",
    category: "Search",
    isMutating: false,
    description: "Btrag3 index awel 3onsor b-y-fulfill el-shart. Law mfeesh, btrag3 -1.",
    syntax: "const idx = arr.findIndex((item) => condition)",
    exampleCode: `const cart = [{ id: 101, qty: 1 }, { id: 102, qty: 2 }];\nconst index = cart.findIndex(item => item.id === 102);`,
    output: `1`,
    useCase: "🛒 Cart Operations: Geeb index el-product fel cart 3ashan t-update el-quantity aw t-delete item."
  },
  {
    name: "findLast()",
    category: "Search",
    isMutating: false,
    description: "Btrag3 akher 3onsor fel array b-y-fulfill el-shart (btebda' search mn el-yamin l-el-shemal).",
    syntax: "const last = arr.findLast((item) => condition)",
    exampleCode: `const transactions = [\n  { amount: 50, status: "pending" },\n  { amount: 200, status: "completed" },\n  { amount: 100, status: "pending" }\n];\nconst lastPending = transactions.findLast(t => t.status === "pending");`,
    output: `{ amount: 100, status: "pending" }`,
    useCase: "💳 Payment Logs: Geeb akher ta3amul pending fel-system 3ashan t-verify el-status."
  },
  {
    name: "findLastIndex()",
    category: "Search",
    isMutating: false,
    description: "Btrag3 index akher 3onsor b-y-fulfill el-shart (search mn el-yamin).",
    syntax: "const lastIdx = arr.findLastIndex((item) => condition)",
    exampleCode: `const scores = [10, 40, 50, 20];\nconst idx = scores.findLastIndex(s => s > 30);`,
    output: `2`,
    useCase: "📊 Audit Logs: Geeb index akher log entry m3ayen fel array."
  },
  {
    name: "indexOf()",
    category: "Search",
    isMutating: false,
    description: "Btrag3 index awel 3onsor y-tsawa m3 el-value al-mu7adada. Law mesh mawgoud btrag3 -1.",
    syntax: "const index = arr.indexOf(searchElement, fromIndex)",
    exampleCode: `const tags = ["react", "nextjs", "tailwind"];\nconsole.log(tags.indexOf("nextjs"));`,
    output: `1`,
    useCase: "🏷️ Tagging System: Ma3refet position tag mo3ayan fel list."
  },
  {
    name: "lastIndexOf()",
    category: "Search",
    isMutating: false,
    description: "Btrag3 akher index le-3onsor y-tsawa m3 el-value al-mu7adada (search backward).",
    syntax: "const lastIdx = arr.lastIndexOf(searchElement)",
    exampleCode: `const items = ["apple", "banana", "apple"];\nconsole.log(items.lastIndexOf("apple"));`,
    output: `2`,
    useCase: "🔍 Text Search: Geeb akher occurrence le-item fel list."
  },
  {
    name: "some()",
    category: "Search",
    isMutating: false,
    description: "Btrag3 true law 3onsor wa7ed 3ala el-aqall b-y-fulfill el-shart, w false law wala 3onsor.",
    syntax: "const hasSome = arr.some((item) => condition)",
    exampleCode: `const cart = [\n  { name: "Book", digital: true },\n  { name: "Laptop", digital: false }\n];\nconst hasPhysicalItem = cart.some(item => !item.digital);`,
    output: `true`,
    useCase: "🚚 Shipping Calculator: Law el-cart feha 3onsor wa7ed 3ala el-aqall physical, efrad masareef shahn."
  },
  {
    name: "every()",
    category: "Search",
    isMutating: false,
    description: "Btrag3 true law KOL el-3anasir b-t-fulfill el-shart, w false law 3onsor wa7ed bas msh y-fulfill.",
    syntax: "const allValid = arr.every((item) => condition)",
    exampleCode: `const inventory = [\n  { qty: 5 },\n  { qty: 12 },\n  { qty: 3 }\n];\nconst allInStock = inventory.every(item => item.qty > 0);`,
    output: `true`,
    useCase: "✅ Checkout Validation: Ta'ked ان كل المنتجات في السلة ليها مخزون كافي قبل الـ Order."
  },
  {
    name: "includes()",
    category: "Search",
    isMutating: false,
    description: "Btrag3 true/false hal el-array feha value mo3ayana aw la'.",
    syntax: "const exists = arr.includes(searchElement)",
    exampleCode: `const allowedRoles = ["admin", "editor"];\nconsole.log(allowedRoles.includes("admin"));`,
    output: `true`,
    useCase: "🔒 Permissions & Auth: Ta'ked mn hal el-user عنده role مسموح بيه."
  },

  // 3. Mutating Add/Remove
  {
    name: "push()",
    category: "Mutating",
    isMutating: true,
    description: "Btdif 3onsor aw aktar fel AAKHER w btrag3 el-length el-gedida lel array (b-t-mutate el-original!).",
    syntax: "const newLength = arr.push(element1, element2)",
    exampleCode: `const cart = ["Item A"];\ncart.push("Item B");\nconsole.log(cart);`,
    output: `["Item A", "Item B"]`,
    useCase: "🛒 Cart Management: Edafat product gedid l-aakher el-cart list."
  },
  {
    name: "pop()",
    category: "Mutating",
    isMutating: true,
    description: "Btsheel akher 3onsor fel array w btrag3o (b-t-mutate el-original!).",
    syntax: "const poppedItem = arr.pop()",
    exampleCode: `const stack = ["Page 1", "Page 2"];\nconst last = stack.pop();\nconsole.log(last);`,
    output: `"Page 2"`,
    useCase: "🔙 Undo / History Stack: Erga3 l-akher action aw page fel navigation stack."
  },
  {
    name: "unshift()",
    category: "Mutating",
    isMutating: true,
    description: "Btdif 3onsor aw aktar fel BAWAL (mn el-shemal) w btrag3 el-length el-gedida.",
    syntax: "const newLength = arr.unshift(element1, element2)",
    exampleCode: `const notifications = ["Email sent"];\nnotifications.unshift("New Order!");\nconsole.log(notifications);`,
    output: `["New Order!", "Email sent"]`,
    useCase: "🔔 Feed Notifications: Edafat notification gedida f-awel el-list."
  },
  {
    name: "shift()",
    category: "Mutating",
    isMutating: true,
    description: "Btsheel AWEL 3onsor fel array w btrag3o.",
    syntax: "const shiftedItem = arr.shift()",
    exampleCode: `const queue = ["Ticket 1", "Ticket 2"];\nconst current = queue.shift();\nconsole.log(current);`,
    output: `"Ticket 1"`,
    useCase: "🎫 FIFO Queue: Processing l-awel ticket fel queue bta3 el-support."
  },

  // 4. Modifying & Slicing
  {
    name: "slice()",
    category: "Transformation",
    isMutating: false,
    description: "Bteqss جزء mn el-array mn startIndex l-endIndex (mesh inclusive) w btrag3 array gedida mn ghair ma t-mutate.",
    syntax: "const shallowCopy = arr.slice(start, end)",
    exampleCode: `const items = ["A", "B", "C", "D", "E"];\nconst page1 = items.slice(0, 3);\nconsole.log(page1);`,
    output: `["A", "B", "C"]`,
    useCase: "📄 Pagination: Taqsem el-products l-صفحات (Page 1: slice(0, 10), Page 2: slice(10, 20))."
  },
  {
    name: "splice()",
    category: "Mutating",
    isMutating: true,
    description: "Btsheel aw btdif 3anasir f-ay makan fel array (b-t-mutate el-original!).",
    syntax: "arr.splice(start, deleteCount, item1, item2)",
    exampleCode: `const months = ["Jan", "March", "April"];\nmonths.splice(1, 0, "Feb");\nconsole.log(months);`,
    output: `["Jan", "Feb", "March", "April"]`,
    useCase: "✏️ List Editing: Estebdal aw edafat items f-makan mu7adad fel array."
  },
  {
    name: "fill()",
    category: "Mutating",
    isMutating: true,
    description: "Btemla' el-array b-value static mn start l-end index.",
    syntax: "arr.fill(value, start, end)",
    exampleCode: `const slots = new Array(3).fill("Available");\nconsole.log(slots);`,
    output: `["Available", "Available", "Available"]`,
    useCase: "🩺 Booking System: Ensha' default available booking slots l-tabeeb."
  },
  {
    name: "copyWithin()",
    category: "Mutating",
    isMutating: true,
    description: "Btensakh part mn el-array l-makan tanee gowwa nafs el-array mn ghair ma t-gheyyr length.",
    syntax: "arr.copyWithin(targetIndex, start, end)",
    exampleCode: `const arr = ["a", "b", "c", "d", "e"];\narr.copyWithin(0, 3, 5);\nconsole.log(arr);`,
    output: `["d", "e", "c", "d", "e"]`,
    useCase: "⚡ High Performance Buffers: Transposition l-bytes aw data fel memory arrays."
  },
  {
    name: "toSpliced()",
    category: "Transformation",
    isMutating: false,
    description: "Nafs fikret splice() bas Immutable! Btrag3 array gedida m3 el-ta'deel mn ghair ma t-mutate el-original.",
    syntax: "const newArr = arr.toSpliced(start, deleteCount, ...items)",
    exampleCode: `const original = [1, 2, 5];\nconst updated = original.toSpliced(2, 0, 3, 4);\nconsole.log(updated);`,
    output: `[1, 2, 3, 4, 5]`,
    useCase: "⚛️ React State Updates: Ta'deel list items fel state mn ghair direct mutation."
  },
  {
    name: "with()",
    category: "Transformation",
    isMutating: false,
    description: "Bte3mel update le-3onsor f-index mo3ayan w btrag3 array gedida immutable.",
    syntax: "const updated = arr.with(index, newValue)",
    exampleCode: `const scores = [10, 20, 30];\nconst newScores = scores.with(1, 99);\nconsole.log(newScores);`,
    output: `[10, 99, 30]`,
    useCase: "⚛️ Modern React Immutability: Ta'deel 3onsor wa7ed f-array state b-khatwa wa7da."
  },

  // 5. Sorting & Reversing
  {
    name: "sort()",
    category: "Mutating",
    isMutating: true,
    description: "Btrateb 3anasir el-array (In-Place Mutating!). Default sorting b-ykoun lexicographical strings.",
    syntax: "arr.sort((a, b) => compareFunction)",
    exampleCode: `const prices = [300, 100, 200];\nprices.sort((a, b) => a - b);\nconsole.log(prices);`,
    output: `[100, 200, 300]`,
    useCase: "🏷️ Product Sorting: Tartib el-products mn el-aqall l-el-a3la se3ran."
  },
  {
    name: "reverse()",
    category: "Mutating",
    isMutating: true,
    description: "Bte3kes tartib 3anasir el-array fel makan (In-Place Mutating!).",
    syntax: "arr.reverse()",
    exampleCode: `const steps = [1, 2, 3];\nsteps.reverse();\nconsole.log(steps);`,
    output: `[3, 2, 1]`,
    useCase: "🕒 Reverse Order: E3kes tartib list 3ashan tkhali el-akheer f-el-awel."
  },
  {
    name: "toSorted()",
    category: "Transformation",
    isMutating: false,
    description: "Nafs sort() bas Immutable! Btrag3 array gedida mtratba mn ghair ma t-gheyyr el-original.",
    syntax: "const sorted = arr.toSorted((a, b) => a - b)",
    exampleCode: `const numbers = [3, 1, 2];\nconst sorted = numbers.toSorted();\nconsole.log(sorted);`,
    output: `[1, 2, 3]`,
    useCase: "📊 Safe Data Rendering: Tartib list fel UI mn ghair ma t-gheyyr el-raw data."
  },
  {
    name: "toReversed()",
    category: "Transformation",
    isMutating: false,
    description: "Nafs reverse() bas Immutable! Btrag3 array gedida ma3kosa.",
    syntax: "const reversed = arr.toReversed()",
    exampleCode: `const history = ["Step A", "Step B"];\nconst rev = history.toReversed();\nconsole.log(rev);`,
    output: `["Step B", "Step A"]`,
    useCase: "📜 History View: Arad el-history m3kous (Newest first) mn ghair mutation."
  },

  // 6. String & Join
  {
    name: "join()",
    category: "String & Join",
    isMutating: false,
    description: "Btrag3 string wa7ed mkon mn damg kol 3anasir el-array b-separator mo3ayan.",
    syntax: "const str = arr.join(separator)",
    exampleCode: `const path = ["users", "yaseen", "orders"];\nconsole.log(path.join("/"));`,
    output: `"users/yaseen/orders"`,
    useCase: "🔗 URL Building & CSV Export: Ensha' URL paths aw export CSV rows."
  },
  {
    name: "toString()",
    category: "String & Join",
    isMutating: false,
    description: "Btrag3 string mkon mn 3anasir el-array mfasoola b-comma `,`.",
    syntax: "const str = arr.toString()",
    exampleCode: `const colors = ["Red", "Green", "Blue"];\nconsole.log(colors.toString());`,
    output: `"Red,Green,Blue"`,
    useCase: "🖨️ Quick Formatting: Tahweel array l-simple string."
  },
  {
    name: "concat()",
    category: "Transformation",
    isMutating: false,
    description: "Btdamg arrays aw values مع بعض w btrag3 array gedida.",
    syntax: "const combined = arr1.concat(arr2, item3)",
    exampleCode: `const set1 = [1, 2];\nconst set2 = [3, 4];\nconsole.log(set1.concat(set2));`,
    output: `[1, 2, 3, 4]`,
    useCase: "🧩 Merging Collections: Damg list of local items m3 server items."
  },

  // 7. Inspection & Creation
  {
    name: "Array.isArray()",
    category: "Inspection",
    isMutating: false,
    description: "Static method btef7as hal el-variable array 7aqeeqi aw la' (btrag3 true/false).",
    syntax: "Array.isArray(value)",
    exampleCode: `console.log(Array.isArray([1, 2]));\nconsole.log(Array.isArray("hello"));`,
    output: `true\nfalse`,
    useCase: "🛡️ Type Safety: El-tahaquq mn el-API response qabl ma t-run .map()."
  },
  {
    name: "at()",
    category: "Inspection",
    isMutating: false,
    description: "Btrag3 el-3onsor f-index mo3ayan. Bted3am negative indices (zay -1 l-akher 3onsor!).",
    syntax: "const item = arr.at(index)",
    exampleCode: `const items = ["First", "Middle", "Last"];\nconsole.log(items.at(-1));`,
    output: `"Last"`,
    useCase: "🎯 Easy Indexing: الوصول لـ آخر عنصر بـ `arr.at(-1)` بدلاً من `arr[arr.length - 1]`."
  },
  {
    name: "Array.from()",
    category: "Inspection",
    isMutating: false,
    description: "Btencha' Array gedida mn array-like object (zay NodeList aw Set) m3 mapFunction optional.",
    syntax: "Array.from(arrayLike, mapFn)",
    exampleCode: `const set = new Set([1, 2, 2, 3]);\nconst unique = Array.from(set);\nconsole.log(unique);`,
    output: `[1, 2, 3]`,
    useCase: "🌐 DOM & Set Conversion: Tahweel DOM NodeList aw Set l-Array 7aqeeqya."
  },
  {
    name: "Array.of()",
    category: "Inspection",
    isMutating: false,
    description: "Btencha' Array gedida mn el-arguments elly bttb3t-ha.",
    syntax: "Array.of(element0, element1, ...)",
    exampleCode: `const arr = Array.of(7);\nconsole.log(arr);`,
    output: `[7]`,
    useCase: "🏗️ Array Constructor: Ensha' array b-element wa7ed raqam (بدلاً من `new Array(7)` اللي بتعمل فاضي)."
  },

  // 8. Iterators & Keys
  {
    name: "entries()",
    category: "Advanced",
    isMutating: false,
    description: "Btrag3 Array Iterator Object feeh `[index, value]` l-kol 3onsor.",
    syntax: "const iterator = arr.entries()",
    exampleCode: `const arr = ["a", "b"];\nfor (const [index, element] of arr.entries()) {\n  console.log(index, element);\n}`,
    output: `0 "a"\n1 "b"`,
    useCase: "🔄 Custom Loops: Ensha' loops bte3red el-index w el-value ma3an."
  },
  {
    name: "keys()",
    category: "Advanced",
    isMutating: false,
    description: "Btrag3 Array Iterator Object feeh el-indices (keys) bta3t el-array.",
    syntax: "const iterator = arr.keys()",
    exampleCode: `const arr = ["x", "y", "z"];\nconsole.log([...arr.keys()]);`,
    output: `[0, 1, 2]`,
    useCase: "🔑 Index Iteration: Ensha' list b-el-indices bas."
  },
  {
    name: "values()",
    category: "Advanced",
    isMutating: false,
    description: "Btrag3 Array Iterator Object feeh el-values bta3t el-array.",
    syntax: "const iterator = arr.values()",
    exampleCode: `const arr = ["a", "b"];\nconsole.log([...arr.values()]);`,
    output: `["a", "b"]`,
    useCase: "Values Iteration: Processing l-values bas."
  },

  // 9. Reduction & Flattening
  {
    name: "reduce()",
    category: "Advanced",
    isMutating: false,
    description: "B-t-accumulator (btekhzer) kol 3anasir el-array l-single value (number, object, array, etc) mn el-shemal l-el-yamin.",
    syntax: "const result = arr.reduce((acc, current) => { return acc; }, initialValue)",
    exampleCode: `const cart = [\n  { price: 100, qty: 2 },\n  { price: 50, qty: 1 }\n];\nconst total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);\nconsole.log(total);`,
    output: `250`,
    useCase: "📊 Financial Calculations: Hesab el-total bta3 el-cart, grouping data, aw counting totals."
  },
  {
    name: "reduceRight()",
    category: "Advanced",
    isMutating: false,
    description: "Nafs reduce() bas btebda' el-accumulation mn el-yamin l-el-shemal (Right to Left).",
    syntax: "const result = arr.reduceRight((acc, current) => { return acc; }, initialValue)",
    exampleCode: `const words = ["a", "b", "c"];\nconst str = words.reduceRight((acc, curr) => acc + curr);\nconsole.log(str);`,
    output: `"cba"`,
    useCase: "🔄 Right-to-Left Pipelines: Processing functions aw data backwards."
  },
  {
    name: "flat()",
    category: "Transformation",
    isMutating: false,
    description: "Btsate7 (flatten) el-nested arrays l-depth mo3ayan w btrag3 array gedida.",
    syntax: "const flatArr = arr.flat(depth)",
    exampleCode: `const nested = [1, [2, [3, 4]]];\nconsole.log(nested.flat(2));`,
    output: `[1, 2, 3, 4]`,
    useCase: "🗂️ Data Cleaning: Tastih list of categories aw nested API responses."
  },
  {
    name: "flatMap()",
    category: "Transformation",
    isMutating: false,
    description: "Bte3mel map() thumma flat(1) f-khatwa wa7da aysar w asra3.",
    syntax: "const result = arr.flatMap((item) => [newItem])",
    exampleCode: `const orders = [\n  { items: ["Laptop", "Mouse"] },\n  { items: ["Keyboard"] }\n];\nconst allItems = orders.flatMap(o => o.items);\nconsole.log(allItems);`,
    output: `["Laptop", "Mouse", "Keyboard"]`,
    useCase: "🛒 Flattening Relations: Istikhraj 1D list of items mn array of order objects."
  }
];
