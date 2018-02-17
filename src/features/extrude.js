import PathToShape from '../helpers/PathToShape'

export default function extrude(input) {
    const { ycad, cadData, scene, feature, object3d } = input;
    const { compile, getFeatureById } = ycad
    const { selectById, sketchId, settings } = feature
    const { id, settings: extrudeSettings } = feature
    const { amount, bevelEnabled, bevelSegments, steps, bevelSize, bevelThickness } = extrudeSettings

    //Compile parametric fields 
    let _data = Object.create(feature) //Create copy of settings
    _data.amount = compile(amount) //Compile Extrude settings?

    const target = getFeatureById(selectById || sketchId)

    if (!target) {
        console.warn(`[extrude] couldnt find suitable path to extrude`, feature)
        return;
    }

    //Use static sketch or parametric sketch?
    const { path, _path: pathCompiled } = target

    //Get Shape
    const shape = feature._shape || PathToShape(path || pathCompiled)

    //Extrude
    const extrudeSettingsMerged = Object.assign(extrudeSettings, { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0, bevelThickness: 1 })
        //_data || { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0, bevelThickness: 1 };
    const color = 0x8080f0
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettingsMerged)
    const mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color }))

    //Attach mesh to the feature
    mesh.name = `[extrude]${id}`
    feature._mesh = mesh

    object3d.add(mesh)
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