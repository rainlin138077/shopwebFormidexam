// 載入組件
export async function loadComponent(componentName, containerId) {
    try {
        const response = await fetch(`components/${componentName}.html`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const html = await response.text();
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = html;
        } else {
            console.error(`Container element with ID '${containerId}' not found`);
        }
    } catch (error) {
        console.error(`Error loading ${componentName}:`, error);
    }
}

// 其他工具函數
export function formatPrice(price) {
    return `NT$${price.toLocaleString()}`;
}

export function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}   