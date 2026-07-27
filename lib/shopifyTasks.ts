import { ShopifyModule } from "./storage";

export interface ShopifyTaskResponse {
  task: string;
  hint?: string;
  expectedFormat?: "code" | "explanation" | "mixed";
}

export interface ShopifyReviewResponse {
  feedback: string;
  mastered: boolean;
}

const LOCAL_TASKS_PER_MODULE: Record<string, ShopifyTaskResponse[]> = {
  "liquid-fundamentals": [
    {
      task: "Iktib Liquid snippet y3red list b-kol el-products fel collection `featured`. Law el product `available` is true, e3red price formatted b-`money` filter w e3red tag 'In Stock'. Law msh available, e3red badge 'Sold Out'.",
      hint: "Istadhem `{% for product in collections['featured'].products %}` w conditionals `{% if product.available %}`.",
      expectedFormat: "code"
    },
    {
      task: "Iktib Liquid code yakhod variable `cart_total` w yef7as: law el total akbar mn 500 EGP, e3red 'Free Shipping Unlocked!'. Law aql, e3red kam baqi 3ala el-free shipping.",
      hint: "Istadhem `{% assign shipping_threshold = 500 %}` w Liquid math filter `minus`.",
      expectedFormat: "code"
    }
  ],
  "theme-architecture": [
    {
      task: "Iktib `schema.json` block l-section esmo 'Hero Banner'. El-schema lezmn ykoun feha `name`, `settings` (image_picker l-banner background, text setting l-title, w color setting l-button), w `presets` 3ashan t-appear fel Theme Editor.",
      hint: "Istadhem `{ \"name\": \"Hero Banner\", \"settings\": [...], \"presets\": [{ \"name\": \"Hero Banner\" }] }`.",
      expectedFormat: "code"
    },
    {
      task: "Eshra7 el-farq bein `snippets/` w `sections/` fel Shopify theme architecture, w imta t-use `{% render 'snippet-name' %}` vs `{% section 'section-name' %}`.",
      hint: "El-sections feha `schema.json` w dynamic settings, el-snippets reusable blocks mn ghair schema khas biha.",
      expectedFormat: "explanation"
    }
  ],
  "cli-workflow": [
    {
      task: "Ektib el-Shopify CLI commands el-rasmeya 3ashan: 1) Log in l-dev store, 2) Pull theme code l-gehazak, 3) Start local preview server (`theme dev`), w 4) Push el-changes 3ala staging theme.",
      hint: "Istadhem `shopify theme init`, `shopify theme dev --store=...`, `shopify theme push`.",
      expectedFormat: "code"
    }
  ],
  "storefront-custom": [
    {
      task: "Ektib Liquid code y-access Metafield custom esmo `custom.care_instructions` fel Product object, w y-render HTML accordion section bas law el-metafield da feeh value.",
      hint: "Istadhem `{% if product.metafields.custom.care_instructions != blank %}`.",
      expectedFormat: "code"
    }
  ],
  "admin-storefront-api": [
    {
      task: "Iktib GraphQL query l-Shopify Storefront API ytrag3 akher 5 products (title, handle, priceRange, w el-featuredImage url).",
      hint: "Istadhem query `{ products(first: 5) { edges { node { title handle priceRange { minVariantPrice { amount currencyCode } } } } } }`.",
      expectedFormat: "code"
    }
  ],
  "app-dev": [
    {
      task: "Eshra7 خطوات الـ OAuth Authentication flow l-Shopify App mn awel ma el-merchant y-install el-app l حد ما t-receive el-permanent `access_token` w t-verify el-HMAC signature.",
      hint: "Izkur: Client ID, Redirect URI, Auth Code exchange, w HMAC verification.",
      expectedFormat: "explanation"
    }
  ],
  "client-handoff": [
    {
      task: "Iktib Client Handoff Checklist mkonat mn 5 noqat ra'eseya lezm t-check 3aleha qabl ma t-transfer el-ownership aw t-publish el-theme 3ala live store beta3 el-client.",
      hint: "Izkur: Backup theme, Metafields setup, Apps compatibility, Responsive check, w Staff permissions.",
      expectedFormat: "mixed"
    }
  ]
};

export function getLocalShopifyTask(module: ShopifyModule, taskIndex: number = 0): ShopifyTaskResponse {
  const tasks = LOCAL_TASKS_PER_MODULE[module.id] || [
    {
      task: `Iktib exercise practical fi module "${module.title}" y-cover el-focus: ${module.focus}.`,
      hint: "Focus 3ala el-syntax w el-best practices.",
      expectedFormat: "mixed"
    }
  ];
  return tasks[taskIndex % tasks.length];
}

export function generateLocalShopifyReview(
  module: ShopifyModule,
  userAnswer: string
): ShopifyReviewResponse {
  const trimmed = userAnswer.trim();
  if (trimmed.length < 15) {
    return {
      feedback: "El-ijaba aql mn el-matloub w mesh kafiha l-ithbat mastery el-module. Gareb tktib el-code aw el-sharh b-tafaseel aktar w ykoun muwada7.",
      mastered: false
    };
  }

  // Check key words based on module
  let mastered = true;
  let tip = "Mumtaz! El-ijaba bit'aked fahmak l-concept el-module b-shakl 3amaly ra'e3.";

  if (module.id === "liquid-fundamentals" && !trimmed.includes("%") && !trimmed.includes("{{")) {
    mastered = false;
    tip = "El-module da mehtag Liquid syntax (zay `{% %}` aw `{{ }}`). E3mel re-check w ektib Liquid code daqeeq.";
  } else if (module.id === "theme-architecture" && !trimmed.includes("schema") && !trimmed.includes("section")) {
    mastered = false;
    tip = "Lezm t-mention el-`schema` aw `sections` 3ashan t-master theme architecture.";
  }

  if (mastered) {
    return {
      feedback: `Ash-ta يا بطل! ${tip} Khsh 3ala el-module el-gai!`,
      mastered: true
    };
  } else {
    return {
      feedback: `Kowayyes, bas ${tip} Gareb tani w 3adell el-submission.`,
      mastered: false
    };
  }
}
