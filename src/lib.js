// import build from '../package.json'
// Features
import * as features from './features'
import settings from './settings'
import { slugify } from './helpers/slugify'
import ThreeBSP from './web/ThreeCSG/ThreeCSG.es6'

const {THREE} = window

export default function ({ cad, scene }) {
// const name = 'ParametricJS'
  // console.log(`${name} [version ${build.version}]`, features)

  // Private
  var debug = false
  var cadData = cad
  let object3d = new THREE.Object3D()
  const self = this

  // Public
  Object.assign(this, {
    render,
    change,
    compile,
    getFeatureById,
    getPartById,
    getParametersDefault,
    getParameters,
    getFeatureLabels,
    settings
    // update
  })

  // TODO -- better performance with delta updates?
  // function update (_cadData) {
  //   cadData = _cadData
  //   return render()
  // }

  function render (_cadData = false) {
    if (_cadData) {
      cadData = _cadData
    }

    // Full rerender
    object3d = new THREE.Object3D()

    if (!cadData) { return console.warn('No CadData') }

    // Compile global cad parameters (adds cadData._parameters)
    compileParameters()

    const { features } = cadData
    features.map((feature, key) => {
      if (feature.suppress) {
        return
      }
      const { mesh } = processFeature(feature) || {}

      // Add mesh to object3d aka the part
      if (mesh) {
        object3d.add(mesh)
      }
    })

    object3d.name = slugify(cadData.name) || slugify(cadData.title) || 'unnamed'

    return object3d
  }

  function getFeature (feature) {
    const { type } = feature
    return features[type] || false

    // Future?
    // return features.filter((elem, key) => { return (key == type) ? elem : false })
  }

  function processFeature (feature = {}) {
    const { type } = feature
    const payload = { ycad: self, ThreeBSP, cadData, scene, feature, object3d }

    // console.log(feature)

    // Find handler according to type
    const handler = getFeature(feature)

    if (!handler) {
      console.log(`Unknown feature: "${type}"`)
      // TODO Perhaps a Y3D handler?
      return // y3d.add(feature)
    }

    // Execute
    try {
      let mesh = handler(payload) || {}
      mesh.name = mesh.name || type
      return mesh
    } catch (err) {
      console.warn(err)
    }
  }

  function getFeatureById (id) {
    return cadData.features.filter((elem) => { return elem.id === id ? elem : false })[0]
  }

  function getPartById (id) {
    if (!cadData.parts) {
      console.warn(`No sub part defined`)
      return false
    }
    return cadData.parts.filter((elem) => { return elem.id === id ? elem : false })[0]
  }

  function getParameters () { return cadData.parameters || {} }

  function getFeatureLabels () {
    let ret = []
    for (let k in cadData.features) {
      let feature = cadData.features[k]
      let type = feature.type

      // TODO Recursive?
      if (type === 'insert') {
        let part = getPartById(feature.data.selectInnerPart)
        let featureLabels = getFeatureLabelsOneLevel(part.features)
        ret.push({ label: part.title, children: featureLabels })
      } else {
        ret.push({ label: feature.type })
      }
    }
    return ret
  }

  function getFeatureLabelsOneLevel (features) {
    let ret = []
    for (let k in features) {
      let feature = features[k]
      ret.push({ label: feature.type })
    }
    return ret
  }

  // Returns only the default values as an object
  function getParametersDefault () {
    let ret = {}
    for (let k in cadData.parameters) {
      ret[k] = cadData.parameters[k].default || cadData.parameters[k]
    }
    return ret
  }

  function compileParameters () {
    if (!cadData) { return console.warn('No CadData') }
    let compiled = ''
    const { parameters } = cadData

    parameters || [].map((elem, key) => {
      const value = parameters[key]
      compiled += `let ${key} = ${value};`
    })

    // save compile to feature
    cadData._parameters = compiled // || "height=10;width=3;thickness=1";
    return compiled
  }

  // Use to change a parameter
  function change (varname, value) {
    // Set
    cadData.parameters[varname] = value

    // Remove old render?
    object3d.children.splice(0, 1)

    // Render again
    render()
  }

  // Makes sure a parameter is always an object with default, min, max props
  // function getParameter (parameter) {
  //   if (typeof parameter === 'object') {
  //     return parameter
  //   }
  //   return { default: parameter }
  // }

  function compile (what) {
    let parameters = `
      let throughall = 1000;
      ${cadData._parameters}; \n 
      ${what}
      `

    if (debug) console.log(`Compiling : ${parameters}`)
    return eval(parameters)
  }
}
