module.exports = [
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/loading.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/loading.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/(account)/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/(account)/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/app/(account)/account/notifications/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {

const { jsxDEV: _jsxDEV } = __turbopack_context__.r("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
NotificationList;
function NotificationList({ type }) {
    const notifications = useMemo(()=>{
        if (type === 'all') return MOCK_NOTIFICATIONS;
        return MOCK_NOTIFICATIONS.filter((n)=>type === 'orders' ? n.type === 'order' : n.type === 'promo');
    }, [
        type
    ]);
    if (notifications.length === 0) {
        return /*#__PURE__*/ _jsxDEV("div", {
            className: "py-24 text-center text-foreground/40",
            children: [
                /*#__PURE__*/ _jsxDEV(Bell, {
                    className: "mx-auto mb-4 opacity-10",
                    size: 48
                }, void 0, false, {
                    fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV("p", {
                    className: "text-sm",
                    children: [
                        "No ",
                        type,
                        " notifications yet"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                    lineNumber: 15,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
            lineNumber: 13,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ _jsxDEV("div", {
        className: "divide-y divide-foreground/10",
        children: notifications.map((n)=>/*#__PURE__*/ _jsxDEV("div", {
                className: "flex gap-4 p-5 hover:bg-foreground transition-colors",
                children: [
                    /*#__PURE__*/ _jsxDEV("div", {
                        className: "shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-foreground text-background",
                        children: n.type === 'order' ? /*#__PURE__*/ _jsxDEV(ShoppingBag, {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                            lineNumber: 25,
                            columnNumber: 35
                        }, this) : /*#__PURE__*/ _jsxDEV(Tag, {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                            lineNumber: 25,
                            columnNumber: 63
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                        lineNumber: 24,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ _jsxDEV("div", {
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ _jsxDEV("div", {
                                className: "flex justify-between items-start",
                                children: [
                                    /*#__PURE__*/ _jsxDEV("h3", {
                                        className: "text-[14px] font-semibold tracking-tight",
                                        children: n.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                                        lineNumber: 29,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ _jsxDEV("span", {
                                        className: "text-[10px] font-medium text-foreground/40 uppercase",
                                        children: n.timestamp
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                                        lineNumber: 30,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                                lineNumber: 28,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ _jsxDEV("p", {
                                className: "text-[13px] text-foreground/60 mt-1 leading-relaxed",
                                children: n.message
                            }, void 0, false, {
                                fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                                lineNumber: 32,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                        lineNumber: 27,
                        columnNumber: 11
                    }, this)
                ]
            }, n.id, true, {
                fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                lineNumber: 23,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        type: 'order',
        title: 'Order Shipped',
        message: 'Your order #FF-2025 has been shipped. Track your shipment now.',
        timestamp: '2 mins ago'
    },
    {
        id: '2',
        type: 'promo',
        title: 'Flash Sale Alert',
        message: 'The Monochrome Collection is now 40% off. Limited time only.',
        timestamp: '1 hour ago'
    },
    {
        id: '3',
        type: 'order',
        title: 'Order Delivered',
        message: 'Order #FF-2023 has been delivered at your doorstep.',
        timestamp: '2 days ago'
    },
    {
        id: '4',
        type: 'promo',
        title: 'Exclusive Access',
        message: 'Early access to our anniversary sale is now open.',
        timestamp: '3 days ago'
    },
    {
        id: '5',
        type: 'order',
        title: 'Order Confirmed',
        message: 'We’ve received your order #FF-2031.',
        timestamp: '5 days ago'
    },
    {
        id: '6',
        type: 'promo',
        title: 'Free Shipping',
        message: 'Enjoy free shipping on all orders this weekend.',
        timestamp: '1 week ago'
    },
    {
        id: '7',
        type: 'order',
        title: 'Refund Processed',
        message: 'Refund for #FF-1980 is complete.',
        timestamp: '2 weeks ago'
    }
];
}),
"[project]/src/app/(account)/account/notifications/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/(account)/account/notifications/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ee107e8d._.js.map