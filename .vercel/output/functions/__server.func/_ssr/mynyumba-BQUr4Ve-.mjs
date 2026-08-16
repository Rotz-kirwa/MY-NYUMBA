//#region node_modules/.nitro/vite/services/ssr/assets/mynyumba-BQUr4Ve-.js
var KSh = (n, opts) => {
	if (opts?.compact && Math.abs(n) >= 1e6) return `KSh ${(n / 1e6).toFixed(1)}M`;
	if (opts?.compact && Math.abs(n) >= 1e3) return `KSh ${Math.round(n / 1e3)}K`;
	return `KSh ${n.toLocaleString("en-KE")}`;
};
var properties = [
	{
		id: "kilimani-heights",
		name: "Kilimani Heights",
		area: "Kilimani",
		tier: "Mid",
		units: 24,
		occupied: 22,
		monthlyRoll: 1128e3,
		collected: 946e3,
		caretaker: "Joseph Mwangi",
		caretakerPhone: "+254 712 884 210",
		yearBuilt: 2016
	},
	{
		id: "lavington-green",
		name: "Lavington Green Residences",
		area: "Lavington",
		tier: "Premium",
		units: 12,
		occupied: 11,
		monthlyRoll: 1705e3,
		collected: 156e4,
		caretaker: "Agnes Wairimu",
		caretakerPhone: "+254 733 402 918",
		yearBuilt: 2019
	},
	{
		id: "riverside-court",
		name: "Riverside Court Apartments",
		area: "Westlands",
		tier: "Premium",
		units: 18,
		occupied: 16,
		monthlyRoll: 144e4,
		collected: 108e4,
		caretaker: "Peter Ochieng",
		caretakerPhone: "+254 720 118 673",
		yearBuilt: 2014
	},
	{
		id: "kileleshwa-mews",
		name: "Kileleshwa Mews",
		area: "Kileleshwa",
		tier: "Mid",
		units: 16,
		occupied: 15,
		monthlyRoll: 102e4,
		collected: 884e3,
		caretaker: "Halima Abdi",
		caretakerPhone: "+254 726 550 341",
		yearBuilt: 2018
	},
	{
		id: "south-b-villas",
		name: "South B Garden Villas",
		area: "South B",
		tier: "Standard",
		units: 20,
		occupied: 18,
		monthlyRoll: 64e4,
		collected: 494e3,
		caretaker: "Samuel Kiptoo",
		caretakerPhone: "+254 715 903 226",
		yearBuilt: 2011
	},
	{
		id: "ruaka-skyline",
		name: "Ruaka Skyline Towers",
		area: "Ruaka",
		tier: "Standard",
		units: 32,
		occupied: 27,
		monthlyRoll: 864e3,
		collected: 621e3,
		caretaker: "Grace Njeri",
		caretakerPhone: "+254 701 447 802",
		yearBuilt: 2021
	},
	{
		id: "karen-oaks",
		name: "Karen Oaks Townhouses",
		area: "Karen",
		tier: "Premium",
		units: 8,
		occupied: 8,
		monthlyRoll: 164e4,
		collected: 164e4,
		caretaker: "David Muriuki",
		caretakerPhone: "+254 738 271 095",
		yearBuilt: 2020
	}
];
var collectionByDay = [
	4,
	9,
	26,
	38,
	61,
	12,
	8,
	5,
	14,
	22,
	7,
	4,
	3,
	6,
	2,
	5,
	3,
	2,
	4,
	9,
	3,
	2,
	1,
	2,
	3,
	1,
	2,
	4,
	1,
	2,
	1
];
var monthlySeries = [
	{
		m: "Feb",
		collected: 6.1,
		billed: 7.2
	},
	{
		m: "Mar",
		collected: 6.6,
		billed: 7.4
	},
	{
		m: "Apr",
		collected: 7,
		billed: 7.6
	},
	{
		m: "May",
		collected: 6.8,
		billed: 7.9
	},
	{
		m: "Jun",
		collected: 7.4,
		billed: 8.1
	},
	{
		m: "Jul",
		collected: 7.9,
		billed: 8.3
	},
	{
		m: "Aug",
		collected: 7.2,
		billed: 8.4
	}
];
var portfolio = {
	billed: properties.reduce((s, p) => s + p.monthlyRoll, 0),
	collected: properties.reduce((s, p) => s + p.collected, 0),
	units: properties.reduce((s, p) => s + p.units, 0),
	occupied: properties.reduce((s, p) => s + p.occupied, 0)
};
var rentSegments = () => {
	const collected = portfolio.collected;
	const partial = 386e3;
	const overdue = 612e3;
	const notDue = Math.max(portfolio.billed - collected - partial - overdue, 0);
	return [
		{
			key: "collected",
			label: "Collected",
			value: collected,
			color: "var(--success)"
		},
		{
			key: "partial",
			label: "Part-paid",
			value: partial,
			color: "var(--ochre)"
		},
		{
			key: "overdue",
			label: "Overdue",
			value: overdue,
			color: "var(--danger)"
		},
		{
			key: "notdue",
			label: "Not yet due",
			value: notDue,
			color: "var(--border-strong)"
		}
	];
};
//#endregion
export { rentSegments as a, portfolio as i, collectionByDay as n, monthlySeries as r, KSh as t };
