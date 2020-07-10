//-----------
// Selecting object with raycast
//-----------
import raycast from "./raycast.js"

const domElement = document.body //y3d.renderer.domElement
const camera = y3d.camera
    // console.log(y3d, camera)


raycast.on("raycast", (resp) => {
    console.log(resp)
})

