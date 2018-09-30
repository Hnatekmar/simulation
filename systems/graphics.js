import * as PIXI from 'pixi.js'
import * as CES from 'ces'

// noinspection JSUnusedLocalSymbols
export default CES.System.extend({
  setCanvas: function (canvas) {
    if (this.renderer !== undefined) return
    this.renderer = new PIXI.Application({
      view: canvas,
      antialias: true,
      width: 800,
      height: 800
    })
    this.canvas = canvas
    this.renderer.ticker.stop()
  },
  addedToWorld: function (world) {
    world.entityAdded('graphics').add((entity) => {
      this.renderer.stage.addChild(entity.getComponent('graphics').container)
    })
    world.entityRemoved('graphics').add((entity) => {
      this.renderer.stage.removeChild(entity.getComponent('graphics').container)
    })
  },
  update: function (dt) {
    if (this.draw) {
      this.renderer.ticker.update()
    }
  }
})
