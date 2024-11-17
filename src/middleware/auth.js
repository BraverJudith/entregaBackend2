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
    const token = req.cookies.sestoken;
    if (!token) return res.redirect("/login");

    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) return res.redirect("/login");
        req.user = user;
        next();
    });
};