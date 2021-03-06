import GraphicsSystem from './systems/graphics.js'
import PhysicsSystem from './systems/physics.js'
import CarSystem from './systems/car.js'
import Car from './entities/car.js'
import RoadDirector from './systems/roadDirector.js'
import * as p2 from 'p2'

const CES = require('ces')

function fillNaN(object, value) {
    function replaceNaN(x) {
        if (isNaN(x)) {
            return value
        }
        return x
    }

    let keys = Object.keys(object)
    for (let i in keys) {
        if (typeof object[keys[i]] === 'number' && isNaN(object[keys[i]])) {
            object[keys[i]] = value
        } else if (object[keys[i]] !== null && object[keys[i]].constructor === Float32Array) {
            for (let j = 0; j < object[keys[i]].length; j++) {
                object[keys[i]][j] = replaceNaN(object[keys[i]][j])
            }
        }
    }
}

/**
 * Main class of simulation
 */
export default class Simulation {
    constructor(frames, canvasElement, loader) {
        this.time = frames
        this.canvasElement = canvasElement
        this.loader = loader
    }

    init(canvas, startingPiece) {
        if (this.world === undefined) {
            this.world = new CES.World()
            if (canvas !== undefined) {
                this.renderer = new GraphicsSystem()
                this.renderer.setCanvas(canvas)
                this.renderer.draw = true
                this.world.addSystem(this.renderer)
            }
            this.physicsSystem = new PhysicsSystem()
            this.world.addSystem(this.physicsSystem)
            let carSystem = new CarSystem()
            this.world.addSystem(carSystem)
            this.car = Car(400.0, 400.0, this.world, this.genome, this.loader)
            this.roadDirector = new RoadDirector()
            this.roadDirector.setup(this.world, startingPiece)
            this.roadDirector.setCar(this.car)
            this.world.addSystem(this.roadDirector)
        } else {
            this.car.getComponent('car').genome = this.genome
            this.roadDirector.reset(startingPiece)
        }
        this.lastDt = 0
    }

    evaluate(genome, startingPiece, options) {
        this.destroy()
        this.genome = genome
        this.init(this.canvasElement, startingPiece)
        this.acc = 0
        this.lastDt = null
        let t = this
        this.car.getComponent('car').options = options || {}
        return new Promise(
            function (resolve) {
                t.onFinish = resolve
            }
        )
    }

    fitness() {
        return this.car.getComponent('car').fitness
    }

    currentPart() {
        return this.roadDirector.currentPart.name
    }

    isRunning() {
        return this.acc < this.time && (this.car.getComponent('physics').body.sleepState !== p2.Body.SLEEPING)
    }

    evalGenome(dt, genome, startingPiece) {
        this.evaluate(genome, startingPiece)
        while (this.isRunning()) {
            this.update(dt)
        }
        return this.car.getComponent('car').fitness
    }

    /**
     * Main simulation loop
     */
    update(dt) {
        if (this.lastDt === null) this.lastDt = dt
        this.acc += dt
        let currentFitness = this.car.getComponent('car').fitness
        if (this.isRunning()) {
            this.world.update(dt)
        } else {
            this.onFinish(currentFitness)
        }
    }

    /**
     * Called on component destruction
     */
    destroy() {
        if (this.world !== undefined) {
            this.car.getComponent('car').fitness = 0
            this.car.getComponent('car').frontWheel.steerValue = 0
            let body = this.car.getComponent('physics').body
            fillNaN(body, 0.0)
            body.allowSleep = false
            if (body.sleepState === p2.Body.SLEEPING) {
                body.wakeUp()
            }
            body.setZeroForce()
            body.position = [this.position[0], this.position[1]]
            body.angularVelocity = 0
            body.velocity = [0, 0]
            body.angle = 0
            this.roadDirector.reset()
        } else {
            this.position = [400, 400]
            this.velocity = [0, 0]
        }
    }
}
