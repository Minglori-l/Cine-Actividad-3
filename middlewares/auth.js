const jwt = require('jsonwebtoken');

const verificarAcceso = (rolesPermitidos) => {
    return (req, res, next) => {
        const token = req.cookies.token;

        if (!token) {
            // Si es una petición de API, respondemos con JSON. Si no, redirigimos al login.
            if (req.originalUrl.startsWith('/api')) {
                return res.status(401).json({ error: 'No autenticado. Inicie sesión.' });
            }
            return res.redirect('/users/login');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (rolesPermitidos && !rolesPermitidos.includes(req.user.rol)) {
                // 💡 SI ES UNA RUTA DE API, RESPONDEMOS CON JSON SEGURO
                if (req.originalUrl.startsWith('/api')) {
                    return res.status(403).json({ error: 'No autorizado para este rol.' });
                }
                
                // Si es una página normal, renderizamos la vista de error
                return res.status(403).render('error', {
                    message: '🚫 No tienes los permisos necesarios para acceder a esta sección.',
                    error: { status: 403, stack: 'Tu rol actual es: ' + req.user.rol }
                });
            }

            next();

        } catch (error) {
            res.clearCookie('token');
            if (req.originalUrl.startsWith('/api')) {
                return res.status(401).json({ error: 'Sesión inválida o expirada.' });
            }
            return res.redirect('/users/login');
        }
    };
};

module.exports = { verificarAcceso };