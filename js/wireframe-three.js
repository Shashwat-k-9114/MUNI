// ========== OPTIMIZED THREE.JS WIREFRAME ==========
(function() {
    'use strict';
    
    // Skip on mobile
    if (window.innerWidth < 768) return;
    
    // Performance check - skip on low-end devices
    const isLowPerf = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(navigator.userAgent);
    if (isLowPerf) return;
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThreeWireframe);
    } else {
        initThreeWireframe();
    }
    
    function initThreeWireframe() {
        if (typeof THREE === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = startAnimation;
            document.head.appendChild(script);
        } else {
            startAnimation();
        }
    }
    
    function startAnimation() {
        // Check if already exists
        if (document.getElementById('wireframe-canvas')) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 25;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit pixel ratio
        
        const canvas = renderer.domElement;
        canvas.id = 'wireframe-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.2;
            will-change: transform;
        `;
        
        document.body.insertBefore(canvas, document.body.firstChild);
        
        // Mouse interaction - simplified
        const mouse = new THREE.Vector2(0, 0);
        const targetRotation = new THREE.Vector2(0, 0);
        const currentRotation = new THREE.Vector2(0, 0);
        
        document.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            targetRotation.x = mouse.y * 0.3;
            targetRotation.y = mouse.x * 0.3;
        }, { passive: true });
        
        // ========== SIMPLIFIED SCENE ==========
        
        // Single sphere - reduced geometry
        const sphereGeo = new THREE.SphereGeometry(7, 16, 12); // Was 24,16
        const sphereMat = new THREE.MeshBasicMaterial({
            color: 0x2ECC71,
            wireframe: true,
            transparent: true,
            opacity: 0.25
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        scene.add(sphere);
        
        // Grid - simpler
        const gridHelper = new THREE.GridHelper(30, 20, 0x2ECC71, 0x1A2B3C); // Reduced divisions
        gridHelper.position.y = -6;
        gridHelper.material.opacity = 0.1;
        gridHelper.material.transparent = true;
        scene.add(gridHelper);
        
        // Fewer particles
        const particleCount = 200; // Was 800
        const particleGeo = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const r = 15 + Math.random() * 10;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            particlePositions[i * 3 + 2] = r * Math.cos(phi);
        }
        
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const particleMat = new THREE.PointsMaterial({
            color: 0x2ECC71,
            size: 0.1,
            transparent: true,
            opacity: 0.2
        });
        
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);
        
        // ========== OPTIMIZED ANIMATION ==========
        let lastFrameTime = 0;
        const frameThrottle = 16; // 60fps
        
        function animate(currentTime) {
            requestAnimationFrame(animate);
            
            // Throttle frame rate
            if (currentTime - lastFrameTime < frameThrottle) return;
            lastFrameTime = currentTime;
            
            // Smooth rotation
            currentRotation.x += (targetRotation.x - currentRotation.x) * 0.03;
            currentRotation.y += (targetRotation.y - currentRotation.y) * 0.03;
            
            sphere.rotation.x = currentRotation.x;
            sphere.rotation.y = currentRotation.y;
            
            // Slow particle rotation
            particles.rotation.y += 0.0002;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Resize handler with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }, 150);
        }, { passive: true });
        
        // Clean up
        window.addEventListener('beforeunload', () => {
            renderer.dispose();
            scene.clear();
        });
    }
})();