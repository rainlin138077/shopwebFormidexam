document.addEventListener('DOMContentLoaded', function() {
    // 數量加減功能
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            
            if (this.classList.contains('plus')) {
                value++;
            } else {
                value = value > 1 ? value - 1 : 1;
            }
            
            input.value = value;
            updateSubtotal(this.closest('.cart-item'));
        });
    });
    
    // 手動輸入數量
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            if (this.value < 1) this.value = 1;
            updateSubtotal(this.closest('.cart-item'));
        });
    });
    
    // 更新小計
    function updateSubtotal(item) {
        const price = parseFloat(item.querySelector('.item-price').textContent.replace('NT$', '').replace(',', ''));
        const quantity = parseInt(item.querySelector('.quantity-input').value);
        const subtotal = item.querySelector('.item-subtotal');
        
        subtotal.textContent = 'NT$' + (price * quantity).toLocaleString();
        updateTotal();
    }
    
    // 更新總計
    function updateTotal() {
        let subtotal = 0;
        document.querySelectorAll('.item-subtotal').forEach(item => {
            subtotal += parseFloat(item.textContent.replace('NT$', '').replace(',', ''));
        });
        
        const totalElement = document.querySelector('.summary-row.total span:last-child');
        totalElement.textContent = 'NT$' + (subtotal + 60 - 300).toLocaleString();
    }
    
    // 移除商品
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('確定要移除此商品嗎？')) {
                this.closest('.cart-item').remove();
                updateTotal();
            }
        });
    });
    
    // 加入推薦商品
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            alert('商品已加入購物車');
            // 實際應用中這裡會更新購物車數據
        });
    });
});