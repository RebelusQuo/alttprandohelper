const { with_cases, helpers } = require('./spec_helper');
const chai_each = require('chai-each');
const _ = require('lodash');

const chai = require('chai');
const expect = chai.expect;
chai.use(helpers);
chai.use(chai_each);
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

const update = (tokens, items, world, region) =>
    tokens && tokens.split(' ').forEach(token => {
        let match;
        if (token === 'agahnim')
            world.castle_tower.completed = true;
        else if (match = token.match(/chests=(\d+)/))
            world[region].chests = +match[1];
        else {
            const change = (token, value) => items[token] = value;
            const values = {
                mastersword: ['sword', 2],
                bow: ['bow', 2],
                bottle: ['bottle', 1],
                glove: ['glove', 1],
                mitt: ['glove', 2]
            };
            change(...(values[token] || [token, true]));
        }
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

    with_cases({
        eastern: 3, desert: 2, hera: 2, darkness: 5, swamp: 6,
        skull: 2, thieves: 4, ice: 3, mire: 2, turtle: 5
    }, (region, chests) => it(`${region} starts out with its maximum ${chests} chests`, () => {
        world[region].should.include({ chests, chest_limit: chests });
    }));

    context('regions', () => {

        with_cases(
        ['eastern', null, 'always'],

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

        ['darkworld_deathmountain_west', null, false],
        ['darkworld_deathmountain_west', 'flute', true],
        ['darkworld_deathmountain_west', 'glove lamp', true],

        ['darkworld_deathmountain_east', null, false],
        ['darkworld_deathmountain_east', 'mitt hammer mirror flute', true],
        ['darkworld_deathmountain_east', 'mitt hammer mirror lamp', true],
        ['darkworld_deathmountain_east', 'mitt hookshot flute', true],
        ['darkworld_deathmountain_east', 'mitt hookshot lamp', true],

        ['darkworld_northwest', null, false],
        ['darkworld_northwest', 'moonpearl agahnim hookshot flippers', true],
        ['darkworld_northwest', 'moonpearl agahnim hookshot glove', true],
        ['darkworld_northwest', 'moonpearl agahnim hookshot hammer', true],
        ['darkworld_northwest', 'moonpearl glove hammer', true],
        ['darkworld_northwest', 'moonpearl mitt', true],

        ['darkworld_northeast', null, false],
        ['darkworld_northeast', 'agahnim', true],
        ['darkworld_northeast', 'moonpearl glove hammer', true],
        ['darkworld_northeast', 'moonpearl mitt flippers', true],

        ['darkworld_south', null, false],
        ['darkworld_south', 'moonpearl agahnim hammer', true],
        ['darkworld_south', 'moonpearl agahnim hookshot glove', true],
        ['darkworld_south', 'moonpearl agahnim hookshot flippers', true],
        ['darkworld_south', 'moonpearl glove hammer', true],
        ['darkworld_south', 'moonpearl mitt', true],

        ['darkworld_mire', null, false],
        ['darkworld_mire', 'flute mitt', true],

        (region, progress, state) => it(`can enter ${region} ${is(state)} ${_with(progress)}`, () => {
            update(progress, items, world);
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

        ['darkworld_deathmountain_west', null, false],
        ['darkworld_deathmountain_west', 'glove', true],

        ['darkworld_deathmountain_east', null, false],
        ['darkworld_deathmountain_east', 'mitt hammer mirror', true],
        ['darkworld_deathmountain_east', 'mitt hookshot', true],

        (region, progress, state) => it(`can enter dark ${region} ${is(state)} ${_with(progress)}`, () => {
            update(progress, items);
            world[region].can_enter_dark({ items, world }).should.equal(state);
        }));

    });

    context('eastern palace', () => {

        with_cases(
        ['eastern', null, false],
        ['eastern', 'bow', 'dark'],
        ['eastern', 'lamp bow', true],
        (region, progress, state) => it(`can complete ${region} ${is(state)} ${_with(progress)}`, () => {
            update(progress, items);
            world[region].can_complete({ items }).should.equal(state);
        }));

        with_cases(
        ['eastern', null, true],
        ['eastern', 'chests=2', 'possible'],
        ['eastern', 'chests=1', 'possible'],
        ['eastern', 'chests=2 lamp', true],
        ['eastern', 'chests=1 lamp bow', true],
        (region, progress, state) => it(`can progress ${region} ${is(state)} ${_with(progress)}`, () => {
            update(progress, items, world, region);
            world[region].can_progress({ items, region: world[region] }).should.equal(state);
        }));

    });

    context('overworld locations', () => {

        with_cases(
        'lightworld_deathmountain_west',
        'lightworld_deathmountain_east',
        'lightworld_northwest',
        'lightworld_northeast',
        'lightworld_south',
        'castle_escape',
        'darkworld_deathmountain_west',
        'darkworld_deathmountain_east',
        'darkworld_northwest',
        'darkworld_northeast',
        'darkworld_south',
        'darkworld_mire',
        (region) => it(`${region} locations starts out not marked`, () => {
            _.map(world[region].locations).should.each.have.property('marked').equal(false);
        }));

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
        ['lightworld_northwest', 'graveyard_n', null, false],
        ['lightworld_northwest', 'graveyard_n', 'mirror moonpearl agahnim hookshot flippers', true],
        ['lightworld_northwest', 'graveyard_n', 'mirror moonpearl agahnim hookshot glove', true],
        ['lightworld_northwest', 'graveyard_n', 'mirror moonpearl agahnim hookshot hammer', true],
        ['lightworld_northwest', 'graveyard_n', 'mirror moonpearl glove hammer', true],
        ['lightworld_northwest', 'graveyard_n', 'mirror moonpearl mitt', true],
        ['lightworld_northwest', 'graveyard_e', null, false],
        ['lightworld_northwest', 'graveyard_e', 'boots mitt', true],
        ['lightworld_northwest', 'graveyard_e', 'boots mirror moonpearl agahnim hookshot flippers', true],
        ['lightworld_northwest', 'graveyard_e', 'boots mirror moonpearl agahnim hookshot glove', true],
        ['lightworld_northwest', 'graveyard_e', 'boots mirror moonpearl agahnim hookshot hammer', true],
        ['lightworld_northwest', 'graveyard_e', 'boots mirror moonpearl glove hammer', true],
        ['lightworld_northwest', 'kid', null, false],
        ['lightworld_northwest', 'kid', 'bottle', true],
        ['lightworld_northwest', 'well', null, 'always'],
        ['lightworld_northwest', 'thief_hut', null, 'always'],
        ['lightworld_northwest', 'bottle', null, 'always'],
        ['lightworld_northwest', 'chicken', null, 'always'],
        ['lightworld_northwest', 'tavern', null, 'always'],
        ['lightworld_northwest', 'frog', null, false],
        ['lightworld_northwest', 'frog', 'moonpearl mitt', true],
        ['lightworld_northwest', 'bat', null, false],
        ['lightworld_northwest', 'bat', 'powder hammer', true],
        ['lightworld_northwest', 'bat', 'powder moonpearl mirror mitt', true],

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
        ['lightworld_south', 'grove_s', null, false],
        ['lightworld_south', 'grove_s', 'mirror moonpearl agahnim hammer', true],
        ['lightworld_south', 'grove_s', 'mirror moonpearl agahnim hookshot glove', true],
        ['lightworld_south', 'grove_s', 'mirror moonpearl agahnim hookshot flippers', true],
        ['lightworld_south', 'grove_s', 'mirror moonpearl glove hammer', true],
        ['lightworld_south', 'grove_s', 'mirror moonpearl mitt', true],
        ['lightworld_south', 'link_house', null, 'always'],
        ['lightworld_south', 'desert_w', null, 'viewable'],
        ['lightworld_south', 'desert_w', 'book', true],
        ['lightworld_south', 'desert_w', 'flute mitt mirror', true],
        ['lightworld_south', 'desert_ne', null, false],
        ['lightworld_south', 'desert_ne', 'flute mitt mirror', true],
        ['lightworld_south', 'aginah', null, 'always'],
        ['lightworld_south', 'bombos', null, false],
        ['lightworld_south', 'bombos', 'book mirror moonpearl agahnim hammer', 'viewable'],
        ['lightworld_south', 'bombos', 'book mirror moonpearl agahnim hookshot glove', 'viewable'],
        ['lightworld_south', 'bombos', 'book mirror moonpearl agahnim hookshot flippers', 'viewable'],
        ['lightworld_south', 'bombos', 'book mirror moonpearl glove hammer', 'viewable'],
        ['lightworld_south', 'bombos', 'book mirror moonpearl mitt', 'viewable'],
        ['lightworld_south', 'bombos', 'book mirror moonpearl agahnim hammer mastersword', true],
        ['lightworld_south', 'bombos', 'book mirror moonpearl agahnim hookshot glove mastersword', true],
        ['lightworld_south', 'bombos', 'book mirror moonpearl agahnim hookshot flippers mastersword', true],
        ['lightworld_south', 'bombos', 'book mirror moonpearl glove hammer mastersword', true],
        ['lightworld_south', 'bombos', 'book mirror moonpearl mitt mastersword', true],
        ['lightworld_south', 'dam', null, 'always'],
        ['lightworld_south', 'lake_sw', null, 'always'],
        ['lightworld_south', 'island_lake', null, 'viewable'],
        ['lightworld_south', 'island_lake', 'flippers moonpearl mirror agahnim', true],
        ['lightworld_south', 'island_lake', 'flippers moonpearl mirror glove hammer', true],
        ['lightworld_south', 'island_lake', 'flippers moonpearl mirror mitt', true],
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

        ['darkworld_deathmountain_west', 'spike', null, false],
        ['darkworld_deathmountain_west', 'spike', 'moonpearl hammer glove cape', true],
        ['darkworld_deathmountain_west', 'spike', 'moonpearl hammer glove byrna', true],

        ['darkworld_deathmountain_east', 'rock_hook', null, false],
        ['darkworld_deathmountain_east', 'rock_hook', 'moonpearl hookshot', true],
        ['darkworld_deathmountain_east', 'rock_boots', null, false],
        ['darkworld_deathmountain_east', 'rock_boots', 'moonpearl hookshot', true],
        ['darkworld_deathmountain_east', 'rock_boots', 'moonpearl boots', true],
        ['darkworld_deathmountain_east', 'bunny', null, false],
        ['darkworld_deathmountain_east', 'bunny', 'moonpearl', true],

        ['darkworld_northwest', 'bumper', null, 'viewable'],
        ['darkworld_northwest', 'bumper', 'glove cape', true],
        ['darkworld_northwest', 'chest_game', null, 'always'],
        ['darkworld_northwest', 'c_house', null, 'always'],
        ['darkworld_northwest', 'bomb_hut', null, 'always'],
        ['darkworld_northwest', 'purple', null, false],
        ['darkworld_northwest', 'purple', 'mitt', true],
        ['darkworld_northwest', 'pegs', null, false],
        ['darkworld_northwest', 'pegs', 'mitt hammer', true],

        ['darkworld_northeast', 'catfish', null, false],
        ['darkworld_northeast', 'catfish', 'moonpearl glove', true],
        ['darkworld_northeast', 'pyramid', null, 'always'],
        ['darkworld_northeast', 'fairy_dw', null, false],

        ['darkworld_south', 'dig_game', null, 'always'],
        ['darkworld_south', 'stumpy', null, 'always'],
        ['darkworld_south', 'swamp_ne', null, 'always'],

        ['darkworld_mire', 'mire_w', null, false],
        ['darkworld_mire', 'mire_w', 'moonpearl', true],

        (region, name, progress, state) => it(`can access ${region} - ${name} ${is(state)} ${_with(progress)}`, () => {
            update(progress, items, world);
            state === 'always' ?
                expect(world[region].locations[name].can_access).to.be.falsy :
                world[region].locations[name].can_access({ items, world, mode }).should.equal(state);
        }));

    });

});
