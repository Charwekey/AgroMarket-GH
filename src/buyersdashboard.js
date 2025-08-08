
    // Sample data
    let products = [
      { id: 1, name: "Fresh Tomatoes", price: 8.50, category: "vegetables", farmer: "Kwame's Farm", image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=300", rating: 4.5, inStock: true },
      { id: 2, name: "Organic Lettuce", price: 5.00, category: "vegetables", farmer: "Green Valley", image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=300", rating: 4.2, inStock: true },
      { id: 3, name: "Sweet Bananas", price: 12.00, category: "fruits", farmer: "Tropical Gardens", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300", rating: 4.8, inStock: true },
      { id: 4, name: "Fresh Corn", price: 3.50, category: "grains", farmer: "Sunrise Farm", image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300", rating: 4.3, inStock: false },
      { id: 5, name: "Ripe Mangoes", price: 15.00, category: "fruits", farmer: "Tropical Gardens", image: "https://images.unsplash.com/photo-1553279023-1b0ac4ba9e8f?w=300", rating: 4.7, inStock: true },
      { id: 6, name: "Fresh Basil", price: 4.00, category: "herbs", farmer: "Herb Haven", image: "https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=300", rating: 4.4, inStock: true }
    ];

    let cart = [];
    let orders = [
      { id: 1001, date: "2025-01-15", status: "delivered", total: 45.50, items: 3 },
      { id: 1002, date: "2025-01-10", status: "shipped", total: 28.00, items: 2 },
      { id: 1003, date: "2025-01-05", status: "processing", total: 67.25, items: 5 }
    ];
    let favorites = [];

    // Initialize dashboard
    document.addEventListener('DOMContentLoaded', function() {
      loadProducts();
      updateCartCount();
      loadOrders();
      setupEventListeners();
    });

    function setupEventListeners() {
      // Filter buttons
      document.querySelectorAll('.filter-button').forEach(btn => {
        btn.addEventListener('click', function() {
          document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          filterProducts(this.dataset.category);
        });
      });

      // Search functionality
      document.getElementById('search-input').addEventListener('input', function() {
        searchProducts(this.value);
      });

      // Checkout button
      document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length > 0) {
          checkout();
        }
      });
    }

    function showSection(sectionName) {
      // Hide all sections
      document.querySelectorAll('[id$="-section"]').forEach(section => {
        section.classList.add('hidden');
      });
      
      // Show selected section
      document.getElementById(sectionName + '-section').classList.remove('hidden');
      
      // Load section-specific data
      if (sectionName === 'cart') {
        loadCart();
      } else if (sectionName === 'favorites') {
        loadFavorites();
      }
    }

    function loadProducts(filter = 'all', search = '') {
      const grid = document.getElementById('products-grid');
      let filteredProducts = products;

      if (filter !== 'all') {
        filteredProducts = products.filter(p => p.category === filter);
      }

      if (search) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.farmer.toLowerCase().includes(search.toLowerCase())
        );
      }

      grid.innerHTML = filteredProducts.map(product => `
        <div class="bg-white rounded-lg shadow product-card">
          <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-t-lg">
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-lg">${product.name}</h3>
              <button onclick="toggleFavorite(${product.id})" class="text-gray-400 hover:text-red-500 transition">
                <i class="${favorites.includes(product.id) ? 'fas fa-heart text-red-500' : 'far fa-heart'}"></i>
              </button>
            </div>
            <p class="text-gray-600 text-sm mb-2">by ${product.farmer}</p>
            <div class="flex items-center mb-2">
              <div class="flex text-yellow-400">
                ${Array(5).fill().map((_, i) => 
                  `<i class="fas fa-star ${i < Math.floor(product.rating) ? '' : 'text-gray-300'}"></i>`
                ).join('')}
              </div>
              <span class="text-gray-600 text-sm ml-2">(${product.rating})</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xl font-bold text-green-600">GH₵${product.price}</span>
              <div class="flex items-center space-x-2">
                <span class="${product.inStock ? 'text-green-500' : 'text-red-500'} text-sm">
                  ${product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
            <button onclick="addToCart(${product.id})" 
                    class="w-full mt-3 py-2 rounded-lg transition ${product.inStock ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}"
                    ${!product.inStock ? 'disabled' : ''}>
              <i class="fas fa-cart-plus mr-2"></i>Add to Cart
            </button>
          </div>
        </div>
      `).join('');
    }

    function filterProducts(category) {
      loadProducts(category, document.getElementById('search-input').value);
    }

    function searchProducts(query) {
      const activeFilter = document.querySelector('.filter-button.active').dataset.category;
      loadProducts(activeFilter, query);
    }

    function addToCart(productId) {
      const product = products.find(p => p.id === productId);
      const existingItem = cart.find(item => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      
      updateCartCount();
      showToast('Product added to cart!', 'success');
    }

    function removeFromCart(productId) {
      cart = cart.filter(item => item.id !== productId);
      updateCartCount();
      loadCart();
    }

    function updateQuantity(productId, quantity) {
      const item = cart.find(item => item.id === productId);
      if (item) {
        item.quantity = Math.max(1, quantity);
        loadCart();
        updateCartCount();
      }
    }

    function updateCartCount() {
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      document.getElementById('cart-count').textContent = count;
      
      if (count > 0) {
        document.getElementById('cart-count').classList.add('cart-badge');
        setTimeout(() => {
          document.getElementById('cart-count').classList.remove('cart-badge');
        }, 500);
      }
    }

    function loadCart() {
      const cartItems = document.getElementById('cart-items');
      const checkoutBtn = document.getElementById('checkout-btn');
      
      if (cart.length === 0) {
        cartItems.innerHTML = `
          <div class="p-8 text-center">
            <i class="fas fa-shopping-cart text-gray-300 text-6xl mb-4"></i>
            <p class="text-gray-500 text-lg">Your cart is empty</p>
            <button onclick="showSection('marketplace')" class="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition">
              Continue Shopping
            </button>
          </div>
        `;
        checkoutBtn.disabled = true;
      } else {
        cartItems.innerHTML = cart.map(item => `
          <div class="flex items-center justify-between p-4 border-b">
            <div class="flex items-center">
              <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
              <div class="ml-4">
                <h4 class="font-semibold">${item.name}</h4>
                <p class="text-gray-600 text-sm">by ${item.farmer}</p>
                <p class="text-green-600 font-semibold">GH₵${item.price}</p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" class="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition">-</button>
                <span class="w-8 text-center">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" class="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition">+</button>
              </div>
              <span class="font-semibold w-20 text-right">GH₵${(item.price * item.quantity).toFixed(2)}</span>
              <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700 transition">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `).join('');
        checkoutBtn.disabled = false;
      }
      
      updateCartTotal();
    }

    function updateCartTotal() {
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      document.getElementById('cart-total').textContent = `GH₵${total.toFixed(2)}`;
    }

    function checkout() {
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newOrder = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        total: total,
        items: cart.length
      };
      
      orders.unshift(newOrder);
      cart = [];
      updateCartCount();
      loadCart();
      loadOrders();
      
      showToast('Order placed successfully!', 'success');
      showSection('orders');
    }

    function loadOrders() {
      const ordersList = document.getElementById('orders-list');
      
      if (orders.length === 0) {
        ordersList.innerHTML = `
          <div class="text-center py-8">
            <i class="fas fa-receipt text-gray-300 text-6xl mb-4"></i>
            <p class="text-gray-500">No orders yet</p>
          </div>
        `;
        return;
      }
      
      ordersList.innerHTML = orders.map(order => `
        <div class="border border-gray-200 rounded-lg p-4 mb-4">
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-semibold">Order #${order.id}</h4>
              <p class="text-gray-600 text-sm">Date: ${order.date}</p>
              <p class="text-gray-600 text-sm">${order.items} items</p>
            </div>
            <div class="text-right">
              <p class="font-semibold">GH₵${order.total.toFixed(2)}</p>
              <span class="px-2 py-1 rounded-full text-xs font-semibold
                ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'}">
                ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      `).join('');
    }

    function toggleFavorite(productId) {
      if (favorites.includes(productId)) {
        favorites = favorites.filter(id => id !== productId);
        showToast('Removed from favorites', 'info');
      } else {
        favorites.push(productId);
        showToast('Added to favorites!', 'success');
      }
      
      loadProducts();
    }

    function loadFavorites() {
      const favoritesGrid = document.getElementById('favorites-grid');
      const favoriteProducts = products.filter(p => favorites.includes(p.id));
      
      if (favoriteProducts.length === 0) {
        favoritesGrid.innerHTML = `
          <div class="col-span-full text-center py-8">
            <i class="fas fa-heart text-gray-300 text-6xl mb-4"></i>
            <p class="text-gray-500 text-lg">No favorite products yet</p>
            <button onclick="showSection('marketplace')" class="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
              Browse Products
            </button>
          </div>
        `;
        return;
      }
      
      favoritesGrid.innerHTML = favoriteProducts.map(product => `
        <div class="bg-white rounded-lg shadow product-card">
          <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded-t-lg">
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-lg">${product.name}</h3>
              <button onclick="toggleFavorite(${product.id})" class="text-red-500 hover:text-red-700 transition">
                <i class="fas fa-heart"></i>
              </button>
            </div>
            <p class="text-gray-600 text-sm mb-2">by ${product.farmer}</p>
            <div class="flex justify-between items-center">
              <span class="text-xl font-bold text-green-600">GH₵${product.price}</span>
            </div>
            <button onclick="addToCart(${product.id})" class="w-full mt-3 bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition">
              <i class="fas fa-cart-plus mr-2"></i>Add to Cart
            </button>
          </div>
        </div>
      `).join('');
    }

    function showToast(message, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white z-50 ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' : 'bg-green-500'
      }`;
      toast.textContent = message;
      
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }

    function logout() {
      if (confirm('Are you sure you want to logout?')) {
        window.location.href = '../index.html';
      }
    }

    // Initialize with marketplace section
    showSection('marketplace');
  