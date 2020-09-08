import { uid, getFeatureById } from './helpers/helpers'
const { THREE } = window

const FEATURE = {
  id: '',
  type: '',
  name: '',
  props: {},
  // Internals
  $shapes: [],
  $root: {
    camera: {}
  },
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
export default class Feature {
  constructor (_feature = FEATURE) {
    // # Get props
    const { props = {} } = _feature
    const propsArray = Object.entries(props).map(([key, value]) => ({ key, ...value }))

    // # Set prop defaults
    const defaults = getDefaultProps(propsArray)

    // Merge
    Object.assign(this,
      {
        shapes: [],
        ...defaults, // Set defaults
        // ...feature
        ...FEATURE,
        id: uid(),
        name: _feature.type,
        ..._feature
      })
  }

  // ===========
  // # Methods
  // ===========
  getShapes () {
    return this.shapes
    // return this.$shapes
  }

  /**
   * Tries to return a shape of this feature if exist
   */
  getShape () {
    const shapes = this.getShapes()
    return shapes ? shapes[0] : null
  }

  getMaterial (name = '') {
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
  destroy () {
    const fn = this.feature.destroy
    return fn.bind(this)()
  }

  /**
   * Call Feature render function
   * @param {[]} previousFeatures
   */
  callRender (previousFeatures = []) {
    // Validation
    validateProps(this.feature)(this.propsArray)

    // Resolve entity
    const getEntity = (mixed = '') => {
      console.log('getEntity search for ', mixed)

      if (!mixed) {
      // console.warn('')
        return
      }
      // const SPECIALS = {
      //   $all: () => livePart,
      //   $previous: () => {
      //     const index = livePart.children.length - 1
      //     return livePart.children[index]
      //   }
      // }

      // // special like $all, ..
      // const isSpecial = SPECIALS[mixed]
      // if (isSpecial) {
      //   return isSpecial()
      // }

      return getFeatureById(mixed, previousFeatures)
    }

    // Sugar for return function
    const scene = new THREE.Object3D()
    scene.name = 'feature-scene'

    // # Render context
    const context = {
      ...this,

      // Expose $root
      camera: this.$root.camera,
      container: this.$root.container,
      renderer: this.$root.renderer,

      scene,

      getEntity,
      // Resolve entities
      getEntities (mixed = []) {
        console.log(mixed)

        if (!mixed) {
          console.warn('No input for getEntities')
          return null
        }

        // const isArray = mixed.length
        // if (!isArray) {
        //   console.warn(mixed)
        //   throw new Error(`Input should be an array provided ${typeof mixed}`)
        // }

        return mixed.map(entity => {
          return getEntity(mixed)
        })
      },

      getMaterial: this.getMaterial,
      getShape: this.getShape,
      THREE,
      getFeatureById (id) {
        return getFeatureById(id, previousFeatures)
      }
    }

    // # Call render function
    const fn = this.render
    const resp = fn.bind(this)(context) || scene

    // console.log(resp)

    // Validation
    // if (!resp) {
    //   throw new Error(`Render function of feature "${this.name}" returns nothing`)
    // }

    // Extract info from render
    if (resp && resp.type === 'Shape') {
      // console.log('Shape found', resp)
      this.shapes.push(resp)
    }

    // Return Object3D
    return resp
    // return resp || new THREE.Object3D()
  }
}
