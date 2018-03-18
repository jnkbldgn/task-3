(function(){
    
    const container = document.querySelector('.logo');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer({alfa: true});
    renderer.setSize( 40, 40);
    container.appendChild( renderer.domElement );
    const geometry = new THREE.BoxGeometry( 3, 3, 3 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    camera.position.z = 4;
    //функция рендера
    function render() {
        cube.rotation.x += 0.05;
        cube.rotation.y += 0.05;
        renderer.render(scene, camera);

        requestAnimationFrame( render );
    };

    render();

})();