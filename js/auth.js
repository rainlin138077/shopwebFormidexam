// 密碼顯示/隱藏切換
document.addEventListener('DOMContentLoaded', function() {
    // 密碼可見性切換
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });
    
    // 密碼強度檢測 (註冊頁面)
    const passwordInput = document.getElementById('register-password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strengthBar = document.querySelector('.strength-bar');
            const strengthText = document.querySelector('.strength-text');
            const password = this.value;
            let strength = 0;
            
            // 檢測密碼強度
            if (password.length >= 8) strength += 1;
            if (password.match(/[A-Z]/)) strength += 1;
            if (password.match(/[0-9]/)) strength += 1;
            if (password.match(/[^A-Za-z0-9]/)) strength += 1;
            
            // 更新UI
            const width = strength * 25;
            strengthBar.style.width = width + '%';
            
            if (strength <= 1) {
                strengthBar.style.backgroundColor = '#ff6b6b';
                strengthText.textContent = '密碼強度: 弱';
            } else if (strength <= 3) {
                strengthBar.style.backgroundColor = '#ffb74d';
                strengthText.textContent = '密碼強度: 中';
            } else {
                strengthBar.style.backgroundColor = '#4caf50';
                strengthText.textContent = '密碼強度: 強';
            }
        });
    }
    
    // 表單提交處理
    document.querySelectorAll('.auth-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 驗證確認密碼 (註冊頁面)
            if (this.id === 'register-form') {
                const password = document.getElementById('register-password').value;
                const confirm = document.getElementById('register-confirm').value;
                
                if (password !== confirm) {
                    alert('兩次輸入的密碼不一致！');
                    return;
                }
            }
            
            // 這裡添加實際的登入/註冊邏輯
            alert('表單驗證通過，準備提交...');
            // 實際應用中這裡會發送AJAX請求到後端
        });
    });
});