import { debounce } from './utils.js';

// 商品篩選功能
export function initProductFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    const productGrid = document.querySelector('.product-grid');
    
    if (!categoryFilter || !sortBy || !productGrid) return;
    
    // 使用防抖優化性能
    const debouncedFilter = debounce(filterAndSortProducts, 300);
    
    categoryFilter.addEventListener('change', debouncedFilter);
    sortBy.addEventListener('change', debouncedFilter);
    
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
            const priceA = parseFloat(a.dataset.price);
            const priceB = parseFloat(b.dataset.price);
            const dateA = new Date(a.dataset.date);
            const dateB = new Date(b.dataset.date);
            
            switch(sortMethod) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'newest':
                    return dateB - dateA;
                default: // popular
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

// 初始化願望清單功能
export function initWishlist() {
    document.addEventListener('click', function(e) {
        const wishlistBtn = e.target.closest('.add-to-wishlist');
        if (!wishlistBtn) return;
        
        wishlistBtn.classList.toggle('active');
        const icon = wishlistBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
        }
        
        const productName = wishlistBtn.closest('.product-card')?.querySelector('.product-title')?.textContent || '商品';
        const action = wishlistBtn.classList.contains('active') ? '加入' : '移除';
        showToast(`${productName} 已${action}願望清單`);
    });
}