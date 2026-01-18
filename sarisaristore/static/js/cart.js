// cart.js - Modern Checkout (Fixed Version with Debt Recording)
console.log('🔄 Cart.js loaded - Version 4 (Fixed with Debt)');
let cart = [];

// ==================== CART OPERATIONS ====================

window.addToCart = async function(productId) {
    const products = await DB.getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product || product.quantity === 0) {
        await DialogSystem.alert('Product not available!', '⚠️');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        const qtyInput = document.querySelector(`input[data-cart-id="${productId}"]`);
        if (qtyInput) {
            qtyInput.style.transform = 'scale(1.2)';
            qtyInput.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                qtyInput.style.transform = 'scale(1)';
                qtyInput.focus();
                qtyInput.select();
            }, 300);
        }
        return;
    }

    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        cost: product.cost,
        quantity: 1
    });

    updateCartDisplay();
    
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.style.transform = 'scale(1.4)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 300);
    }
    
    setTimeout(() => {
        const qtyInput = document.querySelector(`input[data-cart-id="${productId}"]`);
        if (qtyInput) {
            qtyInput.focus();
            qtyInput.select();
        }
    }, 100);
};

window.removeFromCart = async function(productId) {
    const itemElements = document.querySelectorAll('.cart-item');
    let targetElement = null;
    
    itemElements.forEach(el => {
        const removeBtn = el.querySelector(`[data-product-id="${productId}"]`);
        if (removeBtn) targetElement = el;
    });
    
    if (targetElement) {
        targetElement.style.transform = 'translateX(100%)';
        targetElement.style.opacity = '0';
        targetElement.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            cart = cart.filter(item => item.id !== productId);
            updateCartDisplay();
            if (document.getElementById('generalSearch')) handleSearch();
        }, 300);
    } else {
        cart = cart.filter(item => item.id !== productId);
        updateCartDisplay();
        if (document.getElementById('generalSearch')) handleSearch();
    }
};

window.updateCartQuantity = async function(productId, change) {
    const item = cart.find(item => item.id === productId);
    const products = await DB.getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!item || !product) return;

    const newQty = item.quantity + change;
    
    if (newQty <= 0) {
        await removeFromCart(productId);
        return;
    }

    if (newQty > product.quantity) {
        await DialogSystem.alert(`Not enough stock! Only ${product.quantity} available.`, '⚠️');
        return;
    }

    item.quantity = newQty;
    updateCartDisplay();
    if (document.getElementById('generalSearch')) handleSearch();
};

window.setCartQuantity = async function(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    const products = await DB.getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!item || !product) return;

    const qty = parseInt(quantity);
    
    if (isNaN(qty) || qty < 0) {
        await DialogSystem.alert('Invalid quantity!', '⚠️');
        updateCartDisplay();
        return;
    }

    if (qty === 0) {
        await removeFromCart(productId);
        return;
    }

    if (qty > product.quantity) {
        await DialogSystem.alert(`Not enough stock! Only ${product.quantity} available.`, '⚠️');
        item.quantity = product.quantity;
        updateCartDisplay();
        return;
    }

    item.quantity = qty;
    updateCartDisplay();
    if (document.getElementById('generalSearch')) handleSearch();
};

window.clearCart = async function() {
    if (cart.length === 0) return;
    
    const confirmDialog = document.createElement('div');
    confirmDialog.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10003;
            animation: fadeIn 0.3s ease;
        ">
            <div style="
                background: white;
                border-radius: 24px;
                padding: 40px;
                max-width: 420px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                text-align: center;
                animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            ">
                <div style="
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #f19c79 0%, #a44a3f 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 25px;
                    font-size: 40px;
                    animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                ">🗑️</div>
                
                <h2 style="
                    margin: 0 0 15px 0;
                    color: #2C3E50;
                    font-size: 28px;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                ">Clear All Items?</h2>
                
                <p style="
                    color: #7F8C8D;
                    margin: 0 0 30px 0;
                    font-size: 16px;
                    line-height: 1.6;
                ">This will remove all <strong>${cart.length}</strong> item${cart.length > 1 ? 's' : ''} from your cart. This action cannot be undone.</p>

                <div style="display: grid; gap: 12px;">
                    <button id="confirmClear" style="
                        width: 100%;
                        padding: 16px;
                        background: linear-gradient(135deg, #f19c79 0%, #a44a3f 100%);
                        color: white;
                        border: none;
                        border-radius: 14px;
                        font-size: 16px;
                        font-weight: 800;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        box-shadow: 0 4px 15px rgba(241, 156, 121, 0.4);
                    ">Yes, Clear All</button>

                    <button id="cancelClear" style="
                        width: 100%;
                        padding: 16px;
                        background: #E8E8E8;
                        color: #2C3E50;
                        border: none;
                        border-radius: 14px;
                        font-size: 16px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">Cancel</button>
                </div>
            </div>
        </div>

        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes scaleIn {
                from {
                    transform: scale(0.8);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            @keyframes bounceIn {
                0% {
                    transform: scale(0);
                }
                50% {
                    transform: scale(1.2);
                }
                100% {
                    transform: scale(1);
                }
            }
            #confirmClear:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 25px rgba(241, 156, 121, 0.6);
            }
            #confirmClear:active {
                transform: translateY(-1px);
            }
            #cancelClear:hover {
                background: #D0D0D0;
            }
        </style>
    `;

    document.body.appendChild(confirmDialog);

    document.getElementById('confirmClear').onclick = () => {
        document.body.removeChild(confirmDialog);
        cart = [];
        updateCartDisplay();
        if (document.getElementById('generalSearch')) handleSearch();
    };

    document.getElementById('cancelClear').onclick = () => {
        document.body.removeChild(confirmDialog);
    };
};

// ==================== CART DISPLAY ====================

window.updateCartDisplay = function() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');

    if (cartCount) {
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = itemCount;
        cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
    }

    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">🛒 Cart is empty<br><small>Search and click products to add</small></p>';
        cartTotal.textContent = '0.00';
        return;
    }

    let total = 0;
    let html = '<div class="cart-list-header"><strong>Items in Cart:</strong></div><div class="cart-list" style="animation: fadeIn 0.3s ease;">';

    const reversedCart = [...cart].reverse();

    reversedCart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        html += `
            <div class="cart-item" style="animation: slideInRight 0.3s ease; animation-delay: ${index * 0.05}s; animation-fill-mode: both;">
                <div class="cart-item-header">
                    <strong class="cart-item-name">${item.name}</strong>
                    <button class="btn-remove-mini btn-cart-remove" data-product-id="${item.id}" title="Remove">✕</button>
                </div>
                <div class="cart-item-details">
                    <span class="cart-item-price">₱${item.price.toFixed(2)} each</span>
                </div>
                <div class="cart-item-controls">
                    <button class="btn-qty-round btn-qty-minus" data-product-id="${item.id}" title="Decrease">−</button>
                    <input type="number" value="${item.quantity}" min="1" class="qty-input-cart" data-cart-id="${item.id}" style="transition: transform 0.3s ease, box-shadow 0.3s ease;">
                    <button class="btn-qty-round btn-qty-plus" data-product-id="${item.id}" title="Increase">+</button>
                </div>
                <div class="cart-item-subtotal">
                    <span class="subtotal-amount">₱${subtotal.toFixed(2)}</span>
                </div>
            </div>`;
    });

    html += `</div>
        <button class="btn-clear-cart" onclick="clearCart()" style="transition: all 0.3s ease; animation: fadeIn 0.5s ease;">🗑️ Clear All</button>
        
        <button class="btn-checkout" onclick="handleCheckout()" style="
            width: 100%;
            padding: 18px;
            background: linear-gradient(135deg, #00e676 0%, #00c853 100%);
            color: white;
            border: none;
            border-radius: 16px;
            font-size: 18px;
            font-weight: 900;
            cursor: pointer;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            box-shadow: 0 8px 25px rgba(0, 230, 118, 0.3);
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            margin-top: 15px;
            animation: fadeIn 0.6s ease;
        " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 12px 35px rgba(0, 230, 118, 0.5)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 25px rgba(0, 230, 118, 0.3)';">
            💳 CHECKOUT
        </button>
        
        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            .cart-item {
                transition: all 0.3s ease;
            }
            .cart-item:hover {
                background: #f8f9fa;
                transform: translateX(-5px);
            }
            .btn-qty-round {
                transition: transform 0.2s ease;
            }
            .btn-qty-round:hover {
                transform: scale(1.1);
            }
            .btn-qty-round:active {
                transform: scale(0.95);
            }
            .btn-remove-mini {
                transition: transform 0.3s ease;
            }
            .btn-remove-mini:hover {
                transform: rotate(90deg);
            }
            .btn-clear-cart:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
        </style>
    `;
    
    cartItems.innerHTML = html;
    cartTotal.textContent = total.toFixed(2);

    setupCartEventListeners();
};

function setupCartEventListeners() {
    document.querySelectorAll('.btn-qty-minus').forEach(btn => {
        btn.onclick = () => updateCartQuantity(parseInt(btn.dataset.productId), -1);
    });
    document.querySelectorAll('.btn-qty-plus').forEach(btn => {
        btn.onclick = () => updateCartQuantity(parseInt(btn.dataset.productId), 1);
    });
    document.querySelectorAll('.btn-cart-remove').forEach(btn => {
        btn.onclick = () => removeFromCart(parseInt(btn.dataset.productId));
    });
    document.querySelectorAll('.qty-input-cart').forEach(input => {
        input.onchange = () => setCartQuantity(parseInt(input.dataset.cartId), input.value);
    });
}

// ==================== TOGGLE CART PANEL ====================

window.toggleCartPanel = function() {
    const searchPanel = document.getElementById('searchPanel');
    if (!searchPanel) {
        console.error('Search panel not found!');
        return;
    }

    const isVisible = searchPanel.style.display === 'block';
    
    if (isVisible) {
        searchPanel.style.opacity = '0';
        searchPanel.style.transform = 'translateX(100%)';
        setTimeout(() => {
            searchPanel.style.display = 'none';
        }, 300);
    } else {
        searchPanel.style.display = 'block';
        searchPanel.style.opacity = '0';
        searchPanel.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            searchPanel.style.opacity = '1';
            searchPanel.style.transform = 'translateX(0)';
            
            const searchInput = document.getElementById('generalSearch');
            if (searchInput) searchInput.focus();
        }, 10);
    }
    
    console.log('Cart panel toggled:', !isVisible ? 'OPEN' : 'CLOSED');
};

// ==================== CHECKOUT FUNCTIONALITY ====================

window.handleCheckout = async function() {
    if (cart.length === 0) {
        await DialogSystem.alert('Cart is empty! Add products first.', '🛒');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalCost = cart.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
    const profit = total - totalCost;

    const paymentDialog = document.createElement('div');
    paymentDialog.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        ">
            <div style="
                background: white;
                border-radius: 24px;
                padding: 40px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: slideUp 0.3s ease;
            ">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 64px; margin-bottom: 15px;">💳</div>
                    <h2 style="margin: 0 0 10px 0; color: #2C3E50; font-size: 28px; font-weight: 800;">Checkout</h2>
                    <p style="color: #7F8C8D; margin: 0;">Select payment method</p>
                </div>

                <div style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 16px;
                    padding: 25px;
                    margin-bottom: 30px;
                    color: white;
                ">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <span style="font-size: 16px; opacity: 0.9;">Total Amount:</span>
                        <span style="font-size: 24px; font-weight: 800;">₱${total.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.3);">
                        <span style="font-size: 14px; opacity: 0.9;">Expected Profit:</span>
                        <span style="font-size: 18px; font-weight: 700;">₱${profit.toFixed(2)}</span>
                    </div>
                </div>

                <div style="display: grid; gap: 15px; margin-bottom: 30px;">
                    <button id="payCash" style="
                        padding: 20px;
                        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        font-size: 18px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(17, 153, 142, 0.4);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                    ">
                        <span style="font-size: 24px;">💵</span>
                        <span>Cash Payment</span>
                    </button>

                    <button id="payDebt" style="
                        padding: 20px;
                        background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        font-size: 18px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 15px rgba(250, 112, 154, 0.4);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                    ">
                        <span style="font-size: 24px;">📝</span>
                        <span>Add to Debt List</span>
                    </button>
                </div>

                <button id="cancelCheckout" style="
                    width: 100%;
                    padding: 15px;
                    background: #E8E8E8;
                    color: #7F8C8D;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Cancel</button>
            </div>
        </div>

        <style>
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            #payCash:hover, #payDebt:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            }
            #cancelCheckout:hover {
                background: #D0D0D0;
            }
        </style>
    `;

    document.body.appendChild(paymentDialog);

    document.getElementById('payCash').onclick = () => {
        document.body.removeChild(paymentDialog);
        processCheckout('cash', total, profit);
    };

    document.getElementById('payDebt').onclick = () => {
        document.body.removeChild(paymentDialog);
        processDebtCheckout(total, profit);
    };

    document.getElementById('cancelCheckout').onclick = () => {
        document.body.removeChild(paymentDialog);
    };
};

async function processCheckout(paymentMethod, total, profit) {
    try {
        const products = await DB.getProducts();
        for (const item of cart) {
            const product = products.find(p => p.id === item.id);
            if (!product || product.quantity < item.quantity) {
                await DialogSystem.alert(
                    `Not enough stock for ${item.name}!\nAvailable: ${product ? product.quantity : 0}`,
                    '⚠️'
                );
                return;
            }
        }

        if (paymentMethod === 'cash') {
            await showChangeCalculator(total, profit, products);
        }

    } catch (error) {
        console.error('Checkout error:', error);
        await DialogSystem.alert('Checkout failed! Please try again.', '❌');
    }
}

async function processDebtCheckout(total, profit) {
    const debtDialog = document.createElement('div');
    debtDialog.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.3s ease;
        ">
            <div style="
                background: white;
                border-radius: 24px;
                padding: 40px;
                max-width: 450px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: slideUp 0.3s ease;
            ">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 64px; margin-bottom: 15px;">📝</div>
                    <h2 style="margin: 0 0 10px 0; color: #2C3E50; font-size: 28px; font-weight: 800;">Add to Debt List</h2>
                    <p style="color: #7F8C8D; margin: 0;">Enter customer name</p>
                </div>

                <div style="
                    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 25px;
                    text-align: center;
                    color: white;
                ">
                    <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">Debt Amount</div>
                    <div style="font-size: 36px; font-weight: 800;">₱${total.toFixed(2)}</div>
                </div>

                <div style="margin-bottom: 25px;">
                    <label style="display: block; margin-bottom: 10px; font-weight: 700; color: #2C3E50; font-size: 14px;">Customer Name:</label>
                    <input 
                        type="text" 
                        id="debtCustomerName" 
                        placeholder="Enter customer name" 
                        style="
                            width: 100%;
                            padding: 18px;
                            font-size: 18px;
                            font-weight: 600;
                            border: 3px solid #E0E0E0;
                            border-radius: 12px;
                            transition: all 0.3s ease;
                        "
                    />
                </div>

                <button id="confirmDebt" style="
                    width: 100%;
                    padding: 18px;
                    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 18px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-bottom: 15px;
                ">Add to Debt List</button>

                <button id="cancelDebt" style="
                    width: 100%;
                    padding: 15px;
                    background: #E8E8E8;
                    color: #7F8C8D;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(debtDialog);

    const customerNameInput = document.getElementById('debtCustomerName');
    customerNameInput.focus();

    document.getElementById('confirmDebt').onclick = async () => {
        const customerName = customerNameInput.value.trim();
        
        if (!customerName) {
            alert('⚠️ Please enter customer name!');
            customerNameInput.focus();
            return;
        }

        document.body.removeChild(debtDialog);
        await completeDebtSale(customerName, total, profit);
    };

    document.getElementById('cancelDebt').onclick = () => {
        document.body.removeChild(debtDialog);
    };
}

async function completeDebtSale(customerName, total, profit) {
    try {
        const products = await DB.getProducts();
        
        // Check stock availability
        for (const item of cart) {
            const product = products.find(p => p.id === item.id);
            if (!product || product.quantity < item.quantity) {
                await DialogSystem.alert(
                    `Not enough stock for ${item.name}!\nAvailable: ${product ? product.quantity : 0}`,
                    '⚠️'
                );
                return;
            }
        }

        // Deduct inventory
        for (const item of cart) {
            const product = products.find(p => p.id === item.id);
            if (product) {
                try {
                    const updateData = {
                        ...product,
                        quantity: product.quantity - item.quantity
                    };
                    
                    await DB.updateProduct(product.id, updateData);
                    console.log(`✅ Updated ${product.name} quantity to ${updateData.quantity}`);
                } catch (error) {
                    console.error(`Failed to update product ${product.name}:`, error);
                }
            }
        }

        // Add to debtors list
        const debtorData = {
            name: customerName,
            customerName: customerName,
            amount: total,
            total_debt: total,
            items: cart.map(item => ({
                id: item.id,
                productId: item.id,
                name: item.name,
                price: item.price,
                cost: item.cost,
                quantity: item.quantity
            })),
            paid: false,
            date: new Date().toISOString()
        };

        await DB.addDebtor(debtorData);

        // Show success dialog
        const successDialog = document.createElement('div');
        successDialog.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10002;
                animation: fadeIn 0.3s ease;
            ">
                <div style="
                    background: white;
                    border-radius:24px;
padding: 50px;
max-width: 400px;
width: 90%;
box-shadow: 0 20px 60px rgba(0,0,0,0.3);
text-align: center;
animation: successPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
">
<div style="font-size: 80px; margin-bottom: 20px; animation: bounce 0.6s ease;">✅</div>
<h2 style="color: #F59E0B; margin: 0 0 15px 0; font-size: 32px; font-weight: 800;">Added to Debt List!</h2>
                <div style="background: #F8F9FA; border-radius: 12px; padding: 20px; margin: 25px 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: #7F8C8D;">Customer:</span>
                        <span style="color: #2C3E50; font-weight: 700; font-size: 16px;">${customerName}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #7F8C8D;">Debt Amount:</span>
                        <span style="color: #DC2626; font-weight: 700; font-size: 18px;">₱${total.toFixed(2)}</span>
                    </div>
                </div>

                <div style="background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%); color: #92400E; padding: 15px; border-radius: 12px; margin-bottom: 25px; font-weight: 600;">
                    📝 Recorded as Unpaid Debt
                </div>

                <button id="closeSuccess" style="
                    width: 100%;
                    padding: 18px;
                    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 18px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Done</button>
            </div>
        </div>

        <style>
            @keyframes successPop {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-20px); }
                60% { transform: translateY(-10px); }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        </style>
    `;

    document.body.appendChild(successDialog);

    document.getElementById('closeSuccess').onclick = () => {
        document.body.removeChild(successDialog);
    };

    // Clear cart
    cart = [];
    updateCartDisplay();
    if (document.getElementById('generalSearch')) handleSearch();

    // Refresh debtors view if visible
    if (typeof renderDebtors === 'function') {
        await renderDebtors();
    }

    console.log('✅ Debt recorded successfully!');

} catch (error) {
    console.error('❌ Debt recording error:', error);
    await DialogSystem.alert('Failed to record debt! Please try again.', '❌');
}
}
async function showChangeCalculator(total, profit, products) {
    const changeDialog = document.createElement('div');
    changeDialog.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            animation: fadeIn 0.3s ease;
            padding: 20px;
        ">
            <div style="
                background: white;
                border-radius: 24px;
                max-width: 450px;
                width: 90%;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                animation: slideUp 0.3s ease;
            ">
                <!-- Scrollable Content Area -->
                <div style="
                    flex: 1;
                    overflow-y: auto;
                    padding: 40px 40px 20px 40px;
                ">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="font-size: 64px; margin-bottom: 15px;">💵</div>
                        <h2 style="margin: 0 0 10px 0; color: #2C3E50; font-size: 28px; font-weight: 800;">Cash Payment</h2>
                        <p style="color: #7F8C8D; margin: 0;">Enter amount received</p>
                    </div>

                    <div style="
                        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                        border-radius: 16px;
                        padding: 20px;
                        margin-bottom: 25px;
                        text-align: center;
                        color: white;
                    ">
                        <div style="font-size: 14px; opacity: 0.9; margin-bottom: 8px;">Total Amount</div>
                        <div style="font-size: 36px; font-weight: 800;">₱${total.toFixed(2)}</div>
                    </div>

                    <div style="margin-bottom: 25px;">
                        <label style="display: block; margin-bottom: 10px; font-weight: 700; color: #2C3E50; font-size: 14px;">Cash Received:</label>
                        <input 
                            type="number" 
                            id="cashReceived" 
                            placeholder="0.00" 
                            step="0.01"
                            style="
                                width: 100%;
                                padding: 18px;
                                font-size: 24px;
                                font-weight: 700;
                                text-align: center;
                                border: 3px solid #E0E0E0;
                                border-radius: 12px;
                                transition: all 0.3s ease;
                                box-sizing: border-box;
                            "
                        />
                    </div>

                    <div id="changeDisplay" style="
                        background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
                        border-radius: 12px;
                        padding: 25px;
                        text-align: center;
                        display: none;
                        margin-bottom: 20px;
                        animation: slideDown 0.3s ease;
                    ">
                        <div style="font-size: 16px; color: #92400E; margin-bottom: 10px; font-weight: 700;">💰 Change</div>
                        <div id="changeAmount" style="font-size: 40px; font-weight: 800; color: #059669;">₱0.00</div>
                    </div>
                </div>

                <!-- Sticky Footer with Buttons -->
                <div style="
                    padding: 20px 40px 40px 40px;
                    background: white;
                    border-top: 1px solid #f0f0f0;
                    border-radius: 0 0 24px 24px;
                    flex-shrink: 0;
                ">
                    <button id="confirmCash" disabled style="
                        width: 100%;
                        padding: 18px;
                        background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        font-size: 18px;
                        font-weight: 700;
                        cursor: not-allowed;
                        transition: all 0.3s ease;
                        margin-bottom: 15px;
                        opacity: 0.5;
                    ">Complete Sale</button>

                    <button id="cancelCash" style="
                        width: 100%;
                        padding: 15px;
                        background: #E8E8E8;
                        color: #7F8C8D;
                        border: none;
                        border-radius: 12px;
                        font-size: 16px;
                        font-weight: 700;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">Cancel</button>
                </div>
            </div>
        </div>
        
        <style>
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        </style>
    `;

    document.body.appendChild(changeDialog);

    const cashInput = document.getElementById('cashReceived');
    const confirmBtn = document.getElementById('confirmCash');
    const changeDisplay = document.getElementById('changeDisplay');
    const changeAmount = document.getElementById('changeAmount');

    cashInput.focus();

    cashInput.oninput = () => {
        const received = parseFloat(cashInput.value) || 0;
        const change = received - total;

        if (received >= total) {
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = '1';
            confirmBtn.style.cursor = 'pointer';
            changeDisplay.style.display = 'block';
            changeAmount.textContent = `₱${change.toFixed(2)}`;
            changeAmount.style.color = '#059669';
        } else if (received > 0) {
            // Show insufficient amount
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';
            confirmBtn.style.cursor = 'not-allowed';
            changeDisplay.style.display = 'block';
            changeAmount.textContent = `Insufficient: ₱${Math.abs(change).toFixed(2)} short`;
            changeAmount.style.color = '#DC2626';
            changeAmount.style.fontSize = '24px';
        } else {
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';
            confirmBtn.style.cursor = 'not-allowed';
            changeDisplay.style.display = 'none';
        }
    };

    confirmBtn.onclick = async () => {
        document.body.removeChild(changeDialog);
        await completeSale('cash', total, profit, products);
    };

    document.getElementById('cancelCash').onclick = () => {
        document.body.removeChild(changeDialog);
    };
}

async function completeSale(paymentMethod, total, profit, products) {
try {
const saleData = {
date: new Date().toISOString(),
total: total,
profit: profit,
payment_method: paymentMethod,
paymentType: paymentMethod,
items: cart.map(item => {
const cost = item.cost || 0;
const price = item.price || 0;
            return {
                id: item.id,
                product_id: item.id,
                productId: item.id,
                name: item.name,
                product_name: item.name,
                quantity: item.quantity,
                price: price,
                selling_price: price,
                cost: cost,
                cost_price: cost
            };
        })
    };

    console.log('💾 Saving sale:', saleData);

    await DB.addSale(saleData);

    for (const item of cart) {
        const product = products.find(p => p.id === item.id);
        if (product) {
            try {
                const updateData = {
                    ...product,
                    quantity: product.quantity - item.quantity
                };
                
                await DB.updateProduct(product.id, updateData);
                console.log(`✅ Updated ${product.name} quantity to ${updateData.quantity}`);
            } catch (error) {
                console.error(`Failed to update product ${product.name}:`, error);
            }
        }
    }

    const successDialog = document.createElement('div');
    successDialog.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10002;
            animation: fadeIn 0.3s ease;
        ">
            <div style="
                background: white;
                border-radius: 24px;
                padding: 50px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                text-align: center;
                animation: successPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            ">
                <div style="font-size: 80px; margin-bottom: 20px; animation: bounce 0.6s ease;">✅</div>
                <h2 style="color: #27AE60; margin: 0 0 15px 0; font-size: 32px; font-weight: 800;">Sale Complete!</h2>
                
                <div style="background: #F8F9FA; border-radius: 12px; padding: 20px; margin: 25px 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: #7F8C8D;">Total:</span>
                        <span style="color: #2C3E50; font-weight: 700; font-size: 18px;">₱${total.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #7F8C8D;">Profit:</span>
                        <span style="color: #27AE60; font-weight: 700; font-size: 18px;">₱${profit.toFixed(2)}</span>
                    </div>
                </div>

                <div style="background: linear-gradient(135deg, #1a237e 0%, #283593 100%); color: white; padding: 15px; border-radius: 12px; margin-bottom: 25px;">
                    Payment: <strong>💵 Cash</strong>
                </div>

                <button id="closeSuccess" style="
                    width: 100%;
                    padding: 18px;
                    background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 18px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Done</button>
            </div>
        </div>

        <style>
            @keyframes successPop {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); opacity: 1; }
            }
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-20px); }
                60% { transform: translateY(-10px); }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        </style>
    `;

    document.body.appendChild(successDialog);

    document.getElementById('closeSuccess').onclick = () => {
        document.body.removeChild(successDialog);
    };

    cart = [];
    updateCartDisplay();
    if (document.getElementById('generalSearch')) handleSearch();

    console.log('✅ Sale completed successfully!');

} catch (error) {
    console.error('❌ Sale completion error:', error);
    await DialogSystem.alert('Failed to complete sale! Please try again.', '❌');
}
}
// ==================== SEARCH FUNCTIONALITY ====================
window.handleSearch = async function() {
const searchInput = document.getElementById('generalSearch');
const searchResults = document.getElementById('searchResults');
const clearBtn = document.querySelector('.clear-search-btn');
if (!searchInput || !searchResults) return;

const query = searchInput.value.toLowerCase().trim();

if (clearBtn) {
    if (query !== '') {
        clearBtn.classList.add('visible');
    } else {
        clearBtn.classList.remove('visible');
    }
}

if (query === '') {
    searchResults.innerHTML = '';
    return;
}

try {
    const products = await DB.getProducts();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) && p.quantity > 0
    );
    
    if (filtered.length === 0) {
        searchResults.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #999;">
                <p>😔 No products found for "${query}"</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="search-results-list">';
    
    filtered.forEach((product, index) => {
        const inCart = cart.find(item => item.id === product.id);
        const buttonText = inCart ? '✓ In Cart' : '+ Add';
        const buttonClass = inCart ? 'btn-in-cart' : 'btn-add-search';
        
        html += `
            <div class="search-result-item" style="
                padding: 15px;
                border-bottom: 1px solid #f0f0f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: background 0.2s;
                animation: fadeInUp 0.3s ease;
                animation-delay: ${index * 0.05}s;
                animation-fill-mode: both;
            ">
                <div style="flex: 1;">
                    <div style="font-weight: 700; color: #2C3E50; margin-bottom: 5px;">${product.name}</div>
                    <div style="font-size: 14px; color: #7F8C8D;">
                        ₱${parseFloat(product.price).toFixed(2)} • Stock: ${product.quantity}
                    </div>
                </div>
                <button class="${buttonClass}" onclick="addToCart(${product.id})" style="
                    padding: 8px 16px;
                    background: ${inCart ? '#27AE60' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 13px;
                    transition: all 0.2s;
                ">${buttonText}</button>
            </div>
        `;
    });
    
    html += `</div>
    <style>
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .search-result-item:hover {
            background: #f8f9fa;
        }
    </style>`;
    
    searchResults.innerHTML = html;
    
} catch (error) {
    console.error('Search error:', error);
    searchResults.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #E74C3C;">
            <p>⚠️ Error searching products</p>
        </div>
    `;
}
};
window.clearSearch = function() {
const searchInput = document.getElementById('generalSearch');
const clearBtn = document.querySelector('.clear-search-btn');
const searchResults = document.getElementById('searchResults');
if (searchInput) {
    searchInput.value = '';
    searchInput.focus();
}

if (clearBtn) {
    clearBtn.classList.remove('visible');
}

if (searchResults) {
    searchResults.innerHTML = '';
}
};
function setupSearchClearButton() {
const searchInput = document.getElementById('generalSearch');
const clearBtn = document.querySelector('.clear-search-btn');
if (searchInput && clearBtn) {
    clearBtn.onclick = clearSearch;
    
    searchInput.addEventListener('input', function() {
        if (this.value !== '') {
            clearBtn.classList.add('visible');
        } else {
            clearBtn.classList.remove('visible');
        }
    });
    
    console.log('✓ Search clear button connected');
}
}
function initializeCart() {
console.log('🔄 Initializing cart...');
const cartBtn = document.getElementById('floatingCart');
const searchPanel = document.getElementById('searchPanel');

if (cartBtn && searchPanel) {
    cartBtn.onclick = toggleCartPanel;
    console.log('✓ Cart button connected');
} else {
    console.warn('⚠️ Cart button or search panel not found');
}

const searchInput = document.getElementById('generalSearch');
if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
    console.log('✓ Search input connected');
}

const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
    checkoutBtn.onclick = () => { if(typeof handleCheckout === 'function') handleCheckout(); };
    console.log('✓ Checkout button connected');
}

setupSearchClearButton();

updateCartDisplay();
console.log('✓ Cart initialized successfully');
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', initializeCart);
} else {
initializeCart();
}
window.cart = cart;
