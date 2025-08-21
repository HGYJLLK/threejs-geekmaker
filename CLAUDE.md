# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

### Testing
No test framework is configured in this project.

## Architecture Overview

This is a React + Vite project featuring a 3D phone showcase built with Three.js. The application displays a floating iPhone 16 Pro Max model that animates based on scroll position.

### Key Technologies
- **React 19.1.0** - UI framework  
- **Three.js 0.179.1** - 3D graphics and model rendering
- **GSAP 3.13.0** - Animation library (imported but not actively used)
- **OGL 1.0.11** - WebGL library (imported but not actively used)
- **Vite 7.0.4** - Build tool and dev server
- **Tailwind CSS 4.1.11** - Utility CSS (configured but uses custom CSS classes in index.css)

### Project Structure
```
src/
├── App.jsx                         # Main app component (minimal wrapper)
├── components/
│   └── FloatingPhoneShowcase.jsx   # Main 3D showcase component
├── App.css                         # Component-specific styles (mostly unused)
├── index.css                       # Global styles with custom utility classes
└── main.jsx                        # App entry point

public/
└── iphone_16_pro_max_white.glb     # 3D model file
```

### Core Components

#### FloatingPhoneShowcase.jsx (lines 96-336)
The main component that handles:
- **Three.js Scene Setup** (lines 108-121): Camera, renderer, lighting configuration
- **3D Model Loading** (lines 145-163): GLTF loader for iPhone model with error handling
- **Scroll-Based Animation** (lines 166-196): Phone position and rotation tied to scroll progress
- **TextType Component** (lines 24-93): Custom typewriter effect for animated text
- **UI Layout**: Fixed header with navigation and main content sections

#### Key Animation Logic
- Phone animates from bottom-up rotation to upright position based on scroll progress (0-30%)
- Uses easing function for smooth transitions: `1 - Math.pow(1 - animationProgress, 4)`
- Model visibility controlled by scroll threshold (1% scroll minimum)

### Styling Approach
The project uses a hybrid styling approach:
- **Inline styles** for most component styling (React style objects)
- **Custom CSS utility classes** in `index.css` that mimic Tailwind classes
- **Tailwind CSS** is configured but the custom utilities are used instead
- **CSS-in-JS** for the TextType animation styles

### 3D Model Configuration
- Model file: `/public/iphone_16_pro_max_white.glb`
- Scale: 8x original size
- Positioned and centered automatically on load
- Lighting: Ambient + directional + fill lights for realistic rendering

### Development Notes
- Server configured to allow `frp-fit.com` host in vite.config.js
- ESLint configured with React hooks and refresh plugins
- No TypeScript - uses pure JavaScript with JSX
- Chinese text content suggests this is for "极创客工作室" (JiChuangKe Studio)