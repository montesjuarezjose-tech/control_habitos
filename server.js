// Importamos las librerías necesarias de Node.js
const express = require('express');
const path = require('path');
const app = express();

// Definimos el puerto (usará el 3000 por defecto)
const PORT = 3000;

// ==========================================
// CONFIGURACIÓN DE LA CARPETA CORRECTA
// ==========================================
// Al agregar 'private', le decimos a Express que todos tus archivos (CSS, JS, imágenes) 
// viven dentro de esa carpeta y debe darlos desde ahí.
app.use(express.static(path.join(__dirname, 'public')));

// Le indicamos que cuando entres a la ruta principal ('/'), 
// vaya a buscar el index.html específicamente dentro de la carpeta 'private'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==========================================
// ENCENDIDO DEL SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`🚀 ¡Servidor encendido y funcionando con éxito!`);
    console.log(`📂 Apuntando a la carpeta: ${path.join(__dirname, 'private')}`);
    console.log(`🌐 Por favor, abre tu navegador en: http://localhost:${PORT}`);
    console.log(`=========================================\n`);
});