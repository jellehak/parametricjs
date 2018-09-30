/*
 {
        type: 'pattern',
        selectById: 'extrude1',
        settings: {
            times: 4,
            direction: [10, 0, 0]
        }
    }
*/

export default function pattern ({ ycad, cadData, scene, feature, object3d }) {
  const { compile, getFeatureById } = ycad
  const { selectById, sketchId, settings } = feature
  const { times, direction } = settings
  const [x, y, z] = direction

  // Get Feature
  const target = getFeatureById(selectById)
  const targetMesh = target._mesh

  // Clone
  for (let i = 0; i < times; i++) {
    // console.log("Creating copy")

    var newMesh = targetMesh.clone()
    newMesh.translateX(x * i)
    newMesh.translateY(y * i)
    newMesh.translateZ(z * i)

    object3d.add(newMesh)
  }

  // Debug
  // console.log(target)
  // console.log("Work in progress")

  // Attach mesh to feature
  feature._mesh = object3d
}
