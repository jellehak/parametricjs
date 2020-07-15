/**
 * Function to validate props and set defaults of a Feature
 * @param {*} featureHandler
 * @param {*} feature
 */
export default function Feature (handler = {}, feature = {}) {
  // # Validation
//   if (!handler) {
//     // throw new Error(`No handler found for feature: "${type}"`)
//   }
  if (!handler.render) {
    throw new Error(`No render function found for feature: "${handler.type}"`)
  }

  // # Validate props
  const { props = {} } = handler
  const propsArray = Object.entries(props).map(([key, value]) => ({ key, ...value }))
  // Validation: required props
  const requiredProps = propsArray.filter(elem => elem.required === true)
  requiredProps.map(elem => {
    if (!feature[elem.key]) {
      console.warn(feature)
      throw new Error(`Feature property "${elem.key}" is required`)
    }
  })

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

  // # Attach render function
  const { render } = handler
  this.render = render.bind(this)
}
