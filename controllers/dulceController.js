const Dulce = require('../models/Dulce');

class DulceController {
    async listarTodo(req, res) {
        try {
            const dulces = await Dulce.obtenerTodos();
            res.json(dulces);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async agregar(req, res) {
        try {
            const { nombre, categoria, precio, stock } = req.body;

            if (!nombre || !categoria || !precio || isNaN(precio)) {
                return res.status(400).json({ error: "Por favor completa lo requerido" });       
            }

            await Dulce.crear(nombre, categoria, precio, stock || 0);

            // Verificamos si la petición viene desde un formulario HTML
            const contentType = req.headers['content-type'] || '';
            if (contentType.includes('application/x-www-form-urlencoded')) {
                // 🟢 CORREGIDO: De '/api/dulces/catogo' a la ruta correcta del catálogo
                return res.redirect('/api/dulces/catalogo');
            }

            res.status(201).json({ mensaje: "Producto de dulcería agregado con éxito!" });
        } catch (error) {
            // 🟢 CORREGIDO: De 'error.mensage' a 'error.message'
            res.status(500).json({ error: error.message });
        }
    }

    async editar(req, res) {
        try {
            const { nombre, categoria, precio, stock } = req.body;
            const result = await Dulce.actualizar(req.params.id, nombre, categoria, precio, stock);

            if (result.affectedRows === 0) {
                return res.status(404).json({ mensaje: "Producto no encontrado" });
            }

            const contentType = req.headers['content-type'] || '';
            if (contentType.includes('application/x-www-form-urlencoded')) {
                return res.redirect('/api/dulces/catalogo');
            }

            res.json({ mensaje: "Producto actualizado correctamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            const result = await Dulce.eliminar(req.params.id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ mensaje: "Producto no eliminado" });
            }
            res.json({ mensaje: "Producto eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async vistaDulces(req, res) {
    try {
        const dulces = await Dulce.obtenerTodos();
        
        // 🟢 Ponlo en PLURAL si tu archivo es dulces.ejs:
        res.render('dulces', {
            titulo: 'Gestión de Dulcería',
            dulces,
            usuario: req.user || null
        });
    } catch (error) {
        res.status(500).send("Error al cargar la vista de dulcería");
    }
}
}

module.exports = new DulceController();