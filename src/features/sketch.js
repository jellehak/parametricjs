import isString from '../helpers/isString'
import PathToShape from '../helpers/PathToShape'

export default function pattern(input) {
    const { ycad, cadData, scene, feature, object3d } = input;
    const { compile } = ycad
    const { selectById, sketchId, settings } = feature
    const { path, plane } = feature

    console.log(`Creating sketch on plane "${plane}"`)

    let _path = Array() //Create a compiled version

    //Create rendered sketch
    path.map((point) => {
        const { x, y } = point
        //Copy
        let _point = { x: x, y: y }
            //Process macro
        if (isString(x)) {
            _point.x = compile(x)
        }
        if (isString(y)) {
            _point.y = compile(y)
        }
        _path.push(_point)
    })

    //Finalize
    const shape = PathToShape(path || pathCompiled)
    feature._path = _path
    feature._shape = shape

    //Draw sketch
    //testPath(scene)
    var points = shape.getPoints()
    var geometry = new THREE.BufferGeometry().setFromPoints(points)
    var lines = new THREE.Line(geometry, material)

    //Place the sketch
    lines.rotateX(THREE.Math.degToRad(90))

    // mesh.rotateY(0)
    // mesh.rotateZ(0)


    scene.add(lines)
    console.log(shape)

    //object3d.add(line)
}

const materialSimple = new THREE.LineBasicMaterial({ color: 0x000000 })
const material = new THREE.LineBasicMaterial({
    color: 0x000000,
    linewidth: 5,
    linecap: 'round', //ignored by WebGLRenderer
    linejoin: 'round' //ignored by WebGLRenderer
});



function testPath(scene) {
    var path = new THREE.Path()
    path.lineTo(0, 8)
    path.quadraticCurveTo(0, 10, 2, 10)
    path.lineTo(10, 10)
    var points = path.getPoints()
    var geometry = new THREE.BufferGeometry().setFromPoints(points)
    var material = new THREE.LineBasicMaterial({ color: 0x000000 })
    var line = new THREE.Line(geometry, material)
    scene.add(line)
}