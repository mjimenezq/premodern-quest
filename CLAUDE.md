# Magic The Beer Quest — contexto del proyecto

Proyecto independiente. Hablar con Matías en español de Chile y explicar de forma simple. Mantener este juego separado de El Contenedor y de los demás juegos.
El juego abre directamente desde `index.html`; el historial Git del proyecto se conserva en `.git`.


## premodern-quest/  (el juego se llama **Magic The Beer Quest** desde el 30 sept, antes "Magic Quest"; la carpeta y el repo mantienen el nombre viejo)
RPG de acción visto desde arriba (estilo Zelda Minish Cap / Pokémon GBA), canvas 240×160, un solo
`index.html`. Personajes jugables (índices 0-11; NO reordenar, las partidas guardan el índice): **Matías, Davis, Gucho,
Klaus, Katy, Pepe, Iván, Tebax, Le Ratui, Rubén, Tomo y Mati Guerra**. Selección en 2 filas de 6 (`SEL_COLS = 6`; `short`
= nombre corto en la selección, ej. "MATI G.").
- **Los 12 amigos en el mapa** (`FRIENDS_ON_MAP`: ch, sala, x, y, `role` beer/cheer/rival; NPC `{id:'friend', ch}`):
  Matías apoya en la Villa, Davis rival en la Arena, Gucho/Klaus/Pepe toman en La Ruca, Katy rival en la Liga Nacional, Iván
  en el Arcade, Tebax y Le Ratui en la Taberna, Rubén en Puerto Montt, Tomo en la playa de Viña, Mati Guerra rival en la
  Liga Tempest. El personaje que juegas no aparece. Con `role` 'beer' llevan jarra; `ROLE_LINES` agrega una frase según el
  rol; todos aceptan duelo (mazo en `FRIEND_DECK`). Para mover a alguien: cambiar su fila en `FRIENDS_ON_MAP` y correr `#conectividad`.
- **Tomo "El Productor Musical"** (antes "El Sacowea"; `music`, `headphones`, `shades`, polerón negro con neón): le salen
  notas musicales (partícula `k:'note'`, también cuando aparece como amigo); al pegarle a una criatura normal, 20 % de que
  quede bailando (lenta 2 s, "¡A BAILAR!"). Prueba: `#probar=pueblo&tomo`.
- **Mati Guerra "El Tenista"** (`tennis`, estilo `tennis` con cintillo, `racket`): 30 % de devolver un disparo enemigo
  (rebota, sin daño, "¡DEVOLUCIÓN!"). Aspecto de ambos inventado: confirmar con Matías.
**Tanda del 30 sept (tarde):**
- **Intro** (`G.state = 'intro'` al abrir, `updateIntro`/`drawIntro`, `INTRO_LEN` 820 cuadros, se salta con A/B/menú o clic):
  logo "MATÍAS GAMES PRODUCTION" con la cara de Matías en un círculo dorado (no la jarra, pedido de Matías), y 3 escenas estilo Game Boy (Matías contra el Langostino con cartas volando,
  los 10 amigos marchando con jarras, Klaus y Tebax brindando). Título con jarras (`drawMug`). Prueba: `#intro=300`.
- **Jarras de cerveza** (`it.k === 'beer'`): caen de criaturas (9 %) y jefes (2), y aparecen tiradas en zonas salvajes y
  mazmorras (40 %). Curan 2 corazones (Tebax 4).
- `#retrato=N` muestra al personaje N ampliado desde los 4 lados.
- **Teclas (30 sept):** M abre/cierra el menú en la pestaña MAPA (`openMapKey`), P apaga/prende el sonido (antes era M), T viajar.
- **Nunca atascado** (`unstuckPlayer`, en `loadRoom` y cada cuadro en `updateWorld`): si el jugador queda dentro de algo
  sólido lo mueve a la casilla libre más cercana. Pasaba al salir de Viña por la playa (filas 6-7 del borde oeste, que son
  arena caminable) y aparecer dentro de los árboles del Bosque de la Roca. Prueba: `#probar=vina&atascado`.
- **Imán de botín** (`MAGNET_R = 64` px en `updateItems`, `it.pull`): todo objeto cerca vuela al jugador atravesando muros;
  tocar o hacer clic en un objeto a menos de 110 px también lo trae (`pointerClick`). `drop()` nunca deja botín dentro de un
  muro (lo corre al centro de la criatura o a los pies del jugador). Prueba: `#probar=D:minas:1&iman`.
- **Nada encerrado** (`connectMap` en `getDef`, también para cada piso de mazmorra): desde una salida (o el bote, o la
  escalera U) revisa que se lleguen caminando todas las salidas, puertas, cofres, NPC y escaleras; si no, rompe la menor
  cantidad de muros para abrir camino. La fuente 'o' ya no es sólida. En Tempest el letrero pasó a (6,4). Prueba:
  `#conectividad` escribe los problemas en un `<pre id="conn">` (verlo con `chrome --dump-dom`); al 30 sept da 0.
  Si agregas un mapa nuevo, correr esa prueba.
- Iván rediseñado (pedido de Matías: "nerd divertido, más colorido"): estilo `propeller` (gorro de gajos rojo/amarillo/azul
  con hélice que gira), pelo colorín, lentes rojos grandes (`C.glass`), polera morada, zapatillas rojas, notebook con stickers.
- **Ventajas por personaje**: Pepe "Ragnar chileno" (estilo `viking` con moño, trenza y barba `C.beard`); Iván programador
  (`glasses`, `laptop`, `coder`: premio del arcade doble); Tebax cervecero (`mug`, `beer`: 6 cervezas en la taberna, más INT y
  llena la magia); Le Ratui (`piscola`: cada trago o jarra le da `PL.piscola` 10 s de velocidad extra); Rubén médico
  (`medic`: se cura medio corazón cada 3 s, cada 1,5 s sin enemigos). Aspectos inventados: confirmar con Matías.
- **HUD compacto** (`drawHUD`): con más de 10 corazones pasa a barra + número; plata y cartas en una línea; se transparenta
  si el jugador camina por debajo. Nombres de monstruos solo cerca, heridos o jefes.
- **Humor chileno**: frases nuevas en vecina, fans, juez, marinero, pescador, Klaus, taberna, posada, tienda, curanto, Viña,
  turista, sureño y organizador (pícaro pero sin groserías).
Klaus también aparece en la taberna como NPC, salvo que el jugador sea Klaus; en el Bar La Ruca de
**Curicó** (id interno `valpo`, antes "Puerto Valpo") aparecen los otros como amigos.
**Viña del Mar** [1,4] (casino con tragamonedas `SLOT_*`, hotel $12, playa) y **Puerto Montt** [3,4]
(solo en bote, `BOAT_ONLY`; lluvia `rain:true`, palafitos 'H', tienda Angelmó `SUR_SHOP`, curanto que da
+1 corazón la primera vez). Rutas de bote en `BOAT_ROUTES` (ida pagada, vuelta gratis).
**Alta dificultad (30 sept):** zonas `volcan` [3,0] (lava 'l', meteoros), `glaciar` [4,0] (hielo 'i' resbaloso),
`urborg` [0,3] (veneno 'q'); `mult:1.8` = criaturas con doble daño. Mazmorras de 4 pisos `fortaleza`,
`cavernas`, `necropolis` (pinchos 'n'). Jefes RAID (`RAIDS`: shivan, kjeldor, pit; 340-420 de vida, tamaño 48)
con proyectiles `eshot` y áreas telegrafiadas `aoe`, sincronizados online con mensajes `fx` del anfitrión. 3 espacios de partida (`pmq_save_1..3`), botón fijo
"Menú principal" bajo el juego. Estadísticas FUE (daño), DES (críticos y
probabilidad de carta), AGI (velocidad), INT (torneos); espadas con bonos (cofres, jefes y drops).

- **Cartas:** nombres reales de Magic Premodern con dibujos propios (nunca las ilustraciones oficiales,
  son de Wizards of the Coast). 6 mazos de 8 cartas (`DECKS`): Burn, Goblins, Mono Black, Replenish,
  Life y Langostino (= Phyrexian Dreadnought + Stifle). Mono Black reemplazó a "Toro" por pedido de
  Matías. **La lista de "Life" es una suposición** (lifegain blanco: Soul Warden, Exalted Angel, StP,
  Worship…): preguntarle si su mazo Life es otro.
- **Mundo:** 7 zonas + taberna y arena (`ROOMS`, mapas de 15×10). Las criaturas son las de las cartas y
  sueltan cartas de los mazos de su zona. Jefes: Siege-Gang Commander (guarida, al norte del bosque) y
  Phyrexian Dreadnought (islote, al sur de la costa). **Al Dreadnought le dicen "el Langostino"**: su
  sprite es un langostino gigante rojo con tubos de metal, se llama "Dreadnought, el Langostino" en
  pantalla y su zona es el "Islote del Langostino". Criaturas dibujadas con `renderShapes` (contorno,
  sombra y brillo automáticos) y el nombre encima; se ven todas en `index.html#bestiario`.
- **Taberna:** cerveza $5 (vida al máximo y +INT para el próximo torneo, máx. 4), coleccionista (3
  repetidas por 1 que falte, o vender a $4) y Klaus (cambios al azar).
- **Torneo:** mazo completo + $10; 3 rondas simuladas con animación carta por carta; la probabilidad sale
  de la tabla de enfrentamientos `MU`, INT y cerveza.
- **Online cooperativo (hasta 3):** PeerJS (WebRTC, servidor público gratuito de PeerJS, sin cuentas).
  "Crear sala" da un código de 4 letras; el anfitrión simula las criaturas de su zona y los demás las
  ven sincronizadas cuando están en la misma zona (golpes van al anfitrión, cada uno recibe su propio
  botín al morir la criatura). En otras zonas cada uno juega solo. Se pueden regalar cartas repetidas
  desde el menú de mazos. Cada uno conserva su partida guardada (localStorage). **No funciona dentro
  del enlace de Claude** (bloquea WebRTC): solo en GitHub Pages. En algunas redes móviles WebRTC puede no
  conectar sin servidor TURN; con WiFi suele andar. **No se ha probado con dos dispositivos reales.**

**Mundo ampliado (29 sept):** un solo mapa de 14 zonas (`WORLD`, grilla 5×5); las salidas entre
zonas se calculan solas por vecindad (`zoneNeighbors`) y se abren en el borde (`OPEN_TILES`). Zonas a
mano en `ROOMS` (Villa, Tolaria, Valpo, costa, etc.) y zonas salvajes generadas como laberinto con semilla
fija (`WILD` + `genMaze`, siempre el mismo laberinto). Mazmorras (`DUNGEONS`): Minas de Mishra, Cripta de
Tourach y Torre de Serra, 3 pisos laberinto + piso del guardián (escaleras U/V, portal O al vencer).
Guardianes (`GUARDIANS`): Siege-Gang, Langostino, Rey de las Minas, Negator Ancestral, Ángel Ascendida.
Tolaria: tienda de sobres ($20 = 3 cartas), posada, Liga Nacional (5 rondas, pide 3 guardianes; ganarla
muestra el final) y **Arcade** con el minijuego Goblin Smash (`updateArcade`). Valpo: Bar La Ruca (los dos
personajes no elegidos aparecen ahí como amigos) y la casa del viejo con el lore (la Caja de Urza, 2003).
Menú: MAZOS, ESPADAS, ESTADO, MAPA, MISIONES (arriba/abajo cambia entre misión principal y encargos).
**Gráficos estilo SNES / Chrono Trigger (29 sept):** tiles con textura y sombreado (`grassTile`, `treeTile`,
paletas `GRASS`/`TREEPAL`), sombras proyectadas en `buildCache` (`TALL`), agua con profundidad y espuma
(`drawWater`), luz ambiente por zona (`drawLighting`: círculo de luz en mina y cripta).
**Música:** motor propio con varias voces y eco (`makeSong`: melodía + cuerdas + bajo + arpegio + batería
generados desde una lista de acordes; instrumentos en `voice`). 7 temas ORIGINALES (inspirados en el estilo de
FF/Chrono Trigger/Terranigma, sin copiar melodías): title, town, field, dark, boss (salas con jefe), tavern,
fanfare (torneos). Todas las voces de un tema deben sumar el mismo largo (se revisó con node).
**Tanda del 29 sept (noche):** error del arcade corregido (faltaba `NPCDEF.arcadeOrg`; ahora el bucle
muestra cualquier error en pantalla en vez de congelarse). Equipo: `ARMOR` (escudo, casco, pechera,
pantalón, botas; DEF reduce daño, el escudo bloquea), drops por zona (`zoneTier`) y piezas legendarias de
jefes (`BOSS_GEAR`). Magia: `SPELLS` (bolt, ice, fire, heal), MP, tecla C / V, clic derecho apunta.
Mercado de Mox [4,3] con 4 vendedores (armas, magia, hogar, premios) y tienda (`G.shop`). Casa del
protagonista en la Villa (`hogar`, mejoras `HOUSE` y premios `PRIZES` con bonos permanentes). Encargos de
buscar objetos (`type:'find'`). Duelos de cartas con NPC (`G.duel`: tácticas agresivo/control/combo, dados,
apuestas; Katy puede hacer trampa). Katy jugable (índice 4; NO reordenar `CHARS`, las partidas guardan el
índice). Sonrisas y ojos con brillo en `drawPerson`. Mouse/toque en el canvas (`pointerClick`). Barco al
Islote ($30, `BOAT_ONLY`, barqueros en Costa, Valpo e Islote). Arcade con neón y 3 juegos (Goblin Smash,
Bloques de Urza, Come-Maná), ficha $5. Borrado de partida con confirmación y papelera (`pmq_trash`).
Pruebas: `#test-arcade`, `#zonas`, `#bestiario`.
**Encargos (`QUESTS`, 15):** cada NPC ofrece los suyos en orden (`questHook` al hablar; "!" amarillo =
disponible, "?" verde = listo para entregar). Recompensa: atributos permanentes (`S.st`), corazones o
monedas. Progreso por muertes (`S.kills`, `questKill` en `killEnemy`), cervezas, zonas visitadas, mazos,
cartas, trofeos, jefes y récord del arcade. Estilo medieval: capas, túnicas, cinturón y botas en
`drawPerson` (campos `cape`, `belt`, `sleeve`, `emblem`, `feather`, `hood`). Vistas de prueba:
`#bestiario` y `#zonas`.

**Tanda del 30 sept (grande):**
- **Mazos de 12 cartas** (`DECK_SIZE`), 10 mazos: los 6 antiguos + **Terragedon, Landstill, The Rock y Mud Metalworker**.
  Carta legendaria **Mox Diamond** (`LEGEND = 'moxd'`, marco dorado 'L'): NO es obligatoria para completar mazos,
  aparece como carta 13 en cada mazo; sale con 0,4% por criatura, 1,5% por carta de sobre, 2-5% por jefe; da +5% en
  torneos y +1 en duelos. `missingCards()` la excluye.
- **4 zonas nuevas** en los huecos del mapa: `pampa` [1,0] (terremotos `quakes`), `fabrica` [0,0], `quietud` [0,1],
  `bosqueRoca` [0,4], cada una con mazmorra de 4 pisos (`grieta`, `forja`, `ciudadela`, `raices`) y jefe raid nuevo
  (`terraBoss`, `masticore`, `conclaveQ`, `mongerAnc`, IA genérica `ai:'titan'`). Ciudad nueva **Tempest** [4,4] (al sur
  del Mercado), con lluvia, sala de la Liga Tempest y segunda tienda de sobres (`vendedora`).
- **Ligas regionales** (`LEAGUES`, `S.leagues`): Viña, Curicó, Puerto Montt (organizadores en la calle), Urza Saga
  (Tolaria) y Tempest. **Liga Nacional** pide las 5 ligas + TODOS los jefes (`ALL_BOSSES`, 12).
- **Jefes rejugables:** ya no se saltan si `S.bosses[t]`; `S.bosses` queda como "vencido alguna vez".
- **Personajes 5-7 (30 sept):** Pepe (`bald`, "EL VETERANO", FUE), Iván (`spiky`, "EL COMBERO", DES) y Tebax (`wizard`,
  "EL HECHICERO", INT). **Aspecto inventado**: preguntarle a Matías cómo son. NO reordenar `CHARS`. Mazos de amigo en
  `FRIEND_DECK` (terragedon, rock, landstill) y frases en `FRIEND_LINES`. Selección en 2 filas de 4 (`SEL_COLS`, `SEL_ROWS`),
  prueba `#elegir=5`.
- **Viajar** (botón "✈ Viajar (T)" bajo el juego, tecla T, `openTravel`/`travelTo`): **Piedra Hogar** (encargo `q_piedraHogar`
  del Carpintero: 3 fragmentos en bosque, costa y cerro) lleva a la casa; **Piedra Tolaria** (encargo `q_piedraTolaria` de la
  Maga: 3 runas en ruinas, pantano profundo y minas piso 1) lleva a Tolaria. Con `FLY_DECKS = 6` mazos completos se vuela a
  todos los pueblos (`TOWN_SPOTS`). No se puede con un jefe vivo en la sala. `S.stones`. Drop de cartas bajado a
  0,12 + DES×0,006. Pruebas: `#probar=cerro&viajar`, `&volar`, `&ircasa`.
  **Animación** (`G.warp`, `updateWarp`, `drawWarp`, `warpPlayer`, tiempos en `WARP_T`): piedra = remolino de runas moradas,
  columna de luz y destello blanco (el cambio de lugar pasa en el destello); vuelo = sube, pantalla de cielo con nubes y
  "VOLANDO A…", y baja sobre su sombra con polvo al aterrizar. Mientras dura, el mundo no se actualiza. Para capturas:
  `#probar=cerro&piedra50` / `&volando100` (adelanta N cuadros y congela con `G.freeze`).
- **Reaparición a los 2 minutos** (`RESPAWN_MS`): `killEnemy` anota `G.killedAt[zona:índice]` y `loadRoom` no vuelve a crear
  esa criatura (ni jefe) hasta que pasen 2 min; si el jefe descansa, la sala muestra el portal. Solo en memoria (recargar la
  página los revive). Los invocados por jefes no cuentan.
- **Dificultad (subida de nuevo el 30 sept):** `DIFF_HP = 6` (criaturas, antes 3), `DIFF_BOSS_HP = 6` (antes 2) y `DIFF_BOSS_DMG = 1.7` (golpes, disparos y áreas mientras hay jefe; jefes ≈ 5 veces más difíciles), `DIFF_DMG = 2` (contacto), `DIFF_SHOT = 1.5`. **Las criaturas normales se multiplican por `lvlScale()`** (vida al aparecer y daño en `hurtPlayer`; los jefes y el daño con jefe presente NO, siempre al 100 %: `hurtPlayer(..., fromBoss)`): 30 % en nivel 1, 100 % en nivel 11, +3 % por nivel hasta 160 % (pedido de Matías: los primeros niveles eran imposibles)
  (proyectiles). Mazmorras con más criaturas, enjambres de bichos chicos (`swarm`, ardillas `squirrel`, `servo`),
  peligros en todos los pisos, **torretas** (tile 'j', `placeTurrets`, `G.turrets`) y salas de jefe con peligros,
  torretas y refuerzos cada 5 s. Criaturas nuevas con `ai:'shooter'` (disparan) y `regen`.
- **Economía:** `COIN_X = 50` (monedas de criaturas y arcade; bajado de 150 el 30 sept porque daban demasiado; jefes 6×$500,
  raid +10×$1.000, bolsas $600-1.100 × nivel de zona) y `QUEST_COIN_X = 150` (encargos), sobre `PACK_PRICE = 80000` (subido de 10.000 el 30 sept), todo lo demás ~x250.
  Formato chileno con `money(n)` ($10.000). Partidas viejas: `s.econ` multiplica sus monedas x150 una vez.
  Casa: 6 mejoras nuevas caras (galería, estatua, fuente, bóveda, salón, mansión hasta $2.000.000; tiles 9 0 @ % & $).
- **Vitrina de trofeos** en la casa (fila 4 de `hogar`, tile '^', siempre sólido): `TROPHY_CASE` por columna x (2 Arena bronce,
  3-5 y 9-10 ligas regionales plata, 11 Liga Nacional oro, 12 Copa de los 12 jefes morada). Se llenan solos (`trophyWon`), se miran
  con B (`trophyInteract`). Prueba: `#probar=hogar&trofeos`.
- **Pasar partida (arreglo 30 sept):** la partida importada lleva una marca `imp`; `saveGame` no escribe si el espacio tiene
  otra marca (`staleSession` cierra la sesión vieja, también desde otra pestaña con el evento `storage`). Antes, una partida vieja
  abierta en el computador pisaba la importada. `savedAt` se muestra al importar; avisa si el espacio destino tiene más nivel.
- Diálogos de elegir mazo: `deckChoices()` (páginas de 6 con "MÁS MAZOS").
- Pruebas: `#nuevos` (zonas nuevas), `#bestiario2` (criaturas nuevas), `#probar=<zona>` (entra directo, ej.
  `#probar=D:forja:5`). Probado con capturas: sin errores. El menú de mazos nuevo (10 filas, grilla 5x3) no se vio en captura.

Publicado: **https://mjimenezq.github.io/premodern-quest/** (repo público `mjimenezq/premodern-quest`,
la carpeta es el repo). Copia privada en Claude: https://claude.ai/artifact/FcHFJHgbwoFhPpQkK5ruie
Estado: se revisó solo la pantalla de título; la jugabilidad y el online no se han probado a fondo.
- **Dunas de Concón y Pichilemu (30 sept)**: `WILD.dunas` en `WORLD` [2,4] une Viña con la costa, que ahora se llama PICHILEMU (bote en (10,8), barquero en (9,7)). El islote bajó a [2,5]; el mapa del mundo tiene 6 filas (`chh=20`).
- **Zona Safari (30 sept)**: `ROOMS.safari` (casita verde abajo a la izquierda de la Villa, puerta '2,7'; el cronista pasó a (6,8)). `POKE` (151 nombre/tipo/forma/rareza), `drawPoke` (dibujo propio por forma q/b/w/o/s/f/i y color de tipo; los nombres son de Nintendo: OK para un juego entre amigos, no para vender). En el Safari, A lanza Safari Balls (15 por visita, `S.safariBalls`); captura según rareza (`POKE_CATCH`), puede huir (`POKE_FLEE`). El primero que atrapas es tu compañero (`S.pet`, índice), la Pokédex va en `S.dex`. **Sin compañero no se sale de la Villa** (`changeRoom`). La mascota (`G.pet`, `updatePet`) sigue al jugador y ataca criaturas a menos de 90 px (daño rareza×2 + nivel/3, cada 45 frames; manda `hit` al host si la criatura es remota). El PROFESOR ALERCE (NPC del Safari) cambia de compañero.
- **Llaves de mazmorra**: `genDungeon` pone `def.keyPos` en cada piso normal (lejos de la entrada, nunca sobre peligro); la escalera V tiene candado hasta recoger la llave (`S.keys[roomId]`). `connectMap` la incluye como destino.
- **Antigüedades y museo**: `RELICS` (12 objetos, $2.000 a $60.000), 3 % de las criaturas y 60 % de los jefes las sueltan (`S.relics`). `ROOMS.museo` en Tempest (puerta '10,7'), la CURADORA compra todo. ESTADO muestra compañero, Pokédex y antigüedades.
- **Iván (30 sept)**: "EXPERTO EN IA Y SISTEMAS", toque alemán: pelo café parado (estilo `upspike`), ojos café, sin lentes (sin bandera: `P.german` existe pero no se usa), polerón blanco oversize sin cadena (`P.oversize`), jeans y zapatillas blancas con cocodrilo verde (`P.lacoste`), laptop y aura de luces RGB (`P.rgb`, `rgbAura`: anillo en el suelo y 6 luces que giran, las de atrás se dibujan antes del sprite).
- Hashes de prueba nuevos: `#probar=<sala>&mascota` (Pikachu + 3 en la Pokédex) y `&reliquias`.
- **Pokémon más parecidos (1 oct)**: `POKE_MAPS`/`POKE_SPR` = sprites píxel a píxel de ~36 Pokémon conocidos (iniciales y evoluciones, Pikachu, Eevee, Jigglypuff, Gengar, Snorlax, Magikarp, Mewtwo, Mew, Psyduck, Meowth, Voltorb, Ditto, Dratini, Clefairy, Oddish, Abra...), con contorno y luz/sombra automáticos, guardados en un canvas (`pokeCanvas`). El resto usa la figura genérica con los colores de su especie (`POKE_COL`). `#pokedex0..3` muestra los 151.
- **Mascota**: anillo RGB en el piso (`rgbAura(x, y, false, true)`) y un corazón que aparece cada tanto.
- **Magias con nivel (1 a 5)**: `S.spellXp`, `spellLvl`, `spellMp`; +1 de experiencia por lanzarla y +2 si pega. Cada nivel: más daño (mitad del daño base por nivel), más curación, fuego con más radio, hielo frena más, el rayo es más rápido; en los niveles 3 y 5 cuesta 1 MP menos. Se ve en el HUD ("NV3") y en la tienda.
- **Monturas** (`MOUNTS`, `S.mounts`, `S.mount`, tecla **R** para subir o bajar): Mesa Pegasus, Nightmare, Pegasus Charger y War Mammoth las vende el CABALLERIZO del Mercado de Mox; el Shivan Dragon se gana al vencer al jefe Shivan. Dan velocidad (y DEF el mamut y el dragón). No se usan dentro de edificios. Dibujo en `drawMount` (capas atrás y delante del jinete) y `drawRider`. `#monturas` las muestra todas.
- **Arcade (1 oct)**: solo paga si cumples la meta (`arcadePrize`: el doble de la ficha más un extra con tope; Iván +50%). Seis juegos repartidos por las máquinas (`gameAt` por orden): Goblin Smash (meta 25), **Premodern Kombat** (pelea al mejor de 3 rounds contra un amigo al azar; A golpe, B patada, C rayo, abajo bloquea), **Mana Kart** (carrera pseudo 3D de 3 vueltas contra 3 rivales, cajas de turbo, paga 1° y 2°), Bloques de Urza (meta 300), **Super Trío Bros** (abre el otro juego en un iframe con `?arcade=1`: un nivel, 3 vidas, y avisa con `postMessage({type:'stb-end'})`; paga si terminas el nivel. Desde el Artifact usa la URL pública) y Come-Maná (meta 220). Pruebas: `#probar=arcade&pelea` y `&kart`.
- **Pedidos grandes pendientes (1 oct)**: música propia de cada lugar (hoy se repiten), mazmorras más variadas tipo Diablo 2, al menos 10 zonas nuevas más difíciles que habiliten la Liga de Campeones, y un portal a un mundo paralelo Pokémon tras ganar la Liga Premodern (mismos mapas con colores tipo Pokémon, mazos de cartas Pokémon, Liga Pokémon con Lance y Ash al estilo Pokémon Azul y Hall of Fame).
- **Mejora gráfica (1 oct)**: el lienzo es de 960×640 (`HIRES = 4`, `ctx.setTransform(4,…)` una sola vez al inicio); el juego sigue pensándose en 240×160, así que el pixel art queda igual de nítido y los textos, luces y partículas salen suaves. **Nunca usar `ctx.setTransform`/`resetTransform` sin restaurar la escala** (en `drawLights` se hace dentro de `save/restore`). Nuevo: `softShadow` (sombras difusas), `drawLights` + `gatherLights` (oscuridad con huecos de luz en minas, criptas y de noche, brillo aditivo de antorchas/torretas, lava, portales, magias, objetos, mascota, aura RGB, jefes, viñeta), `dayPhase()` con la hora real del jugador (noche 20-6 más oscura con ventanas encendidas y luciérnagas, atardecer 18-20 naranjo, amanecer rosado), `fineParticles` (nieve, brasas, esporas, arena, polvo, luciérnagas, polen según la zona), `atmosphere` (rayos de sol en bosque y pradera, niebla en pantanos), `waterSparkles`, `grassBlades` (pasto que se mueve con el viento), `cloudShadows`, `nightWindows` y barra de vida con brillo. Pruebas: `#probar=<sala>&noche`, `&atardecer`, `&dia`.
- **Mundo Pokémon = segunda mitad sorpresa (decisión de Matías, 1 oct)**: el jugador debe creer que el juego terminó al ganar la Liga Premodern; ahí se abre el portal y empieza todo de nuevo: cartas Pokémon (mazos nuevos que juntar), más difícil, líderes de gimnasio (Brock, Misty, Lt. Surge, Erika, Koga, Sabrina, Blaine, Giovanni), Alto Mando y campeón al estilo Pokémon Azul (Lorelei, Bruno, Agatha, Lance, Ash) y Hall of Fame. Mismas zonas y mapas, decorados con colores estilo Pokémon, y todos los NPC hablan de la mística Pokémon en vez de Premodern. Orden acordado: primero música propia por lugar y las 10 zonas nuevas con mazmorras tipo Diablo 2; el mundo Pokémon al final.
- **Bóveda del Coleccionista (1 oct, Matías llegaba a nivel 30 con casi todo comprado)**: NPC `marchante` (EL MARCHANTE) en el Mercado de Mox (9,5); OJO: `coleccionista` ya era el NPC de la taberna que da encargos y cambia cartas, no reutilizar ids de NPCDEF, tienda `lujo` con `LUXURY` (20 piezas de $1.200.000 a $500.000.000), cada una con requisito de nivel y trofeos (`reqOk`, `reqText`; `buyItem` lo revisa). Armas `argivia`, `phyrexia`, `masticoreBlade`, `yawgmoth`, `moxEterno` (+12 a todo); armaduras tier 6 y 7 (`escudoArgivia` … `corazaMox`); dragones-montura `crosis` y `darigaaz` (cartas de Invasion, legales en Premodern); mejoras de casa `castillo`, `islaTolaria`, `trofeoMundial` (marcadas `lux:true`, el carpintero no las vende). No caen como botín (el botín sigue en tier ≤ 3). Prueba: `#probar=mercado&lujo`.
- **Nivel máximo 200 (1 oct)**: `MAX_LVL` en `addXP`; al llegar sale un mensaje especial, el HUD dice "NV 200 MAX" y la barra de experiencia queda llena. Idea: la mitad Premodern llega cerca del nivel 100 y el mundo Pokémon lleva hasta el 200.
- **Mazos del mundo Pokémon (Matías, 1 oct)**: 12 mazos de cartas Pokémon (formato actual del juego de cartas), reemplazan a los mazos de Magic en la segunda mitad: **Raging Bolt, Charizard, Mega Excadrill, Mega Lucario, Dragapult, Gardevoir, Lugia, Slowking, Alakazam, Zoroark de N, Tera Box y Rocket Mewtwo**. Cada uno con sus cartas (12 por mazo, como los de Magic) dibujadas por nosotros; nombres de The Pokémon Company, OK para un juego entre amigos, no para vender. Cartas clave aproximadas (VERIFICAR las listas actuales antes de construir): Raging Bolt ex + Teal Mask Ogerpon ex + Professor Sada's Vitality + Earthen Vessel; Charizard ex + Pidgeot ex + Rare Candy + Arven; Dragapult ex (Dreepy, Drakloak) + Rare Candy; Gardevoir ex (Ralts, Kirlia) + Munkidori + Scream Tail; Lugia VSTAR + Archeops; N's Zoroark ex (N's Zorua, N's Darumaka, N's Reshiram, N's PP Up); Team Rocket's Mewtwo ex + cartas de Team Rocket; Mega Lucario ex y Mega Excadrill ex (expansión Megaevolución 2025); Alakazam (Abra, Kadabra); Slowking; Tera Box (Pokémon Tera ex como Terapagos ex).
- **Lugares nuevos (1 oct)**:
  - **Escenografía** (`def.props`: `{k, x, y, w, h, solid, act, top, c, txt}`): `drawProp`/`drawProps(top)`, choque con `G.propSolid`, acción al apretar A con `propAt` + `propAction`. Tipos: reposera, quitasol, barra, fogata, tablas, cartel, duna, saco, torre, parra, barril, pool, pingpong, tacataca, dj, parlante, hielera, sofa, neon, cerezo, arco. Algunos dan luz en `gatherLights`.
  - **Pichilemu**: surfistas que pasan por el mar (`def.surfers`, `updateSurfers`, `drawSurfer`), escuela de surf (NPC `surfista`, clase de $25.000 → `S.surf`: el jugador camina sobre el mar `~` en tabla; `PLAYER_CHECK` en `moveBox`/`unstuckPlayer` y `blocked`).
  - **Dunas de Concón**: ya no es zona salvaje (se borró `WILD.dunas`); es `ROOMS.dunas`, playa chill sin monstruos: reposeras (curan todo), Bar La Duna (NPC `barDuna`, chela $2.000), fogata, arriendo de sacos ($500, `G.slide`/`updateSlide`, cada 10 bajadas +20 EXP).
  - **Talca** (`WORLD` [1,5], al sur de Viña): Tebax es el anfitrión (`hostTalk`): tour por los 3 letreros (`TALCA_SPOTS`, `S.talca`) → $30.000 y +1 INT. Vendedor de vino del Maule ($8.000, +2 INT de torneo). Datos reales usados: "Talca, París y Londres", el Acta de la Independencia firmada por O'Higgins (Museo O'Higginiano), el Valle del Maule.
  - **Las Condes** (`WORLD` [4,5], al sur de Tempest) y **Casa de Iván** (`casaIvan`, `party:true`): DJ que cambia la música (`G.djMusic`, `roomMusic()`), hielera (una chela por visita), y minijuegos gratis `startFree`: **pool** (6 bolas en 14 tiros), **ping pong** (a 5) y **taca-taca** (a 3, A chute fuerte); ganarle a Iván da +1 INT de torneo. Salita gamer con las 6 máquinas del arcade. Luces de fiesta.
  - **Amigos movidos**: Katy y Le Ratui a Puerto Montt, Tebax a Talca, Iván a su casa (ya no está en el arcade).
  - **Curicó huaso**: el puerto pasó a campo: laguna con bote, viñas, cerezos, vacas y caballo que pasean (`def.animals`, `updateAnimals`, `drawAnimal`; caballo = montura oculta `caballo`), huaso con chupalla (`P.chupalla`), tortera (torta de Curicó $4.000). **Senderos** (`def.trails = {'x,y':{room,tx,ty}}`): pisar la casilla cambia de sala. **Cerro Condell** (`ROOMS.condell`, `zone:'valpo'`, `zoneOf` respeta `zone`): monstruos, cofre y mirador.
  - **Música nueva**: `beach` (Pichilemu y Concón), `talca` (cueca), `huaso` (tonada de Curicó), `electro`, `reggaeton`; baterías `house`, `dembow`, `cueca`, `beach`.
  - **Pokémon dibujados**: 79 con sprite propio (se sumaron Charizard, Blastoise, aves de la familia Pidgey y Spearow, las aves legendarias, Rattata, Vulpix, Growlithe, Ponyta, Slowpoke, Magnemite, Onix, Cubone, Lapras, Gyarados, Dragonite, Machop, Geodude, Zubat, Diglett, Gastly, Caterpie, Butterfree, Poliwag, Staryu, Chansey, Scyther y las evoluciones de Eevee).
  - Pruebas: `#probar=dunas`, `talca`, `lascondes`, `casaIvan`, `valpo`, `condell`; `&surf`; `#probar=arcade&pool` / `&pong` / `&taca`.
- **Mundo Pokémon, más pedidos (1 oct)**: magias nuevas inspiradas en los ataques de las cartas Pokémon, objetos más poderosos, y todos los monstruos y jefes de esa mitad deben ser Pokémon.
## Personajes y creador de Codex (1 oct 2026)
- Se conservan los índices 0–11. Nuevos: 12 Rai (bebé, ojos azules, autito; Supercariño: regenera medio corazón cada 5 s, empieza con Lightning Bolt; Construcción +2 DEF), 13 Tía Coco (hermana de Katy, tía de Rai; camisa roja a cuadros, dice Jue; ve el plan base del rival en duelos y +8% en torneos), 14 Javier (Ingeniería con Katy; +3 daño de espada/magia contra merfolk, dread y kjeldor), 15 Rodolfo (amigo inseparable de Javier; maratonista, +20% velocidad), 16 Cahe y 17 PabloT (Ingeniería Comercial con Matías; Finanzas +20% monedas recogidas, Tibia +2 DEF).
- Rai en Villa; Coco junto a Katy en Puerto Montt; Javier y Rodolfo juntos en Puerto Montt; Cahe y PabloT juntos en Mercado de Mox. Diálogos y mazos de duelo propios. Los aspectos sin referencias se interpretaron a partir del pedido.
- Índice 18 reservado para personaje personalizado. Nunca moverlo ni reutilizarlo. characterOf(save)/CH() obtiene el personaje desde save.customChar; no modificar CHARS para cargar personajes creados. Esto permite que los 3 espacios tengan personajes distintos.
- Selección continua de 3 columnas con desplazamiento vertical: arrastrar con dedo/mouse, rueda o flechas. El gesto de arrastre no confirma una elección. Las flechas mantienen visible el personaje seleccionado. Al final, un botón ancho CREAR MI PERSONAJE abre el dialog accesible de 3 pasos (apariencia, atributos, habilidades).
- Creador: nombre hasta 16 caracteres, 10 estilos, colores de piel/pelo/ojos/ropa/pantalón/zapatos, camisa a cuadros y atributo de crecimiento. Exactamente 20 puntos de atributos, 2–8 cada uno; hasta 6 puntos de habilidades. Las habilidades se validan con catálogo y costos tanto al crear como al importar/cargar.
- Personajes personalizados incluidos en guardado, papelera, exportación/importación y apariencia enviada online. El cooperativo con dos dispositivos continúa pendiente de prueba.
- Pruebas: node tests/characters.cjs (partidas aisladas, límites, poderes, NPCs y conectividad); navegador: asistente completo, bloqueo por presupuesto, inicio y recuperación de partida tras recargar; selección nueva sin errores de consola.

## Regreso al enlace original (1 oct 2026)
Matías pidió volver a desarrollar y publicar en mjimenezq/premodern-quest porque sus amigos ya tienen partidas allí. Se integraron los 6 personajes y el creador con selección desplazable desde la copia Codex, conservando las claves locales pmq_ y las salas pmq-. Enlace principal: https://mjimenezq.github.io/premodern-quest/. El repositorio separado queda disponible como copia anterior; no es el destino habitual de publicación.


## Accesos, tiendas y partidas (1 oct 2026)
- Ahora hay 5 espacios locales; se conservan pmq_save_1..3 y se agregan pmq_save_4 y pmq_save_5. Pantalla compacta de cinco filas, flechas, toque, importación y papelera usan SLOTS.
- Rai está junto a su papá Matías cerca de la casa, fuera del paso al Safari (12,5 y 11,5). Mox: Cahe y PabloT pasan a la plaza inferior; armero a 3,5. Se verificó caminar al oeste desde tres alturas con colisiones reales.
- El Marchante atiende en bovedaMox, puerta 11,7 del Mercado. Su catálogo ahora tiene 80 piezas: los 20 objetos anteriores y 60 armas/armaduras nuevas con requisitos de nivel.
- Corrección final de Matías: establo únicamente al aire libre junto al río de Curicó. Caballerizo 4,5; cinco monturas compactas sin precios sobre el mapa. Precios y compra al hablar con él, desde $100.000. Se eliminó el arco/sendero superior derecho; la puerta 10,7 es tienda de cartas. La definición interior anterior se conserva sólo para compatibilidad, sin acceso desde la ciudad. Pescador trasladado al muelle junto al agua, con caña dibujada. Se conservan monturas compradas.
- Puerto Montt amplía suelo seco hasta fila 8, mar sólo al sur. NPCs repartidos para circular sin Surf. Nueva tienda cartasSur (puerta 3,7), vende sobres y organiza ligaPmontt. Liga Urza ahora se juega dentro de tienda en Tolaria, rotulada CARTAS. Ligas y progresos guardados no cambian.
- Mapa muestra sedes de liga aunque no estén visitadas: L regional, N nacional; amarillo pendiente, verde ganada, gris cerrada. Nacional mantiene requisito de cinco ligas y todos los jefes.
- Botes a Puerto Montt y al Islote cuestan 3.000; regresos gratuitos se conservan.
- Intro y créditos obtienen nombres/cantidad desde friendCast() (CHARS sin el creador), actualmente 18, sin números fijos.
- Verificación: node tests/characters.cjs, guardados 1–5 y compatibilidad, compra de montura, precios, colisiones al oeste, acceso seco a todas las puertas de Puerto Montt y al Safari, estado de marcadores de liga, conectividad general. Revisión visual de establo, Puerto Montt y cinco partidas.

## Talca, progresión y templos de cartas (1 oct 2026, tanda final)
- Talca para todos los personajes; Tebax es anfitrión y tiene pelo (`style:curly`). Mercado/restaurant accesible por 4,3: completos mojados $3.000 y tostados $2.500, curan vida/magia; primera degustación de cada receta +1 corazón y 100 EXP. Museo por 10,3: secuencia de reliquias SOL/RIO/BOSQUE/SOL, premio único +2 INT, $50.000, 250 EXP. Barrio universitario por sendero sur 7,9: DJ con música seleccionable, luces, fogata, pool y ping-pong gratis. Tour antiguo y partidas `S.talca` intactos.
- Diario: botón Misiones (J), lista desplazable con aceptadas primero, progreso, dador, lugar, recompensa y terminadas. Flechas, rueda y botones anterior/siguiente en canvas; tocar una misión o A abre objetivo completo. Más 15 encargos permanentes y patrullas renovables del cronista (`S.contractRound`), usando `S.quests` anterior. Se conservan IDs de encargos; los del juez/tendero pueden entregarse a Diego/Azul.
- 100 objetos adicionales: 10 armas, 10 piezas por cada uno de los cinco espacios de armadura, 10 hechizos, 10 monturas, 10 mejoras de hogar y 10 accesorios/premios. Catálogos apropiados del Mox/caballerizo, requisitos entre NV40 y NV85, precios crecientes. Menú de equipo desplazable para colecciones grandes. Nuevos IDs se agregan sin alterar los anteriores.
- Tiendas de cartas Curicó, Viña, Tolaria/Urza, Puerto Montt, Tempest y Nacional: mesas y playmats, mostrador de Azul, juegos de mesa, Diego González juez, Durandal, Galindo, Jorge W, César, JGU y Macías. Standings de duelos y ligas persistidos por tienda en `S.tableResults`; Galindo es rival fuerte y último oponente nacional.
- Los duelos dan EXP por jugar y ganar; ligas regionales y nacional dan mucho más. `cardMatchXP` y `tournamentXP`; cuatro ligas regionales desbloquean Buscaobjetos, incluso en partidas antiguas que ya cumplen.
- Ciclo de cuatro fases, dos minutos de movimiento por fase: MAÑANA/MEDIODIA/TARDE/NOCHE. Reloj persistido `S.worldTicks`, ambiente/ventanas nocturnas, faroles y fogatas, canto de gallo sintetizado al amanecer. Fogata permite esperar. Horarios: Urza mañana, Viña mediodía, Curicó tarde, Puerto Montt/Tempest noche, Nacional mediodía. Menús/duelos/arcade pausan el ciclo.
- Magia progresa hasta NV10 conservando umbrales de niveles 1–5. Mascota deriva su nivel del héroe (`petLevel`), fuerza crece con él.
- Rutas de Surf desde Dunas al este a Puerto Montt y al sur al Islote, con regreso por agua. `SURF_LINKS`, sin reemplazar botes económicos. Sin Surf se bloquea la transición.
- Torres de disparos reemplazadas por arqueros goblin, bombarderos, espineros y mimics, todos derrotables; bombas atacables. Al limpiar, se detienen meteoros/terremotos y daño del terreno; tres minutos sin reaparición, persistidos al cambiar de sala. Con Buscaobjetos se revela una señal dorada y se buscan tesoros únicos por zona al limpiarla.
- Arcade: plataformas propias inspiradas en DKC2 con Diddy/Dixie, salto/rodar/planeo/checkpoints; tenis con saque, globos, puntos y sets cortos; Ruta GT con selección AE86/Skyline/RX7/911 y física de curvas; pelea con nueve personajes de MK y poder de hielo. Son minijuegos originales, no ROMs. Menú/botón de salir abre confirmación y pausa; abandonar no da premio.
- `#vista=pokemon` es una vista exploratoria sin guardar/exportar: templos Pokémon, cartas Pokémon separadas, Fernando Cifuentes (Masters mundial 2024) y criaturas con sprites Pokémon. Esta nota describe la vista anterior. La actualización siguiente implementa portal real y progreso por mundo; el combate de cartas sigue siendo el sistema táctico propio del RPG, no una simulación completa de reglas oficiales del TCG. Usar este enlace público para mostrar el aspecto; `#probar=...` crea partidas de prueba y se usa sólo en localhost.
- Validación: `node tests/characters.cjs` cubre partidas anteriores, inventarios, misiones/contratos, horarios, experiencia, límites mágicos, monturas, Surf, cooldown/tesoros, siete arcades y vista previa sin escritura. Auditoría de colisiones con cuerpos de NPC, puertas y dibujo en 103 mapas incluyendo todos los pisos de mazmorras; informe de conectividad sin problemas. Cooperativo en dos dispositivos y balance prolongado quedan sin prueba.

## Correcciones de accesos, ligas y ciudades del sur (1 oct 2026)
- Barrio universitario: conexión única por el norte, entrada desde Talca arriba; continuar hacia abajo explora el barrio. Sin puerta de retorno al sur. DJ fuera del pasillo central.
- Tomo pasa a 5,5 en Viña, fuera de la puerta 2,7 y su aproximación. Letreros TIENDA TCG luminosos. Acceso probado para los 19 personajes.
- La Ruca conserva ID `bar`, ahora Xcso Club Discoteque: entrada 3,3 en la esquina noroeste de Curicó, DJ, luces, pista interactiva de baile, amigos y mesas para desafiar. Huaso reubicado para liberar la calle estrecha junto al club.
- Petición final del establo: vuelve a ser cerrado, con edificio junto al río en Curicó, puerta 4,6. Interior `establo` anterior reutilizado, salida 4,7. Caballerizo adentro y caballos visibles sin precios en el suelo; compra desde $100.000 al hablar. Esta decisión reemplaza la anterior de establo abierto.
- Organizadores junto a entrada de templos, letrero compacto RGB LIGA con flecha (petición final: evitar saturación), iluminación y asiento libre central. Hablarles abre directamente la liga, antes de ofrecer un duelo ordinario. Primera visita anuncia inscripciones. Pestaña LIGAS del menú: cinco regionales, horarios, progreso, Nacional y requisitos, Buscaobjetos.
- Ligas: tres preguntas por ronda (apertura/respuesta/cierre), cuatro respuestas, intención rival fijada antes de responder. Agresivo vence combo, combo vence control, control vence agresivo; observar permite preparar la siguiente respuesta. Ventajas acumuladas y matchup del mazo influyen en probabilidad, limitada a 10–85%. Dominio por atributos/equipo acotado; rivales escalan con nivel y Galindo conserva mayor experiencia. Duelos ordinarios: cuatro opciones, daño acotado, rival adaptativo y nivel visible. Personajes con trampa conservan dos usos en la cuarta opción antes de pasar a observar; Coco conserva visión. Balance prolongado pendiente.
- Críticos de melee muestran CRITICO y daño en rojo. Contactos fallidos muestran MISS rojo, sin aplicar daño; probabilidad baja con DES (22% máximo, 2% mínimo). Se conserva daño crítico doble.
- Faroles de estilo clásico con remate y ventanas, al borde de calles, sin colisión. No se ubican en el eje central; luz cálida nocturna.
- Puerto Varas y Frutillar: nuevas ciudades en mapa y camino seco Puerto Montt → Puerto Varas → Frutillar, ida/vuelta sin Surf. Lago Llanquihue, volcán Osorno decorativo, casas de tradición alemana, cafés con kuchen, casa visitable y Teatro del Lago con concierto y recompensa única. Centro TCG de Puerto Montt con salón anexo, siete mesas en total, el mayor del sur. Mapamundi ajustado a siete filas. IDs de ligas existentes intactos.
- Móvil: prevenir selección, llamada contextual y gestos dentro de canvas/controles; mantener edición de inputs/códigos y zoom fuera del juego. Seguimiento de varios dedos por botón y limpieza al perder foco/cancelar puntero. Prueba de eventos en controles; Safari/Chrome de teléfonos físicos pendientes.
- Validación ampliada: prueba de caminar al barrio y regresar, acceso Viña con todos los personajes, accesos secos del sur/establo, entradas sin NPC encima, decisiones correctas/incorrectas a NV52 con atributos altos, precisión y lectura rival, diario y nueva pestaña. Auditoría de NPC, puertas, props y dibujo en 110 mapas. Previsualizaciones locales revisadas en navegador; pruebas `#probar` sólo en localhost.

- Tema exclusivo TCG: El templo de la esperanza, composición original en Re mayor, 112 BPM, 16 compases (128 pulsos), metales suaves, cuerdas, arpa, contramelodía de flauta y percusión ligera. Referencia de ambiente: RPG medieval esperanzador de la era SNES. SONGS.tcg en todas las tiendas/templos y anexo, incluidos preview Pokémon; no hereda el DJ del club. Capas sincronizadas y frecuencias/duraciones verificadas. Se respeta el silencio del jugador.

## Actualización vigente: dos mundos, sueño del campeón y economía (1 oct 2026)
- Publicar en el enlace original, conservando cinco espacios y todos los índices de personajes. Ningún cambio mueve partidas existentes; las aventuras nuevas comienzan en hogar, con despertar en cama y relato del hechizo que rompió el sello de la Caja de Urza.
- Seis templos con distribución, decoración, tienda, juez y jugadores locales propios: Vendimia/Curicó, Mareas/Viña, Lluvia/Puerto Montt, Cinco Lunas/Tolaria, Forja/Tempest, Eclipse/Nacional. Se eliminó el neón exterior duplicado; se conserva LIGA RGB compacto. Identificadores regionales intactos. Misiones de Azul/Diego trasladadas a anfitriones locales conservando IDs de misión y progreso.
- Portal real en el santuario accesible desde el costado derecho de Nacional. Se abre al campeón nacional; animación original de siete segundos entre galaxias. S.realm y S.realmProgress preservan cartas, ligas, jefes, misiones, cofres y patrullas por mundo; héroe, equipo y monedas compartidos. Snapshot/serialización/retorno probados. Mensajes multijugador distinguen mundos.
- Pokémon conserva los mismos mapas y puertas. Presentación de criaturas, cartas, decoración y diálogos temática; los enemigos llevan especie y variante salvaje/furioso/gigante. El juego mantiene sus reglas tácticas propias e IDs internos de cartas. No afirmar que implementa las reglas oficiales de Pokémon TCG.
- Gimnasios Pokémon: tres retadores físicos y líder, cuatro victorias secuenciales persistidas en S.gymRuns; perder permite reintentar la misma mesa. Erika/Planta, Misty/Agua, Lorelei/Hielo, Sabrina/Psíquico, Blaine/Fuego y Fernando/Maestros. ! al ver al jugador. Medallas, EXP, horario y reputación. Se conserva cada mapa y se comprobó el acceso real a entrenadores.
- En el reflejo el compañero es una criatura antigua de Magic (S.magicPet), nivel igual al héroe, sin modificar S.pet original: Serra Angel, Shivan Dragon, Dreadnought, Masticore, Juggernaut, Birds of Paradise, Metalworker, Deranged Hermit y Spiritmonger. Selector por páginas en portal/profesor.
- Caja de Urza: artefacto inventado para esta historia. Eco de Urza explica Dominaria, Mishra, Karn y su guerra contra Phyrexia. Para sellar: todos los mazos completos, cinco guardianes, cinco ligas y Nacional. S.boxClosed elimina enemigos y peligros reaparecidos en Magic; cierre y final de paz reales. Pokémon guarda su propio progreso. La celebración nacional previa al sello no dice que la caja está cerrada.
- Hogar: cama básica utilizable, cocina, comedor, CRT con oráculo IA humorístico que da consejos locales, pósters distintos por mundo, VHS/casetes y vitrina existente. IA no hace peticiones externas.
- Oktoberfest del Lago: patio desde puerta lateral del café de Puerto Varas, sin tapar la salida exterior del café. Hildegard, Otto y Lucho; cerveza/pretzel, cartas, desafío de cata (cooldown tres minutos) y misión de tres sacos de malta en las ciudades del lago. Recompensas moderadas; humor de IA conservado.
- Economía: caballo básico $300.000 (resto de monturas básicas ajustadas), sobres $600.000 con diálogo de scalpers y antigüedad de colecciones. questCoins/levelCoins escalan premios con nivel; nuevas misiones salen gradualmente. Tiendas filtran por requisitos de nivel/trofeos; equipo de monstruos se sustituye por uno utilizable según nivel tras ganar EXP. No quitar equipo ni monedas existentes.
- Botín informa abajo y no pausa combate con cartas gigantes o diálogos de equipo. Crítico conserva daño rojo y CRITICO pequeño debajo, desaparición breve y límite de textos cercanos.
- Vistas públicas seguras, sin guardar: #vista=portal; #vista=portal&viaje; #vista=pokemon&zona=cartasCurico; #vista=liga&zona=cartasCurico; #vista=casa (&pokemon opcional). &captura solo para imagen fija de casa/viaje. #probar sigue siendo solo localhost.
- Validación: node tests/characters.cjs prueba compatibilidad, 112 mapas, gimnasios, sello/ausencia de criaturas, ida/vuelta y serialización, recompensas por nivel, botín, nuevo hogar y cata. Capturas reales del navegador guardadas fuera del repo.
- Menu MEDALLAS: colecciones Magic y Pokemon consultables por separado, con cinco regionales y medalla nacional. Las cinco regionales del mundo activo abren Nacional en Tolaria; los guardianes siguen siendo requisito del sello de Urza. Tiendas TCG sin venta/decoracion de juegos de mesa y sin paneles de combate que tapen standings.
- Bloqueo movil reforzado: CSS explicito en todos los descendientes, eventos de seleccion/menu contextual/copiar/arrastrar interceptados en captura en la pagina completa. Limpia seleccion residual fuera de campos editables. Nombres y codigos conservan edicion. Pruebas de eventos y controles simultaneos aprobadas; telefonos fisicos pendientes.

## Region de Los Lagos: Octay y Pelluco (1 oct 2026)
- Puerto Octay (puertoOctay) zona salvaje al este de Frutillar, vuelta a pie sin Surf. Humedal y costanera, tres variantes propias inspiradas en cartas existentes: Wild Mongrel del Humedal, Baloth Musgoso de Octay (regenera), Merfolk Looter del Llanquihue (dispara). Sprites con adornos locales, cartas y botin habituales por nivel. Reflejo Pokemon: Golduck, Tangela y Poliwhirl; mismas rutas.
- Rodolfo anfitrion fisico junto al circuito, sin bloquear paso. Limpiar la zona habilita carrera a pie de 45 segundos, cuatro banderas en orden y regreso a meta. Best guardado en octayBest; 300 EXP primera vuelta, 100 siguientes, cooldown tres minutos. Salir o agotar tiempo cancela. El personaje Rodolfo tambien puede activar carrera desde meta.
- Pelluco (pelluco) al este de Puerto Montt, playa con quitasoles y reposeras, ale roja $2.500, campus UACh y quincho ficticio La Ultima Diapo. Trini la Mechona, Profe Simon, Don Rojo y Nacho del Cassette. Campus: feria de bienvenida, Semana Cultural con EXP unica, cartas y mision de tres afiches. Quincho: pool/taca-taca jugables, cartas, pista, DJ con cuatro temas. UI de ocio compacta para no tapar nombres/decoracion.
- Dos composiciones originales: pelluco (brisa costera, flauta/harpa a 104 BPM) y mechones (carrete noventero, lead/house a 126 BPM). Respeta silencio. Mapamundi seis columnas; conexiones explicitas evitan salida accidental a Tempest.
- Referencias consultadas: https://pmontt.uach.cl/uach-sede-puerto-montt-dara-la-bienvenida-a-nuevos-y-nuevas-estudiantes-con-programa-de-actividades-2026/ y https://pmontt.uach.cl/agenda/uach-sede-puerto-montt-celebra-las-semanas-artistico-culturales-2025-con-actividades-abiertas-a-la-comunidad/. Campus Pelluco, integracion de estudiantes, musica/danza y talleres son referencias reales; bar, NPCs, cerveza y aventuras son ficcion del juego.
- Pruebas ampliadas: 116 mapas, entradas/salidas sin Surf, carrera secuencial/timeout/abandono/cooldown, reparto de criaturas, cerveza, DJ, inicio de pool/taca y acceso seco a campus/quincho. Previews sin guardar: #vista=octay y #vista=pelluco (zona=uachPelluco o quinchoPelluco opcional), &captura congela solo imagen.
- Puerto Montt: letreros de edificios compactos (letra 4 px, antes 8), ubicados en los techos: Angelmo/Curanto y Centro TCG. Las placas se dibujan despues del agua animada para evitar que esta borre sus letras; no cambian mapas, colisiones ni entradas. Verificado en navegador y pruebas existentes.
- Sorpresa del portal: pokemonDiscovered() habilita coleccion/ayuda Pokemon solo tras llegar al reflejo. switchRealm(pokemon) persiste portalDiscovered fuera de snapshots; partidas anteriores se reconocen por realm=pokemon o snapshot realmProgress.pokemon. Campeon nacional o animacion iniciada no desbloquean. Menu, teclado y clicks protegen coleccion oculta; dialogo previo y vuelo inaugural no nombran Pokemon. Pruebas de texto renderizado, llegada, regreso, serializacion y compatibilidad aprobadas.

## Oktoberfest regional y revision grafica (1 oct 2026)
- Puerto Montt, Puerto Octay y Frutillar tienen puestos propios (Greta, Otto y Lena), toldos de distinto color, banderines animados, faroles de festival con luz calida nocturna y juncos en la costa. Decoracion no solida; accesos y circuito de Rodolfo libres. Musica original oktober con metales, arpa y ritmo festivo; mantiene silencio e identidad musical de interiores TCG.
- Puestos interactivos: jarra/pretzel $3.000 recupera vida/magia, cata existente con cooldown, indicaciones al patio de Puerto Varas y pasaporte de tres sellos. Recompensas unicas 60/60/240 EXP; octubreStops NO: campo real oktoberStops, separado por mundo y guardado sin alterar partidas anteriores. Repetir un sello no paga.
- Eliminados todos los telefonos retro TEL, agregados anteriormente como decoracion noventera; usuario pidio quitarlos. Se conserva cartel/revista TCG.
- Bug corregido: maraton conserva montura seleccionada y la restaura al acabar, cancelar, morir o salir de Octay. Salir cancela inmediatamente; hablar de nuevo durante carrera no reinicia cronometro.
- Pruebas: node tests/characters.cjs aprobado; acceso a NPC/puertas en 116 mapas, puestos alcanzables sin Surf, render nocturno, sellos sin premios duplicados, persistencia/separacion por mundo, compra sin fondos y con curacion, ausencia de telefonos, cancelacion/timeout y restauracion de montura. Revisión visual real de Montt, Octay y Frutillar de noche.
- Nueva vista publica segura sin guardar: #vista=festival&zona=pmontt (o puertoOctay/frutillar), &noche opcional; &captura congela la imagen. No revela el otro mundo.

## Correccion de liga Curico (1 oct 2026)
- Error reportado en ronda 1: Cannot read properties of undefined (reading n). startTour buscaba mazos de los nuevos localPlayer_* solo en DUELIST_DECK antiguo; drawTour intentaba leer DECK[undefined].n.
- startTour ahora usa localPlayerDeck igual que offerDuel, despues DUELIST_DECK para rivales anteriores y landstill como respaldo de NPC reconocido. Respeta estilos y personalidades de cada templo, sin tocar guardados ni reglas de premios.
- Regresion reproducida antes del arreglo. Prueba nueva valida mazo existente, render inicial, tres decisiones, VS, cada carta de replay y resultado en cuatro rondas de los seis templos. Suite completa aprobada (116 mapas), ronda Curico nivel 52 verificada en navegador.

## Letreros compactos globales (1 oct 2026)
- Usuario aprobo tamano de edificios de Puerto Montt. plaque ahora siempre usa tiny de 4 px y placa de 7 px de alto, en todas las ciudades, interiores con titulo de placa y ambos mundos. Centro limitado a bordes del canvas para que nombres largos no se corten. No modifica textos de interfaz, mapas, colisiones ni partidas.
- Suite existente aprobada (116 mapas); revision visual real de Curico y Vina reflejada.

## Accesos, ligas simples y monturas (2 oct 2026)
- widenStairLandings abre un descanso de hasta 3x3 casillas alrededor de U/V en todos los pisos de mazmorra, respetando bordes, cofres y escaleras. Q y peligros cercanos se sustituyen por suelo. Reubica spawns cercanos manteniendo longitud/indices de enemigos para conservar killedAt. Misma geometria en ambos mundos. Tests de cada escalera: salidas interiores, ausencia de peligro, llegada estable sin viaje automatico de retorno.
- Tempest: tercera mesa pasa de [6,6] a [2,6], con sus jugadores. Antes mesa + organizador + rival cerraban la entrada. Prueba exige caminar desde la entrada hasta el interior (no basta poder hablar desde cerca). Movimiento real verificado en navegador.
- Ligas Magic ahora deterministas: tres elecciones otorgan 0/1/2 puntos visibles; nivel suma floor(lvl/10), mazo favorable +1 y premonicion +0.5. Metas regionales 5 (Tempest 6) + floor(round/3); Nacional 7 + floor(round/3). No existe pwin ni tirada aleatoria para ganar. Dado solo ordena primera carta (empate inicia heroe). Nivel 50 vence regionales con respuestas neutrales. Intentos fallidos terminados suman practica (max +3), tercer intento trae +2; campeon resetea practica. leagueRetries se guarda por mundo.
- Replay mas lento (72 cuadros/carta, A acelera a 12): carta, autor y efecto visible (PIERDES/RIVAL PIERDE n VIDAS, RECUPERA, COUNTER/HECHIZO ANULADO, PREPARA COMBO). Counters detectados por texto de carta; Absorb cura. Sin ambiguo NO. VS muestra suma/meta, nivel y mazo, dados/orden; explica control A. Rival usa nombre pequeno para no salir del canvas.
- Duelos/gimnasios: rivales de nivel fijo segun contexto en lugar de copiar automaticamente el nivel del heroe; tactica rival consistente con su baraja, poder del heroe crece con nivel. Dados se muestran como orden y no suman poder. Practica por rival tras derrotas, max +3, reset al ganar (duelRetries por mundo). No elimina victorias previas de gimnasios.
- Limite Magic 100 y reflejo 200. addXP usa levelCap, HUD/barras indican MAX. Al cargar Magic con nivel antiguo >100, conserva nivel/EXP superior en beyondMagic y muestra 100; atributos, HP, objetos, dinero y compras intactos. Viajar al reflejo restaura ese avance. Regreso guarda nivel/EXP del reflejo y aplica 100 en Magic, sin duplicar stats.
- Primer caballo (ID caballo intacto por compatibilidad) ahora Burro de Curico, gris con orejas largas, $300.000 y +8%. Mesa +12, Nightmare +16, Charger +20, Mammoth +24; Shivan +28, Crosis +32, Darigaaz +36. Precios/propiedad/defensa se conservan. Velocidad base usa agilidad con tope +0.8, evitando velocidad descontrolada a niveles altos; Rodolfo conserva factor 1.2. Dialogo de establo actualizado.
- Suite completa aprobada (116 mapas): nuevas pruebas de descansos en ambos mundos, acceso real a interior Tempest, todas las rondas regionales a nivel 50 con dados extremos, orden real primera carta, counters/efectos, tercer intento, limites/migracion de nivel y velocidad progresiva. Capturas reales de descansos, Tempest, estrategia/VS y burro.
- Nuevo gancho solo localhost #probar=D:minas:2&escalera: vista fija del descanso, sin publicar previews de guardados reales.

## Campeon, mazos y poderes del reflejo (2 oct 2026)
- Celebracion de torneo ocupa todo el canvas; copa, dinero/EXP agrupados, medalla/progreso y continuar. X (o tocar texto inferior) consulta premios en dialogo paginado; no superpone pelea ni lista de premios. Maqueta aprobada en previews/campeon.html; interfaz real conserva escala pixel del juego.
- Nacional entrega todos sus premios y entra directamente en ceremonia, sin esperar largos dialogos para revelar el cierre. Titulo Campeon absoluto fijo; al continuar despues de ocho segundos lleva al Santuario del Umbral. Repetir Nacional vuelve a celebrar. Acceso previo por puerta derecha de sala liga conservado; no exige sellar Urza para cruzar ni revela Pokemon antes de viajar.
- Selector compartido: seis mazos por hoja, dos hojas para los diez actuales, letra 4 px, iconos originales y navegacion resaltada con 1/2 y 2/2. Anterior y cancelar siempre disponibles. Altura de fila y toque coinciden; Burn visible. Identificadores y composicion de mazos conservados.
- Reflejo: nombres Fuego, Enjambre, Sombra, Renacer, Vitalidad, Gigantes, Bosque, Mareas, Roca, Acero. Cartas con especie fija y variante numerada; cartas compartidas mantienen identidad. Arte usa misma especie que nombre, sin asignacion generica aleatoria de especies para las barajas. Conserva reglas tacticas propias, NO reglas oficiales Pokemon TCG. Catalogo generado desde codigo real mediante node tests/characters.cjs --catalog, mostrado en previews/mazos-pokemon.html.
- Magias maximo 20, conserva umbrales de niveles 1..10 y experiencia vieja; nuevos umbrales hasta 7750 usos/EXP. Poder sigue escalando con nivel. Cinco poderes exclusivos del reflejo: Trueno de Pikachu, Aurora de Lapras, Llama de Charizard, Pulso de Celebi, Nova de Mewtwo, progresivos NV70/85/100/115/130. Tienda de magia del mundo reflejado. Una vez aprendidos funcionan al regresar.
- Cinco equipos exclusivos del reflejo: gorro Aura, chaleco Entrenador, grebas Gyarados, botas Jolteon, escudo Mewtwo, mismos requisitos progresivos. Tiendas y botin de monstruos del reflejo; filtro de adquisicion y nivel evita obtenerlos en Magic o antes de poder usarlos. Equipo obtenido permanece disponible al regresar.
- Vistas publicas seguras sin guardar: #vista=campeon; #vista=mazos&pokemon (&hoja=2 opcional); #vista=portal existente. Suite completa aprobada: 116 mapas, migracion de magia, exclusivos por mundo/nivel, navegacion/limites del selector, ceremonia con entrega y llegada al santuario. Capturas verificadas en navegador.

## Apertura RPG y safaris regionales (2 oct 2026)
- Despertar reescrito: luz de mañana, baraja en escritorio, sueño de Liga Nacional, rumores de Caja de Urza y salida a aventura. Sin enumerar cocina/comedor/IA. Nueva aventura marca ashIntroPending; personajes/partidas existentes no reinician introduccion.
- Al salir de casa Ash Ketchum de Pueblo Paleta se presenta y acompaña caminando hasta entrada del Safari de la Villa. Ruta BFS evita paredes, puertas, props y NPC; heroe sigue a 24 px con velocidad tranquila, sin combatir ni moverse libremente durante escena. Menu permite omitir. Dialogo final permite entrar o explorar. Flags ashIntroDone/pending persistidos; cargar una salida interrumpida ofrece de nuevo guia, no queda atrapado. Ash no forma parte de colisiones y desaparece al salir de escena.
- Cuatro accesos compactos en sitios libres: Talca [2,8], Las Condes [11,7], Puerto Varas [2,6], dunas Concón [2,4]. Nuevos mapas safariTalca/Condes/Varas/Dunas con paisajes y pools distintos de seis especies, 15 balls por visita y captura existente. Sin edificios nuevos grandes. Entradas/salidas terrestres; regreso no reentra automaticamente. S verde marca safaris en mapa de ciudades visitadas.
- Validacion completa 120 mapas. Caminata cuadro a cuadro con los 19 personajes, sin colisiones; cuatro safaris en ambos mundos, pools, entrada, salida sin Surf y no rebote. Previews sin guardar #vista=ash (&captura opcional) y #vista=safari&zona=safariVaras (otras tres IDs disponibles). Capturas revisadas.

## Barajas Pokemon competitivas y bestias del reflejo (2 oct 2026)
- Diez nuevas barajas pk_: Dragapult, Raging Bolt, Tera Box, Gardevoir, Mega Excadrill/Lucario/Starmie/Greninja, Rocket Mewtwo, Mega Absol. POKEMON_META_DECKS separado de DECKS: los diez mazos Magic y condiciones del sello de Urza conservan sus IDs y requisitos. activeDecks incluye meta + clasicos en Pokemon, solo Magic en presente. No reiniciar colecciones ni claves de guardado.
- Listas publicas completas de 60 cartas con cantidades, ediciones y fuentes Limitless (torneos y deckbuilder, versiones julio-septiembre 2026; Gardevoir referencia abril 2026 previa a rotacion). No afirmar que todas son legales en el mismo formato actual. Catalogo previews/mazos-pokemon.html explica la adaptacion RPG: 12 cartas clave distintas (Pokemon, entrenadores y energia) desbloquean cada baraja; lista de 60 consultable con A en su coleccion. No es un simulador de reglas oficiales TCG.
- Cartas pkc_ identificadas por set/numero; arte original de pixel para los diez protagonistas, entrenadores/energia con simbolos propios, especies clasicas con sprites correspondientes. Tiendas, sobres y botin del reflejo incorporan las claves; filtro evita nuevas cartas Pokemon en Magic. Selector meta de dos hojas; clasicos en categoria aparte. Coleccion de 20 barajas con desplazamiento de nueve filas y geometria de toque coherente.
- POKEMON_MATCHUPS conserva fuente/formato, muestra y tasa por pareja. Ventaja acotada a -1/0/+1, antisimetricamente, minimo 20 partidas decisivas; parejas sin datos o con muestra pequena neutrales. No convertir winrate en victoria aleatoria. Se aplica en duelos y rondas de torneo; pantalla indica matchup favorable/dificil/equilibrado. Nivel, tactica y reintentos dominan. Rivales de los seis gimnasios usan barajas meta; dialogos describen su motor real. Listas/datos archivados en previews/pokemon-meta-references.json, generado desde codigo por --catalog.
- Safari invertido: cinco reservas del mundo Pokemon contienen bestias Magic (Serra Angel, Shivan Dragon, Phyrexian Dreadnought, Masticore, Juggernaut, Birds of Paradise, Metalworker, Deranged Hermit, Spiritmonger), con pools regionales. DOMAR BESTIA lanza sello de mana de cinco colores; 15 sellos por visita. Captura registra magicDex y activa magicPet, sin modificar dex/pet Pokemon del presente. Selector de mascotas permite solo bestias domadas; Shivan inicial conservado por compatibilidad. Nombre/arte de bestias no pasan por traduccion Pokemon.
- Pruebas: 120 mapas, 100 cruces meta, listas suman 60, claves desbloquean barajas, matchup acotado/reversible, tactica correcta a NV100 vence rivales normales, filtros por mundo, navegacion/tocar coleccion, cinco reservas, captura/equipar/bestiario. Suite completa y revisiones de navegador aprobadas. Previews sin guardar: #vista=mazos&pokemon, #vista=duelo-meta (&jugada para resultado), #vista=safari&zona=safariVaras&pokemon. Fotos de selector, duelo y safari verificadas.
