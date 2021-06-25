var dimension = 600;
var aspect = 16 / 9;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, (dimension * aspect) / dimension, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
container = document.getElementById("container");
renderer.setSize(dimension * aspect, dimension);
container.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

//LIGHT

const directionalLight = new THREE.DirectionalLight(0xbbbbbb, 0.8);
directionalLight.position.set( 0, 200, -500 );
directionalLight.castShadow = true;
scene.add(directionalLight);


const hemisphere = new THREE.HemisphereLight(0xaaaaaa, 0x222222, 0.6);
scene.add(hemisphere);

directionalLight.shadow.mapSize.width = 2048*4; // default
directionalLight.shadow.mapSize.height = 2048*4; // default
directionalLight.shadow.camera.near = 0.5; // default
directionalLight.shadow.camera.far = 5000; // default
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;
directionalLight.shadow.camera.left = 400;
directionalLight.shadow.camera.right = -400;

/*
const helper = new THREE.DirectionalLightHelper( directionalLight, 10 );
scene.add( helper );
var shadowHelper = new THREE.CameraHelper( directionalLight.shadow.camera );
scene.add( shadowHelper );
*/


function getRandomInt(min, max) {
    min = min;
    max = max;
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

scene.fog = new THREE.FogExp2( 0x3a3638, 0.005 );



//SKY
sky = new THREE.Sky();
sky.scale.setScalar( 5000 );

const params = {
    turbidity: 10,
    mieDirectionalG: 0.7,
    mieCoefficient: 0.005,
    azimuth: 180,
    elevation: 2,
    exposure: renderer.toneMappingExposure,
    rayleigh: 3,
};

var sun = new THREE.Vector3();

const skyParams = sky.material.uniforms;
skyParams[ 'turbidity' ].value = params.turbidity;
skyParams[ 'rayleigh' ].value = params.rayleigh;
skyParams[ 'mieCoefficient' ].value = params.mieCoefficient;
skyParams[ 'mieDirectionalG' ].value = params.mieDirectionalG;

const phi = THREE.MathUtils.degToRad( 90 - params.elevation );
const theta = THREE.MathUtils.degToRad( params.azimuth );

sun.setFromSphericalCoords( 1, phi, theta );

skyParams[ 'sunPosition' ].value.copy( sun );

renderer.toneMappingExposure = params.exposure;

scene.add( sky );


//PLANE

var planeLength = 2000;
var planeWidth = 2000;
const planeGeometry = new THREE.PlaneGeometry(planeLength, planeWidth);
const planeMaterial = new THREE.MeshPhongMaterial();

const normalTexture = new THREE.TextureLoader().load("../Common/dirt_N.jpg");
normalTexture.wrapS = THREE.RepeatWrapping;
normalTexture.wrapT = THREE.RepeatWrapping;
normalTexture.repeat.set(50, 50);

const texture = new THREE.TextureLoader().load("../Common/dirt_S.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(50, 50);

planeMaterial.normalMap = normalTexture;
planeMaterial.map = texture;
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1.5;
plane.receiveShadow = true;
scene.add(plane);
/*
var loader = new THREE.TDSLoader();

for (let i = -100; i < 100; i+=10) {
    for (let j = -100; j < 100; j+=10) {
        loader.load("../Common/grass-block.3ds", function (object) {
            object.position.y = -1.2;
            object.rotation.x = Math.PI / 2;
            object.rotation.z = Math.PI / 2*Math.random();
            object.scale.set(0.3+Math.random(), 0.45+Math.random(), 0.2);
            object.position.x = i + Math.exp(Math.sin(Math.random()));
            object.position.z = j + Math.exp(Math.sin(Math.random()));
            scene.add(object);
        });
    }
}
*/
//THREES
var threeDensity = 1000;
const normalTextureThree = new THREE.TextureLoader().load("../Common/LongLeaves_N.jpg");

for (var i = 0; i < threeDensity; i++) {
    var diff = Math.random()*3
    const threeGeometry = new THREE.ConeGeometry(4, 8+diff, 4);
    const threeMaterial = new THREE.MeshPhongMaterial({ color: 0x2d572c });    
    threeMaterial.metalness = 0.1;
    normalTextureThree.wrapS = THREE.RepeatWrapping;
    normalTextureThree.wrapT = THREE.RepeatWrapping;
    normalTextureThree.repeat.set(5, 5);
    threeMaterial.normalMap = normalTextureThree;
    const three = new THREE.Mesh(threeGeometry, threeMaterial);
    three.rotation.x = Math.PI / 2;
    three.position.z = 6+diff;
    three.position.x = getRandomInt(-planeLength / 2.1, planeWidth / 2.1);
    three.position.y = getRandomInt(-planeLength / 2.1, planeWidth / 2.1);
    three.castShadow = true;
    if (
        !(
            three.position.x > -12 &&
            three.position.x < 12 &&
            three.position.y > -12 &&
            three.position.y < 12
        )
    ) {
        plane.add(three);
    }
    const woodGeometry = new THREE.BoxGeometry(1, 3+diff, 1);
    const woodMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
    const wood = new THREE.Mesh(woodGeometry, woodMaterial);
    wood.position.y = -5-diff;
    wood.castShadow = true;
    three.add(wood);
}

//BASE
const baseGeometry = new THREE.CylinderGeometry(10, 11, 2, 10);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
const normalTextureBase = new THREE.TextureLoader().load("../Common/metalSurface_N.jpg");
normalTextureBase.wrapS = THREE.RepeatWrapping;
normalTextureBase.wrapT = THREE.RepeatWrapping;
normalTextureBase.repeat.set(10,10);
baseMaterial.normalMap = normalTextureBase;
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.castShadow = true;
base.receiveShadow = true;
base.rotation.x = Math.PI / 2;
base.position.z = 0.99;
plane.add(base);

for (let i = 0; i < 2; i++) {
    const LightSourceGeometry = new THREE.CylinderGeometry(0.4,0.4,2,32);
    const LightSourceMaterial = new THREE.MeshStandardMaterial({color: 0x111111, vertexColors: THREE.FaceColors})
    const LightSource = new THREE.Mesh(LightSourceGeometry, LightSourceMaterial);
    LightSource.castShadow = true;
    LightSource.receiveShadow = true;
    
    
    LightSource.position.y = 1
    LightSource.position.x = 0
    if(i==0){
        LightSource.rotation.x = -Math.PI * 0.35
        LightSource.position.z = 8.8;
    }
    else {
        LightSource.rotation.x = Math.PI * 0.35
        LightSource.position.z = -8.8;
    }
    base.add(LightSource)

    const spotLight = new THREE.SpotLight( 0xbbbbff );
    spotLight.position.set( 0, 0.8, 0.2 );
    spotLight.angle = Math.PI/4;
    spotLight.penumbra = 0.9;
    spotLight.intensity = 10;
    spotLight.distance = 10;
    
    spotLight.castShadow = true;
    
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    
    spotLight.shadow.camera.near = 0.5;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 10;

    spotLight.target = new THREE.Object3D();
    spotLight.target.position.set(0,1.5,0);


    scene.add( spotLight.target )
    LightSource.add( spotLight );

}

// LANDING BASE
const baseGeometry2 = new THREE.CylinderGeometry(10, 11, 2, 10);
const baseMaterial2 = new THREE.MeshStandardMaterial({ color: 0xee5050 });
const normalTextureBase2 = new THREE.TextureLoader().load("../Common/metalSurface_N.jpg");
normalTextureBase2.wrapS = THREE.RepeatWrapping;
normalTextureBase2.wrapT = THREE.RepeatWrapping;
normalTextureBase2.repeat.set(10,10);
baseMaterial2.normalMap = normalTextureBase2;
const base2 = new THREE.Mesh(baseGeometry2, baseMaterial2);
base2.castShadow = true;
base2.receiveShadow = true;
base2.position.x = 500
base2.position.y = 200
base2.rotation.x = Math.PI / 2;
base2.position.z = 0.99;
plane.add(base2);

for (let i = 0; i < 2; i++) {
    const LightSourceGeometry = new THREE.CylinderGeometry(0.4,0.4,2,32);
    const LightSourceMaterial = new THREE.MeshStandardMaterial({color: 0x111111, vertexColors: THREE.FaceColors})
    const LightSource = new THREE.Mesh(LightSourceGeometry, LightSourceMaterial);
    LightSource.castShadow = true;
    LightSource.receiveShadow = true;
    
    
    LightSource.position.y = 1
    LightSource.position.x = 0
    if(i==0){
        LightSource.rotation.x = -Math.PI * 0.35
        LightSource.position.z = 8.8;
    }
    else {
        LightSource.rotation.x = Math.PI * 0.35
        LightSource.position.z = -8.8;
    }
    base2.add(LightSource)

    const spotLight = new THREE.SpotLight( 0xbbbbff );
    spotLight.position.set( 0, 0.8, 0.2 );
    spotLight.angle = Math.PI/4;
    spotLight.penumbra = 0.9;
    spotLight.intensity = 10;
    spotLight.distance = 10;
    
    spotLight.castShadow = true;
    
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    
    spotLight.shadow.camera.near = 0.5;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 10;

    spotLight.target = new THREE.Object3D();
    spotLight.target.position.set(500,1.5,-200);


    scene.add( spotLight.target )
    LightSource.add( spotLight );

}


//HELICOPTER

//cockpit
const cockpitGeometry = new THREE.BoxGeometry(3.5, 2, 2.5);
const cockpitMaterial = new THREE.MeshStandardMaterial({ color: 0x3f679a });
cockpitMaterial.metalness = 0.8;
const normalTextureCockpit = new THREE.TextureLoader().load("../Common/steel4_N.jpg");
normalTextureCockpit.wrapS = THREE.RepeatWrapping;
normalTextureCockpit.wrapT = THREE.RepeatWrapping;
normalTextureCockpit.repeat.set(2,2);
cockpitMaterial.normalMap = normalTextureCockpit;
const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
cockpit.position.y = 2.2;
//cockpit.rotation.y = Math.PI/4;
cockpit.castShadow = true;
scene.add(cockpit);
directionalLight.target = cockpit;

//Landing long
for (let i = 0; i < 2; i++) {
    const landingGeometry = new THREE.CylinderGeometry(0.1,0.1,6,32);
    const landingMaterial = new THREE.MeshStandardMaterial({color: 0x333333})
    const landing = new THREE.Mesh(landingGeometry, landingMaterial);
    landing.rotation.z = Math.PI/2;
    landing.position.y = -1.6;
    landing.position.x = -0.5;
    if(i==0) landing.position.z = 1.7;
    else landing.position.z = -1.7;
    landing.castShadow = true;
    landing.receiveShadow = true;
    cockpit.add(landing)
    
}

//Landing curve
for (let i = 0; i < 2; i++) {
    const landingGeometry = new THREE.TorusGeometry(0.3, 0.1, 32, 32, Math.PI);
    const landingMaterial = new THREE.MeshStandardMaterial({color: 0x333333})
    const landing = new THREE.Mesh(landingGeometry, landingMaterial);
    landing.rotation.z = -Math.PI*0.4;
    landing.position.y = -1.32;
    landing.position.x = 2.38;
    if(i==0) landing.position.z = 1.7;
    else landing.position.z = -1.7;
    landing.castShadow = true;
    landing.receiveShadow = true;
    cockpit.add(landing)
    
}

for (let i = 0; i < 4; i++) {
    const landingGeometry = new THREE.CylinderGeometry(0.1,0.08,1.2,32);
    const landingMaterial = new THREE.MeshStandardMaterial({color: 0x333333})
    const landing = new THREE.Mesh(landingGeometry, landingMaterial);
    if(i==0){
        landing.rotation.z = Math.PI/4;
        landing.rotation.y = -Math.PI/4;
        landing.position.x = 1.9;
        landing.position.y = -1.2;
        landing.position.z = 1.4;
    }
    else if(i==1){
        landing.rotation.x = -Math.PI/5;
        landing.rotation.z = -Math.PI/5;
        landing.position.x = -1.9;
        landing.position.y = -1.2;
        landing.position.z = 1.4;
    }
    else if(i==2){
        landing.rotation.z = Math.PI/4;
        landing.rotation.y = Math.PI/4;
        landing.position.x = 1.9;
        landing.position.y = -1.2;
        landing.position.z = -1.4;
    }
    else if(i==3){
        landing.rotation.x = Math.PI/5;
        landing.rotation.z = -Math.PI/5;
        landing.position.x = -1.9;
        landing.position.y = -1.2;
        landing.position.z = -1.4;
    }
    landing.castShadow = true;
    landing.receiveShadow = true;
    cockpit.add(landing)
    
}

const LightSourceGeometry = new THREE.CylinderGeometry(0.2,0.4,0.8,32);
const LightSourceMaterial = new THREE.MeshStandardMaterial({color: 0xaaaaaa})
const LightSource = new THREE.Mesh(LightSourceGeometry, LightSourceMaterial);

LightSource.position.y = -1
LightSource.position.x = 1.8
LightSource.rotation.z = Math.PI/4;

cockpit.add(LightSource)

const spotLight = new THREE.SpotLight( 0xbbbbff, 1 );
spotLight.position.set( 0, 0, 0 );
spotLight.angle = Math.PI/6;
spotLight.penumbra = 0.3;
spotLight.intensity = 1;
spotLight.distance = 200;

spotLight.castShadow = true;

spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 10;
spotLight.shadow.focus = 1;

spotLight.target = new THREE.Object3D();
spotLight.target.position.set(cockpit.position.x + 6, cockpit.position.y -5, cockpit.position.z);

scene.add(spotLight.target)
LightSource.add( spotLight );

var flagLight = true;

//Dors & windows
const mainWindowGeometry = new THREE.BoxGeometry(0.1, 1.5, 2)
const mainWindowMaterial = new THREE.MeshStandardMaterial({color: 0xa0e1ff})
const mainWindow = new THREE.Mesh(mainWindowGeometry, mainWindowMaterial)
mainWindow.position.x = 1.75;
mainWindow.position.y = 0.15;
cockpit.add(mainWindow)

const windowGeometry1 = new THREE.BoxGeometry(0.1, 1, 1.25)
const windowMaterial1 = new THREE.MeshStandardMaterial({color: 0xa0e1ff})
const window1 = new THREE.Mesh(windowGeometry1, windowMaterial1)
window1.rotation.y = Math.PI/2;
window1.position.x = 0.9;
window1.position.y = 0.3;
window1.position.z = 1.25;
cockpit.add(window1)

const window2 = new THREE.Mesh(windowGeometry1, windowMaterial1)
window2.rotation.y = Math.PI/2;
window2.position.x = 0.9;
window2.position.y = 0.3;
window2.position.z = -1.25;
cockpit.add(window2)





//Tail
const tailGeometry = new THREE.CylinderGeometry(0.2, 0.7, 7, 32);
const tailMaterial = new THREE.MeshStandardMaterial({ color: 0x3f679a });
tailMaterial.metalness = 0.5;
const normalTextureTail = new THREE.TextureLoader().load("../Common/steel2_N.jpg");
normalTextureTail.wrapS = THREE.RepeatWrapping;
normalTextureTail.wrapT = THREE.RepeatWrapping;
normalTextureTail.repeat.set(10, 10);
tailMaterial.normalMap = normalTextureTail;
const tail = new THREE.Mesh(tailGeometry, tailMaterial);
tail.rotation.z = Math.PI / 2;
tail.position.x = -5;
tail.castShadow = true;
tail.receiveShadow = true;
cockpit.add(tail);


//Rotor
const rotorGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 32);
const rotorMaterial = new THREE.MeshStandardMaterial({ color: 0x3f679a });
const rotor = new THREE.Mesh(rotorGeometry, rotorMaterial);
rotor.position.y = 1.5;
rotor.castShadow = true;
rotor.receiveShadow = true;
cockpit.add(rotor);

const length = 0.9,
    width = 0.1;

const shape = new THREE.Shape();
shape.moveTo(0, 0);
shape.lineTo(0, width);
shape.lineTo(length, width);
shape.lineTo(length, 0);
shape.lineTo(0, 0);

const extrudeSettings = {
    steps: 2,
    depth: 10,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: 0.05,
    bevelOffset: 0,
    bevelSegments: 1,
};

//Blade
const bladeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0xbbbbbb });
const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
var center = new THREE.Vector3();
blade.geometry.computeBoundingBox();
blade.geometry.boundingBox.getCenter(center);
blade.geometry.center();
blade.position.copy(center);
blade.position.z = 0;
blade.position.x = 0;
blade.position.y = 0.45;
blade.castShadow = true;
rotor.add(blade);

//TailRotor
const tailRotorGeometry = new THREE.TorusGeometry(0.8, 0.15, 16, 8);
const tailRotorMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const tailRotor = new THREE.Mesh(tailRotorGeometry, tailRotorMaterial);
tailRotor.position.y = 4.2;
tailRotor.castShadow = true;
tail.add(tailRotor);


const shape2 = new THREE.Shape();
shape2.moveTo(0, 0);
shape2.lineTo(0, 0.03);
shape2.lineTo(0.2, 0.03);
shape2.lineTo(0.2, 0);
shape2.lineTo(0, 0);

const extrudeSettings2 = {
    steps: 2,
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: 0.05,
    bevelOffset: 0,
    bevelSegments: 2,
};

//Tail Blade
const tailBladeGeometry = new THREE.ExtrudeGeometry(shape2, extrudeSettings2);
const tailBladeMaterial = new THREE.MeshStandardMaterial({ color: 0xbbbbbb });
const tailBlade = new THREE.Mesh(tailBladeGeometry, tailBladeMaterial);
center = new THREE.Vector3();
tailBlade.geometry.computeBoundingBox();
tailBlade.geometry.boundingBox.getCenter(center);
tailBlade.geometry.center();
tailBlade.position.copy(center);
tailBlade.position.z = 0;
tailBlade.position.x = 0;
tailBlade.position.y = 0;
tailBlade.rotation.x = Math.PI / 2;
tailBlade.castShadow = true;
tailRotor.add(tailBlade);





//ANIMATIONS

var to = false;
var target = { y: 16 * Math.PI - 0.00001 };
var mainBladeRotation = new TWEEN.Tween(blade.rotation).to(target, 8000);
var tailBladeRotation = new TWEEN.Tween(tailBlade.rotation).to(target, 8000);
var mainBladeRotation2 = new TWEEN.Tween(blade.rotation).to({ y: -4 * Math.PI }, 1000);
var tailBladeRotation2 = new TWEEN.Tween(tailBlade.rotation).to({ y: -4 * Math.PI }, 1000);
mainBladeRotation.onStart(
        function() {
            document.getElementById("notReady").style.backgroundColor = 'rgba(' + 255 + ',' + 255 + ',' + 255 + ',' + 0.2 + ')';
            document.getElementById("starting").style.backgroundColor = "yellow"
    });
mainBladeRotation.onComplete(
        function() {
            to = true;
            document.getElementById("starting").style.backgroundColor = 'rgba(' + 255 + ',' + 255 + ',' + 255 + ',' + 0.2 + ')';
            document.getElementById("ready").style.backgroundColor = "green"
            document.getElementById("rtto").style.visibility = "unset"
    });
mainBladeRotation.easing(TWEEN.Easing.Quintic.In);
tailBladeRotation.easing(TWEEN.Easing.Quintic.In);
mainBladeRotation.chain(mainBladeRotation2);
tailBladeRotation.chain(tailBladeRotation2);
mainBladeRotation2.repeat(Infinity);
tailBladeRotation2.repeat(Infinity);



document.getElementById("buttonStartEngine").onclick = function () {

        mainBladeRotation.start();
        tailBladeRotation.start();

};

document.getElementById("buttonLightOnOff").onclick = function () {
    if(flagLight){
        spotLight.intensity = document.getElementById("intensitySlider").disabled = true;
        spotLight.intensity = 0;
        flagLight = !flagLight;
    }
    else{
        spotLight.intensity = document.getElementById("intensitySlider").disabled = false;
        spotLight.intensity = document.getElementById("intensitySlider").value;
        flagLight = !flagLight;
    }
};
document.getElementById("buttonLightRed").onclick = function () {
    spotLight.color.setHex( 0xff0000 )
};
document.getElementById("buttonLightBlue").onclick = function () {
    spotLight.color.setHex( 0x0000ff )
};
document.getElementById("buttonLightWhite").onclick = function () {
    spotLight.color.setHex( 0xffffff )
};
document.getElementById("intensitySlider").oninput = function(){
    spotLight.intensity = this.value;
}


//CAMERA

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target = cockpit.position;
controls.maxPolarAngle = Math.PI/2;
controls.maxDistance = 100;
controls.minDistance = 3;

controls.enableDamping = true; 
controls.dampingFactor = 0.05;


camera.position.set(-30, 12, 0);
controls.update()



//KEYBOARD CONTROLS
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(e) {
    //console.log(e);
    if(to){
        switch (e.code) {
            case 'ArrowUp':
                var position = cockpit.localToWorld(new THREE.Vector3(1,0,0));
                var auxAn = new TWEEN.Tween(cockpit).to({position: position}, 10).start();
                position = cockpit.localToWorld(new THREE.Vector3(-30,12,0));
                var cameraAnimation = new TWEEN.Tween(camera).to({position:position}, 10).start();
                position = cockpit.localToWorld(new THREE.Vector3(6,-5,0));
                var lightAnimation = new TWEEN.Tween(spotLight.target).to({position: position}, 10).start();
                var shadowAnimation = new TWEEN.Tween(directionalLight.position).to({x: cockpit.position.x,  z: cockpit.position.z-500}, 10).start();
            break;
            case 'ArrowDown':
                var position = cockpit.localToWorld(new THREE.Vector3(-1,0,0));
                var auxAn = new TWEEN.Tween(cockpit).to({position: position}, 10).start();
                position = cockpit.localToWorld(new THREE.Vector3(-30,12,0));
                var cameraAnimation = new TWEEN.Tween(camera).to({position:position}, 10).start();
                position = cockpit.localToWorld(new THREE.Vector3(6,-5,0));
                var lightAnimation = new TWEEN.Tween(spotLight.target).to({position: position}, 10).start();
                var shadowAnimation = new TWEEN.Tween(directionalLight.position).to({x: cockpit.position.x, z: cockpit.position.z-500}, 10).start();
            break;
            case 'ArrowLeft':
                var auxAn = new TWEEN.Tween(cockpit.rotation).to({y: cockpit.rotation.y+Math.PI/100}, 20).onComplete(function(){
                    var position = cockpit.localToWorld(new THREE.Vector3(-30,12,0));
                    new TWEEN.Tween(camera).to({position:position}, 100).start();
                }).start();
                var position = cockpit.localToWorld(new THREE.Vector3(6,-5,0));
                var lightAnimation = new TWEEN.Tween(spotLight.target).to({position: position}, 10).start();                
            break;
            case 'ArrowRight':
                var auxAn = new TWEEN.Tween(cockpit.rotation).to({y: cockpit.rotation.y-Math.PI/100}, 20).onComplete(function(){
                    var position = cockpit.localToWorld(new THREE.Vector3(-30,12,0));
                    new TWEEN.Tween(camera).to({position:position}, 100).start();
                }).start();
                var position = cockpit.localToWorld(new THREE.Vector3(6,-5,0));
                var lightAnimation = new TWEEN.Tween(spotLight.target).to({position: position}, 10).start();
            break;
            /*case 'KeyA':
                var auxAn = new TWEEN.Tween(cockpit.position).to({z: cockpit.position.z-1}, 10).start();
                var cameraAnimation = new TWEEN.Tween(camera.position).to({z: camera.position.z-1}, 10).start();
                var lightAnimation = new TWEEN.Tween(spotLight.target.position).to({z: spotLight.target.position.z-1}, 10).start();
                var shadowAnimation = new TWEEN.Tween(directionalLight.position).to({z: directionalLight.position.z-1}, 10).start();
            break;
            case 'KeyD':
                var auxAn = new TWEEN.Tween(cockpit.position).to({z: cockpit.position.z+1}, 10).start();
                var cameraAnimation = new TWEEN.Tween(camera.position).to({z: camera.position.z+1}, 10).start();
                var lightAnimation = new TWEEN.Tween(spotLight.target.position).to({z: spotLight.target.position.z+1}, 10).start();
                var shadowAnimation = new TWEEN.Tween(directionalLight.position).to({z: directionalLight.position.z+1}, 10).start();
            break;*/
            case 'KeyW':
                var auxAn = new TWEEN.Tween(cockpit.position).to({y: cockpit.position.y+0.5}, 50).start();
                var cameraAnimation = new TWEEN.Tween(camera.position).to({y: camera.position.y+0.5}, 50).start();
                var lightAnimation = new TWEEN.Tween(spotLight.target.position).to({y: spotLight.target.position.y+0.5}, 50).start();
            break;
            case 'KeyS':
                if((!(cockpit.position.x > -12 && cockpit.position.x < 12 && cockpit.position.z > -12 && cockpit.position.z < 12 && cockpit.position.y<2.6))
                    && (!(cockpit.position.x > 488 && cockpit.position.x < 512 && cockpit.position.z < -188 && cockpit.position.z > -212 && cockpit.position.y<2.6))){
                    if(cockpit.position.y>0.6){
                        console.log(cockpit.position.x, cockpit.position.z)
                        var auxAn = new TWEEN.Tween(cockpit.position).to({y: cockpit.position.y-0.5}, 50).start();
                        var cameraAnimation = new TWEEN.Tween(camera.position).to({y: camera.position.y-0.5}, 50).start();
                        var lightAnimation = new TWEEN.Tween(spotLight.target.position).to({y: spotLight.target.position.y-0.5}, 50).start();
                    }
                    
                }
                
            break;
            
        }
    }
    
}

function animate() {
    if(cockpit.position.x > 488 && cockpit.position.x < 512 && cockpit.position.z < -188 && cockpit.position.z > -212 && cockpit.position.y<2.6){
        window.location.replace("finish.html");
    }
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
    renderer.render(scene, camera);
}
animate();