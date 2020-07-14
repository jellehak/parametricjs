const fromEntries = (iterable) => [...iterable].reduce((obj, [key, val]) => {
  obj[key] = val
  return obj
}, {})

/**
 * Autoload from /modules
*/
// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
  './', // Look for files in the @/components directory
  true, // include subdirectories
  // Only include "_base-" prefixed .vue files
  //   /_base-[\w-]+\.vue$/
  //   /[\w-]+\.vue$/
  /\.js$/
)
const entries = requireComponent.keys().map(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName =
        fileName
          .replace(/^.*[\\/]/, '') // Remove path
          .replace(/\.\w+$/, '') // Remove extension
  return [
    componentName,
    componentConfig.default || componentConfig
  ]
})

export default fromEntries(entries)
