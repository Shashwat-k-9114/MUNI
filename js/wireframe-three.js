// ========== THREE.JS WIREFRAME ANIMATION ==========
(function() {
    'use strict';
    
    // Wait for DOM to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThreeWireframe);
    } else {
        initThreeWireframe();
    }
    
    function initThreeWireframe() {
        // Don't initialize on mobile for performance
        if (window.innerWidth < 768) return;
        
        // Check if Three.js is loaded, if not, load it
        if (typeof THREE === 'undefined') {
            loadThreeJS();
        } else {
            startAnimation();
        }
    }
    
    function loadThreeJS() {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = startAnimation;
        document.head.appendChild(script);
    }
    
    function startAnimation() {
        // Setup scene
        const scene = new THREE.Scene();
        scene.background = null; // Transparent
        
        // Setup camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;
        
        // Setup renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0); // Transparent background
        renderer.setPixelRatio(window.devicePixelRatio);
        
        // Style the canvas
        const canvas = renderer.domElement;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
        canvas.style.opacity = '0.25';
        
        // Insert canvas as first element in body
        document.body.insertBefore(canvas, document.body.firstChild);
        
        // Mouse position for interaction
        const mouse = new THREE.Vector2(0, 0);
        const targetRotation = new THREE.Vector2(0, 0);
        const currentRotation = new THREE.Vector2(0, 0);
        
        document.addEventListener('mousemove', (event) => {
            // Normalize mouse coordinates to -1 to 1
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            // Target rotation based on mouse position
            targetRotation.x = mouse.y * 0.5;
            targetRotation.y = mouse.x * 0.5;
        });
        
        // Create wireframe grid sphere
        const sphereGeometry = new THREE.SphereGeometry(8, 24, 16);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x2ECC71,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(sphere);
        
        // Create inner sphere with different wireframe density
        const innerSphereGeo = new THREE.SphereGeometry(5, 16, 12);
        const innerSphereMat = new THREE.MeshBasicMaterial({
            color: 0x1A2B3C,
            wireframe: true,
            transparent: true,
            opacity: 0.2
        });
        const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat);
        scene.add(innerSphere);
        
        // Create a grid floor
        const gridHelper = new THREE.GridHelper(40, 30, 0x2ECC71, 0x1A2B3C);
        gridHelper.position.y = -8;
        gridHelper.material.opacity = 0.15;
        gridHelper.material.transparent = true;
        scene.add(gridHelper);
        
        // Create floating cubes wireframe
        const cubes = [];
        const cubePositions = [
            { x: -12, y: 2, z: -5, color: 0x2ECC71 },
            { x: 12, y: -2, z: -8, color: 0x1A2B3C },
            { x: -8, y: -4, z: -15, color: 0x2ECC71 },
            { x: 8, y: 4, z: -12, color: 0x1A2B3C },
            { x: 0, y: 6, z: -20, color: 0x2ECC71 }
        ];
        
        cubePositions.forEach(pos => {
            const geo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
            const mat = new THREE.MeshBasicMaterial({
                color: pos.color,
                wireframe: true,
                transparent: true,
                opacity: 0.2
            });
            const cube = new THREE.Mesh(geo, mat);
            cube.position.set(pos.x, pos.y, pos.z);
            scene.add(cube);
            cubes.push(cube);
        });
        
        // Create floating particles (stars)
        const particleCount = 800;
        const particleGeo = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const radius = 20 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            particlePositions[i * 3 + 2] = radius * Math.cos(phi);
        }
        
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const particleMat = new THREE.PointsMaterial({
            color: 0x2ECC71,
            size: 0.15,
            transparent: true,
            opacity: 0.4
        });
        
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);
        
        // Create a wireframe torus knot for extra interest
        const knotGeo = new THREE.TorusKnotGeometry(3, 0.8, 64, 8);
        const knotMat = new THREE.MeshBasicMaterial({
            color: 0x2ECC71,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const knot = new THREE.Mesh(knotGeo, knotMat);
        knot.position.set(0, 0, -15);
        scene.add(knot);
        
        // Animation variables
        let clock = new THREE.Clock();
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize, false);
        
        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            const delta = clock.getDelta();
            const elapsedTime = performance.now() * 0.001; // seconds
            
            // Smooth rotation based on mouse
            currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
            currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
            
            // Rotate main sphere based on mouse
            sphere.rotation.x = currentRotation.x;
            sphere.rotation.y = currentRotation.y;
            
            // Inner sphere rotates opposite direction
            innerSphere.rotation.x = -currentRotation.x * 0.5;
            innerSphere.rotation.y = -currentRotation.y * 0.5;
            
            // Rotate knot slowly
            knot.rotation.x += 0.001;
            knot.rotation.y += 0.002;
            
            // Animate cubes
            cubes.forEach((cube, index) => {
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.015;
                cube.position.y += Math.sin(elapsedTime * 2 + index) * 0.002;
            });
            
            // Rotate particles
            particles.rotation.y += 0.0005;
            
            // Slight camera movement based on mouse for parallax effect
            camera.position.x += (mouse.x * 3 - camera.position.x) * 0.02;
            camera.position.y += (-mouse.y * 3 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);
            
            renderer.render(scene, camera);
        }
        
        animate();
    }
})();