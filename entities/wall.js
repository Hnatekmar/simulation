import * as CES from 'ces'
import GraphicsComponent from '../components/graphics.js'
import PhysicsComponent from '../components/physics.js'
import * as p2 from 'p2'
import * as PIXI from 'pixi.js'

function rectangle (x, y, w, h, color) {
  const result = new PIXI.Graphics()
  result.beginFill(color, 1)
  result.drawRect(x, y, w, h)
  result.position.set(x, y)
  return result
}

export default function (x, y, w, h, world) {
  const entity = new CES.Entity()
  entity.addComponent(new GraphicsComponent([
    rectangle(0, 0, w, h, 0x00FF00)
  ]))
  let body = new p2.Body({
    mass: 0,
    position: [x, y]
  })
  body.addShape(new p2.Box(
    {
      width: w,
      height: h
    }))
  entity.addComponent(new PhysicsComponent(
    body
    // Matter.Bodies.rectangle(x, y, w, h, {
    //   isStatic: true
    // })
  ))
  world.addEntity(entity)
  return entity
}
