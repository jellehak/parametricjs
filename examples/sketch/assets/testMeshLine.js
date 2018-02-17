const color = 0x000000

export default function testMeshLine() {
    var geometry = new THREE.Geometry();
    for (var j = 0; j < Math.PI; j += 2 * Math.PI / 100) {
        var v = new THREE.Vector3(Math.cos(j), Math.sin(j), 0)
        geometry.vertices.push(v)
    }

    var line = new MeshLine()
    line.setGeometry(geometry)
    var material = new MeshLineMaterial({
        color: new THREE.Color(color)
    })
    var mesh = new THREE.Mesh(line.geometry, material)
    scene.add(mesh)
}