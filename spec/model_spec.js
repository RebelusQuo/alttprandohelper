const with_cases = require('./spec_helper').with_cases;
const _ = require('lodash');

const chai = require('chai');
const expect = chai.expect;
chai.should();

const create_model = require('../src/model');

const _with = progress =>
    `with ${progress != null ?
        progress.replace(/ /g, ', ') :
        'nothing'}`;

const update = (tokens, model, region) =>
    tokens && tokens.split(' ').forEach(token => {
        let m, v;
        if (m = token.match(/(\w+)=(.+)/)) {
            const [, key, value] = m;
            ({  opened: n => _.times(n, () => model.lower_chest(region)),
                medallion: n => _.times(n, () => model.raise_medallion(region))
            })[key](+value);
        } else {
            const raise = ([item, n]) => _.times(n, () => model.raise_item(item));
            let item;
            (item = {
                sword: ['sword', 1],
                bow: ['bow', 2],
                glove: ['glove', 1],
                mitt: ['glove', 2]
            }[token]) ? raise(item) : model.toggle_item(token);
        }
    });

const each_dungeon = [
    'eastern', 'desert', 'hera', 'darkness', 'swamp',
    'skull', 'thieves', 'ice', 'mire', 'turtle'
];

describe('Model', () => {

    let model;

    beforeEach(() => {
        model = create_model();
    });

    it('can toggle items', () => {
        model.state().items.hammer.should.be.false;
        model.toggle_item('hammer');
        model.state().items.hammer.should.be.true;
        model.toggle_item('hammer');
        model.state().items.hammer.should.be.false;
    });

    it('can level items', () => {
        model.state().items.should.include({ tunic: 1, bow: 0 });
        model.lower_item('tunic');
        model.lower_item('bow');
        model.state().items.should.include({ tunic: 3, bow: 3 });
        model.raise_item('tunic');
        model.raise_item('bow');
        model.state().items.should.include({ tunic: 1, bow: 0 });
    });

    with_cases(...each_dungeon,
    (dungeon) => it(`can level ${dungeon} chests`, () => {
        model.state().dungeons[dungeon].chests.should.be.above(0);
        model.raise_chest(dungeon);
        model.state().dungeons[dungeon].chests.should.equal(0);
        model.lower_chest(dungeon);
        model.state().dungeons[dungeon].chests.should.be.above(0);
    }));

    with_cases(...each_dungeon,
    (dungeon) => it(`can cycle ${dungeon} prizes`, () => {
        const prizes_from_five = (action) => _.times(5,
            () => (action(dungeon), model.state().dungeons[dungeon].prize));

        model.state().dungeons[dungeon].prize.should.equal('unknown');
        prizes_from_five((x) => model.raise_prize(x))
            .should.deep.equal(['pendant-green', 'pendant', 'crystal', 'crystal-red', 'unknown']);
        prizes_from_five((x) => model.lower_prize(x))
            .should.deep.equal(['crystal-red', 'crystal', 'pendant', 'pendant-green', 'unknown']);
    }));

    with_cases('mire', 'turtle',
    (dungeon) => it(`can cycle ${dungeon} medallions`, () => {
        const medallions_from_four = (action) => _.times(4,
            () => (action(dungeon), model.state().dungeons[dungeon].medallion));

        model.state().dungeons[dungeon].medallion.should.equal('unknown');
        medallions_from_four(x => model.raise_medallion(x))
            .should.deep.equal(['bombos', 'ether', 'quake', 'unknown']);
        medallions_from_four(x => model.lower_medallion(x))
            .should.deep.equal(['quake', 'ether', 'bombos', 'unknown']);
    }));

    with_cases(...each_dungeon,
    (dungeon) => it(`completable ${dungeon} is marked when completed`, () => {
        model.toggle_completion(dungeon);
        model.state().dungeons[dungeon].completable.should.equal('marked');
    }));

    with_cases(...each_dungeon,
    (dungeon) => it(`progressable ${dungeon} is marked when all chests are opened`, () => {
        model.raise_chest(dungeon);
        model.state().dungeons[dungeon].progressable.should.equal('marked');
    }));

    it('completable castle_tower is marked when completed', () => {
        model.toggle_completion('castle_tower');
        model.state().encounters.castle_tower.completable.should.equal('marked');
    });

    context('dungeons', () => {

        with_cases(
        ['eastern', null, 'unavailable'],
        ['eastern', 'lamp bow', 'available'],
        ['desert', 'glove lamp hammer boots', 'unavailable'],
        ['desert', 'book glove lamp hammer', 'possible'],
        ['hera', 'hammer firerod', 'unavailable'],
        ['hera', 'mirror glove hammer firerod', 'dark'],
        ['hera', 'mirror flute hammer firerod', 'available'],
        ['darkness', 'bow hammer lamp', 'unavailable'],
        ['darkness', 'moonpearl glove hammer bow lamp', 'available'],
        ['swamp', 'hammer hookshot', 'unavailable'],
        ['swamp', 'moonpearl mirror flippers glove hammer hookshot', 'available'],
        ['skull', 'firerod sword', 'unavailable'],
        ['skull', 'moonpearl glove hammer firerod sword', 'available'],
        ['thieves', 'hammer', 'unavailable'],
        ['thieves', 'moonpearl glove hammer', 'available'],
        ['ice', 'hammer somaria', 'unavailable'],
        ['ice', 'moonpearl flippers mitt firerod hammer', 'possible'],
        ['mire', 'somaria bombos ether quake lamp', 'unavailable'],
        ['mire', 'moonpearl boots sword flute mitt somaria bombos', 'medallion'],
        ['mire', 'medallion=1 moonpearl boots sword flute mitt somaria bombos lamp', 'available'],
        ['turtle', 'icerod firerod bombos ether quake byrna lamp', 'unavailable'],
        ['turtle', 'moonpearl mitt hammer somaria sword mirror icerod firerod bombos', 'medallion'],
        ['turtle', 'medallion=1 moonpearl mitt hammer somaria sword mirror icerod firerod bombos byrna lamp', 'available'],
        (region, progress, state) => it(`completable ${region} is ${state} ${_with(progress)}`, () => {
            update(progress, model, region);
            model.state().dungeons[region].completable.should.equal(state);
        }));

        with_cases(
        ['eastern', 'opened=1', 'possible'],
        ['eastern', 'opened=1 lamp', 'available'],
        ['desert', 'boots', 'unavailable'],
        ['desert', 'opened=1 book boots glove lamp', 'available'],
        ['hera', 'firerod', 'unavailable'],
        ['hera', 'mirror glove firerod', 'dark'],
        ['hera', 'mirror flute firerod', 'available'],
        ['darkness', 'bow lamp', 'unavailable'],
        ['darkness', 'opened=4 moonpearl mitt flippers bow lamp', 'possible'],
        ['swamp', 'hammer', 'unavailable'],
        ['swamp', 'opened=1 moonpearl mirror flippers glove hammer', 'available'],
        ['skull', 'firerod', 'unavailable'],
        ['skull', 'opened=1 moonpearl glove hammer firerod sword', 'available'],
        ['thieves', 'hammer', 'unavailable'],
        ['thieves', 'opened=3 moonpearl glove hammer', 'available'],
        ['ice', 'hammer', 'unavailable'],
        ['ice', 'moonpearl flippers mitt firerod hammer', 'available'],
        ['mire', 'bombos ether quake firerod', 'unavailable'],
        ['mire', 'moonpearl boots sword flute mitt bombos', 'medallion'],
        ['mire', 'medallion=1 opened=4 moonpearl boots sword flute mitt bombos lamp somaria', 'available'],
        ['turtle', 'bombos ether quake firerod lamp', 'unavailable'],
        ['turtle', 'moonpearl mitt hammer somaria sword mirror bombos', 'medallion'],
        ['turtle', 'medallion=1 opened=1 moonpearl mitt hammer somaria sword mirror bombos byrna', 'possible'],
        ['turtle', 'medallion=1 opened=1 moonpearl mitt hammer somaria sword mirror bombos byrna firerod lamp', 'available'],
        ['turtle', 'medallion=1 opened=3 moonpearl mitt hammer somaria sword mirror bombos byrna firerod', 'dark'],
        (region, progress, state) => it(`progressable ${region} is ${state} ${_with(progress)}`, () => {
            update(progress, model, region);
            model.state().dungeons[region].progressable.should.equal(state);
        }));

    });

    context('encounters', () => {

        with_cases(
        ['castle_tower', 'sword lamp', 'unavailable'],
        ['castle_tower', 'cape sword lamp', 'available'],
        (region, progress, state) => it(`completable ${region} is ${state} ${_with(progress)}`, () => {
            update(progress, model, region);
            model.state().encounters[region].completable.should.equal(state);
        }));

    });

    context('lightworld locations', () => {

        with_cases({
            lightworld_deathmountain_west: 'ether',
            lightworld_deathmountain_east: 'island_dm',
            lightworld_northwest: 'altar',
            lightworld_northeast: 'zora',
            lightworld_south: 'maze',
            castle_escape: 'sanctuary'
        }, (region, name) => it(`${region} locations have a region association`, () => {
            model.state().lightworld[name].region.should.equal(region);
        }));

        with_cases(
        ['spectacle_rock', 'mirror', 'unavailable'],
        ['spectacle_rock', 'glove', 'viewable'],
        ['spectacle_rock', 'glove mirror', 'dark'],
        ['spectacle_rock', 'flute mirror', 'available'],
        ['island_dm', 'mitt moonpearl mirror', 'unavailable'],
        ['island_dm', 'glove mirror hammer', 'viewable'],
        ['island_dm', 'hammer mitt moonpearl mirror', 'dark'],
        ['island_dm', 'flute hammer mitt moonpearl mirror', 'available'],
        ['altar', 'book', 'viewable'],
        ['mushroom', null, 'available'],
        ['zora', null, 'unavailable'],
        ['zora', 'flippers', 'available'],
        ['maze', null, 'available'],
        ['library', null, 'viewable'],
        ['library', 'boots', 'available'],
        ['sanctuary', null, 'available'],
        ['escape_side', null, 'dark'],
        ['escape_side', 'glove', 'available'],
        (name, progress, state) => it(`can access ${name} is ${state} ${_with(progress)}`, () => {
            update(progress, model);
            model.state().lightworld[name].state.should.equal(state);
        }));

    });

    context('darkworld locations', () => {

        with_cases({
            darkworld_deathmountain_west: 'spike',
            darkworld_deathmountain_east: 'rock_hook',
            darkworld_northwest: 'bumper',
            darkworld_northeast: 'catfish',
            darkworld_south: 'dig_game',
            darkworld_mire: 'mire_w'
        }, (region, name) => it(`${region} locations have a region association`, () => {
            model.state().darkworld[name].region.should.equal(region);
        }));

        with_cases(
        ['spike', 'moonpearl hammer glove cape', 'dark'],
        ['spike', 'flute moonpearl hammer glove cape', 'available'],
        ['bunny', 'moonpearl', 'unavailable'],
        ['bunny', 'flute mirror hammer mitt moonpearl', 'available'],
        ['bunny', 'mirror hammer mitt moonpearl', 'dark'],
        ['bumper', 'glove cape', 'unavailable'],
        ['bumper', 'moonpearl hammer glove cape', 'available'],
        ['catfish', 'moonpearl glove', 'unavailable'],
        ['catfish', 'hammer moonpearl glove', 'available'],
        ['dig_game', null, 'unavailable'],
        ['dig_game', 'moonpearl glove hammer', 'available'],
        ['mire_w', 'moonpearl', 'unavailable'],
        ['mire_w', 'flute mitt moonpearl', 'available'],
        (name, progress, state) => it(`can access ${name} is ${state} ${_with(progress)}`, () => {
            update(progress, model);
            model.state().darkworld[name].state.should.equal(state);
        }));

    });

});
