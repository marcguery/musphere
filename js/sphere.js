var scene = new THREE.Scene();

var container = document.getElementById('container'), 
    loader = new THREE.TextureLoader(), 
    renderer, 
    camera,
    incr = 0.1,
    state = 0,
    range = 1,
    elapsed = 0,
    maxParticles = 1000,
    radius = 100, 
    sphereGeometry, 
    sphere, 
    stats,
    color = new THREE.Color( 0xffffff );

function init() {

    var vw = window.innerWidth, 
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

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    // var axisHelper = new THREE.AxisHelper(50);
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
  
  //loader.crossOrigin = true;

    var particleTexture = loader.load('https://upload.wikimedia.org/wikipedia/commons/4/48/Bluedot.svg'), 
        material = new THREE.PointsMaterial({
            color: 'purple', 
            size: 15, 
            transparent: true,
            blending: THREE.AdditiveBlending, 
            map: particleTexture, 
            depthWrite: false
        });

        for ( var i = 0; i < maxParticles; i++ ) {

            var xPos = i % 2 === 0 ? radius : -radius, 
                vertex = new THREE.Vector3(xPos, 0, 0);

            var num=Math.random()
            if ( num <= 0.25 ){
                xDir = 1
                yDir = 0
            }

            else if ( num <= 0.5 ){
                xDir = 0.5
                yDir = -0.5
            }

            else if ( num <= 0.75 ){
                xDir = 0.5
                yDir = 0.5
            }

            else {
                xDir = 0
                yDir = 1
            }

            vertex.rotationAxis = new THREE.Vector3(state, xDir, yDir);
            sphereGeometry.vertices.push(vertex);

        }

        sphere = new THREE.Points(sphereGeometry, material);
        scene.add(sphere);

}

function update() {
    for ( var i = 0; i < maxParticles; i++ ) {
        var particle = sphereGeometry.vertices[i];

        if ( elapsed < 100 ) {
            particle.applyAxisAngle(particle.rotationAxis, Math.random()/2);
        }
        else
            particle.rotationAxis.x = state;
            particle.rotationAxis.normalize();
            particle.applyAxisAngle(particle.rotationAxis, 0.01);
    }
    sphere.material.color.set(color);
    sphere.geometry.verticesNeedUpdate = true;

}

function render() {
    elapsed += 1;
    if (state >= range)
        incr = -Math.abs(incr)
    else if (state <= 0)
        incr = Math.abs(incr)
    if ((elapsed % 1000) === 0){
        state += incr
        color.setHex(Math.random() * 0xffffff);
    }
    stats.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    update();

}

init();
setupStats();
draw();
render();