import PathToShape from '../helpers/PathToShape'

export default function extrude(input) {
    const { ycad, cadData, scene, compile, feature, object3d } = input;
    // feature.data._settings = feature.data.settings
    let extrudeSettings = feature.settings
        // let _extrudeSettings = Object.create(feature.data._settings)

    //Compile Extrude settings?
    _extrudeSettings.amount = ycad.compile(extrudeSettings.amount);

    console.log("Extrude using ", feature, extrudeSettings, _extrudeSettings)

    let what = getFeatureById(feature.data.sketchId)

    console.log(`Extrude ${what}`)
    if (!what) {
        return;
    }

    //Use compiled sketch?
    if (!what.data._path) what.data._path = what.data.path

    let shape = PathToShape(what.data._path)

    const mesh = extrude(shape, _extrudeSettings, 0x8080f0, 0, 0, 0, 0, 0, 0, 1)
    object3d.add(mesh);
}


//CSG <-> THREE
function extrude(shape, extrudeSettings, color, x, y, z, rx, ry, rz, s) {
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color }));
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.scale.set(s, s, s);
    return mesh
}