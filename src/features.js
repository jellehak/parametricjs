import features from './autoload'

export default Object.entries(features).map(([key, value]) => ({
  name: key, // Default to filename
  ...value
}))
