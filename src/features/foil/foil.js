/*
Based on info from:
http://airfoiltools.com/airfoil/details?airfoil=naca0006-il
https://cad.onshape.com/documents/4bf18c75321ea2c8c2ea770d/w/978aece63f59e09169309756/e/b319e7a87bba701e3e02a0fa
https://cad.onshape.com/documents/58617bcbcec3fd1081e6dda0/w/14c073fff5640d9c20af40b5/e/678fab6c3565fbb965a41b12
*/
// import csv from './csv/dae_11.csv'
import profiles from './data/index.js'
import { CSVToArray } from './utils.js'

export default {
  name: 'foil',

  props: {
    profile: {
      type: 'enum',
      label: 'Profile',
      items: [
        'dae_11',
        'doa5-il'
      ],
      default: 'doa5-il'
    },
    cord: {
      type: 'number',
      default: 1
    }
  },

  render ({ THREE }) {
    /**
     * Converts an array of THREE.Vector3 to THREE.Shape
     * @param {*} path
     */
    const convertVectorsToShape = (path = []) => {
      const shape = new THREE.Shape()
      path.forEach(nextPoint => {
        shape.lineTo(Number(nextPoint.x), Number(nextPoint.y))
      })
      return shape
    }

    // Get points
    const csv = profiles[this.profile]

    const path = CSVToArray(csv)

    // Create array of Points
    var points = []
    path.forEach(elem => {
      points.push(new THREE.Vector3(elem[0], elem[1], 0))
    })

    // Group points in a THREE.Shape
    const shape = convertVectorsToShape(points)

    return shape
  }

}