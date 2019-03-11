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
    tokens && tokens.split(' ').forEach(token => {
        const change = (token, value) => items[token] = value;
        const values = {
            mastersword: ['sword', 2],
            bottle: ['bottle', 1],
            glove: ['glove', 1],
            mitt: ['glove', 2]
        };
        change(...(values[token] || [token, true]));
    });

describe('World', () => {

    let mode;
    let world;
    let items;

    beforeEach(() => {
        mode = { open: true };
        world = create_world(mode).world;
        items = create_items().items;
    });

    context('regions', () => {

        with_cases(
        ['lightworld_deathmountain_west', null, false],
        ['lightworld_deathmountain_west', 'flute', true],
        ['lightworld_deathmountain_west', 'glove lamp', true],

        ['lightworld_deathmountain_east', null, false],
        ['lightworld_deathmountain_east', 'hammer mirror flute', true],
        ['lightworld_deathmountain_east', 'hammer mirror glove lamp', true],
        ['lightworld_deathmountain_east', 'hookshot flute', true],
        ['lightworld_deathmountain_east', 'hookshot glove lamp', true],

        ['lightworld_northwest', null, 'always'],

        ['lightworld_northeast', null, 'always'],

        ['lightworld_south', null, 'always'],

        ['castle_escape', null, 'always'],

        (region, progress, state) => it(`can enter ${region} ${is(state)} ${_with(progress)}`, () => {
            update(progress, items);
            state === 'always' ?
                expect(world[region].can_enter).to.be.falsy :
                world[region].can_enter({ items, world }).should.equal(state);
        }));

        with_cases(
        ['lightworld_deathmountain_west', null, false],
        ['lightworld_deathmountain_west', 'glove', true],

        ['lightworld_deathmountain_east', null, false],
        ['lightworld_deathmountain_east', 'hammer mirror glove', true],
        ['lightworld_deathmountain_east', 'hookshot glove', true],

        (region, progress, state) => it(`can enter dark ${region} ${is(state)} ${_with(progress)}`, () => {
            update(progress, items);
            world[region].can_enter_dark({ items, world }).should.equal(state);
        }));

    });

    context('overworld locations', () => {

        with_cases(
        ['lightworld_deathmountain_west', 'ether', null, false],
        ['lightworld_deathmountain_west', 'ether', 'book mirror', 'viewable'],
        ['lightworld_deathmountain_west', 'ether', 'book hammer hookshot', 'viewable'],
        ['lightworld_deathmountain_west', 'ether', 'book mirror mastersword', true],
        ['lightworld_deathmountain_west', 'ether', 'book hammer hookshot mastersword', true],
        ['lightworld_deathmountain_west', 'spectacle_rock', null, 'viewable'],
        ['lightworld_deathmountain_west', 'spectacle_rock', 'mirror', true],
        ['lightworld_deathmountain_west', 'spectacle_cave', null, 'always'],
        ['lightworld_deathmountain_west', 'old_man', null, 'dark'],
        ['lightworld_deathmountain_west', 'old_man', 'lamp', true],

        ['lightworld_deathmountain_east', 'island_dm', null, 'viewable'],
        ['lightworld_deathmountain_east', 'island_dm', 'mitt moonpearl mirror', true],
        ['lightworld_deathmountain_east', 'spiral', null, 'always'],
        ['lightworld_deathmountain_east', 'paradox', null, 'always'],

        ['lightworld_northwest', 'altar', null, false],
        ['lightworld_northwest', 'altar', 'book', 'viewable'],
        ['lightworld_northwest', 'mushroom', null, 'always'],
        ['lightworld_northwest', 'hideout', null, 'always'],
        ['lightworld_northwest', 'tree', null, 'viewable'],
        ['lightworld_northwest', 'graveyard_w', null, false],
        ['lightworld_northwest', 'graveyard_w', 'boots', true],
        ['lightworld_northwest', 'kid', null, false],
        ['lightworld_northwest', 'kid', 'bottle', true],
        ['lightworld_northwest', 'well', null, 'always'],
        ['lightworld_northwest', 'thief_hut', null, 'always'],
        ['lightworld_northwest', 'bottle', null, 'always'],
        ['lightworld_northwest', 'chicken', null, 'always'],
        ['lightworld_northwest', 'tavern', null, 'always'],

        ['lightworld_northeast', 'zora', null, false],
        ['lightworld_northeast', 'zora', 'flippers', true],
        ['lightworld_northeast', 'zora', 'glove', true],
        ['lightworld_northeast', 'river', null, false],
        ['lightworld_northeast', 'river', 'glove', 'viewable'],
        ['lightworld_northeast', 'river', 'flippers', true],
        ['lightworld_northeast', 'fairy_lw', null, false],
        ['lightworld_northeast', 'fairy_lw', 'flippers', true],
        ['lightworld_northeast', 'witch', null, false],
        ['lightworld_northeast', 'witch', 'mushroom', true],
        ['lightworld_northeast', 'sahasrahla_hut', null, 'always'],

        ['lightworld_south', 'maze', null, 'always'],
        ['lightworld_south', 'library', null, 'viewable'],
        ['lightworld_south', 'library', 'boots', true],
        ['lightworld_south', 'grove_n', null, false],
        ['lightworld_south', 'grove_n', 'shovel', true],
        ['lightworld_south', 'link_house', null, 'always'],
        ['lightworld_south', 'desert_w', null, 'viewable'],
        ['lightworld_south', 'aginah', null, 'always'],
        ['lightworld_south', 'dam', null, 'always'],
        ['lightworld_south', 'lake_sw', null, 'always'],
        ['lightworld_south', 'island_lake', null, 'viewable'],
        ['lightworld_south', 'hobo', null, false],
        ['lightworld_south', 'hobo', 'flippers', true],
        ['lightworld_south', 'ice_cave', null, 'always'],

        ['castle_escape', 'sanctuary', null, 'always'],
        ['castle_escape', 'escape_side', null, 'dark'],
        ['castle_escape', 'escape_side', 'lamp', 'possible'],
        ['castle_escape', 'escape_side', 'glove', true],
        ['castle_escape', 'escape_dark', null, 'dark'],
        ['castle_escape', 'escape_dark', 'lamp', true],
        ['castle_escape', 'castle', null, 'always'],
        ['castle_escape', 'secret', null, 'always'],

        (region, name, progress, state) => it(`can access ${region} - ${name} ${is(state)} ${_with(progress)}`, () => {
            update(progress, items);
            state === 'always' ?
                expect(world[region].locations[name].can_access).to.be.falsy :
                world[region].locations[name].can_access({ items, world, mode }).should.equal(state);
        }));

    });

});
