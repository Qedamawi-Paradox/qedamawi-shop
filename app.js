// ---------- Settings & storage ----------
const KEY = "shopData";
const LOW_STOCK = 3;
let data = load();
let currentTab = "sell";
let reportDays = 1;
let lang = readSetting("shopLang", ["en", "am"], "en");
let cal = readSetting("shopCal", ["greg", "eth"], "greg");

function load() {
    try {
        const saved = JSON.parse(localStorage.getItem(KEY));
        if (saved && saved.products && saved.sales && saved.expenses) {
            if (!saved.debts) saved.debts = [];
            return saved;
        }
    } catch (e) {}
    return { products: [], sales: [], expenses: [], debts: [] };
}
function save() {
    localStorage.setItem(KEY, JSON.stringify(data));
}
function readSetting(name, allowed, fallback) {
    try {
        const v = localStorage.getItem(name);
        if (allowed.indexOf(v) !== -1) return v;
    } catch (e) {}
    return fallback;
}
function writeSetting(name, value) {
    try { localStorage.setItem(name, value); } catch (e) {}
}

// ---------- Translations ----------
const I18N = {
    en: {
        nav_sell: "Sell", nav_products: "Products", nav_expenses: "Expenses",
        nav_credit: "Credit", nav_report: "Report",
        langBtn: "አማርኛ", cal_eth: "Ethiopian date", cal_greg: "Gregorian date",
        birr: "Birr",
        backup: "📥 Backup", restore: "📤 Restore",
        backupSuccess: "Backup file downloaded successfully!",
        restoreConfirm: "Are you sure you want to restore? Current local data will be replaced.",
        restoreSuccess: "Data restored successfully!",
        restoreInvalid: "Invalid backup file format.",

        todaysSales: "Today's sales",
        paidNowCredit: "Paid now {paid} · On credit {credit}",
        tapToSell: "Tap a product to sell",
        noProducts: "No products yet. Go to the Products tab and add some.",
        noSalesToday: "No sales yet today.",
        onCreditName: " · On credit: {name}",
        undo: "Undo",
        eachStock: "{price} each · In stock: {n}",
        total: "Total:",
        onCreditCheck: "On credit (ዱቤ) – pays later",
        phCustomer: "Customer name",
        cancel: "Cancel",
        confirmSale: "Confirm sale",
        onlyInStock: "Only {n} in stock. Add stock in the Products tab first.",
        needName: "Please type the customer's name for a credit sale.",
        undoConfirm: "Undo this sale of {name} × {qty}?",
        undoCreditNote: "\nThe credit for {name} will be removed too.",

        outOfStock: "Out of stock",
        lowLeft: "Low: only {n} left",
        inStock: "In stock: {n}",

        addProduct: "Add a product",
        phName: "Name (e.g. Sugar 1kg)",
        phPrice: "Selling price (Birr)",
        phCost: "Buying cost (Birr)",
        phStock: "Stock in hand",
        saveProduct: "Save product",
        yourProducts: "Your products",
        nothingYet: "Nothing here yet.",
        productLine: "Price {price} · Cost {cost} · {stock}",
        addStock: "Add stock",
        changePrice: "Change price",
        changeCost: "Change cost",
        del: "Delete",
        needNamePrice: "Please enter a name and a selling price.",
        promptAddStock: "How many to add to {name}?",
        promptPrice: "New selling price for {name} (Birr):",
        promptCost: "New buying cost for {name} (Birr):",
        deleteProductConfirm: "Delete {name}? Past sales are kept.",

        todaysExpenses: "Today's expenses",
        addExpense: "Add an expense",
        phExpenseNote: "What for? (e.g. Electricity, Transport)",
        phAmount: "Amount (Birr)",
        saveExpense: "Save expense",
        recentExpenses: "Recent expenses",
        noExpenses: "No expenses recorded.",
        needExpense: "Please enter what it was for and the amount.",
        deleteExpenseConfirm: "Delete this expense?",

        totalOwedTitle: "Total owed to you (ዱቤ)",
        addCredit: "Add credit",
        phNote: "Note (optional, e.g. 2 kg sugar)",
        saveCredit: "Save credit",
        whoOwes: "Who owes you",
        nobodyOwes: "Nobody owes you anything right now.",
        owesYou: "owes you",
        youOweThem: "you owe them (they paid extra)",
        gotPaid: "Got paid",
        history: "History",
        needCredit: "Please enter the customer's name and the amount.",
        promptPaid: "{name} paid how much? (Birr)",
        tooMuch: "That is more than {name} owes ({amount}).",
        balance: "Balance:",
        creditWord: "Credit",
        paymentWord: "Payment",
        close: "Close",
        deleteEntryConfirm: "Delete this entry? The balance will change. (The sale record itself is not changed.)",

        today: "Today", days7: "7 days", days30: "30 days",
        lastDays: "Last {n} days",
        profit: "Profit",
        profitHint: "Sales − cost of items − expenses",
        sales: "Sales",
        costItems: "Cost of items sold",
        profitItems: "Profit on items",
        expensesWord: "Expenses",
        missingCost: "Note: some sales had no buying cost, so profit may look higher than it really is. Use \"Change cost\" in the Products tab for future sales.",
        creditHeading: "Credit (ዱቤ)",
        givenCredit: "Given on credit",
        paymentsReceived: "Payments received",
        totalOwedNow: "Total owed to you now",
        bestSellers: "Best sellers",
        nSold: "{n} sold",
        runningLow: "Running low",
        nothingLow: "Nothing is running low.",
        noSalesPeriod: "No sales in this period."
    },
    am: {
        nav_sell: "ሽያጭ", nav_products: "ዕቃዎች", nav_expenses: "ወጪዎች",
        nav_credit: "ዱቤ", nav_report: "ሪፖርት",
        langBtn: "English", cal_eth: "ዓ.ም", cal_greg: "ግሪጎሪያን",
        birr: "ብር",
        backup: "📥 ባክአፕ", restore: "📤 መልስ",
        backupSuccess: "የባክአፕ ፋይል በተሳካ ሁኔታ ወርዷል!",
        restoreConfirm: "ዳታውን ወደነበረበት መመለስ ይፈልጋሉ? አሁን ያለው መረጃ ይቀየራል።",
        restoreSuccess: "መረጃው በተሳካ ሁኔታ ተመልሷል!",
        restoreInvalid: "ትክክለኛ ያልሆነ የባክአፕ ፋይል ዓይነት።",

        todaysSales: "የዛሬ ሽያጭ",
        paidNowCredit: "አሁን የተከፈለ {paid} · በዱቤ {credit}",
        tapToSell: "ለመሸጥ ዕቃ ይንኩ",
        noProducts: "እስካሁን ምንም ዕቃ የለም። ወደ ዕቃዎች ገጽ ሄደው ይጨምሩ።",
        noSalesToday: "ዛሬ እስካሁን ሽያጭ የለም።",
        onCreditName: " · በዱቤ፦ {name}",
        undo: "ይመለስ",
        eachStock: "{price} በአንዱ · በክምችት፦ {n}",
        total: "ጠቅላላ፦",
        onCreditCheck: "በዱቤ – በኋላ ይከፍላል",
        phCustomer: "የደንበኛ ስም",
        cancel: "ተው",
        confirmSale: "ሽያጩን አረጋግጥ",
        onlyInStock: "በክምችት {n} ብቻ አለ። መጀመሪያ በዕቃዎች ገጽ ክምችት ይጨምሩ።",
        needName: "ለዱቤ ሽያጭ የደንበኛውን ስም ይጻፉ።",
        undoConfirm: "የ{name} × {qty} ሽያጭ ይመለስ?",
        undoCreditNote: "\nየ{name} ዱቤም አብሮ ይወገዳል።",

        outOfStock: "አልቋል",
        lowLeft: "ሊያልቅ ነው፦ {n} ብቻ ቀርቷል",
        inStock: "በክምችት፦ {n}",

        addProduct: "ዕቃ ጨምር",
        phName: "ስም (ለምሳሌ ስኳር 1ኪግ)",
        phPrice: "መሸጫ ዋጋ (ብር)",
        phCost: "መግዣ ዋጋ (ብር)",
        phStock: "ያለ ክምችት",
        saveProduct: "ዕቃውን አስቀምጥ",
        yourProducts: "የእርስዎ ዕቃዎች",
        nothingYet: "እስካሁን ምንም የለም።",
        productLine: "ዋጋ {price} · መግዣ {cost} · {stock}",
        addStock: "ክምችት ጨምር",
        changePrice: "ዋጋ ቀይር",
        changeCost: "መግዣ ቀይር",
        del: "አጥፋ",
        needNamePrice: "ስም እና መሸጫ ዋጋ ያስገቡ።",
        promptAddStock: "ወደ {name} ስንት ይጨመር?",
        promptPrice: "የ{name} አዲስ መሸጫ ዋጋ (ብር)፦",
        promptCost: "የ{name} አዲስ መግዣ ዋጋ (ብር)፦",
        deleteProductConfirm: "{name} ይጥፋ? ያለፉ ሽያጮች ይቀመጣሉ።",

        todaysExpenses: "የዛሬ ወጪ",
        addExpense: "ወጪ ጨምር",
        phExpenseNote: "ለምን? (ለምሳሌ ኤሌክትሪክ፣ መጓጓዣ)",
        phAmount: "መጠን (ብር)",
        saveExpense: "ወጪውን አስቀምጥ",
        recentExpenses: "የቅርብ ጊዜ ወጪዎች",
        noExpenses: "ምንም ወጪ አልተመዘገበም።",
        needExpense: "ለምን እንደሆነ እና መጠኑን ያስገቡ።",
        deleteExpenseConfirm: "ይህ ወጪ ይጥፋ?",

        totalOwedTitle: "ሊከፈሉዎት የሚገባ ጠቅላላ ዱቤ",
        addCredit: "ዱቤ ጨምር",
        phNote: "ማስታወሻ (አማራጭ፣ ለምሳሌ 2 ኪግ ስኳር)",
        saveCredit: "ዱቤውን አስቀምጥ",
        whoOwes: "ዕዳ ያለባቸው ደንበኞች",
        nobodyOwes: "አሁን ማንም ዕዳ የለበትም።",
        owesYou: "ዕዳ አለበት",
        youOweThem: "እርስዎ ይከፍሉታል (ከልክ በላይ ከፍሏል)",
        gotPaid: "ተከፈለ",
        history: "ታሪክ",
        needCredit: "የደንበኛውን ስም እና መጠኑን ያስገቡ።",
        promptPaid: "{name} ስንት ከፈለ? (ብር)",
        tooMuch: "ይህ {name} ከሚከፍለው በላይ ነው ({amount})።",
        balance: "ቀሪ፦",
        creditWord: "ዱቤ",
        paymentWord: "ክፍያ",
        close: "ዝጋ",
        deleteEntryConfirm: "ይህ መዝገብ ይጥፋ? ቀሪው ይቀየራል። (የሽያጭ መዝገቡ አይቀየርም።)",

        today: "ዛሬ", days7: "7 ቀን", days30: "30 ቀን",
        lastDays: "ያለፉት {n} ቀናት",
        profit: "ትርፍ",
        profitHint: "ሽያጭ − የዕቃ ወጪ − ወጪዎች",
        sales: "ሽያጭ",
        costItems: "የተሸጡ ዕቃዎች ወጪ",
        profitItems: "የዕቃ ትርፍ",
        expensesWord: "ወጪዎች",
        missingCost: "ማሳሰቢያ፦ አንዳንድ ሽያጮች መግዣ ዋጋ ስላልነበራቸው ትርፉ ከእውነተኛው ሊበልጥ ይችላል። ለቀጣይ ሽያጮች በዕቃዎች ገጽ መግዣ ቀይር ይጠቀሙ።",
        creditHeading: "ዱቤ",
        givenCredit: "በዱቤ የተሰጠ",
        paymentsReceived: "የተቀበሉት ክፍያ",
        totalOwedNow: "አሁን ሊከፈሉዎት የሚገባ",
        bestSellers: "በብዛት የተሸጡ",
        nSold: "{n} ተሸጧል",
        runningLow: "እያለቁ ያሉ",
        nothingLow: "ምንም እያለቀ የለም።",
        noSalesPeriod: "በዚህ ወቅት ሽያጭ የለም።"
    }
};

function t(key, vars) {
    let s = I18N[lang][key];
    if (s === undefined) s = I18N.en[key];
    if (s === undefined) s = key;
    if (vars) {
        Object.keys(vars).forEach((k) => {
            s = s.split("{" + k + "}").join(String(vars[k]));
        });
    }
    return s;
}

// ---------- Backup & Restore Logic ----------
function exportData() {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `qedamawi_shop_backup_${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importData(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!window.confirm(t("restoreConfirm"))) {
        e.target.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const imported = JSON.parse(evt.target.result);
            if (imported && Array.isArray(imported.products) && Array.isArray(imported.sales) && Array.isArray(imported.expenses)) {
                data = imported;
                if (!data.debts) data.debts = [];
                save();
                alert(t("restoreSuccess"));
                render();
            } else {
                alert(t("restoreInvalid"));
            }
        } catch (err) {
            alert(t("restoreInvalid"));
        }
        e.target.value = "";
    };
    reader.readAsText(file);
}

// ---------- Calendar ----------
const ETH_MONTHS = {
    en: ["Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yekatit", "Megabit",
         "Miyazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagume"],
    am: ["መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት", "መጋቢት",
         "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜን"]
};
const GREG_MONTHS = {
    en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    am: ["ጃንዋሪ", "ፌብሩዋሪ", "ማርች", "ኤፕሪል", "ሜይ", "ጁን", "ጁላይ", "ኦገስት",
         "ሴፕቴምበር", "ኦክቶበር", "ኖቬምበር", "ዲሴምበር"]
};

function gregToJdn(y, m, d) {
    const a = Math.floor((14 - m) / 12);
    const yy = y + 4800 - a;
    const mm = m + 12 * a - 3;
    return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4)
        - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}
function ethFromDate(date) {
    const jdn = gregToJdn(date.getFullYear(), date.getMonth() + 1, date.getDate());
    const r = (jdn - 1723856) % 1461;
    const n = (r % 365) + 365 * Math.floor(r / 1460);
    return {
        year: 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460),
        month: Math.floor(n / 30) + 1,
        day: (n % 30) + 1
    };
}

// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
function money(n) {
    return Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 2 }) + " " + t("birr");
}
function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => (
        { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
}
function round2(n) {
    return Math.round(n * 100) / 100;
}
function pad2(n) {
    return (n < 10 ? "0" : "") + n;
}
function isToday(iso) {
    return new Date(iso).toDateString() === new Date().toDateString();
}
function timeStr(iso) {
    const d = new Date(iso);
    return pad2(d.getHours()) + ":" + pad2(d.getMinutes());
}
function dateStr(iso) {
    const d = new Date(iso);
    if (cal === "eth") {
        const e = ethFromDate(d);
        return e.day + " " + ETH_MONTHS[lang][e.month - 1] + " " + e.year;
    }
    return d.getDate() + " " + GREG_MONTHS[lang][d.getMonth()] + " " + d.getFullYear();
}
function inLastDays(iso, days) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));
    return new Date(iso) >= start;
}
function stockLabel(p) {
    if (p.stock <= 0) return `<span class="low">${t("outOfStock")}</span>`;
    if (p.stock <= LOW_STOCK) return `<span class="low">${t("lowLeft", { n: p.stock })}</span>`;
    return t("inStock", { n: p.stock });
}

// ---------- Credit (ዱቤ) helpers ----------
function customerBalances() {
    const map = new Map();
    data.debts.forEach((d) => {
        const key = d.name.trim().toLowerCase();
        if (!map.has(key)) map.set(key, { key: key, name: d.name.trim(), balance: 0 });
        map.get(key).balance += d.type === "credit" ? d.amount : -d.amount;
    });
    return Array.from(map.values()).map((c) => {
        c.balance = round2(c.balance);
        return c;
    });
}
function totalOwed() {
    return round2(
        customerBalances().reduce((sum, c) => sum + (c.balance > 0 ? c.balance : 0), 0)
    );
}
function nameOptions() {
    return customerBalances().map((c) => `<option value="${esc(c.name)}">`).join("");
}

// ---------- Navigation & settings buttons ----------
document.querySelectorAll("#nav button").forEach((btn) => {
    btn.addEventListener("click", () => {
        currentTab = btn.dataset.tab;
        render();
    });
});
$("langBtn").addEventListener("click", () => {
    lang = lang === "en" ? "am" : "en";
    writeSetting("shopLang", lang);
    render();
});
$("calBtn").addEventListener("click", () => {
    cal = cal === "greg" ? "eth" : "greg";
    writeSetting("shopCal", cal);
    render();
});
$("exportBtn").addEventListener("click", exportData);
$("importBtn").addEventListener("click", () => $("importFileInput").click());
$("importFileInput").addEventListener("change", importData);

function applyChrome() {
    document.documentElement.lang = lang === "am" ? "am" : "en";
    document.querySelectorAll("#nav button").forEach((b) => {
        b.textContent = t("nav_" + b.dataset.tab);
        b.classList.toggle("active", b.dataset.tab === currentTab);
    });
    $("langBtn").textContent = t("langBtn");
    $("calBtn").textContent = t(cal === "eth" ? "cal_eth" : "cal_greg");
    $("exportBtn").textContent = t("backup");
    $("importBtn").textContent = t("restore");
}

function render() {
    applyChrome();
    if (currentTab === "sell") renderSell();
    else if (currentTab === "products") renderProducts();
    else if (currentTab === "expenses") renderExpenses();
    else if (currentTab === "credit") renderCredit();
    else if (currentTab === "report") renderReport();
    window.scrollTo(0, 0);
}

// ---------- SELL screen ----------
function renderSell() {
    const el = $("screen");
    const todaySales = data.sales.filter((s) => isToday(s.date));
    const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
    const todayCredit = todaySales.filter((s) => s.credit).reduce((sum, s) => sum + s.total, 0);

    let html = `<div class="card summary"><div>${t("todaysSales")}</div><strong>${money(todayTotal)}</strong>`;
    if (todayCredit > 0) {
        html += `<small>${t("paidNowCredit", { paid: money(todayTotal - todayCredit), credit: money(todayCredit) })}</small>`;
    }
    html += `</div>`;
    html += `<h2>${t("tapToSell")}</h2>`;

    if (data.products.length === 0) {
        html += `<p class="empty">${t("noProducts")}</p>`;
    }
    data.products.forEach((p) => {
        html += `<button class="row product-btn" data-sell="${p.id}">
            <span>${esc(p.name)}<small>${stockLabel(p)}</small></span>
            <strong>${money(p.price)}</strong>
        </button>`;
    });

    html += `<h2>${t("todaysSales")}</h2>`;
    if (todaySales.length === 0) html += `<p class="empty">${t("noSalesToday")}</p>`;
    todaySales.slice().reverse().forEach((s) => {
        const creditNote = s.credit ? t("onCreditName", { name: esc(s.customer) }) : "";
        html += `<div class="row">
            <span>${esc(s.name)} × ${s.qty}<small>${timeStr(s.date)}${creditNote}</small></span>
            <span>${money(s.total)} <button class="small danger" data-undo="${s.id}">${t("undo")}</button></span>
        </div>`;
    });

    el.innerHTML = html;
    el.querySelectorAll("[data-sell]").forEach((b) =>
        b.addEventListener("click", () => openSellDialog(b.dataset.sell))
    );
    el.querySelectorAll("[data-undo]").forEach((b) =>
        b.addEventListener("click", () => undoSale(b.dataset.undo))
    );
}

function openSellDialog(productId) {
    const p = data.products.find((x) => x.id === productId);
    if (!p) return;
    let qty = 1;

    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.innerHTML = `
        <div class="dialog">
            <h2>${esc(p.name)}</h2>
            <p>${t("eachStock", { price: money(p.price), n: p.stock })}</p>
            <div class="stepper">
                <button id="minus">−</button>
                <span id="qty">1</span>
                <button id="plus">+</button>
            </div>
            <p>${t("total")} <strong id="total">${money(p.price)}</strong></p>
            <label class="check">
                <input type="checkbox" id="onCredit"> ${t("onCreditCheck")}
            </label>
            <div id="creditBox" class="hidden">
                <input id="custName" list="customerList" placeholder="${t("phCustomer")}" autocomplete="off">
                <datalist id="customerList">${nameOptions()}</datalist>
            </div>
            <div class="actions">
                <button id="cancelBtn" class="secondary">${t("cancel")}</button>
                <button id="confirmBtn">${t("confirmSale")}</button>
            </div>
        </div>`;
    document.body.appendChild(overlay);

    function update() {
        overlay.querySelector("#qty").textContent = qty;
        overlay.querySelector("#total").textContent = money(qty * p.price);
    }
    overlay.querySelector("#minus").addEventListener("click", () => {
        if (qty > 1) { qty--; update(); }
    });
    overlay.querySelector("#plus").addEventListener("click", () => {
        qty++; update();
    });
    overlay.querySelector("#onCredit").addEventListener("change", (e) => {
        overlay.querySelector("#creditBox").classList.toggle("hidden", !e.target.checked);
        if (e.target.checked) overlay.querySelector("#custName").focus();
    });
    overlay.querySelector("#cancelBtn").addEventListener("click", () => overlay.remove());
    overlay.querySelector("#confirmBtn").addEventListener("click", () => {
        if (qty > p.stock) {
            alert(t("onlyInStock", { n: p.stock }));
            return;
        }
        const onCredit = overlay.querySelector("#onCredit").checked;
        const customer = overlay.querySelector("#custName").value.trim();
        if (onCredit && !customer) {
            alert(t("needName"));
            return;
        }
        const when = new Date().toISOString();
        const saleId = uid();
        const total = qty * p.price;
        p.stock -= qty;
        data.sales.push({
            id: saleId,
            productId: p.id,
            name: p.name,
            qty: qty,
            price: p.price,
            cost: p.cost,
            total: total,
            date: when,
            credit: onCredit,
            customer: onCredit ? customer : "",
        });
        if (onCredit) {
            data.debts.push({
                id: uid(),
                name: customer,
                type: "credit",
                amount: total,
                note: p.name + " × " + qty,
                date: when,
                saleId: saleId,
            });
        }
        save();
        overlay.remove();
        render();
    });
}

function undoSale(saleId) {
    const sale = data.sales.find((s) => s.id === saleId);
    if (!sale) return;
    let msg = t("undoConfirm", { name: sale.name, qty: sale.qty });
    if (sale.credit) msg += t("undoCreditNote", { name: sale.customer });
    if (!window.confirm(msg)) return;
    const p = data.products.find((x) => x.id === sale.productId);
    if (p) p.stock += sale.qty;
    data.sales = data.sales.filter((s) => s.id !== saleId);
    data.debts = data.debts.filter((d) => d.saleId !== saleId);
    save();
    render();
}

// ---------- PRODUCTS screen ----------
function renderProducts() {
    const el = $("screen");
    let html = `
        <form id="productForm" class="card">
            <h2 style="margin-top:0">${t("addProduct")}</h2>
            <input id="pName" placeholder="${t("phName")}" required>
            <input id="pPrice" type="number" inputmode="decimal" min="0" step="any" placeholder="${t("phPrice")}" required>
            <input id="pCost" type="number" inputmode="decimal" min="0" step="any" placeholder="${t("phCost")}">
            <input id="pStock" type="number" inputmode="numeric" min="0" step="1" placeholder="${t("phStock")}">
            <button type="submit">${t("saveProduct")}</button>
        </form>
        <h2>${t("yourProducts")}</h2>`;

    if (data.products.length === 0) html += `<p class="empty">${t("nothingYet")}</p>`;
    data.products.forEach((p) => {
        html += `<div class="card">
            <strong>${esc(p.name)}</strong>
            <small style="display:block;color:#6b6b70;margin-top:4px">
                ${t("productLine", { price: money(p.price), cost: money(p.cost), stock: stockLabel(p) })}
            </small>
            <div class="actions-row">
                <button class="small" data-addstock="${p.id}">${t("addStock")}</button>
                <button class="small secondary" data-price="${p.id}">${t("changePrice")}</button>
                <button class="small secondary" data-cost="${p.id}">${t("changeCost")}</button>
                <button class="small danger" data-del="${p.id}">${t("del")}</button>
            </div>
        </div>`;
    });

    el.innerHTML = html;

    $("productForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = $("pName").value.trim();
        const price = parseFloat($("pPrice").value);
        const cost = parseFloat($("pCost").value) || 0;
        const stock = parseInt($("pStock").value, 10) || 0;
        if (!name || isNaN(price) || price < 0) {
            alert(t("needNamePrice"));
            return;
        }
        data.products.push({ id: uid(), name, price, cost, stock });
        save();
        render();
    });

    el.querySelectorAll("[data-addstock]").forEach((b) =>
        b.addEventListener("click", () => {
            const p = data.products.find((x) => x.id === b.dataset.addstock);
            const n = parseInt(window.prompt(t("promptAddStock", { name: p.name })), 10);
            if (!isNaN(n) && n > 0) { p.stock += n; save(); render(); }
        })
    );
    el.querySelectorAll("[data-price]").forEach((b) =>
        b.addEventListener("click", () => {
            const p = data.products.find((x) => x.id === b.dataset.price);
            const n = parseFloat(window.prompt(t("promptPrice", { name: p.name }), p.price));
            if (!isNaN(n) && n >= 0) { p.price = n; save(); render(); }
        })
    );
    el.querySelectorAll("[data-cost]").forEach((b) =>
        b.addEventListener("click", () => {
            const p = data.products.find((x) => x.id === b.dataset.cost);
            const n = parseFloat(window.prompt(t("promptCost", { name: p.name }), p.cost));
            if (!isNaN(n) && n >= 0) { p.cost = n; save(); render(); }
        })
    );
    el.querySelectorAll("[data-del]").forEach((b) =>
        b.addEventListener("click", () => {
            const p = data.products.find((x) => x.id === b.dataset.del);
            if (window.confirm(t("deleteProductConfirm", { name: p.name }))) {
                data.products = data.products.filter((x) => x.id !== p.id);
                save();
                render();
            }
        })
    );
}

// ---------- EXPENSES screen ----------
function renderExpenses() {
    const el = $("screen");
    const todayTotal = data.expenses
        .filter((x) => isToday(x.date))
        .reduce((sum, x) => sum + x.amount, 0);

    let html = `
        <div class="card summary"><div>${t("todaysExpenses")}</div><strong>${money(todayTotal)}</strong></div>
        <form id="expenseForm" class="card">
            <h2 style="margin-top:0">${t("addExpense")}</h2>
            <input id="eNote" placeholder="${t("phExpenseNote")}" required>
            <input id="eAmount" type="number" inputmode="decimal" min="0" step="any" placeholder="${t("phAmount")}" required>
            <button type="submit">${t("saveExpense")}</button>
        </form>
        <h2>${t("recentExpenses")}</h2>`;

    const recent = data.expenses.slice().reverse().slice(0, 30);
    if (recent.length === 0) html += `<p class="empty">${t("noExpenses")}</p>`;
    recent.forEach((x) => {
        html += `<div class="row">
            <span>${esc(x.note)}<small>${dateStr(x.date)} ${timeStr(x.date)}</small></span>
            <span>${money(x.amount)} <button class="small danger" data-delexp="${x.id}">${t("del")}</button></span>
        </div>`;
    });

    el.innerHTML = html;

    $("expenseForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const note = $("eNote").value.trim();
        const amount = parseFloat($("eAmount").value);
        if (!note || isNaN(amount) || amount <= 0) {
            alert(t("needExpense"));
            return;
        }
        data.expenses.push({ id: uid(), note, amount, date: new Date().toISOString() });
        save();
        render();
    });

    el.querySelectorAll("[data-delexp]").forEach((b) =>
        b.addEventListener("click", () => {
            if (window.confirm(t("deleteExpenseConfirm"))) {
                data.expenses = data.expenses.filter((x) => x.id !== b.dataset.delexp);
                save();
                render();
            }
        })
    );
}

// ---------- CREDIT (ዱቤ) screen ----------
function renderCredit() {
    const el = $("screen");
    const customers = customerBalances()
        .filter((c) => Math.abs(c.balance) > 0.005)
        .sort((a, b) => b.balance - a.balance);

    let html = `
        <div class="card summary"><div>${t("totalOwedTitle")}</div><strong>${money(totalOwed())}</strong></div>
        <form id="creditForm" class="card">
            <h2 style="margin-top:0">${t("addCredit")}</h2>
            <input id="cName" list="cNames" placeholder="${t("phCustomer")}" autocomplete="off" required>
            <datalist id="cNames">${nameOptions()}</datalist>
            <input id="cAmount" type="number" inputmode="decimal" min="0" step="any" placeholder="${t("phAmount")}" required>
            <input id="cNote" placeholder="${t("phNote")}">
            <button type="submit">${t("saveCredit")}</button>
        </form>
        <h2>${t("whoOwes")}</h2>`;

    if (customers.length === 0) html += `<p class="empty">${t("nobodyOwes")}</p>`;
    customers.forEach((c) => {
        const owes = c.balance > 0;
        html += `<div class="card">
            <div class="between">
                <strong>${esc(c.name)}</strong>
                <strong class="${owes ? "bad" : "good"}">${money(Math.abs(c.balance))}</strong>
            </div>
            <small class="muted">${owes ? t("owesYou") : t("youOweThem")}</small>
            <div class="actions-row">
                <button class="small" data-paid="${esc(c.key)}">${t("gotPaid")}</button>
                <button class="small secondary" data-hist="${esc(c.key)}">${t("history")}</button>
            </div>
        </div>`;
    });

    el.innerHTML = html;

    $("creditForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = $("cName").value.trim();
        const amount = parseFloat($("cAmount").value);
        const note = $("cNote").value.trim();
        if (!name || isNaN(amount) || amount <= 0) {
            alert(t("needCredit"));
            return;
        }
        data.debts.push({
            id: uid(),
            name: name,
            type: "credit",
            amount: amount,
            note: note,
            date: new Date().toISOString(),
        });
        save();
        render();
    });

    el.querySelectorAll("[data-paid]").forEach((b) =>
        b.addEventListener("click", () => {
            const c = customerBalances().find((x) => x.key === b.dataset.paid);
            if (!c) return;
            const n = parseFloat(window.prompt(t("promptPaid", { name: c.name }), c.balance));
            if (isNaN(n) || n <= 0) return;
            if (n > c.balance + 0.005) {
                alert(t("tooMuch", { name: c.name, amount: money(c.balance) }));
                return;
            }
            data.debts.push({
                id: uid(),
                name: c.name,
                type: "payment",
                amount: n,
                note: "",
                date: new Date().toISOString(),
            });
            save();
            render();
        })
    );
    el.querySelectorAll("[data-hist]").forEach((b) =>
        b.addEventListener("click", () => openHistory(b.dataset.hist))
    );
}

function openHistory(key) {
    const c = customerBalances().find((x) => x.key === key);
    if (!c) return;
    const entries = data.debts
        .filter((d) => d.name.trim().toLowerCase() === key)
        .slice()
        .reverse();

    let html = `<div class="dialog">
        <h2>${esc(c.name)}</h2>
        <p>${t("balance")} <strong>${money(c.balance)}</strong></p>`;
    entries.forEach((d) => {
        const isCredit = d.type === "credit";
        html += `<div class="row">
            <span>${isCredit ? t("creditWord") : t("paymentWord")}${d.note ? " · " + esc(d.note) : ""}
                <small>${dateStr(d.date)} ${timeStr(d.date)}</small></span>
            <span class="${isCredit ? "bad" : "good"}">${isCredit ? "+" : "−"}${money(d.amount)}
                <button class="small danger" data-delentry="${d.id}">${t("del")}</button></span>
        </div>`;
    });
    html += `<div class="actions"><button id="closeHist" class="secondary">${t("close")}</button></div></div>`;

    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    overlay.querySelector("#closeHist").addEventListener("click", () => overlay.remove());
    overlay.querySelectorAll("[data-delentry]").forEach((b) =>
        b.addEventListener("click", () => {
            if (!window.confirm(t("deleteEntryConfirm"))) return;
            data.debts = data.debts.filter((d) => d.id !== b.dataset.delentry);
            save();
            overlay.remove();
            render();
            if (data.debts.some((d) => d.name.trim().toLowerCase() === key)) openHistory(key);
        })
    );
}

// ---------- REPORT screen ----------
function renderReport() {
    const el = $("screen");
    const days = reportDays;
    const label = days === 1 ? t("today") : t("lastDays", { n: days });

    const sales = data.sales.filter((s) => inLastDays(s.date, days));
    const expenses = data.expenses.filter((x) => inLastDays(x.date, days));
    const debts = data.debts.filter((d) => inLastDays(d.date, days));

    const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
    const costOfItems = sales.reduce((sum, s) => sum + s.qty * (s.cost || 0), 0);
    const totalExpenses = expenses.reduce((sum, x) => sum + x.amount, 0);
    const profitOnItems = totalSales - costOfItems;
    const netProfit = profitOnItems - totalExpenses;
    const creditGiven = debts.filter((d) => d.type === "credit").reduce((sum, d) => sum + d.amount, 0);
    const paymentsIn = debts.filter((d) => d.type === "payment").reduce((sum, d) => sum + d.amount, 0);
    const missingCost = sales.some((s) => !s.cost);

    const byProduct = new Map();
    sales.forEach((s) => {
        if (!byProduct.has(s.name)) byProduct.set(s.name, { name: s.name, qty: 0, total: 0 });
        const row = byProduct.get(s.name);
        row.qty += s.qty;
        row.total += s.total;
    });
    const best = Array.from(byProduct.values()).sort((a, b) => b.qty - a.qty).slice(0, 5);
    const low = data.products.filter((p) => p.stock <= LOW_STOCK);

    const seg = (d, text) => `<button data-days="${d}" class="${days === d ? "on" : ""}">${text}</button>`;

    let html = `
        <div class="seg">${seg(1, t("today"))}${seg(7, t("days7"))}${seg(30, t("days30"))}</div>
        <div class="card summary">
            <div>${label} · ${t("profit")}</div>
            <strong class="${netProfit >= 0 ? "good" : "bad"}">${money(netProfit)}</strong>
            <small>${t("profitHint")}</small>
        </div>
        <div class="card">
            <div class="stat"><span>${t("sales")}</span><strong>${money(totalSales)}</strong></div>
            <div class="stat"><span>${t("costItems")}</span><strong>${money(costOfItems)}</strong></div>
            <div class="stat"><span>${t("profitItems")}</span><strong>${money(profitOnItems)}</strong></div>
            <div class="stat"><span>${t("expensesWord")}</span><strong>${money(totalExpenses)}</strong></div>
        </div>`;

    if (missingCost) {
        html += `<p class="empty">${t("missingCost")}</p>`;
    }

    html += `
        <h2>${t("creditHeading")}</h2>
        <div class="card">
            <div class="stat"><span>${t("givenCredit")}</span><strong>${money(creditGiven)}</strong></div>
            <div class="stat"><span>${t("paymentsReceived")}</span><strong>${money(paymentsIn)}</strong></div>
            <div class="stat"><span>${t("totalOwedNow")}</span><strong>${money(totalOwed())}</strong></div>
        </div>
        <h2>${t("bestSellers")}</h2>`;

    if (best.length === 0) html += `<p class="empty">${t("noSalesPeriod")}</p>`;
    best.forEach((b) => {
        html += `<div class="row"><span>${esc(b.name)}<small>${t("nSold", { n: b.qty })}</small></span><strong>${money(b.total)}</strong></div>`;
    });

    html += `<h2>${t("runningLow")}</h2>`;
    if (low.length === 0) html += `<p class="empty">${t("nothingLow")}</p>`;
    low.forEach((p) => {
        html += `<div class="row"><span>${esc(p.name)}</span><span>${stockLabel(p)}</span></div>`;
    });

    el.innerHTML = html;

    el.querySelectorAll("[data-days]").forEach((b) =>
        b.addEventListener("click", () => {
            reportDays = Number(b.dataset.days);
            render();
        })
    );
}

// ---------- Start ----------
render();

// ---------- Register Service Worker for PWA / Offline Support ----------
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then((reg) => console.log("Service Worker registered successfully:", reg.scope))
            .catch((err) => console.log("Service Worker registration failed:", err));
    });
}