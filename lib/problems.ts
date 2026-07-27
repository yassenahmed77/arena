export interface TestCase {
  input: any[];
  expected: any;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  concept: string;
  description: string;
  functionName: string;
  starterCode: string;
  testCases: TestCase[];
}

export const PROBLEM_BANK: Problem[] = [
  {
    id: "sum_evens",
    title: "Magmo3 el A3dad el Zowgeya",
    difficulty: "easy",
    concept: "Array manipulation",
    description: "Iktib function btakhod array of numbers w btrag3 magmo3 el a3dad el zowgeya (even numbers) bas. Law el array mfehash a3dad zowgeya, rag3 0.",
    functionName: "sumEvens",
    starterCode: "function sumEvens(arr) {\n  // your code here\n}",
    testCases: [
      { input: [[1, 2, 3, 4, 5, 6]], expected: 12 },
      { input: [[1, 3, 5]], expected: 0 },
      { input: [[2, 4, 6]], expected: 12 },
      { input: [[]], expected: 0 },
      { input: [[-2, 3, -4]], expected: -6 }
    ]
  },
  {
    id: "reverse_words",
    title: "E3kes el Kalamat",
    difficulty: "easy",
    concept: "String logic",
    description: "Iktib function btakhod string sentence w bte3kes tartib el kalamat m3 el 7efaz 3ala nafs el 7orof gowwa el kalema.",
    functionName: "reverseWords",
    starterCode: "function reverseWords(sentence) {\n  // your code here\n}",
    testCases: [
      { input: ["hello world"], expected: "world hello" },
      { input: ["arena code practice"], expected: "practice code arena" },
      { input: ["single"], expected: "single" },
      { input: ["a b c"], expected: "c b a" }
    ]
  },
  {
    id: "count_vowels",
    title: "3adad 7orof el Vowels",
    difficulty: "easy",
    concept: "String matching",
    description: "Iktib function btakhod string w btrag3 3adad 7orof el Vowels (a, e, i, o, u) سواء uppercase aw lowercase.",
    functionName: "countVowels",
    starterCode: "function countVowels(str) {\n  // your code here\n}",
    testCases: [
      { input: ["hello"], expected: 2 },
      { input: ["ARENA"], expected: 3 },
      { input: ["xyz"], expected: 0 },
      { input: ["JavaScript"], expected: 3 }
    ]
  },
  {
    id: "find_max",
    title: "Akbar Raqam fel Array",
    difficulty: "easy",
    concept: "Array search",
    description: "Iktib function btakhod array of numbers w btrag3 akbar raqam fihom. Law el array fadya rag3 null.",
    functionName: "findMax",
    starterCode: "function findMax(numbers) {\n  // your code here\n}",
    testCases: [
      { input: [[3, 7, 2, 9, 5]], expected: 9 },
      { input: [[-10, -3, -5]], expected: -3 },
      { input: [[]], expected: null },
      { input: [[42]], expected: 42 }
    ]
  },
  {
    id: "is_palindrome",
    title: "Hal el Kalema Palindrome?",
    difficulty: "easy",
    concept: "String logic",
    description: "Iktib function btef7as hal el string palindrome (bteqra nafs el shagl mn el yamen w el shemal, ignore case).",
    functionName: "isPalindrome",
    starterCode: "function isPalindrome(str) {\n  // your code here\n}",
    testCases: [
      { input: ["racecar"], expected: true },
      { input: ["Hello"], expected: false },
      { input: ["Madam"], expected: true },
      { input: ["a"], expected: true }
    ]
  },
  {
    id: "count_occurrences",
    title: "Tekerar el 3anasir fel Array",
    difficulty: "easy",
    concept: "Object mapping",
    description: "Iktib function btakhod array of strings/numbers w btrag3 Object fi3 3adad tekerar kol 3onsor.",
    functionName: "countOccurrences",
    starterCode: "function countOccurrences(arr) {\n  // your code here\n}",
    testCases: [
      { input: [["apple", "banana", "apple"]], expected: { apple: 2, banana: 1 } },
      { input: [[1, 1, 2, 3]], expected: { "1": 2, "2": 1, "3": 1 } },
      { input: [[]], expected: {} }
    ]
  },
  {
    id: "remove_duplicates",
    title: "Mano3 el Tekerar fel Array",
    difficulty: "easy",
    concept: "Set & Array filtering",
    description: "Iktib function btakhod array w btrag3 array gedida b-el 3anasir mn ghair tekerar.",
    functionName: "removeDuplicates",
    starterCode: "function removeDuplicates(arr) {\n  // your code here\n}",
    testCases: [
      { input: [[1, 2, 2, 3, 4, 4]], expected: [1, 2, 3, 4] },
      { input: [["a", "b", "a"]], expected: ["a", "b"] },
      { input: [[]], expected: [] }
    ]
  },
  {
    id: "format_price_egp",
    title: "Tansiq As3ar el Matjar",
    difficulty: "medium",
    concept: "Formatting utility",
    description: "Iktib function btakhod number (price) w btrag3 string mtnsq zay `'250.00 EGP'`. Law el price negative aw 0 rag3 `'0.00 EGP'`. E3mel rounding l 2 decimal places.",
    functionName: "formatPrice",
    starterCode: "function formatPrice(amount) {\n  // your code here\n}",
    testCases: [
      { input: [250], expected: "250.00 EGP" },
      { input: [19.9], expected: "19.90 EGP" },
      { input: [-5], expected: "0.00 EGP" },
      { input: [0], expected: "0.00 EGP" }
    ]
  },
  {
    id: "check_stock",
    title: "Fahs el Al-Makhzoon (Stock Check)",
    difficulty: "medium",
    concept: "Inventory logic",
    description: "Iktib function btakhod inventory object `{ [productId]: stockCount }` w order object `{ [productId]: requestedQty }`. Rag3 true law kol el products fel order 3andaha stock kafi, w false law fee haga naqsa aw mesh mawgoda fel inventory.",
    functionName: "checkStock",
    starterCode: "function checkStock(inventory, order) {\n  // your code here\n}",
    testCases: [
      { input: [{ p1: 10, p2: 5 }, { p1: 2, p2: 5 }], expected: true },
      { input: [{ p1: 10, p2: 5 }, { p1: 12 }], expected: false },
      { input: [{ p1: 10 }, { p2: 1 }], expected: false },
      { input: [{ p1: 5 }, {}], expected: true }
    ]
  },
  {
    id: "calculate_total",
    title: "Hesab Magmo3 el Fatowra m3 Discount",
    difficulty: "medium",
    concept: "E-commerce logic",
    description: "Iktib function btakhod array of cart items `{ price, quantity }` w discount percentage (e.g. 10 for 10%), w btrag3 el total el neha'y ba3d el discount.",
    functionName: "calculateTotal",
    starterCode: "function calculateTotal(items, discountPercent) {\n  // your code here\n}",
    testCases: [
      { input: [[{ price: 100, quantity: 2 }, { price: 50, quantity: 1 }], 10], expected: 225 },
      { input: [[{ price: 10, quantity: 1 }], 0], expected: 10 },
      { input: [[], 20], expected: 0 }
    ]
  },
  {
    id: "group_by",
    title: "Taqsem el Objects b-Property",
    difficulty: "medium",
    concept: "Object grouping",
    description: "Iktib function btakhod array of objects w string propertyName, w btrag3 object mqsem el 3anasir 3ala 7asab qeemat el property de.",
    functionName: "groupBy",
    starterCode: "function groupBy(items, prop) {\n  // your code here\n}",
    testCases: [
      {
        input: [
          [
            { category: "fruit", name: "apple" },
            { category: "fruit", name: "banana" },
            { category: "veg", name: "carrot" }
          ],
          "category"
        ],
        expected: {
          fruit: [
            { category: "fruit", name: "apple" },
            { category: "fruit", name: "banana" }
          ],
          veg: [{ category: "veg", name: "carrot" }]
        }
      }
    ]
  },
  {
    id: "chunk_array",
    title: "Taqsem el Array l-Chunks",
    difficulty: "hard",
    concept: "Array chunking",
    description: "Iktib function btakhod array w chunkSize, w bteqsm el array l-arrays sagheyra b-nafs el size (el chunk el akheer momken yb2a aql).",
    functionName: "chunkArray",
    starterCode: "function chunkArray(arr, size) {\n  // your code here\n}",
    testCases: [
      { input: [[1, 2, 3, 4, 5], 2], expected: [[1, 2], [3, 4], [5]] },
      { input: [[1, 2, 3], 5], expected: [[1, 2, 3]] },
      { input: [[], 3], expected: [] }
    ]
  },
  {
    id: "flatten_array",
    title: "Tastih el Arrays el Motadakha",
    difficulty: "hard",
    concept: "Recursion & Flattening",
    description: "Iktib function btakhod array فيها arrays متداخلة b-ay 3omq w btrag3 1D array flattened.",
    functionName: "flattenArray",
    starterCode: "function flattenArray(arr) {\n  // your code here\n}",
    testCases: [
      { input: [[1, [2, [3, 4], 5]]], expected: [1, 2, 3, 4, 5] },
      { input: [[[1], [2]]], expected: [1, 2] },
      { input: [[]], expected: [] }
    ]
  }
];

export function getRandomProblem(
  targetDifficulty: "easy" | "medium" | "hard",
  recentConcepts: string[] = []
): Problem {
  let candidates = PROBLEM_BANK.filter((p) => p.difficulty === targetDifficulty);
  if (candidates.length === 0) {
    candidates = PROBLEM_BANK;
  }

  const nonRepeated = candidates.filter((p) => !recentConcepts.includes(p.concept));
  const pool = nonRepeated.length > 0 ? nonRepeated : candidates;

  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

export function generateLocalReview(
  problem: Problem,
  passCount: number,
  totalTests: number,
  userCode: string
): { feedback: string; weakAreas: string[]; levelUp: boolean } {
  const allPassed = passCount === totalTests;

  let tip = "";
  if (userCode.includes("for(") || userCode.includes("for (")) {
    tip = "💡 Level Up Tip: El-loop bta3ak mumtaz! Momken fel marrat el-gaya tgarrab HOFs zay .reduce() aw .filter() 3ashan tekon cleaner w declarative.";
  } else if (userCode.includes(".filter") || userCode.includes(".map")) {
    tip = "💡 Level Up Tip: Istikhdam ra'e3 l-Higher-Order Functions! Gareb tkhali el-arrow function inlined aw tkhali el-return implicit l-cleaner code.";
  } else if (userCode.includes("let ")) {
    tip = "💡 Level Up Tip: Momken tkhali el-variables 'const' badal 'let' law mesh bte3mel re-assign 3ashan t-prevent accidental mutations.";
  } else {
    tip = "💡 Level Up Tip: Dayman e3mel check 3ala edge cases zay empty arrays, null values, aw negative numbers qabl el-processing.";
  }

  if (allPassed) {
    return {
      feedback: `Ash-ta ya basha! El-code passed kol el-test cases (${passCount}/${totalTests}). El-solution bta3tk munazama w 100% wa'edah!\n\n${tip}\n\nKhalik mastamirr kda!`,
      weakAreas: [],
      levelUp: true,
    };
  } else {
    const failedCount = totalTests - passCount;
    return {
      feedback: `El-code sallam ${passCount} mn asel ${totalTests} test cases (${failedCount} failed). Ef7as el-edge cases zay el-empty arrays aw formatting.\n\n${tip}\n\nGareb tani w hatgebha!`,
      weakAreas: [problem.concept],
      levelUp: false,
    };
  }
}
