(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/ServiceWorkerRegister.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ServiceWorkerRegister
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_@babel+core@7._c57d9b56c0bd86dac4690a5de51b3a27/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function ServiceWorkerRegister() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_$40$babel$2b$core$40$7$2e$_c57d9b56c0bd86dac4690a5de51b3a27$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ServiceWorkerRegister.useEffect": ()=>{
            if (!("serviceWorker" in navigator)) return;
            navigator.serviceWorker.register("/sw.js").then({
                "ServiceWorkerRegister.useEffect": (registration)=>{
                    // Listen for updates
                    registration.onupdatefound = ({
                        "ServiceWorkerRegister.useEffect": ()=>{
                            const installingWorker = registration.installing;
                            if (!installingWorker) return;
                            installingWorker.onstatechange = ({
                                "ServiceWorkerRegister.useEffect": ()=>{
                                    if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                                        // New content available
                                        console.log("New version available. Refresh to update.");
                                    }
                                }
                            })["ServiceWorkerRegister.useEffect"];
                        }
                    })["ServiceWorkerRegister.useEffect"];
                }
            }["ServiceWorkerRegister.useEffect"]).catch({
                "ServiceWorkerRegister.useEffect": (error)=>{
                    console.error("Service Worker registration failed:", error);
                }
            }["ServiceWorkerRegister.useEffect"]);
        }
    }["ServiceWorkerRegister.useEffect"], []);
    return null;
}
_s(ServiceWorkerRegister, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = ServiceWorkerRegister;
var _c;
__turbopack_context__.k.register(_c, "ServiceWorkerRegister");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_ServiceWorkerRegister_tsx_48e55416._.js.map