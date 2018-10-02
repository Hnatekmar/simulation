// import * as PolyK from 'polyk'
// import * as _ from 'lodash'
import * as p2 from 'p2'

export class Sensor {
    constructor(endPoint, ignoredIDs, world) {
        this.endPoint = endPoint
        this.world = world
        this.shortest = null
        this.endPoint[0] *= 800
        this.endPoint[1] *= 800
        this.ignoredIDs = new Set(ignoredIDs)
        let t = this
        this.result = new p2.RaycastResult()
        this.ray = new p2.Ray({
            mode: p2.Ray.ALL,
            from: t.origin,
            to: t.endPoint,
            callback: (result) => {
                if (t.ignoredIDs.has(result.body.id)) return
                let distance = result.getHitDistance(t.ray)
                if (distance < t.shortest.distance) {
                    t.shortest.distance = distance
                    t.shortest.body = result.body
                }
            }
        })
    }

    cast(origin, rotation) {
        let c = Math.cos(rotation)
        let s = Math.sin(rotation)
        let rotatedEndPoint = [this.endPoint[0] * c - this.endPoint[1] * s, this.endPoint[0] * s + this.endPoint[1] * c]
        this.ray.from = origin
        this.ray.to = [origin[0] + rotatedEndPoint[0], origin[1] + rotatedEndPoint[1]]
        this.calculateShortest()
    }

    calculateShortest() {
        this.shortest = {
            distance: Infinity
        }
        this.ray.update()
        this.world.raycast(this.result, this.ray)
        this.result.reset()
    }
}
