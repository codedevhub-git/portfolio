/* ============================================
   THREE.JS BACKGROUND
   Purpose: Animated particle network background
   GitHub-style particle effect
   ============================================ */

/* ============================================
   CONFIGURATION
   ============================================ */

const config = {
  particleCount: isMobile() ? 50 : 100,
  particleSize: isMobile() ? 2 : 3,
  connectionDistance: isMobile() ? 100 : 150,
  particleColor: 0x58a6ff,
  connectionColor: 0x58a6ff,
  connectionOpacity: 0.3,
  particleSpeed: 0.0005,
  mouseInfluence: isMobile() ? 0 : 50,
  cameraZ: 400
};

/* ============================================
   GLOBAL VARIABLES
   ============================================ */

let scene, camera, renderer;
let particles = [];
let lines = [];
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

/* ============================================
   INITIALIZATION
   ============================================ */

/**
 * Initialize Three.js scene
 */
function initThreeJS() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  // Create scene
  scene = new THREE.Scene();

  // Create camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = config.cameraZ;

  // Create renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: !isMobile()
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create particles
  createParticles();

  // Add event listeners
  addEventListeners();

  // Start animation loop
  animate();

  console.log('%c✓ Three.js background initialized', 'color: #58a6ff; font-family: monospace;');
}

/* ============================================
   PARTICLE CREATION
   ============================================ */

/**
 * Create particle system
 */
function createParticles() {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.PointsMaterial({
    color: config.particleColor,
    size: config.particleSize,
    transparent: true,
    opacity: 0.8
  });

  const positions = [];
  const velocities = [];

  for (let i = 0; i < config.particleCount; i++) {
    // Random position
    const x = Math.random() * window.innerWidth - windowHalfX;
    const y = Math.random() * window.innerHeight - windowHalfY;
    const z = Math.random() * 400 - 200;

    positions.push(x, y, z);

    // Random velocity
    const vx = (Math.random() - 0.5) * config.particleSpeed;
    const vy = (Math.random() - 0.5) * config.particleSpeed;
    const vz = (Math.random() - 0.5) * config.particleSpeed;

    velocities.push(vx, vy, vz);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // Store particle data
  particles.push({
    system: particleSystem,
    velocities: velocities
  });
}

/**
 * Create connection lines between particles
 */
function createConnections() {
  // Remove old lines
  lines.forEach(line => scene.remove(line));
  lines = [];

  const positions = particles[0].system.geometry.attributes.position.array;
  const particleCount = positions.length / 3;

  for (let i = 0; i < particleCount; i++) {
    const x1 = positions[i * 3];
    const y1 = positions[i * 3 + 1];
    const z1 = positions[i * 3 + 2];

    for (let j = i + 1; j < particleCount; j++) {
      const x2 = positions[j * 3];
      const y2 = positions[j * 3 + 1];
      const z2 = positions[j * 3 + 2];

      const distance = Math.sqrt(
        Math.pow(x2 - x1, 2) +
        Math.pow(y2 - y1, 2) +
        Math.pow(z2 - z1, 2)
      );

      if (distance < config.connectionDistance) {
        const geometry = new THREE.BufferGeometry();
        const linePositions = new Float32Array([
          x1, y1, z1,
          x2, y2, z2
        ]);
        geometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

        const opacity = config.connectionOpacity * (1 - distance / config.connectionDistance);
        const material = new THREE.LineBasicMaterial({
          color: config.connectionColor,
          transparent: true,
          opacity: opacity
        });

        const line = new THREE.Line(geometry, material);
        scene.add(line);
        lines.push(line);
      }
    }
  }
}

/* ============================================
   ANIMATION
   ============================================ */

/**
 * Animation loop
 */
function animate() {
  requestAnimationFrame(animate);

  updateParticles();
  createConnections();
  updateCamera();
  
  renderer.render(scene, camera);
}

/**
 * Update particle positions
 */
function updateParticles() {
  particles.forEach(particle => {
    const positions = particle.system.geometry.attributes.position.array;
    const velocities = particle.velocities;

    for (let i = 0; i < positions.length; i += 3) {
      // Update position
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];

      // Wrap around screen edges
      if (positions[i] > windowHalfX) positions[i] = -windowHalfX;
      if (positions[i] < -windowHalfX) positions[i] = windowHalfX;
      if (positions[i + 1] > windowHalfY) positions[i + 1] = -windowHalfY;
      if (positions[i + 1] < -windowHalfY) positions[i + 1] = windowHalfY;
      if (positions[i + 2] > 200) positions[i + 2] = -200;
      if (positions[i + 2] < -200) positions[i + 2] = 200;
    }

    particle.system.geometry.attributes.position.needsUpdate = true;
  });
}

/**
 * Update camera based on mouse position
 */
function updateCamera() {
  if (!isMobile() && config.mouseInfluence > 0) {
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
  }
}

/* ============================================
   EVENT LISTENERS
   ============================================ */

/**
 * Add event listeners
 */
function addEventListeners() {
  // Window resize
  window.addEventListener('resize', onWindowResize, false);

  // Mouse move
  if (!isMobile()) {
    document.addEventListener('mousemove', onMouseMove, false);
  }

  // Touch move (mobile)
  if (isTouchDevice()) {
    document.addEventListener('touchmove', onTouchMove, false);
  }

  // Page visibility
  document.addEventListener('visibilitychange', onVisibilityChange, false);
}

/**
 * Handle window resize
 */
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Handle mouse move
 */
function onMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) / config.mouseInfluence;
  mouseY = (event.clientY - windowHalfY) / config.mouseInfluence;
}

/**
 * Handle touch move
 */
function onTouchMove(event) {
  if (event.touches.length > 0) {
    mouseX = (event.touches[0].clientX - windowHalfX) / config.mouseInfluence;
    mouseY = (event.touches[0].clientY - windowHalfY) / config.mouseInfluence;
  }
}

/**
 * Handle page visibility change
 */
function onVisibilityChange() {
  if (document.hidden) {
    // Pause animation when page is hidden
    console.log('Three.js animation paused');
  } else {
    // Resume animation when page is visible
    console.log('Three.js animation resumed');
  }
}

/* ============================================
   PERFORMANCE OPTIMIZATION
   ============================================ */

/**
 * Reduce particle count for low-end devices
 */
function optimizeForPerformance() {
  // Check FPS
  let lastTime = performance.now();
  let frames = 0;
  
  setInterval(() => {
    const currentTime = performance.now();
    const fps = Math.round(frames * 1000 / (currentTime - lastTime));
    
    if (fps < 30 && config.particleCount > 30) {
      console.warn('Low FPS detected, reducing particles');
      config.particleCount = Math.max(30, config.particleCount - 10);
      scene.clear();
      particles = [];
      lines = [];
      createParticles();
    }
    
    frames = 0;
    lastTime = currentTime;
  }, 2000);
  
  requestAnimationFrame(function countFrames() {
    frames++;
    requestAnimationFrame(countFrames);
  });
}

/* ============================================
   INITIALIZATION ON DOM LOAD
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initThreeJS();
  optimizeForPerformance();
});

/* ============================================
   CLEANUP ON PAGE UNLOAD
   ============================================ */

window.addEventListener('beforeunload', () => {
  // Clean up Three.js resources
  if (renderer) {
    renderer.dispose();
  }
  
  particles.forEach(particle => {
    particle.system.geometry.dispose();
    particle.system.material.dispose();
  });
  
  lines.forEach(line => {
    line.geometry.dispose();
    line.material.dispose();
  });
});