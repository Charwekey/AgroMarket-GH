
    // Farmer Dashboard JavaScript
    class FarmerDashboard {
        constructor() {
            this.currentUser = null;
            this.products = [];
            this.orders = [];
            this.currentFilter = 'all';
            this.editingProduct = null;
            this.init();
        }

        init() {
            this.loadCurrentUser();
            this.loadProducts();
            this.loadOrders();
            this.setupEventListeners();
            this.updateDashboard();
        }

        loadCurrentUser() {
            // In a real app, this would check authentication
            this.currentUser = { name: 'John Farmer', role: 'farmer' };
            document.getElementById('farmer-name').textContent = this.currentUser.name;
        }

        loadProducts() {
            const savedProducts = this.getFromStorage('farmerProducts');
            this.products = savedProducts || this.getSampleProducts();
        }

        loadOrders() {
            const savedOrders = this.getFromStorage('farmerOrders');
            this.orders = savedOrders || this.getSampleOrders();
        }

        getFromStorage(key) {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            } catch (e) {
                return null;
            }
        }

        saveToStorage(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
            } catch (e) {
                console.error('Failed to save to localStorage:', e);
            }
        }

        getSampleProducts() {
            return [
                {
                    id: 1,
                    name: 'Fresh Tomatoes',
                    category: 'Vegetables',
                    price: 15,
                    quantity: 50,
                    unit: 'kg',
                    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=200&fit=crop',
                    description: 'Fresh organic tomatoes from our farm',
                    status: 'available',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Sweet Corn',
                    category: 'Grains',
                    price: 8,
                    quantity: 100,
                    unit: 'kg',
                    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300&h=200&fit=crop',
                    description: 'Fresh sweet corn, harvested daily',
                    status: 'available',
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: 'Plantain',
                    category: 'Fruits',
                    price: 12,
                    quantity: 30,
                    unit: 'bunch',
                    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop',
                    description: 'Ripe plantain, perfect for cooking',
                    status: 'available',
                    createdAt: new Date().toISOString()
                }
            ];
        }

        getSampleOrders() {
            return [
                {
                    id: 1,
                    buyerName: 'John Doe',
                    buyerPhone: '+233 123 456 789',
                    products: [
                        { name: 'Fresh Tomatoes', quantity: 5, price: 15, unit: 'kg' }
                    ],
                    totalAmount: 75,
                    status: 'pending',
                    date: new Date().toISOString().split('T')[0],
                    orderDate: new Date().toISOString()
                },
                {
                    id: 2,
                    buyerName: 'Jane Smith',
                    buyerPhone: '+233 987 654 321',
                    products: [
                        { name: 'Sweet Corn', quantity: 10, price: 8, unit: 'kg' },
                        { name: 'Plantain', quantity: 2, price: 12, unit: 'bunch' }
                    ],
                    totalAmount: 104,
                    status: 'completed',
                    date: new Date().toISOString().split('T')[0],
                    orderDate: new Date().toISOString()
                },
                {
                    id: 3,
                    buyerName: 'Mike Johnson',
                    buyerPhone: '+233 555 123 456',
                    products: [
                        { name: 'Fresh Tomatoes', quantity: 3, price: 15, unit: 'kg' }
                    ],
                    totalAmount: 45,
                    status: 'cancelled',
                    date: new Date().toISOString().split('T')[0],
                    orderDate: new Date().toISOString()
                }
            ];
        }

        setupEventListeners() {
            // Product form submission
            document.getElementById('product-form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProduct();
            });

            // Profile form submission
            document.getElementById('profile-form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });

            // Close modal on outside click
            document.getElementById('product-modal').addEventListener('click', (e) => {
                if (e.target.id === 'product-modal') {
                    this.closeProductModal();
                }
            });
        }

        showSection(sectionName) {
            // Hide all sections
            const sections = ['overview-section', 'products-section', 'orders-section', 'analytics-section', 'profile-section'];
            sections.forEach(section => {
                const element = document.getElementById(section);
                if (element) element.style.display = 'none';
            });

            // Show selected section
            const selectedSection = document.getElementById(`${sectionName}-section`);
            if (selectedSection) {
                selectedSection.style.display = 'block';
            }

            // Update active nav
            document.querySelectorAll('.nav-item').forEach(link => {
                link.classList.remove('active');
            });
            event.target.classList.add('active');

            // Load section-specific data
            if (sectionName === 'analytics') {
                this.updateAnalytics();
            }
        }

        openProductModal(product = null) {
            this.editingProduct = product;
            const modal = document.getElementById('product-modal');
            const form = document.getElementById('product-form');
            const title = document.getElementById('modal-title');
            
            if (product) {
                title.textContent = 'Edit Product';
                form.productName.value = product.name;
                form.category.value = product.category;
                form.price.value = product.price;
                form.quantity.value = product.quantity;
                form.unit.value = product.unit;
                form.image.value = product.image || '';
                form.description.value = product.description || '';
            } else {
                title.textContent = 'Add New Product';
                form.reset();
            }
            
            modal.classList.add('show');
        }

        closeProductModal() {
            const modal = document.getElementById('product-modal');
            modal.classList.remove('show');
            this.editingProduct = null;
        }

        saveProduct() {
            const form = document.getElementById('product-form');
            const formData = new FormData(form);
            
            const productData = {
                name: formData.get('productName'),
                category: formData.get('category'),
                price: parseFloat(formData.get('price')),
                quantity: parseInt(formData.get('quantity')),
                unit: formData.get('unit'),
                description: formData.get('description'),
                image: formData.get('image') || `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop&q=80`,
                status: 'available'
            };

            if (this.editingProduct) {
                // Update existing product
                const index = this.products.findIndex(p => p.id === this.editingProduct.id);
                if (index !== -1) {
                    this.products[index] = { ...this.editingProduct, ...productData };
                }
            } else {
                // Add new product
                const product = {
                    id: Date.now(),
                    ...productData,
                    createdAt: new Date().toISOString()
                };
                this.products.push(product);
            }

            this.saveProducts();
            this.updateProductsDisplay();
            this.updateDashboard();
            this.closeProductModal();
            
            alert(this.editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
        }

        deleteProduct(id) {
            if (confirm('Are you sure you want to delete this product?')) {
                this.products = this.products.filter(p => p.id !== id);
                this.saveProducts();
                this.updateProductsDisplay();
                this.updateDashboard();
                alert('Product deleted successfully!');
            }
        }

        updateOrderStatus(orderId, newStatus) {
            const order = this.orders.find(o => o.id === orderId);
            if (order) {
                order.status = newStatus;
                this.saveOrders();
                this.updateOrdersDisplay();
                this.updateDashboard();
                alert(`Order status updated to ${newStatus}!`);
            }
        }

        filterOrders(status) {
            this.currentFilter = status;
            
            // Update filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('ring-2', 'ring-offset-2', 'ring-green-500');
            });
            event.target.classList.add('ring-2', 'ring-offset-2', 'ring-green-500');
            
            this.updateOrdersDisplay();
        }

        saveProducts() {
            this.saveToStorage('farmerProducts', this.products);
        }

        saveOrders() {
            this.saveToStorage('farmerOrders', this.orders);
        }

        saveProfile() {
            const form = document.getElementById('profile-form');
            const profileData = {
                name: form.querySelector('#profile-name').value,
                email: form.querySelector('#profile-email').value,
                phone: form.querySelector('#profile-phone').value,
                location: form.querySelector('#profile-location').value,
                description: form.querySelector('#profile-description').value
            };

            this.currentUser = { ...this.currentUser, ...profileData };
            this.saveToStorage('farmerProfile', this.currentUser);
            document.getElementById('farmer-name').textContent = profileData.name;
            alert('Profile updated successfully!');
        }

        updateDashboard() {
            // Update stats
            document.getElementById('total-products').textContent = this.products.length;
            document.getElementById('total-orders').textContent = this.orders.length;
            
            const totalRevenue = this.orders
                .filter(order => order.status === 'completed')
                .reduce((sum, order) => sum + order.totalAmount, 0);
            document.getElementById('total-revenue').textContent = `GH₵${totalRevenue}`;
            
            // Count unique customers
            const uniqueCustomers = new Set(this.orders.map(order => order.buyerName)).size;
            document.getElementById('total-customers').textContent = uniqueCustomers;
            
            // Update displays
            this.updateProductsDisplay();
            this.updateOrdersDisplay();
            this.updateRecentActivities();
        }

        updateProductsDisplay() {
            const container = document.getElementById('products-container');
            if (!container) return;

            if (this.products.length === 0) {
                container.innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <i class="fas fa-seedling text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-xl font-semibold text-gray-500 mb-2">No Products Yet</h3>
                        <p class="text-gray-400 mb-4">Start by adding your first product</p>
                        <button onclick="dashboard.openProductModal()" class="btn-green text-white px-6 py-3 rounded-lg">
                            <i class="fas fa-plus mr-2"></i>Add Product
                        </button>
                    </div>
                `;
                return;
            }

            container.innerHTML = '';
            
            this.products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card bg-white rounded-lg shadow-md overflow-hidden';
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover" onerror="this.src='https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop&q=80'">
                    <div class="p-4">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${
                                product.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }">${product.status}</span>
                        </div>
                        <p class="text-gray-600 text-sm mb-2 line-clamp-2">${product.description}</p>
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-green-600 font-bold text-lg">GH₵${product.price}/${product.unit}</span>
                            <span class="text-sm text-gray-500">${product.quantity} ${product.unit}(s) available</span>
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="dashboard.openProductModal(${JSON.stringify(product).replace(/"/g, '&quot;')})" class="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition">
                                <i class="fas fa-edit mr-1"></i> Edit
                            </button>
                            <button onclick="dashboard.deleteProduct(${product.id})" class="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition">
                                <i class="fas fa-trash mr-1"></i> Delete
                            </button>
                        </div>
                    </div>
                `;
                container.appendChild(productCard);
            });
        }

        updateOrdersDisplay() {
            const container = document.getElementById('orders-container');
            if (!container) return;

            let filteredOrders = this.orders;
            if (this.currentFilter !== 'all') {
                filteredOrders = this.orders.filter(order => order.status === this.currentFilter);
            }

            if (filteredOrders.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-12">
                        <i class="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
                        <h3 class="text-xl font-semibold text-gray-500 mb-2">No Orders Found</h3>
                        <p class="text-gray-400">No orders match the current filter</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = '';
            
            filteredOrders.forEach(order => {
                const orderCard = document.createElement('div');
                orderCard.className = 'bg-white rounded-lg shadow-md p-6';
                orderCard.innerHTML = `
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h4 class="text-lg font-semibold text-gray-800">Order #${order.id}</h4>
                            <p class="text-gray-600"><i class="fas fa-user mr-1"></i>Customer: ${order.buyerName}</p>
                            <p class="text-gray-600"><i class="fas fa-phone mr-1"></i>Phone: ${order.buyerPhone}</p>
                            <p class="text-sm text-gray-500"><i class="fas fa-calendar mr-1"></i>Date: ${order.date}</p>
                        </div>
                        <span class="px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                        }">${order.status}</span>
                    </div>
                    
                    <div class="mb-4">
                        <h5 class="font-medium text-gray-700 mb-2">Products:</h5>
                        <div class="space-y-1">
                            ${order.products.map(product => `
                                <div class="flex justify-between text-sm">
                                    <span>${product.name} (${product.quantity} ${product.unit})</span>
                                    <span>GH₵${product.price * product.quantity}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center pt-4 border-t border-gray-200">
                        <p class="text-lg font-bold text-gray-800">Total: GH₵${order.totalAmount}</p>
                        ${order.status === 'pending' ? `
                            <div class="space-x-2">
                                <button onclick="dashboard.updateOrderStatus(${order.id}, 'completed')" class="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 transition">
                                    <i class="fas fa-check mr-1"></i>Complete
                                </button>
                                <button onclick="dashboard.updateOrderStatus(${order.id}, 'cancelled')" class="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition">
                                    <i class="fas fa-times mr-1"></i>Cancel
                                </button>
                            </div>
                        ` : ''}
                    </div>
                `;
                container.appendChild(orderCard);
            });
        }

        updateRecentActivities() {
            const container = document.getElementById('recent-activities');
            if (!container) return;

            const activities = [];
            
            // Recent products
            const recentProducts = this.products
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 3);
            
            recentProducts.forEach(product => {
                activities.push({
                    icon: 'fas fa-plus-circle text-green-600',
                    text: `Added new product: ${product.name}`,
                    time: new Date(product.createdAt).toLocaleDateString()
                });
            });

            // Recent orders
            const recentOrders = this.orders
                .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
                .slice(0, 2);
            
            recentOrders.forEach(order => {
                activities.push({
                    icon: order.status === 'completed' ? 'fas fa-check-circle text-green-600' : 'fas fa-clock text-yellow-600',
                    text: `Order #${order.id} from ${order.buyerName}`,
                    time: new Date(order.orderDate).toLocaleDateString()
                });
            });

            if (activities.length === 0) {
                container.innerHTML = '<p class="text-gray-600">No recent activities</p>';
                return;
            }

            container.innerHTML = activities.map(activity => `
                <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <i class="${activity.icon}"></i>
                    <div class="flex-1">
                        <p class="text-sm text-gray-800">${activity.text}</p>
                        <p class="text-xs text-gray-500">${activity.time}</p>
                    </div>
                </div>
            `).join('');
        }

        updateAnalytics() {
            const topProductsContainer = document.getElementById('top-products');
            if (!topProductsContainer) return;

            // Calculate product sales from orders
            const productSales = {};
            this.orders.forEach(order => {
                if (order.status === 'completed') {
                    order.products.forEach(product => {
                        if (!productSales[product.name]) {
                            productSales[product.name] = 0;
                        }
                        productSales[product.name] += product.quantity;
                    });
                }
            });

            const topProducts = Object.entries(productSales)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5);

            if (topProducts.length === 0) {
                topProductsContainer.innerHTML = '<p class="text-gray-600">No sales data available</p>';
                return;
            }

            topProductsContainer.innerHTML = topProducts.map(([name, quantity], index) => `
                <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span class="text-sm font-bold text-green-600">${index + 1}</span>
                    </div>
                    <div class="flex-1">
                        <p class="font-medium text-gray-800">${name}</p>
                        <p class="text-sm text-gray-500">${quantity} units sold</p>
                    </div>
                </div>
            `).join('');
        }

      

    }

    function logout() {
      if (confirm('Are you sure you want to logout?')) {
        window.location.href = '../index.html';
      }
    }
    // Initialize dashboard when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        window.dashboard = new FarmerDashboard();
    });
  