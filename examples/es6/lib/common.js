const { materialType } = THREE

export const sphere = new materialType({ map: gradient({ color1: "#58AA80", color2: "#58FFAA" }), name: 'sph' });
export const box = new materialType({ map: gradient({ color1: "#58AA80", color2: "#58FFAA" }), name: 'box' });
export const sphereSleep = new materialType({ map: gradient({ color1: "#58AA80", color2: "#58FFAA" }), name: 'ssph' });
export const boxSleep = new materialType({ map: gradient({ color1: "#58AA80", color2: "#58FFAA" }), name: 'sbox' });
export const ground = new materialType({ color: 0x3D4143, transparent: true, opacity: 0.5 });
export const groundTrans = new materialType({ color: 0x3D4143, transparent: true, opacity: 0.6 });


function gradient({ color1, color2 }) {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color1;
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = color2;
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillRect(32, 32, 32, 32);
    var tx = new THREE.Texture(canvas);
    tx.needsUpdate = true;
    return tx;
}