  export default

  function Triangle() {
      var triangleShape = new THREE.Shape();
      triangleShape.moveTo(80, 20);
      triangleShape.lineTo(40, 80);
      triangleShape.lineTo(120, 80);
      triangleShape.lineTo(80, 20); // close path

      var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
      addShape(triangleShape, extrudeSettings, 0x8080f0, -180, 0, 0, 0, 0, 0, 1);

      var what = getFeatureById(feature.data.sketchId)
          //Move points
      y3d.path(what.data.path)
      for (k2 in what.data.path) {
          var p = what.data.path[k2]
          p.z = 2;
      }
      y3d.path(what.data.path)
  }
  // Triangle