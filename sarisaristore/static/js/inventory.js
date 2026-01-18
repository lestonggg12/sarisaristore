// inventory.js - Inventory Management (Matching Price List Design)
// inventory.js - Inventory Management (Matching Price List Design)
console.log('📦 Loading inventory module...');

// ==================== INJECT MODERN DIALOG STYLES ====================
(function injectModernDialogStyles() {
    const styleId = 'modern-dialog-override-styles';
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        /* Modern Dialog Override Styles */
        #customDialogOverlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(0, 0, 0, 0.5) !important;
            backdrop-filter: blur(12px) !important;
            display: none !important;
            justify-content: center !important;
            align-items: center !important;
            z-index: 20000 !important;
            animation: dialogFadeIn 0.3s ease !important;
        }
        
        #customDialogOverlay.active {
            display: flex !important;
        }
        
        #customDialogOverlay .dialog-box {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9)) !important;
            backdrop-filter: blur(20px) !important;
            border-radius: 28px !important;
            padding: 45px 40px 40px !important;
            width: 90% !important;
            max-width: 450px !important;
            box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.3) inset !important;
            animation: dialogSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
            text-align: center !important;
            position: relative !important;
            overflow: hidden !important;
        }
        
        #customDialogOverlay .dialog-box::before {
            content: '' !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 8px !important;
            background: linear-gradient(90deg, #cbdfbd 0%, #a8c99c 25%, #d4e09b 50%, #f3c291 75%, #cbdfbd 100%) !important;
            animation: shimmer 3s linear infinite !important;
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        #customDialogOverlay .dialog-icon-wrapper {
            width: 90px !important;
            height: 90px !important;
            margin: 0 auto 28px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 50% !important;
            background: linear-gradient(135deg, #cbdfbd 0%, #a8c99c 100%) !important;
            box-shadow: 0 12px 35px rgba(203, 223, 189, 0.5), 0 0 0 8px rgba(203, 223, 189, 0.15) !important;
            animation: iconBounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s backwards !important;
            position: relative !important;
        }
        
        #customDialogOverlay .dialog-icon-wrapper::before {
            content: '' !important;
            position: absolute !important;
            inset: -8px !important;
            border-radius: 50% !important;
            border: 2px solid transparent !important;
            background: linear-gradient(135deg, rgba(203, 223, 189, 0.3), rgba(168, 201, 156, 0.3)) border-box !important;
            -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0) !important;
            mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0) !important;
            -webkit-mask-composite: xor !important;
            mask-composite: exclude !important;
            animation: rotate 3s linear infinite !important;
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes iconBounceIn {
            0% { transform: scale(0) rotate(-180deg); opacity: 0; }
            50% { transform: scale(1.15) rotate(10deg); }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        #customDialogOverlay .dialog-icon {
            font-size: 52px !important;
            filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.15)) !important;
            animation: iconPulse 2s ease-in-out infinite !important;
        }
        
        @keyframes iconPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        #customDialogOverlay .dialog-title {
            font-size: 26px !important;
            font-weight: 900 !important;
            background: linear-gradient(135deg, #2d3748, #5D534A) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            background-clip: text !important;
            margin: 0 0 14px 0 !important;
            letter-spacing: -0.5px !important;
            animation: slideDown 0.4s ease 0.2s backwards !important;
        }
        
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        #customDialogOverlay .dialog-message {
            font-size: 16px !important;
            line-height: 1.7 !important;
            color: #718096 !important;
            font-weight: 500 !important;
            margin-bottom: 35px !important;
            animation: slideDown 0.4s ease 0.3s backwards !important;
        }
        
        #customDialogOverlay .dialog-buttons {
            display: flex !important;
            flex-direction: column !important;
            gap: 14px !important;
            animation: slideDown 0.4s ease 0.35s backwards !important;
        }
        
        #customDialogOverlay .dialog-btn {
            width: 100% !important;
            padding: 18px 28px !important;
            border: none !important;
            border-radius: 16px !important;
            font-weight: 800 !important;
            font-size: 16px !important;
            cursor: pointer !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            position: relative !important;
            overflow: hidden !important;
        }
        
        #customDialogOverlay .dialog-btn::before {
            content: '' !important;
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            width: 0 !important;
            height: 0 !important;
            border-radius: 50% !important;
            background: rgba(255, 255, 255, 0.3) !important;
            transform: translate(-50%, -50%) !important;
            transition: width 0.6s, height 0.6s !important;
        }
        
        #customDialogOverlay .dialog-btn:active::before {
            width: 300px !important;
            height: 300px !important;
        }
        
        #customDialogOverlay .dialog-btn-primary {
            background: linear-gradient(135deg, #cbdfbd 0%, #a8c99c 100%) !important;
            color: #2d5a3b !important;
            box-shadow: 0 6px 20px rgba(203, 223, 189, 0.5), 0 0 0 2px rgba(203, 223, 189, 0.2) inset !important;
            text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5) !important;
        }
        
        #customDialogOverlay .dialog-btn-primary:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 12px 30px rgba(203, 223, 189, 0.6), 0 0 0 2px rgba(203, 223, 189, 0.3) inset !important;
        }
        
        #customDialogOverlay .dialog-btn-primary:active {
            transform: translateY(-1px) !important;
        }
        
        #customDialogOverlay .dialog-box::after {
            content: '' !important;
            position: absolute !important;
            width: 200% !important;
            height: 200% !important;
            top: -50% !important;
            left: -50% !important;
            background: radial-gradient(circle at 20% 30%, rgba(203, 223, 189, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(168, 201, 156, 0.1) 0%, transparent 50%) !important;
            animation: float 8s ease-in-out infinite !important;
            pointer-events: none !important;
        }
        
        @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, -30px) rotate(120deg); }
            66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        
        @keyframes dialogFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes dialogSlideIn {
            from { transform: scale(0.8) translateY(30px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    console.log('✨ Modern dialog styles injected!');
})();

let selectedCategory = null;

// Use CATEGORIES from price_list.js or define if not exists
if (typeof window.CATEGORIES === 'undefined') {
    window.CATEGORIES = [
        // --- ROW 1 (TOP) ---
        // 1. Top Left: Mustard Yellow
        { id: 'beverages', name: 'Beverages', icon: '🥤', color: 'linear-gradient(135deg, #dfbd7a 0%, #e4b76b 100%)' },
        // 2. Top Middle: Ochre/Amber
        { id: 'school', name: 'School Supplies', icon: '📚', color: 'linear-gradient(135deg, #d48c2e 0%, #ba7a26 100%)' },
        // 3. Top Right: Deep Terracotta
        { id: 'snacks', name: 'Snacks', icon: '🍿', color: 'linear-gradient(135deg, #a44a3f 0%, #934635 100%)' },

        // --- ROW 2 (MIDDLE) ---
        // 4. Middle Left: Dirty White / Cream
        { id: 'foods', name: 'Whole Foods', icon: '🍚', color: 'linear-gradient(135deg, #fcead2 0%, #f7dfc1 100%)' },
        // 5. Middle Middle: Peach/Sand
        { id: 'bath', name: 'Bath, Hygiene & Laundry Soaps', icon: '🧼', color: 'linear-gradient(135deg, #f3c291 0%, #e5b382 100%)' },
        // 6. Middle Right: Muted Orange (Wholesale Beverages)
        { id: 'wholesale_beverages', name: 'Wholesale Beverages', icon: '📦🥤', color: 'linear-gradient(135deg, #cc8451 0%, #b87545 100%)' },

        // --- ROW 3 (BOTTOM) ---
        // 7. Bottom Left: Pale Green (Hard Liquors)
        { id: 'liquor', name: 'Hard Liquors', icon: '🍺', color: 'linear-gradient(135deg, #e2e8b0 0%, #d4db9d 100%)' }
    ];
}
var CATEGORIES = window.CATEGORIES;

// ==================== MAIN RENDER ====================

window.renderInventory = async function() {
  const content = document.getElementById('inventoryContent');
  
  content.innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <div style="font-size: 48px; animation: spin 1s linear infinite;">⏳</div>
      <p style="color: #666; margin-top: 10px;">Loading inventory...</p>
    </div>
    <style>
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    </style>
  `;
  
  try {
    if (!selectedCategory) {
      await renderCategorySelection(content);
    } else {
      await renderCategoryInventory(content, selectedCategory);
    }
  } catch (error) {
    console.error('❌ Error rendering inventory:', error);
    content.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #a44a3f;">
        <h2>⚠️ Error Loading Inventory</h2>
        <p>${error.message || 'An unexpected error occurred'}</p>
        <button onclick="renderInventory()" class="btn-add">Retry</button>
      </div>
    `;
  }
};

// ==================== CATEGORY SELECTION ====================

async function renderCategorySelection(content) {
  const products = await DB.getProducts();
  
  if (!Array.isArray(products)) {
    throw new Error('Products data is not available');
  }
  
  let html = `
    <div style="text-align: center; margin-bottom: 40px;">
      <h2 style="color: #5D534A; margin-bottom: 8px; font-size: 2rem; font-weight: 800;">📦 Inventory Management</h2>
      <p style="color: #9E9382; font-size: 16px;">Select a category to manage products</p>
    </div>
  `;
  
  html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 25px; margin-top: 30px;">';
  
  CATEGORIES.forEach(category => {
    const categoryProducts = products.filter(p => (p.category || p.category_id) === category.id);
    const totalItems = categoryProducts.length;
    const lowStock = categoryProducts.filter(p => {
      const qty = parseFloat(p.quantity || p.stock || 0);
      return qty < 10 && qty > 0;
    }).length;
    const outOfStock = categoryProducts.filter(p => {
      const qty = parseFloat(p.quantity || p.stock || 0);
      return qty === 0;
    }).length;
    
    html += `
      <div class="category-card-modern" data-category="${category.id}" style="
        background: ${category.color};
        border-radius: 20px;
        padding: 30px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        position: relative;
        overflow: hidden;
      ">
        <div style="position: absolute; top: -20px; right: -20px; font-size: 120px; opacity: 0.1;">${category.icon}</div>
        <div style="position: relative; z-index: 1;">
          <div style="font-size: 56px; margin-bottom: 15px; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">${category.icon}</div>
          <h3 style="color: white; margin-bottom: 20px; font-size: 20px; font-weight: 700; text-shadow: 0 2px 5px rgba(0,0,0,0.2);">${category.name}</h3>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; color: white;">
            <div style="background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); border-radius: 12px; padding: 15px; text-align: center;">
              <div style="font-size: 28px; font-weight: 800; margin-bottom: 5px;">${totalItems}</div>
              <div style="font-size: 11px; opacity: 0.95; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Total</div>
            </div>
            <div style="background: rgba(255,215,0,0.3); backdrop-filter: blur(10px); border-radius: 12px; padding: 15px; text-align: center;">
              <div style="font-size: 28px; font-weight: 800; margin-bottom: 5px;">${lowStock}</div>
              <div style="font-size: 11px; opacity: 0.95; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Low</div>
            </div>
            <div style="background: rgba(164,74,63,0.4); backdrop-filter: blur(10px); border-radius: 12px; padding: 15px; text-align: center;">
              <div style="font-size: 28px; font-weight: 800; margin-bottom: 5px;">${outOfStock}</div>
              <div style="font-size: 11px; opacity: 0.95; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Out</div>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  
  html += `
    <style>
      .category-card-modern:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0,0,0,0.25);
      }
      .category-card-modern:active {
        transform: translateY(-4px) scale(1.01);
      }
    </style>
  `;
  
  content.innerHTML = html;
  
  document.querySelectorAll('.category-card-modern').forEach(card => {
    card.addEventListener('click', function() {
      selectedCategory = this.getAttribute('data-category');
      renderInventory();
    });
  });
}

// ==================== CATEGORY INVENTORY ====================

async function renderCategoryInventory(content, categoryId) {
  const category = CATEGORIES.find(c => c.id === categoryId);
  const allProducts = await DB.getProducts();
  
  if (!Array.isArray(allProducts)) {
    throw new Error('Products data is not available');
  }
  
  const products = allProducts.filter(p => (p.category || p.category_id) === categoryId);
  
  const totalItems = products.length;
  const lowStock = products.filter(p => {
    const qty = parseFloat(p.quantity || p.stock || 0);
    return qty < 10 && qty > 0;
  }).length;
  const outOfStock = products.filter(p => {
    const qty = parseFloat(p.quantity || p.stock || 0);
    return qty === 0;
  }).length;
  
  const totalValue = products.reduce((sum, p) => {
    const cost = parseFloat(p.cost || p.cost_price || 0);
    const qty = parseFloat(p.quantity || p.stock || 0);
    return sum + (cost * qty);
  }, 0);

  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px;">
      <div>
        <h2 style="color: #5D534A; margin: 0; font-size: 1.8rem; font-weight: 800;">${category.icon} ${category.name}</h2>
        <p style="color: #9E9382; margin: 5px 0 0 0; font-size: 14px;">Manage products in this category</p>
      </div>
      <button id="btnBackToCategories" style="
        padding: 12px 24px;
        background: linear-gradient(135deg, #cbdfbd 0%, #a8c99c 100%);
        color: #3e5235;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 700;
        font-size: 14px;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(203, 223, 189, 0.4);
      ">← Back to Categories</button>
    </div>
  `;
  
  // Stats cards
  html += `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 30px;">
      <div style="background: linear-gradient(135deg, #cbdfbd 0%, #a8c99c 100%); border-radius: 16px; padding: 25px; color: white; text-align: center; box-shadow: 0 8px 25px rgba(203, 223, 189, 0.3);">
        <div style="font-size: 18px; opacity: 0.9; margin-bottom: 8px; font-weight: 600;">📦 Total Items</div>
        <div style="font-size: 36px; font-weight: 800;">${totalItems}</div>
      </div>
      <div style="background: linear-gradient(135deg, #f6f4d2 0%, #eee9c4 100%); border-radius: 16px; padding: 25px; color: #6b6438; text-align: center; box-shadow: 0 8px 25px rgba(246, 244, 210, 0.3);">
        <div style="font-size: 18px; opacity: 0.9; margin-bottom: 8px; font-weight: 600;">⚠️ Low Stock</div>
        <div style="font-size: 36px; font-weight: 800;">${lowStock}</div>
      </div>
      <div style="background: linear-gradient(135deg, #f19c79 0%, #ed8d68 100%); border-radius: 16px; padding: 25px; color: white; text-align: center; box-shadow: 0 8px 25px rgba(241, 156, 121, 0.3);">
        <div style="font-size: 18px; opacity: 0.9; margin-bottom: 8px; font-weight: 600;">🚫 Out of Stock</div>
        <div style="font-size: 36px; font-weight: 800;">${outOfStock}</div>
      </div>
      <div style="background: linear-gradient(135deg, #d4e09b 0%, #c5d68d 100%); border-radius: 16px; padding: 25px; color: #4a5a2a; text-align: center; box-shadow: 0 8px 25px rgba(212, 224, 155, 0.3);">
        <div style="font-size: 18px; opacity: 0.9; margin-bottom: 8px; font-weight: 600;">💰 Stock Value</div>
        <div style="font-size: 36px; font-weight: 800;">₱${totalValue.toFixed(2)}</div>
      </div>
    </div>
  `;
  
  // Add Product Form
  html += `
    <div style="background: white; border-radius: 16px; padding: 25px; margin-bottom: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 2px solid rgba(93, 83, 74, 0.1);">
      <h3 style="color: #5D534A; margin: 0 0 20px 0; font-size: 1.3rem; font-weight: 700;">➕ Add New Product</h3>
      <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr auto; gap: 15px; align-items: end;">
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 700; color: #5D534A; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Product Name</label>
          <input type="text" id="newProductName" placeholder="e.g. Surf Powder 50g" style="
            width: 100%;
            padding: 14px 16px;
            border: 2px solid rgba(93, 83, 74, 0.2);
            border-radius: 10px;
            font-size: 15px;
            font-weight: 500;
            transition: all 0.3s ease;
          " onfocus="this.style.borderColor='#cbdfbd'; this.style.boxShadow='0 0 0 4px rgba(203, 223, 189, 0.2)';" onblur="this.style.borderColor='rgba(93, 83, 74, 0.2)'; this.style.boxShadow='none';">
        </div>
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 700; color: #5D534A; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Cost (₱)</label>
          <input type="number" id="newProductCost" placeholder="0.00" step="0.01" style="
            width: 100%;
            padding: 14px 16px;
            border: 2px solid rgba(93, 83, 74, 0.2);
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            transition: all 0.3s ease;
          " onfocus="this.style.borderColor='#cbdfbd'; this.style.boxShadow='0 0 0 4px rgba(203, 223, 189, 0.2)';" onblur="this.style.borderColor='rgba(93, 83, 74, 0.2)'; this.style.boxShadow='none';">
        </div>
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 700; color: #5D534A; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Price (₱)</label>
          <input type="number" id="newProductPrice" placeholder="0.00" step="0.01" style="
            width: 100%;
            padding: 14px 16px;
            border: 2px solid rgba(93, 83, 74, 0.2);
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            transition: all 0.3s ease;
          " onfocus="this.style.borderColor='#cbdfbd'; this.style.boxShadow='0 0 0 4px rgba(203, 223, 189, 0.2)';" onblur="this.style.borderColor='rgba(93, 83, 74, 0.2)'; this.style.boxShadow='none';">
        </div>
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 700; color: #5D534A; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Quantity</label>
          <input type="number" id="newProductQty" placeholder="0" style="
            width: 100%;
            padding: 14px 16px;
            border: 2px solid rgba(93, 83, 74, 0.2);
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            transition: all 0.3s ease;
          " onfocus="this.style.borderColor='#cbdfbd'; this.style.boxShadow='0 0 0 4px rgba(203, 223, 189, 0.2)';" onblur="this.style.borderColor='rgba(93, 83, 74, 0.2)'; this.style.boxShadow='none';">
        </div>
        <button id="btnAddProduct" style="
          padding: 14px 28px;
          background: linear-gradient(135deg, #cbdfbd 0%, #a8c99c 100%);
          color: #3e5235;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
          font-size: 14px;
          height: fit-content;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(203, 223, 189, 0.4);
        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(203, 223, 189, 0.5)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(203, 223, 189, 0.4)';">Add Product</button>
      </div>
    </div>
  `;

  html += `
    <div style="background: linear-gradient(135deg, rgba(203, 223, 189, 0.15), rgba(203, 223, 189, 0.08)); border-left: 4px solid #cbdfbd; padding: 20px; margin-bottom: 25px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 32px;">💡</span>
        <div>
          <strong style="color: #5D534A; font-size: 16px;">Pro Tip:</strong>
          <p style="color: #9E9382; margin: 5px 0 0 0; font-size: 14px;">Use the +/- buttons for quick adjustments or type directly into the quantity field. Changes save automatically!</p>
        </div>
      </div>
    </div>
  `;

  // Products Table
  if (products.length === 0) {
    html += `
      <div style="background: white; border-radius: 16px; padding: 60px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <div style="font-size: 80px; margin-bottom: 20px; opacity: 0.3;">${category.icon}</div>
        <h3 style="color: #9E9382; margin-bottom: 10px; font-size: 1.5rem;">No products yet</h3>
        <p style="color: #BDC3C7; font-size: 15px;">Add your first product using the form above!</p>
      </div>
    `;
  } else {
    html += `
      <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <table class="inventory-table-modern">
          <thead>
            <tr>
              <th style="text-align: left;">PRODUCT NAME</th>
              <th>COST PRICE</th>
              <th>SELLING PRICE</th>
              <th>QUANTITY</th>
              <th>STOCK VALUE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
    `;

    products.forEach(product => {
      const cost = parseFloat(product.cost || product.cost_price || 0);
      const price = parseFloat(product.price || product.selling_price || 0);
      const quantity = parseFloat(product.quantity || product.stock || 0);
      const stockClass = quantity === 0 ? 'out-of-stock-modern' : (quantity < 10 ? 'low-stock-modern' : '');
      const stockValue = (cost * quantity).toFixed(2);
      
      html += `
        <tr class="${stockClass}">
          <td style="text-align: left;">
            <strong style="font-size: 15px; color: #5D534A;">${product.name}</strong>
          </td>
          <td><span style="font-size: 16px; font-weight: 700; color: #a44a3f;">₱${cost.toFixed(2)}</span></td>
          <td><span style="font-size: 16px; font-weight: 700; color: #5a7a5e;">₱${price.toFixed(2)}</span></td>
          <td>
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
              <button class="btn-qty-modern" data-product-id="${product.id}" data-action="decrease">−</button>
              <input type="number" class="qty-input-modern" value="${quantity}" data-product-id="${product.id}" style="
                width: 80px;
                padding: 10px;
                text-align: center;
                border: 2px solid rgba(93, 83, 74, 0.2);
                border-radius: 8px;
                font-weight: 700;
                font-size: 16px;
                transition: all 0.3s ease;
              ">
              <button class="btn-qty-modern" data-product-id="${product.id}" data-action="increase">+</button>
            </div>
          </td>
          <td><span style="font-size: 16px; font-weight: 700; color: #5a7a5e;">₱${stockValue}</span></td>
          <td>
            <button class="btn-delete-modern" data-product-id="${product.id}">
              <span style="font-size: 18px;">🗑️</span>
            </button>
          </td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;
  }
  
  html += `
    <style>
      .inventory-table-modern {
        width: 100%;
        border-collapse: collapse;
      }
      .inventory-table-modern th {
        background: linear-gradient(135deg, #cbdfbd 0%, #a8c99c 100%);
        color: #3e5235;
        padding: 20px 15px;
        text-align: center;
        font-weight: 700;
        font-size: 12px;
        letter-spacing: 1.2px;
      }
      .inventory-table-modern td {
        padding: 20px 15px;
        text-align: center;
        border-bottom: 1px solid #F0F0F0;
      }
      .inventory-table-modern tr:hover {
        background: rgba(203, 223, 189, 0.1);
      }
      .low-stock-modern {
        background: rgba(246, 244, 210, 0.5) !important;
        border-left: 5px solid #d4a726 !important;
      }
      .out-of-stock-modern {
        background: rgba(241, 156, 121, 0.15) !important;
        border-left: 5px solid #a44a3f !important;
      }
      .btn-qty-modern {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #cbdfbd 0%, #a8c99c 100%);
        color: #3e5235;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 700;
        font-size: 18px;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(203, 223, 189, 0.3);
      }
      .btn-qty-modern:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(203, 223, 189, 0.5);
      }
      .qty-input-modern:focus {
        outline: none;
        border-color: #cbdfbd !important;
        box-shadow: 0 0 0 4px rgba(203, 223, 189, 0.2);
      }
      .btn-delete-modern {
        padding: 10px 16px;
        background: linear-gradient(135deg, #f19c79 0%, #ed8d68 100%);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.2s ease;
        box-shadow: 0 2px 8px rgba(241, 156, 121, 0.3);
      }
      .btn-delete-modern:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(241, 156, 121, 0.5);
      }
    </style>
  `;
  
  content.innerHTML = html;
  setupInventoryEventListeners(categoryId);
}

// ==================== EVENT LISTENERS ====================

function setupInventoryEventListeners(categoryId) {
  const backBtn = document.getElementById('btnBackToCategories');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      selectedCategory = null;
      renderInventory();
    });
  }

  const addBtn = document.getElementById('btnAddProduct');
  if (addBtn) {
    addBtn.addEventListener('click', () => addNewProduct(categoryId));
  }

  document.querySelectorAll('.qty-input-modern').forEach(input => {
    input.addEventListener('change', function() {
      const productId = parseInt(this.getAttribute('data-product-id'));
      updateQuantity(productId, this.value);
    });
  });

  document.querySelectorAll('.btn-qty-modern').forEach(btn => {
    btn.addEventListener('click', async function() {
      const productId = parseInt(this.getAttribute('data-product-id'));
      const action = this.getAttribute('data-action');
      const products = await DB.getProducts();
      const product = products.find(p => p.id === productId);
      if (product) {
        const qty = parseFloat(product.quantity || product.stock || 0);
        if (action === 'decrease' && qty > 0) {
          await updateQuantity(productId, qty - 1);
        } else if (action === 'increase') {
          await updateQuantity(productId, qty + 1);
        }
      }
    });
  });

  document.querySelectorAll('.btn-delete-modern').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = parseInt(this.getAttribute('data-product-id'));
      deleteProduct(productId);
    });
  });

  ['newProductName', 'newProductCost', 'newProductPrice', 'newProductQty'].forEach(inputId => {
    const input = document.getElementById(inputId);
    if (input) {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addNewProduct(categoryId);
      });
    }
  });
}

// ==================== BUSINESS LOGIC ====================

async function addNewProduct(categoryId) {
  const name = document.getElementById('newProductName').value.trim();
  const cost = parseFloat(document.getElementById('newProductCost').value);
  const price = parseFloat(document.getElementById('newProductPrice').value);
  const quantity = parseInt(document.getElementById('newProductQty').value);

  if (!name) {
   await DialogSystem.alert('Please enter a product name!', '⚠️');
    document.getElementById('newProductName').focus();
    return;
  }

  if (isNaN(cost) || cost < 0) {
   await DialogSystem.alert('Please enter a valid cost price!', '⚠️');
    document.getElementById('newProductCost').focus();
    return;
  }

  if (isNaN(price) || price < 0) {
    await DialogSystem.alert('Please enter a valid selling price!', '⚠️');
    document.getElementById('newProductPrice').focus();
    return;
  }

  if (isNaN(quantity) || quantity < 0) {
   await DialogSystem.alert('Please enter a valid quantity!', '⚠️');
    document.getElementById('newProductQty').focus();
    return;
  }

  if (price < cost) {
const confirmLoss = confirm('⚠️ Warning: Selling price is lower than cost price. Continue?');
if (!confirmLoss) return;
}
try {
const allProducts = await DB.getProducts();
const existingProducts = allProducts.filter(p => (p.category || p.category_id) === categoryId);
const duplicate = existingProducts.find(p => p.name.toLowerCase() === name.toLowerCase());
if (duplicate) {
  const confirmUpdate = confirm(`Product "${name}" already exists. Add to quantity?`);
  if (confirmUpdate) {
    const currentQty = parseFloat(duplicate.quantity || duplicate.stock || 0);
    await DB.updateProduct(duplicate.id, { 
      quantity: currentQty + quantity,
      cost: cost,
      price: price
    });
showModernAlert(`Updated "${name}" - Added ${quantity} units!`, '✅');
  } else {
    return;
  }
} else {
  await DB.addProduct({ name, cost, price, quantity, category: categoryId });
}
// Use DialogSystem if available, otherwise fall back to alert
showModernAlert(`Product "${name}" added successfully!`, '✅');

document.getElementById('newProductName').value = '';
document.getElementById('newProductCost').value = '';
document.getElementById('newProductPrice').value = '';
document.getElementById('newProductQty').value = '';
document.getElementById('newProductName').focus();

await renderInventory();
if (typeof renderPriceList === 'function') await renderPriceList();
} catch (error) {
console.error('Error adding product:', error);
await DialogSystem.alert('Failed to add product. Please try again.', '❌');
}
}
async function updateQuantity(id, newQty) {
const quantity = parseInt(newQty);
if (isNaN(quantity) || quantity < 0) {
alert('⚠️ Invalid quantity!');
await renderInventory();
return;
}
try {
const products = await DB.getProducts();
const product = products.find(p => p.id === id);
if (!product) {
  alert('⚠️ Product not found!');
  return;
}

if (quantity === 0) {
  const confirmZero = confirm(`Set quantity to 0 for "${product.name}"?`);
  if (!confirmZero) {
    await renderInventory();
    return;
  }
}

await DB.updateProduct(id, { 
  name: product.name,
  category: product.category || product.category_id,
  cost: product.cost || product.cost_price,
  price: product.price || product.selling_price,
  quantity: quantity
});
await renderInventory();

if (quantity < 10 && quantity > 0) {
  console.log(`⚠️ Low stock: ${product.name} - ${quantity} units`);
}
} catch (error) {
console.error('Error updating quantity:', error);
alert('❌ Failed to update quantity.');
}
}
async function deleteProduct(id) {
try {
const products = await DB.getProducts();
const product = products.find(p => p.id === id);
if (!product) {
  alert('⚠️ Product not found!');
  return;
}

const qty = parseFloat(product.quantity || product.stock || 0);

const confirmDelete = confirm(
  `Delete "${product.name}"?\nStock: ${qty} units\nThis cannot be undone!`
);

if (confirmDelete) {
  if (qty > 0) {
    const confirmWithStock = confirm(
      `⚠️ WARNING: Product has ${qty} units in stock!\nStill delete?`
    );
    if (!confirmWithStock) return;
  }

  await DB.deleteProduct(id);
  alert(`✓ Product "${product.name}" deleted.`);
  
  await renderInventory();
  if (typeof renderPriceList === 'function') await renderPriceList();
}
} catch (error) {
console.error('Error deleting product:', error);
alert('❌ Failed to delete product.');
}
}
// ==================== EXPORTS ====================
window.addNewProduct = addNewProduct;
window.updateQuantity = updateQuantity;
window.deleteProduct = deleteProduct;
window.CATEGORIES = CATEGORIES;
console.log('✓ Inventory module loaded successfully!');// ==================== CUSTOM MODERN ALERT ====================
function showModernAlert(message, icon = '✅') {
  // Remove existing dialog if any
  const existing = document.getElementById('modernAlertOverlay');
  if (existing) existing.remove();
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'modernAlertOverlay';
  overlay.innerHTML = `
    <div class="modern-alert-box">
      <div class="modern-alert-shimmer"></div>
      <div class="modern-alert-icon-wrapper">
        <div class="modern-alert-icon-ring"></div>
        <span class="modern-alert-icon">${icon}</span>
      </div>
      <h3 class="modern-alert-title">Perfect!</h3>
      <div class="modern-alert-message">${message}</div>
      <button class="modern-alert-btn" onclick="document.getElementById('modernAlertOverlay').remove()">Got it!</button>
    </div>
    <style>
      #modernAlertOverlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(12px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        animation: fadeIn 0.3s ease;
      }
      
      .modern-alert-box {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
        backdrop-filter: blur(20px);
        border-radius: 28px;
        padding: 45px 40px 40px;
        width: 90%;
        max-width: 450px;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25);
        animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        text-align: center;
        position: relative;
        overflow: hidden;
      }
      
      .modern-alert-shimmer {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 8px;
        background: linear-gradient(90deg, #cbdfbd 0%, #a8c99c 25%, #d4e09b 50%, #f3c291 75%, #cbdfbd 100%);
        animation: shimmer 3s linear infinite;
      }
      
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      .modern-alert-icon-wrapper {
        width: 90px;
        height: 90px;
        margin: 0 auto 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: linear-gradient(135deg, #cbdfbd 0%, #a8c99c 100%);
        box-shadow: 0 12px 35px rgba(203, 223, 189, 0.5), 0 0 0 8px rgba(203, 223, 189, 0.15);
        animation: iconBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s backwards;
        position: relative;
      }
      
      .modern-alert-icon-ring {
        position: absolute;
        inset: -8px;
        border-radius: 50%;
        border: 2px solid rgba(203, 223, 189, 0.5);
        animation: rotate 3s linear infinite;
      }
      
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes iconBounce {
        0% { transform: scale(0) rotate(-180deg); opacity: 0; }
        50% { transform: scale(1.15) rotate(10deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
      
      .modern-alert-icon {
        font-size: 52px;
        filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.15));
        animation: pulse 2s ease-in-out infinite;
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      .modern-alert-title {
        font-size: 26px;
        font-weight: 900;
        background: linear-gradient(135deg, #2d3748, #5D534A);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0 0 14px 0;
        letter-spacing: -0.5px;
        animation: slideDown 0.4s ease 0.2s backwards;
      }
      
      .modern-alert-message {
        font-size: 16px;
        line-height: 1.7;
        color: #718096;
        font-weight: 500;
        margin-bottom: 35px;
        animation: slideDown 0.4s ease 0.3s backwards;
      }
      
      .modern-alert-btn {
        width: 100%;
        padding: 18px 28px;
        background: linear-gradient(135deg, #cbdfbd 0%, #a8c99c 100%);
        color: #2d5a3b;
        border: none;
        border-radius: 16px;
        font-weight: 800;
        font-size: 16px;
        cursor: pointer;
        box-shadow: 0 6px 20px rgba(203, 223, 189, 0.5);
        transition: all 0.3s ease;
        animation: slideDown 0.4s ease 0.35s backwards;
      }
      
      .modern-alert-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 30px rgba(203, 223, 189, 0.6);
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { transform: scale(0.8) translateY(30px); opacity: 0; }
        to { transform: scale(1) translateY(0); opacity: 1; }
      }
      
      @keyframes slideDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    </style>
  `;
  
  document.body.appendChild(overlay);
  
  // Auto-close after 3 seconds
  setTimeout(() => {
    if (document.getElementById('modernAlertOverlay')) {
      overlay.remove();
    }
  }, 3000);
}

// Make function globally accessible
window.showModernAlert = showModernAlert;

// ==================== EXPORTS ====================
window.addNewProduct = addNewProduct;
window.updateQuantity = updateQuantity;
window.deleteProduct = deleteProduct;
window.CATEGORIES = CATEGORIES;
console.log('✓ Inventory module loaded successfully!');