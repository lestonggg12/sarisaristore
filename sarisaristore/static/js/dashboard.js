/* PAGE SWITCHING */
function showPage(pageId) {
    // Hide all pages and show the selected one
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add('active-page');
    
    // Update navigation button styling
    updateNavHighlight(pageId);
    
    // Render appropriate content
    switch(pageId) {
        case 'profitPage':
            if (typeof renderProfit === 'function') renderProfit();
            break;
        case 'pricePage':
            if (typeof renderPriceList === 'function') renderPriceList();
            break;
        case 'inventoryPage':
            if (typeof renderInventory === 'function') renderInventory();
            break;
        case 'debtPage':
            if (typeof renderDebtors === 'function') renderDebtors();
            break;
        case 'settingsPage':
            if (typeof renderSettings === 'function') renderSettings();
            break;
    }
}

/* HELPER: UPDATE BUTTON HIGHLIGHTS */
function updateNavHighlight(pageId) {
    document.querySelectorAll('.nav-links button').forEach(btn => {
        btn.classList.remove('active');
    });

    const navMap = {
        'profitPage': 'btnProfit',
        'pricePage': 'btnPrice',
        'inventoryPage': 'btnInventory',
        'debtPage': 'btnDebt',
        'settingsPage': 'btnSettings'
    };

    const activeBtnId = navMap[pageId];
    const activeBtn = document.getElementById(activeBtnId);
    if (activeBtn) activeBtn.classList.add('active');
}

/* NAVIGATION BUTTON LISTENERS */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Dashboard initializing...');

    const navButtons = [
        { id: 'btnProfit', page: 'profitPage' },
        { id: 'btnPrice', page: 'pricePage' },
        { id: 'btnInventory', page: 'inventoryPage' },
        { id: 'btnDebt', page: 'debtPage' },
        { id: 'btnSettings', page: 'settingsPage' }
    ];

    navButtons.forEach(nav => {
        const btn = document.getElementById(nav.id);
        if (btn) {
            btn.addEventListener('click', () => showPage(nav.page));
        }
    });
    
    // Load initial page
    showPage('profitPage');
    
    console.log('✓ Dashboard initialized successfully');
});

/* UPDATE CART COUNT BADGE */
function updateCartCount() {
    const cartCountBadge = document.getElementById('cartCount');
    if (cartCountBadge && typeof window.cart !== 'undefined') {
        const totalItems = window.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountBadge.textContent = totalItems;
        cartCountBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

window.showPage = showPage;
window.updateCartCount = updateCartCount;
console.log('✓ Main script loaded successfully!');