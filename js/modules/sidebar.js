// 側邊欄功能
export function initSidebar() {
    const toggleBtn = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');

    // 控制收合
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function () {
            sidebar.classList.toggle('collapsed');
        });
    }

    // 點擊連結時平滑捲動
    const sidebarLinks = sidebar?.querySelectorAll('a[href^="#"]');
    if (sidebarLinks) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault(); // 阻止預設跳轉

                const targetId = this.getAttribute('href').substring(1); // 拿掉 #
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}
