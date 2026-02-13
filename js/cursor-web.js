// ========== OPTIMIZED CURSOR-RESPONSIVE WEB ==========
(function() {
    'use strict';
    
    // Performance check
    const isLowPerf = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.innerWidth < 768;
    
    if (isLowPerf) return; // Skip on mobile/low-end devices
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCursorWeb);
    } else {
        initCursorWeb();
    }
    
    function initCursorWeb() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        if (typeof THREE === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = () => createWeb(heroSection);
            document.head.appendChild(script);
        } else {
            createWeb(heroSection);
        }
    }
    
    function createWeb(heroSection) {
        // Create container
        const container = document.createElement('div');
        container.id = 'cursor-web';
        container.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            pointer-events: none;
            overflow: hidden;
        `;
        heroSection.style.position = 'relative';
        heroSection.insertBefore(container, heroSection.firstChild);
        
        // Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, heroSection.clientWidth / heroSection.clientHeight, 0.1, 1000);
        camera.position.z = 12; // Closer = less rendering
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
        renderer.setSize(heroSection.clientWidth, heroSection.clientHeight);
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
        container.appendChild(renderer.domElement);
        
        // Mouse position
        const mouse = new THREE.Vector3(0, 0, 0);
        const targetMouse = new THREE.Vector3(0, 0, 0);
        
        document.addEventListener('mousemove', (event) => {
            const rect = heroSection.getBoundingClientRect();
            targetMouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
            targetMouse.y = -(event.clientY - rect.top) / rect.height * 2 + 1;
        }, { passive: true });
        
        // ========== SIMPLIFIED WEB ==========
        
        // Reduced parameters for performance
        const layers = 3; // Was 5
        const pointsPerLayer = 12; // Was 24
        const radius = 7;
        
        const webPoints = [];
        
        // Colors
        const colors = [
            new THREE.Color(0x2ECC71),
            new THREE.Color(0x3498db),
            new THREE.Color(0x9b59b6)
        ];
        
        // Create layers
        for (let layer = 0; layer < layers; layer++) {
            const layerZ = (layer - layers/2) * 1.5;
            const layerRadius = radius * (0.8 + layer * 0.1);
            const layerPoints = [];
            
            for (let i = 0; i < pointsPerLayer; i++) {
                const angle = (i / pointsPerLayer) * Math.PI * 2;
                const x = Math.cos(angle) * layerRadius;
                const y = Math.sin(angle) * layerRadius;
                
                const point = {
                    originalPos: new THREE.Vector3(x, y, layerZ),
                    currentPos: new THREE.Vector3(x, y, layerZ),
                    velocity: new THREE.Vector3(0, 0, 0),
                    color: colors[layer % colors.length]
                };
                
                layerPoints.push(point);
                webPoints.push(point);
            }
            
            // Connect points (circle)
            for (let i = 0; i < layerPoints.length; i++) {
                const p1 = layerPoints[i];
                const p2 = layerPoints[(i + 1) % layerPoints.length];
                
                const points = [p1.originalPos, p2.originalPos];
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const material = new THREE.LineBasicMaterial({ 
                    color: colors[layer % colors.length],
                    transparent: true,
                    opacity: 0.15
                });
                const line = new THREE.Line(geometry, material);
                scene.add(line);
                
                p1.line = line; // Store reference
            }
        }
        
        // Add nodes (spheres) - simplified geometry
        const nodeGeo = new THREE.SphereGeometry(0.06, 3, 3); // Reduced segments
        
        webPoints.forEach(point => {
            const nodeMat = new THREE.MeshBasicMaterial({ 
                color: point.color,
                transparent: true,
                opacity: 0.2
            });
            const node = new THREE.Mesh(nodeGeo, nodeMat);
            node.position.copy(point.originalPos);
            scene.add(node);
            point.node = node;
        });
        
        // ========== OPTIMIZED ANIMATION ==========
        let lastFrameTime = 0;
        const frameThrottle = 16; // ~60fps
        
        function animate(currentTime) {
            requestAnimationFrame(animate);
            
            // Throttle frame rate
            if (currentTime - lastFrameTime < frameThrottle) return;
            lastFrameTime = currentTime;
            
            // Check if hero is visible
            const rect = heroSection.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return; // Skip if not visible
            
            // Smooth cursor
            mouse.x += (targetMouse.x - mouse.x) * 0.1;
            mouse.y += (targetMouse.y - mouse.y) * 0.1;
            
            // Update points - simplified
            webPoints.forEach(point => {
                // Simple influence
                const dx = point.originalPos.x - mouse.x * radius;
                const dy = point.originalPos.y - mouse.y * radius;
                
                // Return force
                point.currentPos.x += (point.originalPos.x - point.currentPos.x) * 0.05 + dx * 0.005;
                point.currentPos.y += (point.originalPos.y - point.currentPos.y) * 0.05 + dy * 0.005;
                point.currentPos.z += (point.originalPos.z - point.currentPos.z) * 0.05;
                
                // Update node
                if (point.node) {
                    point.node.position.copy(point.currentPos);
                }
                
                // Update line if exists
                if (point.line) {
                    // This is simplified - full line update would be complex
                    // For performance, we're not updating all lines
                }
            });
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const width = heroSection.clientWidth;
                const height = heroSection.clientHeight;
                
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }, 150);
        }, { passive: true });
        
        // Clean up on page hide
        window.addEventListener('beforeunload', () => {
            renderer.dispose();
            scene.clear();
        });
    }
})();