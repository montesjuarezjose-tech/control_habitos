const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`🚀 ¡Servidor encendido y funcionando con éxito!`);
    console.log(`📂 Apuntando a la carpeta: ${path.join(__dirname, 'public')}`);
    console.log(`🌐 Por favor, abre tu navegador en: http://localhost:${PORT}`);
    console.log(`=========================================\n`);
});