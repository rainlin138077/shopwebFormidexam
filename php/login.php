<?php
// 连接数据库
$pdo = new PDO("mysql:host=127.0.0.1;port=3306;dbname=shopweb", "root", "12345678");

// 获取用户输入
$email = $_POST['email'];
$password = $_POST['password'];

// 查询用户是否存在
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if ($user && password_verify($password, $user['password'])) {
    echo "登录成功！欢迎 " . htmlspecialchars($user['username']);
} else {
    echo "邮箱或密码错误！";
}
?>