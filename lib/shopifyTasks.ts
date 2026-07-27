import { ShopifyModule } from "./storage";

export interface ShopifyTaskResponse {
  title: string;
  steps: string[];
  appliesTo: string;
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
      title: "Sale Badge & Price Display on Product Page",
      appliesTo: "أي متجر Shopify فيه منتجات عليها عروض وخصومات خاصة",
      steps: [
        "افتح ملف `snippets/product-price.liquid` أو المكان المخصص للسعر في الـ Theme بتاعك.",
        "ضيف شرط باستخدام Liquid: `{% if product.compare_at_price > product.price %}` عشان تتحقق إن فيه خصم.",
        "جوه الشرط، اعرض `<span>` واخد class ألوان الخصم وبيكتب 'Sale' أو نسبة الخصم باستخدام `{{ product.compare_at_price | minus: product.price | times: 100 | divided_by: product.compare_at_price | round }}% OFF`.",
        "اعرض السعر الحالي المخفض باستخدام `{{ product.price | money }}` والسعر القديم المشطوب `<s>{{ product.compare_at_price | money }}</s>`.",
        "اختبر الكود على dev store بمنتج عليه compare-at price ومنتج آخر بسعر عادي للتأكد من إن الـ Badge بيظهر في المكان الصح."
      ],
      hint: "استخدم `{% if product.compare_at_price > product.price %}` واعرض `product.price | money`.",
      expectedFormat: "code"
    },
    {
      title: "Free Shipping Progress Bar in Cart Drawer",
      appliesTo: "أي متجر محتاج يزود متوسط قيمة الطلب (AOV) بعرض الشحن المجاني",
      steps: [
        "افتح `sections/cart-drawer.liquid` أو `snippets/cart-drawer.liquid`.",
        "عرف متغير الـ threshold: `{% assign free_shipping_threshold = 50000 %}` (بالـ cents أي 500 EGP).",
        "احسب الباقي: `{% assign remaining = free_shipping_threshold | minus: cart.total_price %}`.",
        "لو `cart.total_price >= free_shipping_threshold` اعرض رسالة 🎉 'مبروك! كسبت شحن مجاني'.",
        "لو باقي مبلغ، اعرض باقي كام: 'فاضل لك {{ remaining | money }} وتحصل على شحن مجاني'."
      ],
      hint: "استخدم Liquid math filters `minus` وافحص `cart.total_price`.",
      expectedFormat: "code"
    }
  ],
  "theme-architecture": [
    {
      title: "Custom Announcement Bar Section with Schema Settings",
      appliesTo: "صفحة المتجر الرئيسية لإبراز العروض وساعات التوصيل",
      steps: [
        "كريت ملف جديد باسم `sections/custom-announcement.liquid`.",
        "ضيف هيكل الـ HTML وشغل الـ Liquid variables للـ text والـ colors.",
        "اكتب الـ `{% schema %}` بالأسفل محتوياً على `name`, `settings` (text, color_picker, url), و `presets` مفعلة باسم 'Custom Announcement'.",
        "افتح الـ Theme Editor في Shopify Admin وتأكد إن الـ section ظهر وتقدر تغيّر النص واللون منه مباشرة."
      ],
      hint: "الـ schema لازم تشمل `\"presets\": [{ \"name\": \"Custom Announcement\" }]` عشان يظهر في الـ Theme Editor.",
      expectedFormat: "code"
    }
  ],
  "cli-workflow": [
    {
      title: "Shopify CLI Theme Pull & Live Dev Preview Workflow",
      appliesTo: "تطوير وشحن أي تعديلات على Theme العميل بأمان دون تخريب الموقع المباشر",
      steps: [
        "افتح التيرمنال واعمل تسجيل دخول للمتجر: `shopify auth login`.",
        "اسحب نسخة الـ Theme الحالي للتطوير المحلي: `shopify theme pull --store=your-dev-store.myshopify.com`.",
        "شغل الـ Local Preview Server: `shopify theme dev` وافتح الـ URL المحلي في المتصفح.",
        "بعد تعديل الكود واختباره، ارفع التعديلات على Development Theme خاص: `shopify theme push --unpublished`."
      ],
      hint: "استخدم `shopify theme dev` للتطوير و `shopify theme push --unpublished` للرفع الأمني.",
      expectedFormat: "explanation"
    }
  ],
  "storefront-custom": [
    {
      title: "Custom Care Instructions Metafield Section",
      appliesTo: "صفحة المنتجات للعملاء اللي محتاجين مواصفات خاصة لكل منتج (زاي تعليمات الغسيل أو الضمان)",
      steps: [
        "افتح Shopify Admin ➔ Settings ➔ Custom Data ➔ Products وعرّف Metafield باسم `custom.care_instructions` نوعه Single/Multi-line text.",
        "افتح `sections/main-product.liquid` أو كريت Snippet جديد `snippets/product-care.liquid`.",
        "افحص وجود قيمة في الـ Metafield: `{% if product.metafields.custom.care_instructions != blank %}`.",
        "اعرض القيمة داخل Tab أو Accordion: `{{ product.metafields.custom.care_instructions | newline_to_br }}`."
      ],
      hint: "افحص `product.metafields.namespace.key != blank` قبل العرض.",
      expectedFormat: "code"
    }
  ],
  "admin-storefront-api": [
    {
      title: "GraphQL Storefront API Product Query for Custom App/Frontend",
      appliesTo: "بناء Headless Storefront أو React/Next.js Component يعرض المنتجات من Shopify",
      steps: [
        "اكتب GraphQL query تطلب أول 6 منتجات متضمنة (id, title, handle, priceRange, featuredImage url).",
        "استخدم الـ `Storefront Access Token` لتنفيذ الـ fetch request على `https://your-store.myshopify.com/api/2024-01/graphql.json`.",
        "عالج الـ response وقم بفلترة المنتجات غير المتاحة (out of stock).",
        "اعرض المنتجات في React Component مع زر الإضافة للسلة."
      ],
      hint: "الـ query تشمل `products(first: 6) { edges { node { title priceRange { minVariantPrice { amount } } } } }`.",
      expectedFormat: "code"
    }
  ],
  "app-dev": [
    {
      title: "Shopify Embedded App OAuth Handshake & Webhook Registration",
      appliesTo: "بناء Shopify App مخصص للتجار (مثل نظام نقاط الولاء أو المبيعات)",
      steps: [
        "إعداد الـ App Scopes المطلوب في `shopify.app.toml` (مثل `read_products, write_orders`).",
        "تنفيذ OAuth Install URL redirection مع الـ Client ID والـ Scopes.",
        "استقبال الـ Auth Code في الـ Redirect Controller والتحقق من الـ HMAC signature لضمان الأمان.",
        "تبادل الـ Auth Code بـ Permanent `access_token` وتسجيل Webhook لحدث `orders/create`."
      ],
      hint: "التحقق من الـ HMAC خطوة أمان أساسية قبل تبادل الـ Access Token.",
      expectedFormat: "explanation"
    }
  ],
  "client-handoff": [
    {
      title: "Production Theme Deployment & Client Handoff Checklist",
      appliesTo: "تسليم المتجر النهائي للعميل وتفعيل الـ Live Theme بأمان 100%",
      steps: [
        "خذ نسخة احتياطية (Duplicate/Export) من الـ Live Theme الحالي للعميل كـ Backup.",
        "افحص عمل كافة الـ Metafields والـ App Integrations على الـ Staging Theme.",
        "قم بعمل Publish للـ Theme الجديد من Shopify Admin ➔ Online Store ➔ Themes.",
        "تأكد من اختبار تجربة الشراء كاملة (Test Order / Checkout flow) وإرسال وثيقة الشرح والتسليم للعميل."
      ],
      hint: "خذ Backup دائماً قبل عمل Publish للـ Theme الجديد.",
      expectedFormat: "mixed"
    }
  ]
};

export function getLocalShopifyTask(module: ShopifyModule, taskIndex: number = 0): ShopifyTaskResponse {
  const tasks = LOCAL_TASKS_PER_MODULE[module.id] || [
    {
      title: `Guided Build for ${module.title}`,
      appliesTo: `تطبيقات عمل على مواقع عملاء Shopify في ${module.title}`,
      steps: [
        `1) افتح الملف المخصص لـ ${module.title} في الـ Theme بتاعك.`,
        `2) ضيف الكود والـ Liquid logic الخاص بـ ${module.focus}.`,
        `3) اختبر النتيجة في الـ dev store والتأكد من الأداء.`
      ],
      hint: "ركز على الـ syntax والـ best practices في التطبيق العملي.",
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
      feedback: "الإجابة غير مكتملة ولم تطبق الخطوات المحددة في الـ Walkthrough. يرجى تطبيق الخطوات بالتفصيل وكتابة الـ Code أو الشرح المطلوب لضمان الجاهزية لمواقع العملاء.",
      mastered: false
    };
  }

  let mastered = true;
  let tip = "ممتاز جداً! الكود/الشرح يغطي كافة خطوات الـ Walkthrough وجاهز للتطبيق العملي على موقع عميل حقيقي.";

  if (module.id === "liquid-fundamentals" && !trimmed.includes("%") && !trimmed.includes("{{")) {
    mastered = false;
    tip = "الـ Walkthrough يتطلب استخدام Liquid syntax (مثل `{% %}` أو `{{ }}`). يرجى مراجعة الخطوات وتطبيق الـ Liquid code الصحيح.";
  } else if (module.id === "theme-architecture" && !trimmed.includes("schema") && !trimmed.includes("section")) {
    mastered = false;
    tip = "يجب تضمين الـ `schema` والـ `sections` في تطبيق خطوة الـ Theme Architecture.";
  }

  if (mastered) {
    return {
      feedback: `عاش يا بطل! 🎯 ${tip} يمكنك الانتقال للموديول التالي في المنهج!`,
      mastered: true
    };
  } else {
    return {
      feedback: `جيد، ولكن ${tip} حاول مرة أخرى وتأكد من تطبيق جميع خطوات الـ Walkthrough.`,
      mastered: false
    };
  }
}
