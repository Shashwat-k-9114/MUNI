// ========== INTRICATE CURSOR-RESPONSIVE WEB ==========
(function() {
    'use strict';
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCursorWeb);
    } else {
        initCursorWeb();
    }
    
    function initCursorWeb() {
        if (!document.querySelector('.hero')) return;
        
        if (typeof THREE === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = createWeb;
            document.head.appendChild(script);
        } else {
            createWeb();
        }
    }
    
    function createWeb() {
        const heroSection = document.querySelector('.hero');

        
        
        // Create canvas container that covers entire hero section
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
        camera.position.z = 15;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(heroSection.clientWidth, heroSection.clientHeight);
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);
        
        // Mouse position for web deformation
        const mouse = new THREE.Vector3(0, 0, 0);
        const targetMouse = new THREE.Vector3(0, 0, 0);
        
        document.addEventListener('mousemove', (event) => {
            // Normalize mouse coordinates to -1 to 1 relative to hero section
            const rect = heroSection.getBoundingClientRect();
            targetMouse.x = (event.clientX - rect.left) / rect.width * 2 - 1;
            targetMouse.y = -(event.clientY - rect.top) / rect.height * 2 + 1;
            targetMouse.z = 0;
        });
        
        // ========== CREATE THE INTRICATE WEB ==========
        
        // Parameters
        const layers = 5; // Multiple layers of webs
        const pointsPerLayer = 24; // Points in each circle
        const radius = 8;
        
        // Store all points and connections for animation
        const webPoints = [];
        const webLines = [];
        
        // Colors - subtle gradient
        const colors = [
            new THREE.Color(0x2ECC71), // Green
            new THREE.Color(0x3498db), // Blue
            new THREE.Color(0x9b59b6), // Purple
            new THREE.Color(0xe74c3c), // Red
            new THREE.Color(0xf1c40f)  // Yellow
        ];
        
        // Create multiple layers of webs
        for (let layer = 0; layer < layers; layer++) {
            const layerZ = (layer - layers/2) * 2; // Spread layers in Z-axis
            const layerRadius = radius * (0.7 + layer * 0.1);
            const layerPoints = [];
            
            // Create points in a circle for this layer
            for (let i = 0; i < pointsPerLayer; i++) {
                const angle = (i / pointsPerLayer) * Math.PI * 2;
                const x = Math.cos(angle) * layerRadius;
                const y = Math.sin(angle) * layerRadius;
                
                // Add some random offset for organic feel
                const offsetX = (Math.random() - 0.5) * 0.5;
                const offsetY = (Math.random() - 0.5) * 0.5;
                
                const point = {
                    originalPos: new THREE.Vector3(x + offsetX, y + offsetY, layerZ),
                    currentPos: new THREE.Vector3(x + offsetX, y + offsetY, layerZ),
                    velocity: new THREE.Vector3(0, 0, 0),
                    color: colors[layer % colors.length],
                    connections: []
                };
                
                layerPoints.push(point);
                webPoints.push(point);
            }
            
            // Connect points within the same layer (circle)
            for (let i = 0; i < layerPoints.length; i++) {
                const p1 = layerPoints[i];
                const p2 = layerPoints[(i + 1) % layerPoints.length];
                
                // Create line geometry
                const points = [p1.originalPos, p2.originalPos];
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const material = new THREE.LineBasicMaterial({ 
                    color: colors[layer % colors.length],
                    transparent: true,
                    opacity: 0.15 + layer * 0.03
                });
                const line = new THREE.Line(geometry, material);
                scene.add(line);
                
                p1.connections.push({ point: p2, line: line });
                p2.connections.push({ point: p1, line: line });
            }
        }
        
        // Create cross-layer connections (radial lines)
        for (let i = 0; i < webPoints.length; i++) {
            for (let j = i + 1; j < webPoints.length; j++) {
                const p1 = webPoints[i];
                const p2 = webPoints[j];
                
                // Connect if points are from different layers but similar angles
                const angle1 = Math.atan2(p1.originalPos.y, p1.originalPos.x);
                const angle2 = Math.atan2(p2.originalPos.y, p2.originalPos.x);
                const angleDiff = Math.abs(angle1 - angle2);
                
                if (angleDiff < 0.3 || Math.abs(angleDiff - Math.PI * 2) < 0.3) {
                    const points = [p1.originalPos, p2.originalPos];
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const material = new THREE.LineBasicMaterial({ 
                        color: 0x2ECC71,
                        transparent: true,
                        opacity: 0.1
                    });
                    const line = new THREE.Line(geometry, material);
                    scene.add(line);
                    
                    p1.connections.push({ point: p2, line: line });
                    p2.connections.push({ point: p1, line: line });
                }
            }
        }
        
        // Add some floating nodes (points) at intersections
        const nodeGeo = new THREE.SphereGeometry(0.08, 4, 4);
        
        webPoints.forEach(point => {
            const nodeMat = new THREE.MeshBasicMaterial({ 
                color: point.color,
                transparent: true,
                opacity: 0.3
            });
            const node = new THREE.Mesh(nodeGeo, nodeMat);
            node.position.copy(point.originalPos);
            scene.add(node);
            point.node = node;
        });
        
        // Add a few extra floating points that are not connected
        const extraPoints = [];
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = radius * (0.5 + Math.random() * 0.8);
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            const z = (Math.random() - 0.5) * 5;
            
            const point = {
                originalPos: new THREE.Vector3(x, y, z),
                currentPos: new THREE.Vector3(x, y, z),
                velocity: new THREE.Vector3(0, 0, 0),
                color: colors[Math.floor(Math.random() * colors.length)]
            };
            
            const nodeMat = new THREE.MeshBasicMaterial({ 
                color: point.color,
                transparent: true,
                opacity: 0.2
            });
            const node = new THREE.Mesh(nodeGeo, nodeMat);
            node.position.copy(point.originalPos);
            scene.add(node);
            
            point.node = node;
            extraPoints.push(point);
        }
        
        // Add some subtle background particles
        const particleCount = 200;
        const particleGeo = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const r = 10 + Math.random() * 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            particlePositions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
            particlePositions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
            particlePositions[i * 3 + 2] = Math.cos(phi) * r;
        }
        
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const particleMat = new THREE.PointsMaterial({ 
            color: 0x2ECC71,
            size: 0.05,
            transparent: true,
            opacity: 0.1
        });
        
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);
        
        // ========== ANIMATION ==========
        const clock = new THREE.Clock();
        
        // Spring parameters for smooth cursor following
        const springStrength = 0.05;
        const waveStrength = 0.5;


        
        
        function animate() {
            requestAnimationFrame(animate);
            
            const delta = clock.getDelta();
            const elapsedTime = performance.now() * 0.001;
            
            // Smooth cursor movement
            mouse.x += (targetMouse.x - mouse.x) * 0.05;
            mouse.y += (targetMouse.y - mouse.y) * 0.05;
            
            // Update web points based on cursor
            webPoints.concat(extraPoints).forEach(point => {
                // Calculate influence from cursor
                const dx = point.originalPos.x - mouse.x * radius * 1.5;
                const dy = point.originalPos.y - mouse.y * radius * 1.5;
                const dz = point.originalPos.z - mouse.z * 2;
                
                const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
                const influence = Math.max(0, 1 - distance / 8);
                
                // Spring force toward original position
                const returnForce = new THREE.Vector3()
                    .copy(point.originalPos)
                    .sub(point.currentPos)
                    .multiplyScalar(springStrength);
                
                // Cursor repulsion/attraction
                const cursorForce = new THREE.Vector3(
                    dx * influence * 0.02,
                    dy * influence * 0.02,
                    dz * influence * 0.02
                );
                
                // Wave motion
                const waveX = Math.sin(elapsedTime * 2 + point.originalPos.y) * waveStrength * 0.01;
                const waveY = Math.cos(elapsedTime * 2 + point.originalPos.x) * waveStrength * 0.01;
                const waveZ = Math.sin(elapsedTime * 1.5 + point.originalPos.z) * waveStrength * 0.01;
                
                // Update velocity and position
                point.velocity.x += returnForce.x + cursorForce.x + waveX;
                point.velocity.y += returnForce.y + cursorForce.y + waveY;
                point.velocity.z += returnForce.z + cursorForce.z + waveZ;
                
                // Damping
                point.velocity.multiplyScalar(0.95);
                
                point.currentPos.x += point.velocity.x;
                point.currentPos.y += point.velocity.y;
                point.currentPos.z += point.velocity.z;
                
                // Update node position
                if (point.node) {
                    point.node.position.copy(point.currentPos);
                }
            });
            
            // Update all line geometries
            webPoints.forEach(point => {
                point.connections.forEach(conn => {
                    const line = conn.line;
                    const positions = line.geometry.attributes.position.array;
                    
                    // Update both ends
                    positions[0] = point.currentPos.x;
                    positions[1] = point.currentPos.y;
                    positions[2] = point.currentPos.z;
                    
                    positions[3] = conn.point.currentPos.x;
                    positions[4] = conn.point.currentPos.y;
                    positions[5] = conn.point.currentPos.z;
                    
                    line.geometry.attributes.position.needsUpdate = true;
                });
            });
            
            // Rotate particles slowly
            particles.rotation.y += 0.0002;
            particles.rotation.x += 0.0001;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle resize
        window.addEventListener('resize', () => {
            const width = heroSection.clientWidth;
            const height = heroSection.clientHeight;
            
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });
    }
})();