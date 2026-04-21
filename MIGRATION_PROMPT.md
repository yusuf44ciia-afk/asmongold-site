# PROMPT: Migrazione Portfolio Nicola Romei da HTML/Webflow a Next.js 15

## Obiettivo
Convertire il sito portfolio **www.nicolaromei.com** da sito statico HTML esportato da Webflow a un'applicazione **React / Next.js 15** moderna, mantenendo tutte le animazioni, effetti WebGL, e interazioni esistenti.

---

## Stack Tecnico

| Layer | Tecnologia | Versione |
|-------|-----------|----------|
| Framework | Next.js (App Router) | 15+ |
| Linguaggio | TypeScript | 5.x |
| Styling | Tailwind CSS | v4 |
| 3D / WebGL | Three.js (raw, NO @react-three/fiber) | latest |
| Animazioni | GSAP + @gsap/react | 3.12+ |
| Smooth Scroll | Lenis | latest |
| Carousel (AI page) | Embla Carousel (sostituto Flickity) | latest |
| Video Streaming | HLS.js | latest |
| Font Loading | next/font (Google + local) | built-in |
| Deployment | Vercel | - |
| Package Manager | pnpm | latest |
| Linting | ESLint + Prettier | latest |

### Dipendenze GSAP (richiede GSAP Club)
- gsap (core)
- @gsap/react
- ScrollTrigger
- SplitText (Club)
- Draggable (Club)
- InertiaPlugin (Club)
- ScrambleTextPlugin (Club)
- CustomEase
- Observer
- TextPlugin

---

## Architettura Pagine

### Routes

| Route | Pagina | Descrizione |
|-------|--------|-------------|
| `/` | Home | Hero con galleria WebGL Three.js infinita, preloader, CRT overlay |
| `/archive` | Archive | Lista progetti con gallery/list toggle, scroll inerziale, minimap |
| `/profile` | Profile | Bio, griglia skills, parallax, footer slider draggabile |
| `/ai-exploration` | AI Exploration | Galleria AI con slider, copia prompt negli appunti |
| `/works/[slug]` | Case Study | Template dinamico per 8 progetti (generateStaticParams) |

### Slugs dei progetti
`retronova`, `nicola-romei`, `creative-leap`, `made-in-evolve`, `valsavarenche`, `davide-cattaneo`, `studies-in-form`, `geotab-signals`

---

## Struttura Cartelle

```
src/
├── app/
│   ├── layout.tsx                 # Root layout: font, CRT, cursor, providers
│   ├── page.tsx                   # Home (WebGL canvas)
│   ├── archive/
│   │   └── page.tsx               # Archive
│   ├── profile/
│   │   └── page.tsx               # Profile / About
│   ├── ai-exploration/
│   │   └── page.tsx               # AI Gallery
│   └── works/
│       └── [slug]/
│           └── page.tsx           # Case study dinamico
│
├── components/
│   ├── layout/
│   │   ├── Preloader.tsx          # Preloader 2.4s con counter, image reveal, session-aware
│   │   ├── PageTransition.tsx     # Fade overlay tra route (GSAP)
│   │   ├── CRTOverlay.tsx         # Scanlines + vignette + flicker (puro CSS)
│   │   ├── ProgressiveBlur.tsx    # Pannelli blur top/bottom
│   │   ├── LandscapeWarning.tsx   # Avviso rotazione device
│   │   └── CustomCursor.tsx       # Cursore custom smooth-follow (lerp 0.05)
│   │
│   ├── text/
│   │   ├── SplitHeading.tsx       # Reveal testo per righe (SplitText + ScrollTrigger)
│   │   ├── BlinkText.tsx          # Effetto blink caratteri random
│   │   ├── ScrambleText.tsx       # Effetto scramble testo
│   │   ├── ButtonAnimateChars.tsx # Bottone con stagger caratteri hover
│   │   └── UnderlineLink.tsx      # Link con underline animato (::before/::after)
│   │
│   ├── home/
│   │   ├── HeroCanvas.tsx         # Galleria WebGL infinita (Three.js)
│   │   ├── HeroNav.tsx            # Overlay navigazione (location, expertise, social, CTA)
│   │   └── LiveClock.tsx          # Orologio real-time timezone (Europe/Rome)
│   │
│   ├── archive/
│   │   ├── TabSwitcher.tsx        # Toggle Gallery/Clients
│   │   ├── InertialGallery.tsx    # Scroll inerziale lerp-based con click-to-select
│   │   ├── ClientList.tsx         # Lista clienti con hover preview (clip-path)
│   │   └── Minimap.tsx            # Indicatore/minimap navigazione
│   │
│   ├── project/
│   │   ├── ProjectHero.tsx        # Hero case study (nav, desc, servizi, keywords)
│   │   ├── ProjectSlider.tsx      # Three.js Sketch crossfade immagini (prev/next)
│   │   ├── ProjectDetails.tsx     # Grid tools, visual identity, partner
│   │   ├── ConceptSection.tsx     # Word scroll-reveal (mwg_effect005)
│   │   ├── PixelateImage.tsx      # Pixelazione canvas su hover
│   │   └── ProjectFooter.tsx      # Footer con riconoscimenti e social
│   │
│   ├── profile/
│   │   ├── AboutHero.tsx          # Bio + titolo con blink
│   │   ├── SkillsGrid.tsx         # Griglia 6 colonne: capabilities, stack, process
│   │   └── FooterSlider.tsx       # Slider infinito draggabile (GSAP Draggable)
│   │
│   ├── ai/
│   │   ├── AISlider.tsx           # Carousel Embla full-screen
│   │   └── PromptCard.tsx         # Card con copia prompt (Clipboard API)
│   │
│   └── shared/
│       ├── ParallaxSection.tsx    # Wrapper parallax (ScrollTrigger)
│       └── BunnyPlayer.tsx        # Video background HLS
│
├── hooks/
│   ├── useHomeCanvas.ts           # Logica Three.js galleria home (Core + Plane)
│   ├── useProjectSlider.ts        # Logica Three.js Sketch class
│   ├── usePixelate.ts             # Logica pixelazione canvas
│   ├── useInertialScroll.ts       # Scroll lerp-based per archive
│   ├── useLenis.ts                # Hook context Lenis
│   ├── useSplitText.ts            # SplitText + GSAP integration
│   ├── useParallax.ts             # ScrollTrigger parallax
│   ├── useClock.ts                # Orologio timezone-aware
│   └── usePreloader.ts            # Stato preloader (sessionStorage)
│
├── providers/
│   ├── LenisProvider.tsx          # Context Lenis smooth scroll
│   ├── TransitionProvider.tsx     # Stato transizioni pagina
│   └── CursorProvider.tsx         # Stato cursore (posizione, variante)
│
├── data/
│   ├── projects.ts                # Dati 8 progetti (interfaccia Project)
│   ├── gridImages.ts              # 25 URL immagini griglia home
│   ├── aiSlides.ts                # Slide AI exploration + prompt
│   └── siteConfig.ts              # Metadata globali, social links
│
├── lib/
│   ├── three/
│   │   ├── homeCanvas.ts          # Classi Core + Plane (da bundle.js righe 910-1295)
│   │   ├── projectSketch.ts       # Classe Sketch (da bundle.js righe 116-476)
│   │   └── shaders.ts             # Vertex/Fragment shader GLSL
│   ├── gsap/
│   │   └── register.ts            # Registrazione plugin (una volta sola)
│   └── utils.ts                   # Utilita condivise
│
└── styles/
    └── globals.css                # Tailwind directives + CRT + effetti custom
```

```
public/
├── images/
│   ├── grid/                      # 25 immagini galleria home
│   ├── projects/                  # Immagini per progetto
│   │   ├── retronova/
│   │   ├── creative-leap/
│   │   └── ...
│   ├── preloader/                 # 5 immagini preloader
│   ├── ai/                        # Immagini AI exploration
│   └── profile/                   # Immagini pagina profilo
├── fonts/                         # Font self-hosted (EaseGeometricB)
└── og/                            # Immagini OpenGraph
```

---

## Specifiche Tecniche Dettagliate

### 1. ROOT LAYOUT (`layout.tsx`)

```typescript
// Responsabilita:
// - Caricamento font via next/font (Host Grotesk da Google, EaseGeometricB locale)
// - Wrapping con LenisProvider, TransitionProvider, CursorProvider
// - Rendering di CRTOverlay, Preloader, PageTransition, CustomCursor, LandscapeWarning
// - Metadata globale + Schema.org (ProfilePage, Person)
// - Registrazione GSAP plugin (importa lib/gsap/register.ts)

// Font:
// - Host Grotesk: weight 300-700, display: 'swap', subsets: ['latin']
// - EaseGeometricB-Bold: next/font/local da file .woff in public/fonts/
```

### 2. HOME PAGE - WebGL Canvas (`/`)

#### HeroCanvas.tsx
```
- Componente 'use client', importato con next/dynamic({ ssr: false })
- Usa useHomeCanvas(containerRef, gridDataRef) hook
- Rendering: container div full-screen con z-index sotto il nav overlay
- La pagina home NON usa Lenis (lo scroll e gestito dal canvas WebGL)
```

#### Three.js Home Canvas (lib/three/homeCanvas.ts)
```
Classi da portare da bundle.js (righe 910-1295):

class Plane:
  - Crea PlaneGeometry per ogni immagine della griglia
  - ShaderMaterial con vertex/fragment custom
  - Uniform: u_texture, u_res, u_size, u_velo, u_viewSize
  - Posizionamento in griglia con wrapping infinito
  - Parallax multiplier per riga: my = 1 - (i % 5) * 0.1

class Core:
  - OrthographicCamera
  - WebGLRenderer (pixelRatio clampato 1-1.5)
  - Event listener: wheel, touch, resize
  - VirtualScroll per input
  - Render loop RAF
  - Velocita e inerzia per drag
  - Calcolo posizioni con gsap.utils.wrap
```

#### Shaders (lib/three/shaders.ts)
```glsl
// Vertex Shader:
// - Applica curvatura basata su velocita (y-offset)

// Fragment Shader:
// - RGB shift (intensity: 0.03)
// - Random noise generation
// - Vignette (bordi scuri)
// - Texture cover calculation (mantiene aspect ratio)
```

#### HeroNav.tsx
```
- Overlay posizionato sopra il canvas (position: relative, z-index alto)
- Sezioni: location + orologio, expertise, social links, bio, CTA buttons
- CTA: "THE ARCHIVE" -> /archive, "THE PROFILE" -> /profile
- Social: Awwwards, LinkedIn, Email (info@nicolaromei.com)
```

#### LiveClock.tsx
```
- Intl.DateTimeFormat con timeZone: "Europe/Rome"
- Aggiornamento ogni secondo (setInterval 1000ms)
- Display: HH:MM:SS TIMEZONE
- Client-only rendering (useEffect)
```

### 3. ARCHIVE PAGE (`/archive`)

#### InertialGallery.tsx
```
Da portare da archive.js:
- Scroll lerp-based (ease: 0.07)
- Direzione: orizzontale (desktop > 900px) / verticale (mobile)
- 8 progetti con immagini preview
- Click-to-select con posizionamento animato
- Opacity fade su elementi non attivi
- Sincronizzazione con Minimap
- Easing: power4.inOut, duration: 1.0
- clipRadius: "0.2em" sui bordi immagini
```

#### TabSwitcher.tsx
```
- Due modalita: Gallery (default) / Clients (List)
- Toggle con classe active
- Transizione smooth tra le due viste
```

#### ClientList.tsx
```
- Lista progetti con hover preview
- Hover: crea immagine dinamica con clip-path polygon reveal
- Scale immagine: 1.25 -> 1
- Auto-cleanup elementi stale
```

#### Minimap.tsx
```
- Indicatore posizione corrente
- 8 thumbnail con data-name per ogni progetto
- Sincronizzato con lo scroll della gallery
```

### 4. PROFILE PAGE (`/profile`)

#### AboutHero.tsx
```
- Titolo H1 enorme con BlinkText: "( AESTETICH MIND )"
- Bio desktop: "My websites blend brutalist clarity, editorial elegance..."
- Bio mobile: versione accorciata
- SplitHeading reveal animations
```

#### SkillsGrid.tsx
```
Griglia 6 colonne (responsive):
1. (01_core.capabilities): Web Design, Art Direction, Webflow Dev, Motion Design...
2. (02_identity.fragment): "CREATING WEBSITES WITH CLARITY..."
3. (03_skill.stack): Webflow, Figma, Spline, GSAP, AI Content Generation...
4. Citazione centrale
5. (04_process.fragment): Research, Construction, Typographic Engineering...
6. (05_identity.fragment): Strong Type, Clean Systems, Functional Emotion...
```

#### FooterSlider.tsx
```
Da portare da bundle.js:
- Slider orizzontale infinito con GSAP Draggable + InertiaPlugin
- 8 slide progetto con immagine + caption
- Loop continuo con gsap.utils.wrap
- Drag con inerzia e snap
```

### 5. AI EXPLORATION PAGE (`/ai-exploration`)

#### AISlider.tsx
```
- Embla Carousel full-screen (sostituto Flickity)
- 8 slide con immagine background
- Ogni slide: titolo H1, 4 tag, prompt copiabile, indice (01/08)
- Navigazione: swipe + frecce
```

#### PromptCard.tsx
```
- Clipboard API (navigator.clipboard.writeText)
- 3 stati: default ("Click to copy prompt"), hover ("THE PROMPT"), copied ("Copied!")
- Background verde su hover: rgba(34, 80, 46)
- Timeout reset stato dopo 2s
```

### 6. WORKS TEMPLATE (`/works/[slug]`)

#### generateStaticParams
```typescript
// Genera le 8 pagine staticamente al build time
export async function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }))
}
```

#### ProjectSlider.tsx (Three.js Sketch)
```
Da portare da bundle.js (righe 116-476):
- Classe Sketch con PerspectiveCamera
- Crossfade con displacement shader tra 2 texture
- Navigazione prev/next
- Timeline GSAP per transizioni
- Cleanup completo (dispose texture, geometry, material)
```

#### ConceptSection.tsx (mwg_effect005)
```
Da portare da bundle.js:
- Word stagger scroll animation con lerp
- Ogni parola si anima in base alla posizione di scroll
- Effetto: opacita e blur progressivi
```

#### PixelateImage.tsx
```
Da portare da bundle.js:
- Canvas 2D overlay sull'immagine
- Su hover: pixelazione progressiva
- Risoluzione: diminuisce gradualmente e poi torna
```

### 7. PRELOADER (`Preloader.tsx`)

```
Sequenza animazione (2.4s totali):
1. Counter 0 -> 100 (GSAP tween)
2. Linea di caricamento (scaleX 0 -> 1)
3. Testo loading con SplitText ("WHAT APPEARS HERE IS NOT A SHOWCASE...")
4. Reveal immagini con clip-path staggerato (5 immagini)
5. Fade out UI (counter, linea, testo)
6. Chiusura immagini (reverse)
7. Fade out finale + entry animations pagina

Session-aware:
- sessionStorage.setItem("preloader_seen_session", "1")
- Se gia visto nella sessione, salta direttamente
```

### 8. CRT OVERLAY (`CRTOverlay.tsx`)

```css
/* Puro CSS, nessun JS necessario */
/* Scanlines via ::before */
background: linear-gradient(
  to bottom,
  rgba(18,16,16,0) 50%,
  rgba(0,0,0,0.25) 50%
);
background-size: 100% 4px;

/* Vignette via ::after */
background: radial-gradient(
  circle,
  rgba(0,0,0,0) 50%,
  rgba(0,0,0,0.4) 100%
);

/* Flicker animation: 0.15s infinite */
/* CRT scan animation: 8s linear infinite */

/* position: fixed, inset: 0, z-index alto, pointer-events: none */
```

### 9. CUSTOM CURSOR (`CustomCursor.tsx`)

```
- Posizione: fixed, pointer-events: none
- Smooth follow con lerp: speed = 0.05
- requestAnimationFrame loop
- Nascosto durante scroll (timeout 300ms)
- Nascosto su hover link normali
- Visibile su hover .js-plane-link (galleria WebGL)
- Testo: "SCROLL OR CLICK"
- Classe: cursor--hidden per nascondere (opacity 0)
```

### 10. PAGE TRANSITIONS (`PageTransition.tsx`)

```
- Overlay div fisso full-screen
- Su cambio route (usePathname):
  1. Anima overlay opacity 0 -> 1 (0.6s)
  2. Attendi route change completo
  3. Anima overlay opacity 1 -> 0 (0.6s)
- Gestione con TransitionProvider context
- Intercetta click su Link (next/link)
```

---

## Interfacce TypeScript

### Project
```typescript
interface Project {
  slug: string
  title: string
  year: string
  description: string
  shortDescription: string
  conceptText: string
  detailText: string
  heroImage: string
  sliderImages: string[]
  coverImage: string
  keywords: string[]
  services: string[]
  tools: string[]
  visualIdentity: string
  partners?: string
  externalUrl?: string
  dates: { created: string; modified: string; published: string }
}
```

### GridImage
```typescript
interface GridImage {
  src: string
  alt: string
}
```

### AISlide
```typescript
interface AISlide {
  title: string
  image: string
  tags: string[]
  prompt: string
}
```

---

## SEO

### Metadata API (per route)
```typescript
// Ogni pagina esporta metadata statico o generateMetadata() dinamico
export const metadata: Metadata = {
  title: 'Nicola Romei | Digital Experience Designer',
  description: '...',
  openGraph: { title, description, images },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
}
```

### Schema.org (JSON-LD)
- Home: `ProfilePage` + `Person`
- Archive: `CollectionPage` con `hasPart: CreativeWork[]`
- Profile: `ProfilePage` + `Person` + `Occupation`
- AI Exploration: `WebPage` + `CreativeWork`
- Works: `WebPage` + `CreativeWork`

### Redirects (next.config.ts)
```typescript
redirects: async () => [
  { source: '/index.html', destination: '/', permanent: true },
  { source: '/archive.html', destination: '/archive', permanent: true },
  { source: '/the-archive.html', destination: '/archive', permanent: true },
  { source: '/the-profile.html', destination: '/profile', permanent: true },
  { source: '/ai-exploration.html', destination: '/ai-exploration', permanent: true },
  { source: '/works/:slug.html', destination: '/works/:slug', permanent: true },
]
```

---

## Performance

1. **Code splitting**: `next/dynamic` con `ssr: false` per HeroCanvas e ProjectSlider (Three.js)
2. **Tree-shaking GSAP**: importare solo i plugin necessari per componente
3. **next/image**: per tutte le immagini statiche (AVIF/WebP automatico)
4. **Immagini WebGL**: restano come file statici (Three.TextureLoader ha bisogno di URL raw)
5. **Font**: next/font per zero layout shift
6. **Preload**: immagini preloader con `<link rel="preload">`
7. **Static generation**: `generateStaticParams` per tutte le pagine progetto
8. **Pixel ratio clamp**: 1-1.5 sul renderer Three.js

---

## Breakpoint Responsivi

| Nome | Range | Tailwind |
|------|-------|----------|
| Mobile | max 479px | `max-sm:` |
| Mobile Landscape | max 767px | `max-md:` |
| Tablet | max 991px | `max-lg:` |
| Desktop | min 992px | `lg:` |

---

## Design Token da Estrarre

### Colori
```
Background: #1E1E1E (scuro)
Testo primario: #e7e7e7 (chiaro)
Selezione testo: bg #1E1E1E, color #e7e7e7
Link hover: variante chiara
Accent (AI page): rgba(34, 80, 46) verde
```

### Tipografia
```
Font primario: "Host Grotesk" (Google Fonts) - 300/400/500/600/700
Font display: "EaseGeometricB-Bold" (locale, per titoli)
Font Typekit: biw5ksl (Adobe, per headings speciali)
```

### Easing
```
Principale: cubic-bezier(0.625, 0.05, 0, 1)
Scroll: lerp 0.1 (Lenis)
Gallery: lerp 0.07
Cursor: lerp 0.05
GSAP: "power4.inOut", "power4.out"
```

### Timing
```
Preloader: 2.4s
Page transition: 0.6s
Text reveal: 0.85s (stagger 0.05s)
Button hover: 0.6s
Underline link: 0.6s
View transition: 0.4s
```

---

## Comandi Setup

```bash
# Inizializzazione
pnpx create-next-app@latest nicolaromei --typescript --tailwind --app --src-dir
cd nicolaromei

# Dipendenze principali
pnpm add three gsap @gsap/react lenis embla-carousel-react hls.js

# Dipendenze dev
pnpm add -D @types/three

# GSAP Club (richiede token privato)
# Seguire: https://gsap.com/docs/v3/Installation/#npm-club
pnpm add gsap@npm:@gsap/shockingly
```

---

## Note Importanti

1. **GSAP Club e obbligatorio** per SplitText, Draggable, InertiaPlugin, ScrambleTextPlugin
2. **Three.js raw**, NON usare @react-three/fiber (il codice e imperativo con shaders custom)
3. **NON portare le classi CSS di Webflow** - ricostruire da zero con Tailwind
4. **Rinominare le immagini** da hash Webflow (es. `6946aee2d5...avif`) a nomi semantici
5. **Lenis disabilitato sulla home** (il canvas WebGL gestisce il proprio scroll)
6. **Tutti i componenti Three.js** devono essere `'use client'` + `dynamic({ ssr: false })`
7. **sessionStorage** per preloader (mostrare solo una volta per sessione)
8. **Preservare Schema.org** su tutte le pagine per SEO
