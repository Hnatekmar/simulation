import GraphicsSystem from './systems/graphics.js'
import PhysicsSystem from './systems/physics.js'
import CarSystem from './systems/car.js'
import Car from './entities/car.js'
import RoadDirector from './systems/roadDirector.js'
import Sigma from 'sigma'
import * as p2 from 'p2'

const CES = require('ces')

function fillNaN (object, value) {
  function replaceNaN (x) {
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
  constructor (canvasElement, frames, visualizationID) {
    this.visualizationID = visualizationID
    this.time = frames
    this.canvasElement = canvasElement
  }

  init (canvas) {
    if (this.world === undefined) {
      this.renderer = new GraphicsSystem()
      this.renderer.setCanvas(canvas)
      this.renderer.draw = true
      this.world = new CES.World()
      this.world.addSystem(this.renderer)
      this.physicsSystem = new PhysicsSystem()
      this.world.addSystem(this.physicsSystem)
      this.world.addSystem(new CarSystem())
      this.car = Car(400.0, 400.0, this.world, this.genome)
      this.roadDirector = new RoadDirector()
      this.roadDirector.setWorld(this.world)
      this.roadDirector.setCar(this.car)
      this.world.addSystem(this.roadDirector)
    } else {
      this.car.getComponent('car').genome = this.genome
    }
    this.lastDt = 0
  }

  generateGraph (width, height, sigma) {
    sigma.graph.clear()
    const graph = this.genome.graph(width, height)

    function getPosition (nodeID) {
      let zero = {x: 0, y: 0}
      if (graph.constraints === undefined) return zero
      let offsetX = graph.constraints[0].offsets.filter((of) => of.node === nodeID)
      let offsetY = graph.constraints[1].offsets.filter((of) => of.node === nodeID)
      if (offsetX.length === 0 || offsetY.length === 0) return zero
      return {
        x: offsetX[0].offset,
        y: offsetY[0].offset
      }
    }

    for (let nodeID in graph.nodes) {
      // noinspection JSUnfilteredForInLoop
      let node = graph.nodes[nodeID]
      let position = getPosition(node.id)
      // noinspection JSUnfilteredForInLoop
      let result = {
        id: node.id.toString(),
        label: node.name + ' ',
        x: position.x,
        y: position.y,
        size: 1
      }
      sigma.graph.addNode(result)
    }
    for (let linkID in graph.links) {
      // noinspection JSUnfilteredForInLoop
      let link = graph.links[linkID]
      link.id = linkID
      link.source = link.source.toString()
      link.target = link.target.toString()
      link.color = 'red'
      link.size = link.weight * 10
      sigma.graph.addEdge(link)
    }
    sigma.settings({
      scalingMode: 'outside',
      minEdgeSize: 0.1,
      maxEdgeSize: 10.0
    })
    sigma.refresh()
  }

  drawGenome () {
    if (this.sigma === undefined) {
      // noinspection JSPotentiallyInvalidConstructorUsage eslint-disable-next-line new-cap
      this.sigma = new Sigma(this.visualizationID)
    }
    this.generateGraph(this.visualizationID.clientWidth, this.visualizationID.clientHeight, this.sigma)
  }

  evaluate (genome) {
    this.destroy()
    this.genome = genome
    this.init(this.canvasElement)
    this.acc = 0
    this.lastDt = null
    let t = this
    return new Promise(
      function (resolve) {
        t.onFinish = resolve
      }
    )
  }

  evalGenome (dt) {
    while (this.acc < this.time && this.car.getComponent('physics').body.sleepState !== p2.Body.SLEEPING) {
      this.update(dt)
    }
  }

  /**
   * Main simulation loop
   */
  update (dt) {
    if (this.lastDt === null) this.lastDt = dt
    this.acc += dt
    let currentFitness = this.car.getComponent('car').fitness
    if (this.acc < this.time && this.car.getComponent('physics').body.sleepState !== p2.Body.SLEEPING) {
      this.world.update(dt)
    } else {
      this.onFinish(currentFitness)
    }
  }

  /**
   * Called on component destruction
   */
  destroy () {
    if (this.world !== undefined) {
      this.car.getComponent('car').fitness = 0
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
