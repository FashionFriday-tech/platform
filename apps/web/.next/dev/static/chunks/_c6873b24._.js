(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ui/cards/BrandCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BrandCard",
    ()=>BrandCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
"use client";
;
;
const BrandCard = ({ brand })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: `/brands/${brand.slug}`,
        className: "group",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    backgroundColor: brand.color
                },
                className: "relative aspect-3/3 overflow-hidden rounded-[3rem] flex justify-center items-center",
                children: [
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: brand.logo,
                        alt: brand.name,
                        className: "w-32 object-contain invert"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/cards/BrandCard.tsx",
                        lineNumber: 13,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/cards/BrandCard.tsx",
                lineNumber: 8,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 px-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-foreground font-bold text-sm truncate uppercase tracking-tight",
                    children: brand.name
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/cards/BrandCard.tsx",
                    lineNumber: 16,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/cards/BrandCard.tsx",
                lineNumber: 15,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/cards/BrandCard.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c = BrandCard;
var _c;
__turbopack_context__.k.register(_c, "BrandCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/brandLogos.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const brandLogos = [
    {
        name: "Zara",
        slug: "zara",
        color: "#000000",
        logo: "/images/brand-logos/zara.png",
        categories: [
            "fashion"
        ]
    },
    {
        name: "YSL",
        slug: "ysl",
        color: "#000000",
        logo: "/images/brand-logos/ysl.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Yeezy",
        slug: "yeezy",
        color: "#727272",
        logo: "/images/brand-logos/yeezy.png",
        categories: [
            "sneakers",
            "streetwear"
        ]
    },
    {
        name: "Y-3",
        slug: "y-3",
        color: "#111111",
        logo: "/images/brand-logos/y3.png",
        categories: [
            "luxury",
            "streetwear",
            "fashion"
        ]
    },
    {
        name: "Versace",
        slug: "versace",
        color: "#8B7344",
        logo: "/images/brand-logos/versace.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Vans",
        slug: "vans",
        color: "#BA0C2F",
        logo: "/images/brand-logos/vans.png",
        categories: [
            "sneakers",
            "streetwear"
        ]
    },
    {
        name: "Valentino",
        slug: "valentino",
        color: "#E4002B",
        logo: "/images/brand-logos/valentino.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Vacheron Constantin",
        slug: "vacheron-constantin",
        color: "#2B2B2B",
        logo: "/images/brand-logos/vacheronconstantin.png",
        categories: [
            "luxury",
            "watches"
        ]
    },
    {
        name: "Under Armour",
        slug: "under-armour",
        color: "#000000",
        logo: "/images/brand-logos/underarmour.png",
        categories: [
            "sportswear"
        ]
    },
    {
        name: "Tom Ford",
        slug: "tom-ford",
        color: "#262624",
        logo: "/images/brand-logos/tomford.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Tissot",
        slug: "tissot",
        color: "#E11A27",
        logo: "/images/brand-logos/tissot.png",
        categories: [
            "watches"
        ]
    },
    {
        name: "Tag Heuer",
        slug: "tag-heuer",
        color: "#003224",
        logo: "/images/brand-logos/tagheuer.png",
        categories: [
            "watches",
            "luxury"
        ]
    },
    {
        name: "Supreme",
        slug: "supreme",
        color: "#ED1C24",
        logo: "/images/brand-logos/supreme.png",
        categories: [
            "streetwear"
        ]
    },
    {
        name: "Stüssy",
        slug: "stussy",
        color: "#000000",
        logo: "/images/brand-logos/stussy.png",
        categories: [
            "streetwear"
        ]
    },
    {
        name: "Skechers Logo",
        slug: "skechers-logo",
        color: "#003580",
        logo: "/images/brand-logos/skecherslogo.png",
        categories: [
            "footwear"
        ]
    },
    {
        name: "Skechers",
        slug: "skechers",
        color: "#003580",
        logo: "/images/brand-logos/skechers.png",
        categories: [
            "footwear"
        ]
    },
    {
        name: "Seiko",
        slug: "seiko",
        color: "#002C5F",
        logo: "/images/brand-logos/seiko.png",
        categories: [
            "watches"
        ]
    },
    {
        name: "Samsung",
        slug: "samsung",
        color: "#1428A0",
        logo: "/images/brand-logos/samsung.png",
        categories: [
            "electronics"
        ]
    },
    {
        name: "Rolex",
        slug: "rolex",
        color: "#006039",
        logo: "/images/brand-logos/rolex.png",
        categories: [
            "luxury",
            "watches"
        ]
    },
    {
        name: "Reebok",
        slug: "reebok",
        color: "#06080A",
        logo: "/images/brand-logos/reebok.png",
        categories: [
            "sportswear",
            "sneakers"
        ]
    },
    {
        name: "Ray-Ban",
        slug: "ray-ban",
        color: "#E31837",
        logo: "/images/brand-logos/rayban.png",
        categories: [
            "accessories"
        ]
    },
    {
        name: "Ralph Lauren",
        slug: "ralph-lauren",
        color: "#041E42",
        logo: "/images/brand-logos/ralphlauren.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Rado",
        slug: "rado",
        color: "#1A1A1A",
        logo: "/images/brand-logos/rado.png",
        categories: [
            "watches"
        ]
    },
    {
        name: "Puma",
        slug: "puma",
        color: "#000000",
        logo: "/images/brand-logos/puma.png",
        categories: [
            "sportswear",
            "sneakers"
        ]
    },
    {
        name: "Prada",
        slug: "prada",
        color: "#000000",
        logo: "/images/brand-logos/prada.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Patek Philippe",
        slug: "patek-philippe",
        color: "#544634",
        logo: "/images/brand-logos/patekphilippe.png",
        categories: [
            "luxury",
            "watches"
        ]
    },
    {
        name: "Palm Angels",
        slug: "palm-angels",
        color: "#000000",
        logo: "/images/brand-logos/palmangels.png",
        categories: [
            "streetwear"
        ]
    },
    {
        name: "Onitsuka Tiger",
        slug: "onitsuka-tiger",
        color: "#E8112D",
        logo: "/images/brand-logos/onitsukatiger.png",
        categories: [
            "sneakers",
            "sportswear"
        ]
    },
    {
        name: "Omega",
        slug: "omega",
        color: "#C41230",
        logo: "/images/brand-logos/omega.png",
        categories: [
            "luxury",
            "watches"
        ]
    },
    {
        name: "Off-White",
        slug: "off-white",
        color: "#000000",
        logo: "/images/brand-logos/offwhite.png",
        categories: [
            "streetwear",
            "luxury"
        ]
    },
    {
        name: "Oakley",
        slug: "oakley",
        color: "#222222",
        logo: "/images/brand-logos/oakley.png",
        categories: [
            "accessories",
            "sportswear"
        ]
    },
    {
        name: "Nike",
        slug: "nike",
        color: "#000000",
        logo: "/images/brand-logos/nike.png",
        categories: [
            "sportswear",
            "sneakers"
        ]
    },
    {
        name: "New Balance",
        slug: "new-balance",
        color: "#E21837",
        logo: "/images/brand-logos/newbalance.png",
        categories: [
            "sneakers"
        ]
    },
    {
        name: "Montblanc",
        slug: "montblanc",
        color: "#1A1A1B",
        logo: "/images/brand-logos/montblanc.png",
        categories: [
            "luxury",
            "accessories"
        ]
    },
    {
        name: "Marshall",
        slug: "marshall",
        color: "#1D1D1B",
        logo: "/images/brand-logos/marshall.png",
        categories: [
            "electronics"
        ]
    },
    {
        name: "Louis Vuitton",
        slug: "louis-vuitton",
        color: "#21150F",
        logo: "/images/brand-logos/louisvuitton.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Hublot",
        slug: "hublot",
        color: "#000000",
        logo: "/images/brand-logos/hublot.png",
        categories: [
            "luxury",
            "watches"
        ]
    },
    {
        name: "H&M",
        slug: "h-and-m",
        color: "#E50012",
        logo: "/images/brand-logos/hm.png",
        categories: [
            "fashion"
        ]
    },
    {
        name: "Hermès",
        slug: "hermes",
        color: "#F37021",
        logo: "/images/brand-logos/hermes.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Gucci",
        slug: "gucci",
        color: "#006747",
        logo: "/images/brand-logos/gucci.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "G-SHOCK",
        slug: "g-shock",
        color: "#E41F26",
        logo: "/images/brand-logos/gshock.png",
        categories: [
            "watches",
            "sportswear"
        ]
    },
    {
        name: "Givenchy",
        slug: "givenchy",
        color: "#000000",
        logo: "/images/brand-logos/givenchy.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Giorgio Armani",
        slug: "giorgio-armani",
        color: "#00002A",
        logo: "/images/brand-logos/giorgioarmani.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Fossil",
        slug: "fossil",
        color: "#322F2A",
        logo: "/images/brand-logos/fossil.png",
        categories: [
            "watches",
            "fashion"
        ]
    },
    {
        name: "Fila",
        slug: "fila",
        color: "#00205B",
        logo: "/images/brand-logos/fila.png",
        categories: [
            "sportswear",
            "sneakers"
        ]
    },
    {
        name: "Fendi",
        slug: "fendi",
        color: "#F9B949",
        logo: "/images/brand-logos/fendi.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Fastrack",
        slug: "fastrack",
        color: "#ED1C24",
        logo: "/images/brand-logos/fastrack.png",
        categories: [
            "watches",
            "sportswear"
        ]
    },
    {
        name: "Emporio Armani",
        slug: "emporio-armani",
        color: "#000000",
        logo: "/images/brand-logos/emporioarmani.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Dolce & Gabbana",
        slug: "dolce-gabbana",
        color: "#000000",
        logo: "/images/brand-logos/dolcegabbana.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Dior",
        slug: "dior",
        color: "#000000",
        logo: "/images/brand-logos/dior.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Diesel",
        slug: "diesel",
        color: "#C8102E",
        logo: "/images/brand-logos/diesel.png",
        categories: [
            "fashion"
        ]
    },
    {
        name: "Crocs",
        slug: "crocs",
        color: "#203463",
        logo: "/images/brand-logos/crocs.png",
        categories: [
            "footwear"
        ]
    },
    {
        name: "Converse",
        slug: "converse",
        color: "#000000",
        logo: "/images/brand-logos/converse.png",
        categories: [
            "sneakers",
            "streetwear"
        ]
    },
    {
        name: "Citizen",
        slug: "citizen",
        color: "#000000",
        logo: "/images/brand-logos/citizen.png",
        categories: [
            "watches"
        ]
    },
    {
        name: "Chanel",
        slug: "chanel",
        color: "#000000",
        logo: "/images/brand-logos/chanel.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Casio",
        slug: "casio",
        color: "#003087",
        logo: "/images/brand-logos/casio.png",
        categories: [
            "watches",
            "electronics"
        ]
    },
    {
        name: "Cartier",
        slug: "cartier",
        color: "#9E1030",
        logo: "/images/brand-logos/cartier.png",
        categories: [
            "luxury",
            "watches"
        ]
    },
    {
        name: "Calvin Klein",
        slug: "calvin-klein",
        color: "#000000",
        logo: "/images/brand-logos/calvinklein.png",
        categories: [
            "fashion"
        ]
    },
    {
        name: "Burberry",
        slug: "burberry",
        color: "#CCAB81",
        logo: "/images/brand-logos/burberry.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Bose",
        slug: "bose",
        color: "#1D1D1D",
        logo: "/images/brand-logos/bose.png",
        categories: [
            "electronics"
        ]
    },
    {
        name: "Birkenstock",
        slug: "birkenstock",
        color: "#003261",
        logo: "/images/brand-logos/birkenstock.png",
        categories: [
            "footwear"
        ]
    },
    {
        name: "Balmain Paris",
        slug: "balmain-paris",
        color: "#000000",
        logo: "/images/brand-logos/balmainparis.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Balmain",
        slug: "balmain",
        color: "#000000",
        logo: "/images/brand-logos/balmain.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Balenciaga",
        slug: "balenciaga",
        color: "#000000",
        logo: "/images/brand-logos/balenciaga.png",
        categories: [
            "luxury",
            "fashion",
            "sneakers"
        ]
    },
    {
        name: "Audemars Piguet",
        slug: "audemars-piguet",
        color: "#2B2A29",
        logo: "/images/brand-logos/audemarspiguet.png",
        categories: [
            "luxury",
            "watches"
        ]
    },
    {
        name: "Asics",
        slug: "asics",
        color: "#001E62",
        logo: "/images/brand-logos/asics.png",
        categories: [
            "sportswear",
            "sneakers"
        ]
    },
    {
        name: "Armani Exchange",
        slug: "armani-exchange",
        color: "#000000",
        logo: "/images/brand-logos/armaniexchange.png",
        categories: [
            "luxury",
            "fashion"
        ]
    },
    {
        name: "Apple",
        slug: "apple",
        color: "#555555",
        logo: "/images/brand-logos/apple.png",
        categories: [
            "electronics"
        ]
    },
    {
        name: "Amiri Logo",
        slug: "amiri-logo",
        color: "#000000",
        logo: "/images/brand-logos/amirilogo.png",
        categories: [
            "fashion"
        ]
    },
    {
        name: "Amiri",
        slug: "amiri",
        color: "#000000",
        logo: "/images/brand-logos/amiri.png",
        categories: [
            "fashion"
        ]
    },
    {
        name: "Jordan",
        slug: "jordan",
        color: "#000000",
        logo: "/images/brand-logos/airjordan.png",
        categories: [
            "sneakers",
            "streetwear"
        ]
    },
    {
        name: "Adidas",
        slug: "adidas",
        color: "#007FC5",
        logo: "/images/brand-logos/adidas.png",
        categories: [
            "sportswear",
            "sneakers"
        ]
    }
];
const __TURBOPACK__default__export__ = brandLogos;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(shop)/brands/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BrandsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_reac_10da8b23260ac50839013867445dd6d1/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/framer-motion@12.23.26_reac_10da8b23260ac50839013867445dd6d1/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$cards$2f$BrandCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/cards/BrandCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$brandLogos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/brandLogos.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
const ALL_CATEGORIES = [
    "All",
    "sneakers",
    "fashion",
    "watches",
    "accessories"
];
const SORT_OPTIONS = [
    "a-z",
    "z-a"
];
const SORT_MAP = {
    "a-z": "A - Z",
    "z-a": "Z - A"
};
function BrandsPage() {
    _s();
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("All");
    const [sortOption, setSortOption] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("a-z");
    const [activeDropdown, setActiveDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const displayedBrands = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$brandLogos$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].filter((b)=>selectedCategory === "All" || b.categories?.includes(selectedCategory)).sort((a, b)=>sortOption === "a-z" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-background text-foreground px-4 pt-20 pb-24 md:px-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "mb-10 max-w-2xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8]",
                        children: [
                            "Collection ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                fileName: "[project]/src/app/(shop)/brands/page.tsx",
                                lineNumber: 27,
                                columnNumber: 22
                            }, this),
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-muted-foreground font-outline-2",
                                children: "of Brands"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(shop)/brands/page.tsx",
                                lineNumber: 27,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(shop)/brands/page.tsx",
                        lineNumber: 26,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground text-sm mt-6 font-medium max-w-xs tracking-tight",
                        children: "CURATED PREMIUM MANUFACTURERS FROM ACROSS THE GLOBE."
                    }, void 0, false, {
                        fileName: "[project]/src/app/(shop)/brands/page.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(shop)/brands/page.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sticky top-14 z-30 mb-8 flex items-center justify-between border-y border-border bg-background backdrop-blur-xl py-3 px-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterDropdown, {
                            label: "Category",
                            activeValue: selectedCategory,
                            options: ALL_CATEGORIES,
                            isOpen: activeDropdown === "cat",
                            onToggle: ()=>setActiveDropdown(activeDropdown === "cat" ? null : "cat"),
                            onSelect: (val)=>setSelectedCategory(val),
                            onClose: ()=>setActiveDropdown(null)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(shop)/brands/page.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterDropdown, {
                            label: "Sort",
                            activeValue: sortOption,
                            options: SORT_OPTIONS,
                            displayMap: SORT_MAP,
                            isOpen: activeDropdown === "sort",
                            onToggle: ()=>setActiveDropdown(activeDropdown === "sort" ? null : "sort"),
                            onSelect: (val)=>setSortOption(val),
                            onClose: ()=>setActiveDropdown(null)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(shop)/brands/page.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(shop)/brands/page.tsx",
                    lineNumber: 38,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(shop)/brands/page.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-3 gap-y-6",
                children: displayedBrands.map((brand)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$cards$2f$BrandCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BrandCard"], {
                        brand: brand
                    }, brand.slug, false, {
                        fileName: "[project]/src/app/(shop)/brands/page.tsx",
                        lineNumber: 64,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/(shop)/brands/page.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(shop)/brands/page.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_s(BrandsPage, "EeI0Vxfo/I+k3xVvMjE/v8mC9W0=");
_c = BrandsPage;
function FilterDropdown({ label, activeValue, options, isOpen, onToggle, onSelect, onClose, displayMap }) {
    _s1();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FilterDropdown.useEffect": ()=>{
            const clickOut = {
                "FilterDropdown.useEffect.clickOut": (e)=>{
                    if (isOpen && containerRef.current && !containerRef.current.contains(e.target)) onClose();
                }
            }["FilterDropdown.useEffect.clickOut"];
            document.addEventListener("mousedown", clickOut);
            return ({
                "FilterDropdown.useEffect": ()=>document.removeEventListener("mousedown", clickOut)
            })["FilterDropdown.useEffect"];
        }
    }["FilterDropdown.useEffect"], [
        isOpen,
        onClose
    ]);
    const displayLabel = displayMap ? displayMap[activeValue] || activeValue : activeValue;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        ref: containerRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onToggle,
                className: `flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all duration-300 text-[11px] font-black uppercase tracking-tight ${isOpen ? "bg-foreground text-background border-foreground" : "bg-background border-border text-foreground hover:border-foreground/50"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "opacity-40 font-bold",
                        children: [
                            label,
                            ":"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(shop)/brands/page.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this),
                    displayLabel,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
                        animate: {
                            rotate: isOpen ? 180 : 0
                        },
                        transition: {
                            duration: 0.2
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                            size: 14
                        }, void 0, false, {
                            fileName: "[project]/src/app/(shop)/brands/page.tsx",
                            lineNumber: 108,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(shop)/brands/page.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(shop)/brands/page.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$framer$2d$motion$40$12$2e$23$2e$26_reac_10da8b23260ac50839013867445dd6d1$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 10,
                        scale: 0.95
                    },
                    animate: {
                        opacity: 1,
                        y: 5,
                        scale: 1
                    },
                    exit: {
                        opacity: 0,
                        y: 8,
                        scale: 0.95
                    },
                    className: "absolute right-0 mt-4 w-48 bg-foreground border border-border rounded-2xl overflow-hidden shadow-2xl z-50 p-1.5 backdrop-blur-3xl",
                    children: options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                onSelect(opt);
                                onToggle();
                            },
                            className: `w-full text-left px-4 py-3 text-[11px] font-bold uppercase transition-all rounded-xl mb-0.5 last:mb-0 ${activeValue === opt ? "bg-background text-foreground" : "hover:bg-background text-background hover:text-foreground"}`,
                            children: displayMap ? displayMap[opt] || opt : opt
                        }, opt, false, {
                            fileName: "[project]/src/app/(shop)/brands/page.tsx",
                            lineNumber: 121,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/(shop)/brands/page.tsx",
                    lineNumber: 114,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(shop)/brands/page.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(shop)/brands/page.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
_s1(FilterDropdown, "8puyVO4ts1RhCfXUmci3vLI3Njw=");
_c1 = FilterDropdown;
var _c, _c1;
__turbopack_context__.k.register(_c, "BrandsPage");
__turbopack_context__.k.register(_c1, "FilterDropdown");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/shared/src/utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "hasA11yProp",
    ()=>hasA11yProp,
    "mergeClasses",
    ()=>mergeClasses,
    "toCamelCase",
    ()=>toCamelCase,
    "toKebabCase",
    ()=>toKebabCase,
    "toPascalCase",
    ()=>toPascalCase
]);
const toKebabCase = (string)=>string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string)=>string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2)=>p2 ? p2.toUpperCase() : p1.toLowerCase());
const toPascalCase = (string)=>{
    const camelCase = toCamelCase(string);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
const mergeClasses = (...classes)=>classes.filter((className, index, array)=>{
        return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
    }).join(" ").trim();
const hasA11yProp = (props)=>{
    for(const prop in props){
        if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
            return true;
        }
    }
};
;
 //# sourceMappingURL=utils.js.map
}),
"[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/defaultAttributes.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>defaultAttributes
]);
var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
};
;
 //# sourceMappingURL=defaultAttributes.js.map
}),
"[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/Icon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>Icon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/defaultAttributes.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/shared/src/utils.js [app-client] (ecmascript)");
;
;
;
const Icon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])("svg", {
        ref,
        ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])("lucide", className),
        ...!children && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasA11yProp"])(rest) && {
            "aria-hidden": "true"
        },
        ...rest
    }, [
        ...iconNode.map(([tag, attrs])=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(tag, attrs)),
        ...Array.isArray(children) ? children : [
            children
        ]
    ]));
;
 //# sourceMappingURL=Icon.js.map
}),
"[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "default",
    ()=>createLucideIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/shared/src/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/Icon.js [app-client] (ecmascript)");
;
;
;
const createLucideIcon = (iconName, iconNode)=>{
    const Component = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            ref,
            iconNode,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])(`lucide-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toKebabCase"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toPascalCase"])(iconName))}`, `lucide-${iconName}`, className),
            ...props
        }));
    Component.displayName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toPascalCase"])(iconName);
    return Component;
};
;
 //# sourceMappingURL=createLucideIcon.js.map
}),
"[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ChevronDown
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m6 9 6 6 6-6",
            key: "qrunsl"
        }
    ]
];
const ChevronDown = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("chevron-down", __iconNode);
;
 //# sourceMappingURL=chevron-down.js.map
}),
"[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChevronDown",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$562$2e$0_react$40$19$2e$2$2e$1$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.562.0_react@19.2.1/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_c6873b24._.js.map