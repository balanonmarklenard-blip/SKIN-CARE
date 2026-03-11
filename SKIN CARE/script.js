/**
 * RECELLA SKINCARE - Master Logic Script
 * Features: Persistent Database, Order Management, Admin Guard, Fixed Images
 */

// --- 1. DATABASE INITIALIZATION ---
// This resets the database ONLY if the fixed ID 11 hasn't been applied yet.
if (!localStorage.getItem('v6_final_fix')) {
    localStorage.removeItem('p_list'); 
    localStorage.setItem('v6_final_fix', 'true');
}

localStorage.removeItem('p_list'); 

const defaultProducts = [
    { id: 1, type: "Cleanser", name: "Foaming Oat Wash", price: 450, stock: 20, imgUrl: "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?w=400" },
    { id: 2, type: "Cleanser", name: "Milky Jelly Wash", price: 520, stock: 15, imgUrl: "https://images.pexels.com/photos/4465121/pexels-photo-4465121.jpeg?w=400" },
    { id: 3, type: "Cleanser", name: "Salicylic Acid Gel", price: 380, stock: 10, imgUrl: "https://images.pexels.com/photos/8101532/pexels-photo-8101532.jpeg?w=400" },
    { id: 4, type: "Cleanser", name: "Oil Balm Cleanser", price: 600, stock: 12, imgUrl: "https://images.pexels.com/photos/3762466/pexels-photo-3762466.jpeg?w=400" },
    { id: 5, type: "Serum", name: "Glow Vitamin C", price: 850, stock: 8, imgUrl: "https://images.pexels.com/photos/3373739/pexels-photo-3373739.jpeg?w=400" },
    { id: 6, type: "Serum", name: "Hyaluronic Plump", price: 720, stock: 25, imgUrl: "https://images.pexels.com/photos/3616874/pexels-photo-3616874.jpeg?w=400" },
    { id: 7, type: "Serum", name: "Retinol Night Repair", price: 950, stock: 5, imgUrl: "https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?w=400" },
    { id: 8, type: "Serum", name: "Niacinamide 10%", price: 490, stock: 18, imgUrl: "https://images.pexels.com/photos/8101529/pexels-photo-8101529.jpeg?w=400" },
    { id: 9, type: "Moisturizer", name: "Ceramide Cream", price: 580, stock: 20, imgUrl: "https://images.pexels.com/photos/4465125/pexels-photo-4465125.jpeg?w=400" },
    { id: 10, type: "Moisturizer", name: "Water Gel Bomb", price: 640, stock: 14, imgUrl: "https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?w=400" },
    
    // --- ID 11: AESTHETIC SKINCARE BOTTLE IMAGE ---
    { id: 11, type: "Moisturizer", name: "Rose Hip Oil", price: 420, stock: 30, imgUrl: "https://images.pexels.com/photos/3618606/pexels-photo-3618606.jpeg?auto=compress&cs=tinysrgb&w=400" },
    
    { id: 12, type: "Moisturizer", name: "Night Sleeping Mask", price: 700, stock: 10, imgUrl: "https://images.pexels.com/photos/3762871/pexels-photo-3762871.jpeg?w=400" },
    { id: 13, type: "Sunscreen", name: "UV Shield SPF 50", price: 480, stock: 40, imgUrl: "https://images.pexels.com/photos/3762464/pexels-photo-3762464.jpeg?w=400" },
    { id: 14, type: "Sunscreen", name: "Mineral Sun Stick", price: 550, stock: 22, imgUrl: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?w=400" },
    { id: 15, type: "Sunscreen", name: "Matte Finish Fluid", price: 620, stock: 15, imgUrl: "https://images.pexels.com/photos/3762882/pexels-photo-3762882.jpeg?w=400" },
    { id: 16, type: "Sunscreen", name: "Cooling Sun Mist", price: 590, stock: 19, imgUrl: "https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?w=400" }
];

if (!localStorage.getItem('p_list')) {
    localStorage.setItem('p_list', JSON.stringify(defaultProducts));
}

// --- 2. AUTHENTICATION & SECURITY ---
const UserSession = {
    register: (email, pass) => {
        localStorage.setItem('stored_user_email', email);
        localStorage.setItem('stored_user_pass', pass);
        alert("Registered successfully! Your data is saved to this machine.");
        window.location.href = 'login.html';
    },
    login: (email, pass) => {
        const sE = localStorage.getItem('stored_user_email');
        const sP = localStorage.getItem('stored_user_pass');
        if (email === "admin@recella.com" && pass === "admin123") {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('isAdmin', 'true');
            window.location.href = 'admin.html';
        } else if (email === sE && pass === sP) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('isAdmin', 'false');
            window.location.href = 'index.html';
        } else { alert("Error: Check your details."); }
    },
    logout: () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isAdmin');
        window.location.href = 'login.html';
    }
};

(function protect() {
    const path = window.location.pathname.split("/").pop();
    const logged = localStorage.getItem('isLoggedIn');
    if (!logged && !['login.html', 'register.html', ''].includes(path)) {
        window.location.href = 'login.html';
    }
})();

// --- 3. SHOP & CART LOGIC ---
function getProducts() { return JSON.parse(localStorage.getItem('p_list')); }

function renderShop(filter = 'All') {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    const items = filter === 'All' ? getProducts() : getProducts().filter(p => p.type === filter);
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    grid.innerHTML = items.map(p => `
        <div class="product-card">
            <img src="${p.imgUrl}" class="product-img" onerror="this.src='https://placehold.co/400x400?text=Skincare'">
            <div class="product-info">
                <span class="type-tag">${p.type}</span>
                <h3>${p.name}</h3>
                <p class="price-p">₱${p.price}</p>
                <p class="stock-p">Stock: ${p.stock}</p>
                ${isAdmin ? '<p style="color:#b76e79; font-size:0.8rem;">Admin View Only</p>' : 
                `<button class="btn" onclick="addToCart(${p.id})" ${p.stock <= 0 ? 'disabled' : ''}>
                    ${p.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>`}
            </div>
        </div>`).join('');
}

function addToCart(id) {
    if(localStorage.getItem('isAdmin') === 'true') return alert("Admin cannot purchase items.");
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(getProducts().find(x => x.id === id));
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Added to cart!");
}

// --- 4. ORDERING SYSTEM ---
function renderCart() {
    const list = document.getElementById('cart-items-list');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if(!list) return;
    list.innerHTML = cart.map(i => `
        <div class="cart-item" style="display:flex; justify-content:space-between; padding:5px 0;">
            <span>${i.name}</span><span>₱${i.price}</span>
        </div>`).join('');
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    document.getElementById('cart-total-amount').innerText = `₱${total.toLocaleString()}`;
}

function placeOrder() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const address = document.getElementById('order-address').value;
    const payment = document.getElementById('order-payment').value;

    if (cart.length === 0) return alert("Your cart is empty!");
    if (!address) return alert("Delivery address is required.");

    const newOrder = {
        orderId: "REC-" + Math.floor(Date.now() / 1000),
        date: new Date().toLocaleString(),
        items: cart,
        total: cart.reduce((s, i) => s + i.price, 0),
        address: address,
        payment: payment,
        status: "Pending"
    };

    // Save Order History
    let history = JSON.parse(localStorage.getItem('order_history') || '[]');
    history.push(newOrder);
    localStorage.setItem('order_history', JSON.stringify(history));

    // Reduce Stock
    let inv = getProducts();
    cart.forEach(item => {
        const idx = inv.findIndex(p => p.id === item.id);
        if (inv[idx].stock > 0) inv[idx].stock--;
    });
    localStorage.setItem('p_list', JSON.stringify(inv));

    localStorage.setItem('cart', '[]');
    alert("Order successful! Thank you for choosing Recella.");
    location.reload();
}

function renderOrderHistory() {
    const cont = document.getElementById('order-history');
    if(!cont) return;
    const history = JSON.parse(localStorage.getItem('order_history') || '[]');
    cont.innerHTML = history.reverse().map(o => `
        <div class="order-card" style="border:1px solid #fce4ec; padding:15px; margin-top:10px; border-radius:10px; background:#fff;">
            <b>Order ID: ${o.orderId}</b> | <span style="color:#b76e79">${o.status}</span>
            <p style="margin:5px 0;">Items: ${o.items.length} Total: ₱${o.total} via ${o.payment}</p>
            <p style="font-size:0.8rem; color:grey;">Address: ${o.address}</p>
            ${o.status === "Pending" ? `<button onclick="cancelOrder('${o.orderId}')" class="cancel-link" style="color:red; background:none; border:none; cursor:pointer; text-decoration:underline;">Cancel Order</button>` : ""}
        </div>`).join('');
}

function cancelOrder(id) {
    if(!confirm("Cancel this order? Stock will be returned.")) return;
    let history = JSON.parse(localStorage.getItem('order_history'));
    const oIdx = history.findIndex(o => o.orderId === id);
    history[oIdx].status = "Cancelled";

    // Return Stock
    let inv = getProducts();
    history[oIdx].items.forEach(item => {
        const pIdx = inv.findIndex(p => p.id === item.id);
        inv[pIdx].stock++;
    });

    localStorage.setItem('p_list', JSON.stringify(inv));
    localStorage.setItem('order_history', JSON.stringify(history));
    location.reload();
}

// --- 5. ADMIN UTILS ---
function renderAdminTable() {
    const b = document.getElementById('admin-product-body');
    if(!b) return;
    b.innerHTML = getProducts().map(i => `
        <tr><td>${i.type}</td><td>${i.name}</td><td>₱${i.price}</td><td>${i.stock}</td>
        <td><button onclick="adminRemoveProduct(${i.id})" class="btn" style="padding:5px; background:#ffcdd2; color:#b71c1c;">Delete</button></td></tr>`).join('');
}

function adminRemoveProduct(id) {
    const updated = getProducts().filter(i => i.id !== id);
    localStorage.setItem('p_list', JSON.stringify(updated));
    location.reload();
}

function checkAdminNav() {
    if(localStorage.getItem('isAdmin') === 'true') {
        const nav = document.getElementById('nav-admin');
        if(nav) nav.style.display = 'block';
    }
}

// Initialize on Load
window.onload = () => {
    renderShop();
    renderCart();
    renderOrderHistory();
    renderAdminTable();
    checkAdminNav();
};