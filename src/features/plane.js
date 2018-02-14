export default function(input) {
    let { ycad, cadData, scene, feature, object3d } = input;

    //var color = 0x8080f0
    let plane = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshPhongMaterial({ color: 0x0000ff, transparent: true, opacity: 0.2 }));
    plane.doubleSided = true;
    //plane.position.x = 100;
    //plane.rotation.z = 2;  // Not sure what this number represents.
    scene.add(plane);
}