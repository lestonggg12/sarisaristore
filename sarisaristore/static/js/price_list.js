// price_list.js - Price Management (Earthy Color Palette)

// price_list.js - Price Management (Earthy Color Palette)

let selectedPriceCategory = null;

if (typeof window.CATEGORIES === 'undefined') {
    window.CATEGORIES = [
        { id: 'beverages', name: 'Beverages', icon: '🥤', color: 'linear-gradient(135deg, #e3b04b 0%, #d19a3d 100%)' },
        { id: 'school', name: 'School Supplies', icon: '📚', color: 'linear-gradient(135deg, #d48c2e 0%, #ba7a26 100%)' },
        { id: 'snacks', name: 'Snacks', icon: '🍿', color: 'linear-gradient(135deg, #a44a3f 0%, #934635 100%)' },
        { id: 'foods', name: 'Whole Foods', icon: '🍚', color: 'linear-gradient(135deg, #d1b18b 0%, #dbbd8c 100%)' },
        { id: 'bath', name: 'Bath, Hygiene & Laundry Soaps', icon: '🧼', color: 'linear-gradient(135deg, #f3c291 0%, #e5b382 100%)' },
        { id: 'wholesale_beverages', name: 'Wholesale Beverages', icon: '📦🥤', color: 'linear-gradient(135deg, #cc8451 0%, #b87545 100%)' },
        { id: 'liquor', name: 'Hard Liquors', icon: '🍺', color: 'linear-gradient(135deg, #e2e8b0 0%, #ced49d 100%)' }
    ];
}

var CATEGORIES = window.CATEGORIES;

window.renderPriceList = async function() {
  const content = document.getElementById('priceListContent');
  
  content.innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <div style="font-size: 48px; animation: spin 1s linear infinite;">⏳</div>
      <p style="color: #666; margin-top: 10px;">Loading price list...</p>
    </div>
    <style>
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    </style>
  `;
  
  try {
    if (!selectedPriceCategory) {
      await renderPriceCategorySelection(content);
    } else {
      await renderCategoryPriceList(content, selectedPriceCategory);
    }
  } catch (error) {
    console.error('❌ Error rendering price list:', error);
    content.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #a44a3f;">
        <h2>⚠️ Error Loading Price List</h2>
        <p>${error.message || 'An unexpected error occurred'}</p>
        <button onclick="renderPriceList()" class="btn-add">Retry</button>
      </div>
    `;
  }
};

async function renderPriceCategorySelection(content) {
  const products = await DB.getProducts();
  
  if (!Array.isArray(products)) {
    throw new Error('Products data is not available');
  }
  
  let html = `
    <div style="text-align: center; margin-bottom: 40px;">
      <h2 style="color: #5D534A; margin-bottom: 8px; font-size: 2rem; font-weight: 800;">💲 Price Management</h2>
      <p style="color: #9E9382; font-size: 16px;">Choose a category to view and update product prices</p>
    </div>
  `;
  
  html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 25px; margin-top: 30px;">';
  
  CATEGORIES.forEach(category => {
    const categoryProducts = products.filter(p => (p.category || p.category_id) === category.id);
    const totalItems = categoryProducts.length;
    
    const avgProfit = categoryProducts.length > 0 
      ? categoryProducts.reduce((sum, p) => {
          const price = parseFloat(p.price || p.selling_price || 0);
          const cost = parseFloat(p.cost || p.cost_price || 0);
          return sum + (price - cost);
        }, 0) / categoryProducts.length 
      : 0;
      
    const lowMargin = categoryProducts.filter(p => {
      const price = parseFloat(p.price || p.selling_price || 0);
      const cost = parseFloat(p.cost || p.cost_price || 0);
      if (cost === 0) return false;
      return ((price - cost) / cost * 100) < 20;
    }).length;
    
    html += `
      <div class="price-category-card-modern" data-category="${category.id}" style="
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
              <div style="font-size: 11px; opacity: 0.95; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Products</div>
            </div>
            <div style="background: rgba(144,238,144,0.3); backdrop-filter: blur(10px); border-radius: 12px; padding: 15px; text-align: center;">
              <div style="font-size: 24px; font-weight: 800; margin-bottom: 5px;">₱${avgProfit.toFixed(2)}</div>
              <div style="font-size: 11px; opacity: 0.95; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Avg Profit</div>
            </div>
            <div style="background: ${lowMargin > 0 ? 'rgba(255,215,0,0.3)' : 'rgba(144,238,144,0.3)'}; backdrop-filter: blur(10px); border-radius: 12px; padding: 15px; text-align: center;">
              <div style="font-size: 28px; font-weight: 800; margin-bottom: 5px;">${lowMargin}</div>
              <div style="font-size: 11px; opacity: 0.95; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Low Margin</div>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  
  html += `
    <style>
      .price-category-card-modern:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(0,0,0,0.25);
      }
      .price-category-card-modern:active {
        transform: translateY(-4px) scale(1.01);
      }
    </style>
  `;
  
  content.innerHTML = html;
  
  document.querySelectorAll('.price-category-card-modern').forEach(card => {
    card.addEventListener('click', function() {
      selectedPriceCategory = this.getAttribute('data-category');
      renderPriceList();
    });
  });
}

async function renderCategoryPriceList(content, categoryId) {
  const category = CATEGORIES.find(c => c.id === categoryId);
  const allProducts = await DB.getProducts();
  
  if (!Array.isArray(allProducts)) {
    throw new Error('Products data is not available');
  }
  
  const products = allProducts.filter(p => (p.category || p.category_id) === categoryId);
  
  const totalItems = products.length;
  const avgProfit = products.length > 0 
    ? products.reduce((sum, p) => {
        const price = parseFloat(p.price || p.selling_price || 0);
        const cost = parseFloat(p.cost || p.cost_price || 0);
        return sum + (price - cost);
      }, 0) / products.length 
    : 0;
    
  const lowMargin = products.filter(p => {
    const price = parseFloat(p.price || p.selling_price || 0);
    const cost = parseFloat(p.cost || p.cost_price || 0);
    if (cost === 0) return false;
    return ((price - cost) / cost * 100) < 20;
  }).length;
  
  const highMargin = products.filter(p => {
    const price = parseFloat(p.price || p.selling_price || 0);
    const cost = parseFloat(p.cost || p.cost_price || 0);
    if (cost === 0) return false;
    return ((price - cost) / cost * 100) > 50;
  }).length;

  let html = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px;">
      <div>
        <h2 style="color: #5D534A; margin: 0; font-size: 1.8rem; font-weight: 800;">${category.icon} ${category.name}</h2>
        <p style="color: #9E9382; margin: 5px 0 0 0; font-size: 14px;">Update product prices and monitor profit margins</p>
      </div>
      <button id="btnBackToPriceCategories" style="
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
  
  html += `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 30px;">
      <div style="background: linear-gradient(135deg, #cbdfbd 0%, #a8c99c 100%); border-radius: 16px; padding: 25px; color: white; text-align: center; box-shadow: 0 8px 25px rgba(203, 223, 189, 0.3);">
        <div style="font-size: 18px; opacity: 0.9; margin-bottom: 8px; font-weight: 600;">📦 Total Products</div>
        <div style="font-size: 36px; font-weight: 800;">${totalItems}</div>
      </div>
      <div style="background: linear-gradient(135deg, #d4e09b 0%, #c5d68d 100%); border-radius: 16px; padding: 25px; color: #4a5a2a; text-align: center; box-shadow: 0 8px 25px rgba(212, 224, 155, 0.3);">
        <div style="font-size: 18px; opacity: 0.9; margin-bottom: 8px; font-weight: 600;">💰 Avg Profit</div>
        <div style="font-size: 36px; font-weight: 800;">₱${avgProfit.toFixed(2)}</div>
      </div>
      <div style="background: linear-gradient(135deg, #f6f4d2 0%, #eee9c4 100%); border-radius: 16px; padding: 25px; color: #6b6438; text-align: center; box-shadow: 0 8px 25px rgba(246, 244, 210, 0.3);">
        <div style="font-size: 18px; opacity: 0.9; margin-bottom: 8px; font-weight: 600;">⚠️ Low Margin</div>
        <div style="font-size: 36px; font-weight: 800;">${lowMargin}</div>
      </div>
      <div style="background: linear-gradient(135deg, #cbdfbd 0%, #a8c99c 100%); border-radius: 16px; padding: 25px; color: white; text-align: center; box-shadow: 0 8px 25px rgba(203, 223, 189, 0.3);">
        <div style="font-size: 18px; opacity: 0.9; margin-bottom: 8px; font-weight: 600;">✨ High Margin</div>
        <div style="font-size: 36px; font-weight: 800;">${highMargin}</div>
      </div>
    </div>
  `;
  
  html += `
    <div style="background: linear-gradient(135deg, rgba(203, 223, 189, 0.15), rgba(203, 223, 189, 0.08)); border-left: 4px solid #cbdfbd; padding: 20px; margin-bottom: 25px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 32px;">💡</span>
        <div>
          <strong style="color: #5D534A; font-size: 16px;">Pro Tip:</strong>
          <p style="color: #9E9382; margin: 5px 0 0 0; font-size: 14px;">Click on any price field to edit. Changes save automatically. Keep margins healthy for better profits!</p>
        </div>
      </div>
    </div>
  `;

  if (products.length === 0) {
    html += `
      <div style="background: white; border-radius: 16px; padding: 60px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <div style="font-size: 80px; margin-bottom: 20px; opacity: 0.3;">${category.icon}</div>
        <h3 style="color: #9E9382; margin-bottom: 10px; font-size: 1.5rem;">No products in this category</h3>
        <p style="color: #BDC3C7; font-size: 15px;">Add products in the Inventory page first!</p>
      </div>
    `;
  } else {
    html += `
      <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <table class="price-table-modern">
          <thead>
            <tr>
              <th style="text-align: left;">PRODUCT NAME</th>
              <th>COST PRICE</th>
              <th>SELLING PRICE</th>
              <th>PROFIT/UNIT</th>
              <th>MARGIN %</th>
              <th>STOCK</th>
            </tr>
          </thead>
          <tbody>
    `;

    products.forEach(product => {
      const cost = parseFloat(product.cost || product.cost_price || 0);
      const price = parseFloat(product.price || product.selling_price || 0);
      const quantity = parseFloat(product.quantity || product.stock || 0);
      
      const profit = price - cost;
      const margin = cost > 0 ? ((profit / cost) * 100) : 0;
      const stockClass = quantity === 0 ? 'out-of-stock-modern' : (quantity < 10 ? 'low-stock-modern' : '');
      const profitColor = profit > 0 ? '#5a7a5e' : '#a44a3f';
      const marginBg = margin < 20 ? 'linear-gradient(135deg, #f6f4d2 0%, #eee9c4 100%)' : 
                       (margin > 50 ? 'linear-gradient(135deg, #cbdfbd 0%, #a8c99c 100%)' : 
                       'linear-gradient(135deg, #d4e09b 0%, #c5d68d 100%)');

      html += `
        <tr class="${stockClass}">
          <td style="text-align: left;">
            <strong style="font-size: 15px; color: #5D534A;">${product.name}</strong>
          </td>
          <td>
            <input type="number" 
                   value="${cost.toFixed(2)}" 
                   class="price-input-modern cost-input"
                   data-product-id="${product.id}"
                   step="0.01"
                   min="0"
                   style="background: rgba(241, 156, 121, 0.15); border: 2px solid #f19c79;">
          </td>
          <td>
            <input type="number" 
                   value="${price.toFixed(2)}" 
                   class="price-input-modern sell-input"
                   data-product-id="${product.id}"
                   step="0.01"
                   min="0"
                   style="background: rgba(203, 223, 189, 0.2); border: 2px solid #cbdfbd;">
          </td>
          <td>
            <div style="display: inline-block; padding: 8px 16px; background: ${profit > 0 ? 'rgba(203, 223, 189, 0.2)' : 'rgba(241, 156, 121, 0.15)'}; border-radius: 8px; font-weight: 700; font-size: 15px; color: ${profitColor};">
              ₱${profit.toFixed(2)}
            </div>
          </td>
          <td>
            <div style="display: inline-block; padding: 8px 16px; background: ${marginBg}; border-radius: 8px; font-weight: 700; font-size: 15px; color: ${margin < 20 ? '#6b6438' : (margin > 50 ? '#3e5235' : '#4a5a2a')}; min-width: 70px;">
              ${margin.toFixed(1)}%
            </div>
          </td>
          <td>
            <span style="font-size: 16px; font-weight: 600; color: #9E9382;">${quantity} units</span>
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
      .price-table-modern {
        width: 100%;
        border-collapse: collapse;
      }
      .price-table-modern th {
        background: linear-gradient(135deg, #cbdfbd 0%, #a8c99c 100%);
        color: #3e5235;
        padding: 20px 15px;
        text-align: center;
        font-weight: 700;
        font-size: 12px;
        letter-spacing: 1.2px;
      }
      .price-table-modern td {
        padding: 20px 15px;
        text-align: center;
        border-bottom: 1px solid #F0F0F0;
      }
      .price-table-modern tr:hover {
        background: rgba(203, 223, 189, 0.1);
      }
      .price-input-modern {
        width: 110px;
        padding: 12px 16px;
        text-align: center;
        border-radius: 10px;
        font-weight: 700;
        font-size: 16px;
        transition: all 0.3s ease;
      }
      .price-input-modern:focus {
        outline: none;
        transform: scale(1.05);
        box-shadow: 0 0 0 4px rgba(203, 223, 189, 0.2);
      }
      .cost-input:hover {
        border-color: #ed8d68 !important;
      }
      .sell-input:hover {
        border-color: #a8c99c !important;
      }
      .low-stock-modern {
        background: rgba(246, 244, 210, 0.5) !important;
        border-left: 5px solid #d4a726 !important;
      }
      .out-of-stock-modern {
        background: rgba(241, 156, 121, 0.15) !important;
        border-left: 5px solid #a44a3f !important;
      }
    </style>
  `;

  content.innerHTML = html;

  const backBtn = document.getElementById('btnBackToPriceCategories');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      selectedPriceCategory = null;
      renderPriceList();
    });
  }

  document.querySelectorAll('.cost-input').forEach(input => {
    input.addEventListener('change', function() {
      const productId = parseInt(this.getAttribute('data-product-id'));
      updatePrice(productId, 'cost', this.value);
    });
    input.addEventListener('focus', function() { this.select(); });
  });

  document.querySelectorAll('.sell-input').forEach(input => {
    input.addEventListener('change', function() {
      const productId = parseInt(this.getAttribute('data-product-id'));
      updatePrice(productId, 'price', this.value);
    });
    input.addEventListener('focus', function() { this.select(); });
  });
}

async function updatePrice(id, field, newValue) {
  const value = parseFloat(newValue);
  
  if (isNaN(value) || value < 0) {
    alert('⚠️ Invalid price! Must be 0 or greater.');
    await renderPriceList();
    return;
  }

  try {
    const products = await DB.getProducts();
    const product = products.find(p => p.id === id);
    
    if (!product) {
      alert('⚠️ Product not found!');
      return;
    }

    const cost = parseFloat(product.cost || product.cost_price || 0);
    const price = parseFloat(product.price || product.selling_price || 0);

    const update = {};
    update[field] = value;
    
    if (field === 'price' && value < cost) {
      const confirmLoss = confirm(
        `⚠️ Warning: Selling price (₱${value.toFixed(2)}) is lower than cost price (₱${cost.toFixed(2)}).\n\n` +
        `This will result in a loss of ₱${(cost - value).toFixed(2)} per unit.\n\nContinue anyway?`
      );
      if (!confirmLoss) {
        await renderPriceList();
        return;
      }
    }
    
    if (field === 'cost' && value > price) {
      const confirmLoss = confirm(
        `⚠️ Warning: Cost price (₱${value.toFixed(2)}) is higher than selling price (₱${price.toFixed(2)}).\n\n` +
        `This will result in a loss of ₱${(value - price).toFixed(2)} per unit.\n\nContinue anyway?`
      );
      if (!confirmLoss) {
        await renderPriceList();
        return;
      }
    }

    await DB.updateProduct(id, update);
    
    const fieldName = field === 'cost' ? 'Cost' : 'Selling';
    console.log(`✓ ${fieldName} price updated for ${product.name}: ₱${value.toFixed(2)}`);
    
    await renderPriceList();
    
    if (typeof renderProfit === 'function') {
      await renderProfit();
    }
  } catch (error) {
    console.error('Error updating price:', error);
    alert('❌ Failed to update price. Please try again.');
  }
}

window.updatePrice = updatePrice;
window.selectedPriceCategory = selectedPriceCategory;