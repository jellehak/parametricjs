export const uid = () => {
  return 'xxxxxxxx-xxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0; var v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const getFeatureHandler = (features = []) => (name = '') => {
  const found = features[name]
  // console.log(name, found, features)

  return found || false
}

export const clearThreeScene = (obj3d = {}) => {
  while (obj3d.children.length > 0) {
    obj3d.remove(obj3d.children[0])
  }
}

export const createObject = (settings, Type = THREE.Object3D) => {
  const obj = new Type()
  return Object.assign(obj, settings)
}

export const computeMouseXY = (domElement = window) => (e = {}) => {
  // return {
  //   x: (e.clientX / window.innerWidth) * 2 - 1,
  //   y: -(e.clientY / window.innerHeight) * 2 + 1
  // }
  const element = domElement.getBoundingClientRect() // renderer.domElement.getBoundingClientRect()
  const { left, top, width, bottom } = element
  return {
    x: ((e.clientX - left) / (width - left)) * 2 - 1,
    y: -((e.clientY - top) / (bottom - top)) * 2 + 1
  }
}

export const compileParameters = (parameters = []) => {
  const code = parameters || [].map((elem, key) => {
    const value = parameters[key]
    return `let ${key} = ${value};`
  }).join('\n')

  // cache compiled parameters
  // cadData._parameters = code // || "height=10;width=3;thickness=1";
  // Return
  return code
}

export const compile = (_parameters = '') => (what = '') => {
  const parameters = `
      let throughall = 1000;
      ${_parameters}; \n 
      ${what}
      `

  // eslint-disable-next-line no-eval
  return eval(parameters)
}

export const getFeatureHandlerById = (features = []) => (id = '') => {
  return features.filter((elem) => { return elem.id === id ? elem : false })[0]
}

export const getFeatureById = (id, source = []) => {
  const found = source.find((elem) => { return elem.id === id })
  if (!found) {
    console.warn('source', source)
    console.warn('id', id)
    throw new Error(`Could not find feature by id: ${id}`)
  }
  return found
}

/**
 * Convert an entity to THREE
 * 'human' => THREE.Object
 * @param {*} entities
 */
// export const createParseEntity = ({ livePart, featureMeshLookup }) => mixed => {
//   const SPECIALS = {
//     $all: () => livePart,
//     $previous: () => {
//       const index = livePart.children.length - 1
//       return livePart.children[index]
//     }
//   }

//   // special like $all, ..
//   const isSpecial = SPECIALS[mixed]
//   if (isSpecial) {
//     return isSpecial()
//   }

//   // or just an id
//   const feature = getFeatureById(mixed, featureMeshLookup)
//   return feature
// }
