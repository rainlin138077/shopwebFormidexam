// 購物車數據
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM 完全加載後執行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化輪播圖
    initBannerSlider();
    
    // 初始化側邊欄
    initSidebar();
    
    // 初始化搜索功能
    initSearch();
    
    // 初始化主題模式
    initTheme();
    
    // 更新購物車數量
    updateCartCount();
});

// 輪播圖功能
function initBannerSlider() {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;
    
    // 顯示指定幻燈片
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    // 下一張
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // 上一張
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // 開始自動輪播
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // 停止自動輪播
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    // 初始化輪播
    if(slides.length > 0) {
        showSlide(0);
        startAutoSlide();
        
        // 按鈕控制
        document.querySelector('.next-banner')?.addEventListener('click', function() {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
        
        document.querySelector('.prev-banner')?.addEventListener('click', function() {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
        
        // 點點控制
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                showSlide(index);
                stopAutoSlide();
                startAutoSlide();
            });
        });
    }
}

// 側邊欄功能
function initSidebar() {
    const toggleBtn = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
}


// 搜索功能
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            // 實際應用中這裡會發送搜尋請求或過濾商品
            alert(`搜尋: ${query}`);
            // window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// 主題模式功能
document.addEventListener('DOMContentLoaded', function() {
    // 獲取主題切換按鈕
    const themeToggle = document.querySelector('.theme-toggle');
    
    // 檢查本地存儲中的主題偏好，如果沒有則根據系統偏好設置
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 初始化主題
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    
    // 點擊按鈕切換主題
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        
        // 保存用戶選擇
        localStorage.setItem('theme', newTheme);
    });
    
    // 監聽系統主題變化（僅在用戶沒有手動設置時生效）
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
});

// 設置主題的函數
function setTheme(theme) {
    const themeIcon = document.querySelector('.theme-toggle i');
    
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        // 切換為太陽圖標
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.body.classList.remove('dark-mode');
        // 切換為月亮圖標
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
}

// 更新購物車數量
function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// 添加到購物車
function addToCart(productId, quantity = 1, options = {}) {
    // 這裡應該是從數據庫獲取產品信息
    const product = {
        id: productId,
        name: `產品 ${productId}`,
        price: 100 * productId,
        image: `images/product${productId}.jpg`
    };
    
    // 檢查是否已存在相同商品
    const existingItem = cart.find(item => 
        item.id === productId && 
        JSON.stringify(item.options) === JSON.stringify(options)
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity,
            options
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// 在 DOMContentLoaded 事件監聽器內添加以下代碼

// 商品篩選功能
const categoryFilter = document.getElementById('category-filter');
const sortBy = document.getElementById('sort-by');
const productGrid = document.querySelector('.product-grid');

if (categoryFilter && sortBy && productGrid) {
    // 篩選商品
    categoryFilter.addEventListener('change', filterAndSortProducts);
    sortBy.addEventListener('change', filterAndSortProducts);
    
    function filterAndSortProducts() {
        const selectedCategory = categoryFilter.value;
        const sortMethod = sortBy.value;
        const products = Array.from(document.querySelectorAll('.product-card'));
        
        // 篩選
        let filteredProducts = products;
        if (selectedCategory !== 'all') {
            filteredProducts = products.filter(product => 
                product.dataset.category === selectedCategory
            );
        }
        
        // 排序
        filteredProducts.sort((a, b) => {
            switch(sortMethod) {
                case 'price-low':
                    return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
                case 'price-high':
                    return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
                case 'newest':
                    return new Date(b.dataset.date) - new Date(a.dataset.date);
                default: // popular (默認)
                    return 0; // 保持原始順序
            }
        });
        
        // 重新排列商品
        productGrid.innerHTML = '';
        filteredProducts.forEach(product => {
            productGrid.appendChild(product);
        });
    }
}

// 加入購物車功能
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('.product-title').textContent;
        const productPrice = productCard.querySelector('.current-price').textContent;
        
        // 更新購物車數量
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            let count = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = count + 1;
            cartCount.classList.add('pulse');
            setTimeout(() => cartCount.classList.remove('pulse'), 500);
        }
        
        // 顯示添加成功通知
        showToast(`${productName} 已加入購物車`);
    }
    
    // 加入願望清單
    if (e.target.classList.contains('add-to-wishlist') || 
        e.target.closest('.add-to-wishlist')) {
        const btn = e.target.classList.contains('add-to-wishlist') ? 
                e.target : e.target.closest('.add-to-wishlist');
        btn.classList.toggle('active');
        btn.querySelector('i').classList.toggle('far');
        btn.querySelector('i').classList.toggle('fas');
        
        const productName = btn.closest('.product-card').querySelector('.product-title').textContent;
        const action = btn.classList.contains('active') ? '加入' : '移除';
        showToast(`${productName} 已${action}願望清單`);
    }
});

// 顯示通知
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// 分頁按鈕功能
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('page-btn') && !e.target.classList.contains('active')) {
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        // 這裡可以添加加載相應頁面商品的AJAX請求
    }
});