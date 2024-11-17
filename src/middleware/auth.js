export const isAdmin = (req, res, next) => {
    const user = req.user; 

    if (user && user.role === 'admin') {
        return next(); 
    }

    return res.status(403).json({ success: false, message: 'Acceso denegado. Solo los administradores pueden ver los carritos.' });
};

export function soloUser(req, res, next) {
    if(req.user.role === "user") {
        next(); 
    } else {
        res.status(403).send("Acceso denegado, este lugar es solo para usuarios");
    }

}

export function authenticateJWT (req, res, next) {
    const token = req.cookies["coderCookieToken"];
    if (!token) return res.redirect("/login");

    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) return res.redirect("/login");
        req.user = user;
        next();
    });
};