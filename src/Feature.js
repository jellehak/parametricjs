import { createParseEntity, getFeatureById, getFeatureHandlerById } from './helpers'
const { THREE } = window

/**
 * Function to validate props and set defaults of a Feature
 * @param {*} featureHandler
 * @param {*} feature
 */
export default function Feature (handler = {}, feature = {}, parametric = null, features = []) {
  // # Validation
  if (!handler.render) {
    console.warn(handler)
    throw new Error(`No render function found for feature: "${handler.name}"`)
  }

  // # Lifecylces
  this.destroy = () => {
    const fakeFn = () => {
      // console.warn('no destroy fn')
    }
    // # Call function if exist
    const fn = handler.destroy || fakeFn
    return fn.bind(this)()
  }

  const validateProps = (propsArray = []) => {
    const requiredProps = propsArray.filter(elem => elem.required === true)
    requiredProps.map(elem => {
      if (!feature[elem.key]) {
        console.warn(`Feature property "${elem.key}" is required`)
        throw new Error(`Feature property "${elem.key}" is required`)
      }
      return feature[elem.key]
    })
  }

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

  // # Attach render function
  this.render = (previousFeatures = []) => {
    // # Validate props
    const { props = {} } = handler
    const propsArray = Object.entries(props).map(([key, value]) => ({ key, ...value }))

    // TODO Validation: required props
    validateProps(propsArray)
    // console.log(validation)

    // # Get all prop defaults
    const defaults = getDefaultProps(propsArray)

    // console.log('defaults props', defaults)

    // Set properties to allow: E.g. ```this.entities = ['cutsketch']```
    Object.assign(this, defaults, feature)

    // Mock scene
    const scene = new THREE.Object3D()

    // # Call render function
    const fn = handler.render
    const resp = fn.bind(this)({
      THREE,
      getPathFromFeature (feature = {}) {
        console.log('previousFeatures', previousFeatures)
        // TODO
        return previousFeatures.children[0]
      },
      getFeatureById (id) {
        return getFeatureById(id, features)
      },
      getMaterial: (name = '') => {
        // const found = parametric.materials.find(elem => elem.name === name)
        const found = parametric.materials[name]
        if (!found) {
          console.warn(parametric.materials)
          throw new Error(`Material not found: ${name}`)
        }
        return found
      }
    })

    return resp || scene
  }
}
