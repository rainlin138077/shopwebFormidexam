<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit("请通过 <a href='../auth/register.html'>注册表单</a> 提交数据。");
}

try {
    // 建立 PDO 連線
    $pdo = new PDO("mysql:host=127.0.0.1;port=3306;dbname=shopweb;charset=utf8mb4", "root", "12345678");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 取得表單資料
    $username = $_POST['username'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // 檢查信箱是否存在
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        exit("❌ 該信箱已註冊，請改用其他信箱。");
    }

    // 插入資料
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $stmt->execute([$username, $email, $hashedPassword]);

    echo "✅ 註冊成功！<a href='login.html'>前往登入</a>";

} catch (PDOException $e) {
    exit("❌ 資料庫錯誤：" . $e->getMessage());
}
?>
