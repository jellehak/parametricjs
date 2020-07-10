/*
    [
                        { x: 0, y: 0 },
                        { x: 10, y: 0 },
                        { x: 10, y: 10},
                        { x: 0, y: 10 },
                        { x: 0, y: 0 } //close
                    ] =>
        var triangleShape = new THREE.Shape();
        triangleShape.moveTo(80, 20);
        triangleShape.lineTo(40, 80);
        triangleShape.lineTo(120, 80);
        triangleShape.lineTo(80, 20); // close path
    */

export default function PathToShape (path = []) {
  const shape = new THREE.Shape()
  const start = path[0]
  shape.moveTo(start.x, start.y)
  for (const k in path) {
    const p = path[k]
    shape.lineTo(p.x, p.y)
  }
  shape.lineTo(path[0].x, path[0].y) // Close
  return shape
}
