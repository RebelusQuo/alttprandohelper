const { with_cases, helpers } = require('./spec_helper');
const sinon = require('sinon');
const sinon_chai = require('sinon-chai');
const chai_each = require('chai-each');
const _ = require('lodash');

const a = sinon.match;
_.assign(a, { ref: a.same });

const chai = require('chai');
const expect = chai.expect;
chai.use(helpers);
chai.use(sinon_chai);
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
        let m, v;
        if (token === 'agahnim')
            world.castle_tower.completed = true;
        else if (token === 'big_key')
            world[region].big_key = true;
        else if (m = token.match(/door=(.*)/))
            _.each(m[1].split('-'), door => world[region].doors[door].opened = true);
        else if (m = token.match(/location=(.*)/))
            _.each(m[1].split('-'), location => world[region].locations[location].marked = true);
        else if (m = token.match(/(\w+)(?:-(\w+))?=(.+)/)) {
            const [, key, _region = region, value] = m;
            world[_region][key] = isNaN(v = +value) ? value : v;
            if (key === 'prize') world[_region].completed = true;
        } else {
            const change = (token, value) => items[token] = value;
            const values = {
                sword: ['sword', 1],
                mastersword: ['sword', 2],
                mirrorshield: ['shield', 3],
                bow: ['bow', 2],
                bottle: ['bottle', 1],
                glove: ['glove', 1],
                mitt: ['glove', 2]
            };
            change(...(values[token] || [token, true]));
        }
    });

const duplicate_cases = (locations, ...cases) =>
    _.flatMap(cases, _case => _.map(locations, location => [location, ..._case]));

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

    const expect_state = (region, progress, state, method) => () => {
        update(progress, items, world, region);
        state === 'always' ?
            expect(method(world[region])).to.be.falsy :
            method(world[region])({ items, world, region: world[region], mode }).should.equal(state);
    };

    const expect_can_complete_state = (region) =>
        (progress, state) => it(`can complete ${region} ${is(state)} ${_with(progress)}`,
            expect_state(region, progress, state, x => x.can_complete));

    const expect_can_progress_state = (region) =>
        (progress, state) => it(`can progress ${region} ${is(state)} ${_with(progress)}`,
            expect_state(region, progress, state, x => x.can_progress));

    const expect_region_location_can_access_state =
        (region, name, progress, state) => it(`can access ${region} - ${name} ${is(state)} ${_with(progress)}`,
            expect_state(region, progress, state, x => x.locations[name].can_access));

    context('regions', () => {

        const expect_can_enter_state = 
            (region, progress, state) => it(`can enter ${region} ${is(state)} ${_with(progress)}`, 
                expect_state(region, progress, state, x => x.can_enter));

        const expect_can_enter_dark_state =
            (region, progress, state) => it(`can enter dark ${region} ${is(state)} ${_with(progress)}`,
                expect_state(region, progress, state, x => x.can_enter_dark));

        with_cases(
        ['eastern', null, 'always'],

        ['desert', null, false],
        ['desert', 'book', true],
        ['desert', 'flute mitt mirror', true],

        ['hera', null, false],
        ['hera', 'mirror flute', true],
        ['hera', 'mirror glove lamp', true],
        ['hera', 'hookshot hammer flute', true],
        ['hera', 'hookshot hammer glove lamp', true],

        ['darkness', null, false],
        ['darkness', 'moonpearl agahnim', true],
        ['darkness', 'moonpearl glove hammer', true],
        ['darkness', 'moonpearl mitt flippers', true],

        ['swamp', null, false],
        ['swamp', 'moonpearl mirror flippers agahnim hammer', true],
        ['swamp', 'moonpearl mirror flippers agahnim hookshot', true],
        ['swamp', 'moonpearl mirror flippers glove hammer', true],
        ['swamp', 'moonpearl mirror flippers mitt', true],

        ['skull', null, false],
        ['skull', 'moonpearl agahnim hookshot flippers', true],
        ['skull', 'moonpearl agahnim hookshot glove', true],
        ['skull', 'moonpearl agahnim hookshot hammer', true],
        ['skull', 'moonpearl glove hammer', true],
        ['skull', 'moonpearl mitt', true],

        ['thieves', null, false],
        ['thieves', 'moonpearl agahnim hookshot flippers', true],
        ['thieves', 'moonpearl agahnim hookshot glove', true],
        ['thieves', 'moonpearl agahnim hookshot hammer', true],
        ['thieves', 'moonpearl glove hammer', true],
        ['thieves', 'moonpearl mitt', true],

        ['ice', null, false],
        ['ice', 'moonpearl flippers mitt firerod', true],
        ['ice', 'moonpearl flippers mitt bombos sword', true],

        ['mire', null, false],
        ['mire', 'moonpearl boots sword flute mitt', true],
        ['mire', 'moonpearl hookshot sword flute mitt', true],

        ['turtle', null, false],
        ['turtle', 'moonpearl mitt hammer somaria sword mirror flute', true],
        ['turtle', 'moonpearl mitt hammer somaria sword mirror lamp', true],
        ['turtle', 'moonpearl mitt hammer somaria sword hookshot flute', true],
        ['turtle', 'moonpearl mitt hammer somaria sword hookshot lamp', true],

        ['castle_tower', null, false],
        ['castle_tower', 'cape', true],
        ['castle_tower', 'mastersword', true],

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

        expect_can_enter_state);

        with_cases(
        ['hera', null, false],
        ['hera', 'mirror glove', true],
        ['hera', 'hookshot hammer glove', true],

        ['turtle', null, false],
        ['turtle', 'moonpearl mitt hammer somaria sword mirror', true],
        ['turtle', 'moonpearl mitt hammer somaria sword hookshot', true],

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

        expect_can_enter_dark_state);

    });

    context('eastern palace', () => {

        with_cases(
        [null, false],
        ['bow', 'dark'],
        ['lamp bow', true],
        expect_can_complete_state('eastern'));

        with_cases(
        [null, true],
        ['chests=2', 'possible'],
        ['chests=1', 'possible'],
        ['chests=2 lamp', true],
        ['chests=1 lamp bow', true],
        expect_can_progress_state('eastern'));

    });

    context('desert palace', () => {

        with_cases(
        [null, false],
        ['glove lamp sword', 'possible'],
        ['glove lamp hammer', 'possible'],
        ['glove lamp bow', 'possible'],
        ['glove lamp icerod', 'possible'],
        ['glove lamp somaria', 'possible'],
        ['glove lamp byrna', 'possible'],
        ['glove firerod', 'possible'],
        ['glove lamp sword boots', true],
        ['glove lamp hammer boots', true],
        ['glove lamp bow boots', true],
        ['glove lamp icerod boots', true],
        ['glove lamp somaria boots', true],
        ['glove lamp byrna boots', true],
        ['glove firerod boots', true],
        expect_can_complete_state('desert'));

        with_cases(
        [null, 'possible'],
        ['boots', true],
        ['chests=1 boots glove lamp', true],
        ['chests=1 boots glove firerod', true],
        expect_can_progress_state('desert'));

    });

    context('tower of hera', () => {

        with_cases(
        [null, false],
        ['sword', 'possible'],
        ['hammer', 'possible'],
        ['sword lamp', true],
        ['sword firerod', true],
        ['hammer lamp', true],
        ['hammer firerod', true],
        expect_can_complete_state('hera'));

        with_cases(
        [null, 'possible'],
        ['lamp', true],
        ['firerod', true],
        expect_can_progress_state('hera'));

    });

    context('palace of darkness', () => {

        with_cases(
        [null, false],
        ['bow hammer', 'dark'],
        ['bow hammer lamp', true],
        expect_can_complete_state('darkness'));

        with_cases(
        [null, 'possible'],
        ['bow lamp', true],
        ['chests=1 bow lamp hammer', true],
        expect_can_progress_state('darkness'));

    });

    context('swamp palace', () => {

        with_cases(
        [null, false],
        ['hammer hookshot', true],
        expect_can_complete_state('swamp'));

        with_cases(
        [null, 'possible'],
        ['hammer', true],
        ['chests=5', false],
        ['chests=5 hammer', true],
        ['chests=4 hammer', 'possible'],
        ['chests=4 hammer hookshot', true],
        ['chests=2 hammer', false],
        ['chests=2 hammer hookshot', true],
        expect_can_progress_state('swamp'));

    });

    context('skull woods', () => {

        with_cases(
        [null, false],
        ['firerod sword', true],
        expect_can_complete_state('skull'));

        with_cases(
        [null, 'possible'],
        ['firerod', true],
        ['chests=1 firerod sword', true],
        expect_can_progress_state('skull'));

    });

    context("thieves' town", () => {

        with_cases(
        [null, false],
        ['sword', true],
        ['hammer', true],
        ['somaria', true],
        ['byrna', true],
        expect_can_complete_state('thieves'));

        with_cases(
        [null, true],
        ['chests=1', 'possible'],
        ['chests=1 hammer', true],
        expect_can_progress_state('thieves'));

    });

    context('ice palace', () => {

        with_cases(
        [null, false],
        ['hammer', 'possible'],
        ['hammer somaria', true],
        ['hammer hookshot', true],
        expect_can_complete_state('ice'));

        with_cases(
        [null, 'possible'],
        ['hammer', true],
        expect_can_progress_state('ice'));

    });

    context('misery mire', () => {

        with_cases(
        [null, false],
        ['somaria bombos', 'medallion'],
        ['somaria bombos ether quake', 'possible'],
        ['somaria bombos ether quake firerod', 'dark'],
        ['somaria bombos ether quake lamp', true],
        ['medallion=bombos somaria bombos', 'possible'],
        ['medallion=bombos somaria bombos firerod', 'dark'],
        ['medallion=bombos somaria bombos lamp', true],
        ['medallion=ether somaria ether', 'possible'],
        ['medallion=ether somaria ether firerod', 'dark'],
        ['medallion=ether somaria ether lamp', true],
        ['medallion=quake somaria quake', 'possible'],
        ['medallion=quake somaria quake firerod', 'dark'],
        ['medallion=quake somaria quake lamp', true],
        expect_can_complete_state('mire'));

        with_cases(
        [null, false],
        ['bombos', 'medallion'],
        ['bombos ether quake', 'possible'],
        ['bombos ether quake firerod', true],
        ['bombos ether quake lamp', true],
        ['chests=1 bombos ether quake', 'possible'],
        ['chests=1 bombos ether quake lamp somaria', true],
        ['medallion=bombos bombos', 'possible'],
        ['medallion=bombos bombos firerod', true],
        ['medallion=bombos bombos lamp', true],
        ['medallion=bombos chests=1 bombos', 'possible'],
        ['medallion=bombos chests=1 bombos lamp somaria', true],
        ['medallion=ether ether', 'possible'],
        ['medallion=ether ether firerod', true],
        ['medallion=ether ether lamp', true],
        ['medallion=ether chests=1 ether', 'possible'],
        ['medallion=ether chests=1 ether lamp somaria', true],
        ['medallion=quake quake', 'possible'],
        ['medallion=quake quake firerod', true],
        ['medallion=quake quake lamp', true],
        ['medallion=quake chests=1 quake', 'possible'],
        ['medallion=quake chests=1 quake lamp somaria', true],
        expect_can_progress_state('mire'));

    });

    context('turtle rock', () => {

        with_cases(
        [null, false],
        ['icerod firerod bombos', 'medallion'],
        ['icerod firerod bombos ether quake', 'possible'],
        ['icerod firerod bombos ether quake byrna', 'dark'],
        ['icerod firerod bombos ether quake cape', 'dark'],
        ['icerod firerod bombos ether quake mirrorshield', 'dark'],
        ['icerod firerod bombos ether quake byrna lamp', true],
        ['icerod firerod bombos ether quake cape lamp', true],
        ['icerod firerod bombos ether quake mirrorshield lamp', true],
        ['medallion=bombos icerod firerod bombos', 'possible'],
        ['medallion=bombos icerod firerod bombos byrna', 'dark'],
        ['medallion=bombos icerod firerod bombos cape', 'dark'],
        ['medallion=bombos icerod firerod bombos mirrorshield', 'dark'],
        ['medallion=bombos icerod firerod bombos byrna lamp', true],
        ['medallion=bombos icerod firerod bombos cape lamp', true],
        ['medallion=bombos icerod firerod bombos mirrorshield lamp', true],
        ['medallion=ether icerod firerod ether', 'possible'],
        ['medallion=ether icerod firerod ether byrna', 'dark'],
        ['medallion=ether icerod firerod ether cape', 'dark'],
        ['medallion=ether icerod firerod ether mirrorshield', 'dark'],
        ['medallion=ether icerod firerod ether byrna lamp', true],
        ['medallion=ether icerod firerod ether cape lamp', true],
        ['medallion=ether icerod firerod ether mirrorshield lamp', true],
        ['medallion=quake icerod firerod quake', 'possible'],
        ['medallion=quake icerod firerod quake byrna', 'dark'],
        ['medallion=quake icerod firerod quake cape', 'dark'],
        ['medallion=quake icerod firerod quake mirrorshield', 'dark'],
        ['medallion=quake icerod firerod quake byrna lamp', true],
        ['medallion=quake icerod firerod quake cape lamp', true],
        ['medallion=quake icerod firerod quake mirrorshield lamp', true],
        expect_can_complete_state('turtle'));

        with_cases(
        [null, false],
        ['bombos', 'medallion'],
        ['bombos ether quake', 'possible'],
        ['bombos ether quake firerod lamp', true],
        ['chests=4 bombos ether quake byrna', 'possible'],
        ['chests=4 bombos ether quake cape', 'possible'],
        ['chests=4 bombos ether quake mirrorshield', 'possible'],
        ['chests=4 bombos ether quake byrna firerod lamp', true],
        ['chests=4 bombos ether quake cape firerod lamp', true],
        ['chests=4 bombos ether quake mirrorshield firerod lamp', true],
        ['chests=2 bombos ether quake byrna', 'possible'],
        ['chests=2 bombos ether quake cape', 'possible'],
        ['chests=2 bombos ether quake mirrorshield', 'possible'],
        ['chests=2 bombos ether quake byrna firerod', 'dark'],
        ['chests=2 bombos ether quake cape firerod', 'dark'],
        ['chests=2 bombos ether quake mirrorshield firerod', 'dark'],
        ['chests=2 bombos ether quake byrna firerod lamp', true],
        ['chests=2 bombos ether quake cape firerod lamp', true],
        ['chests=2 bombos ether quake mirrorshield firerod lamp', true],
        ['chests=1 bombos ether quake byrna', 'possible'],
        ['chests=1 bombos ether quake cape', 'possible'],
        ['chests=1 bombos ether quake mirrorshield', 'possible'],
        ['chests=1 bombos ether quake byrna icerod firerod', 'dark'],
        ['chests=1 bombos ether quake cape icerod firerod', 'dark'],
        ['chests=1 bombos ether quake mirrorshield icerod firerod', 'dark'],
        ['chests=1 bombos ether quake byrna icerod firerod lamp', true],
        ['chests=1 bombos ether quake cape icerod firerod lamp', true],
        ['chests=1 bombos ether quake mirrorshield icerod firerod lamp', true],
        ['medallion=bombos bombos', 'possible'],
        ['medallion=bombos bombos firerod lamp', true],
        ['medallion=bombos chests=4 bombos byrna', 'possible'],
        ['medallion=bombos chests=4 bombos cape', 'possible'],
        ['medallion=bombos chests=4 bombos mirrorshield', 'possible'],
        ['medallion=bombos chests=4 bombos byrna firerod lamp', true],
        ['medallion=bombos chests=4 bombos cape firerod lamp', true],
        ['medallion=bombos chests=4 bombos mirrorshield firerod lamp', true],
        ['medallion=bombos chests=2 bombos byrna', 'possible'],
        ['medallion=bombos chests=2 bombos cape', 'possible'],
        ['medallion=bombos chests=2 bombos mirrorshield', 'possible'],
        ['medallion=bombos chests=2 bombos byrna firerod', 'dark'],
        ['medallion=bombos chests=2 bombos cape firerod', 'dark'],
        ['medallion=bombos chests=2 bombos mirrorshield firerod', 'dark'],
        ['medallion=bombos chests=2 bombos byrna firerod lamp', true],
        ['medallion=bombos chests=2 bombos cape firerod lamp', true],
        ['medallion=bombos chests=2 bombos mirrorshield firerod lamp', true],
        ['medallion=bombos chests=1 bombos byrna', 'possible'],
        ['medallion=bombos chests=1 bombos cape', 'possible'],
        ['medallion=bombos chests=1 bombos mirrorshield', 'possible'],
        ['medallion=bombos chests=1 bombos byrna icerod firerod', 'dark'],
        ['medallion=bombos chests=1 bombos cape icerod firerod', 'dark'],
        ['medallion=bombos chests=1 bombos mirrorshield icerod firerod', 'dark'],
        ['medallion=bombos chests=1 bombos byrna icerod firerod lamp', true],
        ['medallion=bombos chests=1 bombos cape icerod firerod lamp', true],
        ['medallion=bombos chests=1 bombos mirrorshield icerod firerod lamp', true],
        ['medallion=ether ether', 'possible'],
        ['medallion=ether ether firerod lamp', true],
        ['medallion=ether chests=4 ether byrna', 'possible'],
        ['medallion=ether chests=4 ether cape', 'possible'],
        ['medallion=ether chests=4 ether mirrorshield', 'possible'],
        ['medallion=ether chests=4 ether byrna firerod lamp', true],
        ['medallion=ether chests=4 ether cape firerod lamp', true],
        ['medallion=ether chests=4 ether mirrorshield firerod lamp', true],
        ['medallion=ether chests=2 ether byrna', 'possible'],
        ['medallion=ether chests=2 ether cape', 'possible'],
        ['medallion=ether chests=2 ether mirrorshield', 'possible'],
        ['medallion=ether chests=2 ether byrna firerod', 'dark'],
        ['medallion=ether chests=2 ether cape firerod', 'dark'],
        ['medallion=ether chests=2 ether mirrorshield firerod', 'dark'],
        ['medallion=ether chests=2 ether byrna firerod lamp', true],
        ['medallion=ether chests=2 ether cape firerod lamp', true],
        ['medallion=ether chests=2 ether mirrorshield firerod lamp', true],
        ['medallion=ether chests=1 ether byrna', 'possible'],
        ['medallion=ether chests=1 ether cape', 'possible'],
        ['medallion=ether chests=1 ether mirrorshield', 'possible'],
        ['medallion=ether chests=1 ether byrna icerod firerod', 'dark'],
        ['medallion=ether chests=1 ether cape icerod firerod', 'dark'],
        ['medallion=ether chests=1 ether mirrorshield icerod firerod', 'dark'],
        ['medallion=ether chests=1 ether byrna icerod firerod lamp', true],
        ['medallion=ether chests=1 ether cape icerod firerod lamp', true],
        ['medallion=ether chests=1 ether mirrorshield icerod firerod lamp', true],
        ['medallion=quake quake', 'possible'],
        ['medallion=quake quake firerod lamp', true],
        ['medallion=quake chests=4 quake byrna', 'possible'],
        ['medallion=quake chests=4 quake cape', 'possible'],
        ['medallion=quake chests=4 quake mirrorshield', 'possible'],
        ['medallion=quake chests=4 quake byrna firerod lamp', true],
        ['medallion=quake chests=4 quake cape firerod lamp', true],
        ['medallion=quake chests=4 quake mirrorshield firerod lamp', true],
        ['medallion=quake chests=2 quake byrna', 'possible'],
        ['medallion=quake chests=2 quake cape', 'possible'],
        ['medallion=quake chests=2 quake mirrorshield', 'possible'],
        ['medallion=quake chests=2 quake byrna firerod', 'dark'],
        ['medallion=quake chests=2 quake cape firerod', 'dark'],
        ['medallion=quake chests=2 quake mirrorshield firerod', 'dark'],
        ['medallion=quake chests=2 quake byrna firerod lamp', true],
        ['medallion=quake chests=2 quake cape firerod lamp', true],
        ['medallion=quake chests=2 quake mirrorshield firerod lamp', true],
        ['medallion=quake chests=1 quake byrna', 'possible'],
        ['medallion=quake chests=1 quake cape', 'possible'],
        ['medallion=quake chests=1 quake mirrorshield', 'possible'],
        ['medallion=quake chests=1 quake byrna icerod firerod', 'dark'],
        ['medallion=quake chests=1 quake cape icerod firerod', 'dark'],
        ['medallion=quake chests=1 quake mirrorshield icerod firerod', 'dark'],
        ['medallion=quake chests=1 quake byrna icerod firerod lamp', true],
        ['medallion=quake chests=1 quake cape icerod firerod lamp', true],
        ['medallion=quake chests=1 quake mirrorshield icerod firerod lamp', true],
        expect_can_progress_state('turtle'));

    });

    context('agahnim encounter', () => {

        with_cases(
        [null, false],
        ['sword', 'dark'],
        ['sword lamp', true],
        expect_can_complete_state('castle_tower'));

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
        ['lightworld_deathmountain_east', 'mimic', null, false],
        ['lightworld_deathmountain_east', 'mimic', 'moonpearl mitt hammer somaria sword mirror bombos', 'medallion'],
        ['lightworld_deathmountain_east', 'mimic', 'moonpearl mitt hammer somaria sword mirror bombos ether quake', 'possible'],
        ['lightworld_deathmountain_east', 'mimic', 'moonpearl mitt hammer somaria sword mirror bombos ether quake firerod', true],
        ['lightworld_deathmountain_east', 'mimic', 'medallion-turtle=bombos moonpearl mitt hammer somaria sword mirror bombos', 'possible'],
        ['lightworld_deathmountain_east', 'mimic', 'medallion-turtle=bombos moonpearl mitt hammer somaria sword mirror bombos firerod', true],
        ['lightworld_deathmountain_east', 'mimic', 'medallion-turtle=ether moonpearl mitt hammer somaria sword mirror ether', 'possible'],
        ['lightworld_deathmountain_east', 'mimic', 'medallion-turtle=ether moonpearl mitt hammer somaria sword mirror ether firerod', true],
        ['lightworld_deathmountain_east', 'mimic', 'medallion-turtle=quake moonpearl mitt hammer somaria sword mirror quake', 'possible'],
        ['lightworld_deathmountain_east', 'mimic', 'medallion-turtle=quake moonpearl mitt hammer somaria sword mirror quake firerod', true],

        ['lightworld_northwest', 'altar', null, false],
        ['lightworld_northwest', 'altar', 'book', 'viewable'],
        ['lightworld_northwest', 'altar', 'prize-eastern=pendant prize-desert=pendant prize-hera=pendant', true],
        ['lightworld_northwest', 'altar', 'prize-eastern=pendant prize-desert=pendant prize-hera=pendant-green', true],
        ['lightworld_northwest', 'altar', 'prize-eastern=pendant prize-desert=pendant-green prize-hera=pendant', true],
        ['lightworld_northwest', 'altar', 'prize-eastern=pendant prize-desert=pendant-green prize-hera=pendant-green', true],
        ['lightworld_northwest', 'altar', 'prize-eastern=pendant-green prize-desert=pendant prize-hera=pendant', true],
        ['lightworld_northwest', 'altar', 'prize-eastern=pendant-green prize-desert=pendant prize-hera=pendant-green', true],
        ['lightworld_northwest', 'altar', 'prize-eastern=pendant-green prize-desert=pendant-green prize-hera=pendant', true],
        ['lightworld_northwest', 'altar', 'prize-eastern=pendant-green prize-desert=pendant-green prize-hera=pendant-green', true],
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
        ['lightworld_northeast', 'sahasrahla', null, false],
        ['lightworld_northeast', 'sahasrahla', 'prize-eastern=pendant-green', true],

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
        ['darkworld_northeast', 'fairy_dw', 'prize-eastern=crystal-red prize-hera=crystal-red moonpearl agahnim hammer', true],
        ['darkworld_northeast', 'fairy_dw', 'prize-eastern=crystal-red prize-hera=crystal-red moonpearl agahnim hookshot glove mirror', true],
        ['darkworld_northeast', 'fairy_dw', 'prize-eastern=crystal-red prize-hera=crystal-red moonpearl agahnim hookshot flippers mirror', true],
        ['darkworld_northeast', 'fairy_dw', 'prize-eastern=crystal-red prize-hera=crystal-red moonpearl agahnim mitt mirror', true],
        ['darkworld_northeast', 'fairy_dw', 'prize-eastern=crystal-red prize-hera=crystal-red moonpearl glove hammer', true],

        ['darkworld_south', 'dig_game', null, 'always'],
        ['darkworld_south', 'stumpy', null, 'always'],
        ['darkworld_south', 'swamp_ne', null, 'always'],

        ['darkworld_mire', 'mire_w', null, false],
        ['darkworld_mire', 'mire_w', 'moonpearl', true],

        expect_region_location_can_access_state);

    });

    context('standard mode', () => {

        beforeEach(() => {
            mode = { standard: true };
            world = create_world(mode).world;
        });

        with_cases(
        ['castle_escape', 'sanctuary'],
        ['castle_escape', 'escape_dark'],
        ['castle_escape', 'castle'],
        ['castle_escape', 'secret'],
        ['lightworld_south', 'link_house'],
        (region, name) => it(`${region} - ${name} starts out marked`, () => {
            world[region].locations[name].should.have.property('marked').equal(true);
        }));

        with_cases(
        ['castle_escape', 'escape_side', null, 'always'],
        ['castle_escape', 'escape_dark', null, 'always'],
        expect_region_location_can_access_state);

    });

    context('open keysanity mode', () => {

        beforeEach(() => {
            mode = { open: true, keysanity: true, hammery_jump: false, bomb_jump: false };
            world = create_world(mode).world;
        });

        with_cases({
            eastern: 6, desert: 6, hera: 6, darkness: 14, swamp: 10,
            skull: 7, thieves: 8, ice: 8, mire: 8, turtle: 12,
            ganon_tower: 27
        }, (region, chests) => it(`${region} starts out with its maximum ${chests} chests`, () => {
            world[region].should.include({ chests, chest_limit: chests });
        }));

        with_cases({
            eastern: 0, desert: 1, hera: 1, darkness: 6, swamp: 1,
            skull: 2, thieves: 1, ice: 2, mire: 3, turtle: 4,
            castle_escape: 1, castle_tower: 2, ganon_tower: 4
        }, (region, keys) => it(`${region} starts without keys and has a maximum of ${keys} keys`, () => {
            world[region].should.include({ keys: 0, key_limit: keys });
        }));

        const keysanity_progress_cases = [
            [[], false],
            [['dark'], 'dark'],
            [['dark', 'possible'], 'possible'],
            [['dark', 'possible', true], true],
            [['dark', 'possible', true, 'medallion'], 'medallion']
        ];

        const keysanity_can_complete = (region) => () => {
            region = world[region];
            const arg = { region };
            const can_access = sinon.fake();
            region.locations.boss.can_access = can_access;

            region.can_complete(arg);

            can_access.should.have.been.calledOnceWith(a.ref(arg));
        };

        const keysanity_can_progress = (region, n, states, state) => () => {
            region = world[region];
            const arg = { items, region };
            states = _.shuffle([ ...states, ...Array(n - states.length).fill(false)]);
            states = _.map(states, x => sinon.fake.returns(x));
            _.each(region.locations, location => location.can_access = states.pop());

            region.can_progress(arg).should.equal(state);
            _.map(region.locations, x => x.can_access).should.have.each.been.calledOnceWith(a.ref(arg));
        };

        const expect_location_can_access_state = (region) =>
            (name, progress, state) => it(`can access ${region} - ${name} ${is(state)} ${_with(progress)}`,
                expect_state(region, progress, state, x => x.locations[name].can_access));

        const expect_door_can_access_state = (region) =>
            (name, progress, state) => it(`can access ${region} - door ${name} ${is(state)} ${_with(progress)}`,
                expect_state(region, progress, state, x => x.doors[name].can_access));

        context('eastern palace', () => {

            it('can complete is same as can access boss', keysanity_can_complete('eastern'));

            with_cases(...keysanity_progress_cases, (states, state) =>
            it(`can progress use all locations and ${is(state)}${states.length ? ` when some are ${states.join(', ')}`: ''}`,
                keysanity_can_progress('eastern', 6, states, state)));

            with_cases(
            ['compass', null, 'always'],
            ['cannonball', null, 'always'],
            ['map', null, 'always'],
            ['big_chest', null, false],
            ['big_chest', 'big_key', true],
            ['big_key', null, 'dark'],
            ['big_key', 'lamp', true],
            ['boss', null, false],
            ['boss', 'big_key bow', 'dark'],
            ['boss', 'big_key bow lamp', true],
            expect_location_can_access_state('eastern'));

        });

        context('desert palace', () => {

            it('can complete is same as can access boss', keysanity_can_complete('desert'));

            with_cases(...keysanity_progress_cases, (states, state) =>
            it(`can progress use all locations and ${is(state)}${states.length ? ` when some are ${states.join(', ')}`: ''}`,
                keysanity_can_progress('desert', 6, states, state)));

            with_cases(
            ['north', null, false],
            ['north', 'door=south glove', false],
            ['north', 'glove', true],
            ['north', 'door=south keys=1 glove', true],
            ['south', null, false],
            ['south', 'door=north glove', false],
            ['south', 'glove', true],
            ['south', 'keys=1', true],
            expect_door_can_access_state('desert'));

            with_cases(
            ['map', null, 'always'],
            ['torch', null, false],
            ['torch', 'boots', true],
            ...duplicate_cases(['big_key', 'compass'],
                [null, false],
                ['door=south', true],
                ['keys=1', true],
                ['door=north glove', false],
                ['glove', true]),
            ['big_chest', null, false],
            ['big_chest', 'big_key', true],
            ['boss', null, false],
            ['boss', 'door=south keys=1 big_key glove firerod', true],
            ['boss', 'door=south keys=1 big_key glove lamp sword', true],
            ['boss', 'door=south keys=1 big_key glove lamp hammer', true],
            ['boss', 'door=south keys=1 big_key glove lamp bow', true],
            ['boss', 'door=south keys=1 big_key glove lamp icerod', true],
            ['boss', 'door=south keys=1 big_key glove lamp somaria', true],
            ['boss', 'door=south keys=1 big_key glove lamp byrna', true],
            ['boss', 'door=north big_key glove firerod', true],
            ['boss', 'door=north big_key glove lamp sword', true],
            ['boss', 'door=north big_key glove lamp hammer', true],
            ['boss', 'door=north big_key glove lamp bow', true],
            ['boss', 'door=north big_key glove lamp icerod', true],
            ['boss', 'door=north big_key glove lamp somaria', true],
            ['boss', 'door=north big_key glove lamp byrna', true],
            ['boss', 'big_key glove firerod', true],
            ['boss', 'big_key glove lamp sword', true],
            ['boss', 'big_key glove lamp hammer', true],
            ['boss', 'big_key glove lamp bow', true],
            ['boss', 'big_key glove lamp icerod', true],
            ['boss', 'big_key glove lamp somaria', true],
            ['boss', 'big_key glove lamp byrna', true],
            expect_location_can_access_state('desert'));

        });

        context('tower of hera', () => {

            it('can complete is same as can access boss', keysanity_can_complete('hera'));

            with_cases(...keysanity_progress_cases, (states, state) =>
            it(`can progress use all locations and ${is(state)}${states.length ? ` when some are ${states.join(', ')}`: ''}`,
                keysanity_can_progress('hera', 6, states, state)));

            with_cases(
            ['cage', null, 'always'],
            ['map', null, 'always'],
            ['big_key', null, false],
            ['big_key', 'keys=1 firerod', true],
            ['big_key', 'keys=1 lamp', true],
            ...duplicate_cases(['compass', 'big_chest'],
                [null, false],
                ['big_key', true]),
            ['boss', null, false],
            ['boss', 'big_key sword', true],
            ['boss', 'big_key hammer', true],
            expect_location_can_access_state('hera'));

        });

        context('palace of darkness', () => {

            it('can complete is same as can access boss', keysanity_can_complete('darkness'));

            with_cases(...keysanity_progress_cases, (states, state) =>
            it(`can progress use all locations and ${is(state)}${states.length ? ` when some are ${states.join(', ')}`: ''}`,
                keysanity_can_progress('darkness', 14, states, state)));

            with_cases(
            ['front', null, false],
            ['front', 'keys=1', true],
            ['front', 'keys=2 door=arena', true],
            ['front', 'keys=3 door=arena-big_key', true],
            ['front', 'keys=4 door=arena-big_key-hellway', true],
            ['front', 'keys=5 door=arena-big_key-hellway-maze', true],
            ['front', 'keys=6 door=arena-big_key-hellway-maze-boss', true],
            ['arena', null, false],
            ['arena', 'keys=2', true],
            ['arena', 'keys=3 door=big_key', true],
            ['arena', 'keys=2 door=front', true],
            ['arena', 'keys=3 door=front-big_key', true],
            ['arena', 'keys=1 bow hammer', true],
            ['arena', 'keys=2 door=big_key bow hammer', true],
            ['arena', 'keys=3 door=big_key-boss bow hammer', true],
            ['big_key', null, false],
            ['big_key', 'keys=2', true],
            ['big_key', 'keys=3 door=arena', true],
            ['big_key', 'keys=4 door=arena-hellway', true],
            ['big_key', 'keys=5 door=arena-hellway-maze', true],
            ['big_key', 'keys=2 door=front', true],
            ['big_key', 'keys=3 door=front-arena', true],
            ['big_key', 'keys=4 door=front-arena-hellway', true],
            ['big_key', 'keys=5 door=front-arena-hellway-maze', true],
            ['big_key', 'keys=1 bow hammer', true],
            ['big_key', 'keys=2 door=arena bow hammer', true],
            ['big_key', 'keys=3 door=arena-hellway bow hammer', true],
            ['big_key', 'keys=4 door=arena-hellway-maze bow hammer', true],
            ['big_key', 'keys=5 door=arena-hellway-maze-boss bow hammer', true],
            ...duplicate_cases(['maze', 'hellway'],
                [null, false],
                ['keys=3', true],
                ['keys=3 door=front', true],
                ['keys=4 door=front-big_key', true],
                ['keys=3 door=arena-front', true],
                ['keys=4 door=arena-front-big_key', true],
                ['keys=2 bow hammer', true],
                ['keys=3 door=big_key bow hammer', true],
                ['keys=4 door=big_key-boss bow hammer', true],
                ['keys=2 door=arena bow hammer', true],
                ['keys=3 door=arena-big_key bow hammer', true],
                ['keys=4 door=arena-big_key-boss bow hammer', true]),
            ['maze',    'keys=5 door=arena-front-big_key-hellway', true],
            ['hellway', 'keys=5 door=arena-front-big_key-maze', true],
            ['maze',    'keys=5 door=arena-big_key-hellway-boss bow hammer', true],
            ['hellway', 'keys=5 door=arena-big_key-maze-boss bow hammer', true],
            ['boss', null, false],
            ['boss', 'keys=1 bow hammer', 'dark'],
            ['boss', 'keys=1 bow hammer lamp', true],
            ['boss', 'keys=2 door=front bow hammer', 'dark'],
            ['boss', 'keys=2 door=front bow hammer lamp', true],
            ['boss', 'keys=3 door=front-arena bow hammer', 'dark'],
            ['boss', 'keys=3 door=front-arena bow hammer lamp', true],
            ['boss', 'keys=4 door=front-arena-big_key bow hammer', 'dark'],
            ['boss', 'keys=4 door=front-arena-big_key bow hammer lamp', true],
            ['boss', 'keys=5 door=front-arena-big_key-hellway bow hammer', 'dark'],
            ['boss', 'keys=5 door=front-arena-big_key-hellway bow hammer lamp', true],
            ['boss', 'keys=6 door=front-arena-big_key-hellway-maze bow hammer', 'dark'],
            ['boss', 'keys=6 door=front-arena-big_key-hellway-maze bow hammer lamp', true],
            expect_door_can_access_state('darkness'));

            with_cases(
            ['shooter', null, 'always'],
            ...duplicate_cases(['arena_ledge', 'map'],
                [null, false],
                ['bow', true]),
            ...duplicate_cases(['arena_bridge', 'stalfos'],
                [null, false],
                ['door=front', true],
                ['keys=1', true],
                ['bow hammer', true],
                ['keys=1 door=big_key bow hammer', true],
                ['keys=2 door=big_key-arena bow hammer', true],
                ['keys=3 door=big_key-arena-maze bow hammer', true],
                ['keys=4 door=big_key-arena-maze-hellway bow hammer', true],
                ['keys=5 door=big_key-arena-maze-hellway-boss bow hammer', true]),
            ['big_key', null, false],
            ['big_key', 'keys=2', true],
            ['big_key', 'keys=2 door=front', true],
            ['big_key', 'keys=3 door=front-arena', true],
            ['big_key', 'keys=4 door=front-arena-maze', true],
            ['big_key', 'keys=5 door=front-arena-maze-hellway', true],
            ['big_key', 'keys=2 door=front-big_key', true],
            ['big_key', 'keys=3 door=front-big_key-arena', true],
            ['big_key', 'keys=4 door=front-big_key-arena-maze', true],
            ['big_key', 'keys=5 door=front-big_key-arena-maze-hellway', true],
            ['big_key', 'keys=1 bow hammer', true],
            ['big_key', 'keys=2 door=arena bow hammer', true],
            ['big_key', 'keys=3 door=arena-maze bow hammer', true],
            ['big_key', 'keys=4 door=arena-maze-hellway bow hammer', true],
            ['big_key', 'keys=5 door=arena-maze-hellway-boss bow hammer', true],
            ['big_key', 'keys=1 door=big_key bow hammer', true],
            ['big_key', 'keys=2 door=big_key-arena bow hammer', true],
            ['big_key', 'keys=3 door=big_key-arena-maze bow hammer', true],
            ['big_key', 'keys=4 door=big_key-arena-maze-hellway bow hammer', true],
            ['big_key', 'keys=5 door=big_key-arena-maze-hellway-boss bow hammer', true],
            ['big_key', 'keys=2 door=front-big_key bow hammer', true],
            ['big_key', 'keys=3 door=front-big_key-arena bow hammer', true],
            ['big_key', 'keys=4 door=front-big_key-arena-maze bow hammer', true],
            ['big_key', 'keys=5 door=front-big_key-arena-maze-hellway bow hammer', true],
            ['big_key', 'keys=6 door=front-big_key-arena-maze-hellway-boss bow hammer', true],
            ['compass', null, false],
            ['compass', 'keys=2', true],
            ['compass', 'keys=2 door=front', true],
            ['compass', 'keys=3 door=front-big_key', true],
            ['compass', 'keys=4 door=front-big_key-maze', true],
            ['compass', 'keys=5 door=front-big_key-maze-hellway', true],
            ['compass', 'keys=2 door=front-arena', true],
            ['compass', 'keys=3 door=front-arena-big_key', true],
            ['compass', 'keys=4 door=front-arena-big_key-maze', true],
            ['compass', 'keys=5 door=front-arena-big_key-maze-hellway', true],
            ['compass', 'keys=1 bow hammer', true],
            ['compass', 'keys=2 door=big_key bow hammer', true],
            ['compass', 'keys=3 door=big_key-maze bow hammer', true],
            ['compass', 'keys=4 door=big_key-maze-hellway bow hammer', true],
            ['compass', 'keys=5 door=big_key-maze-hellway-boss bow hammer', true],
            ['compass', 'keys=1 door=arena bow hammer', true],
            ['compass', 'keys=2 door=arena-big_key bow hammer', true],
            ['compass', 'keys=3 door=arena-big_key-maze bow hammer', true],
            ['compass', 'keys=4 door=arena-big_key-maze-hellway bow hammer', true],
            ['compass', 'keys=5 door=arena-big_key-maze-hellway-boss bow hammer', true],
            ['compass', 'keys=2 door=front-arena bow hammer', true],
            ['compass', 'keys=3 door=front-arena-big_key bow hammer', true],
            ['compass', 'keys=4 door=front-arena-big_key-maze bow hammer', true],
            ['compass', 'keys=5 door=front-arena-big_key-maze-hellway bow hammer', true],
            ['compass', 'keys=6 door=front-arena-big_key-maze-hellway-boss bow hammer', true],
            ...duplicate_cases(['basement_left', 'basement_right'],
                [null, false],
                ['keys=2', 'dark'],
                ['keys=2 lamp', true],
                ['keys=2 door=front', 'dark'],
                ['keys=2 door=front lamp', true],
                ['keys=3 door=front-big_key', 'dark'],
                ['keys=3 door=front-big_key lamp', true],
                ['keys=4 door=front-big_key-maze', 'dark'],
                ['keys=4 door=front-big_key-maze lamp', true],
                ['keys=5 door=front-big_key-maze-hellway', 'dark'],
                ['keys=5 door=front-big_key-maze-hellway lamp', true],
                ['keys=2 door=front-arena', 'dark'],
                ['keys=2 door=front-arena lamp', true],
                ['keys=3 door=front-arena-big_key', 'dark'],
                ['keys=3 door=front-arena-big_key lamp', true],
                ['keys=4 door=front-arena-big_key-maze', 'dark'],
                ['keys=4 door=front-arena-big_key-maze lamp', true],
                ['keys=5 door=front-arena-big_key-maze-hellway', 'dark'],
                ['keys=5 door=front-arena-big_key-maze-hellway lamp', true],
                ['keys=1 bow hammer', 'dark'],
                ['keys=1 bow hammer lamp', true],
                ['keys=2 door=big_key bow hammer', 'dark'],
                ['keys=2 door=big_key bow hammer lamp', true],
                ['keys=3 door=big_key-maze bow hammer', 'dark'],
                ['keys=3 door=big_key-maze bow hammer lamp', true],
                ['keys=4 door=big_key-maze-hellway bow hammer', 'dark'],
                ['keys=4 door=big_key-maze-hellway bow hammer lamp', true],
                ['keys=5 door=big_key-maze-hellway-boss bow hammer', 'dark'],
                ['keys=5 door=big_key-maze-hellway-boss bow hammer lamp', true],
                ['keys=1 door=arena bow hammer', 'dark'],
                ['keys=1 door=arena bow hammer lamp', true],
                ['keys=2 door=arena-big_key bow hammer', 'dark'],
                ['keys=2 door=arena-big_key bow hammer lamp', true],
                ['keys=3 door=arena-big_key-maze bow hammer', 'dark'],
                ['keys=3 door=arena-big_key-maze bow hammer lamp', true],
                ['keys=4 door=arena-big_key-maze-hellway bow hammer', 'dark'],
                ['keys=4 door=arena-big_key-maze-hellway bow hammer lamp', true],
                ['keys=5 door=arena-big_key-maze-hellway-boss bow hammer', 'dark'],
                ['keys=5 door=arena-big_key-maze-hellway-boss bow hammer lamp', true],
                ['keys=2 door=front-arena bow hammer', 'dark'],
                ['keys=2 door=front-arena bow hammer lamp', true],
                ['keys=3 door=front-arena-big_key bow hammer', 'dark'],
                ['keys=3 door=front-arena-big_key bow hammer lamp', true],
                ['keys=4 door=front-arena-big_key-maze bow hammer', 'dark'],
                ['keys=4 door=front-arena-big_key-maze bow hammer lamp', true],
                ['keys=5 door=front-arena-big_key-maze-hellway bow hammer', 'dark'],
                ['keys=5 door=front-arena-big_key-maze-hellway bow hammer lamp', true],
                ['keys=6 door=front-arena-big_key-maze-hellway-boss bow hammer', 'dark'],
                ['keys=6 door=front-arena-big_key-maze-hellway-boss bow hammer lamp', true]),
            ['hellway', null, false],
            ['hellway', 'keys=3', true],
            ['hellway', 'keys=3 door=front', true],
            ['hellway', 'keys=4 door=front-big_key', true],
            ['hellway', 'keys=5 door=front-big_key-maze', true],
            ['hellway', 'keys=3 door=front-arena', true],
            ['hellway', 'keys=4 door=front-arena-big_key', true],
            ['hellway', 'keys=5 door=front-arena-big_key-maze', true],
            ['hellway', 'keys=3 door=front-arena-hellway', true],
            ['hellway', 'keys=4 door=front-arena-hellway-big_key', true],
            ['hellway', 'keys=5 door=front-arena-hellway-big_key-maze', true],
            ['hellway', 'keys=3 bow hammer', true],
            ['hellway', 'keys=4 door=big_key bow hammer', true],
            ['hellway', 'keys=5 door=big_key-maze bow hammer', true],
            ['hellway', 'keys=6 door=big_key-maze-boss bow hammer', true],
            ['hellway', 'keys=3 door=arena bow hammer', true],
            ['hellway', 'keys=4 door=arena-big_key bow hammer', true],
            ['hellway', 'keys=5 door=arena-big_key-maze bow hammer', true],
            ['hellway', 'keys=6 door=arena-big_key-maze-boss bow hammer', true],
            ['hellway', 'keys=3 door=arena-hellway bow hammer', true],
            ['hellway', 'keys=4 door=arena-hellway-big_key bow hammer', true],
            ['hellway', 'keys=5 door=arena-hellway-big_key-maze bow hammer', true],
            ['hellway', 'keys=6 door=arena-hellway-big_key-maze-boss bow hammer', true],
            ['hellway', 'keys=3 door=front bow hammer', true],
            ['hellway', 'keys=4 door=front-big_key bow hammer', true],
            ['hellway', 'keys=5 door=front-big_key-maze bow hammer', true],
            ['hellway', 'keys=6 door=front-big_key-maze-boss bow hammer', true],
            ['hellway', 'keys=3 door=front-arena bow hammer', true],
            ['hellway', 'keys=4 door=front-arena-big_key bow hammer', true],
            ['hellway', 'keys=5 door=front-arena-big_key-maze bow hammer', true],
            ['hellway', 'keys=6 door=front-arena-big_key-maze-boss bow hammer', true],
            ['hellway', 'keys=3 door=front-arena-hellway bow hammer', true],
            ['hellway', 'keys=4 door=front-arena-hellway-big_key bow hammer', true],
            ['hellway', 'keys=5 door=front-arena-hellway-big_key-maze bow hammer', true],
            ['hellway', 'keys=6 door=front-arena-hellway-big_key-maze-boss bow hammer', true],
            ['big_chest', null, false],
            ['big_chest', 'big_key keys=3', 'dark'],
            ['big_chest', 'big_key keys=3 lamp', true],
            ['big_chest', 'big_key keys=3 door=front', 'dark'],
            ['big_chest', 'big_key keys=3 door=front lamp', true],
            ['big_chest', 'big_key keys=4 door=front-big_key', 'dark'],
            ['big_chest', 'big_key keys=4 door=front-big_key lamp', true],
            ['big_chest', 'big_key keys=5 door=front-big_key-hellway', 'dark'],
            ['big_chest', 'big_key keys=5 door=front-big_key-hellway lamp', true],
            ['big_chest', 'big_key keys=3 door=front-arena', 'dark'],
            ['big_chest', 'big_key keys=3 door=front-arena lamp', true],
            ['big_chest', 'big_key keys=4 door=front-arena-big_key', 'dark'],
            ['big_chest', 'big_key keys=4 door=front-arena-big_key lamp', true],
            ['big_chest', 'big_key keys=5 door=front-arena-big_key-hellway', 'dark'],
            ['big_chest', 'big_key keys=5 door=front-arena-big_key-hellway lamp', true],
            ['big_chest', 'big_key keys=3 door=front-arena-maze', 'dark'],
            ['big_chest', 'big_key keys=3 door=front-arena-maze lamp', true],
            ['big_chest', 'big_key keys=4 door=front-arena-maze-big_key', 'dark'],
            ['big_chest', 'big_key keys=4 door=front-arena-maze-big_key lamp', true],
            ['big_chest', 'big_key keys=5 door=front-arena-maze-big_key-hellway', 'dark'],
            ['big_chest', 'big_key keys=5 door=front-arena-maze-big_key-hellway lamp', true],
            ['big_chest', 'big_key keys=2 bow hammer', 'dark'],
            ['big_chest', 'big_key keys=2 bow hammer lamp', true],
            ['big_chest', 'big_key keys=3 door=big_key bow hammer', 'dark'],
            ['big_chest', 'big_key keys=3 door=big_key bow hammer lamp', true],
            ['big_chest', 'big_key keys=4 door=big_key-hellway bow hammer', 'dark'],
            ['big_chest', 'big_key keys=4 door=big_key-hellway bow hammer lamp', true],
            ['big_chest', 'big_key keys=5 door=big_key-hellway-boss bow hammer', 'dark'],
            ['big_chest', 'big_key keys=5 door=big_key-hellway-boss bow hammer lamp', true],
            ['big_chest', 'big_key keys=3 door=arena-big_key bow hammer', 'dark'],
            ['big_chest', 'big_key keys=3 door=arena-big_key bow hammer lamp', true],
            ['big_chest', 'big_key keys=4 door=arena-big_key-hellway bow hammer', 'dark'],
            ['big_chest', 'big_key keys=4 door=arena-big_key-hellway bow hammer lamp', true],
            ['big_chest', 'big_key keys=5 door=arena-big_key-hellway-boss bow hammer', 'dark'],
            ['big_chest', 'big_key keys=5 door=arena-big_key-hellway-boss bow hammer lamp', true],
            ['big_chest', 'big_key keys=3 door=arena-maze-big_key bow hammer', 'dark'],
            ['big_chest', 'big_key keys=3 door=arena-maze-big_key bow hammer lamp', true],
            ['big_chest', 'big_key keys=4 door=arena-maze-big_key-hellway bow hammer', 'dark'],
            ['big_chest', 'big_key keys=4 door=arena-maze-big_key-hellway bow hammer lamp', true],
            ['big_chest', 'big_key keys=5 door=arena-maze-big_key-hellway-boss bow hammer', 'dark'],
            ['big_chest', 'big_key keys=5 door=arena-maze-big_key-hellway-boss bow hammer lamp', true],
            ['big_chest', 'big_key keys=3 door=front bow hammer', 'dark'],
            ['big_chest', 'big_key keys=3 door=front bow hammer lamp', true],
            ['big_chest', 'big_key keys=4 door=front-big_key bow hammer', 'dark'],
            ['big_chest', 'big_key keys=4 door=front-big_key bow hammer lamp', true],
            ['big_chest', 'big_key keys=5 door=front-big_key-hellway bow hammer', 'dark'],
            ['big_chest', 'big_key keys=5 door=front-big_key-hellway bow hammer lamp', true],
            ['big_chest', 'big_key keys=6 door=front-big_key-hellway-boss bow hammer', 'dark'],
            ['big_chest', 'big_key keys=6 door=front-big_key-hellway-boss bow hammer lamp', true],
            ['big_chest', 'big_key keys=4 door=front-arena-big_key bow hammer', 'dark'],
            ['big_chest', 'big_key keys=4 door=front-arena-big_key bow hammer lamp', true],
            ['big_chest', 'big_key keys=5 door=front-arena-big_key-hellway bow hammer', 'dark'],
            ['big_chest', 'big_key keys=5 door=front-arena-big_key-hellway bow hammer lamp', true],
            ['big_chest', 'big_key keys=6 door=front-arena-big_key-hellway-boss bow hammer', 'dark'],
            ['big_chest', 'big_key keys=6 door=front-arena-big_key-hellway-boss bow hammer lamp', true],
            ['big_chest', 'big_key keys=4 door=front-arena-maze-big_key bow hammer', 'dark'],
            ['big_chest', 'big_key keys=4 door=front-arena-maze-big_key bow hammer lamp', true],
            ['big_chest', 'big_key keys=5 door=front-arena-maze-big_key-hellway bow hammer', 'dark'],
            ['big_chest', 'big_key keys=5 door=front-arena-maze-big_key-hellway bow hammer lamp', true],
            ['big_chest', 'big_key keys=6 door=front-arena-maze-big_key-hellway-boss bow hammer', 'dark'],
            ['big_chest', 'big_key keys=6 door=front-arena-maze-big_key-hellway-boss bow hammer lamp', true],
            ...duplicate_cases(['maze_top', 'maze_bottom'],
                [null, false],
                ['big_key keys=3', 'dark'],
                ['big_key keys=3 lamp', true],
                ['big_key keys=3 door=front', 'dark'],
                ['big_key keys=3 door=front lamp', true],
                ['big_key keys=4 door=front-big_key', 'dark'],
                ['big_key keys=4 door=front-big_key lamp', true],
                ['big_key keys=5 door=front-big_key-hellway', 'dark'],
                ['big_key keys=5 door=front-big_key-hellway lamp', true],
                ['big_key keys=3 door=front-arena', 'dark'],
                ['big_key keys=3 door=front-arena lamp', true],
                ['big_key keys=4 door=front-arena-big_key', 'dark'],
                ['big_key keys=4 door=front-arena-big_key lamp', true],
                ['big_key keys=5 door=front-arena-big_key-hellway', 'dark'],
                ['big_key keys=5 door=front-arena-big_key-hellway lamp', true],
                ['big_key keys=3 door=front-arena-maze', 'dark'],
                ['big_key keys=3 door=front-arena-maze lamp', true],
                ['big_key keys=4 door=front-arena-maze-big_key', 'dark'],
                ['big_key keys=4 door=front-arena-maze-big_key lamp', true],
                ['big_key keys=5 door=front-arena-maze-big_key-hellway', 'dark'],
                ['big_key keys=5 door=front-arena-maze-big_key-hellway lamp', true],
                ['big_key keys=2 bow hammer', 'dark'],
                ['big_key keys=2 bow hammer lamp', true],
                ['big_key keys=3 door=big_key bow hammer', 'dark'],
                ['big_key keys=3 door=big_key bow hammer lamp', true],
                ['big_key keys=4 door=big_key-hellway bow hammer', 'dark'],
                ['big_key keys=4 door=big_key-hellway bow hammer lamp', true],
                ['big_key keys=5 door=big_key-hellway-boss bow hammer', 'dark'],
                ['big_key keys=5 door=big_key-hellway-boss bow hammer lamp', true],
                ['big_key keys=3 door=arena-big_key bow hammer', 'dark'],
                ['big_key keys=3 door=arena-big_key bow hammer lamp', true],
                ['big_key keys=4 door=arena-big_key-hellway bow hammer', 'dark'],
                ['big_key keys=4 door=arena-big_key-hellway bow hammer lamp', true],
                ['big_key keys=5 door=arena-big_key-hellway-boss bow hammer', 'dark'],
                ['big_key keys=5 door=arena-big_key-hellway-boss bow hammer lamp', true],
                ['big_key keys=3 door=arena-maze-big_key bow hammer', 'dark'],
                ['big_key keys=3 door=arena-maze-big_key bow hammer lamp', true],
                ['big_key keys=4 door=arena-maze-big_key-hellway bow hammer', 'dark'],
                ['big_key keys=4 door=arena-maze-big_key-hellway bow hammer lamp', true],
                ['big_key keys=5 door=arena-maze-big_key-hellway-boss bow hammer', 'dark'],
                ['big_key keys=5 door=arena-maze-big_key-hellway-boss bow hammer lamp', true],
                ['big_key keys=3 door=front bow hammer', 'dark'],
                ['big_key keys=3 door=front bow hammer lamp', true],
                ['big_key keys=4 door=front-big_key bow hammer', 'dark'],
                ['big_key keys=4 door=front-big_key bow hammer lamp', true],
                ['big_key keys=5 door=front-big_key-hellway bow hammer', 'dark'],
                ['big_key keys=5 door=front-big_key-hellway bow hammer lamp', true],
                ['big_key keys=6 door=front-big_key-hellway-boss bow hammer', 'dark'],
                ['big_key keys=6 door=front-big_key-hellway-boss bow hammer lamp', true],
                ['big_key keys=4 door=front-arena-big_key bow hammer', 'dark'],
                ['big_key keys=4 door=front-arena-big_key bow hammer lamp', true],
                ['big_key keys=5 door=front-arena-big_key-hellway bow hammer', 'dark'],
                ['big_key keys=5 door=front-arena-big_key-hellway bow hammer lamp', true],
                ['big_key keys=6 door=front-arena-big_key-hellway-boss bow hammer', 'dark'],
                ['big_key keys=6 door=front-arena-big_key-hellway-boss bow hammer lamp', true],
                ['big_key keys=4 door=front-arena-maze-big_key bow hammer', 'dark'],
                ['big_key keys=4 door=front-arena-maze-big_key bow hammer lamp', true],
                ['big_key keys=5 door=front-arena-maze-big_key-hellway bow hammer', 'dark'],
                ['big_key keys=5 door=front-arena-maze-big_key-hellway bow hammer lamp', true],
                ['big_key keys=6 door=front-arena-maze-big_key-hellway-boss bow hammer', 'dark'],
                ['big_key keys=6 door=front-arena-maze-big_key-hellway-boss bow hammer lamp', true]),
            ['boss', null, false],
            ['boss', 'big_key door=boss bow hammer', 'dark'],
            ['boss', 'big_key door=boss bow hammer lamp', true],
            ['boss', 'big_key keys=1 bow hammer', 'dark'],
            ['boss', 'big_key keys=1 bow hammer lamp', true],
            ['boss', 'big_key keys=2 door=front bow hammer', 'dark'],
            ['boss', 'big_key keys=2 door=front bow hammer lamp', true],
            ['boss', 'big_key keys=3 door=front-big_key bow hammer', 'dark'],
            ['boss', 'big_key keys=3 door=front-big_key bow hammer lamp', true],
            ['boss', 'big_key keys=4 door=front-big_key-arena bow hammer', 'dark'],
            ['boss', 'big_key keys=4 door=front-big_key-arena bow hammer lamp', true],
            ['boss', 'big_key keys=5 door=front-big_key-arena-maze bow hammer', 'dark'],
            ['boss', 'big_key keys=5 door=front-big_key-arena-maze bow hammer lamp', true],
            ['boss', 'big_key keys=6 door=front-big_key-arena-maze-hellway bow hammer', 'dark'],
            ['boss', 'big_key keys=6 door=front-big_key-arena-maze-hellway bow hammer lamp', true],
            expect_location_can_access_state('darkness'));

            context('knowing hammery jump', () => {

                beforeEach(() => {
                    mode = { ...mode, hammery_jump: true };
                    world = create_world(mode).world;
                });

                with_cases(
                ['big_chest', null, false],
                ['big_chest', 'big_key keys=2', true],
                ['big_chest', 'big_key keys=2 door=front', true],
                ['big_chest', 'big_key keys=3 door=front-big_key', true],
                ['big_chest', 'big_key keys=4 door=front-big_key-hellway', true],
                ['big_chest', 'big_key keys=2 door=front-arena', true],
                ['big_chest', 'big_key keys=3 door=front-arena-big_key', true],
                ['big_chest', 'big_key keys=4 door=front-arena-big_key-hellway', true],
                ['big_chest', 'big_key keys=3 door=front-arena-maze', true],
                ['big_chest', 'big_key keys=4 door=front-arena-maze-big_key', true],
                ['big_chest', 'big_key keys=5 door=front-arena-maze-big_key-hellway', true],
                ['big_chest', 'big_key keys=1 bow hammer', true],
                ['big_chest', 'big_key keys=2 door=big_key bow hammer', true],
                ['big_chest', 'big_key keys=3 door=big_key-hellway bow hammer', true],
                ['big_chest', 'big_key keys=4 door=big_key-hellway-boss bow hammer', true],
                ['big_chest', 'big_key keys=2 door=arena-big_key bow hammer', true],
                ['big_chest', 'big_key keys=3 door=arena-big_key-hellway bow hammer', true],
                ['big_chest', 'big_key keys=4 door=arena-big_key-hellway-boss bow hammer', true],
                ['big_chest', 'big_key keys=3 door=arena-maze-big_key bow hammer', true],
                ['big_chest', 'big_key keys=4 door=arena-maze-big_key-hellway bow hammer', true],
                ['big_chest', 'big_key keys=5 door=arena-maze-big_key-hellway-boss bow hammer', true],
                ['big_chest', 'big_key keys=2 door=front bow hammer', true],
                ['big_chest', 'big_key keys=3 door=front-big_key bow hammer', true],
                ['big_chest', 'big_key keys=4 door=front-big_key-hellway bow hammer', true],
                ['big_chest', 'big_key keys=5 door=front-big_key-hellway-boss bow hammer', true],
                ['big_chest', 'big_key keys=3 door=front-arena-big_key bow hammer', true],
                ['big_chest', 'big_key keys=4 door=front-arena-big_key-hellway bow hammer', true],
                ['big_chest', 'big_key keys=5 door=front-arena-big_key-hellway-boss bow hammer', true],
                ['big_chest', 'big_key keys=4 door=front-arena-maze-big_key bow hammer', true],
                ['big_chest', 'big_key keys=5 door=front-arena-maze-big_key-hellway bow hammer', true],
                ['big_chest', 'big_key keys=6 door=front-arena-maze-big_key-hellway-boss bow hammer', true],
                ...duplicate_cases(['maze_top', 'maze_bottom'],
                    [null, false],
                    ['big_key keys=2', 'dark'],
                    ['big_key keys=2 lamp', true],
                    ['big_key keys=2 door=front', 'dark'],
                    ['big_key keys=2 door=front lamp', true],
                    ['big_key keys=3 door=front-big_key', 'dark'],
                    ['big_key keys=3 door=front-big_key lamp', true],
                    ['big_key keys=4 door=front-big_key-hellway', 'dark'],
                    ['big_key keys=4 door=front-big_key-hellway lamp', true],
                    ['big_key keys=2 door=front-arena', 'dark'],
                    ['big_key keys=2 door=front-arena lamp', true],
                    ['big_key keys=3 door=front-arena-big_key', 'dark'],
                    ['big_key keys=3 door=front-arena-big_key lamp', true],
                    ['big_key keys=4 door=front-arena-big_key-hellway', 'dark'],
                    ['big_key keys=4 door=front-arena-big_key-hellway lamp', true],
                    ['big_key keys=3 door=front-arena-maze', 'dark'],
                    ['big_key keys=3 door=front-arena-maze lamp', true],
                    ['big_key keys=4 door=front-arena-maze-big_key', 'dark'],
                    ['big_key keys=4 door=front-arena-maze-big_key lamp', true],
                    ['big_key keys=5 door=front-arena-maze-big_key-hellway', 'dark'],
                    ['big_key keys=5 door=front-arena-maze-big_key-hellway lamp', true],
                    ['big_key keys=1 bow hammer', 'dark'],
                    ['big_key keys=1 bow hammer lamp', true],
                    ['big_key keys=2 door=big_key bow hammer', 'dark'],
                    ['big_key keys=2 door=big_key bow hammer lamp', true],
                    ['big_key keys=3 door=big_key-hellway bow hammer', 'dark'],
                    ['big_key keys=3 door=big_key-hellway bow hammer lamp', true],
                    ['big_key keys=4 door=big_key-hellway-boss bow hammer', 'dark'],
                    ['big_key keys=4 door=big_key-hellway-boss bow hammer lamp', true],
                    ['big_key keys=2 door=arena-big_key bow hammer', 'dark'],
                    ['big_key keys=2 door=arena-big_key bow hammer lamp', true],
                    ['big_key keys=3 door=arena-big_key-hellway bow hammer', 'dark'],
                    ['big_key keys=3 door=arena-big_key-hellway bow hammer lamp', true],
                    ['big_key keys=4 door=arena-big_key-hellway-boss bow hammer', 'dark'],
                    ['big_key keys=4 door=arena-big_key-hellway-boss bow hammer lamp', true],
                    ['big_key keys=3 door=arena-maze-big_key bow hammer', 'dark'],
                    ['big_key keys=3 door=arena-maze-big_key bow hammer lamp', true],
                    ['big_key keys=4 door=arena-maze-big_key-hellway bow hammer', 'dark'],
                    ['big_key keys=4 door=arena-maze-big_key-hellway bow hammer lamp', true],
                    ['big_key keys=5 door=arena-maze-big_key-hellway-boss bow hammer', 'dark'],
                    ['big_key keys=5 door=arena-maze-big_key-hellway-boss bow hammer lamp', true],
                    ['big_key keys=2 door=front bow hammer', 'dark'],
                    ['big_key keys=2 door=front bow hammer lamp', true],
                    ['big_key keys=3 door=front-big_key bow hammer', 'dark'],
                    ['big_key keys=3 door=front-big_key bow hammer lamp', true],
                    ['big_key keys=4 door=front-big_key-hellway bow hammer', 'dark'],
                    ['big_key keys=4 door=front-big_key-hellway bow hammer lamp', true],
                    ['big_key keys=5 door=front-big_key-hellway-boss bow hammer', 'dark'],
                    ['big_key keys=5 door=front-big_key-hellway-boss bow hammer lamp', true],
                    ['big_key keys=3 door=front-arena-big_key bow hammer', 'dark'],
                    ['big_key keys=3 door=front-arena-big_key bow hammer lamp', true],
                    ['big_key keys=4 door=front-arena-big_key-hellway bow hammer', 'dark'],
                    ['big_key keys=4 door=front-arena-big_key-hellway bow hammer lamp', true],
                    ['big_key keys=5 door=front-arena-big_key-hellway-boss bow hammer', 'dark'],
                    ['big_key keys=5 door=front-arena-big_key-hellway-boss bow hammer lamp', true],
                    ['big_key keys=4 door=front-arena-maze-big_key bow hammer', 'dark'],
                    ['big_key keys=4 door=front-arena-maze-big_key bow hammer lamp', true],
                    ['big_key keys=5 door=front-arena-maze-big_key-hellway bow hammer', 'dark'],
                    ['big_key keys=5 door=front-arena-maze-big_key-hellway bow hammer lamp', true],
                    ['big_key keys=6 door=front-arena-maze-big_key-hellway-boss bow hammer', 'dark'],
                    ['big_key keys=6 door=front-arena-maze-big_key-hellway-boss bow hammer lamp', true]),
                expect_location_can_access_state('darkness'));

            });

        });

        context('swamp palace', () => {

            it('can complete is same as can access boss', keysanity_can_complete('swamp'));

            with_cases(...keysanity_progress_cases, (states, state) =>
            it(`can progress use all locations and ${is(state)}${states.length ? ` when some are ${states.join(', ')}`: ''}`,
                keysanity_can_progress('swamp', 10, states, state)));

            with_cases(
            ['entrance', null, 'always'],
            ['map', null, false],
            ['map', 'keys=1', true],
            ...duplicate_cases(['big_key', 'west', 'compass'],
                [null, false],
                ['keys=1 hammer', true]),
            ['big_chest', null, false],
            ['big_chest', 'big_key keys=1 hammer', true],
            ...duplicate_cases(['waterfall', 'toilet_left', 'toilet_right', 'boss'],
                [null, false],
                ['keys=1 hammer hookshot', true]),
            expect_location_can_access_state('swamp'));

        });

        context('skull woods', () => {

            it('can complete is same as can access boss', keysanity_can_complete('skull'));

            with_cases(...keysanity_progress_cases, (states, state) =>
            it(`can progress use all locations and ${is(state)}${states.length ? ` when some are ${states.join(', ')}`: ''}`,
                keysanity_can_progress('skull', 7, states, state)));

            with_cases(
            ['big_key', null, 'always'],
            ['compass', null, 'always'],
            ['map', null, 'always'],
            ['pot_prison', null, 'always'],
            ['big_chest', null, false],
            ['big_chest', 'big_key', true],
            ['bridge', null, false],
            ['bridge', 'firerod', true],
            ['boss', null, false],
            ['boss', 'firerod sword', true],
            expect_location_can_access_state('skull'));

        });

        context("thieves' town", () => {

            it('can complete is same as can access boss', keysanity_can_complete('thieves'));

            with_cases(...keysanity_progress_cases, (states, state) =>
            it(`can progress use all locations and ${is(state)}${states.length ? ` when some are ${states.join(', ')}`: ''}`,
                keysanity_can_progress('thieves', 8, states, state)));

            with_cases(
            ['big_key', null, 'always'],
            ['map', null, 'always'],
            ['compass', null, 'always'],
            ['ambush', null, 'always'],
            ['attic', null, false],
            ['cell',  null, false],
            ['attic', 'big_key', true],
            ['cell',  'big_key', true],
            ['big_chest', null, false],
            ['big_chest', 'big_key keys=1 hammer', true],
            ['boss', null, false],
            ['boss', 'big_key hammer', true],
            ['boss', 'big_key sword', true],
            ['boss', 'big_key somaria', true],
            ['boss', 'big_key byrna', true],
            expect_location_can_access_state('thieves'));

        });

        context('ice palace', () => {

            it('can complete is same as can access boss', keysanity_can_complete('ice'));

            with_cases(...keysanity_progress_cases, (states, state) =>
            it(`can progress use all locations and ${is(state)}${states.length ? ` when some are ${states.join(', ')}`: ''}`,
                keysanity_can_progress('ice', 8, states, state)));

            with_cases(
            ['compass', null, 'always'],
            ['freezor', null, 'always'],
            ['iced_t', null, 'always'],
            ['big_chest', null, false],
            ['big_chest', 'big_key', true],
            ['spike', null, 'possible'],
            ['spike', 'hookshot', true],
            ...duplicate_cases(['map', 'big_key'],
                [null, false],
                ['hammer', 'possible'],
                ['hammer hookshot', true]),
            ['boss', null, false],
            ['boss', 'hammer', 'possible'],
            ['boss', 'big_key keys=1 hammer somaria', true],
            ['boss', 'big_key keys=2 hammer', true],
            expect_location_can_access_state('ice'));

            context('knowing bomb jump', () => {

                beforeEach(() => {
                    mode = { ...mode, bomb_jump: true };
                    world = create_world(mode).world;
                });

                with_cases(
                ['spike', null, true],
                ['map', null, false],
                ['big_key', null, false],
                ['map', 'hammer', true],
                ['big_key', 'hammer', true],
                ['boss', null, false],
                ['boss', 'hammer', true],
                expect_location_can_access_state('ice'));

            });

        });

        context('mystery mire', () => {

            it('can complete is same as can access boss', keysanity_can_complete('mire'));

            with_cases(...keysanity_progress_cases, (states, state) =>
            it(`can progress use all locations and ${is(state)}${states.length ? ` when some are ${states.join(', ')}`: ''}`,
                keysanity_can_progress('mire', 8, states, state)));

            with_cases(
            ...duplicate_cases(['main', 'bridge', 'map', 'spike'],
                [null, false],
                ['bombos', 'medallion'],
                ['bombos ether quake', true],
                ['medallion=bombos bombos', true],
                ['medallion=ether ether', true],
                ['medallion=quake quake', true]),
            ...duplicate_cases(['compass', 'big_key'],
                [null, false],
                ['firerod bombos', 'medallion'],
                ['lamp bombos', 'medallion'],
                ['firerod bombos ether quake', true],
                ['lamp bombos ether quake', true],
                ['medallion=bombos firerod bombos', true],
                ['medallion=bombos lamp bombos', true],
                ['medallion=ether firerod ether', true],
                ['medallion=ether lamp ether', true],
                ['medallion=quake firerod quake', true],
                ['medallion=quake lamp quake', true]),
            ['big_chest', null, false],
            ['big_chest', 'big_key bombos', 'medallion'],
            ['big_chest', 'big_key bombos ether quake', true],
            ['big_chest', 'big_key medallion=bombos bombos', true],
            ['big_chest', 'big_key medallion=ether ether', true],
            ['big_chest', 'big_key medallion=quake quake', true],
            ['boss', null, false],
            ['boss', 'big_key somaria bombos', 'medallion'],
            ['boss', 'big_key somaria bombos ether quake', 'dark'],
            ['boss', 'big_key somaria bombos ether quake lamp', true],
            ['boss', 'big_key medallion=bombos somaria bombos', 'dark'],
            ['boss', 'big_key medallion=bombos somaria bombos lamp', true],
            ['boss', 'big_key medallion=ether somaria ether', 'dark'],
            ['boss', 'big_key medallion=ether somaria ether lamp', true],
            ['boss', 'big_key medallion=quake somaria quake', 'dark'],
            ['boss', 'big_key medallion=quake somaria quake lamp', true],
            expect_location_can_access_state('mire'));

        });

        context('turtle rock', () => {

            it('can complete is same as can access boss', keysanity_can_complete('turtle'));

            with_cases(...keysanity_progress_cases, (states, state) =>
            it(`can progress use all locations and ${is(state)}${states.length ? ` when some are ${states.join(', ')}`: ''}`,
                keysanity_can_progress('turtle', 12, states, state)));

            with_cases(
            ['crystaroller', null, false],
            ['crystaroller', 'big_key keys=2 bombos', 'medallion'],
            ['crystaroller', 'big_key keys=3 location=big_key bombos', 'medallion'],
            ['crystaroller', 'big_key keys=2 bombos ether quake', true],
            ['crystaroller', 'big_key keys=3 location=big_key bombos ether quake', true],
            ['crystaroller', 'big_key keys=2 medallion=bombos bombos', true],
            ['crystaroller', 'big_key keys=3 location=big_key medallion=bombos bombos', true],
            ['crystaroller', 'big_key keys=2 medallion=ether ether', true],
            ['crystaroller', 'big_key keys=3 location=big_key medallion=ether ether', true],
            ['crystaroller', 'big_key keys=2 medallion=quake quake', true],
            ['crystaroller', 'big_key keys=3 location=big_key medallion=quake quake', true],
            ['boss', null, false],
            ['boss', 'big_key keys=3 door=crystaroller bombos', 'medallion'],
            ['boss', 'big_key keys=3 bombos', 'medallion'],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller bombos', 'medallion'],
            ['boss', 'big_key keys=4 location=big_key bombos', 'medallion'],
            ['boss', 'big_key keys=3 door=crystaroller bombos ether quake', 'dark'],
            ['boss', 'big_key keys=3 door=crystaroller bombos ether quake lamp', true],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller bombos ether quake', 'dark'],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller bombos ether quake lamp', true],
            ['boss', 'big_key keys=3 bombos ether quake', 'dark'],
            ['boss', 'big_key keys=3 bombos ether quake lamp', true],
            ['boss', 'big_key keys=4 location=big_key bombos ether quake', 'dark'],
            ['boss', 'big_key keys=4 location=big_key bombos ether quake lamp', true],
            ['boss', 'big_key keys=3 door=crystaroller medallion=bombos bombos', 'dark'],
            ['boss', 'big_key keys=3 door=crystaroller medallion=bombos bombos lamp', true],
            ['boss', 'big_key keys=3 medallion=bombos bombos', 'dark'],
            ['boss', 'big_key keys=3 medallion=bombos bombos lamp', true],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller medallion=bombos bombos', 'dark'],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller medallion=bombos bombos lamp', true],
            ['boss', 'big_key keys=4 location=big_key medallion=bombos bombos', 'dark'],
            ['boss', 'big_key keys=4 location=big_key medallion=bombos bombos lamp', true],
            ['boss', 'big_key keys=3 door=crystaroller medallion=ether ether', 'dark'],
            ['boss', 'big_key keys=3 door=crystaroller medallion=ether ether lamp', true],
            ['boss', 'big_key keys=3 medallion=ether ether', 'dark'],
            ['boss', 'big_key keys=3 medallion=ether ether lamp', true],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller medallion=ether ether', 'dark'],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller medallion=ether ether lamp', true],
            ['boss', 'big_key keys=4 location=big_key medallion=ether ether', 'dark'],
            ['boss', 'big_key keys=4 location=big_key medallion=ether ether lamp', true],
            ['boss', 'big_key keys=3 door=crystaroller medallion=quake quake', 'dark'],
            ['boss', 'big_key keys=3 door=crystaroller medallion=quake quake lamp', true],
            ['boss', 'big_key keys=3 medallion=quake quake', 'dark'],
            ['boss', 'big_key keys=3 medallion=quake quake lamp', true],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller medallion=quake quake', 'dark'],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller medallion=quake quake lamp', true],
            ['boss', 'big_key keys=4 location=big_key medallion=quake quake', 'dark'],
            ['boss', 'big_key keys=4 location=big_key medallion=quake quake lamp', true],
            expect_door_can_access_state('turtle'));

            with_cases(
            ['compass', null, false],
            ['compass', 'bombos', 'medallion'],
            ['compass', 'bombos ether quake', true],
            ['compass', 'medallion=bombos bombos', true],
            ['compass', 'medallion=ether ether', true],
            ['compass', 'medallion=quake quake', true],
            ...duplicate_cases(['roller_left', 'roller_right'],
                [null, false],
                ['firerod bombos', 'medallion'],
                ['firerod bombos ether quake', true],
                ['medallion=bombos firerod bombos', true],
                ['medallion=ether firerod ether', true],
                ['medallion=quake firerod quake', true]),
            ['chain_chomps', null, false],
            ['chain_chomps', 'keys=1 bombos', 'medallion'],
            ['chain_chomps', 'keys=1 bombos ether quake', true],
            ['chain_chomps', 'keys=1 medallion=bombos bombos', true],
            ['chain_chomps', 'keys=1 medallion=ether ether', true],
            ['chain_chomps', 'keys=1 medallion=quake quake', true],
            ['big_key', null, false],
            ['big_key', 'keys=2 bombos', 'medallion'],
            ['big_key', 'keys=2 bombos ether quake', true],
            ['big_key', 'keys=3 door=crystaroller bombos ether quake', true],
            ['big_key', 'keys=4 door=crystaroller-boss bombos ether quake', true],
            ['big_key', 'keys=2 medallion=bombos bombos', true],
            ['big_key', 'keys=3 door=crystaroller medallion=bombos bombos', true],
            ['big_key', 'keys=4 door=crystaroller-boss medallion=bombos bombos', true],
            ['big_key', 'keys=2 medallion=ether ether', true],
            ['big_key', 'keys=3 door=crystaroller medallion=ether ether', true],
            ['big_key', 'keys=4 door=crystaroller-boss medallion=ether ether', true],
            ['big_key', 'keys=2 medallion=quake quake', true],
            ['big_key', 'keys=3 door=crystaroller medallion=quake quake', true],
            ['big_key', 'keys=4 door=crystaroller-boss medallion=quake quake', true],
            ...duplicate_cases(['big_chest', 'crystaroller'],
                [null, false],
                ['big_key keys=2 bombos', 'medallion'],
                ['big_key keys=2 bombos ether quake', true],
                ['big_key keys=2 medallion=bombos bombos', true],
                ['big_key keys=2 medallion=ether ether', true],
                ['big_key keys=2 medallion=quake quake', true]),
            ...duplicate_cases(['eye_bl', 'eye_br', 'eye_tl', 'eye_tr'],
                [null, false],
                ['big_key door=crystaroller cape bombos', 'medallion'],
                ['big_key door=crystaroller cape bombos ether quake', 'dark'],
                ['big_key door=crystaroller byrna bombos ether quake', 'dark'],
                ['big_key door=crystaroller mirrorshield bombos ether quake', 'dark'],
                ['big_key door=crystaroller cape bombos ether quake lamp', true],
                ['big_key door=crystaroller byrna bombos ether quake lamp', true],
                ['big_key door=crystaroller mirrorshield bombos ether quake lamp', true],
                ['big_key door=crystaroller medallion=bombos cape bombos', 'dark'],
                ['big_key door=crystaroller medallion=bombos byrna bombos', 'dark'],
                ['big_key door=crystaroller medallion=bombos mirrorshield bombos', 'dark'],
                ['big_key door=crystaroller medallion=bombos cape bombos lamp', true],
                ['big_key door=crystaroller medallion=bombos byrna bombos lamp', true],
                ['big_key door=crystaroller medallion=bombos mirrorshield bombos lamp', true],
                ['big_key door=crystaroller medallion=ether cape ether', 'dark'],
                ['big_key door=crystaroller medallion=ether byrna ether', 'dark'],
                ['big_key door=crystaroller medallion=ether mirrorshield ether', 'dark'],
                ['big_key door=crystaroller medallion=ether cape ether lamp', true],
                ['big_key door=crystaroller medallion=ether byrna ether lamp', true],
                ['big_key door=crystaroller medallion=ether mirrorshield ether lamp', true],
                ['big_key door=crystaroller medallion=quake cape quake', 'dark'],
                ['big_key door=crystaroller medallion=quake byrna quake', 'dark'],
                ['big_key door=crystaroller medallion=quake mirrorshield quake', 'dark'],
                ['big_key door=crystaroller medallion=quake cape quake lamp', true],
                ['big_key door=crystaroller medallion=quake byrna quake lamp', true],
                ['big_key door=crystaroller medallion=quake mirrorshield quake lamp', true],
                ['big_key keys=2 cape bombos ether quake', 'dark'],
                ['big_key keys=2 byrna bombos ether quake', 'dark'],
                ['big_key keys=2 mirrorshield bombos ether quake', 'dark'],
                ['big_key keys=2 cape bombos ether quake lamp', true],
                ['big_key keys=2 byrna bombos ether quake lamp', true],
                ['big_key keys=2 mirrorshield bombos ether quake lamp', true],
                ['big_key keys=3 location=big_key cape bombos ether quake', 'dark'],
                ['big_key keys=3 location=big_key byrna bombos ether quake', 'dark'],
                ['big_key keys=3 location=big_key mirrorshield bombos ether quake', 'dark'],
                ['big_key keys=3 location=big_key cape bombos ether quake lamp', true],
                ['big_key keys=3 location=big_key byrna bombos ether quake lamp', true],
                ['big_key keys=3 location=big_key mirrorshield bombos ether quake lamp', true],
                ['big_key keys=4 location=big_key door=boss cape bombos ether quake', 'dark'],
                ['big_key keys=4 location=big_key door=boss byrna bombos ether quake', 'dark'],
                ['big_key keys=4 location=big_key door=boss mirrorshield bombos ether quake', 'dark'],
                ['big_key keys=4 location=big_key door=boss cape bombos ether quake lamp', true],
                ['big_key keys=4 location=big_key door=boss byrna bombos ether quake lamp', true],
                ['big_key keys=4 location=big_key door=boss mirrorshield bombos ether quake lamp', true],
                ['big_key keys=2 medallion=bombos cape bombos', 'dark'],
                ['big_key keys=2 medallion=bombos byrna bombos', 'dark'],
                ['big_key keys=2 medallion=bombos mirrorshield bombos', 'dark'],
                ['big_key keys=2 medallion=bombos cape bombos lamp', true],
                ['big_key keys=2 medallion=bombos byrna bombos lamp', true],
                ['big_key keys=2 medallion=bombos mirrorshield bombos lamp', true],
                ['big_key keys=3 location=big_key medallion=bombos cape bombos', 'dark'],
                ['big_key keys=3 location=big_key medallion=bombos byrna bombos', 'dark'],
                ['big_key keys=3 location=big_key medallion=bombos mirrorshield bombos', 'dark'],
                ['big_key keys=3 location=big_key medallion=bombos cape bombos lamp', true],
                ['big_key keys=3 location=big_key medallion=bombos byrna bombos lamp', true],
                ['big_key keys=3 location=big_key medallion=bombos mirrorshield bombos lamp', true],
                ['big_key keys=4 location=big_key door=boss medallion=bombos cape bombos', 'dark'],
                ['big_key keys=4 location=big_key door=boss medallion=bombos byrna bombos', 'dark'],
                ['big_key keys=4 location=big_key door=boss medallion=bombos mirrorshield bombos', 'dark'],
                ['big_key keys=4 location=big_key door=boss medallion=bombos cape bombos lamp', true],
                ['big_key keys=4 location=big_key door=boss medallion=bombos byrna bombos lamp', true],
                ['big_key keys=4 location=big_key door=boss medallion=bombos mirrorshield bombos lamp', true],
                ['big_key keys=2 medallion=ether cape ether', 'dark'],
                ['big_key keys=2 medallion=ether byrna ether', 'dark'],
                ['big_key keys=2 medallion=ether mirrorshield ether', 'dark'],
                ['big_key keys=2 medallion=ether cape ether lamp', true],
                ['big_key keys=2 medallion=ether byrna ether lamp', true],
                ['big_key keys=2 medallion=ether mirrorshield ether lamp', true],
                ['big_key keys=3 location=big_key medallion=ether cape ether', 'dark'],
                ['big_key keys=3 location=big_key medallion=ether byrna ether', 'dark'],
                ['big_key keys=3 location=big_key medallion=ether mirrorshield ether', 'dark'],
                ['big_key keys=3 location=big_key medallion=ether cape ether lamp', true],
                ['big_key keys=3 location=big_key medallion=ether byrna ether lamp', true],
                ['big_key keys=3 location=big_key medallion=ether mirrorshield ether lamp', true],
                ['big_key keys=4 location=big_key door=boss medallion=ether cape ether', 'dark'],
                ['big_key keys=4 location=big_key door=boss medallion=ether byrna ether', 'dark'],
                ['big_key keys=4 location=big_key door=boss medallion=ether mirrorshield ether', 'dark'],
                ['big_key keys=4 location=big_key door=boss medallion=ether cape ether lamp', true],
                ['big_key keys=4 location=big_key door=boss medallion=ether byrna ether lamp', true],
                ['big_key keys=4 location=big_key door=boss medallion=ether mirrorshield ether lamp', true],
                ['big_key keys=2 medallion=quake cape quake', 'dark'],
                ['big_key keys=2 medallion=quake byrna quake', 'dark'],
                ['big_key keys=2 medallion=quake mirrorshield quake', 'dark'],
                ['big_key keys=2 medallion=quake cape quake lamp', true],
                ['big_key keys=2 medallion=quake byrna quake lamp', true],
                ['big_key keys=2 medallion=quake mirrorshield quake lamp', true],
                ['big_key keys=3 location=big_key medallion=quake cape quake', 'dark'],
                ['big_key keys=3 location=big_key medallion=quake byrna quake', 'dark'],
                ['big_key keys=3 location=big_key medallion=quake mirrorshield quake', 'dark'],
                ['big_key keys=3 location=big_key medallion=quake cape quake lamp', true],
                ['big_key keys=3 location=big_key medallion=quake byrna quake lamp', true],
                ['big_key keys=3 location=big_key medallion=quake mirrorshield quake lamp', true],
                ['big_key keys=4 location=big_key door=boss medallion=quake cape quake', 'dark'],
                ['big_key keys=4 location=big_key door=boss medallion=quake byrna quake', 'dark'],
                ['big_key keys=4 location=big_key door=boss medallion=quake mirrorshield quake', 'dark'],
                ['big_key keys=4 location=big_key door=boss medallion=quake cape quake lamp', true],
                ['big_key keys=4 location=big_key door=boss medallion=quake byrna quake lamp', true],
                ['big_key keys=4 location=big_key door=boss medallion=quake mirrorshield quake lamp', true]),
            ['boss', null, false],
            ['boss', 'big_key keys=3 firerod icerod bombos', 'medallion'],
            ['boss', 'big_key keys=3 firerod icerod bombos ether quake', 'dark'],
            ['boss', 'big_key keys=3 firerod icerod bombos ether quake lamp', true],
            ['boss', 'big_key keys=3 door=crystaroller firerod icerod bombos ether quake', 'dark'],
            ['boss', 'big_key keys=3 door=crystaroller firerod icerod bombos ether quake lamp', true],
            ['boss', 'big_key keys=3 door=crystaroller-boss firerod icerod bombos ether quake', 'dark'],
            ['boss', 'big_key keys=3 door=crystaroller-boss firerod icerod bombos ether quake lamp', true],
            ['boss', 'big_key keys=4 location=big_key firerod icerod bombos ether quake', 'dark'],
            ['boss', 'big_key keys=4 location=big_key firerod icerod bombos ether quake lamp', true],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller firerod icerod bombos ether quake', 'dark'],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller firerod icerod bombos ether quake lamp', true],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller-boss firerod icerod bombos ether quake', 'dark'],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller-boss firerod icerod bombos ether quake lamp', true],
            ['boss', 'big_key keys=3 medallion=bombos firerod icerod bombos', 'dark'],
            ['boss', 'big_key keys=3 medallion=bombos firerod icerod bombos lamp', true],
            ['boss', 'big_key keys=3 door=crystaroller medallion=bombos firerod icerod bombos', 'dark'],
            ['boss', 'big_key keys=3 door=crystaroller medallion=bombos firerod icerod bombos lamp', true],
            ['boss', 'big_key keys=3 door=crystaroller-boss medallion=bombos firerod icerod bombos', 'dark'],
            ['boss', 'big_key keys=3 door=crystaroller-boss medallion=bombos firerod icerod bombos lamp', true],
            ['boss', 'big_key keys=4 location=big_key medallion=bombos firerod icerod bombos', 'dark'],
            ['boss', 'big_key keys=4 location=big_key medallion=bombos firerod icerod bombos lamp', true],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller medallion=bombos firerod icerod bombos', 'dark'],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller medallion=bombos firerod icerod bombos lamp', true],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller-boss medallion=bombos firerod icerod bombos', 'dark'],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller-boss medallion=bombos firerod icerod bombos lamp', true],
            ['boss', 'big_key keys=3 medallion=ether firerod icerod ether', 'dark'],
            ['boss', 'big_key keys=3 medallion=ether firerod icerod ether lamp', true],
            ['boss', 'big_key keys=3 door=crystaroller medallion=ether firerod icerod ether', 'dark'],
            ['boss', 'big_key keys=3 door=crystaroller medallion=ether firerod icerod ether lamp', true],
            ['boss', 'big_key keys=3 door=crystaroller-boss medallion=ether firerod icerod ether', 'dark'],
            ['boss', 'big_key keys=3 door=crystaroller-boss medallion=ether firerod icerod ether lamp', true],
            ['boss', 'big_key keys=4 location=big_key medallion=ether firerod icerod ether', 'dark'],
            ['boss', 'big_key keys=4 location=big_key medallion=ether firerod icerod ether lamp', true],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller medallion=ether firerod icerod ether', 'dark'],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller medallion=ether firerod icerod ether lamp', true],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller-boss medallion=ether firerod icerod ether', 'dark'],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller-boss medallion=ether firerod icerod ether lamp', true],
            ['boss', 'big_key keys=3 medallion=quake firerod icerod quake', 'dark'],
            ['boss', 'big_key keys=3 medallion=quake firerod icerod quake lamp', true],
            ['boss', 'big_key keys=3 door=crystaroller medallion=quake firerod icerod quake', 'dark'],
            ['boss', 'big_key keys=3 door=crystaroller medallion=quake firerod icerod quake lamp', true],
            ['boss', 'big_key keys=3 door=crystaroller-boss medallion=quake firerod icerod quake', 'dark'],
            ['boss', 'big_key keys=3 door=crystaroller-boss medallion=quake firerod icerod quake lamp', true],
            ['boss', 'big_key keys=4 location=big_key medallion=quake firerod icerod quake', 'dark'],
            ['boss', 'big_key keys=4 location=big_key medallion=quake firerod icerod quake lamp', true],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller medallion=quake firerod icerod quake', 'dark'],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller medallion=quake firerod icerod quake lamp', true],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller-boss medallion=quake firerod icerod quake', 'dark'],
            ['boss', 'big_key keys=4 location=big_key door=crystaroller-boss medallion=quake firerod icerod quake lamp', true],
            expect_location_can_access_state('turtle'));

        });

        context('agahnim encounter', () => {

            with_cases(
            [null, false],
            ['keys=2 sword', 'dark'],
            ['keys=2 sword lamp', true],
            expect_can_complete_state('castle_tower'));

        });

        context('overworld locations', () => {

            with_cases(
            ['lightworld_deathmountain_east', 'mimic', null, false],
            ['lightworld_deathmountain_east', 'mimic', 'moonpearl mitt hammer somaria sword mirror bombos', 'medallion'],
            ['lightworld_deathmountain_east', 'mimic', 'keys-turtle=2 moonpearl mitt hammer somaria sword mirror bombos ether quake', true],
            ['lightworld_deathmountain_east', 'mimic', 'keys-turtle=2 medallion-turtle=bombos moonpearl mitt hammer somaria sword mirror bombos', true],
            ['lightworld_deathmountain_east', 'mimic', 'keys-turtle=2 medallion-turtle=ether moonpearl mitt hammer somaria sword mirror ether', true],
            ['lightworld_deathmountain_east', 'mimic', 'keys-turtle=2 medallion-turtle=quake moonpearl mitt hammer somaria sword mirror quake', true],

            ['castle_escape', 'escape_side', null, false],
            ['castle_escape', 'escape_side', 'keys-castle_escape=1', 'dark'],
            ['castle_escape', 'escape_side', 'keys-castle_escape=1 lamp', true],

            ['castle_escape', 'escape_side', 'glove', true],
            ['castle_tower', 'castle_foyer', null, 'always'],
            ['castle_tower', 'castle_maze', null, false],
            ['castle_tower', 'castle_maze', 'keys=1', 'dark'],
            ['castle_tower', 'castle_maze', 'keys=1 lamp', true],

            expect_region_location_can_access_state);

        });

    });

});
