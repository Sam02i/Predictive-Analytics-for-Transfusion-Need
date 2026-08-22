    const container = document.getElementById('3d-container');
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
    const positionAttribute = sphereGeometry.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        if (vertex.y > 0) {
            const factor = 1.0 + Math.pow(vertex.y, 2.0) * 1.5;
            vertex.x /= factor;
            vertex.z /= factor;
            vertex.y *= 1.8;
        }
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    sphereGeometry.computeVertexNormals();

    const material = new THREE.MeshPhongMaterial({
        color: 0xc53030,
        specular: 0xffffff,
        shininess: 100,
        transparent: true,
        opacity: 0.9,
        emissive: 0x300000
    });

    const bloodDrop = new THREE.Mesh(sphereGeometry, material);
    scene.add(bloodDrop);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 5;

    function animate(t) {
        requestAnimationFrame(animate);
        bloodDrop.position.y = Math.sin(t * 0.002) * 0.2;
        bloodDrop.rotation.y += 0.01;
        const scale = 1.0 + Math.sin(t * 0.003) * 0.05;
        bloodDrop.scale.set(scale, scale, scale);
        renderer.render(scene, camera);
    }
    animate(0);

    window.addEventListener('resize', () => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    });
