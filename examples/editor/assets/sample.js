export default {
    title: 'Simple Pattern',
    features: [{
            id: 'heart',
            type: 'sketch-array',
            path: [
                ['moveTo', 25, 25],
                ['bezierCurveTo', 25, 25, 20, 0, 0, 0],
                ['bezierCurveTo', 30, 0, 30, 35, 30, 35],
                ['bezierCurveTo', 30, 55, 10, 77, 25, 95],
                ['bezierCurveTo', 60, 77, 80, 55, 80, 35],
                ['bezierCurveTo', 80, 35, 80, 0, 50, 0],
                ['bezierCurveTo', 35, 0, 25, 25, 25, 25]
            ]
        },
        {
            type: 'sphere',
            radius: 10,
        },
        {
            id: 'box',
            type: 'sketch',
            plane: 'top',
            path: [
                { x: 0, y: 0 },
                { x: 4, y: 0 },
                { x: 4, y: 4 },
                { x: 0, y: 4 },
                { x: 0, y: 0 }
            ]
        },
        {
            type: 'extrude',
            id: "extrude1",
            suppress: false,
            selectById: 'box',
            settings: {
                amount: 4
            }
        },
        {
            id: 'cutsketch',
            type: 'sketch',
            path: [
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 2, y: 2 },
                { x: 1, y: 2 },
                { x: 1, y: 1 }
            ]
        },
        {
            id: 'cut',
            type: 'cut',
            selectById: 'cutsketch',
        }
    ]
}