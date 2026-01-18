// DEBTORS MANAGEMENT - REDESIGNED WITH BEAUTIFUL UI

window.renderDebtors = async function() {
  const content = document.getElementById('debtorsContent');
  
  content.innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <div style="font-size: 48px; animation: spin 1s linear infinite;">⏳</div>
      <p style="color: #666; margin-top: 10px;">Loading debtors...</p>
    </div>
    <style>
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    </style>
  `;

  try {
    const debtors = await DB.getDebtors();
    
    if (!Array.isArray(debtors)) {
      throw new Error('Debtors data is not available');
    }

    const unpaidDebtors = debtors.filter(d => !d.paid);
    const paidDebtors = debtors.filter(d => d.paid);

    let totalDebt = 0;
    unpaidDebtors.forEach(d => totalDebt += parseFloat(d.amount || d.total_debt || 0));

    let html = `
      <!-- Summary Cards Section -->
      <div class="debtors-summary-cards">
        <div class="summary-card debt-card-red">
          <div class="card-icon">💰</div>
          <div class="card-content">
            <div class="card-label">TOTAL OUTSTANDING</div>
            <div class="card-value">₱${totalDebt.toFixed(2)}</div>
          </div>
        </div>
        
        <div class="summary-card debt-card-amber">
          <div class="card-icon">⚠️</div>
          <div class="card-content">
            <div class="card-label">UNPAID DEBTORS</div>
            <div class="card-value">${unpaidDebtors.length}</div>
          </div>
        </div>
        
        <div class="summary-card debt-card-green">
          <div class="card-icon">✅</div>
          <div class="card-content">
            <div class="card-label">PAID DEBTORS</div>
            <div class="card-value">${paidDebtors.length}</div>
          </div>
        </div>
      </div>

      <!-- Add New Debtor Section -->
      <div class="add-debtor-section">
        <h3 class="section-header">➕ Add New Debtor</h3>
        <div class="add-debtor-form">
          <div class="input-with-icon">
            <span class="input-icon">👤</span>
            <input type="text" id="debtorCustomerName" placeholder="Customer Name" class="modern-input">
          </div>
          <button class="modern-btn btn-primary" id="btnShowProductSelector">
            <span class="btn-icon">🛒</span>
            <span>Select Products to Loan</span>
          </button>
        </div>
        
        <!-- Product Selector (Hidden by default) -->
        <div id="productSelector" class="product-selector-panel" style="display: none;">
          <div class="selector-header">
            <h4>📦 Select Products</h4>
            <button class="btn-close" id="btnCancelDebtor">✕</button>
          </div>
          
          <div class="product-search-container">
            <span class="search-icon">🔍</span>
            <input type="text" id="productSearchInput" placeholder="Search products..." class="search-input">
            <button class="btn-clear-search" id="btnClearSearch" style="display: none;">✕</button>
          </div>
          
          <div id="productList" class="product-grid"></div>
          
          <div class="loan-summary-panel">
            <div class="loan-total-display">
              <span class="total-label">Total Loan Amount:</span>
              <span class="total-amount">₱<span id="loanTotal">0.00</span></span>
            </div>
            <div class="action-buttons">
              <button class="modern-btn btn-success" id="btnAddDebtor">
                <span class="btn-icon">✓</span>
                <span>Add Debtor</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Unpaid Debts Section -->
      <div class="debts-section">
        <h3 class="section-header unpaid-header">📋 Unpaid Debts</h3>
        ${renderDebtorsCards(unpaidDebtors, false)}
      </div>

      <!-- Paid Debts Section -->
      <div class="debts-section">
        <h3 class="section-header paid-header">✅ Paid Debts</h3>
        ${renderDebtorsCards(paidDebtors, true)}
      </div>

      <style>
        /* Summary Cards */
        .debtors-summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .summary-card {
          display: flex;
          align-items: center;
          padding: 25px;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
        }

        .summary-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.12);
        }

        .debt-card-red {
          background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
          border-left: 5px solid #DC2626;
        }

        .debt-card-amber {
          background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
          border-left: 5px solid #F59E0B;
        }

        .debt-card-green {
          background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
          border-left: 5px solid #10B981;
        }

        .card-icon {
          font-size: 2.5rem;
          margin-right: 20px;
        }

        .card-content {
          flex: 1;
        }

        .card-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #6B5E4C;
          margin-bottom: 8px;
          opacity: 0.8;
        }

        .card-value {
          font-size: 2rem;
          font-weight: 800;
          color: #5D534A;
        }

        /* Add Debtor Section */
        .add-debtor-section {
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          margin-bottom: 40px;
        }

        .section-header {
          font-size: 1.3rem;
          font-weight: 700;
          color: #5D534A;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .add-debtor-form {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .input-with-icon {
          position: relative;
          flex: 1;
          min-width: 250px;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
        }

        .modern-input {
          width: 100%;
          padding: 15px 15px 15px 45px;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          font-size: 1rem;
          font-family: 'Quicksand', sans-serif;
          transition: all 0.3s ease;
        }

        .modern-input:focus {
          outline: none;
          border-color: #87B382;
          box-shadow: 0 0 0 3px rgba(135, 179, 130, 0.1);
        }

        .modern-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 15px 25px;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 700;
          font-family: 'Quicksand', sans-serif;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .modern-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
        }

        .modern-btn:active {
          transform: translateY(0);
        }

        .btn-primary {
          background: linear-gradient(135deg, #87B382 0%, #689962 100%);
          color: white;
        }

        .btn-success {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: white;
        }

        .btn-icon {
          font-size: 1.2rem;
        }

        /* Product Selector Panel */
        .product-selector-panel {
          margin-top: 25px;
          padding: 25px;
          background: #F9FAFB;
          border-radius: 15px;
          border: 2px dashed #D1D5DB;
        }

        .selector-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .selector-header h4 {
          font-size: 1.1rem;
          color: #5D534A;
          margin: 0;
        }

        .btn-close {
          background: #FEE2E2;
          color: #DC2626;
          border: none;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-close:hover {
          background: #DC2626;
          color: white;
          transform: rotate(90deg);
        }

        .product-search-container {
          position: relative;
          margin-bottom: 20px;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
        }

        .search-input {
          width: 100%;
          padding: 12px 50px 12px 45px;
          border: 2px solid #E5E7EB;
          border-radius: 10px;
          font-size: 0.95rem;
          font-family: 'Quicksand', sans-serif;
        }

        .search-input:focus {
          outline: none;
          border-color: #87B382;
        }

        .btn-clear-search {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: #9CA3AF;
          color: white;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1rem;
        }

        .btn-clear-search:hover {
          background: #6B7280;
        }

        /* Product Grid */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
          max-height: 400px;
          overflow-y: auto;
          padding: 10px;
          margin-bottom: 20px;
        }

        .product-loan-item {
          background: white;
          padding: 15px;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
        }

        .product-loan-item:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .product-loan-info {
          flex: 1;
        }

        .product-loan-info strong {
          display: block;
          color: #5D534A;
          font-size: 1rem;
          margin-bottom: 5px;
        }

        .product-loan-price {
          display: inline-block;
          background: #D1FAE5;
          color: #059669;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          margin-right: 8px;
        }

        .product-loan-stock {
          color: #6B7280;
          font-size: 0.85rem;
        }

        .product-loan-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-qty-small {
          background: #87B382;
          color: white;
          border: none;
          width: 35px;
          height: 35px;
          border-radius: 8px;
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-qty-small:hover {
          background: #689962;
          transform: scale(1.1);
        }

        .qty-input-small {
          width: 60px;
          text-align: center;
          padding: 8px;
          border: 2px solid #E5E7EB;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 700;
          color: #5D534A;
        }

        .no-products-found {
          text-align: center;
          padding: 40px;
          color: #9CA3AF;
          font-style: italic;
        }

        /* Loan Summary Panel */
        .loan-summary-panel {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-top: 20px;
        }

        .loan-total-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 2px solid #E5E7EB;
        }

        .total-label {
          font-weight: 600;
          color: #6B7280;
          font-size: 1rem;
        }

        .total-amount {
          font-size: 1.8rem;
          font-weight: 800;
          color: #DC2626;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
        }

        /* Debtor Cards */
        .debts-section {
          margin-bottom: 40px;
        }

        .unpaid-header {
          color: #DC2626;
        }

        .paid-header {
          color: #059669;
        }

        .debtors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 20px;
        }

        .debtor-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .debtor-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 6px;
        }

        .debtor-card.unpaid::before {
          background: linear-gradient(180deg, #DC2626 0%, #EF4444 100%);
        }

        .debtor-card.paid::before {
          background: linear-gradient(180deg, #10B981 0%, #34D399 100%);
        }

        .debtor-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .debtor-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 15px;
          padding-bottom: 12px;
          border-bottom: 2px solid #F3F4F6;
        }

        .debtor-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #5D534A;
        }

        .status-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge-unpaid {
          background: #FEE2E2;
          color: #DC2626;
        }

        .badge-paid {
          background: #D1FAE5;
          color: #059669;
        }

        .debtor-details {
          margin-bottom: 15px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .detail-label {
          color: #6B7280;
          font-weight: 600;
        }

        .detail-value {
          color: #5D534A;
          font-weight: 600;
        }

        .debtor-items {
          background: #F9FAFB;
          padding: 12px;
          border-radius: 10px;
          margin-bottom: 15px;
        }

        .items-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #6B7280;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .items-list {
          color: #5D534A;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .debtor-amount {
          font-size: 1.8rem;
          font-weight: 800;
          text-align: center;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 15px;
        }

        .amount-unpaid {
          background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
          color: #DC2626;
        }

        .amount-paid {
          background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
          color: #059669;
        }

        .debtor-actions {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .btn-mark-paid {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: white;
        }

        .btn-mark-paid:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
        }

        .btn-delete-debtor {
          background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
          color: white;
        }

        .btn-delete-debtor:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
        }

        .paid-info {
          text-align: center;
          padding: 12px;
          background: #ECFDF5;
          border-radius: 10px;
          color: #059669;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .no-data {
          text-align: center;
          padding: 60px 20px;
          background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);
          border-radius: 16px;
          color: #9CA3AF;
          font-size: 1.1rem;
          font-weight: 600;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .debtors-grid {
            grid-template-columns: 1fr;
          }
          
          .product-grid {
            grid-template-columns: 1fr;
          }
          
          .add-debtor-form {
            flex-direction: column;
          }
        }
      </style>
    `;

    content.innerHTML = html;
    setupDebtorEventListeners();
    
  } catch (error) {
    console.error('❌ Error rendering debtors:', error);
    content.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #DC2626;">
        <h2>⚠️ Error Loading Debtors</h2>
        <p>${error.message || 'An unexpected error occurred'}</p>
        <button onclick="renderDebtors()" style="margin-top: 20px; padding: 12px 24px; background: #87B382; color: white; border: none; border-radius: 12px; cursor: pointer; font-weight: 700;">
          Retry
        </button>
      </div>
    `;
  }
};

function renderDebtorsCards(debtors, isPaid) {
  if (debtors.length === 0) {
    return `<p class="no-data">${isPaid ? '🎉 No paid debts yet' : '📭 No unpaid debts'}</p>`;
  }

  let html = '<div class="debtors-grid">';

  debtors.forEach(debtor => {
    const date = new Date(debtor.date || debtor.created_at);
    const formattedDate = date.toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    let itemsList = 'N/A';
    try {
      const items = Array.isArray(debtor.items) ? debtor.items :
                    typeof debtor.items === 'string' ? JSON.parse(debtor.items) : [];
      itemsList = items.map(i => `${i.name} (×${i.quantity})`).join(', ');
    } catch (e) {
      console.error('Error parsing debtor items:', e);
    }
    
    const amount = parseFloat(debtor.amount || debtor.total_debt || 0);
    const customerName = debtor.customerName || debtor.name || 'Unknown';

    html += `
      <div class="debtor-card ${isPaid ? 'paid' : 'unpaid'}">
        <div class="debtor-header">
          <div class="debtor-name">${customerName}</div>
          <span class="status-badge ${isPaid ? 'badge-paid' : 'badge-unpaid'}">
            ${isPaid ? '✓ PAID' : '⚠ UNPAID'}
          </span>
        </div>
        
        <div class="debtor-details">
          <div class="detail-row">
            <span class="detail-label">📅 Date:</span>
            <span class="detail-value">${formattedDate}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">🕐 Time:</span>
            <span class="detail-value">${formattedTime}</span>
          </div>
        </div>
        
        <div class="debtor-items">
          <div class="items-label">📦 Items Loaned</div>
          <div class="items-list">${itemsList}</div>
        </div>
        
        <div class="debtor-amount ${isPaid ? 'amount-paid' : 'amount-unpaid'}">
          ₱${amount.toFixed(2)}
        </div>
        
        ${isPaid ? `
          <div class="paid-info">
            ✓ Paid on ${debtor.paidDate ? new Date(debtor.paidDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
          </div>
        ` : `
          <div class="debtor-actions">
            <button class="action-btn btn-mark-paid" data-debtor-id="${debtor.id}">
              <span>💰</span> Mark as Paid
            </button>
            <button class="action-btn btn-delete-debtor" data-debtor-id="${debtor.id}">
              <span>🗑️</span> Delete
            </button>
          </div>
        `}
      </div>
    `;
  });

  html += '</div>';
  return html;
}

function setupDebtorEventListeners() {
  const btnShowSelector = document.getElementById('btnShowProductSelector');
  if (btnShowSelector) {
    btnShowSelector.addEventListener('click', showProductSelector);
  }

  const btnAddDebtor = document.getElementById('btnAddDebtor');
  if (btnAddDebtor) {
    btnAddDebtor.addEventListener('click', addDebtor);
  }

  const btnCancelDebtor = document.getElementById('btnCancelDebtor');
  if (btnCancelDebtor) {
    btnCancelDebtor.addEventListener('click', () => {
      document.getElementById('productSelector').style.display = 'none';
      document.getElementById('debtorCustomerName').value = '';
      selectedLoanProducts = [];
    });
  }

  const productSearchInput = document.getElementById('productSearchInput');
  if (productSearchInput) {
    productSearchInput.addEventListener('input', filterProducts);
    productSearchInput.addEventListener('keyup', (e) => {
      const btnClear = document.getElementById('btnClearSearch');
      if (e.target.value.trim()) {
        btnClear.style.display = 'block';
      } else {
        btnClear.style.display = 'none';
      }
    });
  }

  const btnClearSearch = document.getElementById('btnClearSearch');
  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', clearProductSearch);
  }

  document.querySelectorAll('.btn-mark-paid').forEach(btn => {
    btn.addEventListener('click', function() {
      const debtorId = parseInt(this.getAttribute('data-debtor-id'));
      markAsPaid(debtorId);
    });
  });

  document.querySelectorAll('.btn-delete-debtor').forEach(btn => {
    btn.addEventListener('click', function() {
      const debtorId = parseInt(this.getAttribute('data-debtor-id'));
      deleteDebtor(debtorId);
    });
  });
}

let selectedLoanProducts = [];
let allAvailableProducts = [];

async function showProductSelector() {
  const customerName = document.getElementById('debtorCustomerName').value.trim();
  
  if (!customerName) {
    alert('⚠️ Please enter customer name first!');
    document.getElementById('debtorCustomerName').focus();
    return;
  }

  try {
    const allProducts = await DB.getProducts();
    const products = allProducts.filter(p => {
      const qty = parseFloat(p.quantity || p.stock || 0);
      return qty > 0;
    });
    
    if (products.length === 0) {
      alert('⚠️ No products available in inventory!');
      return;
    }

    allAvailableProducts = products;
    renderProductList(products);
    
    document.getElementById('productSelector').style.display = 'block';
    document.getElementById('productSearchInput').value = '';
    document.getElementById('btnClearSearch').style.display = 'none';
    
    setTimeout(() => {
      document.getElementById('productSearchInput').focus();
    }, 100);
  } catch (error) {
    console.error('Error loading products:', error);
    alert('❌ Failed to load products. Please try again.');
  }
}

function renderProductList(products) {
  const productList = document.getElementById('productList');
  let html = '';

  if (products.length === 0) {
    html = '<div class="no-products-found">No products found. Try a different search.</div>';
  } else {
    products.forEach(product => {
      const currentQty = selectedLoanProducts.find(p => p.id === product.id)?.quantity || 0;
      const price = parseFloat(product.price || product.selling_price || 0);
      const stock = parseFloat(product.quantity || product.stock || 0);
      
      html += `
        <div class="product-loan-item" data-product-name="${product.name.toLowerCase()}">
          <div class="product-loan-info">
            <strong>${product.name}</strong>
            <div>
              <span class="product-loan-price">₱${price.toFixed(2)}</span>
              <span class="product-loan-stock">${stock} available</span>
            </div>
          </div>
          <div class="product-loan-controls">
            <button class="btn-qty-small" onclick="decrementLoanQty(${product.id})">−</button>
            <input type="number" 
                   id="loanQty_${product.id}" 
                   value="${currentQty}" 
                   min="0" 
                   max="${stock}"
                   class="qty-input-small"
                   onchange="updateLoanQty(${product.id}, this.value)">
            <button class="btn-qty-small" onclick="incrementLoanQty(${product.id}, ${stock})">+</button>
          </div>
        </div>
      `;
    });
  }

  productList.innerHTML = html;
}

function filterProducts() {
  const searchTerm = document.getElementById('productSearchInput').value.toLowerCase().trim();
  
  if (!searchTerm) {
    renderProductList(allAvailableProducts);
    return;
  }

  const filteredProducts = allAvailableProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm)
  );

  renderProductList(filteredProducts);
}

function clearProductSearch() {
  document.getElementById('productSearchInput').value = '';
  document.getElementById('btnClearSearch').style.display = 'none';
  renderProductList(allAvailableProducts);
  document.getElementById('productSearchInput').focus();
}

window.incrementLoanQty = function(productId, maxQty) {
  const input = document.getElementById(`loanQty_${productId}`);
  let currentQty = parseInt(input.value) || 0;
  if (currentQty < maxQty) {
    input.value = currentQty + 1;
    updateLoanQty(productId, input.value);
  } else {
    alert('⚠️ Cannot exceed available stock!');
  }
};

window.decrementLoanQty = function(productId) {
  const input = document.getElementById(`loanQty_${productId}`);
  let currentQty = parseInt(input.value) || 0;
  if (currentQty > 0) {
    input.value = currentQty - 1;
    updateLoanQty(productId, input.value);
  }
};

window.updateLoanQty = function(productId, qty) {
  const quantity = parseInt(qty) || 0;
  const product = allAvailableProducts.find(p => p.id === productId);
  
  if (!product) return;
  
  const stock = parseFloat(product.quantity || product.stock || 0);
  
  if (quantity > stock) {
    alert('⚠️ Cannot exceed available stock!');
    document.getElementById(`loanQty_${productId}`).value = stock;
    return;
  }

  const existingIndex = selectedLoanProducts.findIndex(p => p.id === productId);
  
  if (quantity > 0) {
    const price = parseFloat(product.price || product.selling_price || 0);
    const cost = parseFloat(product.cost || product.cost_price || 0);
    
    if (existingIndex >= 0) {
      selectedLoanProducts[existingIndex].quantity = quantity;
    } else {
      selectedLoanProducts.push({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: price,
        cost: cost,
        quantity: quantity
      });
    }
  } else {
    if (existingIndex >= 0) {
      selectedLoanProducts.splice(existingIndex, 1);
    }
  }

  updateLoanTotal();
};

function updateLoanTotal() {
  let total = 0;
  selectedLoanProducts.forEach(p => {
    total += p.price * p.quantity;
  });
  
  document.getElementById('loanTotal').textContent = total.toFixed(2);
}

async function addDebtor() {
  const customerName = document.getElementById('debtorCustomerName').value.trim();
  
  if (!customerName) {
    alert('⚠️ Please enter customer name!');
    return;
  }

  if (selectedLoanProducts.length === 0) {
    alert('⚠️ Please select at least one product!');
    return;
  }

  let totalAmount = 0;
  selectedLoanProducts.forEach(item => {
    totalAmount += item.price * item.quantity;
  });

  const now = new Date();
  const dateTime = now.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const itemsList = selectedLoanProducts.map(p => `${p.name} (${p.quantity})`).join(', ');
  const confirmMessage = `Add debtor with the following details?\n\n` +
    `Customer: ${customerName}\n` +
    `Items: ${itemsList}\n` +
    `Total Amount: ₱${totalAmount.toFixed(2)}\n` +
    `Date & Time: ${dateTime}`;

  if (!confirm(confirmMessage)) {
    return;
  }

  try {
    const products = await DB.getProducts();
    for (const item of selectedLoanProducts) {
      const product = products.find(p => p.id === item.id);
      if (product) {
        const currentQty = parseFloat(product.quantity || product.stock || 0);
        await DB.updateProduct(item.id, { quantity: currentQty - item.quantity });
      }
    }

    await DB.addDebtor({
      name: customerName,
      customerName: customerName,
      amount: totalAmount,
      total_debt: totalAmount,
      items: selectedLoanProducts,
      products: selectedLoanProducts,
      paid: false,
      date: now.toISOString()
    });

    alert(`✓ Debtor "${customerName}" added successfully!\nLoan Amount: ₱${totalAmount.toFixed(2)}`);

    document.getElementById('debtorCustomerName').value = '';
    document.getElementById('productSelector').style.display = 'none';
    selectedLoanProducts = [];

    await renderDebtors();
    if (typeof renderInventory === 'function') {
      await renderInventory();
    }
    if (typeof renderProfit === 'function') {
      await renderProfit();
    }
  } catch (error) {
    console.error('Error adding debtor:', error);
    alert('❌ Failed to add debtor. Please try again.');
  }
}

async function markAsPaid(debtorId) {
  try {
    const debtors = await DB.getDebtors();
    const debtor = debtors.find(d => d.id === debtorId);
    
    if (!debtor) {
      alert('⚠️ Debtor not found!');
      return;
    }

    const amount = parseFloat(debtor.amount || debtor.total_debt || 0);
    const customerName = debtor.customerName || debtor.name || 'Unknown';

    const confirmMessage = `Mark this debt as paid?\n\n` +
      `Customer: ${customerName}\n` +
      `Amount: ₱${amount.toFixed(2)}\n\n` +
      `This will record the payment and move it to paid debts.`;

    if (confirm(confirmMessage)) {
      await DB.updateDebtor(debtorId, { 
        paid: true, 
        paidDate: new Date().toISOString(),
        date_paid: new Date().toISOString()
      });
      
      const items = Array.isArray(debtor.items) ? debtor.items :
                    typeof debtor.items === 'string' ? JSON.parse(debtor.items) : [];
      
      const profit = items.reduce((sum, item) => {
        const price = parseFloat(item.price || 0);
        const cost = parseFloat(item.cost || 0);
        const qty = parseFloat(item.quantity || 0);
        return sum + ((price - cost) * qty);
      }, 0);

      await DB.addSale({
        items: items,
        total: amount,
        profit: profit,
        total_profit: profit,
        paymentType: 'credit-paid',
        payment_method: 'credit-paid'
      });

      await renderDebtors();
      if (typeof renderProfit === 'function') {
        await renderProfit();
      }
      alert(`✓ Debt marked as paid for "${customerName}"!`);
    }
  } catch (error) {
    console.error('Error marking as paid:', error);
    alert('❌ Failed to mark as paid. Please try again.');
  }
}

async function deleteDebtor(debtorId) {
  try {
    const debtors = await DB.getDebtors();
    const debtor = debtors.find(d => d.id === debtorId);
    
    if (!debtor) {
      alert('⚠️ Debtor not found!');
      return;
    }

    const amount = parseFloat(debtor.amount || debtor.total_debt || 0);
    const customerName = debtor.customerName || debtor.name || 'Unknown';

    const confirmMessage = `Are you sure you want to delete this debt record?\n\n` +
      `Customer: ${customerName}\n` +
      `Amount: ₱${amount.toFixed(2)}\n` +
      `Status: ${debtor.paid ? 'Paid' : 'Unpaid'}\n\n` +
      `This action cannot be undone!`;

    if (confirm(confirmMessage)) {
      await DB.deleteDebtor(debtorId);
      await renderDebtors();
      alert(`✓ Debt record for "${customerName}" has been deleted.`);
    }
  } catch (error) {
    console.error('Error deleting debtor:', error);
    alert('❌ Failed to delete debtor. Please try again.');
  }
}

window.addDebtor = addDebtor;
window.markAsPaid = markAsPaid;
window.deleteDebtor = deleteDebtor;