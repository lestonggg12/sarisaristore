// profit.js - Modern Card Layout with Integrated Revenue/Profit

console.log('💰 Loading profit module...');

// Enhanced DialogSystem with alert and confirm methods
const DialogSystem = {
    alert: async function(message, icon = 'ℹ️') {
        return new Promise((resolve) => {
            const formattedMessage = `${icon} ${message}`;
            alert(formattedMessage);
            resolve(true);
        });
    },
    
    confirm: async function(message, icon = '⚠️') {
        return new Promise((resolve) => {
            const formattedMessage = `${icon} ${message}`;
            const result = confirm(formattedMessage);
            resolve(result);
        });
    },
    
    clearTransactionHistory: function() {
        if (confirm('Are you sure you want to clear transaction history?')) {
            localStorage.removeItem('transactionHistory');
            return true;
        }
        return false;
    }
};

// Custom modern confirm function
function showModernConfirm(message, icon = '⚠️') {
  return new Promise((resolve) => {
    const existing = document.getElementById('modernConfirmOverlay');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'modernConfirmOverlay';
    overlay.innerHTML = `
      <div class="modern-confirm-box">
        <div class="modern-confirm-shimmer"></div>
        <div class="modern-confirm-icon-wrapper">
          <div class="modern-confirm-icon-ring"></div>
          <span class="modern-confirm-icon">${icon}</span>
        </div>
        <h3 class="modern-confirm-title">Confirm Action</h3>
        <div class="modern-confirm-message">${message.replace(/\n/g, '<br>')}</div>
        <div class="modern-confirm-buttons">
          <button class="modern-confirm-btn modern-confirm-btn-danger" id="confirmYesBtn">Yes, Delete</button>
          <button class="modern-confirm-btn modern-confirm-btn-cancel" id="confirmNoBtn">Cancel</button>
        </div>
      </div>
      <style>
        #modernConfirmOverlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(12px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 99999;
          animation: fadeIn 0.3s ease;
        }
        
        .modern-confirm-box {
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
        
        body.dark-mode .modern-confirm-box {
          background: linear-gradient(135deg, rgba(45, 55, 72, 0.95), rgba(45, 55, 72, 0.9));
        }
        
        .modern-confirm-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 8px;
          background: linear-gradient(90deg, #EF4444 0%, #DC2626 25%, #B91C1C 50%, #DC2626 75%, #EF4444 100%);
          animation: shimmer 3s linear infinite;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .modern-confirm-icon-wrapper {
          width: 90px;
          height: 90px;
          margin: 0 auto 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
          box-shadow: 0 12px 35px rgba(239, 68, 68, 0.3), 0 0 0 8px rgba(239, 68, 68, 0.15);
          animation: iconBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s backwards;
          position: relative;
        }
        
        .modern-confirm-icon-ring {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 2px solid rgba(239, 68, 68, 0.5);
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
        
        .modern-confirm-icon {
          font-size: 52px;
          filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.15));
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .modern-confirm-title {
          font-size: 26px;
          font-weight: 900;
          background: linear-gradient(135deg, #2d3748, #5D534A);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 14px 0;
          letter-spacing: -0.5px;
          animation: slideDown 0.4s ease 0.2s backwards;
        }
        
        body.dark-mode .modern-confirm-title {
          background: linear-gradient(135deg, #f7fafc, #cbd5e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .modern-confirm-message {
          font-size: 16px;
          line-height: 1.7;
          color: #718096;
          font-weight: 500;
          margin-bottom: 35px;
          animation: slideDown 0.4s ease 0.3s backwards;
        }
        
        body.dark-mode .modern-confirm-message {
          color: #cbd5e0;
        }
        
        .modern-confirm-buttons {
          display: flex;
          flex-direction: column;
          gap: 14px;
          animation: slideDown 0.4s ease 0.35s backwards;
        }
        
        .modern-confirm-btn {
          width: 100%;
          padding: 18px 28px;
          border: none;
          border-radius: 16px;
          font-weight: 800;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .modern-confirm-btn-danger {
          background: linear-gradient(135deg, #EF4444, #DC2626);
          color: white;
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }
        
        .modern-confirm-btn-danger:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(239, 68, 68, 0.5);
        }
        
        .modern-confirm-btn-cancel {
          background: rgba(247, 250, 252, 0.8);
          color: #718096;
          border: 2px solid rgba(226, 232, 240, 0.8);
        }
        
        .modern-confirm-btn-cancel:hover {
          background: rgba(237, 242, 247, 0.9);
          color: #4a5568;
          transform: translateY(-2px);
        }
        
        body.dark-mode .modern-confirm-btn-cancel {
          background: rgba(74, 85, 104, 0.5);
          color: #cbd5e0;
          border-color: rgba(74, 85, 104, 0.8);
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
    
    document.getElementById('confirmYesBtn').onclick = () => {
      overlay.remove();
      resolve(true);
    };
    
    document.getElementById('confirmNoBtn').onclick = () => {
      overlay.remove();
      resolve(false);
    };
  });
}

window.showModernConfirm = showModernConfirm;

// Custom modern alert function
function showModernAlert(message, icon = '✅') {
  const existing = document.getElementById('modernAlertOverlay');
  if (existing) existing.remove();
  
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
      <div class="modern-alert-message">${message.replace(/\n/g, '<br>')}</div>
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
      
      body.dark-mode .modern-alert-box {
        background: linear-gradient(135deg, rgba(45, 55, 72, 0.95), rgba(45, 55, 72, 0.9));
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
      
      .modern-alert-icon {
        font-size: 52px;
        filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.15));
        animation: pulse 2s ease-in-out infinite;
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
      
      body.dark-mode .modern-alert-title {
        background: linear-gradient(135deg, #f7fafc, #cbd5e0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      
      .modern-alert-message {
        font-size: 16px;
        line-height: 1.7;
        color: #718096;
        font-weight: 500;
        margin-bottom: 35px;
        animation: slideDown 0.4s ease 0.3s backwards;
      }
      
      body.dark-mode .modern-alert-message {
        color: #cbd5e0;
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
    </style>
  `;
  
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    if (document.getElementById('modernAlertOverlay')) {
      overlay.remove();
    }
  }, 3000);
}

window.showModernAlert = showModernAlert;

async function renderProfit() {
  const content = document.getElementById('profitContent');
  
  content.innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <div style="font-size: 48px; animation: spin 1s linear infinite;">⏳</div>
      <p style="color: #666; margin-top: 10px;">Loading sales data...</p>
    </div>
    <style>
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    </style>
  `;

  try {
    const sales = await DB.getSales();
    const products = await DB.getProducts();
    // Get accumulated totals from database
    const accumulated = await DB.getAccumulatedTotals();

    if (!Array.isArray(sales)) {
      throw new Error('Sales data is not available');
    }

    if (!Array.isArray(products)) {
      throw new Error('Products data is not available');
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const periods = {
      today: { revenue: 0, profit: 0, count: 0 },
      yesterday: { revenue: 0, profit: 0, count: 0 },
      week: { revenue: 0, profit: 0, count: 0 },
      month: { revenue: 0, profit: 0, count: 0 },
      year: { revenue: 0, profit: 0, count: 0 }
    };

    sales.forEach(sale => {
      const saleDate = new Date(sale.date || sale.created_at);
      const total = parseFloat(sale.total) || 0;
      const profit = parseFloat(sale.profit || sale.total_profit) || 0;
      
      if (saleDate >= todayStart) {
        periods.today.revenue += total;
        periods.today.profit += profit;
        periods.today.count++;
      }
      
      if (saleDate >= yesterdayStart && saleDate < todayStart) {
        periods.yesterday.revenue += total;
        periods.yesterday.profit += profit;
        periods.yesterday.count++;
      }
      
      if (saleDate >= weekStart) {
        periods.week.revenue += total;
        periods.week.profit += profit;
        periods.week.count++;
      }
      
      if (saleDate >= monthStart) {
        periods.month.revenue += total;
        periods.month.profit += profit;
        periods.month.count++;
      }
      
      if (saleDate >= yearStart) {
        periods.year.revenue += total;
        periods.year.profit += profit;
        periods.year.count++;
      }
    });

    // ADD accumulated totals to ALL periods including today and yesterday
periods.today.revenue += accumulated.revenue;
periods.today.profit += accumulated.profit;
periods.yesterday.revenue += accumulated.revenue;
periods.yesterday.profit += accumulated.profit;
periods.week.revenue += accumulated.revenue;
periods.week.profit += accumulated.profit;
periods.month.revenue += accumulated.revenue;
periods.month.profit += accumulated.profit;
periods.year.revenue += accumulated.revenue;
periods.year.profit += accumulated.profit;

    let potentialProfit = 0;
    products.forEach(product => {
      const price = parseFloat(product.price || product.selling_price) || 0;
      const cost = parseFloat(product.cost || product.cost_price) || 0;
      const quantity = parseFloat(product.quantity || product.stock) || 0;
      potentialProfit += (price - cost) * quantity;
    });

    let html = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: var(--text-primary, #5D534A); margin-bottom: 8px; font-size: 1.8rem;">📊 Sales Performance</h2>
        <p style="color: var(--text-secondary, #9E9382); font-size: 14px;">Sales automatically reset at midnight (12:00 AM)</p>
      </div>

      <!-- TODAY'S SALES -->
      <div class="period-section">
        <h3 style="color: var(--text-primary, #5D534A); margin-bottom: 20px; font-size: 1.2rem; font-weight: 700;">💰 Today's Sales</h3>
        <div class="profit-summary">
          <div class="profit-card today">
            <h3>🍃 TODAY'S PERFORMANCE</h3>
            <div class="profit-card-revenue">
              <div class="profit-card-label">Revenue</div>
              <div class="profit-amount">₱${periods.today.revenue.toFixed(2)}</div>
              <small>${periods.today.count} ${periods.today.count === 1 ? 'sale' : 'sales'} today</small>
            </div>
            <div class="profit-card-profit">
              <div class="profit-card-profit-label">Profit Earned</div>
              <div class="profit-card-profit-amount">₱${periods.today.profit.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- YESTERDAY'S SALES -->
      <div class="period-section">
        <h3 style="color: var(--text-primary, #5D534A); margin: 30px 0 20px 0; font-size: 1.2rem; font-weight: 700;">📅 Yesterday's Sales</h3>
        <div class="profit-summary">
          <div class="profit-card yesterday">
            <h3>🍂 YESTERDAY'S PERFORMANCE</h3>
            <div class="profit-card-revenue">
              <div class="profit-card-label">Revenue</div>
              <div class="profit-amount">₱${periods.yesterday.revenue.toFixed(2)}</div>
              <small>${periods.yesterday.count} ${periods.yesterday.count === 1 ? 'sale' : 'sales'} yesterday</small>
            </div>
            <div class="profit-card-profit">
              <div class="profit-card-profit-label">Profit Earned</div>
              <div class="profit-card-profit-amount">₱${periods.yesterday.profit.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- THIS WEEK'S SALES -->
      <div class="period-section">
        <h3 style="color: var(--text-primary, #5D534A); margin: 30px 0 20px 0; font-size: 1.2rem; font-weight: 700;">📊 This Week's Sales</h3>
        <div class="profit-summary">
          <div class="profit-card week">
            <h3>🌿 WEEKLY PERFORMANCE</h3>
            <div class="profit-card-revenue">
              <div class="profit-card-label">Revenue (including history)</div>
              <div class="profit-amount">₱${periods.week.revenue.toFixed(2)}</div>
              <small>${periods.week.count} ${periods.week.count === 1 ? 'sale' : 'sales'} this week</small>
            </div>
            <div class="profit-card-profit">
              <div class="profit-card-profit-label">Profit Earned</div>
              <div class="profit-card-profit-amount">₱${periods.week.profit.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- THIS MONTH'S SALES -->
      <div class="period-section">
        <h3 style="color: var(--text-primary, #5D534A); margin: 30px 0 20px 0; font-size: 1.2rem; font-weight: 700;">📆 This Month's Sales</h3>
        <div class="profit-summary">
          <div class="profit-card month">
            <h3>🍁 MONTHLY PERFORMANCE</h3>
            <div class="profit-card-revenue">
              <div class="profit-card-label">Revenue (including history)</div>
              <div class="profit-amount">₱${periods.month.revenue.toFixed(2)}</div>
              <small>${periods.month.count} ${periods.month.count === 1 ? 'sale' : 'sales'} this month</small>
            </div>
            <div class="profit-card-profit">
              <div class="profit-card-profit-label">Profit Earned</div>
              <div class="profit-card-profit-amount">₱${periods.month.profit.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- THIS YEAR'S SALES -->
      <div class="period-section">
        <h3 style="color: var(--text-primary, #5D534A); margin: 30px 0 20px 0; font-size: 1.2rem; font-weight: 700;">📈 This Year's Sales</h3>
        <div class="profit-summary">
          <div class="profit-card year">
            <h3>🍂 YEARLY PERFORMANCE</h3>
            <div class="profit-card-revenue">
              <div class="profit-card-label">Revenue (including history)</div>
              <div class="profit-amount">₱${periods.year.revenue.toFixed(2)}</div>
              <small>${periods.year.count} ${periods.year.count === 1 ? 'sale' : 'sales'} this year</small>
            </div>
            <div class="profit-card-profit">
              <div class="profit-card-profit-label">Profit Earned</div>
              <div class="profit-card-profit-amount">₱${periods.year.profit.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- POTENTIAL PROFIT -->
      <div class="period-section">
        <h3 style="color: var(--text-primary, #5D534A); margin: 30px 0 20px 0; font-size: 1.2rem; font-weight: 700;">💎 Potential Profit</h3>
        <div class="profit-summary">
          <div class="profit-card potential">
            <h3>💎 INVENTORY VALUE</h3>
            <div class="profit-card-revenue">
              <div class="profit-card-label" style="color: white !important;">Potential Profit from Current Stock</div>
              <div class="profit-amount">₱${potentialProfit.toFixed(2)}</div>
              <small style="color: white !important;">if all inventory sells at current prices</small>
            </div>
          </div>
        </div>
      </div>

      <div class="recent-sales-section" style="margin-top: 50px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
          <h3 style="margin: 0; color: var(--text-primary, #5D534A); font-size: 1.2rem; font-weight: 700;">📝 Recent Sales</h3>
          ${sales.length > 0 ? `
            <button class="btn-clear-history" id="btnClearHistory" style="background: linear-gradient(135deg, #EF4444, #DC2626) !important; color: white !important;">
              🗑️ Clear Transaction History
            </button>
          ` : ''}
        </div>
        ${renderRecentSales(sales.slice(-10).reverse())}
      </div>
    `;

    content.innerHTML = html;
    
    const clearBtn = document.getElementById('btnClearHistory');
    if (clearBtn) {
      clearBtn.addEventListener('click', clearTransactionHistory);
    }
    
    setupMidnightRefresh();
    
  } catch (error) {
    console.error('❌ Error rendering profit page:', error);
    content.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #DC2626;">
        <h2>⚠️ Error Loading Data</h2>
        <p>${error.message}</p>
        <button onclick="renderProfit()" style="padding: 12px 24px; background: #87B382; color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 700; margin-top: 15px;">Retry</button>
      </div>
    `;
  }
}

function renderRecentSales(recentSales) {
  if (!Array.isArray(recentSales) || recentSales.length === 0) {
    return `
      <div style="text-align: center; padding: 60px 20px; background: #F8F7F4; border-radius: 20px;">
        <h3 style="font-size: 24px; margin-bottom: 10px; color: #5D534A;">📭 No Sales Yet</h3>
        <p style="font-size: 16px; margin: 0; color: #9E9382;">Start making sales to see them here!</p>
      </div>
    `;
  }

  let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px;">';

  recentSales.forEach(sale => {
    const date = new Date(sale.date || sale.created_at);
    const formattedDate = date.toLocaleDateString('en-PH', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-PH', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
    
    let itemsList = 'N/A';
    try {
      const items = Array.isArray(sale.items) ? sale.items : 
                    typeof sale.items === 'string' ? JSON.parse(sale.items) : [];
      itemsList = items.map(i => `${i.name || i.product_name || 'Item'} (×${i.quantity})`).join(', ');
    } catch (e) {
      console.error('Error parsing sale items:', e);
    }
    
    const total = parseFloat(sale.total) || 0;
    const profit = parseFloat(sale.profit || sale.total_profit) || 0;
    const paymentMethod = sale.paymentType || sale.payment_method || 'cash';
    
    let badgeStyle = 'background: linear-gradient(135deg, #10B981, #34D399);';
    if (paymentMethod.toLowerCase() === 'gcash') {
      badgeStyle = 'background: linear-gradient(135deg, #3B82F6, #60A5FA);';
    } else if (paymentMethod.toLowerCase() === 'credit') {badgeStyle = 'background: linear-gradient(135deg, #F59E0B, #FBBF24);';
}html += `
  <div class="sale-card">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; padding-bottom: 12px; border-bottom: 2px solid #F0EAE0;">
      <div>
        <div style="font-size: 16px; font-weight: 700; color: #5D534A;">${formattedDate}</div>
        <div style="font-size: 13px; color: #9E9382; margin-top: 2px;">${formattedTime}</div>
      </div>
      <span style="padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: white; ${badgeStyle}">${paymentMethod}</span>
    </div><div style="margin-bottom: 15px;">
      <div style="font-size: 12px; color: #9E9382; text-transform: uppercase; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.5px;">Items Purchased</div>
      <div style="font-size: 14px; color: #5D534A; line-height: 1.6;">${itemsList}</div>
    </div><div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 2px solid #F0EAE0;">
      <div>
        <div style="font-size: 11px; color: #9E9382; text-transform: uppercase; font-weight: 600; margin-bottom: 4px; letter-spacing: 0.5px;">Total</div>
        <div style="font-size: 20px; font-weight: 700; color: #5D534A;">₱${total.toFixed(2)}</div>
      </div>
      <div>
        <div style="font-size: 11px; color: #9E9382; text-transform: uppercase; font-weight: 600; margin-bottom: 4px; letter-spacing: 0.5px;">Profit</div>
        <div style="font-size: 20px; font-weight: 700; color: #059669;">₱${profit.toFixed(2)}</div>
      </div>
    </div>
  </div>
`;});
html += '</div>';
return html;
}
function setupMidnightRefresh() {
const now = new Date();
const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
const msUntilMidnight = tomorrow - now;
if (window.midnightTimeout) {
clearTimeout(window.midnightTimeout);
}
window.midnightTimeout = setTimeout(() => {
console.log('🕛 Midnight! Refreshing sales data...');
const profitPage = document.getElementById('profitPage');
if (profitPage && profitPage.classList.contains('active-page')) {
renderProfit();
}
setupMidnightRefresh();
}, msUntilMidnight);
console.log(`⏰ Auto-refresh in ${Math.round(msUntilMidnight / 1000 / 60)} minutes`);
}
async function clearTransactionHistory() {
  try {
    const sales = await DB.getSales();
    
    if (!Array.isArray(sales) || sales.length === 0) {
      showModernAlert('No transactions to clear.', 'ℹ️');
      return;
    }
    
    const confirmClear = await showModernConfirm(
      `Clear ${sales.length} transaction record${sales.length === 1 ? '' : 's'}?<br><br><strong>Revenue and profit totals will be preserved.</strong>`,
      '⚠️'
    );
    
    if (!confirmClear) return;
    
    const doubleConfirm = await showModernConfirm(
      `<strong>FINAL CONFIRMATION</strong><br><br>Clear transaction history?<br><br>Sales totals will remain visible, only the detailed transaction list will be cleared.`,
      '🚨'
    );
    
    if (doubleConfirm) {
      // Calculate totals from current sales BEFORE clearing
      const totalProfit = sales.reduce((sum, s) => sum + (parseFloat(s.profit || s.total_profit) || 0), 0);
      const totalRevenue = sales.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0);
      
      // Get existing accumulated totals from database
      const accumulated = await DB.getAccumulatedTotals();
      
      // Add current sales to accumulated totals (preserve them)
      const newAccumulatedRevenue = accumulated.revenue + totalRevenue;
      const newAccumulatedProfit = accumulated.profit + totalProfit;
      
      console.log(`💾 Preserving Revenue: ₱${newAccumulatedRevenue.toFixed(2)}`);
      console.log(`💾 Preserving Profit: ₱${newAccumulatedProfit.toFixed(2)}`);
      
      // Update accumulated totals in database FIRST (preserve the totals)
      await DB.updateAccumulatedTotals(newAccumulatedRevenue, newAccumulatedProfit);
      
      // Then clear the sales transaction records from database
      await DB.clearAllSales();
      
      showModernAlert(
        `Transaction history cleared!<br><br>` +
        `${sales.length} transaction records removed<br>` +
        `<strong>Totals preserved:</strong><br>` +
        `Revenue: ₱${newAccumulatedRevenue.toFixed(2)}<br>` +
        `Profit: ₱${newAccumulatedProfit.toFixed(2)}<br><br>` +
        `These totals remain visible in Today's and Yesterday's Sales.`,
        '✅'
      );
      
      await renderProfit();
    }
  } catch (error) {
    console.error('Error clearing transaction history:', error);
    showModernAlert('An error occurred while clearing transaction history.', '❌');
  }
}
window.renderProfit = renderProfit;
window.clearTransactionHistory = clearTransactionHistory;
window.setupMidnightRefresh = setupMidnightRefresh;
console.log('✓ Profit module loaded!');