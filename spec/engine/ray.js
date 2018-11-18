const CES = require('ces');
const PhysicsSystem = require('../../systems/physics').default;
const RaySensor = require('../../entities/raySensor').Sensor;
const p2 = require('p2');
const PhysicsComponent = require('../../components/physics').default;

describe('Raycasting', function() {
    var world;
    var physicsWorld;

    beforeEach(function() {
        world = new CES.World();
        let physicsSystem = new PhysicsSystem();
        world.addSystem(physicsSystem);
        physicsWorld = physicsSystem.p2World;
    });

    it("Should return Infinity when it doesn't hit anything", function() {
        let sensor = new RaySensor([0, 800], [], physicsWorld);
        sensor.cast([0, 0], 0);
        expect(sensor.shortest.distance).toBe(Infinity);
    });

    it("Should return actual distance when it hits", function() {
        let sensor = new RaySensor([0, 800], [], physicsWorld);

        let entity = new CES.Entity();
        let body = new p2.Body({
            mass: 0,
            position: [0, 200]
        });

        body.addShape(new p2.Box({
                width: 800,
                height: 10
            }));

        entity.addComponent(new PhysicsComponent(body));
        world.addEntity(entity);
        world.update(1/30.0);
        sensor.cast([0, 0], 0);
        expect(sensor.shortest.distance).toBe(195);
    });

    it("Should return actual distance when it moves", function() {
        let sensor = new RaySensor([0, 800], [], physicsWorld);

        let entity = new CES.Entity();
        let body = new p2.Body({
            mass: 0,
            position: [0, 200]
        });

        body.addShape(new p2.Box({
            width: 800,
            height: 10
        }));

        entity.addComponent(new PhysicsComponent(body));
        world.addEntity(entity);
        sensor.cast([0, 10], 0);
        expect(sensor.shortest.distance).toBeCloseTo(185, 3);
        sensor.cast([0, 20], 0);
        expect(sensor.shortest.distance).toBeCloseTo(175, 3);
        sensor.cast([10, 20], 0);
        expect(sensor.shortest.distance).toBeCloseTo(175, 3);
    });

    it("Should return disctance even when rotated", function() {
        let sensor = new RaySensor([0, 800], [], physicsWorld);

        let entity = new CES.Entity();
        let body = new p2.Body({
            mass: 0,
            position: [200, 0]
        });

        body.addShape(new p2.Box({
            width: 10,
            height: 800
        }));

        entity.addComponent(new PhysicsComponent(body));
        world.addEntity(entity);
        sensor.cast([0, 0], -Math.PI / 2);
        expect(sensor.shortest.distance).toBeCloseTo(195, 3);
    });
});