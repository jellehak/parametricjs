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

let part = new YCAD({ cad: cadData, scene: scene })

const mesh = part.render()

console.log(mesh)

scene.add(mesh)

import testMeshLine from "./assets/testMeshLine.js"
testMeshLine()