import cadData from "./sample.js"

//Setup scene
const { axis, scene } = y3d.setup({
    camera: {
        x: 100,
        y: 100,
        z: 100
    },
    size: "1 unit = 1 mm",
    background: "#fff"
})
axis(10)


//Debug
console.log(y3d, YCAD, scene)

let part = new YCAD(cadData)
scene.add(part.render())