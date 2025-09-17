const authService = require('../services/authService');

const register = async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  try {
    const result = await authService.register(email, password, first_name, last_name);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await authService.login(email, password);

    // refreshToken'ı HTTP-only cookie olarak ayarla
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // prod'da HTTPS zorunlu
      sameSite: 'Lax', // farklı domain kullanıyorsan: 'None' ve secure:true
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
    });

    // response body'den refreshToken'ı çıkar
    const { refreshToken, ...safe } = result;
    res.status(200).json(safe);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// authController.js
const logout = async (req, res) => {
  try {
    console.log(">>> LOGOUT endpoint tetiklendi, req.user:", req.user);

    const user_id = req.user.user_id;
    await authService.logout(user_id);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    });

    res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error(">>> LOGOUT HATASI:", error);
    res.status(500).json({ error: error.message });
  }
};




// DEĞİŞTİR: refreshToken (tamamını bununla değiştir)
const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken; // 🍪 cookie'den al

  try {
    const result = await authService.refreshAccessToken(token);

    // Yeni refresh token'ı rotate edip tekrar cookie'ye yaz
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax', // farklı domain kullanıyorsan 'None' + secure:true
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Body’den refreshToken’ı çıkarıp sadece güvenli kısımları gönder
    const { refreshToken, ...safe } = result;
    res.status(200).json(safe);
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
};


const verifyUser = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    const user = await authService.verifyUser(token);
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  verifyUser,
};
