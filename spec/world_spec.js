const { with_cases, helpers } = require('./spec_helper');

const chai = require('chai');
const expect = chai.expect;
chai.use(helpers);
chai.should();

const create_world = require('../src/world');

describe('World', () => {

    let world;

    beforeEach(() => {
        world = create_world({ open: true }).world;
    });

    context('regions', () => {

        with_cases(
        'lightworld_northwest',
        'lightworld_northeast',
        'lightworld_south',
        'castle_escape',
        (region) => it(`can enter ${region} "always"`, () => {
            expect(world[region].can_enter).to.be.falsy;
        }));

    });

    context('overworld locations', () => {

        with_cases(
        ['lightworld_northwest', 'mushroom'],
        ['lightworld_northwest', 'hideout'],
        ['lightworld_northwest', 'well'],
        ['lightworld_northwest', 'thief_hut'],
        ['lightworld_northwest', 'bottle'],
        ['lightworld_northwest', 'chicken'],
        ['lightworld_northwest', 'tavern'],
        ['lightworld_northeast', 'sahasrahla_hut'],
        ['lightworld_south', 'maze'],
        ['lightworld_south', 'link_house'],
        ['lightworld_south', 'aginah'],
        ['lightworld_south', 'dam'],
        ['lightworld_south', 'lake_sw'],
        ['lightworld_south', 'ice_cave'],
        ['castle_escape', 'sanctuary'],
        ['castle_escape', 'castle'],
        ['castle_escape', 'secret'],
        (region, name) => it(`can access ${region} - ${name} "always"`, () => {
            expect(world[region].locations[name].can_access).to.be.falsy;
        }));

    });

});
