# ClarkBot Design Guidelines

## Design Approach
**Reference-Based: Sci-Fi AI Interface**
Drawing inspiration from cinematic AI interfaces (Iron Man's Jarvis, HAL 9000, futuristic command centers) while maintaining modern web usability. The design emphasizes technological sophistication, intelligence, and responsive interaction through glowing elements and fluid animations.

## Core Design Elements

### A. Color Palette

**Dark Mode Foundation:**
- Background Primary: 220 25% 8% (deep blue-black)
- Background Secondary: 220 20% 12% (elevated surfaces)
- Background Tertiary: 220 18% 16% (cards, modals)

**Accent Colors:**
- Neon Blue (Primary): 200 100% 60% (avatar glow, active states)
- Electric Cyan: 180 100% 55% (voice activity waves)
- Silver Chrome: 210 15% 85% (text, borders)
- Muted Blue: 210 25% 35% (inactive elements)

**Functional Colors:**
- Success: 140 70% 50%
- Warning: 35 100% 60%
- Error: 0 85% 60%

### B. Typography

**Font System:**
- Primary: 'Orbitron' (Google Fonts) - Headers, Logo
- Secondary: 'Rajdhani' (Google Fonts) - UI elements, buttons
- Body: 'Inter' (Google Fonts) - Chat messages, descriptions

**Scale:**
- Logo: text-5xl font-bold (Orbitron)
- Headers: text-2xl to text-3xl font-semibold (Rajdhani)
- Body: text-base (Inter)
- Captions: text-sm (Rajdhani)

### C. Layout System

**Spacing Primitives:** 4, 8, 12, 16, 24 (p-4, h-8, m-12, gap-16, py-24)

**Container Structure:**
- Full viewport height sections (min-h-screen)
- Centered content with max-w-6xl
- Symmetric padding: px-8 py-12 on containers

**Grid System:**
- Settings panel: 2-column grid (md:grid-cols-2) with gap-8
- Feature cards: Single column stack with gap-4

### D. Component Library

**Avatar System:**
- Circular container: w-48 h-48 (lg: w-64 h-64)
- Multi-layered glow effect using box-shadow and blur filters
- Pulsing animation: 2s ease-in-out infinite
- Wave rings during voice activity: expanding circles with opacity fade

**Input Controls:**
- Microphone Button: Large circular (w-20 h-20), centered below avatar, glowing border on active
- Text Input: Full-width with rounded-2xl, backdrop-blur, border glow on focus
- Action Buttons: Rounded-xl with subtle glow, Rajdhani font

**Chat Interface:**
- Message bubbles: max-w-2xl with rounded-2xl
- User messages: align-right with neon blue glow
- ClarkBot responses: align-left with silver glow
- Scrollable history: max-h-96 with custom scrollbar

**Settings Panel:**
- Slide-in modal from right: w-96 with backdrop blur
- Toggle switches with neon glow states
- Range sliders for voice settings with gradient tracks
- Organized in sections with dividers

**Image Analysis Zone:**
- Upload dropzone: dashed border with hover glow
- Webcam preview: rounded-xl with live border animation
- Analysis results: overlaid on image with semi-transparent background

### E. Visual Effects

**Glow System:**
- Avatar: Multi-layer box-shadow (0 0 20px, 0 0 40px, 0 0 60px in cyan/blue)
- Active elements: 0 0 10px currentColor
- Borders: Use shadow instead of solid borders for tech aesthetic

**Background:**
- Radial gradient from center: from deep blue-black to pure black
- Animated grid lines or circuit pattern (SVG overlay, 5% opacity)
- Subtle particle effect using CSS animations (optional floating dots)

**Voice Activity:**
- Concentric wave rings: 3-5 rings expanding from avatar
- Opacity transition from 80% to 0%
- Scale animation from 1 to 1.8
- Stagger timing: 0.3s delay between rings
- Color: Electric cyan with blur

**Micro-interactions:**
- Button hover: scale-105 with increased glow
- Input focus: border glow intensifies
- Message send: subtle slide-up animation
- Settings toggle: smooth color transition (300ms)

## Images

**Hero Section Background (Optional Enhancement):**
- Abstract tech/circuit board texture (low opacity overlay, 10-15%)
- Neural network visualization
- Placement: Full background with fixed attachment
- Treatment: Heavy blur and low opacity to maintain text readability

**No prominent hero image** - The glowing avatar IS the hero element

## Layout Structure

**Main Interface:**
1. Header bar (h-16): Logo left, Settings icon right, semi-transparent background
2. Central stage (flex-1): Avatar + voice visualizer centered vertically
3. Control zone (h-auto): Mic button, text input stacked with gap-6
4. Chat history (conditional): Slides up from bottom when active, max-h-1/2

**Vertical Rhythm:**
- Header: py-4
- Main content spacing: gap-12 between avatar and controls
- Chat messages: gap-4 between bubbles
- Section padding: py-8

## Interaction Patterns

**Voice Mode:**
- Click mic → Avatar pulses, waves appear, real-time transcription displays below
- Release mic → Processing state (faster pulse), then response with text-to-speech
- Visual feedback: Progress ring around mic button during processing

**Text Mode:**
- Type message → Send button glows on input
- Submit → Message slides into chat, loading indicator on avatar
- Response → ClarkBot message fades in with typing indicator

**Image Analysis:**
- Upload/capture → Preview with scanning animation
- Processing → Avatar shows "analyzing" state
- Results → Overlay text on image with fade-in

This design creates a cohesive, futuristic AI companion interface that feels premium, responsive, and intelligent.