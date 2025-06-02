// 用戶註冊
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        // 檢查郵箱是否已註冊
        const [existing] = await pool.query(
            'SELECT * FROM users WHERE email = ?', 
            [email]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: '該郵箱已被註冊' });
        }
        
        // 密碼哈希 (實際應用中應使用bcrypt等庫)
        const passwordHash = password; // 這裡應該使用加密
        
        // 創建用戶
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [name, email, passwordHash]
        );
        
        res.json({ success: true, userId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '註冊失敗' });
    }
});

// 用戶登入
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?', 
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: '無效的郵箱或密碼' });
        }
        
        const user = users[0];
        
        // 驗證密碼 (實際應用中應使用bcrypt.compare)
        if (password !== user.password_hash) {
            return res.status(401).json({ error: '無效的郵箱或密碼' });
        }
        
        // 生成JWT令牌 (實際應用中應使用jsonwebtoken等庫)
        const token = `fake-jwt-token-${user.user_id}`;
        
        res.json({ 
            success: true, 
            token,
            user: {
                userId: user.user_id,
                name: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '登入失敗' });
    }
});

// 檢查登入狀態
app.get('/api/auth/status', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: '未授權' });
    }
    
    // 驗證令牌 (簡化示例)
    const userId = token.replace('fake-jwt-token-', '');
    
    try {
        const [users] = await pool.query(
            'SELECT user_id, username, email FROM users WHERE user_id = ?', 
            [userId]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: '無效的令牌' });
        }
        
        res.json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '伺服器錯誤' });
    }
});