import * as CES from 'ces'
import Wall from '../entities/wall.js'
import RoadPart from '../entities/roadPart.js'
import Chance from 'chance'
import * as p2 from 'p2'

function getDirection (x, y, w, h) {
    if (x >= w) return 'right'
    if (y >= h) return 'up'
    if (x <= 0) return 'left'
    if (y <= 0) return 'down'
    return 'onScreen'
}


export default CES.System.extend({
    getRoomID: function () {
        return this.position[0] + ',' + this.position[1]
    },
    setup: function (world, startingPiece) {
        this.rooms = {}
        this.STARTING_PIECE = startingPiece || 'Box'
        this.world = world
        this.rng = new Chance('RNG0,0')
        this.position = [0, 0]
        this.parts = {
            '-': {
                'group': RoadPart(0, 0, this.world, [
                    Wall(0, 250, 8000, 20, this.world),
                    Wall(0, 550, 8000, 20, this.world)
                ]),
                'possibleParts': {
                    'left': ['Cross', 'T'],
                    'right': ['Cross', 'T']
                }
            },
            'I': {
                'group': RoadPart(0, 0, this.world, [
                    Wall(250, 0, 20, 8000, this.world),
                    Wall(550, 0, 20, 8000, this.world)
                ]),
                'possibleParts': {
                    'up': ['I'],
                    'down': ['I']
                }
            },
            'I left': {
                'group': RoadPart(0, 0, this.world, [
                    Wall(250, 0, 20, 480, this.world),
                    Wall(250, 750, 20, 400, this.world),
                    Wall(105, 250, 310, 20, this.world),
                    Wall(105, 550, 310, 20, this.world),
                    Wall(550, 0, 20, 8000, this.world)
                ]),
                'possibleParts': {
                    'up': ['Cross', 'I'],
                    'down': ['Cross', 'T', 'I'],
                    'left': ['Cross', 'T'],
                    'right': ['Cross', 'T']
                }
            },
            'I right': {
                'group': RoadPart(0, 0, this.world, [
                    Wall(250, 0, 20, 8000, this.world),
                    Wall(550, 0, 20, 8000, this.world)
                ]),
                'possibleParts': {
                    'up': ['Cross', 'I'],
                    'down': ['Cross', 'T', 'I'],
                    'left': ['Cross', 'T'],
                    'right': ['Cross', 'T']
                }
            },
            'T': {
                'group': RoadPart(0, 0, this.world, [
                    Wall(250, 700, 20, 400, this.world),
                    Wall(550, 700, 20, 400, this.world),
                    Wall(125, 500, 250, 20, this.world),
                    Wall(675, 500, 250, 20, this.world),
                    Wall(400, 250, 800, 20, this.world)
                ]),
                'possibleParts': {
                    'down': ['Cross', 'I'],
                    'up': ['Cross', 'I'],
                    'left': ['Cross', 'T'],
                    'right': ['Cross', 'T']
                }
            },
            'Cross': {
                'group': RoadPart(0, 0, this.world, [
                    Wall(675, 500, 250, 20, this.world),
                    Wall(125, 500, 250, 20, this.world),
                    Wall(675, 250, 250, 20, this.world),
                    Wall(125, 250, 250, 20, this.world),
                    Wall(250, 50, 20, 400, this.world),
                    Wall(550, 50, 20, 400, this.world),
                    Wall(250, 700, 20, 400, this.world),
                    Wall(550, 700, 20, 400, this.world)
                ]),
                'possibleParts': {
                    'up': ['Cross', 'I'],
                    'down': ['Cross', 'T', 'I'],
                    'left': ['Cross', 'T'],
                    'right': ['Cross', 'T']
                }
            },
            'Box': {
                'group': RoadPart(0, 0, this.world, [
                    Wall(400, 0, 800, 20, this.world),
                    Wall(0, 400, 20, 800, this.world),
                    Wall(800, 400, 20, 800, this.world),
                    Wall(400, 800, 800, 20, this.world)
                ]),
                'possibleParts': {
                }
            }
        }
        Object.keys(this.parts).forEach((key) => {
            if (key !== this.STARTING_PIECE) {
                this.parts[key]['group'].moveAbsolute(Math.sin(Math.random()) * 50000, Math.cos(Math.random()) * 50000)
            }
        })
        this.rooms[this.getRoomID()] = {
            entryPoint: [400, 400],
            distance: 0
        }
    },
    reset: function (startingPiece) {
        this.STARTING_PIECE = startingPiece || this.STARTING_PIECE
        this.rng = new Chance('RNG0,0')
        this.position = [0, 0]
        this.rooms[this.getRoomID()] = {
            entryPoint: [400, 400],
            distance: 0
        }
        this.currentPart['group'].moveAbsolute(Math.sin(Math.random()) * 50000, Math.cos(Math.random()) * 50000)
        this.currentPart = this.parts[this.STARTING_PIECE]
        this.currentPart['group'].moveAbsolute(0, 0)
    },
    setCar: function (car) {
        this.car = car
    },
    getCarPosition: function () {
        if (this.car != null) {
            let body = this.car.getComponent('physics').body
            return body.position
        }
        return null
    },
    swapNextRoadPart: function (direction) {
        if (this.currentPart === undefined) return
        let possiblePieces = this.currentPart['possibleParts'][direction]
        if (possiblePieces.length === 0) return
        if (direction === 'up') this.position[1] += 1
        if (direction === 'down') this.position[1] -= 1
        if (direction === 'left') this.position[0] -= 1
        if (direction === 'right') this.position[0] += 1
        this.currentPart['group'].moveAbsolute(50000, 50000)
        this.rng = new Chance('RNG' + this.position[0] + ',' + this.position[1])
        if (this.position[0] === 0 && this.position[1] === 0) {
            this.currentPart = this.parts[this.STARTING_PIECE]
        } else {
            this.currentPart = this.parts[this.rng.pickone(possiblePieces)]
        }
        this.currentPart['group'].moveAbsolute(0, 0)
        this.moveCarBackToScreen(direction)
    },
    moveCarBackToScreen: function (direction) {
        let body = this.car.getComponent('physics').body
        let newPos = [0, 0]
        if (direction === 'up') {
            newPos = [body.position[0], 0]
        } else if (direction === 'down') {
            newPos = [body.position[0], 800]
        } else if (direction === 'left') {
            newPos = [800, body.position[1]]
        } else if (direction === 'right') {
            newPos = [0, body.position[1]]
        }
        body.position = newPos
        this.rooms[this.getRoomID()] = {
            entryPoint: body.position.slice(0),
            distance: 0
        }
    },
    update: function (dt) {
        if (this.currentPart === undefined) {
            this.currentPart = this.parts[this.STARTING_PIECE]
        }
        let pos = this.getCarPosition()
        this.rooms[this.getRoomID()].distance = p2.vec2.distance(this.rooms[this.getRoomID()].entryPoint, pos)
        this.car.getComponent('car').fitness = 0
        Object.keys(this.rooms).forEach((key) => {
            this.car.getComponent('car').fitness += this.rooms[key].distance
        })
        if (pos !== null) {
            let direction = getDirection(pos[0], pos[1], 800, 800)
            if (direction !== 'onScreen') {
                this.swapNextRoadPart(direction)
            }
        }
    }
})
