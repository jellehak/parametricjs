import cadData from "./sample.js"

//Setup scene
const { add, scene } = y3d.setup({
    camera: {
        x: 100,
        y: 100,
        z: 100
    },
    size: "1 unit = 1 mm",
    background: "#fff"
})

//Debug the scene in the console
window.scene = scene;

add({
    type: 'light',
    position: {
        x: 100,
        y: 100,
        z: 100
    }
})

add({
    type: 'axis',
    size: 100,
    position: [0, 0, 0],
})




//Debug
//console.log(YCAD, scene)

const part = new YCAD({ cad: cadData, scene: scene })
const mesh = part.render()

console.log(mesh)

scene.add(mesh)



//-----------
// UI
//-----------
const keyHandlers = [{
    key: "h",
    description: "Toggle mesh visibility",
    handler: () => {
        //console.log(mesh.children)
        mesh.children.map((elem) => { elem.visible = !elem.visible })
    }
}]

document.addEventListener('keypress', ({ key }) => {
    //console.log('keypress event\n\n' + 'key: ' + key)
    //if (keyHandlers[key]) keyHandlers[key]()
    keyHandlers.map((elem) => { if (elem.key == key) elem.handler() })
});


//On EnterFrame
add({
    render: ({ keyboard }) => {
        if (keyboard.pressed("shift+A")) {
            console.log("Help")
        }
    }
})




//var start_time = (new Date()).getTime();
var cube_geometry = new THREE.CubeGeometry(3, 3, 3);
var cube_mesh = new THREE.Mesh(cube_geometry);
cube_mesh.position.x = -7;
var cube_bsp = new ThreeBSP(cube_mesh);
var sphere_geometry = new THREE.SphereGeometry(1.8, 32, 32);
var sphere_mesh = new THREE.Mesh(sphere_geometry);
sphere_mesh.position.x = -7;
var sphere_bsp = new ThreeBSP(sphere_mesh);

var subtract_bsp = cube_bsp.subtract(sphere_bsp);
var result = subtract_bsp.toMesh(new THREE.MeshLambertMaterial({
    shading: THREE.SmoothShading,
    map: new THREE.TextureLoader().load('texture.png')
}));
result.geometry.computeVertexNormals();
scene.add(result);
//console.log('Example 1: ' + ((new Date()).getTime() - start_time) + 'ms');