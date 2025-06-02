// 導入模組
import { initTheme } from './modules/theme.js';
import { initBannerSlider } from './modules/banner.js';
import { initSidebar } from './modules/sidebar.js';
import { initSearch } from './modules/search.js';
import { initCart } from './modules/cart.js';
import { initProductFilters } from './modules/products.js';
import { loadComponent } from './modules/utils.js';
import { checkAuthStatus } from './modules/auth/auth-core.js'; // 新增

// DOM 完全加載後執行
document.addEventListener('DOMContentLoaded', async () => {
    // 檢查用戶登入狀態
    const user = await checkAuthStatus();
    
    // 載入所有組件
    await Promise.all([
        loadComponent('header', 'header-container'),
        loadComponent('sidebar', 'sidebar-container'),
        loadComponent('banner', 'banner-container'),
        loadComponent('products', 'products-container'),
        loadComponent('content', 'content-container'),
        loadComponent('footer', 'footer-container')
    ]);

    // 初始化各模組
    initTheme();
    initBannerSlider();
    initSidebar();
    initSearch();
    initCart(user?.userId); // 傳遞用戶ID給購物車模組
    initProductFilters();
    
    // 更新用戶界面狀態
    updateAuthUI(user);
});

// 更新用戶界面狀態
function updateAuthUI(user) {
    const authElements = document.querySelectorAll('[data-auth]');
    authElements.forEach(el => {
        const showWhen = el.dataset.auth;
        el.style.display = (showWhen === 'logged-in' && user) || 
                            (showWhen === 'logged-out' && !user) ? '' : 'none';
    });
    
    if (user) {
        document.querySelector('.user-actions .user-icon')?.setAttribute('href', 'account.html');
    }
}