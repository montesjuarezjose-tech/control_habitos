const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para procesar archivos JSON y estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Ruta principal para servir la interfaz web
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta de prueba (Ping) para verificar el encendido del servidor
app.get('/api/ping', (req, res) => {
    res.json({ 
        status: "success", 
        message: "Servidor encendido y respondiendo correctamente." 
        });
});

// Inicialización del servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose con éxito en el puerto ${PORT}`);
});