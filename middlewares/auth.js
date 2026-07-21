const jwt = require('jsonwebtoken');

const verificarAcceso = (rolesPermitidos) => {
    return (req, res, next) => {
        const token = req.cookies.token;

        // 🎯 DETECCIÓN DINÁMICA: ¿El navegador está pidiendo una vista gráfica (HTML)?
        const esNavegador = req.headers.accept && req.headers.accept.includes('text/html');

        // 1. SI NO HAY TOKEN
        if (!token) {
            if (esNavegador) {
                // 👈 🚨 Redirige notificando que necesita sesión
                return res.redirect('/users/login?mensaje=requerido'); 
            }
            return res.status(401).json({ error: 'No autenticado. Inicie sesión.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = decoded;
            res.locals.user = decoded; // Hace disponible 'user' en todas las vistas EJS

            // 2. VALIDACIÓN DE ROLES
            if (rolesPermitidos && rolesPermitidos.length > 0) {
                const rolUsuario = req.user.rol ? req.user.rol.toLowerCase() : '';
                const tienePermiso = rolesPermitidos.some(r => r.toLowerCase() === rolUsuario);

                if (!tienePermiso) {
                    if (esNavegador) {
                        return res.status(403).render('error', {
                            message: '🚫 No tienes los permisos necesarios para acceder a esta sección.',
                            error: { status: 403, stack: 'Tu rol actual es: ' + (req.user.rol || 'Sin Rol') }
                        });
                    }
                    return res.status(403).json({ error: 'No autorizado para este rol.' });
                }
            }

            next();

        } catch (error) {
            // 3. TOKEN INVÁLIDO O EXPIRADO
            res.clearCookie('token');
            if (esNavegador) {
                // 👈 🚨 Redirige notificando que la sesión caducó
                return res.redirect('/users/login?mensaje=expirado');
            }
            return res.status(401).json({ error: 'Sesión inválida o expirada.' });
        }
    };
};

module.exports = { verificarAcceso };