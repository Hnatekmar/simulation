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
                    body.fitness -= 7000000
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
            if (graphics !== undefined) {
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
            this.input[body.sensors.length - 1] = normalizeAngle(pb.angle)
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
            let steeringControl = output.slice(0, 2)
            let steeringChoice = indexOfMaximum(steeringControl)
            let throttleControl = output.slice(3, 5)
            let throttleChoice = indexOfMaximum(throttleControl)
            let dir = 0
            if (throttleChoice === 0) { // FORWARD
                dir = -1
                body.fitness += 1
            } else if (throttleChoice === 1) { // BACKWARDS
                dir = 0.25
                body.fitness += 0.25
            }
            if (steeringChoice === 0) {
                if (body.frontWheel.steerValue < (Math.PI / 180.0) * 90) {
                    body.frontWheel.steerValue += (Math.PI / 180.0) * 5
                }
            } else if (steeringChoice === 1) {
                if (body.frontWheel.steerValue >= -(Math.PI / 180.0) * 90) {
                    body.frontWheel.steerValue -= (Math.PI / 180.0) * 5
                }
            }
            body.backWheel.engineForce = dir * 7 * 9000
        })
    }
})
