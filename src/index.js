import Lib from './lib'

export * from './setup'

export function create (args) {
//   console.log('He')
  return new Lib(args)
}

export default Lib

// module.exports = main
// Node compatible
// module.exports = YCAD
