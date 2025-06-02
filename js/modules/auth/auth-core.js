// 共用認證功能
export class AuthCore {
    // 初始化共用功能
    static init() {
        this.setupPasswordToggle();
        this.setupThemeToggle();
    }

    static async checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        if (!token) return null;

        try {
            const response = await fetch('/api/auth/status', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.error('檢查登入狀態失敗:', error);
            return null;
        }
    }

    // 密碼顯示/隱藏切換
    static setupPasswordToggle() {
        document.addEventListener('click', function(e) {
            if (e.target.closest('.toggle-password')) {
                const button = e.target.closest('.toggle-password');
                const input = button.parentElement.querySelector('input');
                const icon = button.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.replace('fa-eye', 'fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.replace('fa-eye-slash', 'fa-eye');
                }
            }
        });
    }

    // 主題切換功能
    static setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('dark-mode')) {
                icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });

        // 初始化主題
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            const icon = themeToggle.querySelector('i');
            if (icon) icon.classList.replace('fa-moon', 'fa-sun');
        }
    }

    // 表單提交處理
    static handleFormSubmit(formId, callback) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                await callback(data);
            } catch (error) {
                console.error('認證錯誤:', error);
                alert(error.message || '發生錯誤，請稍後再試');
            }
        });
    }

    //登出
    static async logout() {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    }
}