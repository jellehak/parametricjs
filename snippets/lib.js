// Features
import * as features from './features'
import settings from './settings'
import { slugify } from './helpers/slugify'
import ThreeBSP from './web/ThreeCSG/ThreeCSG.es6'

const { THREE } = window

export default function (cad = {}) {
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
  })

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
    const payload = { ycad: self, ThreeBSP, cadData, feature, object3d }

    // console.log(feature)

    // Find handler according to type
    const handler = getFeature(feature)

    if (!handler) {
      console.warn(`Unknown feature: "${type}"`)
      // TODO Perhaps a Y3D handler?
      return // y3d.add(feature)
    }

    // Execute
    try {
      const mesh = handler(payload) || {}
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
    const ret = []
    for (const k in cadData.features) {
      const feature = cadData.features[k]
      const type = feature.type

      // TODO Recursive?
      if (type === 'insert') {
        const part = getPartById(feature.data.selectInnerPart)
        const featureLabels = getFeatureLabelsOneLevel(part.features)
        ret.push({ label: part.title, children: featureLabels })
      } else {
        ret.push({ label: feature.type })
      }
    }
    return ret
  }

  function getFeatureLabelsOneLevel (features) {
    const ret = []
    for (const k in features) {
      const feature = features[k]
      ret.push({ label: feature.type })
    }
    return ret
  }

  // Returns only the default values as an object
  function getParametersDefault () {
    const ret = {}
    for (const k in cadData.parameters) {
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

  function compile (what) {
    const parameters = `
      let throughall = 1000;
      ${cadData._parameters}; \n 
      ${what}
      `

    if (debug) console.log(`Compiling : ${parameters}`)
    return eval(parameters)
  }
}
