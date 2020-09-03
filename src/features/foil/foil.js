/*
Based on info from:
http://airfoiltools.com/airfoil/details?airfoil=naca0006-il
https://cad.onshape.com/documents/4bf18c75321ea2c8c2ea770d/w/978aece63f59e09169309756/e/b319e7a87bba701e3e02a0fa
https://cad.onshape.com/documents/58617bcbcec3fd1081e6dda0/w/14c073fff5640d9c20af40b5/e/678fab6c3565fbb965a41b12
*/
// import csv from './csv/dae_11.csv'

const csv = `1,0
0.986483,0.002538
0.970008,0.005615
0.947875,0.010045
0.918609,0.01638
0.887967,0.023564
0.857951,0.031128
0.82795,0.039152
0.79778,0.047605
0.767351,0.056417
0.736604,0.065502
0.705653,0.074738
0.675223,0.08372
0.645437,0.092205
0.616266,0.099991
0.587581,0.106907
0.559141,0.112838
0.530681,0.117774
0.502047,0.121778
0.473223,0.124888
0.444274,0.127109
0.415255,0.128434
0.386183,0.12885
0.357092,0.128382
0.328056,0.127043
0.299149,0.124802
0.270425,0.121658
0.24194,0.117585
0.213791,0.112558
0.186118,0.106551
0.159095,0.09954
0.132934,0.091527
0.107915,0.082517
0.084408,0.072565
0.062879,0.061804
0.043966,0.05054
0.028364,0.0393
0.016496,0.028727
0.008293,0.019335
0.003292,0.011468
0.000757,0.005143
0,0
0.000492,-0.003486
0.002012,-0.006428
0.004415,-0.008791
0.008086,-0.0107
0.014115,-0.012375
0.024573,-0.013878
0.041451,-0.014889
0.064895,-0.015066
0.092608,-0.014462
0.122584,-0.013293
0.153678,-0.011747
0.185384,-0.009967
0.21745,-0.008052
0.249739,-0.006069
0.282172,-0.004061
0.314611,-0.002068
0.346965,-0.000119
0.37924,0.001752
0.411434,0.003536
0.443554,0.0052
0.475605,0.006734
0.507575,0.008115
0.539469,0.009304
0.571312,0.010285
0.603112,0.011045
0.634882,0.01157
0.666635,0.011866
0.698376,0.011931
0.730101,0.011773
0.761789,0.011393
0.793421,0.010774
0.824998,0.0099
0.856562,0.008759
0.888329,0.007331
0.920015,0.005614
0.947994,0.003868
0.969651,0.00235
0.986283,0.001077
1,0`

const CSVToArray = (strData, strDelimiter) => {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ',')

  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp(
    (
    // Delimiters.
      '(\\' + strDelimiter + '|\\r?\\n|\\r|^)' +

          // Quoted fields.
          '(?:"([^"]*(?:""[^"]*)*)"|' +

          // Standard fields.
          '([^"\\' + strDelimiter + '\\r\\n]*))'
    ),
    'gi'
  )

  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [[]]

  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null

  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec(strData)) {
    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1]

    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (
      strMatchedDelimiter.length &&
          strMatchedDelimiter !== strDelimiter
    ) {
      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([])
    }

    var strMatchedValue

    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      strMatchedValue = arrMatches[2].replace(
        new RegExp('""', 'g'),
        '"'
      )
    } else {
      // We found a non-quoted value.
      strMatchedValue = arrMatches[3]
    }

    // Now that we have our value string, let's add
    // it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue)
  }

  // Return the parsed data.
  return (arrData)
}

export default {
  name: 'foil',

  props: {
    profile: {
      type: 'enum',
      items: [
        'dae_11',
        'doa5-il'
      ]

    }
  },

  render ({ THREE }) {
    const materials = {
      normal: new THREE.LineBasicMaterial({ color: 0x000000 })
    }

    const path = CSVToArray(csv)
    // console.log(path)

    var points = []
    path.forEach(elem => {
      points.push(new THREE.Vector3(elem[0], elem[1], 0))
    })

    // # Create mesh
    console.log(points)
    var geometry = new THREE.BufferGeometry().setFromPoints(points)
    var lines = new THREE.Line(geometry, materials.normal)
    lines.name = 'lines'

    // Return lines
    return lines
  }

}
