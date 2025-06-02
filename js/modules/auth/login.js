import { AuthCore } from './auth-core.js';

export class Login {
    static init() {
        AuthCore.init();
        this.setupLoginForm();
        this.initSocialLogin();
    }

    static setupLoginForm() {
        const form = document.getElementById('login-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = form.querySelector('#login-email').value;
            const password = form.querySelector('#login-password').value;
            const rememberMe = form.querySelector('[name="remember"]').checked;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, rememberMe })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || '登入失敗');
                }

                const data = await response.json();
                
                // 存儲認證令牌
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                }
                
                // 重定向或更新UI
                const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
                window.location.href = redirectUrl;
                
            } catch (error) {
                this.showError(error.message);
            }
        });
    }

    static showError(message) {
        const errorElement = document.getElementById('login-error') || document.createElement('div');
        errorElement.id = 'login-error';
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        const form = document.getElementById('login-form');
        if (!form.querySelector('#login-error')) {
            form.prepend(errorElement);
        }
    }

    static initSocialLogin() {
        // 保持原有社交登入邏輯
    }
}

// 自動初始化
document.addEventListener('DOMContentLoaded', () => Login.init());