# Cartas Pokémon

Imágenes originales de las 88 cartas clave de las diez barajas Pokémon del juego, identificadas por edición y número. Se cargan individualmente cuando una carta se muestra, sin descargar el catálogo completo al iniciar.

Las imágenes pertenecen a The Pokémon Company, Nintendo, Creatures y GAME FREAK. Referencias de las ediciones e imágenes públicas: Limitless TCG. `sources.json` enlaza la ficha e imagen de cada carta; también conserva PS y premios de los 50 Pokémon. El juego adapta el combate al RPG y no simula todas las reglas oficiales del TCG.

Ejemplos: [Dragapult ex, TWM 130](https://limitlesstcg.com/cards/TWM/130), [Mega Absol ex, MEG 86](https://limitlesstcg.com/cards/MEG/86).

`node tools/fetch-pokemon-art.cjs` reconstruye el catálogo y sus datos. Mantiene archivos existentes y falla si una imagen o sus PS no están disponibles.
