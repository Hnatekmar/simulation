import * as CES from 'ces'
import * as PIXI from 'pixi.js'

/**
 * Light wrapper around PIXI.Container
 */
export default CES.Component.extend({
  name: 'graphics',
  /**
   * Constructor
   * @param objects - array of PIXI.DisplayObject
   */
  init: function (objects) {
    this.container = new PIXI.Container()
    objects.forEach((object) => this.container.addChild(object))
    // Translate to matter js coordinate system
    this.container.pivot.set(this.container.width / 2, this.container.height / 2)
  }
})
