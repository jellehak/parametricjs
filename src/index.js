/*

CAD kernel for Y3D & ThreeJS

TODO: 
- Sanitize EVAL STUFF!!!

*/


export default YCAD
module.exports = YCAD

//import _ from 'lodash'
import csg from "./web/csg"
import ThreeCSG from "./web/ThreeCSG/ThreeCSG"

//Features
import insert from './features/insert'
import plane from './features/plane'
import extrude from './features/extrude'


//Helpers
import PathToShape from './helpers/PathToShape'
import isString from './helpers/isString'


//A Part
function YCAD(_cad) {
    //Private 
    var debug = true
    var cadData = _cad
    var object3d = new THREE.Object3D;
    var self = this

    //Public
    this.render = render
    this.change = change
    this.show = show
    this.hide = hide
    this.compile = compile
    this.getFeatureById = getFeatureById
    this.getPart = getPart
        //this.getFeatureLabelsOneLevel = getFeatureLabelsOneLevel



    function getFeatureById(id) {
        return cadData.features.filter((elem) => { elem.id == id ? elem : false })
            //return _.find(cadData.features, { 'id': id });
    }

    function getPart(id) {
        return cadData.parts.filter((elem) => { elem.id == id ? elem : false })

        // return _.find(cadData.parts, { id: id })
    }

    this.getParameters = function() { return cadData.parameters || {} }

    /*Returns only the labels of the features
        [
            { label: 'Extrude' },
            { label: 'Cut' }
        ]
        */

    this.getFeatureLabels = function() {
        let ret = []
        for (let k in cadData.features) {
            let feature = cadData.features[k]
            let type = feature.type

            //Recursive?
            if (type == 'insert') {
                let part = getPart(feature.data.selectInnerPart)
                let featureLabels = getFeatureLabelsOneLevel(part.features)

                ret.push({ label: part.title, children: featureLabels })
            } else {
                ret.push({ label: feature.type })
            }
        }
        return ret
    }


    function getFeatureLabelsOneLevel(features) {
        let ret = []
        for (let k in features) {
            let feature = features[k]
            ret.push({ label: feature.type })
        }
        return ret
    }

    //Returns only the default values as an object
    this.getParametersDefault = function() {
        let ret = {}
        for (let k in cadData.parameters) {
            ret[k] = cadData.parameters[k].default || cadData.parameters[k]
        }
        return ret
    }

    //Call this function to convert the cad data to a threejs object
    function render() {
        compileParameters() //Make sure cadData._parameters exists

        for (let k in cadData.features) {
            let feature = cadData.features[k]
            if (feature.suppress) continue;
            processFeature(feature)
        }
        return object3d
    }

    //scene.add(object3d)
    function show(what) { return this; }

    function hide(what) { return this; }

    function sanitize() {}

    function compileParameters() {
        //Compile global parameters
        let compiled = ""
        for (let key in cadData.parameters) {
            //let value = cadData.parameters[key]
            let value = getParameter(cadData.parameters[key]).default
            compiled += `let ${key} = ${value};`
        }
        //console.log(cadData.parameters, _compiled)
        //save compile to feature
        cadData._parameters = compiled // || "height=10;width=3;thickness=1";
    }

    //Use to change a parameter
    function change(varname, value) {
        //Set
        cadData.parameters[varname] = value

        //Remove old render?
        //console.log(object3d)
        object3d.children.splice(0, 1)

        //Render again
        render()
    }


    //Makes sure a parameter is always an object with default, min, max props
    function getParameter(parameter) {
        if (typeof parameter === 'object') {
            return parameter
        }
        return { default: parameter, }
    }

    function compile(what) {
        let parameters = `${cadData._parameters}; \n ${what}`

        if (debug) console.log(`Compiling : ${parameters}`)
        return eval(parameters);
    }



    function processFeature(feature) {

        var input = { ycad: self, cadData: cadData, scene: scene, feature: feature, object3d: object3d }

        switch (feature.type) {
            case 'plane':
                plane(input)
                    // //var color = 0x8080f0
                    // let plane = new THREE.Mesh(
                    //     new THREE.PlaneGeometry(10, 10),
                    //     new THREE.MeshPhongMaterial({ color: 0x0000ff, transparent: true, opacity: 0.2 }));
                    // plane.doubleSided = true;
                    // //plane.position.x = 100;
                    // //plane.rotation.z = 2;  // Not sure what this number represents.
                    // scene.add(plane);
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

            case 'insert':
                insert(input)
                break

            case 'extrude':
                extrude(input)
                break

            case 'extrude2':
                let data = feature.data

                //Create Copy and compile
                data._settings = data.settings
                let extrudeSettings = data.settings
                let _extrudeSettings = Object.create(data._settings)

                //Compile
                _extrudeSettings.amount = compile(extrudeSettings.amount);
                //console.log(extrudeSettings.amount, _extrudeSettings.amount)

                let what = getFeatureById(data.selectById || data.sketchId)

                if (!what) {
                    console.warn(`[extrude] sketchId : ${data.sketchId} not found`)
                    break;
                }
                //Use compiled sketch?
                if (!what.data._path) what.data._path = what.data.path

                let shape = PathToShape(what.data._path)

                //var extrudeSettings = { amount: 8, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 1, bevelThickness: 1 };
                extrude(shape, _extrudeSettings, 0x8080f0, 0, 0, 0, 0, 0, 0, 1);
                break;

            default:
                if (debug)
                    console.log("Unknown feature: ", feature.type)
        }
    }



}