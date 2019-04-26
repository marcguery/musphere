var scene = new THREE.Scene();

let container = document.getElementById('container'), 
    loader = new THREE.TextureLoader(), 
    renderer, 
    camera, 
    elapsed = 0, 
    maxParticles = 100, 
    particlesDelay = 10, 
    radius = 50, 
    sphereGeometry, 
    sphere, 
    stats;

function init() {

    let vw = window.innerWidth, 
        vh = window.innerHeight;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(vw, vh);
    renderer.setPixelRatio(window.devicePixelRatio);

    camera = new THREE.PerspectiveCamera(45, vw / vh, 1, 1000);
    camera.position.z = 200;
    camera.position.x = 0;
    camera.position.y = 0;
    camera.lookAt(scene.position);
    scene.add(camera);

    let controls = new THREE.OrbitControls(camera, renderer.domElement);

    // let axisHelper = new THREE.AxisHelper(50);
    // scene.add(axisHelper);

    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onResize, false);

}

function onResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);    

}

function setupStats() {
    stats = new Stats();
    container.appendChild(stats.domElement);
}

function draw() {

    sphereGeometry = new THREE.Geometry();
  
  loader.crossOrigin = true;

    let particleTexture = loader.load('https://threejs.org/examples/textures/particle2.png'), 
        material = new THREE.PointsMaterial({
            color: 0xffffff, 
            size: 1.5, 
            transparent: true, 
            blending: THREE.AdditiveBlending, 
            map: particleTexture, 
            depthWrite: false
        });

        for ( let i = 0; i < maxParticles; i++ ) {

            let xPos = i % 2 === 0 ? radius : -radius, 
                vertex = new THREE.Vector3(xPos, 0, 0);

            vertex.rotationAxis = new THREE.Vector3(0, Math.random() * 2 - 1, Math.random() * 2 - 1);
            vertex.rotationAxis.normalize();
            vertex.delay = particlesDelay * i;
            sphereGeometry.vertices.push(vertex);

        }

        sphere = new THREE.Points(sphereGeometry, material);
        scene.add(sphere);

}

function update() {
    
    for ( let i = 0; i < maxParticles; i++ ) {

        let particle = sphereGeometry.vertices[i];

        if ( elapsed > particle.delay )
            particle.applyAxisAngle(particle.rotationAxis, 0.008);

    }

    sphere.geometry.verticesNeedUpdate = true;

}

function render() {

    elapsed += 1;
    stats.update();
    update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);

}

init();
setupStats();
draw();
render();