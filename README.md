# ThreeJS GeekMaker

The official 3D team website for GeekMaker (极创客), built with Three.js. Explore our projects, team members, and vision in an immersive web experience.

## Features

- 3D Phone Model Showcase with scroll-based animation
- Project information display ("To-Do 项目，由 React 倾力打造")
- Smooth transitions and easing animations
- Responsive design with TypeWriter text effects
- "Coming Soon" message for upcoming projects

## Tech Stack

- **React 19.1.0** - UI framework
- **Three.js 0.179.1** - 3D graphics and model rendering
- **Vite 7.0.4** - Build tool and dev server
- **GSAP 3.13.0** - Animation library
- **Tailwind CSS 4.1.11** - Utility CSS

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Structure

- `src/components/FloatingPhoneShowcase.jsx` - Main 3D showcase component
- `public/todo_phone.glb` - 3D phone model with custom screen content
- `CLAUDE.md` - Development guidance for Claude Code
