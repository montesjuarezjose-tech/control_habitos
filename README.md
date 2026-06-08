# Control de Hábitos

Aplicación web sencilla para registrar y llevar el control de hábitos o conductas que quieras monitorizar (por ejemplo tabaco, alcohol, comida chatarra, redes sociales u otras personalizadas).

## Características

- **Lista de hábitos** con opciones predefinidas o nombre propio con emoji.
- **Detalle por hábito**: fecha de inicio, contador total, botón **+1** para sumar un registro.
- **Gráfica de progreso mensual** (Chart.js).
- **Historial** de registros en la pantalla de detalle.
- **Edición** del nombre y del emoji de cada hábito.
- **Eliminación** del hábito desde el detalle.
- **Frases motivacionales** aleatorias en la vista de detalle.
- Los datos se guardan en el **navegador** (`localStorage`); no hace falta servidor ni base de datos.

## Requisitos

- Un navegador moderno con JavaScript habilitado.
- Conexión a internet la **primera vez** que cargues la página, para descargar Chart.js desde el CDN. Después puedes trabajar sin conexión si el recurso ya está en caché.

## Cómo usarla

### Con Node.js (recomendado)

1. Instala dependencias: `npm install`
2. Arranca el servidor: `npm start`
3. Abre en el navegador: `http://localhost:3000` (o el puerto que indique la consola).

Variable opcional: `PORT` para usar otro puerto (por ejemplo `PORT=8080 npm start` en Unix; en Windows PowerShell: `$env:PORT=8080; npm start`).

### Sin servidor

También puedes abrir `public/index.html` directamente en el navegador. Algunas funciones pueden comportarse distinto según el navegador al usar `file://`.

## Estructura del proyecto

| Ruta | Descripción |
|------|-------------|
| `server.js` | Servidor Express que sirve archivos estáticos |
| `package.json` | Dependencias y script `npm start` |
| `public/index.html` | Estructura y pantallas de la app |
| `public/style.css` | Estilos |
| `public/script.js` | Lógica, gráfica y persistencia |

## Datos locales

La clave en `localStorage` es `habitsJSON`. Si borras los datos del sitio en el navegador, perderás el historial guardado ahí.
