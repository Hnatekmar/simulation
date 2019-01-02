(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["simulation"] = factory();
	else
		root["simulation"] = factory();
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("p2");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("ces");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("pixi.js");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("chance");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external "pixi.js"
var external_pixi_js_ = __webpack_require__(2);

// EXTERNAL MODULE: external "ces"
var external_ces_ = __webpack_require__(1);

// CONCATENATED MODULE: ./systems/graphics.js

 // noinspection JSUnusedLocalSymbols

/* harmony default export */ var systems_graphics = (external_ces_["System"].extend({
  setCanvas: function setCanvas(canvas) {
    if (this.renderer !== undefined) return;
    this.renderer = new external_pixi_js_["Application"]({
      view: canvas,
      antialias: true,
      width: 800,
      height: 800
    });
    this.canvas = canvas;
    this.renderer.ticker.stop();
  },
  addedToWorld: function addedToWorld(world) {
    var _this = this;

    world.entityAdded('graphics').add(function (entity) {
      _this.renderer.stage.addChild(entity.getComponent('graphics').container);
    });
    world.entityRemoved('graphics').add(function (entity) {
      _this.renderer.stage.removeChild(entity.getComponent('graphics').container);
    });
  },
  update: function update(dt) {
    if (this.draw) {
      this.renderer.ticker.update();
    }
  }
}));
// EXTERNAL MODULE: external "p2"
var external_p2_ = __webpack_require__(0);

// CONCATENATED MODULE: ./systems/physics.js


/* harmony default export */ var physics = (external_ces_["System"].extend({
  addedToWorld: function addedToWorld(world) {
    var _this = this;

    this._super(world); // this.engine = Matter.Engine.create()
    // this.engine.b2World.gravity.x = 0
    // this.engine.b2World.gravity.y = 0


    this.p2World = new external_p2_["World"]({
      gravity: [0, 0]
    });
    world.entityAdded('physics').add(function (entity) {
      var physicsComponent = entity.getComponent('physics');
      physicsComponent.world = _this.p2World;

      _this.p2World.addBody(physicsComponent.body);
    });
    world.entityRemoved('physics').add(function (entity) {
      _this.p2World.removeBody(entity.getComponent('physics').body);
    });
  },
  update: function update(dt) {
    this.p2World.step(0.016, dt, 5);
    this.world.getEntities('graphics', 'physics').forEach(function (entity) {
      var body = entity.getComponent('physics').body;
      var position = body.position;
      var graphicsObject = entity.getComponent('graphics').container;
      graphicsObject.position.set(position[0], position[1]);
      graphicsObject.rotation = body.angle;
    });
  }
}));
// CONCATENATED MODULE: ./systems/car.js



var MAXIMUM_STEER = 15;
var ROTATION_PER_SECOND = MAXIMUM_STEER;

function indexOfMaximum(arr) {
  var index = -1;
  var maximum = -1;

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] > maximum) {
      maximum = arr[i];
      index = i;
    }
  }

  return index;
}

function normalizeAngle(angle) {
  angle = angle % (2 * Math.PI);

  if (angle < 0) {
    angle += 2 * Math.PI;
  }

  return angle;
} // noinspection JSUnusedLocalSymbols


/* harmony default export */ var systems_car = (external_ces_["System"].extend({
  acc: 0,
  updateSensors: function updateSensors(body, drawArea, draw, pb) {
    for (var i = 0; i < body.sensors.length; i++) {
      body.sensors[i].cast(pb.position, pb.angle);

      if (body.sensors[i].shortest.distance === Infinity || body.sensors[i].shortest.distance > 800) {
        body.sensors[i].shortest.distance = 800;
      }

      if (draw) {
        drawArea.moveTo(body.sensors[i].ray.from[0], body.sensors[i].ray.from[1]);
        drawArea.lineTo(body.sensors[i].ray.from[0] + body.sensors[i].ray.direction[0] * body.sensors[i].shortest.distance, body.sensors[i].ray.from[1] + body.sensors[i].ray.direction[1] * body.sensors[i].shortest.distance);
      }

      body.sensors[i].shortest.distance /= 800.0;
      this.input[i] = body.sensors[i].shortest.distance;
    }
  },
  update: function update(dt) {
    var _this = this;

    this.acc = 0;
    this.world.getEntities('car').forEach(function (entity) {
      var body = entity.getComponent('car');
      var graphics = entity.getComponent('graphics');
      var pb = body.chassis.getComponent('physics').body;

      if (pb.callbackInitialized === undefined) {
        pb.world.on('beginContact', function (event) {
          var bodyA = event.bodyA;
          var bodyB = event.bodyB;
          var vel = Math.sqrt(external_p2_["vec2"].squaredLength(pb.velocity));

          if (bodyA.id === pb.id || bodyB.id === pb.id && vel > 1.0) {
            pb.force = [0, 0];
            pb.allowSleep = true;
            pb.force = [0, 0];
            pb.sleep();
          }
        });
        pb.callbackInitialized = true;
      }

      if (_this.input === undefined) {
        _this.input = [];

        for (var i = 0; i < body.sensors.length + 2; i++) {
          _this.input.push(0);
        }

        body.backWheel.setBrakeForce(0);
        body.frontWheel.setBrakeForce(0);
        body.frontWheel.setSideFriction(8000);
        body.backWheel.setSideFriction(6000);
      }

      var drawArea;

      if (graphics !== undefined) {
        if (body.graphics === undefined) {
          drawArea = new external_pixi_js_["Graphics"]();
          graphics.container.parent.addChild(drawArea);
          body.graphics = drawArea;
        } else {
          drawArea = body.graphics;
        }

        drawArea.clear();
        drawArea.lineStyle(5, 0xFFFFFF, 0xFF);
      }

      _this.updateSensors(body, drawArea, graphics !== undefined, pb);

      if (pb.sleepState === external_p2_["Body"].SLEEPING) return;
      var vel = Math.sqrt(external_p2_["vec2"].squaredLength(pb.velocity));

      if (body.options.inputVelocity) {
        _this.input.push(vel / 42);
      }

      if (body.options.inputWheel) {
        _this.input.push(normalizeAngle(body.frontWheel.steerValue));
      }

      var output = body.genome.activate(_this.input);
      var isVelNaN = isNaN(vel);

      for (var _i = 0; _i < output.length; _i++) {
        if (isVelNaN || isNaN(output[_i])) {
          output[_i] = 0;
          body.fitness = -9000000;
          pb.allowSleep = true;
          pb.force = [0, 0];
          pb.sleep();
          return;
        }
      }

      var offset = body.options.holdWheel !== undefined ? 1 : 0;
      var steeringChoice = indexOfMaximum(output.slice(0, 2 + offset));
      var dir = -1;

      if (steeringChoice === 0) {
        if (body.frontWheel.steerValue < Math.PI / 180.0 * MAXIMUM_STEER) {
          body.frontWheel.steerValue += Math.PI / 180.0 * ROTATION_PER_SECOND * dt;
        }
      } else if (steeringChoice === 1) {
        if (body.frontWheel.steerValue >= -(Math.PI / 180.0) * MAXIMUM_STEER) {
          body.frontWheel.steerValue -= Math.PI / 180.0 * ROTATION_PER_SECOND * dt;
        }
      }

      var speed = indexOfMaximum(output.slice(2 + offset, 4 + offset));

      if (speed === 0) {
        speed = -1;
      }

      body.backWheel.engineForce = dir * speed * 9000; // if (drawArea === undefined) return
      // drawArea.lineStyle(5, 0x0000FF, 0xFF);
      // drawArea.moveTo(pb.position[0], pb.position[1])
      // let angle = body.frontWheel.steerValue
      // drawArea.lineTo(pb.position[0] - Math.sin(angle) * 100 * speed,
      //                 pb.position[1] + Math.cos(angle) * -100 * speed)
    });
  }
}));
// CONCATENATED MODULE: ./components/graphics.js


/**
 * Light wrapper around PIXI.Container
 */

/* harmony default export */ var components_graphics = (external_ces_["Component"].extend({
  name: 'graphics',

  /**
   * Constructor
   * @param objects - array of PIXI.DisplayObject
   */
  init: function init(objects) {
    var _this = this;

    this.container = new external_pixi_js_["Container"]();
    objects.forEach(function (object) {
      return _this.container.addChild(object);
    }); // Translate to matter js coordinate system

    this.container.pivot.set(this.container.width / 2, this.container.height / 2);
  }
}));
// CONCATENATED MODULE: ./components/physics.js

/* harmony default export */ var components_physics = (external_ces_["Component"].extend({
  name: 'physics',
  init: function init(body) {
    this.body = body;
  }
}));
// CONCATENATED MODULE: ./components/car.js

/*
 * Component that represents car
 */

/* harmony default export */ var components_car = (external_ces_["Component"].extend({
  name: 'car',
  force: 0.0,
  init: function init(chassis, genome, car, frontWheel, backWheel) {
    this.genome = genome;
    this.chassis = chassis;
    this.car = car;
    this.fitness = 0;
    this.frontWheel = frontWheel;
    this.backWheel = backWheel;
  },
  getAngle: function getAngle(wheel, angle) {
    if (angle < wheel.angleFrom) angle = wheel.angleFrom;
    if (angle > wheel.angleTo) angle = wheel.angleTo;
    return angle;
  },
  steer: function steer(angle) {
    var _this = this;

    this.wheels.forEach(function (wheel) {
      wheel.angle = _this.getAngle(wheel, angle);
    });
  }
}));
// CONCATENATED MODULE: ./entities/raySensor.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import * as PolyK from 'polyk'
// import * as _ from 'lodash'

var raySensor_Sensor =
/*#__PURE__*/
function () {
  function Sensor(endPoint, ignoredIDs, world) {
    _classCallCheck(this, Sensor);

    this.endPoint = endPoint;
    this.world = world;
    this.shortest = null;
    this.endPoint[0] *= 800;
    this.endPoint[1] *= 800;
    this.ignoredIDs = new Set(ignoredIDs);
    var t = this;
    this.result = new external_p2_["RaycastResult"]();
    this.ray = new external_p2_["Ray"]({
      mode: external_p2_["Ray"].ALL,
      from: t.origin,
      to: t.endPoint,
      callback: function callback(result) {
        if (t.ignoredIDs.has(result.body.id)) return;
        var distance = result.getHitDistance(t.ray);

        if (distance < t.shortest.distance) {
          t.shortest.distance = distance;
          t.shortest.body = result.body;
        }
      }
    });
  }

  _createClass(Sensor, [{
    key: "cast",
    value: function cast(origin, rotation) {
      var c = Math.cos(rotation);
      var s = Math.sin(rotation);
      var rotatedEndPoint = [this.endPoint[0] * c - this.endPoint[1] * s, this.endPoint[0] * s + this.endPoint[1] * c];
      this.ray.from = origin;
      this.ray.to = [origin[0] + rotatedEndPoint[0], origin[1] + rotatedEndPoint[1]];
      this.calculateShortest();
    }
  }, {
    key: "calculateShortest",
    value: function calculateShortest() {
      this.shortest = {
        distance: Infinity
      };
      this.ray.update();
      this.world.raycast(this.result, this.ray);
      this.result.reset();
    }
  }]);

  return Sensor;
}();
// CONCATENATED MODULE: ./entities/car.js







/* harmony default export */ var entities_car = (function (x, y, world, genome, loader) {
  var entity = new external_ces_["Entity"]();

  if (loader !== undefined && loader.resources['./static/chassis.png'] !== undefined) {
    var graphicsComponent = new components_graphics([new external_pixi_js_["Sprite"](loader.resources['./static/chassis.png'].texture)]);
    entity.addComponent(graphicsComponent);
  }

  var body = new external_p2_["Body"]({
    mass: 2000,
    position: [x, y],
    allowSleep: false
  });
  body.addShape(new external_p2_["Box"]({
    width: 100,
    height: 200
  }));
  entity.addComponent(new components_physics(body));
  var car = new external_p2_["TopDownVehicle"](body);
  var frontWheel = car.addWheel({
    localPosition: [0, 100]
  });
  var backWheel = car.addWheel({
    localPosition: [0, -100]
  });
  entity.addComponent(new components_car(entity, genome, car, frontWheel, backWheel));
  world.addEntity(entity);
  var carComponent = entity.getComponent('car');
  var p2World = entity.getComponent('physics').world;
  car.addToWorld(p2World);
  carComponent.sensors = [];

  for (var _startingAngle = 210; _startingAngle <= 330; _startingAngle += 30) {
    carComponent.sensors.push(new raySensor_Sensor([Math.cos(_startingAngle * (Math.PI / 180)), Math.sin(_startingAngle * (Math.PI / 180))], [body.id], p2World));
  }

  var startingAngle = 90;
  carComponent.sensors.push(new raySensor_Sensor([Math.cos(startingAngle * (Math.PI / 180)), Math.sin(startingAngle * (Math.PI / 180))], [body.id], p2World));
  return entity;
});
// CONCATENATED MODULE: ./entities/wall.js






function rectangle(x, y, w, h, color) {
  var result = new external_pixi_js_["Graphics"]();
  result.beginFill(color, 1);
  result.drawRect(x, y, w, h);
  result.position.set(x, y);
  return result;
}

/* harmony default export */ var wall = (function (x, y, w, h, world) {
  var entity = new external_ces_["Entity"]();
  entity.addComponent(new components_graphics([rectangle(0, 0, w, h, 0x00FF00)]));
  var body = new external_p2_["Body"]({
    mass: 0,
    position: [x, y]
  });
  body.addShape(new external_p2_["Box"]({
    width: w,
    height: h
  }));
  entity.addComponent(new components_physics(body // Matter.Bodies.rectangle(x, y, w, h, {
  //   isStatic: true
  // })
  ));
  world.addEntity(entity);
  return entity;
});
// CONCATENATED MODULE: ./entities/physicsGroup.js
function physicsGroup_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function physicsGroup_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function physicsGroup_createClass(Constructor, protoProps, staticProps) { if (protoProps) physicsGroup_defineProperties(Constructor.prototype, protoProps); if (staticProps) physicsGroup_defineProperties(Constructor, staticProps); return Constructor; }

var PhysicsGroup =
/*#__PURE__*/
function () {
  function PhysicsGroup(bodies) {
    physicsGroup_classCallCheck(this, PhysicsGroup);

    var assert = __webpack_require__(4);

    assert(bodies instanceof Array);
    this.bodies = bodies;
    this.bodies.forEach(function (el) {
      el.oldOrigin = el.body.position.slice(0);
    });
  }
  /**
   * moves all object by relative offset
   */


  physicsGroup_createClass(PhysicsGroup, [{
    key: "move",
    value: function move(offsetX, offsetY) {
      this.bodies.forEach(function (el) {
        el.body.position[0] += offsetX;
        el.body.position[1] += offsetY;
      });
    }
  }, {
    key: "moveAbsolute",
    value: function moveAbsolute(x, y) {
      this.bodies.forEach(function (el) {
        el.body.position = el.oldOrigin.slice(0);
      });
      this.move(x, y);
    }
  }]);

  return PhysicsGroup;
}();


// CONCATENATED MODULE: ./entities/roadPart.js

/* harmony default export */ var roadPart = (function (x, y, world, walls) {
  var wallPhysicsComponent = walls.map(function (wall) {
    return wall.getComponent('physics');
  });
  return new PhysicsGroup(wallPhysicsComponent);
});
// EXTERNAL MODULE: external "chance"
var external_chance_ = __webpack_require__(3);
var external_chance_default = /*#__PURE__*/__webpack_require__.n(external_chance_);

// CONCATENATED MODULE: ./systems/roadDirector.js






function getDirection(x, y, w, h) {
  if (x > w) return 'right';
  if (y > h) return 'down';
  if (x < 0) return 'left';
  if (y < 0) return 'up';
  return 'onScreen';
}

function createGroup(walls, world) {
  var groups = [];

  for (var i = 0; i < 5; i++) {
    groups.push(roadPart(0, 0, world, walls.map(function (wallDefinition) {
      var newDefinition = wallDefinition.slice(0);
      newDefinition.push(world);
      return wall.apply(null, newDefinition);
    })));
  }

  return groups;
}

/* harmony default export */ var roadDirector = (external_ces_["System"].extend({
  getRoomID: function getRoomID() {
    return this.position[0] + ',' + this.position[1];
  },
  setup: function setup(world, startingPiece) {
    var _this = this;

    this.rooms = {};
    this.STARTING_PIECE = startingPiece || 'Box';
    this.world = world;
    this.rng = new external_chance_default.a('RNG0,0');
    this.position = [0, 0];
    this.parts = {
      '- up': {
        'group': createGroup([[400, 250, 800, 20], [400, 550, 800, 20]], this.world),
        'possibleParts': {
          'left': ['upside L'],
          'right': ['reverse upside L']
        }
      },
      '- down': {
        'group': createGroup([[400, 250, 800, 20], [400, 550, 800, 20]], this.world),
        'possibleParts': {
          'left': ['L'],
          'right': ['reverse L']
        }
      },
      'L': {
        'group': createGroup([[690, 250, 300, 20], [250, 160, 20, 800], [550, 50, 20, 400], [650, 550, 800, 20]], this.world),
        'possibleParts': {
          'up': ['I advanced left'],
          'right': ['- down']
        }
      },
      'reverse L': {
        'group': createGroup([[110, 250, 300, 20], [250, 0, 20, 490], [550, 0, 20, 1100], [250, 550, 620, 20]], this.world),
        'possibleParts': {
          'up': ['I advanced left'],
          'left': ['- down']
        }
      },
      'upside L': {
        'group': createGroup([[690, 550, 300, 20], [550, 740, 20, 400], [250, 640, 20, 800], [650, 250, 800, 20]], this.world),
        'possibleParts': {
          'down': ['I advanced left'],
          'right': ['- up']
        }
      },
      'reverse upside L': {
        'group': createGroup([[110, 550, 300, 20], [250, 740, 20, 400], [550, 640, 20, 800], [150, 250, 800, 20]], this.world),
        'possibleParts': {
          'down': ['I advanced right'],
          'left': ['- up']
        }
      },
      'I basic': {
        'group': createGroup([[250, 0, 20, 800], [550, 0, 20, 800]], this.world),
        'possibleParts': {
          'up': ['I basic'],
          'down': ['I basic']
        }
      },
      'I with obstructions': {
        'group': createGroup([[250, 0, 20, 800], [550, 0, 20, 800], [300, 100, 100, 20], [500, 600, 100, 20]], this.world),
        'possibleParts': {
          'up': ['I with obstructions'],
          'down': ['I with obstructions']
        }
      },
      'I advanced right': {
        'group': createGroup([[250, 400, 20, 800], [550, 400, 20, 800]], this.world),
        'possibleParts': {
          'up': ['reverse upside L'],
          'down': ['reverse L']
        }
      },
      'I advanced left': {
        'group': createGroup([[250, 400, 20, 800], [550, 400, 20, 800]], this.world),
        'possibleParts': {
          'up': ['upside L'],
          'down': ['L']
        }
      }
    };
    Object.keys(this.parts).forEach(function (key) {
      // For debugging purposes
      _this.parts[key].name = key;

      if (key !== _this.STARTING_PIECE) {
        _this.parts[key]['group'].forEach(function (part) {
          return part.moveAbsolute(50000, 50000);
        });
      }
    });
    this.currentPart = this.parts[this.STARTING_PIECE];
    this.rooms[this.getRoomID()] = {
      entryPoint: [400, 400],
      distance: 0
    };
    Object.keys(this.currentPart['possibleParts']).forEach(function (direction, index) {
      var dir = [0, 0];
      if (direction === 'up') dir[1] += 1;
      if (direction === 'down') dir[1] -= 1;
      if (direction === 'left') dir[0] -= 1;
      if (direction === 'right') dir[0] += 1;
      var pos = [_this.position[0] + dir[0], _this.position[1] + dir[1]];
      var rng = new external_chance_default.a('RNG' + pos[0] + ',' + pos[1]);
      var piece = rng.pickone(_this.currentPart['possibleParts'][direction]);

      _this.parts[piece]['group'][index + 1].moveAbsolute(dir[0] * 800, dir[1] * 800);
    });
  },
  reset: function reset(startingPiece) {
    var _this2 = this;

    this.STARTING_PIECE = startingPiece || this.STARTING_PIECE;
    this.rng = new external_chance_default.a('RNG0,0');
    this.position = [0, 0];
    this.rooms = {};
    this.rooms[this.getRoomID()] = {
      entryPoint: [400, 400],
      distance: 0
    };
    Object.keys(this.parts).forEach(function (key) {
      _this2.parts[key]['group'].forEach(function (part) {
        return part.moveAbsolute(50000, 50000);
      });
    });
    this.currentPart = this.parts[this.STARTING_PIECE];
    this.currentPart['group'][0].moveAbsolute(0, 0);
    Object.keys(this.currentPart['possibleParts']).forEach(function (direction, index) {
      var dir = [0, 0];
      if (direction === 'up') dir[1] += 1;
      if (direction === 'down') dir[1] -= 1;
      if (direction === 'left') dir[0] -= 1;
      if (direction === 'right') dir[0] += 1;
      var pos = [_this2.position[0] + dir[0], _this2.position[1] + dir[1]];
      var rng = new external_chance_default.a('RNG' + pos[0] + ',' + pos[1]);
      var piece = rng.pickone(_this2.currentPart['possibleParts'][direction]);

      _this2.parts[piece]['group'][index + 1].moveAbsolute(dir[0] * 800, dir[1] * 800);
    });
  },
  setCar: function setCar(car) {
    this.car = car;
  },
  getCarPosition: function getCarPosition() {
    if (this.car != null) {
      var body = this.car.getComponent('physics').body;
      return body.position;
    }

    return null;
  },
  swapNextRoadPart: function swapNextRoadPart(direction) {
    var _this3 = this;

    if (this.currentPart === undefined) return;
    var possiblePieces = this.currentPart['possibleParts'][direction];
    if (possiblePieces.length === 0 || possiblePieces === undefined) return;
    if (direction === 'up') this.position[1] += 1;
    if (direction === 'down') this.position[1] -= 1;
    if (direction === 'left') this.position[0] -= 1;
    if (direction === 'right') this.position[0] += 1;
    this.currentPart['group'].forEach(function (part) {
      return part.moveAbsolute(50000, 50000);
    });
    this.rng = new external_chance_default.a('RNG' + this.position[0] + ',' + this.position[1]);

    if (this.position[0] === 0 && this.position[1] === 0) {
      this.currentPart = this.parts[this.STARTING_PIECE];
    } else {
      this.currentPart = this.parts[this.rng.pickone(possiblePieces)];
    }

    this.currentPart['group'][0].moveAbsolute(0, 0);
    Object.keys(this.currentPart['possibleParts']).forEach(function (direction, index) {
      var dir = [0, 0];
      if (direction === 'up') dir[1] += 1;
      if (direction === 'down') dir[1] -= 1;
      if (direction === 'left') dir[0] -= 1;
      if (direction === 'right') dir[0] += 1;
      var pos = [_this3.position[0] + dir[0], _this3.position[1] + dir[1]];
      var rng = new external_chance_default.a('RNG' + pos[0] + ',' + pos[1]);
      var piece = rng.pickone(_this3.currentPart['possibleParts'][direction]);

      _this3.parts[piece]['group'][index + 1].moveAbsolute(dir[0] * 800, dir[1] * 800);
    });
    this.moveCarBackToScreen(direction);
  },
  moveCarBackToScreen: function moveCarBackToScreen(direction) {
    var body = this.car.getComponent('physics').body;
    var newPos = [0, 0];

    if (direction === 'down') {
      newPos = [body.position[0], 0];
    } else if (direction === 'up') {
      newPos = [body.position[0], 800];
    } else if (direction === 'left') {
      newPos = [800, body.position[1]];
    } else if (direction === 'right') {
      newPos = [0, body.position[1]];
    }

    body.position = newPos;
    this.rooms[this.getRoomID()] = {
      entryPoint: body.position.slice(0),
      distance: 0
    };
  },
  switchRoom: function switchRoom(piece) {
    var _this4 = this;

    this.currentPart['group'].forEach(function (part) {
      return part.moveAbsolute(50000, 50000);
    });
    this.currentPart = this.parts[piece];
    this.parts[piece]['group'][0].moveAbsolute(0, 0);
    Object.keys(this.currentPart['possibleParts']).forEach(function (direction, index) {
      var dir = [0, 0];
      if (direction === 'up') dir[1] += 1;
      if (direction === 'down') dir[1] -= 1;
      if (direction === 'left') dir[0] -= 1;
      if (direction === 'right') dir[0] += 1;
      var pos = [_this4.position[0] + dir[0], _this4.position[1] + dir[1]];
      var rng = new external_chance_default.a('RNG' + pos[0] + ',' + pos[1]);
      var piece = rng.pickone(_this4.currentPart['possibleParts'][direction]);

      _this4.parts[piece]['group'][index + 1].moveAbsolute(dir[0] * 800, dir[1] * 800);
    });
  },
  update: function update(dt) {
    var _this5 = this;

    if (this.currentPart === undefined) {
      this.currentPart = this.parts[this.STARTING_PIECE];
    }

    var pos = this.getCarPosition();
    this.rooms[this.getRoomID()].distance = external_p2_["vec2"].distance(this.rooms[this.getRoomID()].entryPoint, pos);
    this.car.getComponent('car').fitness = 0;
    Object.keys(this.rooms).forEach(function (key) {
      _this5.car.getComponent('car').fitness += _this5.rooms[key].distance;
    });
    var options = this.car.getComponent('car').options;

    if (options && options.player) {
      this.car.getComponent('car').fitness = options.fitness;
      this.switchRoom(options.piece);
      return;
    }

    if (pos !== null) {
      var direction = getDirection(pos[0], pos[1], 800, 800);

      if (direction !== 'onScreen') {
        this.swapNextRoadPart(direction);
      }
    }
  }
}));
// CONCATENATED MODULE: ./main.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return main_Simulation; });
function main_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function main_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function main_createClass(Constructor, protoProps, staticProps) { if (protoProps) main_defineProperties(Constructor.prototype, protoProps); if (staticProps) main_defineProperties(Constructor, staticProps); return Constructor; }








var CES = __webpack_require__(1);

function fillNaN(object, value) {
  function replaceNaN(x) {
    if (isNaN(x)) {
      return value;
    }

    return x;
  }

  var keys = Object.keys(object);

  for (var i in keys) {
    if (typeof object[keys[i]] === 'number' && isNaN(object[keys[i]])) {
      object[keys[i]] = value;
    } else if (object[keys[i]] !== null && object[keys[i]].constructor === Float32Array) {
      for (var j = 0; j < object[keys[i]].length; j++) {
        object[keys[i]][j] = replaceNaN(object[keys[i]][j]);
      }
    }
  }
}
/**
 * Main class of simulation
 */


var main_Simulation =
/*#__PURE__*/
function () {
  function Simulation(frames, canvasElement, loader) {
    main_classCallCheck(this, Simulation);

    this.time = frames;
    this.canvasElement = canvasElement;
    this.loader = loader;
  }

  main_createClass(Simulation, [{
    key: "init",
    value: function init(canvas, startingPiece) {
      if (this.world === undefined) {
        this.world = new CES.World();

        if (canvas !== undefined) {
          this.renderer = new systems_graphics();
          this.renderer.setCanvas(canvas);
          this.renderer.draw = true;
          this.world.addSystem(this.renderer);
        }

        this.physicsSystem = new physics();
        this.world.addSystem(this.physicsSystem);
        var carSystem = new systems_car();
        this.world.addSystem(carSystem);
        this.car = entities_car(400.0, 400.0, this.world, this.genome, this.loader);
        this.roadDirector = new roadDirector();
        this.roadDirector.setup(this.world, startingPiece);
        this.roadDirector.setCar(this.car);
        this.world.addSystem(this.roadDirector);
      } else {
        this.car.getComponent('car').genome = this.genome;
        this.roadDirector.reset(startingPiece);
      }

      this.lastDt = 0;
    }
  }, {
    key: "evaluate",
    value: function evaluate(genome, startingPiece, options) {
      this.destroy();
      this.genome = genome;
      this.init(this.canvasElement, startingPiece);
      this.acc = 0;
      this.lastDt = null;
      var t = this;
      this.car.getComponent('car').options = options || {};
      return new Promise(function (resolve) {
        t.onFinish = resolve;
      });
    }
  }, {
    key: "fitness",
    value: function fitness() {
      return this.car.getComponent('car').fitness;
    }
  }, {
    key: "currentPart",
    value: function currentPart() {
      return this.roadDirector.currentPart.name;
    }
  }, {
    key: "isRunning",
    value: function isRunning() {
      return this.acc < this.time && this.car.getComponent('physics').body.sleepState !== external_p2_["Body"].SLEEPING;
    }
  }, {
    key: "evalGenome",
    value: function evalGenome(dt, genome, startingPiece) {
      this.evaluate(genome, startingPiece);

      while (this.isRunning()) {
        this.update(dt);
      }

      return this.car.getComponent('car').fitness;
    }
    /**
     * Main simulation loop
     */

  }, {
    key: "update",
    value: function update(dt) {
      if (this.lastDt === null) this.lastDt = dt;
      this.acc += dt;
      var currentFitness = this.car.getComponent('car').fitness;

      if (this.isRunning()) {
        this.world.update(dt);
      } else {
        this.onFinish(currentFitness);
      }
    }
    /**
     * Called on component destruction
     */

  }, {
    key: "destroy",
    value: function destroy() {
      if (this.world !== undefined) {
        this.car.getComponent('car').fitness = 0;
        this.car.getComponent('car').frontWheel.steerValue = 0;
        var body = this.car.getComponent('physics').body;
        fillNaN(body, 0.0);
        body.allowSleep = false;

        if (body.sleepState === external_p2_["Body"].SLEEPING) {
          body.wakeUp();
        }

        body.setZeroForce();
        body.position = [this.position[0], this.position[1]];
        body.angularVelocity = 0;
        body.velocity = [0, 0];
        body.angle = 0;
        this.roadDirector.reset();
      } else {
        this.position = [400, 400];
        this.velocity = [0, 0];
      }
    }
  }]);

  return Simulation;
}();



/***/ })
/******/ ]);
});