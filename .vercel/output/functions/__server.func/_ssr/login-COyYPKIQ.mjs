import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { E as Check, M as ArrowRight, S as EyeOff, T as CircleCheck, _ as Lock, a as Sparkles, h as Mail, i as TrendingUp, o as Smartphone, s as ShieldCheck, t as Zap, w as Coins, x as Eye } from "../_libs/lucide-react.mjs";
import { t as KSh } from "./mynyumba-BQUr4Ve-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-COyYPKIQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLES = [
	{
		id: "owner",
		label: "Portfolio Owner",
		email: "wanjiru@mynyumba.co.ke",
		roleBadge: "OWNER (Full Control)",
		description: "Complete visibility over revenue, arrears aging, net operating income, and executive reports.",
		perks: [
			"Bank & M-Pesa ledger access",
			"Executive financial reporting",
			"Multi-property management"
		]
	},
	{
		id: "manager",
		label: "Property Manager",
		email: "mwangi@mynyumba.co.ke",
		roleBadge: "PROPERTY MANAGER",
		description: "Daily operations, unit assignments, tenant communication, and maintenance work orders.",
		perks: [
			"Work order dispatch",
			"Tenant onboarding & scoring",
			"Rent collection reminders"
		]
	},
	{
		id: "accountant",
		label: "Accountant",
		email: "accounts@mynyumba.co.ke",
		roleBadge: "ACCOUNTANT",
		description: "Operating expenses, tax compliance summaries, M-Pesa transaction reconciliation.",
		perks: [
			"Reconciliation ledger",
			"Expense category tracking",
			"Audit trail logs"
		]
	},
	{
		id: "tenant",
		label: "Tenant Portal",
		email: "brian.otieno@gmail.com",
		roleBadge: "TENANT",
		description: "Instant M-Pesa STK rent payments, maintenance request submission, and digital receipts.",
		perks: [
			"1-Tap M-Pesa payment",
			"Digital rent receipts",
			"Direct caretaker messaging"
		]
	}
];
function LoginPage() {
	const [selectedRole, setSelectedRole] = (0, import_react.useState)(ROLES[0]);
	const [email, setEmail] = (0, import_react.useState)(ROLES[0].email);
	const [password, setPassword] = (0, import_react.useState)("••••••••••••");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [authMode, setAuthMode] = (0, import_react.useState)("password");
	const [phone, setPhone] = (0, import_react.useState)("+254 712 445 908");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const [stkStatus, setStkStatus] = (0, import_react.useState)(null);
	const handleRoleSelect = (role) => {
		setSelectedRole(role);
		setEmail(role.email);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		setIsLoading(true);
		if (authMode === "mpesa") {
			setStkStatus("Sending M-Pesa STK Push prompt to your phone...");
			setTimeout(() => {
				setStkStatus("STK Push sent! Confirm PIN on phone to enter console...");
				setTimeout(() => {
					window.location.href = "/";
				}, 1200);
			}, 1e3);
		} else setTimeout(() => {
			window.location.href = "/";
		}, 600);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen w-full flex flex-col lg:flex-row bg-[#07152E] text-[#F0F4FA] font-sans selection:bg-[#E5A118] selection:text-black overflow-x-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex-1 lg:max-w-[55%] p-8 lg:p-14 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-[#153466] bg-cover bg-center",
			style: { backgroundImage: `url('/nairobi_luxury_apartments.png')` },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-[#061229]/94 via-[#0A1E40]/88 to-[#040D1F]/96 backdrop-blur-[2px] pointer-events-none" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-32 -left-32 size-96 rounded-full bg-[#E5A118]/20 blur-[120px] pointer-events-none" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-32 -right-32 size-[500px] rounded-full bg-[#0D4ED5]/40 blur-[150px] pointer-events-none" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 opacity-[0.04] pointer-events-none",
					style: {
						backgroundImage: `radial-gradient(#F0F4FA 1px, transparent 1px)`,
						backgroundSize: "24px 24px"
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/favicon.png",
							alt: "My Nyumba",
							className: "size-10 shrink-0 rounded-xs object-cover shadow-lg shadow-[#E5A118]/25 border border-[#E5A118]/50"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl font-bold tracking-tight text-[#F0F4FA]",
							children: "My Nyumba"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[11px] uppercase tracking-widest text-[#E5A118] font-mono",
							children: "Nairobi SaaS Platform"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden sm:flex items-center gap-2 rounded-xs border border-[#1C478A] bg-[#0E2854]/80 px-3 py-1.5 text-xs text-[#B8CDEE] backdrop-blur-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-emerald-400 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Daraja API Active" })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 my-10 lg:my-0 space-y-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 max-w-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 rounded-full bg-[#E5A118]/15 border border-[#E5A118]/35 px-3 py-1 text-xs text-[#F7C253]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 13 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: "Property Management SaaS"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white",
								children: [
									"Property management & ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "italic font-normal text-[#E5A118]",
										children: "Rent collection, architected for Nairobi."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm sm:text-base text-[#B8CDEE] leading-relaxed",
								children: "Authoritative server-side financial ledgers, automated M-Pesa Daraja STK reconciliation, and tenant credit scoring for Kenya's leading real estate portfolios."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xs border border-[#1D488C] bg-[#0A224A]/90 p-5 backdrop-blur-xl space-y-4 shadow-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[#96B5E5] font-medium flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, {
										size: 14,
										className: "text-[#E5A118]"
									}), " August 2026 Collection Band"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-[#E5A118] font-semibold",
									children: [KSh(6128400), " Collected"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-31 gap-[2px] h-9 items-end bg-[#05132B] p-1 rounded-xs border border-[#153B75]",
								children: Array.from({ length: 31 }).map((_, i) => {
									const day = i + 1;
									const isPast = day <= 17;
									const isPaid = isPast && day !== 6 && day !== 13;
									const height = isPast ? isPaid ? "85%" : "40%" : "15%";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										title: `Day ${day}`,
										className: "w-full rounded-[1px] transition-all duration-300 hover:scale-y-110",
										style: {
											height,
											backgroundColor: isPast ? isPaid ? "#1E8256" : "#E5A118" : "#142E5C"
										}
									}, i);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2 pt-1 text-[11px] font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 rounded-xs bg-[#0F326B] px-2.5 py-1.5 text-[#D1E0F7]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, {
											size: 12,
											className: "text-[#E5A118]"
										}), " 96.4% Collection"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 rounded-xs bg-[#0F326B] px-2.5 py-1.5 text-[#D1E0F7]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, {
											size: 12,
											className: "text-emerald-400"
										}), " M-Pesa Daraja"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 rounded-xs bg-[#0F326B] px-2.5 py-1.5 text-[#D1E0F7]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
											size: 12,
											className: "text-blue-300"
										}), " AES Isolation"]
									})
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 flex flex-wrap items-center justify-between gap-4 text-xs text-[#8AA9DA] border-t border-[#153466] pt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "© 2026 My Nyumba SaaS Ltd · Nairobi, Kenya" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hover:underline cursor-pointer",
							children: "Security Policy"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hover:underline cursor-pointer",
							children: "Daraja Callback Terms"
						})]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 bg-background text-foreground p-6 sm:p-10 lg:p-14 flex flex-col justify-center items-center relative",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "t-caption uppercase tracking-wider text-muted-foreground font-semibold",
							children: "Secure System Gateway"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "t-display-lg mt-1 text-foreground",
							children: "Welcome back"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "t-body mt-1 text-muted-foreground",
							children: "Select your organization role or sign in with your credentials."
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-xs font-semibold uppercase tracking-wider",
							children: "1. Choose Persona / Role"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-xs bg-muted/60 p-1 border border-border",
							children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleRoleSelect(r),
								className: `rounded-xs px-2.5 py-2 text-xs font-semibold transition-all duration-200 text-center truncate ${selectedRole.id === r.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-card hover:text-foreground"}`,
								children: r.label
							}, r.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xs border border-border bg-[#FCFAF5] p-3.5 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-bold text-[#0B3B2E] flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
											size: 14,
											className: "text-[#D08A28]"
										}),
										" ",
										selectedRole.roleBadge
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground",
									children: "PROD Context"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground leading-relaxed",
								children: selectedRole.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2 pt-1",
								children: selectedRole.perks.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 text-[11px] font-medium text-[#0B3B2E] bg-[#0B3B2E]/5 px-2 py-0.5 rounded-xs border border-[#0B3B2E]/10",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
											size: 10,
											className: "text-emerald-700"
										}),
										" ",
										p
									]
								}, idx))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-[#1A1815] uppercase tracking-wider",
							children: "2. Authentication Method"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setAuthMode("password"),
								className: `px-2 py-1 rounded-xs transition-colors ${authMode === "password" ? "bg-[#0B3B2E] text-white" : "text-muted-foreground hover:text-foreground"}`,
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setAuthMode("mpesa"),
								className: `px-2 py-1 rounded-xs transition-colors flex items-center gap-1 ${authMode === "mpesa" ? "bg-[#0B3B2E] text-white" : "text-muted-foreground hover:text-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { size: 12 }), " M-Pesa STK"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "space-y-4",
						children: [
							authMode === "password" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs font-semibold mb-1 text-[#1A1815]",
								children: "Email Address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
									size: 16,
									className: "absolute left-3 top-2.5 text-muted-foreground"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									value: email,
									onChange: (e) => setEmail(e.target.value),
									className: "w-full rounded-xs border border-border-strong bg-[#FCFAF5] pl-9 pr-3 py-2 text-sm outline-none focus:border-[#0B3B2E] focus:ring-1 focus:ring-[#0B3B2E] transition-all font-mono",
									required: true
								})]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold text-[#1A1815]",
									children: "Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#",
									className: "text-xs font-medium text-[#0B3B2E] hover:underline",
									children: "Forgot password?"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {
										size: 16,
										className: "absolute left-3 top-2.5 text-muted-foreground"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: showPassword ? "text" : "password",
										value: password,
										onChange: (e) => setPassword(e.target.value),
										className: "w-full rounded-xs border border-border-strong bg-[#FCFAF5] pl-9 pr-9 py-2 text-sm outline-none focus:border-[#0B3B2E] focus:ring-1 focus:ring-[#0B3B2E] transition-all font-mono",
										required: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowPassword(!showPassword),
										className: "absolute right-3 top-2.5 text-muted-foreground hover:text-foreground",
										children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 16 })
									})
								]
							})] })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-xs font-semibold mb-1 text-[#1A1815]",
									children: "M-Pesa Registered Phone Number"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, {
										size: 16,
										className: "absolute left-3 top-2.5 text-emerald-700"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: phone,
										onChange: (e) => setPhone(e.target.value),
										className: "w-full rounded-xs border border-border-strong bg-[#FCFAF5] pl-9 pr-3 py-2 text-sm outline-none focus:border-[#0B3B2E] focus:ring-1 focus:ring-[#0B3B2E] transition-all font-mono font-bold",
										required: true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mt-1",
									children: "An STK Push prompt will be sent to your phone to authenticate your identity."
								})
							] }),
							stkStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xs bg-[#0B3B2E]/10 border border-[#0B3B2E]/20 p-2.5 text-xs text-[#0B3B2E] font-medium flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
									size: 14,
									className: "text-[#D08A28] animate-bounce"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: stkStatus })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: isLoading,
								className: "w-full group relative flex items-center justify-center gap-2 rounded-xs bg-[#0B3B2E] py-3 text-sm font-semibold text-[#F3EFE7] shadow-md transition-all duration-200 hover:bg-[#07281F] hover:shadow-lg disabled:opacity-50 cursor-pointer",
								children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Authenticating session..." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign into My Nyumba Console" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									size: 16,
									className: "transition-transform group-hover:translate-x-1"
								})] })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xs bg-[#E8E2D5] p-3 text-center border border-[#D5CEB2]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-[#4A463D] font-medium",
							children: "Pair Programming Demo Environment: Click any persona tab above to instant-test tenant isolation."
						})
					})
				]
			})
		})]
	});
}
//#endregion
export { LoginPage as component };
