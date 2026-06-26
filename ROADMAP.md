# 🎁 Nuestro cajón — Idea + Roadmap

> Regalo web para el **tercer aniversario**. Una experiencia, no una página.
> Documento vivo: concepto, diseño, arquitectura técnica, modelo de contenido y plan por fases.

---

## Contexto

Matías quiere regalarle a su novia, por su **tercer aniversario**, una app web hecha por él
(es lo que mejor se le da). El regalo tiene **doble objetivo**:

1. **Para ella:** algo emocional e inolvidable, que se sienta **abierto por ella**, no servido.
2. **Para el mundo:** un **repositorio público en GitHub** con código limpio y bien estructurado,
   que dé gusto revisar (escaparate de criterio técnico).

Decisiones de partida del propio Matías (recogidas en la fase de ideación):

- **NO debe sentirse como una landing con scroll.** Tiene que sentirse como **una experiencia**
  (navegación por escenas, gestos, momentos a pantalla completa), dentro de los límites del navegador.
- **Estética nostálgica / scrapbook** (papel, polaroids, washi tape, letra manuscrita, collage).
- Bloques a integrar: **línea del tiempo + carta/razones + zona interactiva**. Las fotos viven
  dentro de las escenas (no hay "galería" como sección aparte).
- **Aún no tiene el contenido** (fotos, fechas, mensajes, canción) → todo va guiado por
  **placeholders** y un **modelo de contenido tipado**, para soltar lo real después sin tocar la UI.
- **Plazo flexible (>1 mes)** → se puede ser ambicioso y muy pulido.
- **Mobile-primary:** ella lo abrirá primero en el **móvil** (p. ej. cenando). El móvil manda;
  el escritorio es un secundario elegante.
- **Stack libre:** no anclarse a sus repos actuales; elegir lo mejor para *esta* experiencia.

> Concepto, diseño y arquitectura se diseñaron con un workflow multi-agente (panel de 5 conceptos →
> jurado de 3 lentes → expertos en diseño/IA/arquitectura/contenido). Concepto ganador: **Nuestro cajón**.

### Decisiones cerradas con el usuario

| Decisión | Elección |
|---|---|
| Metáfora-madre | **Caja / lata de recuerdos** sellada con un lazo |
| Alcance 3D | **Híbrido**: CSS+Motion en todo, **react-three-fiber solo en el clímax final** |
| Entrada | **Puerta suave**: "Esto es para ti, [nombre]" (de paso desbloquea el audio) |
| Despliegue | **Vercel** (SPA estática, enlace privado/no indexado) |
| Idioma | UI en **español** (`lang="es"`); código e identificadores en inglés |
| Estilado | **Object-style con `tailwind-variants`** (`tv`) — JSX limpio, sin strings de clases largas |
| Versiones | **Latest verificadas** (may 2026); APIs confirmadas con **Context7 MCP** antes de codificar |
| `CLAUDE.md` + skills | Se redactan en **Fase 0** siguiendo la guía oficial de Anthropic (ver §7) |

---

## 1. El concepto

**No es una web que se recorre: es una caja de recuerdos que ella abre.**

1. **Puerta suave** — "Esto es para ti, [nombre]". Un toque para entrar (este gesto desbloquea el audio).
2. **La caja sellada** — una lata/cofre atado con un **lazo** sobre papel kraft. Sin menús. La esquina
   del lazo "respira" para invitarla a tirar.
3. **Tira del lazo** — el nudo se deshace, la tapa se abre, arranca el **ambiente sonoro** (sin banners)
   y el encuadre "cae dentro".
4. **El hub (caja abierta)** — collage de **5–7 objetos-recuerdo**. Los no tocados están **velados**;
   un **hilo rojo cosido** une los ya abiertos. La app vive a `100dvh`, **sin scroll de página**.
5. **Cada objeto se abre a pantalla completa** con un **morph** (el objeto *crece*, no hay cambio de página):
   - 🎞️ **Casete → línea del tiempo:** swipe horizontal entre hitos; el sonido "rebobina" según deslizas.
   - ✉️ **Sobre → razones por las que te quiero:** las saca una a una; además **la carta se escribe sola**
     a medida que vive las otras escenas (carta incremental).
   - ✨ **Cielo de papel → zona interactiva:** estrellas/lugares recortados a mano que une
     (**siempre opcional**, imán generoso + tap; nunca un puzzle que frustre).
   - (+ 0–2 objetos opcionales: billete, recuerdo pequeño…)
6. **El doble fondo (momento "wow"):** tras vivir lo esencial, un **compartimento secreto** se revela; la
   caja se vuelve un **planetario de papel recortado a mano** (chinchetas, purpurina, pegatinas
   fosforescentes), las polaroids **ascienden**, entra **vuestra canción** y se traza el mensaje:
   *"cabes en mi mano y a la vez llenas el cielo"*. Queda un **hueco vacío reservado** —
   "nuestro próximo capítulo" — para cerrar como **promesa, no como nostalgia**.

**Por qué se siente como experiencia y no como web:** raíz `h-[100dvh] overflow-hidden` (no existe eje de
scroll); avanzar es un **acto** (coger un objeto), no un reflejo (rodar la rueda); morphs de elemento
compartido (`layoutId`) hacen imposible ver dos secciones a la vez.

**Alternativas descartadas (documentadas):** *Nuestro Cuaderno* (diario que se hojea; más seguro, más
cercano a "libro") y *Constelaciones* (todo el cielo de papel; más espectáculo, más frágil en móvil —
**ya integrado como el gran final** del Cajón).

---

## 2. Arquitectura de la experiencia (escenas)

**Máquina de estados de escenas, no scroll.** Topología **hub-and-spoke** (radial):

```
PUERTA → SEAL (caja sellada) → HUB (caja abierta)
                                  ├── TIMELINE  (casete)
                                  ├── LETTER    (sobre / razones)
                                  ├── SKY        (cielo de papel)
                                  └── [objetos opcionales]
                                  └──(gate)── FINALE (doble fondo / planetario)
```

- **Una escena activa a la vez.** Siempre se vuelve al hub con un **gesto de cierre INVARIABLE**
  (misma esquina/botón en todas las escenas; `Escape` y el *back* del navegador también cierran).
- **Transición = morph** (`Framer Motion` `layoutId` + `AnimatePresence`): el objeto del hub es el mismo
  nodo visual que crece a pantalla completa y vuelve a su hueco al cerrar. El hub queda montado debajo
  (blur/scale) para que el morph de vuelta sea continuo.
- **URL ↔ escena** (`?scene=timeline`) vía History API → reanudar y compartir; *back* = cerrar.
- **Tres modos coexisten:** exploración libre · **índice diegético** (marcapáginas = `<nav>` real, para
  teclado/lectores) · **"enséñamelo todo"** (encadena escenas en orden con vuelos de cámara; primera
  visita y fallback de accesibilidad).
- **Progreso diegético, sin barra:** objetos velados ganan nitidez al abrirse; el **hilo rojo** cose los
  vistos; cerrar una escena **enciende una razón** de la carta (única noción de progreso).
- **Gate del finale:** aparece un compartimento secreto cuando se han visto las escenas núcleo.

**Apertura (primer impacto, 0 chrome):** caja cerrada → lazo que "respira" → **tirar del lazo**
(desbloquea audio con `ctx.resume()` en el handler del gesto) → apertura cinematográfica → hub con
objetos asentándose con micro-física escalonada (`stagger` derivado de seed).

---

## 3. Sistema de diseño scrapbook

**Mood:** nostálgico · hecho a mano · íntimo · cálido · papel envejecido · luz de tarde · imperfecto a
propósito · cinematográfico sin ser sci-fi · tierno y esperanzador.

### Paleta (tokens en `@theme` de Tailwind v4)

| Token | Hex | Uso |
|---|---|---|
| Paper Cream (base) | `#F4ECDD` | Fondo dominante (interior de la caja, papel de escenas). Nunca blanco puro. |
| Kraft Tan | `#D8C3A0` | Cartón, sobres, etiquetas, marcos de polaroid. |
| Aged Tan Deep | `#B79A6E` | Sombras de papel, bordes rasgados (decorativo, no texto). |
| Ink Sepia (texto) | `#3A2E25` | Texto principal (≈8.6:1 sobre crema, AAA). Tinta marrón-negra, nunca `#000`. |
| Faded Ink (texto 2º) | `#6B5B4D` | Metadatos, fechas de matasellos, leyendas (≈4.7:1, AA). |
| Faded Rose (acento) | `#C46A6A` | **El hilo rojo**, sello "visto", estado activo. |
| Rose Deep (foco/hover) | `#A14B4B` | Hover/pressed/foco; rosa legible a tamaño cuerpo (≈5:1). |
| Sage Dust | `#8A9A7B` | Washi verde salvia, sellos, hojas prensadas (decorativo). |
| Dusty Teal | `#5E8C8C` | Tinta azul-verdosa fina, marcapáginas, rutas del mapa. |
| Golden Hour | `#E3B055` | Luz/brillo del clímax, halo de la canción (glow, nunca texto). |
| Night Paper | `#2A2E3A` | Fondo del cielo del finale (azul-pizarra, **no negro sci-fi**). |
| Silver Pen | `#C9CDD6` | Trazo de boli plateado sobre Night Paper (≈6.2:1, AA). |

### Tipografía (3 familias máx., variable + self-hosted con `@fontsource`)

- **Display — Fraunces (variable):** serif literaria con `opsz`/`SOFT`/`WONK`. Títulos de escena,
  mensaje culminante, portada.
- **Manuscrita — Caveat (variable):** leyendas de polaroid, notas, firma. Para las *razones* de la carta,
  una manuscrita más personal (p. ej. *Homemade Apple*) cargada **solo en esa escena**.
- **Cuerpo — Nunito Sans (o Source Sans 3) variable:** textos largos legibles y toda la UI funcional.
- Escala fluida con `clamp()` en tokens (nada de `text-[17px]` arbitrario). La manuscrita se "escribe"
  con `stroke-dashoffset` (SVG), no con opacity. Comillas españolas «», `hyphens`, `lang="es"`.

### Materiales y movimiento

- **Papel como sustancia:** grano tileable a baja opacidad (multiply), bordes **rasgados** con máscaras
  SVG (`feTurbulence`), sombras **cálidas** de doble capa (nunca grises), sombra interior (inset) en la
  caja abierta.
- **Atrezzo tipado (catálogo único en `shared/ui`):** `Polaroid`, `WashiTape`, `StampPin`,
  `PostmarkDate`, `TornEdge`, `ThreadLine`, `PaperFrame`. **Imperfección determinista**: rotación/offset/
  curl/temblor derivados del `id` vía **`mulberry32(seed)`** → estable entre renders, creíble, y gran
  valor de escaparate.
- **Movimiento diegético:** cada transición es un **gesto** (sacar, abrir, voltear, coser, levantar).
  Transiciones de escena 600–900 ms; microinteracciones 120–220 ms. Animar solo `transform`/`opacity`.
- **Microinteracciones clave:** lazo que respira; tirar del lazo (inercia + roce sonoro); objeto que se
  eleva al tocarlo; sello "visto" con rebote; costura del hilo; razón que se enciende; bobinas del casete
  que giran con el swipe (+ `rate()` del audio); razones que se sacan del sobre; polaroid "revelándose"
  (subexpuesta → color); hueco-promesa parpadeando suave.

### Responsive (mobile-primary) y accesibilidad

- **El hub móvil es composición PROPIA**, no un desktop escalado: 5–7 objetos en disposición
  vertical-diagonal **sin solapes**, targets táctiles **≥44px**; posiciones por breakpoint en el modelo
  tipado (no JSX duplicado). `100dvh`/`dvw` + `safe-area-insets` (notch/barra iOS).
- **Gestos:** tap = acción primaria siempre disponible; swipe horizontal (casete); drag corto (sacar
  razones); pan/pinch contenido (cielo). Cerrar = invariable. `navigator.vibrate` suave si existe.
- **`prefers-reduced-motion` con fallbacks REALES** (no solo "apagar"): morph → crossfade; vuelos de
  cámara → corte; finale → collage estático con fades; cielo 3D → 2D navegable.
- **Teclado completo** (Tab entre objetos, `Enter` abrir, `Escape` cerrar), foco diegético visible y
  focus-trap por escena con retorno al objeto origen. **Índice diegético** navegable por lector.
- **WCAG AA** garantizado por paleta; `alt` en español **obligatorio** en cada foto (campo del schema);
  audio **nunca** autoplay forzado (gesto + mute accesible persistente). Objetivo Lighthouse a11y ≥95.

---

## 4. Arquitectura técnica

### Stack (elegido por mérito; encaja con tu experiencia como bonus, no como motivo)

**Vite + React 19 (SPA).** Es una **SPA cinematográfica con estado vivo persistente**: el audio (Howler)
no debe reiniciarse al cambiar de escena, la escena R3F del finale persiste, y `AnimatePresence` + morph
`layoutId` exigen **un único árbol React montado** con router **cliente**. Descartes razonados:

- **Astro** → su valor es enviar 0 JS e hidratar islas por sección; aquí *todo* es una sola isla
  interactiva persistente y el contenido es **privado** (sin SEO). Sería luchar contra el framework.
- **Next App Router** → SSR/RSC/SEO no aportan a una experiencia privada client-only de una sola URL;
  añade peso conceptual (server/client boundary) sin beneficio.

> **Versiones latest verificadas (npm, may 2026):** React/react-dom **19.2**, Vite **8.0**, TypeScript **6.0**,
> Tailwind **4.3**, `motion` **12.40** (antes `framer-motion`), `tailwind-variants` **3.2**, Zustand **5.0**,
> three **0.184** · `@react-three/fiber` **9.6** · `@react-three/drei` **10.7** · `@react-three/postprocessing` **3.0**,
> Howler **2.2**, **Zod 4.4**, Biome **2.4**, Vitest **4.1**, `@fontsource-variable/*` **5.x**.
> Hay majors recientes (Vite 8, TS 6, Zod 4) → **confirmar siempre la API con Context7 antes de codificar**
> (misma regla que tu `physics_app`).

| Librería (versión) | Propósito |
|---|---|
| `react` + `react-dom` **19.2** | Árbol único persistente; `AnimatePresence` controla entradas/salidas sin desmontar audio/3D. |
| `typescript` **6** (strict + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`) | Contenido y registro de escenas totalmente tipados; cero `as any`/`@ts-ignore`. |
| `vite` **8** + `@vitejs/plugin-react` | Dev/build, **code-split por escena**, aislamiento del chunk R3F. |
| `tailwindcss` **4** + `@tailwindcss/vite` | Estilos vía `@import "tailwindcss"` + tokens en `@theme`. |
| **`tailwind-variants` 3** + `tailwind-merge` + `clsx` | **Patrón object-style** (`tv`): base/slots/variants/compoundVariants. `cn()` (`clsx`+`tailwind-merge`) para merges puntuales. |
| **`motion` 12** (ex `framer-motion`) | Capa 2D/DOM (≈90%): import desde `motion/react`; morph `layoutId` + `AnimatePresence`, variants, springs; `useReducedMotion`; `LazyMotion` para reducir bundle. |
| `zustand` **5** | Store único (navegación, narrativa, audio, finale); selectores finos; `getState()` en `useFrame`. |
| `three` **0.184** + `@react-three/fiber` **9** + `@react-three/drei` **10** + `@react-three/postprocessing` **3** | **Solo el finale**: polaroids ascendiendo, glow fosforescente (bloom contenido). Lazy + `frameloop="demand"`. |
| `howler` **2.2** | `AudioEngine` **singleton**: ambiente al abrir, `rate()` del casete, canción reservada al clímax. |
| **`zod` 4** | **Fuente de verdad** del contenido (`z.infer`); valida en dev/build (soltar contenido real no rompe en silencio). |
| `@fontsource-variable/*` **5** | Fuentes variables self-hosted (sin FOIT/CLS). |
| `vitest` **4** + `@testing-library/react` + `happy-dom` | Tests **ligeros** de lógica pura (no píxeles). |
| `@biomejs/biome` **2** + `lefthook` **2** | Lint+format+git hooks (repo de un solo paquete; más simple que ESLint+Prettier). |

> *Opcional de escaparate:* la máquina de escenas puede formalizarse con **XState** si quieres lucir un FSM
> explícito; por defecto basta una tabla de transiciones guardadas en `scene-engine` (más ligero).

### Convención de estilado — object-style con `tailwind-variants`

Para que el JSX quede **limpio y sin strings de clases gigantes**, cada componente y cada primitivo de
atrezzo declara sus clases en un objeto `tv({...})` (base · `slots` · `variants` · `compoundVariants` ·
`defaultVariants`). El `twMerge` va integrado; `cn()` queda para merges puntuales con props.

```ts
// shared/ui/polaroid/polaroid.styles.ts
import { tv } from "tailwind-variants";

export const polaroid = tv({
  slots: {
    root: "relative bg-paper-cream p-2 pb-8 shadow-paper",
    photo: "block h-full w-full object-cover",
    caption: "absolute inset-x-0 bottom-1 text-center font-hand text-faded-ink",
  },
  variants: {
    tilt: { left: { root: "-rotate-2" }, right: { root: "rotate-2" }, none: {} },
    size: { sm: { root: "w-28" }, md: { root: "w-40" }, lg: { root: "w-56" } },
  },
  defaultVariants: { tilt: "none", size: "md" },
});

// uso — JSX sin clases inline:
const { root, photo, caption } = polaroid({ tilt, size });
// <figure className={root()}><img className={photo()} …/><figcaption className={caption()}>…</figcaption></figure>
```

Reglas: el estilado **estático** va siempre por `tv` (cero strings de Tailwind largos en el JSX); los tokens
(`paper-cream`, `shadow-paper`, `font-hand`…) se definen en `@theme`. **Única excepción** al "no `style={{}}`":
la imperfección determinista **por-`id`** (rotación/curl/temblor) se inyecta como **CSS variable** con
`seededTransform(id)` (mulberry32) y se consume desde la clase (p. ej. `rotate-[var(--seed-rot)]`).

### Estructura de carpetas (feature-based; alias `@app @scenes @features @shared @content @assets`)

```
the-drawer-of-days/
├── .github/workflows/        # ci.yml (biome + tsc + vitest) · deploy.yml
├── public/                   # solo favicon, og (no pasan por el bundler)
├── src/
│   ├── app/
│   │   ├── main.tsx          # entry Vite
│   │   ├── App.tsx           # shell: SceneRouter + capas persistentes (AudioEngine, CanvasLayer)
│   │   ├── SceneRouter.tsx    # AnimatePresence + sync URL↔escena (History API)
│   │   └── styles/{globals.css, theme.css}   # @theme: papel, sepia, washi, fuentes, sombras
│   ├── scenes/               # una carpeta por ESCENA a pantalla completa (no "secciones")
│   │   ├── door/             # puerta suave "para ti, [nombre]" (+ desbloqueo audio)
│   │   ├── sealed-box/        # caja + lazo que "respira" + drag para abrir
│   │   ├── open-box-hub/      # collage radial: objetos velados + hilo rojo + índice
│   │   ├── cassette-timeline/ # línea del tiempo (swipe horizontal, scroll-snap)
│   │   ├── letter-envelope/   # razones que se sacan del sobre (+ scroll en papel)
│   │   ├── paper-sky/         # zona lúdica 2D (CSS/Framer/SVG)
│   │   └── finale-double-bottom/  # doble fondo: R3F + canción + hueco-promesa
│   │       └── (cada escena: index.tsx, components/, hooks/, content-binding.ts, *.test.ts)
│   ├── features/             # mecánicas transversales
│   │   ├── audio/            # AudioEngine (Howler singleton) + useAudio()
│   │   ├── narrative/        # carta incremental, hilo rojo, registro "visto" (funciones puras)
│   │   ├── scene-engine/     # registro tipado de escenas + transiciones + "enséñamelo todo"
│   │   ├── reduced-motion/   # detección + fallbacks
│   │   └── diegetic-index/   # marcapáginas (nav no lineal + teclado)
│   ├── shared/
│   │   ├── ui/               # CATÁLOGO DE ATREZZO (escaparate): Polaroid, WashiTape, StampPin, …
│   │   ├── lib/              # cn.ts, seededRotation.ts (mulberry32), prefersReducedMotion.ts
│   │   ├── hooks/            # useMediaQuery, useSwipe, useKeyboardNav, useImagePreload
│   │   ├── types/            # SceneId, Vec2, AssetRef
│   │   └── config/           # timings/easings centralizados (sin magic numbers)
│   ├── content/             # MODELO DE CONTENIDO (fuente de verdad)
│   │   ├── schema.ts        # esquemas Zod
│   │   ├── timeline.ts · reasons.ts · hub.ts · song.ts   # PLACEHOLDERS
│   │   ├── index.ts         # parsea+valida TODO al importar (falla rápido)
│   │   └── placeholders/    # textos/fechas ficticios marcados // TODO
│   └── assets/{textures, photos, audio}   # placeholders con dimensiones reales; reemplazables sin tocar código
├── biome.json · lefthook.yml · tsconfig.json · vite.config.ts · index.html
├── README.md · LICENSE (MIT) · CHANGELOG.md
└── CLAUDE.md                 # convenciones para el agente (ver §7) + .claude/skills/
```

Reglas: cada feature/escena exporta solo por `index.ts`; las escenas **no se importan entre sí** (van por
`scene-engine`); `shared/` sin lógica de dominio; dentro de `src` siempre alias, nunca `../`.

### Modelo de contenido + placeholders (clave: el contenido llega después)

`src/content/schema.ts` define Zod y los tipos se **infieren** con `z.infer` (nunca a mano):

```ts
Milestone  { id, date: ISODate, title, body, photos: AssetRef[], side?: 'A'|'B' }
Reason     { id, order, text, unlockedBy?: SceneId }        // carta incremental
HubObject  { id, label, scene: SceneId, art: AssetRef, palmSize: boolean }
SkyNode    { id, label, media?: AssetRef, position }
Song       { src, ambientSrc, climaxAt?: seconds, stems?: {momentId, atSec}[] }
AssetRef   { src, alt, width, height, blurDataURL? }        // width/height OBLIGATORIOS → CLS=0
```

- `content/index.ts` hace `schema.parse()` al cargar → si el contenido real no cumple, **falla en
  dev/build** con mensaje claro (nunca a medias en runtime).
- Cada archivo vive ya **poblado con placeholders** (`// TODO: contenido real`). Fotos placeholder con
  **las mismas `width/height`** que las reales → soltar las definitivas no mueve un píxel.
- Más adelante Matías solo edita los `.ts` de `content/` y deja caer archivos en `assets/`
  (nombres en kebab-case = ids de cada slot): **cero cambios de lógica ni UI**.

### Rendimiento · audio · assets

- **Carga inicial = solo la puerta/caja sellada.** Cada escena es `dynamic import`; **Three/R3F es su
  propio chunk** diferido al finale; Howler se carga tras el gesto. Prefetch de la siguiente escena en idle.
- Imágenes desde `assets/` (bundler → hash + cache inmutable), AVIF/WebP + `srcset` + lazy + **blur-up**
  (LQIP que encaja con el revelado de polaroid).
- `AudioEngine` singleton montado en `App` (razón nuclear de elegir SPA): ambiente en `openBox()`,
  canción `fade-in` en `enterFinale()`, `rate()` del casete ligado al swipe; mute siempre accesible.
- R3F: `frameloop="demand"` salvo el swell del finale; `dpr` limitado; menos partículas en móvil;
  Vector3/typed arrays en `useRef`, nunca dentro de `useFrame`; store leído por `getState()`.

### Higiene de repo (público) + despliegue

- **README** (en inglés): qué es, demo/GIF, el concepto, **por qué** las decisiones técnicas, arquitectura
  por escenas, modelo de contenido, comandos, **nota de privacidad** (el contenido real no se versiona).
- **LICENSE MIT** para el código + nota de que fotos/textos personales **no** están incluidos/licenciados.
- `CHANGELOG.md` (Keep a Changelog), commits convencionales (opcional `commitlint` en `lefthook`),
  `.github` (CI espejo, deploy, templates), ADRs cortos en `docs/` para las decisiones de stack.
- **`.gitignore` que EXCLUYE los assets personales reales** (fotos/canción/textos definitivos) → solo
  viven los placeholders en el repo público.
- **Vercel:** `pnpm build` → `dist/`; `vercel.json` con **rewrite SPA** de todo a `/index.html` (para que
  `?scene=` y deep-links reanuden sin 404); `Cache-Control: immutable` para `/assets/*` hasheados.
  **Enlace privado / `noindex`** para ella (separado del repo de código, que sí es público).

---

## 5. Modelo de contenido — slots y checklist de material

Slots tipados con placeholder y escena destino (extracto; lista completa en `content/schema.ts`):

- **Global:** `herName` ("Mi amor"), `anniversaryDate`, `relationshipStartDate`, `seed.global`.
- **Puerta/Seal:** `greetingLine` ("Para ti. Tira del lazo."), `subGreetingLine`, `ambientTrack.src` (loop
  casi inaudible, **sin melodía**).
- **Hub:** 5–7 `hubObjects` (`thumbnail` PNG recortado ~600px + `label` manuscrito + `caption`).
- **Timeline (casete):** `milestones[]` = `date`, `title`, `body` (2–4 frases), `photo` (4:5, ≥1200px),
  `photoAlt`, `clip?` (mudo ≤8s), etiquetas Cara A / Cara B.
- **Carta (sobre):** `salutation`, `reasons[]` = `text` + `unlockedByScene?` + `accentPhoto?`,
  `closingLine`, `signature`.
- **Cielo de papel:** `stars[]` = `label` + `photo?`/`photoAlt?`; `constellations[]` = `name` + `starIds`;
  `revealMessage`.
- **Finale:** `thesisLine` ("cabes en mi mano y a la vez llenas el cielo"), `song.src/title/swellCue?`,
  `ascendingPhotos[]` (5–9, reutilizables), `promise.frameLabel/pendingDate(vacía a propósito)/note`.

**Checklist para Matías (rellenar `content/*.ts` + soltar archivos en `assets/`):**

1. **Identidad y fechas** (desbloquean vocativos/contadores): nombre/apodo, fecha de aniversario y de inicio (ISO).
2. **Audio ambiente:** loop casi inaudible (zumbido de cinta+sala, sin melodía), MP3 <300KB.
3. **La canción del finale:** MP3 + título/artista (+ segundo del estribillo para sincronizar). Revisar derechos si el repo es público.
4. **Objetos del hub** (mín. 3: casete, sobre, mapa estelar): PNG recortado con alfa + etiqueta + caption.
5. **Línea del tiempo:** 5–9 hitos (fecha ISO, título, 2–4 frases, foto 4:5 ≥1200px + alt; clip opcional).
6. **Carta:** 6–12 razones (concretas, no tópicos), orden, cuáles se desbloquean en qué escena; saludo, cierre, firma.
7. **Cielo de papel:** lugares/viajes como estrellas (label + foto opcional); 1–3 constelaciones + frase revelación.
8. **Finale:** mensaje culminante; 5–9 polaroids que ascienden; redactar el hueco-promesa.
9. **Accesibilidad:** `alt` en español para TODA foto/clip.
10. **Estándares de assets:** fotos ≥1000–1200px, recortes PNG con alfa, clips MP4 H.264 mudos con poster, nombres kebab-case = ids de slots.

---

## 6. Roadmap por fases

> Metodología: TDD para la lógica pura (scene-engine, mulberry32, validación Zod, reducers del store) y
> `frontend-design` para el trabajo visual. Cada fase deja la app **funcionando y verificable** en móvil.

- **Fase 0 — Cimientos del repo + docs de agente.** Scaffold Vite 8 + React 19 + TS strict; Tailwind v4
  (`@import "tailwindcss"` + `@theme`) + `tailwind-variants` + `cn()`; Biome + lefthook; vitest; alias paths;
  `.github` (CI: biome+tsc+vitest); README/LICENSE(MIT)/CHANGELOG; `.gitignore` que excluye assets personales
  **y `CONTEXT7_API_KEY`**; `vercel.json` con rewrite SPA. Portar `cn()` y `mulberry32` (de `physics_app`) →
  `shared/lib`. **Redactar `CLAUDE.md` + las 5 skills** y la config de **Context7 MCP**
  (`opencode.json`/`.mcp.json` con `${CONTEXT7_API_KEY}`) — ver §7.
- **Fase 1 — Motor de la experiencia.** `scene-engine` (registro tipado + tabla de transiciones + gesto
  de cierre invariable); `useExperienceStore` (Zustand, slices navigation/narrative/audio/finale);
  sync URL↔escena; `SceneRouter` (`AnimatePresence` + scaffolding `layoutId`); `App` con capas
  persistentes (`AudioEngine`, `CanvasLayer`); detección reduced-motion. **(TDD: reducers/transiciones.)**
- **Fase 2 — Diseño + catálogo de atrezzo.** `theme.css` (paleta, fuentes `@fontsource`, sombras polaroid);
  primitivos en `shared/ui` (`Polaroid`, `WashiTape`, `StampPin`, `PostmarkDate`, `TornEdge`, `ThreadLine`,
  `PaperFrame`) con `seededTransform(id)`. **(TDD: determinismo de rotaciones.)**
- **Fase 3 — Modelo de contenido + placeholders.** `content/schema.ts` (Zod) + `content/*.ts` poblados +
  `content/index.ts` que valida al importar; placeholders de fotos con dimensiones reales + pipeline
  blur-up. **(TDD: parseo de todo el contenido.)**
- **Fase 4 — Puerta + caja sellada + hub.** `door` (saludo + desbloqueo audio); `sealed-box` (lazo que
  respira, drag para abrir); `open-box-hub` (collage, objetos velados, hilo rojo cosido, índice diegético,
  mute, "enséñamelo todo"). Morph hub↔escena operativo.
- **Fase 5 — Escena: línea del tiempo (casete).** Swipe horizontal scroll-snap; polaroids integradas;
  `rate()` del audio ligado al swipe; bobinas girando.
- **Fase 6 — Escena: carta/razones (sobre).** Sacar razones una a una; `PaperFrame` con scroll confinado;
  **carta incremental** (`unlockedBy`).
- **Fase 7 — Escena: cielo de papel (zona lúdica, 2D).** Estrellas/lugares en CSS/Framer/SVG; mecánica de
  unir **opcional** (imán + tap); fotos que emergen al tocar.
- **Fase 8 — Finale (doble fondo, R3F).** Planetario de papel recortado a mano; polaroids ascendiendo;
  **canción protagonista** (fade del ambiente); mensaje culminante trazado; **hueco-promesa**. Fallback
  reduced-motion (collage estático).
- **Fase 9 — Pulido: a11y, rendimiento, responsive, QA.** Lighthouse (a11y ≥95, perf alto); teclado y
  focus-trap; reduced-motion en todas las escenas; `dpr` cap; verificar code-split del chunk R3F;
  safe-area; haptics; deep-links `?scene=`.
- **Fase 10 — Contenido real + despliegue.** Sustituir placeholders; deploy en **Vercel** con enlace
  privado/`noindex`.
> `CLAUDE.md` + skills + Context7 MCP ya **no** quedan pendientes: se hacen en **Fase 0** (ver §7).

---

## 7. `CLAUDE.md` + skills (se redactan en Fase 0, según la guía de Anthropic)

Ya tengo la **guía oficial de Anthropic**. Se redactan en **Fase 0**, concisos y siguiendo sus principios
+ el estilo de tu `physics_app/CLAUDE.md` (que es un modelo excelente).

**`CLAUDE.md`** (raíz, conciso — solo lo que Claude NO puede inferir leyendo el código; podar sin piedad,
porque un `CLAUDE.md` inflado hace que se ignoren las reglas):
- **Commands:** `pnpm dev | build | test | typecheck | check`.
- **Architecture:** una sola pantalla (`100dvh`, sin scroll), máquina de escenas hub-and-spoke, capas
  persistentes (`AudioEngine`, `CanvasLayer`), morph `layoutId`.
- **Key Conventions:** alias `@app/@scenes/@features/@shared/@content/@assets` (nunca `../`); **estilado
  object-style con `tailwind-variants`** + `cn()`, **sin `style={{}}`** salvo la CSS-var de `seededTransform`;
  Zustand (selectores en componentes, `getState()` en `useFrame`, **nunca `setState` en `useFrame`**); R3F
  (lazy + `frameloop="demand"`, `Vector3` en `useRef`).
- **Invariantes de la experiencia (gotchas):** no hay scroll de página; **mobile-primary**; el gesto de
  **cerrar es invariable**; **toda escena declara su fallback de `prefers-reduced-motion`**; el contenido
  llega por **Zod** (jamás literales inline); el audio es **singleton** desbloqueado por el gesto de abrir.
- **TypeScript:** strict; sin `as any`/`@ts-ignore`; tipos **inferidos** del schema Zod (nunca redefinidos).
- **Context7 MCP:** *"Always use Context7 before writing code that touches a library API"* (tu misma regla).
- **Skills:** tabla de cuándo invocar cada una.

**Skills** (`.claude/skills/<name>/SKILL.md`, frontmatter `name` + `description`, carga **bajo demanda**;
mismo formato que tu `physics-module`): `scene-architecture` (contrato del scene-engine, cierre invariable,
sync URL↔escena), `scrapbook-design` (tokens `@theme`, atrezzo `tv`, rotaciones seed), `content-model` (Zod
como fuente de verdad + cómo soltar contenido real sin tocar UI), `audio-howler` (AudioEngine singleton,
desbloqueo por gesto, pitch del casete), `r3f-paper-sky` (finale, `frameloop`, fallback 2D).

**Context7 MCP en el repo** (réplica de tu `physics_app`): `opencode.json` + `.mcp.json` con el servidor
`context7` apuntando a `https://mcp.context7.com/mcp` y la cabecera `CONTEXT7_API_KEY: ${CONTEXT7_API_KEY}`
**por variable de entorno**. ⚠️ El token **nunca** se escribe en el repo (va en tu shell / `.env.local`
gitignored); este documento tampoco lo contiene.

*Opcionales (de la guía de Anthropic):* un subagente `.claude/agents/experience-reviewer.md` (revisa el diff
contra los invariantes de la experiencia + a11y en contexto limpio) y un hook de Claude Code que pase Biome
tras editar archivos (lefthook ya cubre pre-commit/pre-push de forma determinista).

---

## 8. Verificación (cómo probar de punta a punta)

Tras cada fase y al final:

1. **Recorrer la experiencia en viewport móvil** (DevTools device mode o móvil real):
   puerta → tirar del lazo (**el audio se desbloquea**) → hub → abrir cada objeto (morph) → cerrar
   (gesto **invariable**) → desbloquear y entrar al **finale** (canción + hueco-promesa).
2. `pnpm typecheck` · `pnpm check` (Biome) · `pnpm test`
   (Zod parsea todo el contenido · `mulberry32` determinista · reducers del store · scene-engine).
3. Activar **`prefers-reduced-motion`** y verificar fallbacks (morph→crossfade, finale→collage estático, cielo→2D).
4. **Lighthouse móvil:** a11y ≥95, rendimiento alto; navegación por teclado en móvil y escritorio.
5. **Deep-link** `?scene=timeline` reanuda; el *back* del navegador cierra al hub.
6. Confirmar **code-split**: el chunk de Three/R3F solo se descarga al entrar al finale.
7. Verificar que **no se versionan** assets personales reales (solo placeholders) antes de publicar.
8. **Verificación visual:** captura de pantalla de cada escena en móvil y compárala con el sistema de diseño
   — la guía de Anthropic insiste en darle a Claude un *check* que pueda ejecutar solo (test, build o
   **screenshot**), para cerrar el bucle sin depender de revisión manual.

---

## 9. Primeros pasos al salir del plan (no-código primero)

1. Crear `/home/matias/dev/the-drawer-of-days/` con este documento como `ROADMAP.md`.
2. Guardar **memoria de proyecto** (objetivo, concepto, decisiones cerradas, versiones latest, token Context7 por env).
3. Arrancar **Fase 0** (scaffold del repo).
