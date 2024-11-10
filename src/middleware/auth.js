export const isAdmin = (req, res, next) => {
    const user = req.user; // Asumiendo que el usuario está en req.user (después de pasar por Passport)

    if (user && user.role === 'admin') {
        return next(); // Si es admin, continúa con la siguiente función (el controlador)
    }

    return res.status(403).json({ success: false, message: 'Acceso denegado. Solo los administradores pueden ver los carritos.' });
};

export function soloUser(req, res, next) {
    if(req.user.role === "user") {
        next(); 
    } else {
        res.status(403).send("Acceso denegado, este lugar es solo para usuarios comunachos");
    }

}