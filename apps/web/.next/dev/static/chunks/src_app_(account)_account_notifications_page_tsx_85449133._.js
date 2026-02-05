(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/(account)/account/notifications/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { ShoppingBag, Tag, Bell } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@/lib/utils";
const TABS = [
    "all",
    "orders",
    "promotions"
];
export default function NotificationsPage() {
    _s();
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const x = useMotionValue(0);
    // 1. Handle Responsive Width
    useEffect({
        "NotificationsPage.useEffect": ()=>{
            const updateWidth = {
                "NotificationsPage.useEffect.updateWidth": ()=>{
                    if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
                }
            }["NotificationsPage.useEffect.updateWidth"];
            updateWidth();
            window.addEventListener("resize", updateWidth);
            return ({
                "NotificationsPage.useEffect": ()=>window.removeEventListener("resize", updateWidth)
            })["NotificationsPage.useEffect"];
        }
    }["NotificationsPage.useEffect"], []);
    // 2. Tab Indicator Animation
    const indicatorX = useTransform(x, [
        0,
        -containerWidth * (TABS.length - 1)
    ], [
        "0%",
        `${(TABS.length - 1) * 100}%`
    ]);
    const handleTabClick = (index)=>{
        setActiveIndex(index);
        animate(x, -index * containerWidth, {
            type: "spring",
            bounce: 0,
            duration: 0.4
        });
    };
    const handleDragEnd = (_, info)=>{
        const swipeThreshold = 50;
        const velocityThreshold = 500;
        if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
            if (activeIndex < TABS.length - 1) {
                handleTabClick(activeIndex + 1);
                return;
            }
        }
        if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
            if (activeIndex > 0) {
                handleTabClick(activeIndex - 1);
                return;
            }
        }
        handleTabClick(activeIndex);
    };
    return /*#__PURE__*/ _jsxDEV("div", {
        className: "h-full flex flex-col bg-background text-foreground overflow-x-hidden md:pt-20",
        children: [
            /*#__PURE__*/ _jsxDEV("header", {
                className: "sticky top-0 z-20 border-b border-foreground/10 bg-background/80 backdrop-blur-md",
                children: /*#__PURE__*/ _jsxDEV("div", {
                    className: "mx-auto px-4 relative",
                    children: [
                        /*#__PURE__*/ _jsxDEV("nav", {
                            className: "flex w-full",
                            children: TABS.map((tab, i)=>/*#__PURE__*/ _jsxDEV("button", {
                                    onClick: ()=>handleTabClick(i),
                                    className: cn("flex-1 py-4 text-sm font-medium capitalize transition-colors outline-none", activeIndex === i ? "text-foreground" : "text-foreground/40"),
                                    children: tab
                                }, tab, false, {
                                    fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                                    lineNumber: 73,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ _jsxDEV(motion.div, {
                            style: {
                                x: indicatorX,
                                width: `${100 / TABS.length}%`
                            },
                            className: "absolute bottom-0 left-0 px-4",
                            children: /*#__PURE__*/ _jsxDEV("div", {
                                className: "h-0.5 bg-foreground w-full rounded-full"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                            lineNumber: 85,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                    lineNumber: 70,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                lineNumber: 69,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV("main", {
                className: "max-h-[80vh] max-w-screen flex-1 mx-auto w-full relative overflow-y-scroll overflow-x-hidden pb-10 bg-",
                ref: containerRef,
                children: /*#__PURE__*/ _jsxDEV(motion.div, {
                    drag: "x",
                    dragConstraints: {
                        left: -containerWidth * (TABS.length - 1),
                        right: 0
                    },
                    style: {
                        x
                    },
                    onDragEnd: handleDragEnd,
                    className: "h-full flex items-start touch-pan-y cursor-grab active:cursor-grabbing",
                    children: TABS.map((tabType, i)=>/*#__PURE__*/ _jsxDEV(TabSection, {
                            type: tabType,
                            isActive: activeIndex === i
                        }, tabType, false, {
                            fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                            lineNumber: 109,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                lineNumber: 94,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}
_s(NotificationsPage, "As4d2kUluR4TJ+noKIzximvjwos=", false, function() {
    return [
        useMotionValue,
        useTransform
    ];
});
_c = NotificationsPage;
function TabSection({ type, isActive }) {
    return /*#__PURE__*/ _jsxDEV("section", {
        className: "w-full shrink-0 h-full bg-amber-600",
        children: /*#__PURE__*/ _jsxDEV(motion.div, {
            animate: {
                opacity: isActive ? 1 : 0.4
            },
            transition: {
                type: "spring",
                bounce: 0,
                duration: 0.4
            },
            className: "h-full",
            children: /*#__PURE__*/ _jsxDEV(NotificationList, {
                type: type
            }, void 0, false, {
                fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                lineNumber: 137,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
            lineNumber: 130,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
        lineNumber: 129,
        columnNumber: 5
    }, this);
}
_c1 = TabSection;
function NotificationList({ type }) {
    _s1();
    const notifications = useMemo({
        "NotificationList.useMemo[notifications]": ()=>{
            if (type === "all") return MOCK_NOTIFICATIONS;
            return MOCK_NOTIFICATIONS.filter({
                "NotificationList.useMemo[notifications]": (n)=>type === "orders" ? n.type === "order" : n.type === "promo"
            }["NotificationList.useMemo[notifications]"]);
        }
    }["NotificationList.useMemo[notifications]"], [
        type
    ]);
    if (notifications.length === 0) {
        return /*#__PURE__*/ _jsxDEV("div", {
            className: "h-full py-24 text-center text-foreground/40",
            children: [
                /*#__PURE__*/ _jsxDEV(Bell, {
                    className: "mx-auto mb-4 opacity-10",
                    size: 48
                }, void 0, false, {
                    fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                    lineNumber: 154,
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
                    lineNumber: 155,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
            lineNumber: 153,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ _jsxDEV("div", {
        className: "divide-y divide-foreground/10 h-full",
        children: notifications.map((n)=>/*#__PURE__*/ _jsxDEV("div", {
                className: "flex gap-4 p-5 hover:bg-foreground/5 transition-colors",
                children: [
                    /*#__PURE__*/ _jsxDEV("div", {
                        className: "shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-foreground text-background",
                        children: n.type === "order" ? /*#__PURE__*/ _jsxDEV(ShoppingBag, {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                            lineNumber: 168,
                            columnNumber: 35
                        }, this) : /*#__PURE__*/ _jsxDEV(Tag, {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                            lineNumber: 168,
                            columnNumber: 63
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                        lineNumber: 167,
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
                                        lineNumber: 172,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ _jsxDEV("span", {
                                        className: "text-[10px] font-medium text-foreground/40 uppercase",
                                        children: n.timestamp
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                                        lineNumber: 175,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                                lineNumber: 171,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ _jsxDEV("p", {
                                className: "text-[13px] text-foreground/60 mt-1 leading-relaxed",
                                children: n.message
                            }, void 0, false, {
                                fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                                lineNumber: 179,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                        lineNumber: 170,
                        columnNumber: 11
                    }, this)
                ]
            }, n.id, true, {
                fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
                lineNumber: 163,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/app/(account)/account/notifications/page.tsx",
        lineNumber: 161,
        columnNumber: 5
    }, this);
}
_s1(NotificationList, "Cb6yS8LrmRWbfcJNVVKsdXalpn8=");
_c2 = NotificationList;
const MOCK_NOTIFICATIONS = [
    {
        id: "1",
        type: "order",
        title: "Order Shipped",
        message: "Your order #FF-2025 has been shipped. Track your shipment now.",
        timestamp: "2 mins ago"
    },
    {
        id: "2",
        type: "promo",
        title: "Flash Sale Alert",
        message: "The Monochrome Collection is now 40% off. Limited time only.",
        timestamp: "1 hour ago"
    },
    {
        id: "3",
        type: "order",
        title: "Order Delivered",
        message: "Order #FF-2023 has been delivered at your doorstep.",
        timestamp: "2 days ago"
    },
    {
        id: "4",
        type: "promo",
        title: "Exclusive Access",
        message: "Early access to our anniversary sale is now open.",
        timestamp: "3 days ago"
    },
    {
        id: "5",
        type: "order",
        title: "Order Confirmed",
        message: "We’ve received your order #FF-2031.",
        timestamp: "5 days ago"
    },
    {
        id: "6",
        type: "promo",
        title: "Free Shipping",
        message: "Enjoy free shipping on all orders this weekend.",
        timestamp: "1 week ago"
    },
    {
        id: "7",
        type: "order",
        title: "Refund Processed",
        message: "Refund for #FF-1980 is complete.",
        timestamp: "2 weeks ago"
    },
    {
        id: "8",
        type: "order",
        title: "Order Delivered",
        message: "Order #FF-2023 has been delivered at your doorstep.",
        timestamp: "2 days ago"
    },
    {
        id: "9",
        type: "promo",
        title: "Exclusive Access",
        message: "Early access to our anniversary sale is now open.",
        timestamp: "3 days ago"
    },
    {
        id: "10",
        type: "order",
        title: "Order Confirmed",
        message: "We’ve received your order #FF-2031.",
        timestamp: "5 days ago"
    },
    {
        id: "11",
        type: "promo",
        title: "Free Shipping",
        message: "Enjoy free shipping on all orders this weekend.",
        timestamp: "1 week ago"
    },
    {
        id: "12",
        type: "order",
        title: "Refund Processed",
        message: "Refund for #FF-1980 is complete.",
        timestamp: "2 weeks ago"
    }
];
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "NotificationsPage");
__turbopack_context__.k.register(_c1, "TabSection");
__turbopack_context__.k.register(_c2, "NotificationList");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_%28account%29_account_notifications_page_tsx_85449133._.js.map