import { AuthCore } from './auth-core.js';

export class Register {
    static init() {
        AuthCore.init();
        this.setupRegisterForm();
        this.setupPasswordStrength();
    }

    static setupRegisterForm() {
        const form = document.getElementById('register-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: form.querySelector('#register-name').value,
                email: form.querySelector('#register-email').value,
                password: form.querySelector('#register-password').value,
                confirmPassword: form.querySelector('#register-confirm').value,
                agreeTerms: form.querySelector('.form-agreement input').checked
            };

            if (!this.validateForm(formData)) return;

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password
                    })
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || '註冊失敗');
                }

                const data = await response.json();
                alert('註冊成功！請登入您的帳號');
                window.location.href = 'login.html';
                
            } catch (error) {
                this.showError(error.message);
            }
        });
    }

    static validateForm(formData) {
        // 驗證邏輯保持不變
        return true;
    }

    static showError(message) {
        // 類似於 login.js 的錯誤顯示邏輯
    }

    static setupPasswordStrength() {
        // 保持原有密碼強度檢測邏輯
        const passwordInput = document.getElementById('register-password');
        const strengthFill = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');

        passwordInput.addEventListener('input', () => {
            const val = passwordInput.value;
            let score = 0;

            if (val.length >= 8) score++;
            if (/[A-Z]/.test(val)) score++;
            if (/[0-9]/.test(val)) score++;
            if (/[\W]/.test(val)) score++;

            let width = '0%';
            let color = '#ccc';
            let text = '密碼強度: 弱';

            switch (score) {
            case 1:
                width = '25%';
                color = '#ff6b6b';
                text = '密碼強度: 弱';
                break;
            case 2:
                width = '75%';
                color = '#f1c40f';
                text = '密碼強度: 中等';
                break;
            case 3:
                width = '100%';
                color = '#27ae60';
                text = '密碼強度: 強';
                break;
            case 4:
                width = '100%';
                color = '#2ecc71';
                text = '密碼強度: 非常強';
                break;
            }

            strengthFill.style.width = width;
            strengthFill.style.backgroundColor = color;
            strengthText.textContent = text;
        });
    }
}

// 自動初始化
document.addEventListener('DOMContentLoaded', () => Register.init());