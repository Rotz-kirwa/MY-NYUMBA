import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { j as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { c as Td, i as Metric, l as statusVariant, n as Badge, o as Panel, r as CountUp, s as Table, t as AppShell } from "./Bits-IW5hBAFw.mjs";
import { a as rentSegments, i as portfolio, n as collectionByDay, r as monthlySeries, t as KSh } from "./mynyumba-BQUr4Ve-.mjs";
import { t as Route } from "./routes-BmFbyKYh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-f4wVK9wc.js
var import_jsx_runtime = require_jsx_runtime();
/**
* SIGNATURE ELEMENT — "The Rent Ribbon".
* A single month-long ledger band: money in vs money owed, segment by segment,
* with a daily collection comb underneath. Draws in once on mount (720ms),
* everything else in the product stays quiet.
*/
function RentRibbon() {
	const segs = rentSegments();
	const total = segs.reduce((s, x) => s + x.value, 0);
	const outstanding = total - (segs[0]?.value ?? 0);
	const peak = Math.max(...collectionByDay);
	const today = 16;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel stagger-in overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-6 border-b border-border px-5 pt-5 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "t-caption",
						children: "Rent ribbon · August 2026 · 130 units"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "t-display-xl mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, {
							value: segs[0]?.value ?? 0,
							format: (n) => KSh(n)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "t-body mt-1 text-muted-foreground",
						children: [
							"in from a billed roll of",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "t-num text-foreground",
								children: KSh(total)
							})
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "t-caption",
							children: "Still owed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "t-display-md t-num mt-2 text-danger",
							children: KSh(outstanding)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "across 14 units · 3 on payment plan"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 pt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-11 w-full overflow-hidden rounded-xs border border-border-strong/60",
					children: segs.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ribbon-draw relative h-full",
						style: {
							width: `${s.value / total * 100}%`,
							background: s.color,
							animationDelay: `${i * 90}ms`,
							opacity: s.key === "notdue" ? .35 : 1
						},
						title: `${s.label} · ${KSh(s.value)}`
					}, s.key))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-x-7 gap-y-2",
					children: segs.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 inline-block h-2.5 w-2.5 rounded-[1px]",
								style: {
									background: s.color,
									opacity: s.key === "notdue" ? .45 : 1
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium",
								children: s.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "t-num text-xs text-muted-foreground",
								children: [
									KSh(s.value, { compact: true }),
									" · ",
									Math.round(s.value / total * 100),
									"%"
								]
							})
						]
					}, s.key))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 border-t border-border px-5 pt-4 pb-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "t-caption mb-2.5",
						children: "Daily inflow · 1–31 Aug"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-16 items-end gap-[3px]",
						children: collectionByDay.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "group flex h-full flex-1 flex-col justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bar-draw origin-bottom rounded-[1px]",
								style: {
									height: `${Math.max(v / peak * 100, 4)}%`,
									background: i === today ? "var(--ochre)" : i <= today ? "var(--primary)" : "var(--border-strong)",
									opacity: i > today ? .4 : 1,
									animationDelay: `${300 + i * 14}ms`
								},
								title: `Day ${i + 1} · ${v}% of the roll`
							})
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex justify-between text-[11px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1 Aug" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-ochre",
								children: "Today · 17 Aug"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "31 Aug" })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 divide-x divide-border border-t border-border sm:grid-cols-4",
				children: [
					["Collection rate", `${Math.round((segs[0]?.value ?? 0) / total * 100)}%`],
					["Occupancy", `${Math.round(portfolio.occupied / portfolio.units * 100)}%`],
					["Avg. days to pay", "4.2"],
					["M-Pesa share", "78%"]
				].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "t-caption",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "t-num mt-1 text-lg font-medium",
						children: v
					})]
				}, k))
			})
		]
	});
}
function Dashboard() {
	const data = Route.useLoaderData();
	const max = Math.max(...monthlySeries.map((m) => m.billed));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "t-caption",
					children: "Monday, 17 August 2026 · Nairobi"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "t-display-lg mt-1.5",
					children: "Habari, Wanjiru"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "t-body mt-1 text-muted-foreground",
					children: [
						data.props.length,
						" properties, ",
						data.totalUnits,
						" units. Two payment promises fall due today."
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/payments",
					className: "rounded-xs border border-border-strong bg-card px-3 py-2 text-[13px] font-semibold transition-colors duration-150 hover:bg-muted",
					children: "Send rent reminders"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/payments",
					className: "rounded-xs bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-opacity duration-150 hover:opacity-90",
					children: "Reconcile M-Pesa"
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RentRibbon, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Arrears carried",
					value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, {
						value: data.finSummary.arrearsCarried,
						format: (n) => KSh(n)
					}),
					note: `${data.arrears.length} units · oldest 63 days`,
					accent: "danger",
					delay: 60
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Vacant units",
					value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, { value: data.vacantUnits }),
					note: "Est. KSh 486,000 monthly loss",
					accent: "ochre",
					delay: 140
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Net operating income",
					value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, {
						value: 6128400,
						format: (n) => KSh(n)
					}),
					note: "After KSh 396,800 expenses",
					accent: "success",
					delay: 220
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
					label: "Open maintenance",
					value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountUp, { value: data.tickets.filter((t) => t.status !== "Resolved").length }),
					note: "1 urgent · Ruaka borehole",
					delay: 300
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Arrears watchlist",
				meta: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/payments",
					className: "hover:text-foreground",
					children: "All payments →"
				}),
				delay: 80,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
					head: [
						"Tenant ID",
						"Unit",
						"Expected",
						{
							label: "Paid",
							align: "right"
						},
						"Status",
						""
					],
					children: data.arrears.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "transition-colors duration-150 hover:bg-muted/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: c.tenantId
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted-foreground",
								children: c.propertyId
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								num: true,
								children: c.unitId
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								num: true,
								children: KSh(c.totalAmount)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								num: true,
								right: true,
								children: KSh(c.amountPaid)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: statusVariant(c.status),
								children: c.status
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								right: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "row-actions text-xs font-semibold text-primary",
									children: "Follow up"
								})
							})
						]
					}, c.id))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "Billed vs collected",
				meta: "KSh millions",
				delay: 160,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-56 items-end gap-3 px-5 pt-6",
					children: monthlySeries.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 flex-col items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex h-full w-full items-end justify-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bar-draw w-1/2 origin-bottom rounded-t-[1px] bg-border-strong/60",
								style: {
									height: `${m.billed / max * 100}%`,
									animationDelay: `${i * 50}ms`
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bar-draw w-1/2 origin-bottom rounded-t-[1px] bg-primary",
								style: {
									height: `${m.collected / max * 100}%`,
									animationDelay: `${i * 50 + 80}ms`
								}
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground",
							children: m.m
						})]
					}, m.m))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-4 border-t border-border px-5 py-3 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "inline-block size-2.5 rounded-[1px] bg-primary" }), " Collected"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: "inline-block size-2.5 rounded-[1px] bg-border-strong/60" }), " Billed"]
					})]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 xl:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Property performance",
				meta: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/properties",
					className: "hover:text-foreground",
					children: "View all →"
				}),
				delay: 200,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border",
					children: data.props.slice(0, 5).map((p) => {
						const pct = Math.round(p.occupiedUnits / p.totalUnits * 100);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/properties/$propertyId",
							params: { propertyId: p.id },
							className: "flex items-center gap-4 px-4 py-3 transition-colors duration-150 hover:bg-muted/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-[13px] font-medium",
										children: p.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											p.area,
											" · ",
											p.occupiedUnits,
											"/",
											p.totalUnits,
											" occupied"
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "hidden h-1.5 w-32 overflow-hidden rounded-xs bg-muted sm:block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "ribbon-draw h-full",
										style: {
											width: `${pct}%`,
											background: pct > 90 ? "var(--success)" : pct > 70 ? "var(--ochre)" : "var(--danger)"
										}
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "t-num w-12 text-right text-sm",
									children: [pct, "%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
									size: 14,
									className: "text-muted-foreground"
								})
							]
						}, p.id);
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Operations today",
				meta: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/maintenance",
					className: "hover:text-foreground",
					children: "Maintenance →"
				}),
				delay: 240,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border",
					children: data.tickets.slice(0, 4).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "t-num mt-0.5 text-[11px] text-muted-foreground",
								children: t.referenceNumber
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[13px] font-medium",
									children: t.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										t.propertyId,
										" · raised by ",
										t.raisedBy
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: statusVariant(t.priority),
								children: t.priority
							})
						]
					}, t.id))
				})
			})]
		})
	] });
}
//#endregion
export { Dashboard as component };
