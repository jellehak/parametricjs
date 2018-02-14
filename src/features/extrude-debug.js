function extrude(input) {
    let { ycad, cadData, scene, compile, feature, object3d } = input;


    // feature.data._settings = feature.data.settings
    // let extrudeSettings = feature.data.settings
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

    //var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
    extrude(shape, _extrudeSettings, 0x8080f0, 0, 0, 0, 0, 0, 0, 1);
}


//CSG <-> THREE
function extrude(shape, extrudeSettings, color, x, y, z, rx, ry, rz, s) {
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color }));
    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.scale.set(s, s, s);
    object3d.add(mesh);
}