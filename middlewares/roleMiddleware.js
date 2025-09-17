// Role kontrol middleware'i
function roleMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    try {
      // authMiddleware çalıştıktan sonra req.user içi dolu olmalı
      const userRole = req.user?.role_id;

      if (!userRole) {
        return res.status(403).json({ error: "Rol bulunamadı, erişim reddedildi" });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ error: "Bu işlemi yapmaya yetkiniz yok" });
      }

      next();
    } catch (err) {
      console.error("Role middleware error:", err);
      res.status(500).json({ error: "Rol kontrolünde hata oluştu" });
    }
  };
}

module.exports = roleMiddleware;
