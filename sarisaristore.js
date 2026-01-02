// DASHBOARD CONTROLLER - Page Management

// Make showPage function globally accessible
window.showPage = function(pageId) {
  console.log('📄 Switching to page:', pageId);
  
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
  
  // Show selected page
  const page = document.getElementById(pageId);
  if (page) {
    page.classList.add('active-page');
  } else {
    console.error('❌ Page not found:', pageId);
    return;
  }
  
  // Render appropriate content based on page
  switch(pageId) {
    case 'profitPage':
      if (typeof renderProfit === 'function') {
        renderProfit();
      }
      break;
    case 'pricePage':
      if (typeof renderPriceList === 'function') {
        renderPriceList();
      }
      break;
    case 'inventoryPage':
      if (typeof renderInventory === 'function') {
        renderInventory();
      }
      break;
    case 'debtPage':
      if (typeof renderDebtors === 'function') {
        renderDebtors();
      }
      break;
  }
};

console.log('✓ Dashboard controller loaded');