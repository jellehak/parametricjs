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

  /**
     *
     * @param {*} entities
     */
  const getEntities = (entities = []) => {
    // console.log(parametric.featureMeshLookup)
    const parserFn = createParseEntity({
      livePart,
      featureMeshLookup: parametric.featureMeshLookup // HACKY
    })

    const resp = entities.map(parserFn)

    return resp
  }

  // # Context for a feature
  const context = {
    // # Lifecycle / events
    onFrame: (cb) => {

    },

    // Register Destroy LifeCycle hook
    destroy: (cb) => {
      this.destroy = cb
    },
    scene,
    feature, // Deprecate ?
    THREE,
    createModelLoader: loader => (url) => {
      return new Promise((resolve, reject) => {
        loader.load(url, data => resolve(data), null, reject)
      })
    },
    // previousState: livePart, // TODO DEPRECATE in favor for `livePart`
    // livePart,
    raycaster: new THREE.Raycaster(),
    getFeatureHandlerById: getFeatureHandlerById(features),
    compile: () => {
      // TODO
    },

    getPathFromFeature (feature = {}) {

    },
    getFeatureById (id) {
      return getFeatureById(id, features)
    },

    // # Attach only when parametric is set
    ...parametric ? {
      // Only return the meshes
      parseEntities: (entities = []) => {
        const systemNodes = getEntities(entities) // DEPRECATE
        // console.log(systemNodes)
        return systemNodes.map(elem => elem._mesh)
      },
      getMaterial: (name = '') => {
        // const found = parametric.materials.find(elem => elem.name === name)
        const found = parametric.materials[name]
        if (!found) {
          console.warn(parametric.materials)
          throw new Error(`Material not found: ${name}`)
        }
        return found
      },
      addEventListener: parametric.renderer.domElement.addEventListener,
      rootScene: parametric.scene,
      mouse: parametric.mouse,
      getMouse: () => {
        return parametric.mouse
      },
      camera: parametric.camera
    } : {}
  }

  // # Attach render function
  this.render = (livePart) => {
    // # Validate props
    const { props = {} } = handler
    const propsArray = Object.entries(props).map(([key, value]) => ({ key, ...value }))

    // TODO Validation: required props
    const requiredProps = propsArray.filter(elem => elem.required === true)
    requiredProps.map(elem => {
      if (!feature[elem.key]) {
        console.warn(`Feature property "${elem.key}" is required`)
        throw new Error(`Feature property "${elem.key}" is required`)
      }
      return feature[elem.key]
    })
    // console.log(validation)

    // # Get all prop defaults
    const defaults = Object.fromEntries(
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
    // console.log('defaults props', defaults)

    // Set properties to allow: E.g. ```this.entities = ['cutsketch']```
    Object.assign(this, defaults, feature)

    // Mock scene
    const scene = new THREE.Object3D()

    // # Call render function
    const fn = handler.render
    const resp = fn.bind(this)(context)

    return resp || scene
  }
}
