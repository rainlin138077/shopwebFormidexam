// 購物車API服務
class CartService {
    static async getCart(userId) {
    try {
        const response = await fetch(`/api/cart/${userId}`);
        console.log('API 回應:', response);

        if (!response.ok) {
            const text = await response.text();
            console.error('API 錯誤回應內容:', text);
            throw new Error('無法獲取購物車');
        }

        return await response.json();
    } catch (err) {
        console.error('Fetch 錯誤:', err);
        throw err;
    }
}

    static async addItem(userId, productId, quantity = 1, options = {}) {
        const response = await fetch(`/api/cart/${userId}/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, quantity, options })
        });
        if (!response.ok) throw new Error('無法添加商品到購物車');
        return await response.json();
    }

    static async updateItem(itemId, quantity) {
        const response = await fetch(`/api/cart/item/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
        });
        if (!response.ok) throw new Error('無法更新購物車項目');
        return await response.json();
    }

    static async removeItem(itemId) {
        const response = await fetch(`/api/cart/item/${itemId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('無法從購物車移除商品');
        return await response.json();
    }

    static async checkout(userId, paymentMethod, shippingAddress) {
        const response = await fetch(`/api/cart/${userId}/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentMethod, shippingAddress })
        });
        if (!response.ok) throw new Error('結帳失敗');
        return await response.json();
    }
}

// 渲染購物車
async function renderCart() {
    try {
        // 假設用戶已登入，這裡用1作為示例用戶ID
        const userId = 1;
        const cartItems = await CartService.getCart(userId);
        
        const cartContainer = document.querySelector('.cart-items');
        if (!cartContainer) return;
        
        // 清空現有內容（保留表頭）
        const header = cartContainer.querySelector('.cart-header');
        cartContainer.innerHTML = '';
        if (header) cartContainer.appendChild(header);
        
        if (cartItems.length === 0) {
            cartContainer.innerHTML += '<div class="empty-cart">您的購物車是空的</div>';
            return;
        }
        
        // 渲染每個商品
        let totalItems = 0;
        let subtotal = 0;
        
        cartItems.forEach(item => {
            totalItems += item.quantity;
            subtotal += item.subtotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.dataset.itemId = item.cart_item_id;
            
            itemElement.innerHTML = `
                <div class="item-info">
                    <img src="${item.image_url}" alt="${item.name}" class="product-image">
                    <div class="product-details">
                        <h3>${item.name}</h3>
                        ${item.options ? `<p>${Object.entries(JSON.parse(item.options)).map(([k, v]) => `${k}: ${v}`).join(' | ')}</p>` : ''}
                    </div>
                </div>
                <div class="item-price">NT$${item.price.toLocaleString()}</div>
                <div class="item-quantity">
                    <button class="quantity-btn minus"><i class="fas fa-minus"></i></button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                    <button class="quantity-btn plus"><i class="fas fa-plus"></i></button>
                </div>
                <div class="item-subtotal">NT$${item.subtotal.toLocaleString()}</div>
                <div class="item-action">
                    <button class="remove-btn"><i class="fas fa-trash"></i></button>
                </div>
            `;
            
            cartContainer.appendChild(itemElement);
        });
        
        // 更新摘要
        updateSummary(totalItems, subtotal);
        
        // 綁定事件
        bindCartEvents();
    } catch (error) {
        console.error('渲染購物車失敗:', error);
        alert('無法載入購物車: ' + error.message);
    }
}

// 更新訂單摘要
function updateSummary(itemCount, subtotal) {
    const shipping = 60;
    const discount = 300;
    const total = subtotal + shipping - discount;
    
    document.querySelector('.summary-row:nth-child(1) span:last-child').textContent = 
        `NT$${subtotal.toLocaleString()}`;
    document.querySelector('.summary-row:nth-child(1) span:first-child').textContent = 
        `商品總計 (${itemCount}件)`;
    document.querySelector('.summary-row.total span:last-child').textContent = 
        `NT$${total.toLocaleString()}`;
}

// 綁定購物車事件
function bindCartEvents() {
    // 數量加減
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', async function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            
            if (this.classList.contains('plus')) {
                value++;
            } else {
                value = value > 1 ? value - 1 : 1;
            }
            
            input.value = value;
            await updateCartItem(this.closest('.cart-item'));
        });
    });
    
    // 手動輸入數量
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', async function() {
            if (this.value < 1) this.value = 1;
            await updateCartItem(this.closest('.cart-item'));
        });
    });
    
    // 移除商品 - 修改後的代碼
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', async function() {
            const itemElement = this.closest('.cart-item');
            const itemId = itemElement.dataset.itemId;
            
            if (confirm('確定要移除此商品嗎？')) {
                try {
                    // 先顯示移除動畫
                    itemElement.style.opacity = '0.5';
                    itemElement.style.transition = 'opacity 0.3s ease';
                    
                    // 發送API請求
                    const response = await CartService.removeItem(itemId);
                    
                    // 檢查API是否真的成功
                    if (response && response.success !== false) {
                        // 直接從DOM移除，避免重新渲染整個購物車
                        itemElement.style.transition = 'all 0.3s ease';
                        itemElement.style.height = `${itemElement.offsetHeight}px`;
                        itemElement.offsetHeight; // 觸發重繪
                        itemElement.style.height = '0';
                        itemElement.style.padding = '0';
                        itemElement.style.margin = '0';
                        itemElement.style.opacity = '0';
                        
                        setTimeout(() => {
                            itemElement.remove();
                            // 更新摘要
                            updateSummaryAfterRemoval();
                        }, 300);
                    } else {
                        throw new Error(response?.message || '移除失敗');
                    }
                } catch (error) {
                    console.error('移除商品錯誤:', error);
                    itemElement.style.opacity = '1';
                    alert('移除商品失敗: ' + error.message);
                }
            }
        });
    });
}

// 更新摘要（移除商品後專用）
function updateSummaryAfterRemoval() {
    let itemCount = 0;
    let subtotal = 0;
    
    document.querySelectorAll('.cart-item').forEach(item => {
        const quantity = parseInt(item.querySelector('.quantity-input').value);
        const priceText = item.querySelector('.item-price').textContent;
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        
        itemCount += quantity;
        subtotal += quantity * price;
    });
    
    const shipping = 60;
    const discount = 300;
    const total = subtotal + shipping - discount;
    
    document.querySelector('.summary-row:nth-child(1) span:last-child').textContent = 
        `NT$${subtotal.toLocaleString()}`;
    document.querySelector('.summary-row:nth-child(1) span:first-child').textContent = 
        `商品總計 (${itemCount}件)`;
    document.querySelector('.summary-row.total span:last-child').textContent = 
        `NT$${total.toLocaleString()}`;
    
    // 如果購物車空了，顯示提示
    if (itemCount === 0) {
        const cartContainer = document.querySelector('.cart-items');
        const header = cartContainer.querySelector('.cart-header');
        cartContainer.innerHTML = '';
        if (header) cartContainer.appendChild(header);
        cartContainer.innerHTML += '<div class="empty-cart">您的購物車是空的</div>';
    }
}

// 更新購物車項目
async function updateCartItem(itemElement) {
    const itemId = itemElement.dataset.itemId;
    const quantity = parseInt(itemElement.querySelector('.quantity-input').value);
    
    try {
        await CartService.updateItem(itemId, quantity);
        renderCart();
    } catch (error) {
        alert('更新購物車失敗: ' + error.message);
    }
}

// 結帳按鈕
document.querySelector('.checkout-btn')?.addEventListener('click', async function() {
    try {
        // 假設用戶已登入，這裡用1作為示例用戶ID
        const userId = 1;
        const result = await CartService.checkout(userId, 'credit_card', {});
        alert(`訂單 #${result.orderId} 已成功建立！`);
        window.location.href = 'order-confirmation.html?id=' + result.orderId;
    } catch (error) {
        alert('結帳失敗: ' + error.message);
    }
});

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    
    // 推薦商品加入購物車
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', async function() {
            const productId = this.dataset.productId;
            try {
                await CartService.addItem(1, productId); // 使用示例用戶ID
                alert('商品已加入購物車');
                renderCart();
            } catch (error) {
                alert('加入購物車失敗: ' + error.message);
            }
        });
    });
});