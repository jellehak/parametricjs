import PathToShape from '../helpers/PathToShape'

export default function extrude(input) {
    let { ycad, cadData, scene, feature, object3d } = input;

    //Compile Extrude settings?
    let data = feature.data
    let _data = Object.create(data) //Create copy
    _data.amount = ycad.compile(data.amount)

    let what = ycad.getFeatureById(data.selectById || data.sketchId)

    if (!what) {
        console.warn("[extrude] couldnt find suitable path to extrude")
        return;
    }

    //Use compiled sketch?
    if (!what.data._path) what.data._path = what.data.path

    let shape = PathToShape(what.data._path)

    //Extrude
    //Default Extrude Settings
    _data.bevelSize = _data.bevelSize || 0

    let extrudeSettings = _data || { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0, bevelThickness: 1 };
    let color = 0x8080f0
    let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color }))

    object3d.add(mesh)

    //var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
    //extrude(shape, _extrudeSettings, 0x8080f0, 0, 0, 0, 0, 0, 0, 1);
}


//CSG <-> THREE
function doExtrude(shape, extrudeSettings, color, x, y, z, rx, ry, rz, s) {
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color }));
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.scale.set(s, s, s);
    object3d.add(mesh);
}