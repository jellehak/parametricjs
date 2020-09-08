import features from './autoload'

// Array
export default Object.entries(features).map(([key, value]) => ({
  name: key, // Default to filename
  ...value
}))

// NOTE no autofixing of name key
export const featuresLookup = features
