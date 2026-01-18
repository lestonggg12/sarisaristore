// database.js - Django API Database for Sari-Sari Store
// This connects to Django REST API backend

const DB = {
  // Base API URL
  API_URL: '/api',
  
  // Helper function to get CSRF token
  getCsrfToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]')?.value || 
           document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '';
  },

  // Helper function for API calls
  async apiCall(endpoint, method = 'GET', data = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': this.getCsrfToken(),
      },
      credentials: 'include', // Important for session authentication
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.API_URL}${endpoint}`, options);
      
      if (method === 'DELETE' && response.status === 204) {
        return { success: true };
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Call Failed:', error);
      throw error;
    }
  },

  // Central Refresh Trigger - Syncs all UI components
  async syncUI() {
    console.log('🔄 Syncing all UI components...');
    if (typeof renderInventory === 'function') await renderInventory();
    if (typeof renderPriceList === 'function') await renderPriceList();
    if (typeof renderProfit === 'function') await renderProfit();
    if (typeof renderDebtors === 'function') await renderDebtors();
    if (typeof updateCartDisplay === 'function') updateCartDisplay();
  },

  // ==================== PRODUCTS METHODS ====================
  async getProducts() {
    try {
      const products = await this.apiCall('/products/');
      // Ensure consistent field names for frontend
      return products.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        category_id: p.category,
        cost: parseFloat(p.cost),
        cost_price: parseFloat(p.cost),
        price: parseFloat(p.price),
        selling_price: parseFloat(p.price),
        quantity: parseInt(p.quantity),
        stock: parseInt(p.quantity),
        created_at: p.created_at,
        updated_at: p.updated_at
      }));
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  },

  async addProduct(product) {
    try {
      // Transform frontend data to Django format
      const productData = {
        name: product.name,
        category: product.category || product.category_id,
        cost: parseFloat(product.cost || product.cost_price || 0),
        price: parseFloat(product.price || product.selling_price || 0),
        quantity: parseInt(product.quantity || product.stock || 0)
      };
      
      const newProduct = await this.apiCall('/products/', 'POST', productData);
      await this.syncUI();
      return newProduct;
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  },

  async updateProduct(id, updates) {
    try {
      // First, get the current product data
      const products = await this.getProducts();
      const currentProduct = products.find(p => p.id === id);
      
      if (!currentProduct) {
        throw new Error('Product not found');
      }
      
      // Merge current data with updates - ALL required fields must be included
      const updateData = {
        name: updates.name !== undefined ? updates.name : currentProduct.name,
        category: updates.category !== undefined ? updates.category : 
                  (updates.category_id !== undefined ? updates.category_id : currentProduct.category),
        cost: updates.cost !== undefined ? parseFloat(updates.cost) :
              (updates.cost_price !== undefined ? parseFloat(updates.cost_price) : parseFloat(currentProduct.cost)),
        price: updates.price !== undefined ? parseFloat(updates.price) :
               (updates.selling_price !== undefined ? parseFloat(updates.selling_price) : parseFloat(currentProduct.price)),
        quantity: updates.quantity !== undefined ? parseInt(updates.quantity) :
                  (updates.stock !== undefined ? parseInt(updates.stock) : parseInt(currentProduct.quantity))
      };
      
      console.log('📤 Sending full product update:', updateData);
      
      const updatedProduct = await this.apiCall(`/products/${id}/`, 'PUT', updateData);
      await this.syncUI();
      return updatedProduct;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },

  async deleteProduct(id) {
    try {
      await this.apiCall(`/products/${id}/`, 'DELETE');
      await this.syncUI();
      return true;
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },

  // ==================== SALES METHODS ====================
  async getSales() {
    try {
      const sales = await this.apiCall('/sales/');
      console.log('📥 Raw sales from API:', sales);
      
      return sales.map(s => {
        console.log('Processing sale:', s.id, 'Profit:', s.profit);
        return {
          id: s.id,
          date: s.date,
          total: parseFloat(s.total),
          profit: parseFloat(s.profit || 0),
          paymentType: s.payment_method,
          payment_method: s.payment_method,
          items: s.items || []
        };
      });
    } catch (error) {
      console.error('Failed to fetch sales:', error);
      return [];
    }
  },

  async addSale(sale) {
    try {
      // Calculate profit from items with detailed logging
      let totalProfit = 0;
      const itemsWithCost = sale.items.map(item => {
        const itemCost = parseFloat(item.cost || item.cost_price || 0);
        const itemPrice = parseFloat(item.price || item.selling_price || 0);
        const quantity = parseInt(item.quantity || 0);
        const itemProfit = (itemPrice - itemCost) * quantity;
        totalProfit += itemProfit;
        
        console.log(`📊 Item: ${item.name}, Price: ₱${itemPrice}, Cost: ₱${itemCost}, Qty: ${quantity}, Profit: ₱${itemProfit}`);
        
        return {
          product_id: item.id || item.productId,
          quantity: quantity,
          price: itemPrice,
          cost: itemCost
        };
      });
      
      // Transform sale data to match Django API format
      const saleData = {
        total: parseFloat(sale.total),
        profit: totalProfit,
        payment_method: sale.paymentType || sale.payment_method || 'cash',
        items: itemsWithCost
      };
      
      console.log('📤 Sending sale to API:', saleData);
      console.log('💰 Total Profit being sent:', totalProfit);
      
      const newSale = await this.apiCall('/sales/', 'POST', saleData);
      
      console.log('✅ Sale saved response:', newSale);
      
      await this.syncUI();
      return newSale;
    } catch (error) {
      console.error('Failed to add sale:', error);
      throw error;
    }
  },

 // ==================== SALES METHODS ====================
async clearAllSales() {
  try {
    // Step 1: Get current accumulated totals
    const currentTotals = await this.getAccumulatedTotals();
    console.log('📊 Current accumulated totals:', currentTotals);
    
    // Step 2: Get all current sales to calculate today's totals
    const sales = await this.getSales();
    const todayRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
    const todayProfit = sales.reduce((sum, sale) => sum + parseFloat(sale.profit), 0);
    
    console.log(`💰 Today's Revenue: ₱${todayRevenue.toFixed(2)}`);
    console.log(`💰 Today's Profit: ₱${todayProfit.toFixed(2)}`);
    
    // Step 3: Calculate new accumulated totals
    const newAccumulatedRevenue = currentTotals.revenue + todayRevenue;
    const newAccumulatedProfit = currentTotals.profit + todayProfit;
    
    // Step 4: Save accumulated totals to cache (NOT to sales table)
    await this.updateAccumulatedTotals(newAccumulatedRevenue, newAccumulatedProfit);
    
    // Step 5: Clear all sales transactions from database
    await this.apiCall('/sales/clear/', 'DELETE');
    
    // Step 6: Sync UI
    await this.syncUI();
    
    console.log(`✅ New Accumulated Revenue: ₱${newAccumulatedRevenue.toFixed(2)}`);
    console.log(`✅ New Accumulated Profit: ₱${newAccumulatedProfit.toFixed(2)}`);
    console.log('🗑️ Sales transactions cleared, accumulated totals preserved in cache');
    
    return true;
  } catch (error) {
    console.error('Failed to clear sales:', error);
    throw error;
  }
},

  // ==================== DEBTORS METHODS ====================
  async getDebtors() {
    try {
      const debtors = await this.apiCall('/debtors/');
      return debtors.map(d => ({
        id: d.id,
        name: d.name,
        contact: d.contact || '',
        totalAmount: parseFloat(d.total_debt),
        total_debt: parseFloat(d.total_debt),
        date: d.date_borrowed,
        date_borrowed: d.date_borrowed,
        paid: d.paid || false,
        date_paid: d.date_paid,
        products: d.items || []
      }));
    } catch (error) {
      console.error('Failed to fetch debtors:', error);
      return [];
    }
  },

  async addDebtor(debtor) {
    try {
      // Transform debtor data to match Django API format
      const debtorData = {
        name: debtor.name,
        contact: debtor.contact || '',
        total_debt: parseFloat(debtor.totalAmount || debtor.total_debt),
        items: (debtor.products || []).map(item => ({
          product_id: item.id || item.productId,
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price)
        }))
      };
      
      const newDebtor = await this.apiCall('/debtors/', 'POST', debtorData);
      await this.syncUI();
      return newDebtor;
    } catch (error) {
      console.error('Failed to add debtor:', error);
      throw error;
    }
  },

  async updateDebtor(id, updates) {
    try {
      // Transform updates to match Django API format
      const updateData = {};
      if (updates.paid !== undefined) {
        updateData.paid = updates.paid;
        if (updates.paid) {
          updateData.date_paid = new Date().toISOString();
        }
      }
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.contact !== undefined) updateData.contact = updates.contact;
      if (updates.totalAmount !== undefined) {
        updateData.total_debt = parseFloat(updates.totalAmount);
      }
      
      const updatedDebtor = await this.apiCall(`/debtors/${id}/`, 'PUT', updateData);
      await this.syncUI();
      return updatedDebtor;
    } catch (error) {
      console.error('Failed to update debtor:', error);
      throw error;
    }
  },

  async deleteDebtor(id) {
    try {
      await this.apiCall(`/debtors/${id}/`, 'DELETE');
      await this.syncUI();
      return true;
    } catch (error) {
      console.error('Failed to delete debtor:', error);
      throw error;
    }
  },

  // ==================== ACCUMULATED TOTALS METHODS ====================
  async getAccumulatedTotals() {
    try {
      const data = await this.apiCall('/accumulated-totals/');
      return {
        revenue: parseFloat(data.accumulated_revenue || 0),
        profit: parseFloat(data.accumulated_profit || 0),
        lastCleared: data.last_cleared
      };
    } catch (error) {
      console.error('Failed to fetch accumulated totals:', error);
      return { revenue: 0, profit: 0, lastCleared: null };
    }
  },

  async updateAccumulatedTotals(revenue, profit) {
    try {
      const data = await this.apiCall('/accumulated-totals/', 'POST', {
        accumulated_revenue: revenue,
        accumulated_profit: profit,
        last_cleared: new Date().toISOString()
      });
      console.log('✅ Accumulated totals updated:', data);
      return data;
    } catch (error) {
      console.error('Failed to update accumulated totals:', error);
      throw error;
    }
  },

  // ==================== UTILITY METHODS ====================
  async clearAll() {
    if (typeof showModernConfirm === 'function') {
      const confirmClear = await showModernConfirm(
        '⚠️ WARNING<br><br>This will delete ALL data (products, sales, debtors).<br><br>Continue?',
        '🚨'
      );
      
      if (!confirmClear) return false;
    } else {
      if (!confirm('⚠️ WARNING: This will delete ALL data (products, sales, debtors). Continue?')) {
        return false;
      }
    }
    
    try {
      await this.clearAllSales();
      const products = await this.getProducts();
      for (const product of products) {
        await this.deleteProduct(product.id);
      }
      const debtors = await this.getDebtors();
      for (const debtor of debtors) {
        await this.deleteDebtor(debtor.id);
      }
      await this.syncUI();
      console.log('🗑️ All data cleared');
      
      if (typeof showModernAlert === 'function') {
        await showModernAlert('All data cleared successfully!', '✅');
      } else {
        alert('✅ All data cleared successfully!');
      }
      
      return true;
    } catch (error) {
      console.error('Failed to clear all data:', error);
      
      if (typeof showModernAlert === 'function') {
        await showModernAlert('Failed to clear all data. Please try again.', '❌');
      } else {
        alert('Failed to clear all data. Please try again.');
      }
      
      return false;
    }
  },

  // Initialize
  async init() {
    console.log('✅ Django API Database Ready');
    return Promise.resolve();
  }
};

// Make DB globally accessible
window.DB = DB;

// Alias for compatibility with dashboard initialization
window.DatabaseModule = {
  init() {
    return DB.init();
  }
};

console.log('✓ Django API Database initialized!');