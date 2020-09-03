> ParametricJS is a WebGl parametric kernel library to render json to 3d graphics.

# Roadmap
- [ ] Add basic feature like cut, extrude
- [ ] Add assembly mates
- [ ] Add more advanced features like sweep, loft feature
- [ ] Timing to compilation

# Introduction
This library converts the following json structure to a THREE mesh. We refer to this object as the `FeatureObject`
```js
{
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
        amount: 4
    }]
}
```

# Usage
See the examples folder.

Include the libary 
```html
<div id="viewer"></div>
<script src='/parametric.js'></script>
<script>
    const model = {
        features: [
            {
                type: 'box',
            }
        ]
    }

    // Helper to create threejs scene
    const {scene} = Parametric.setup({
        el: 'app',
        camera: {
            x: 10,
            y: 10,
            z: 10,
        },
    })

    // Convert parametric info to mesh
    const part = Parametric.create(model)

    // Add it to the scene
    scene.add(part.render())
</script>
```

# Examples
[link](/examples/debug ':ignore')



# Based on
- Open source 2D Solver http://solvespace.com/index.pl
- THREEJS https://threejs.org/docs/scenes/geometry-browser.html#ParametricGeometry
- CSGJS 
- AmmoJs
- http://opensourcebim.org/