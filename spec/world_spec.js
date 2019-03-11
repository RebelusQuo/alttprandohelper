const { with_cases, helpers } = require('./spec_helper');

const chai = require('chai');
const expect = chai.expect;
chai.use(helpers);
chai.should();

const create_world = require('../src/world');
const create_items = require('../src/items');

const is = state =>
    state === 'always' ? '"always"' : `is ${
    state === true ? 'available' :
    state === false ? 'unavailable' :
    state}`;

const _with = progress =>
    `with ${progress != null ?
        progress.replace(/ /g, ', ') :
        'nothing'}`;

const update = (tokens, items) =>
    tokens && tokens.split(' ').forEach(token => items[token] = true);

describe('World', () => {

    let world;
    let items;

    beforeEach(() => {
        world = create_world({ open: true }).world;
        items = create_items().items;
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
        ['lightworld_northwest', 'mushroom', null, 'always'],
        ['lightworld_northwest', 'hideout', null, 'always'],
        ['lightworld_northwest', 'graveyard_w', null, false],
        ['lightworld_northwest', 'graveyard_w', 'boots', true],
        ['lightworld_northwest', 'well', null, 'always'],
        ['lightworld_northwest', 'thief_hut', null, 'always'],
        ['lightworld_northwest', 'bottle', null, 'always'],
        ['lightworld_northwest', 'chicken', null, 'always'],
        ['lightworld_northwest', 'tavern', null, 'always'],

        ['lightworld_northeast', 'zora', null, false],
        ['lightworld_northeast', 'zora', 'flippers', true],
        ['lightworld_northeast', 'river', null, false],
        ['lightworld_northeast', 'river', 'flippers', true],
        ['lightworld_northeast', 'fairy_lw', null, false],
        ['lightworld_northeast', 'fairy_lw', 'flippers', true],
        ['lightworld_northeast', 'witch', null, false],
        ['lightworld_northeast', 'witch', 'mushroom', true],
        ['lightworld_northeast', 'sahasrahla_hut', null, 'always'],

        ['lightworld_south', 'maze', null, 'always'],
        ['lightworld_south', 'library', 'boots', true],
        ['lightworld_south', 'grove_n', null, false],
        ['lightworld_south', 'grove_n', 'shovel', true],
        ['lightworld_south', 'link_house', null, 'always'],
        ['lightworld_south', 'aginah', null, 'always'],
        ['lightworld_south', 'dam', null, 'always'],
        ['lightworld_south', 'lake_sw', null, 'always'],
        ['lightworld_south', 'hobo', null, false],
        ['lightworld_south', 'hobo', 'flippers', true],
        ['lightworld_south', 'ice_cave', null, 'always'],

        ['castle_escape', 'sanctuary', null, 'always'],
        ['castle_escape', 'castle', null, 'always'],
        ['castle_escape', 'secret', null, 'always'],

        (region, name, progress, state) => it(`can access ${region} - ${name} ${is(state)} ${_with(progress)}`, () => {
            update(progress, items);
            state === 'always' ?
                expect(world[region].locations[name].can_access).to.be.falsy :
                world[region].locations[name].can_access({ items }).should.equal(state);
        }));

    });

});
