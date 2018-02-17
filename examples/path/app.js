const { add, scene } = y3d.setup({
    camera: {
        x: 10,
        y: 10,
        z: 10
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



var path = new THREE.Path()
path.lineTo(0, 8)
path.quadraticCurveTo(0, 10, 2, 10)
path.lineTo(10, 10)
var points = path.getPoints()
var geometry = new THREE.BufferGeometry().setFromPoints(points)
var material = new THREE.LineBasicMaterial({ color: 0x000000 })
var line = new THREE.Line(geometry, material)
scene.add(line)