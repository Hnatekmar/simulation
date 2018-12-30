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
                    'left': ['upside L', 'L'],
                    'right': ['inverted upside L', 'inverted_L']
                }
            },
            'L': {
                'group': RoadPart(0, 0, this.world, [
                    Wall(690, 250, 300, 20, this.world),
                    Wall(250, 160, 20, 800, this.world),
                    Wall(550, 50, 20, 400, this.world),
                    Wall(650, 550, 800, 20, this.world)
                ]),
                'possibleParts': {
                    'up': ['I advanced'],
                    'down': ['I advanced'],
                    'left': ['-'],
                    'right': ['-']
                }
            },
            'reverse L': {
                'group': RoadPart(0, 0, this.world, [
                    Wall(110, 250, 300, 20, this.world),
                    Wall(250, 0, 20, 490, this.world),
                    Wall(550, 0, 20, 1100, this.world),
                    Wall(250, 550, 620, 20, this.world)
                ]),
                'possibleParts': {
                    'up': ['I advanced'],
                    'down': ['I advanced'],
                    'left': ['-'],
                    'right': ['-']
                }
            },
            'upside L': {
                'group': RoadPart(0, 0, this.world, [
                    Wall(690, 550, 300, 20, this.world),
                    Wall(550, 740, 20, 400, this.world),
                    Wall(250, 640, 20, 800, this.world),
                    Wall(650, 250, 800, 20, this.world)
                ]),
                'possibleParts': {
                    'up': ['I advanced'],
                    'down': ['I advanced'],
                    'left': ['-'],
                    'right': ['-']
                }
            },
            'reverse upside L': {
                'group': RoadPart(0, 0, this.world, [
                    Wall(110, 550, 300, 20, this.world),
                    Wall(250, 740, 20, 400, this.world),
                    Wall(550, 640, 20, 800, this.world),
                    Wall(150, 250, 800, 20, this.world)
                ]),
                'possibleParts': {
                    'up': ['I advanced'],
                    'down': ['I advanced'],
                    'left': ['-'],
                    'right': ['-']
                }
            },
            'I basic': {
                'group': RoadPart(0, 0, this.world, [
                    Wall(250, 0, 20, 8000, this.world),
                    Wall(550, 0, 20, 8000, this.world)
                ]),
                'possibleParts': {
                    'up': ['I basic'],
                    'down': ['I basic']
                }
            },
            'I with obstructions': {
                'group': RoadPart(0, 0, this.world, [
                    Wall(250, 0, 20, 8000, this.world),
                    Wall(550, 0, 20, 8000, this.world),
                    Wall(300, 100, 100, 20, this.world),
                    Wall(500, 600, 100, 20, this.world),
                ]),
                'possibleParts': {
                    'up': ['I with obstructions'],
                    'down': ['I with obstructions']
                }
            },
            'I advanced': {
                'group': RoadPart(0, 0, this.world, [
                    Wall(250, 0, 20, 8000, this.world),
                    Wall(550, 0, 20, 8000, this.world)
                ]),
                'possibleParts': {
                    'down': ['reverse upside L', 'upside L'],
                    'up': ['reverse L', 'L']
                }
            },
        }
        Object.keys(this.parts).forEach((key) => {
            if (key !== this.STARTING_PIECE) {
                this.parts[key]['group'].moveAbsolute(50000, 50000)
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
        this.rooms = {}
        this.rooms[this.getRoomID()] = {
            entryPoint: [400, 400],
            distance: 0
        }
        this.currentPart['group'].moveAbsolute(50000,50000)
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
