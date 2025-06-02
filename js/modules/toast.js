// 顯示通知
export function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 顯示通知
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 隱藏並移除通知
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}