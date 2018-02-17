const cadData = {
    title: 'Simple box',
    features: [{
        id: 'box',
        type: 'sketch',
        plane: 'front',
        path: [{
            x: 0,
            y: 0
        }, {
            x: 4,
            y: 0
        }, {
            x: 4,
            y: 4
        }, {
            x: 0,
            y: 4
        }, {
            x: 0,
            y: 0
        }]
    }, {
        type: 'extrude',
        selectById: 'box',
        settings: {
            amount: 4
        }
    }]
}


const {
    scene,
    add
} = y3d.setup({
    camera: {
        x: 100,
        y: 100,
        z: 100
    },
    size: "1 unit = 1 mm",
    background: "#fff"
})
add({
    type: 'axis'
})

let part = new YCAD({ cad: cadData, scene: scene })
scene.add(part.render())