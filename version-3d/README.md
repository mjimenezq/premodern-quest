# Magic The Beer Quest — versión 3D

Prototipo independiente de la versión 2D, con estética de pocos polígonos inspirada en PlayStation 1 y Nintendo 64. Enlace: https://mjimenezq.github.io/premodern-quest/version-3d/

Incluye Curicó y una tienda TCG basadas en los mapas actuales, edificios y personajes tridimensionales, caminata articulada, cámara de ciudad/aventura, rotación, iluminación día/atardecer/noche y controles de teclado y pantalla táctil. Es una prueba visual; no incluye combates, misiones ni guardado. No accede a localStorage, no importa el motor original y no modifica partidas 2D.

Para probar, servir la carpeta raíz del repositorio con un servidor HTTP y abrir `/version-3d/`. Pruebas: `node version-3d/tests.mjs`.

Motor Three.js 0.186.1, distribuido localmente bajo licencia MIT en `vendor/package/LICENSE`. Fuente oficial: https://registry.npmjs.org/three/-/three-0.186.1.tgz. No requiere un CDN al jugar. Necesita WebGL 2. Los modelos se generan con geometría propia; no usa recursos de Nintendo o Sony.

Siguientes etapas: probar la dirección visual, mejorar los modelos y texturas, incorporar movimiento/colisiones continuas, luego portar por separado combate, cartas, inventario y progresión. Cualquier guardado 3D futuro debe usar claves propias y conservar intactas las claves `pmq_*` del original.
