var container, stats;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var palmPosition = [0,0,0];
var palmNormal = [0,0,0];
var pinchStrength = .0;
var grabStrength = .0;
var doRotation = false;
var doClear = true;
var resetPinch = false, resetGrab = false;

init();
// animate();

function init() {
		container = document.createElement( 'div' );
		document.body.appendChild( container );

		camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.set(0, 0, 0);
		scene = new THREE.Scene();
		var colors = [ 0x000000, 0xff0080, 0x8000ff, 0xffffff, 0x008800 ];
		var geometry = new THREE.Geometry();

		for ( var i = 0; i < 2000; i ++ ) {
				var vertex = new THREE.Vector3();
				vertex.x = Math.random() * 4000 - 2000;
				vertex.y = Math.random() * 4000 - 2000;
				vertex.z = Math.random() * 4000 - 2000;
				geometry.vertices.push( vertex );
				geometry.colors.push( new THREE.Color( colors[ Math.floor( Math.random() * colors.length ) ] ) );
		}

		var material = new THREE.PointsMaterial( { size: 1, vertexColors: THREE. VertexColors, depthTest: false, opacity: 0.5, sizeAttenuation: false, transparent: true } );
		var mesh = new THREE.Points( geometry, material );
    mesh.name = "mesh";
		scene.add( mesh );
		renderer = new THREE.WebGLRenderer( { preserveDrawingBuffer: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.sortObjects = false;
		renderer.autoClearColor = false;
		container.appendChild( renderer.domElement );
		stats = new Stats();
		container.appendChild( stats.dom );

		// document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
}

// function onDocumentMouseMove(event) {
// 		mouseX = ( event.clientX - windowHalfX ) * 10;
// 		mouseY = ( event.clientY - windowHalfY ) * 10;
// }

// function animate() {
// 		requestAnimationFrame( animate );
// 		render();
// 		stats.update();
// }

function render() {
		camera.position.x += ( -palmPosition[0] - camera.position.x ) * .05;
		camera.position.y += ( -palmPosition[1] - camera.position.y ) * .05;
    camera.position.z += ( -palmPosition[2] - camera.position.z) * .05;
		// camera.lookAt( scene.position );
    // camera.rotation.x += palmNormal[0];
    if (doClear === true) renderer.clear();
		renderer.render( scene, camera );
}

function onFrame(frame){
    palmPosition = frame.hands[0].palmPosition;
    palmNormal = frame.hands[0].palmNormal;
    grabStrength = frame.hands[0].grabStrength;
    pinchStrength = frame.hands[0].pinchStrength;

    if(resetGrab === false && grabStrength === 1.0){
		    camera.position.set( Math.random()*4000, Math.random()*4000, Math.random()*4000);
        resetGrab = true;
    } else if(resetGrab === true && grabStrength < 0.5){
        resetGrab = false;
    }


    if(resetPinch === false && pinchStrength == 1.0 && grabStrength < 0.5){
        console.log(grabStrength);
        doClear = !doClear;
        resetPinch = true;
    } else if(resetPinch === true && pinchStrength < 0.5){
        resetPinch = false;
    }

    for(var i =0; i < 3; i++){
        palmPosition[i] *= 4;
    }
}

Leap.loop({background: true, enableGestures: true},function(frame){
    stats.update();
    if (frame.hands.length < 1) return;
    onFrame(frame);
    render();
});
