import React, { useRef, useEffect, useState, createElement } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// SVG Star Icon Component
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginRight: '8px' }}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

// TextType Component (Integrated directly, GSAP removed)
const TextType = ({
  text,
  as: Component = "div",
  typingSpeed = 75,
  pauseDuration = 2000,
  deletingSpeed = 40,
  loop = true,
  className = "",
  showCursor = true,
  cursorCharacter = "|",
  cursorClassName = "",
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const containerRef = useRef(null);

  const textArray = Array.isArray(text) ? text : [text];

  useEffect(() => {
    let timeout;

    const handleTyping = () => {
      const currentText = textArray[currentTextIndex];

      if (isDeleting) {
        if (displayedText.length > 0) {
          timeout = setTimeout(() => {
            setDisplayedText((prev) => prev.slice(0, -1));
          }, deletingSpeed);
        } else {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
        }
      } else {
        if (displayedText.length < currentText.length) {
          timeout = setTimeout(() => {
            setDisplayedText((prev) => currentText.slice(0, prev.length + 1));
          }, typingSpeed);
        } else {
          if (loop || currentTextIndex < textArray.length - 1) {
            timeout = setTimeout(() => {
              setIsDeleting(true);
            }, pauseDuration);
          }
        }
      }
    };

    handleTyping();

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentTextIndex, textArray, typingSpeed, deletingSpeed, pauseDuration, loop]);

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `text-type ${className}`,
      ...props,
    },
    <span className="text-type__content">{displayedText}</span>,
    showCursor && (
      <span className={`text-type__cursor ${cursorClassName}`}>
        {cursorCharacter}
      </span>
    )
  );
};


const FloatingPhoneShowcase = () => {
  // --- Refs ---
  const mountRef = useRef(null);
  const phoneGroupRef = useRef(null);
  const modelLoadedRef = useRef(false);
  const scrollProgressRef = useRef(0);
  
  // --- State for project description ---
  const [showProjectInfo, setShowProjectInfo] = useState(false);
  const [projectInfoOpacity, setProjectInfoOpacity] = useState(0);
  const [showMainTitle, setShowMainTitle] = useState(true);
  const [mainTitleOpacity, setMainTitleOpacity] = useState(1);
  
  // --- State for "Coming Soon" message ---
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonOpacity, setComingSoonOpacity] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // 1. --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    currentMount.appendChild(renderer.domElement);

    // 2. --- Camera Position ---
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // 3. --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-5, 5, 5);
    scene.add(fillLight);

    // 4. --- Phone Model Group ---
    const phoneGroup = new THREE.Group();
    phoneGroupRef.current = phoneGroup;
    scene.add(phoneGroup);

    phoneGroup.position.set(0, -5, 0);
    phoneGroup.rotation.set(Math.PI / 2, 0, 0);
    phoneGroup.visible = false;

    // 5. --- GLTF Model Loader ---
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/todo_phone.glb',
      (gltf) => {
        const phoneModel = gltf.scene;
        const box = new THREE.Box3().setFromObject(phoneModel);
        const center = box.getCenter(new THREE.Vector3());
        phoneModel.position.sub(center);
        phoneModel.scale.set(8, 8, 8);
        phoneGroup.add(phoneModel);
        modelLoadedRef.current = true;
        console.log('iPhone 16 Pro Max model loaded successfully!');
      },
      undefined,
      (error) => {
        console.error('An error happened while loading the model:', error);
      }
    );

    // 6. --- Scroll Event Listener ---
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      scrollProgressRef.current = progress;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 7. --- Animation Loop ---
    const animate = () => {
      requestAnimationFrame(animate);

      if (phoneGroupRef.current && modelLoadedRef.current) {
        const progress = scrollProgressRef.current;
        
        // Phase 1: 从底部旋转到正面 (0% - 30%)
        const phase1Start = 0.0;
        const phase1End = 0.3;
        
        // Phase 2: 从正面向上移动直到消失 (30% - 60%)
        const phase2Start = 0.3;
        const phase2End = 0.6;
        
        if (progress <= phase1End) {
          // Phase 1: 旋转动画
          const phase1Progress = THREE.MathUtils.clamp(
            (progress - phase1Start) / (phase1End - phase1Start),
            0,
            1
          );
          const easeProgress = 1 - Math.pow(1 - phase1Progress, 4);
          
          const baseY = -5 + 5 * easeProgress;
          const baseXRotation = (Math.PI / 2) * (1 - easeProgress);
          
          phoneGroupRef.current.position.y = baseY;
          phoneGroupRef.current.rotation.x = baseXRotation;
          phoneGroupRef.current.rotation.y = 0;
          phoneGroupRef.current.visible = progress > 0.005; // 更早开始显示手机
          
          // 标题逐渐消失（从5%滚动开始，更早开始淡出）
          if (phase1Progress >= 0.05) {
            const titleFadeProgress = (phase1Progress - 0.05) / 0.4; // 从5%到45%淡出，更快完成
            setMainTitleOpacity(Math.max(0, 1 - titleFadeProgress));
            if (titleFadeProgress >= 1) {
              setShowMainTitle(false);
            }
          } else {
            setMainTitleOpacity(1);
            setShowMainTitle(true);
          }
          
          // 项目信息更早更平滑显示（从0.5%滚动开始，使用更平滑的缓动）
          if (phase1Progress >= 0.005) {
            setShowProjectInfo(true);
            // 使用更平滑的缓动函数，提前显示完全
            const smoothEase = 1 - Math.pow(1 - phase1Progress * 3, 2); // 3倍加速，平方缓动
            setProjectInfoOpacity(Math.min(1, smoothEase));
          } else {
            setShowProjectInfo(false);
            setProjectInfoOpacity(0);
          }
          
          // Phase1 隐藏"敬请期待"
          setShowComingSoon(false);
          setComingSoonOpacity(0);
          
        } else if (progress <= phase2End) {
          // Phase 2: 向上移动直到消失
          const phase2Progress = THREE.MathUtils.clamp(
            (progress - phase2Start) / (phase2End - phase2Start),
            0,
            1
          );
          const easeProgress = 1 - Math.pow(1 - phase2Progress, 3);
          
          // 手机保持正面朝前，但向上移动
          phoneGroupRef.current.position.y = 0 + 8 * easeProgress; // 从0向上移动到8
          phoneGroupRef.current.rotation.x = 0; // 保持正面
          phoneGroupRef.current.rotation.y = 0;
          phoneGroupRef.current.visible = true;
          
          // Phase 2完全隐藏项目信息
          setShowProjectInfo(false);
          setProjectInfoOpacity(0);
          
          // 标题保持隐藏状态
          setShowMainTitle(false);
          setMainTitleOpacity(0);
          
          // Phase2 隐藏"敬请期待"
          setShowComingSoon(false);
          setComingSoonOpacity(0);
          
        } else {
          // Phase 2 结束后，手机完全消失，显示"敬请期待"
          phoneGroupRef.current.visible = false;
          setShowProjectInfo(false);
          setProjectInfoOpacity(0);
          setShowMainTitle(false);
          setMainTitleOpacity(0);
          
          // 显示"敬请期待"文字
          setShowComingSoon(true);
          // 从60%开始平滑出现
          const comingSoonProgress = Math.min(1, (progress - 0.6) / 0.1); // 从60%到70%完全显示
          setComingSoonOpacity(comingSoonProgress);
        }
      }

      renderer.render(scene, camera);
    };
    animate();


    // 9. --- Resize Handler ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 10. --- Cleanup ---
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);


  const services = [
    "我们精通UI设计、小程序和网页前后端开发。",
    "我们擅长高效的Python脚本和自动化解决方案。",
    "我们提供前沿的嵌入式及IoT物联网技术。",
    "我们是「极创客」，您的全能技术伙伴。"
  ];

  return (
    <div style={{ position: 'relative', fontFamily: 'system-ui, sans-serif' }}>
      {/* Light Rays Background */}
      <div className="light-rays-background">
        <div className="light-ray"></div>
        <div className="light-ray"></div>
        <div className="light-ray"></div>
        <div className="light-ray"></div>
        <div className="light-ray"></div>
        <div className="light-ray"></div>
        <div className="light-ray-subtle"></div>
        <div className="light-ray-subtle"></div>
        <div className="light-ray-subtle"></div>
        <div className="light-ray-subtle"></div>
      </div>

      {/* **修改點**: 新增 TextType 組件的 CSS 和 Light Rays 背景 */}
      <style>{`
        .text-type {
          display: inline-block;
          white-space: pre-wrap;
          min-height: 100px; /* 給予足夠高度防止跳動 */
        }
        .text-type__cursor {
          margin-left: 0.25rem;
          display: inline-block;
          opacity: 1;
          animation: blink 0.7s infinite;
        }
        @keyframes blink {
          0% { opacity: 1; }
          49% { opacity: 1; }
          50% { opacity: 0; }
          99% { opacity: 0; }
          100% { opacity: 1; }
        }

        /* Light Rays Background */
        .light-rays-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          overflow: hidden;
        }

        .light-ray {
          position: absolute;
          background: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 20%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0.1) 80%,
            rgba(255, 255, 255, 0) 100%
          );
          transform-origin: center center;
          animation: rayMove 20s linear infinite;
        }

        .light-ray:nth-child(1) {
          width: 2px;
          height: 120vh;
          top: -10vh;
          left: 10%;
          animation-delay: 0s;
          animation-duration: 25s;
        }

        .light-ray:nth-child(2) {
          width: 1px;
          height: 130vh;
          top: -15vh;
          left: 25%;
          animation-delay: -5s;
          animation-duration: 30s;
        }

        .light-ray:nth-child(3) {
          width: 3px;
          height: 140vh;
          top: -20vh;
          left: 45%;
          animation-delay: -10s;
          animation-duration: 22s;
        }

        .light-ray:nth-child(4) {
          width: 1px;
          height: 125vh;
          top: -12vh;
          left: 65%;
          animation-delay: -15s;
          animation-duration: 28s;
        }

        .light-ray:nth-child(5) {
          width: 2px;
          height: 135vh;
          top: -17vh;
          left: 80%;
          animation-delay: -8s;
          animation-duration: 24s;
        }

        .light-ray:nth-child(6) {
          width: 1px;
          height: 115vh;
          top: -8vh;
          left: 92%;
          animation-delay: -12s;
          animation-duration: 26s;
        }

        @keyframes rayMove {
          0% {
            transform: translateY(-100vh) rotate(15deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(15deg);
            opacity: 0;
          }
        }

        /* Additional subtle rays */
        .light-ray-subtle {
          position: absolute;
          background: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          width: 1px;
          height: 100vh;
          animation: rayMoveSubtle 35s linear infinite;
        }

        .light-ray-subtle:nth-child(7) {
          left: 15%;
          animation-delay: -20s;
        }

        .light-ray-subtle:nth-child(8) {
          left: 35%;
          animation-delay: -25s;
        }

        .light-ray-subtle:nth-child(9) {
          left: 55%;
          animation-delay: -30s;
        }

        .light-ray-subtle:nth-child(10) {
          left: 75%;
          animation-delay: -18s;
        }

        @keyframes rayMoveSubtle {
          0% {
            transform: translateY(-50vh) rotate(10deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(150vh) rotate(10deg);
            opacity: 0;
          }
        }
      `}</style>
      
      {/* SaaS-style Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <a href="https://jck.hgyjllk.top/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', fontSize: '20px', textDecoration: 'none', color: '#333' }}>极创客</a>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="https://github.com/HGYJLLK?tab=repositories" target="_blank" rel="noopener noreferrer" style={{
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            textDecoration: 'none',
            color: '#333'
          }}>
            <StarIcon /> us on Github
          </a>
          <a href="https://blog.hgyjllk.top/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#333' }}>Blog</a>
          <a href="https://todo.hgyjllk.top/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#333' }}>Pricing</a>
        </nav>
      </header>

      {/* Project Info Overlay */}
      {showProjectInfo && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 15,
          textAlign: 'center',
          opacity: projectInfoOpacity,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          color: '#333',
          fontWeight: 'bold'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(4rem, 12vw, 8rem)', 
            margin: '0 0 1rem 0',
            textShadow: '4px 4px 8px rgba(255,255,255,0.9)',
            fontWeight: 'bold',
            lineHeight: '1.1'
          }}>
            To-Do 项目
          </h2>
          <p style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 5rem)', 
            margin: 0,
            textShadow: '3px 3px 6px rgba(255,255,255,0.9)',
            fontWeight: '500',
            lineHeight: '1.2'
          }}>
            由 React 倾力打造
          </p>
        </div>
      )}

      {/* Coming Soon Overlay */}
      {showComingSoon && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 15,
          textAlign: 'center',
          opacity: comingSoonOpacity,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          color: '#333',
          fontWeight: 'bold'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(3rem, 10vw, 6rem)', 
            margin: 0,
            textShadow: '4px 4px 8px rgba(255,255,255,0.9)',
            fontWeight: 'bold',
            lineHeight: '1.1'
          }}>
            敬请期待
          </h2>
          <p style={{ 
            fontSize: 'clamp(1.5rem, 5vw, 3rem)', 
            margin: '1rem 0 0 0',
            textShadow: '3px 3px 6px rgba(255,255,255,0.9)',
            fontWeight: '400',
            lineHeight: '1.2',
            opacity: 0.8
          }}>
            更多精彩项目即将推出
          </p>
        </div>
      )}

      {/* Three.js Canvas */}
      <div
        ref={mountRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      />

      {/* Main Page Content */}
      <main style={{ position: 'relative', zIndex: 12 }}>
        <section style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 2rem'
        }}>
          <div style={{
            opacity: mainTitleOpacity,
            transition: 'opacity 0.3s ease',
            display: showMainTitle ? 'block' : 'none'
          }}>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700, color: '#111827', margin: '0 0 1.5rem 0', lineHeight: 1.2 }}>
              极创客工作室
            </h1>
            {/* **修改點**: 使用 TextType 組件 */}
            <TextType
              as="p"
              text={services}
              typingSpeed={75}
              pauseDuration={1500}
              style={{ fontSize: '1.25rem', color: '#6b7280', lineHeight: 1.7, maxWidth: '800px', margin: '0 auto' }}
            />
          </div>
        </section>
        
        {/* Spacer for scroll distance */}
        <section style={{ height: '500vh' }} />

      </main>
    </div>
  );
};

export default FloatingPhoneShowcase;
