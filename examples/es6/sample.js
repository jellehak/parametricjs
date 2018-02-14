export default {
    "title": "Simple box",
    "features": [{
        "id": "box",
        "type": "sketch",
        "data": {
            "plane": "front",
            "path": [{
                "x": 0,
                "y": 0
            }, {
                "x": 4,
                "y": 0
            }, {
                "x": 4,
                "y": 4
            }, {
                "x": 0,
                "y": 4
            }, {
                "x": 0,
                "y": 0
            }]
        }
    }, {
        "type": "extrude",
        "data": {
            "selectById": "box",
            "settings": {
                "amount": 10
            }
        }
    }]
}