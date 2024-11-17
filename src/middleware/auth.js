export const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ error: "No autorizado. Debe autenticarse." });
    }

    if (!rolesPermitidos.includes(user.role)) {
        return res.status(403).json({ error: "No tiene permiso para acceder a esta ruta." });
    }

    next();
    };
};

export function authenticateJWT (req, res, next) {
    const token = req.cookies.sestoken || req.headers.authorization?.split(' ')[1];
    if (!token) return res.redirect("/login");

    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) return res.redirect("/login");
        req.user = user;
        next();
    });
};
export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        return res.status(403).json({ error: "Solo los administradores pueden acceder a esta ruta." });
    }
};

export const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        return next();
    } else {
        return res.status(403).json({ error: "Solo los usuarios pueden acceder a esta ruta." });
    }
};