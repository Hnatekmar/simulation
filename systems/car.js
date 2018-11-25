import * as CES from 'ces'
import * as p2 from 'p2'
import * as PIXI from 'pixi.js'

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
                    if ((bodyA.id === pb.id) || (bodyB.id === pb.id)) {
                        pb.allowSleep = true
                        pb.force = [0, 0]
                        pb.sleep()
                    }
                })
                pb.callbackInitialized = true
            }

            if (this.input === undefined) {
                this.input = []
                for (let i = 0; i <= body.sensors.length; i++) {
                    this.input.push(0)
                }
                body.backWheel.setBrakeForce(0)
                body.frontWheel.setBrakeForce(0)
                body.frontWheel.setSideFriction(8000)
                body.backWheel.setSideFriction(6000)
            }
            let drawArea
            if (graphics !== null) {
                if (body.graphics === undefined) {
                    drawArea = new PIXI.Graphics()
                    graphics.container.parent.addChild(drawArea)
                    body.graphics = drawArea
                } else {
                    drawArea = body.graphics
                }
                drawArea.clear()
                drawArea.lineStyle(2, 0x0000FF, 0xFF);
            }
            for (let i = 0; i < body.sensors.length; i++) {
                body.sensors[i].cast(pb.position, [pb.id], pb.angle)
                if (body.sensors[i].shortest.distance === Infinity || body.sensors[i].shortest.distance > 800) {
                    body.sensors[i].shortest.distance = 800
                }
                drawArea.moveTo(body.sensors[i].ray.from[0], body.sensors[i].ray.from[1])
                drawArea.lineTo(
                    body.sensors[i].ray.from[0] + body.sensors[i].ray.direction[0] * body.sensors[i].shortest.distance,
                    body.sensors[i].ray.from[1] + body.sensors[i].ray.direction[1] * body.sensors[i].shortest.distance)
                body.sensors[i].shortest.distance /= 800.0
                this.input[i] = body.sensors[i].shortest.distance
            }
            this.input[body.sensors.length - 1] = pb.angle
            let vel = Math.sqrt(p2.vec2.squaredLength(pb.velocity))
            if (vel === 0 && body.fitness !== 0) {
                pb.allowSleep = true
                pb.force = [0, 0]
                pb.sleep()
            }
            if (pb.sleepState === p2.Body.SLEEPING) return;
            let output = body.genome.activate(this.input)
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
            let steeringControl = output.slice(0, 3)
            let steeringChoice = indexOfMaximum(steeringControl)
            let throttleControl = output.slice(4, 6)
            let throttleChoice = indexOfMaximum(throttleControl)
            let dir = 0
            if (throttleChoice === 0) { // FORWARD
                dir = -1
                body.fitness += vel
            } else if (throttleChoice === 1) { // BACKWARDS
                dir = 0.15
                body.fitness += vel
            } else if (throttleChoice === 2) { // BREAK
                if (vel === 0.0) {
                    pb.allowSleep = true
                    pb.force = [0, 0]
                    pb.sleep()
                }
                dir = 0
                body.fitness -= 100
                body.frontWheel.setBrakeForce(5 * 2000)
            }
            if (steeringChoice === 0) {
                if (body.frontWheel.steerValue < (Math.PI / 180.0) * 90) {
                    body.frontWheel.steerValue += (Math.PI / 180.0)
                }
            } else if (steeringChoice === 1) {
                if (body.frontWheel.steerValue >= -(Math.PI / 180.0) * 90) {
                    body.frontWheel.steerValue -= (Math.PI / 180.0)
                }
            }
            body.backWheel.engineForce = dir * 7 * 9000
        })
    }
})
