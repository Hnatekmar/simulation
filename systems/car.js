import * as CES from 'ces'
import * as p2 from 'p2'
import * as PIXI from 'pixi.js'

const MAXIMUM_STEER = 45
const ROTATION_PER_SECOND = MAXIMUM_STEER
function indexOfMaximum (arr) {
    let index = -1
    let maximum = -1
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > maximum) {
            maximum = arr[i]
            index = i
        }
    }
    return index
}

function normalizeAngle(angle){
    angle = angle % (2*Math.PI);
    if(angle < 0){
        angle += (2*Math.PI);
    }
    return angle;
}


// noinspection JSUnusedLocalSymbols
export default CES.System.extend({
    update: function (dt) {
        this.world.getEntities('car').forEach((entity) => {
            const body = entity.getComponent('car')
            let graphics = entity.getComponent('graphics')
            const pb = body.chassis.getComponent('physics').body

            if (pb.callbackInitialized === undefined) {
                pb.world.on('beginContact', (event) => {
                    let bodyA = event.bodyA
                    let bodyB = event.bodyB
                    let vel = Math.sqrt(p2.vec2.squaredLength(pb.velocity))
                    if ((bodyA.id === pb.id) || (bodyB.id === pb.id) && vel > 1.0) {
                        pb.force = [0, 0]
                        pb.allowSleep = true
                        pb.force = [0, 0]
                        pb.sleep()
                    }
                })
                pb.callbackInitialized = true
            }

            if (this.input === undefined) {
                this.input = []
                for (let i = 0; i < body.sensors.length; i++) {
                    this.input.push(0)
                }
                body.backWheel.setBrakeForce(0)
                body.frontWheel.setBrakeForce(0)
                body.frontWheel.setSideFriction(8000)
                body.backWheel.setSideFriction(6000)
            }
            let drawArea
            if (graphics !== undefined) {
                if (body.graphics === undefined) {
                    drawArea = new PIXI.Graphics()
                    graphics.container.parent.addChild(drawArea)
                    body.graphics = drawArea
                } else {
                    drawArea = body.graphics
                }
                drawArea.clear()
                drawArea.lineStyle(5, 0x0000FF, 0xFF);
            }
            for (let i = 0; i < body.sensors.length; i++) {
                body.sensors[i].cast(pb.position, pb.angle)
                if (body.sensors[i].shortest.distance === Infinity || body.sensors[i].shortest.distance > 800) {
                    body.sensors[i].shortest.distance = 800
                }
                if(graphics !== undefined) {
                    drawArea.moveTo(body.sensors[i].ray.from[0], body.sensors[i].ray.from[1])
                    drawArea.lineTo(
                        body.sensors[i].ray.from[0] + body.sensors[i].ray.direction[0] * body.sensors[i].shortest.distance,
                        body.sensors[i].ray.from[1] + body.sensors[i].ray.direction[1] * body.sensors[i].shortest.distance)
                }
                body.sensors[i].shortest.distance /= 800.0
                this.input[i] = body.sensors[i].shortest.distance
            }
            if (pb.sleepState === p2.Body.SLEEPING) return;
            let output = body.genome.activate(this.input)
            let vel = Math.sqrt(p2.vec2.squaredLength(pb.velocity))
            let isVelNaN = isNaN(vel)
            for (let i = 0; i < output.length; i++) {
                if (isVelNaN || isNaN(output[i])) {
                    output[i] = 0
                    body.fitness = -9000000
                    pb.allowSleep = true
                    pb.force = [0, 0]
                    pb.sleep()
                    return
                }
            }
            let steeringChoice = indexOfMaximum(output.slice(0, 2))
            let dir = -1
            if (steeringChoice === 0) {
                if (body.frontWheel.steerValue < (Math.PI / 180.0) * MAXIMUM_STEER) {
                    body.frontWheel.steerValue += (Math.PI / 180.0) * ROTATION_PER_SECOND * dt
                }
            } else if (steeringChoice === 1) {
                if (body.frontWheel.steerValue >= -(Math.PI / 180.0) * MAXIMUM_STEER) {
                    body.frontWheel.steerValue -= (Math.PI / 180.0) * ROTATION_PER_SECOND * dt
                }
            }
            let speed = indexOfMaximum(output.slice(2, output.length))
            if (speed === 0) speed = -1
            body.backWheel.engineForce = dir * speed * 9000
        })
    }
})
