import { o as __toESM } from "../_runtime.mjs";
import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { A as Banknote, C as DoorOpen, D as ChartColumn, O as Building2, b as FilePenLine, c as Settings, d as Plus, f as PanelLeftOpen, g as LogOut, k as Bell, l as Search, m as MessagesSquare, n as Wrench, p as PanelLeftClose, r as Users, u as Receipt, v as LayoutDashboard, y as FolderClosed } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Bits-IW5hBAFw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var nav = [
	{
		to: "/",
		label: "Dashboard",
		icon: LayoutDashboard,
		group: "Overview"
	},
	{
		to: "/properties",
		label: "Properties",
		icon: Building2,
		group: "Portfolio"
	},
	{
		to: "/units",
		label: "Units",
		icon: DoorOpen,
		group: "Portfolio"
	},
	{
		to: "/tenants",
		label: "Tenants",
		icon: Users,
		group: "Portfolio"
	},
	{
		to: "/leases",
		label: "Leases",
		icon: FilePenLine,
		group: "Portfolio"
	},
	{
		to: "/payments",
		label: "Rent & Payments",
		icon: Banknote,
		group: "Money"
	},
	{
		to: "/expenses",
		label: "Expenses",
		icon: Receipt,
		group: "Money"
	},
	{
		to: "/reports",
		label: "Reports",
		icon: ChartColumn,
		group: "Money"
	},
	{
		to: "/maintenance",
		label: "Maintenance",
		icon: Wrench,
		group: "Operations"
	},
	{
		to: "/messages",
		label: "Messages",
		icon: MessagesSquare,
		group: "Operations"
	},
	{
		to: "/documents",
		label: "Documents",
		icon: FolderClosed,
		group: "Operations"
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings,
		group: "Operations"
	}
];
var groups = [
	"Overview",
	"Portfolio",
	"Money",
	"Operations"
];
function AppShell({ children }) {
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	const path = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 [transition-timing-function:cubic-bezier(0.22,0.8,0.3,1)] lg:flex",
			style: { width: collapsed ? 72 : 264 },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/favicon.png",
						alt: "My Nyumba",
						className: "size-8 shrink-0 rounded-xs object-cover shadow-sm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("font-display text-[17px] font-semibold tracking-tight text-sidebar-accent-foreground transition-opacity duration-150", collapsed && "pointer-events-none opacity-0"),
						children: "My\xA0Nyumba"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 overflow-y-auto px-2.5 py-4",
					children: groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("px-2 pb-1.5 text-[10px] font-semibold tracking-[0.14em] text-sidebar-foreground/45 uppercase transition-opacity duration-150", collapsed && "opacity-0"),
							children: g
						}), nav.filter((n) => n.group === g).map((n) => {
							const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
							const Icon = n.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: n.to,
								title: collapsed ? n.label : void 0,
								className: cn("mb-0.5 flex items-center gap-3 rounded-xs px-2 py-2 text-[13px] font-medium transition-colors duration-150", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "relative flex size-5 shrink-0 items-center justify-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										size: 17,
										strokeWidth: active ? 2.1 : 1.7
									}), active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-2 h-5 w-[2px] bg-sidebar-primary" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("truncate transition-opacity duration-150", collapsed && "pointer-events-none opacity-0"),
									children: n.label
								})]
							}, n.to);
						})]
					}, g))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-sidebar-border p-2 space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/login",
						title: collapsed ? "Sign out" : void 0,
						className: "flex items-center gap-3 rounded-xs px-2 py-2 text-[13px] font-medium text-sidebar-foreground/70 transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 17 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("truncate transition-opacity duration-150", collapsed && "pointer-events-none opacity-0"),
							children: "Sign out"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setCollapsed((c) => !c),
						className: "flex w-full h-10 items-center gap-3 rounded-xs px-2 text-[13px] text-sidebar-foreground/60 transition-colors duration-150 hover:text-sidebar-accent-foreground",
						children: [collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { size: 17 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { size: 17 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("transition-opacity duration-150", collapsed && "opacity-0"),
							children: "Collapse"
						})]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "transition-[padding] duration-200",
			style: { paddingLeft: 0 },
			"data-shell": true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:pl-[var(--pl)]",
				style: { ["--pl"]: `${collapsed ? 72 : 264}px` },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/85 px-4 backdrop-blur-sm sm:px-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 lg:hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/favicon.png",
									alt: "My Nyumba",
									className: "size-7 shrink-0 rounded-xs object-cover shadow-sm"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-[15px] font-semibold",
									children: "My Nyumba"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "hidden max-w-md flex-1 items-center gap-2 rounded-xs border border-border bg-card px-3 py-2 transition-colors duration-150 focus-within:border-primary md:flex",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
										size: 15,
										className: "text-muted-foreground"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										placeholder: "Search tenants, units, M-Pesa refs…",
										className: "w-full bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
										className: "t-num rounded-[2px] border border-border px-1.5 text-[10px] text-muted-foreground",
										children: "/"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "hidden items-center gap-1.5 rounded-xs bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity duration-150 hover:opacity-90 sm:flex",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 15 }), " Record payment"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "relative rounded-xs border border-border bg-card p-2 transition-colors duration-150 hover:border-border-strong",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1 right-1 size-1.5 rounded-full bg-ochre" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 border-l border-border pl-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex size-8 items-center justify-center rounded-full bg-accent font-display text-[13px] font-semibold text-primary",
												children: "WK"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "hidden leading-tight sm:block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[13px] font-semibold",
													children: "Wanjiru Kimani"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-muted-foreground",
													children: "Portfolio manager"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/login",
												title: "Sign out",
												className: "ml-1 flex size-8 items-center justify-center rounded-xs border border-border bg-card text-muted-foreground transition-colors hover:border-danger-soft hover:bg-danger-soft hover:text-danger",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 15 })
											})
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2 lg:hidden",
						children: nav.map((n) => {
							const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: n.to,
								className: cn("rounded-xs px-2.5 py-1.5 text-xs font-medium whitespace-nowrap", active ? "bg-primary text-primary-foreground" : "text-muted-foreground"),
								children: n.label
							}, n.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "mx-auto max-w-[1360px] px-4 py-6 sm:px-6 lg:py-8",
						children
					})
				]
			})
		})]
	});
}
function CountUp({ value, format = (n) => n.toLocaleString("en-KE"), className }) {
	const [display, setDisplay] = (0, import_react.useState)(value);
	const from = (0, import_react.useRef)(value);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setDisplay(value);
			from.current = value;
			return;
		}
		const start = performance.now();
		const a = from.current;
		const b = value;
		let raf = 0;
		const tick = (t) => {
			const p = Math.min((t - start) / 500, 1);
			const eased = 1 - Math.pow(1 - p, 3);
			setDisplay(a + (b - a) * eased);
			if (p < 1) raf = requestAnimationFrame(tick);
			else from.current = b;
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("t-num", className),
		children: format(Math.round(display))
	});
}
var tone = {
	paid: "bg-success-soft text-success border-success/25",
	partial: "bg-ochre-soft text-warning border-warning/25",
	overdue: "bg-danger-soft text-danger border-danger/25",
	due: "bg-info-soft text-info border-info/25",
	neutral: "bg-muted text-muted-foreground border-border-strong/50"
};
function Badge({ children, variant = "neutral" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-xs border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase", tone[variant]),
		children
	});
}
var statusVariant = (s) => {
	const k = s.toLowerCase();
	if ([
		"paid",
		"occupied",
		"active",
		"resolved",
		"paid up"
	].includes(k)) return "paid";
	if ([
		"partial",
		"notice",
		"expiring",
		"pending",
		"in progress",
		"assigned"
	].includes(k)) return "partial";
	if ([
		"overdue",
		"urgent",
		"vacant",
		"ended",
		"under repair"
	].includes(k)) return "overdue";
	if ([
		"due",
		"open",
		"low",
		"normal"
	].includes(k)) return "due";
	return "neutral";
};
function PageHeader({ eyebrow, title, subtitle, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "t-caption",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "t-display-lg mt-1.5",
				children: title
			}),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "t-body mt-1 max-w-xl text-muted-foreground",
				children: subtitle
			})
		] }), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-2",
			children: actions
		})]
	});
}
function Panel({ title, meta, children, className, delay = 0 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("panel stagger-in overflow-hidden", className),
		style: { animationDelay: `${delay}ms` },
		children: [(title || meta) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border px-4 py-3",
			children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "t-heading",
				children: title
			}), meta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: meta
			})]
		}), children]
	});
}
function Metric({ label, value, note, delay = 0, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel stagger-in relative px-4 py-3.5",
		style: { animationDelay: `${delay}ms` },
		children: [
			accent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute top-0 left-0 h-full w-[3px]", accent === "ochre" && "bg-ochre", accent === "danger" && "bg-danger", accent === "success" && "bg-success") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "t-caption",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "t-display-md mt-2",
				children: value
			}),
			note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: note
			})
		]
	});
}
function Table({ head, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full border-collapse text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "border-b border-border bg-muted/40",
				children: head.map((h, i) => {
					const label = typeof h === "string" ? h : h.label;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: cn("t-caption px-4 py-2.5 text-left font-semibold whitespace-nowrap", typeof h !== "string" && h.align === "right" && "text-right"),
						children: label
					}, i);
				})
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
				className: "divide-y divide-border",
				children
			})]
		})
	});
}
function Td({ children, num, right, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: cn("px-4 py-3 align-middle whitespace-nowrap", num && "t-num", right && "text-right", className),
		children
	});
}
//#endregion
export { PageHeader as a, Td as c, Metric as i, statusVariant as l, Badge as n, Panel as o, CountUp as r, Table as s, AppShell as t };
