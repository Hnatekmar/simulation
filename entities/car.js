import * as CES from 'ces'
import GraphicsComponent from '../components/graphics.js'
import PhysicsComponent from '../components/physics.js'
import * as PIXI from 'pixi.js'
import * as p2 from 'p2'
import CarComponent from '../components/car.js'
import * as _ from 'lodash'
import * as ray from '../entities/raySensor'

export default function (x, y, world, genome, loader) {
    const entity = new CES.Entity()
    if (loader !== undefined && loader.resources['./static/chassis.png'] !== undefined) {
        const graphicsComponent = new GraphicsComponent([
            new PIXI.Sprite(loader.resources['./static/chassis.png'].texture)
        ])
        entity.addComponent(graphicsComponent)
    }
    let body = new p2.Body({
        mass: 2000,
        position: [x, y],
        allowSleep: false
    })
    body.addShape(new p2.Box({
        width: 100,
        height: 200
    }))
    entity.addComponent(new PhysicsComponent(
        body
    ))
    let car = new p2.TopDownVehicle(body)
    let frontWheel = car.addWheel({
        localPosition: [0, 100]
    })
    let backWheel = car.addWheel({
        localPosition: [0, -100]
    })
    entity.addComponent(new CarComponent(entity, genome, car, frontWheel, backWheel))
    world.addEntity(entity)
    let carComponent = entity.getComponent('car')
    let p2World = entity.getComponent('physics').world
    car.addToWorld(p2World)
    carComponent.sensors = _.range(0, 360, 10)
        .map((el) => new ray.Sensor([Math.cos(el * (Math.PI / 180)), Math.sin(el * (Math.PI / 180))], [body.id], p2World))
    return entity
}
