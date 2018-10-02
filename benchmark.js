const jsdom = require('jsdom').JSDOM;

const dom = new jsdom('<html><body></body></html>')
global.document = dom.window.document
global.window = dom.window


global.navigator = {
    userAgent: 'node.js'
}

const benchmark = new require('nodemark')
const Simulation = require('./main.js').default
const NEAT = require('neataptic')
const fs = require('fs')

const neat = new NEAT.Neat(
    37,
    6, // LEFT, RIGHT, FORWARD, BACKWARDS, BREAK
    null,
    {
        popsize: 8,
        mutation: NEAT.methods.mutation.ALL,
        mutationRate: 0.25,
        network: new NEAT.architect.Random(
            37,
            128,
            6
        )
    }
)

if (!fs.existsSync('population.json')) {
	fs.writeFileSync('population.json', JSON.stringify(neat.export()))
} else {
	const jsonData = fs.readFileSync('population.json')
	neat.import(JSON.parse(jsonData))
}

let sim = new Simulation(null, 60)
function generation() {
	for (let i in neat.population) {
		sim.evalGenome(1 / 30.0, neat.population[i])
	}
}

let result = benchmark(generation)
console.log(result)
console.log(result.milliseconds() + ' ms')
