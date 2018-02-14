import Part from "../index"

export default function insert(input) {
    let { ycad, cadData, feature, object3d } = input;
    //console.log(ycad)

    let partData = ycad.getPart(feature.data.selectInnerPart)
    let part = new Part(partData)
    let obj3d = part.render()

    //Translate?
    let translate = feature.data.translate
    console.log(feature.data)
    if (translate) {
        let { x, y, z } = translate
        console.log(translate)
        obj3d.position.set(x, y, z)
    }

    scene.add(obj3d)
}