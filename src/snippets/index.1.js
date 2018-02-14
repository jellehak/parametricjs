/*

CAD kernel for Y3D

*/
//var a = eval("x=1;y=2;x * y");
//console.log(a)

export default YCAD

//A Part
function YCAD(_cad) {
    //Public
    this.render = render
    this.change = change
    this.show = show
    this.hide = hide
        //Private 
    var cad = _cad
    var object3d = new THREE.Object3D;

    scene.add(object3d)

    function show(what) { return this; }

    function hide(what) { return this; }

    //Use to change a parameter
    function change(varname, value) {
        //Set
        cad.parameters.variables[varname] = value

        //Recompile
        var _compiled = ""

        //Method 1
        for (k in cad.parameters.variables) {
            value = cad.parameters.variables[k]
            _compiled += k + "=" + value + ";"
        }

        //Method 2
        //_compiled = JSON.stringify(cad.parameters.variables);
        //_compiled = _compiled.slice(1, -1);
        //_compiled = _compiled.replace(/:/g, "=");
        console.log(_compiled)

        //feature
        cad.parameters._compiled = _compiled || "height=10;width=3;thickness=1";

        //Remove old render
        console.log(object3d)
        object3d.children.splice(0, 1);

        //Render again
        render()
    }

    //Helper
    function isString(x) {
        return x !== null && x !== undefined && x.constructor === String
    }

    function compile(what) {
        var _eval = cad.parameters._compiled + "\n" + what
            //console.log(_eval)
        return eval(_eval);
    }

    function render() {
        //DEV code -  YCAD Engine
        for (let k in cad.features) {
            let feature = cad.features[k]
                //console.log(feature)
                //console.log(feature.data)

            if (feature.suppress) continue;

            switch (feature.type) {
                case 'plane':
                    //var color = 0x8080f0

                    let plane = new THREE.Mesh(
                        new THREE.PlaneGeometry(10, 10),
                        new THREE.MeshPhongMaterial({ color: 0x0000ff, transparent: true, opacity: 0.2 }));
                    plane.doubleSided = true;
                    //plane.position.x = 100;
                    //plane.rotation.z = 2;  // Not sure what this number represents.
                    scene.add(plane);
                    break;
                case 'render':
                    break;
                case 'path':
                    y3d.path(feature.data.path)
                    break;
                case 'sketch':
                    let path = feature.data.path;
                    feature.data._path = Array()

                    //Create rendered sketch
                    feature.data.path2 = Array();
                    for (let k2 in path) {
                        let point = path[k2]
                        let _point = { x: point.x, y: point.y }

                        //Process macro
                        if (isString(point.x)) {
                            _point.x = compile(point.x)
                        }
                        if (isString(point.y)) {
                            _point.y = compile(point.y)
                        }

                        feature.data._path.push(_point)
                    }
                    break;
                case 'line':
                    //Add points to scene
                    let p1 = feature.data.path[0]
                    let p2 = feature.data.path[1]
                    y3d.line(p1, p2)
                    break;

                case 'extrude':
                    feature.data._settings = feature.data.settings
                    let extrudeSettings = feature.data.settings
                    let _extrudeSettings = Object.create(feature.data._settings)

                    //Compile Extrude settings?
                    _extrudeSettings.amount = compile(extrudeSettings.amount);

                    console.log("Extrude using ", feature, extrudeSettings, _extrudeSettings)

                    let what = getFeatureById(feature.data.sketchId)


                    if (!what) {
                        console.warn(`[extrude] sketchId : ${feature.data.sketchIdwhat} not found`)
                        break;
                    }
                    //Use compiled sketch?
                    if (!what.data._path) what.data._path = what.data.path

                    let shape = PathToShape(what.data._path)

                    //var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
                    extrude(shape, _extrudeSettings, 0x8080f0, 0, 0, 0, 0, 0, 0, 1);
                    break;



                default:
                    console.log("Unknown feature: ", feature.type)
            }
        }
    }




    /*
    [
                        { x: 0, y: 0 },
                        { x: 10, y: 0 },
                        { x: 10, y: 10},
                        { x: 0, y: 10 },
                        { x: 0, y: 0 } //close
                    ] =>
        var triangleShape = new THREE.Shape();
        triangleShape.moveTo(80, 20);
        triangleShape.lineTo(40, 80);
        triangleShape.lineTo(120, 80);
        triangleShape.lineTo(80, 20); // close path
    */
    function PathToShape(path) {
        var shape = new THREE.Shape();
        shape.moveTo(path[0].x, path[0].y);
        for (k in path) {
            p = path[k]
            shape.lineTo(p.x, p.y);
        }
        shape.lineTo(path[0].x, path[0].y); //Close
        return shape;
    }


    function getFeatureById(id) {
        for (k in exports.features) {
            let feature = exports.features[k]
            if (feature.id == id) return feature;
        }
        return false;
    }



    function extrude(shape, extrudeSettings, color, x, y, z, rx, ry, rz, s) {
        var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color }));
        mesh.position.set(x, y, z);
        mesh.rotation.set(rx, ry, rz);
        mesh.scale.set(s, s, s);
        object3d.add(mesh);
    }
}