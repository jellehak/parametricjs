import { uid, createParseEntity, getFeatureById, getFeatureHandlerById } from './helpers/helpers'
const { THREE } = window

const FEATURE = {
  id: '',
  type: '',
  name: '',
  props: {},
  // Internals
  $shapes: [],
  // Methods
  render () { },
  destroy () { }
}

const validateProps = feature => (propsArray = []) => {
  const requiredProps = propsArray.filter(elem => elem.required === true)
  requiredProps.map(elem => {
    if (!feature[elem.key]) {
      throw new Error(`Feature property "${elem.key}" is required for feature "${elem.name}"`)
    }
    return feature[elem.key]
  })
}

/**
 * Function
 * @param {array} propsArray
 */
const getDefaultProps = (propsArray = []) => {
  return Object.fromEntries(
    propsArray.map(elem => {
      // console.log(elem.defaults)
      return [
        elem.key,
        typeof elem.default === 'function'
          ? elem.default()
          : elem.default
      ]
    })
  )
}

/**
 * Function to validate props and set defaults of a Feature
 * @param {*} featureHandler
 * @param {*} feature
 */
export default function Feature (_feature = FEATURE) {
  console.log(_feature)

  // Merge with defaults
  const feature = {
    id: uid(),
    ...FEATURE,
    name: _feature.type,
    ..._feature
  }
  // console.log(feature)

  // # Validate props
  const { props = {} } = feature
  const propsArray = Object.entries(props).map(([key, value]) => ({ key, ...value }))

  // # Set all prop defaults
  const defaults = getDefaultProps(propsArray)

  // Merge
  Object.assign(this,
    {
      ...defaults, // Set defaults
      ...feature
    })

  // # Validation
  if (!feature.render) {
    throw new Error(`No render function found for feature: "${feature.name}"`)
  }

  // ===========
  // # Methods
  // ===========
  /**
   * Tries to return the shape a this feature if exist
   */
  this.getShape = () => {
    // MOCK
    // var length = 3
    // var width = 3

    // var shape = new THREE.Shape()
    // shape.moveTo(0, 0)
    // shape.lineTo(0, width)
    // shape.lineTo(length, width)
    // shape.lineTo(length, 0)
    // shape.lineTo(0, 0)
    // return shape
    return this.$shapes ? this.$shapes[0] : null
  }

  this.getMaterial = (name = '') => {
    // const found = parametric.materials[name]
    // if (!found) {
    //   console.warn(parametric.materials)
    //   throw new Error(`Material not found: ${name}`)
    // }
    // return found
    return new THREE.LineBasicMaterial({ color: new THREE.Color('blue') })
  }

  // ===========
  // # Lifecylces
  // ===========

  /**
   * destroy function
   */
  this.destroy = () => {
    // # Call function if exist
    const fn = feature.destroy
    return fn.bind(this)()
  }

  /**
   * Call Feature render function
   * @param {[]} previousFeatures
   */
  this.render = (previousFeatures = []) => {
    // Validation
    validateProps(feature)(propsArray)
    // console.log(validation)

    // # Render context
    const context = {
      ...this,
      THREE,
      getFeatureById (id) {
        return getFeatureById(id, previousFeatures)
      }
    }

    // # Call render function
    const fn = feature.render
    const resp = fn.bind(this)(context)

    if (resp.type === 'Shape') {
      console.log('Shape found', resp)
      this.$shapes.push(resp)
    }

    // Return Object3D
    return resp || new THREE.Object3D()
  }
}
