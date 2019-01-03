import * as CES from 'ces'
import Wall from '../entities/wall.js'
import RoadPart from '../entities/roadPart.js'
import Chance from 'chance'
import * as p2 from 'p2'

function getDirection (x, y, w, h) {
    if (x > w) return 'right'
    if (y > h) return 'down'
    if (x < 0) return 'left'
    if (y < 0) return 'up'
    return 'onScreen'
}

function createGroup(walls, world) {
    let groups = []
    for (let i = 0; i < 5; i++) {
        groups.push(
            RoadPart(0, 0, world, walls.map((wallDefinition) => {
                let newDefinition = wallDefinition.slice(0)
                newDefinition.push(world)
                return Wall.apply(null, newDefinition)
            }))
        )
    }
    return groups

}

export default CES.System.extend({
    getRoomID: function () {
        return this.position[0] + ',' + this.position[1]
    },
    setup: function (world, startingPiece) {
        this.rooms = {}
        this.STARTING_PIECE = startingPiece || 'I basic'
        this.world = world
        this.rng = new Chance('RNG0,0')
        this.position = [0, 0]
        this.parts = {
            '- up': {
                'group': createGroup([
                    [400, 250, 800, 20],
                    [400, 550, 800, 20]
                ], this.world),
                'possibleParts': {
                    'left': ['upside L'],
                    'right': ['reverse upside L']
                }
            },
            '- down': {
                'group': createGroup([
                    [400, 250, 800, 20],
                    [400, 550, 800, 20]
                ], this.world),
                'possibleParts': {
                    'left': ['L'],
                    'right': ['reverse L']
                }
            },
            'L': {
                'group': createGroup([
                    [690, 250, 300, 20],
                    [250, 160, 20, 800],
                    [550, 50, 20, 400],
                    [650, 550, 800, 20]
                ], this.world),
                'possibleParts': {
                    'up': ['I advanced left'],
                    'right': ['- down']
                }
            },
            'reverse L': {
                'group': createGroup([
                    [110, 250, 300, 20],
                    [250, 0, 20, 490],
                    [550, 0, 20, 1100],
                    [250, 550, 620, 20]
                ], this.world),
                'possibleParts': {
                    'up': ['I advanced left'],
                    'left': ['- down']
                }
            },
            'upside L': {
                'group': createGroup([
                    [690, 550, 300, 20],
                    [550, 740, 20, 400],
                    [250, 640, 20, 800],
                    [650, 250, 800, 20]
                ], this.world),
                'possibleParts': {
                    'down': ['I advanced left'],
                    'right': ['- up']
                }
            },
            'reverse upside L': {
                'group': createGroup([
                    [110, 550, 300, 20],
                    [250, 740, 20, 400],
                    [550, 640, 20, 800],
                    [150, 250, 800, 20]
                ], this.world),
                'possibleParts': {
                    'down': ['I advanced right'],
                    'left': ['- up']
                }
            },
            'I basic': {
                'group': createGroup( [
                    [250, 0, 20, 800],
                    [550, 0, 20, 800]
                ], this.world),
                'possibleParts': {
                    'up': ['I basic'],
                    'down': ['I basic']
                }
            },
            'I with obstructions': {
                'group': createGroup( [
                    [250, 0, 20, 800],
                    [550, 0, 20, 800],
                    [300, 100, 100, 20],
                    [500, 600, 100, 20],
                ], this.world),
                'possibleParts': {
                    'up': ['I with obstructions'],
                    'down': ['I with obstructions']
                }
            },
            'I advanced right': {
                'group': createGroup( [
                    [250, 400, 20, 800],
                    [550, 400, 20, 800]
                ], this.world),
                'possibleParts': {
                    'up': ['reverse upside L'],
                    'down': ['reverse L']
                }
            },
            'I advanced left': {
                'group': createGroup( [
                    [250, 400, 20, 800],
                    [550, 400, 20, 800]
                ], this.world),
                'possibleParts': {
                    'up': ['upside L'],
                    'down': ['L']
                }
            },
        }
        Object.keys(this.parts).forEach((key) => {
            // For debugging purposes
            this.parts[key].name = key
            if (key !== this.STARTING_PIECE) {
                this.parts[key]['group'].forEach((part) => part.moveAbsolute(50000, 50000))
            }
        })
        this.currentPart = this.parts[this.STARTING_PIECE]
        this.rooms[this.getRoomID()] = {
            entryPoint: [400, 400],
            distance: 0
        }
        Object.keys(this.currentPart['possibleParts']).forEach((direction, index) => {
            let dir = [0, 0]
            if (direction === 'up') dir[1] += 1
            if (direction === 'down') dir[1] -= 1
            if (direction === 'left') dir[0] -= 1
            if (direction === 'right') dir[0] += 1
            let pos = [this.position[0] + dir[0], this.position[1] + dir[1]]
            let rng = new Chance('RNG' + pos[0] + ',' + pos[1])
            let piece = rng.pickone(this.currentPart['possibleParts'][direction])
            this.parts[piece]['group'][index + 1].moveAbsolute(dir[0] * 800, dir[1] * 800)
        })
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
        Object.keys(this.parts).forEach((key) => {
            this.parts[key]['group'].forEach((part) => part.moveAbsolute(50000, 50000))
        })
        this.currentPart = this.parts[this.STARTING_PIECE]
        this.currentPart['group'][0].moveAbsolute(0, 0)
        Object.keys(this.currentPart['possibleParts']).forEach((direction, index) => {
            let dir = [0, 0]
            if (direction === 'up') dir[1] += 1
            if (direction === 'down') dir[1] -= 1
            if (direction === 'left') dir[0] -= 1
            if (direction === 'right') dir[0] += 1
            let pos = [this.position[0] + dir[0], this.position[1] + dir[1]]
            let rng = new Chance('RNG' + pos[0] + ',' + pos[1])
            let piece = rng.pickone(this.currentPart['possibleParts'][direction])
            this.parts[piece]['group'][index + 1].moveAbsolute(dir[0] * 800, dir[1] * 800)
        })
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
        if (possiblePieces.length === 0 || possiblePieces === undefined) return
        if (direction === 'up') this.position[1] += 1
        if (direction === 'down') this.position[1] -= 1
        if (direction === 'left') this.position[0] -= 1
        if (direction === 'right') this.position[0] += 1
        this.currentPart['group'].forEach((part) => part.moveAbsolute(50000, 50000))
        this.rng = new Chance('RNG' + this.position[0] + ',' + this.position[1])
        if (this.position[0] === 0 && this.position[1] === 0) {
            this.currentPart = this.parts[this.STARTING_PIECE]
        } else {
            this.currentPart = this.parts[this.rng.pickone(possiblePieces)]
        }
        this.currentPart['group'][0].moveAbsolute(0, 0)
        Object.keys(this.currentPart['possibleParts']).forEach((direction, index) => {
            let dir = [0, 0]
            if (direction === 'up') dir[1] += 1
            if (direction === 'down') dir[1] -= 1
            if (direction === 'left') dir[0] -= 1
            if (direction === 'right') dir[0] += 1
            let pos = [this.position[0] + dir[0], this.position[1] + dir[1]]
            let rng = new Chance('RNG' + pos[0] + ',' + pos[1])
            let piece = rng.pickone(this.currentPart['possibleParts'][direction])
            this.parts[piece]['group'][index + 1].moveAbsolute(dir[0] * 800, dir[1] * 800)
        })
        this.moveCarBackToScreen(direction)
    },
    moveCarBackToScreen: function (direction) {
        let body = this.car.getComponent('physics').body
        let newPos = [0, 0]
        if (direction === 'down') {
            newPos = [body.position[0], 0]
        } else if (direction === 'up') {
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
    switchRoom: function(piece) {
        this.currentPart['group'].forEach((part) => part.moveAbsolute(50000, 50000))
        this.currentPart = this.parts[piece]
        this.parts[piece]['group'][0].moveAbsolute(0, 0)
        Object.keys(this.currentPart['possibleParts']).forEach((direction, index) => {
            let dir = [0, 0]
            if (direction === 'up') dir[1] += 1
            if (direction === 'down') dir[1] -= 1
            if (direction === 'left') dir[0] -= 1
            if (direction === 'right') dir[0] += 1
            let pos = [this.position[0] + dir[0], this.position[1] + dir[1]]
            let rng = new Chance('RNG' + pos[0] + ',' + pos[1])
            let piece = rng.pickone(this.currentPart['possibleParts'][direction])
            this.parts[piece]['group'][index + 1].moveAbsolute(dir[0] * 800, dir[1] * 800)
        })
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
        let options = this.car.getComponent('car').options
        if (options && options.player) {
            this.car.getComponent('car').fitness = options.fitness
            this.switchRoom(options.piece);
            return
        }
        if (pos !== null) {
            let direction = getDirection(pos[0], pos[1], 800, 800)
            if (direction !== 'onScreen') {
                this.swapNextRoadPart(direction)
            }
        }
    }
})
