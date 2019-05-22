const { with_cases, expect } = require('./spec_setup');
const _ = require('lodash');

const create_model = require('../src/model');

const _with = progress =>
    `with ${progress != null ?
        progress.replace(/ /g, ', ') :
        'nothing'}`;

const update = (tokens, model, region) =>
    tokens && tokens.split(' ').forEach(token => {
        let m, v;
        if (token === 'big_key') {
            model.toggle_big_key(region);
        } else if (m = token.match(/^(\w+)=(.+)$/)) {
            const [, key, value] = m;
            ({  opened: n => _.times(n, () => model.lower_chest(region)),
                medallion: n => _.times(n, () => model.raise_medallion(region)),
                keys: n => _.times(n, () => model.raise_key(region)),
                door: v => _.each(v.split('-'), name => model.toggle_door_mark(region, name))
            })[key](isNaN(v = +value) ? value : v);
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
        model = create_model({ open: true });
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

        const lightworld_samples = {
            lightworld_deathmountain_west: 'ether',
            lightworld_deathmountain_east: 'island_dm',
            lightworld_northwest: 'altar',
            lightworld_northeast: 'zora',
            lightworld_south: 'maze',
            castle_escape: 'sanctuary'
        };

        with_cases(lightworld_samples,
        (region, name) => it(`${region} locations have a region association`, () => {
            model.state().lightworld[name].region.should.equal(region);
        }));

        with_cases(lightworld_samples,
        (region, name) => it(`${region} locations can be marked`, () => {
            model.toggle_region_mark(region, name);
            model.state().lightworld[name].state.should.equal('marked');
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

        it('can access mimic when having access to turtle rock', () => {
            _.times(3, () => model.raise_medallion('turtle'));
            update('flute moonpearl mitt hammer somaria sword mirror quake firerod', model);
            model.state().lightworld.mimic.state.should.equal('available');
        });

        it('can access altar when having three pendants', () => {
            model.toggle_completion('eastern');
            model.toggle_completion('desert');
            model.toggle_completion('hera');
            _.times(1, () => model.raise_prize('eastern'));
            _.times(2, () => model.raise_prize('desert'));
            _.times(2, () => model.raise_prize('hera'));
            model.state().lightworld.altar.state.should.equal('available');
        });

        it('can access sahasrahla when having the green pendant', () => {
            model.toggle_completion('eastern');
            _.times(1, () => model.raise_prize('eastern'));
            model.state().lightworld.sahasrahla.state.should.equal('available');
        });

    });

    context('darkworld locations', () => {

        const darkworld_samples = {
            darkworld_deathmountain_west: 'spike',
            darkworld_deathmountain_east: 'rock_hook',
            darkworld_northwest: 'bumper',
            darkworld_northeast: 'catfish',
            darkworld_south: 'dig_game',
            darkworld_mire: 'mire_w'
        };

        with_cases(darkworld_samples,
        (region, name) => it(`${region} locations have a region association`, () => {
            model.state().darkworld[name].region.should.equal(region);
        }));

        with_cases(darkworld_samples,
        (region, name) => it(`${region} locations can be marked`, () => {
            model.toggle_region_mark(region, name);
            model.state().darkworld[name].state.should.equal('marked');
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

        it('can access fairy_dw when having two red crystals', () => {
            model.toggle_completion('eastern');
            model.toggle_completion('desert');
            _.times(4, () => model.raise_prize('eastern'));
            _.times(4, () => model.raise_prize('desert'));
            update('moonpearl glove hammer', model);
            model.state().darkworld.fairy_dw.state.should.equal('available');
        });

    });

    context('open keysanity mode', () => {

        beforeEach(() => {
            model = create_model({ open: true, keysanity: true, hammery_jump: false, bomb_jump: false });
        });

        it('can level ganon tower chests', () => {
            model.state().ganon_tower.chests.should.be.above(0);
            model.raise_chest('ganon_tower');
            model.state().ganon_tower.chests.should.equal(0);
            model.lower_chest('ganon_tower');
            model.state().ganon_tower.chests.should.be.above(0);
        });

        with_cases(..._.without(each_dungeon, 'eastern'),
        (dungeon) => it(`can level ${dungeon} keys`, () => {
            model.state().dungeons[dungeon].keys.should.equal(0);
            model.lower_key(dungeon);
            model.state().dungeons[dungeon].keys.should.be.above(0);
            model.raise_key(dungeon);
            model.state().dungeons[dungeon].keys.should.equal(0);
        }));

        with_cases('castle_escape', 'castle_tower', 'ganon_tower',
        (region) => it(`can level ${region} keys`, () => {
            model.state()[region].keys.should.equal(0);
            model.lower_key(region);
            model.state()[region].keys.should.be.above(0);
            model.raise_key(region);
            model.state()[region].keys.should.equal(0);
        }));

        with_cases(...each_dungeon,
        (dungeon) => it(`can toggle ${dungeon} big key`, () => {
            model.state().dungeons[dungeon].big_key.should.be.false;
            model.toggle_big_key(dungeon);
            model.state().dungeons[dungeon].big_key.should.be.true;
            model.toggle_big_key(dungeon);
            model.state().dungeons[dungeon].big_key.should.be.false;
        }));

        it(`can toggle castle tower big key`, () => {
            model.state().ganon_tower.big_key.should.be.false;
            model.toggle_big_key('ganon_tower');
            model.state().ganon_tower.big_key.should.be.true;
            model.toggle_big_key('ganon_tower');
            model.state().ganon_tower.big_key.should.be.false;
        });

        context('dungeons', () => {

            with_cases({
                desert: 'north',
                darkness: 'front',
                turtle: 'crystaroller'
            }, (region, name) => it(`${region} doors can be marked`, () => {
                model.toggle_door_mark(region, name);
                model.state().dungeons[region].doors[name].should.equal('marked');
            }));

            with_cases(...each_dungeon,
            (region) => it(`${region} locations can be marked`, () => {
                model.toggle_region_mark(region, 'compass');
                model.state().dungeons[region].locations.compass.should.equal('marked');
            }));

            with_cases(
            ['desert', 'north', 'glove', 'unavailable'],
            ['desert', 'north', 'book glove', 'available'],
            ['darkness', 'front', 'keys=1', 'unavailable'],
            ['darkness', 'front', 'keys=1 moonpearl glove hammer', 'available'],
            ['turtle', 'crystaroller', 'big_key keys=2 bombos ether quake', 'unavailable'],
            ['turtle', 'crystaroller', 'big_key keys=2 moonpearl mitt hammer somaria sword mirror lamp bombos ether quake', 'available'],
            (region, name, progress, state) => it(`can access ${region} - door ${name} is ${state} ${_with(progress)}`, () => {
                update(progress, model, region);
                model.state().dungeons[region].doors[name].should.equal(state);
            }));

            with_cases(
            ['eastern', 'big_chest', null, 'unavailable'],
            ['eastern', 'big_chest', 'big_key', 'available'],
            ['desert', 'map', null, 'unavailable'],
            ['desert', 'map', 'book', 'available'],
            ['hera', 'map', null, 'unavailable'],
            ['hera', 'map', 'mirror glove', 'dark'],
            ['hera', 'map', 'mirror flute', 'available'],
            ['darkness', 'shooter', null, 'unavailable'],
            ['darkness', 'shooter', 'moonpearl glove hammer', 'available'],
            ['swamp', 'entrance', null, 'unavailable'],
            ['swamp', 'entrance', 'moonpearl mirror flippers glove hammer', 'available'],
            ['skull', 'map', null, 'unavailable'],
            ['skull', 'map', 'moonpearl glove hammer', 'available'],
            ['thieves', 'map', null, 'unavailable'],
            ['thieves', 'map', 'moonpearl glove hammer', 'available'],
            ['ice', 'compass', null, 'unavailable'],
            ['ice', 'compass', 'moonpearl flippers mitt firerod', 'available'],
            ['mire', 'main', 'bombos ether quake', 'unavailable'],
            ['mire', 'main', 'moonpearl boots sword flute mitt bombos ether quake', 'available'],
            ['turtle', 'compass', 'bombos ether quake', 'unavailable'],
            ['turtle', 'compass', 'moonpearl mitt hammer somaria sword mirror bombos ether quake', 'dark'],
            ['turtle', 'compass', 'moonpearl mitt hammer somaria sword mirror flute bombos ether quake', 'available'],
            (region, name, progress, state) => it(`can access ${region} - ${name} is ${state} ${_with(progress)}`, () => {
                update(progress, model, region);
                model.state().dungeons[region].locations[name].should.equal(state);
            }));

            with_cases(
            ['eastern', null, 'unavailable'],
            ['eastern', 'big_key bow lamp', 'available'],
            ['desert', 'big_key glove firerod', 'unavailable'],
            ['desert', 'big_key book glove firerod', 'available'],
            ['hera', 'big_key sword', 'unavailable'],
            ['hera', 'big_key mirror glove sword', 'dark'],
            ['hera', 'big_key mirror flute sword', 'available'],
            ['darkness', 'big_key keys=1 bow hammer lamp', 'unavailable'],
            ['darkness', 'big_key keys=1 moonpearl glove bow hammer lamp', 'available'],
            ['swamp', 'keys=1 hammer hookshot', 'unavailable'],
            ['swamp', 'keys=1 moonpearl mirror flippers glove hammer hookshot', 'available'],
            ['skull', 'firerod sword', 'unavailable'],
            ['skull', 'moonpearl glove hammer firerod sword', 'available'],
            ['thieves', 'big_key sword', 'unavailable'],
            ['thieves', 'big_key moonpearl glove hammer sword', 'available'],
            ['ice', 'hammer', 'unavailable'],
            ['ice', 'moonpearl flippers mitt firerod hammer', 'possible'],
            ['mire', 'big_key somaria bombos ether quake lamp', 'unavailable'],
            ['mire', 'big_key moonpearl boots sword flute mitt somaria bombos ether quake lamp', 'available'],
            ['turtle', 'big_key keys=3 firerod icerod bombos ether quake lamp', 'unavailable'],
            ['turtle', 'big_key keys=3 moonpearl mitt hammer somaria sword mirror firerod icerod bombos ether quake lamp', 'available'],
            (region, progress, state) => it(`completable ${region} is ${state} ${_with(progress)}`, () => {
                update(progress, model, region);
                model.state().dungeons[region].completable.should.equal(state);
            }));

            context('location mismatch', () => {

                const location_samples = [
                    ['eastern', 'compass', 'map'],
                    ['desert', 'compass', 'map'],
                    ['hera', 'compass', 'map'],
                    ['darkness', 'compass', 'map'],
                    ['swamp', 'compass', 'map'],
                    ['skull', 'compass', 'map'],
                    ['thieves', 'compass', 'map'],
                    ['ice', 'compass', 'map'],
                    ['mire', 'compass', 'map'],
                    ['turtle', 'compass', 'big_key']
                ];

                with_cases(...each_dungeon,
                (region) => it(`${region} has inconclusive states when deviating below by lowering chest count`, () => {
                    model.lower_chest(region);

                    const state = model.state();
                    state.dungeons[region].completable.should.equal('inconclusive');
                    state.dungeons[region].progressable.should.equal('inconclusive');
                    _.map(state.dungeons[region].locations).should.each.equal('inconclusive');
                }));

                with_cases(...each_dungeon,
                (region) => it(`${region} has conclusive states when deviating below and then raising chest count`, () => {
                    model.lower_chest(region);

                    model.raise_chest(region);

                    const state = model.state();
                    state.dungeons[region].completable.should.not.equal('inconclusive');
                    state.dungeons[region].progressable.should.not.equal('inconclusive');
                    _.map(state.dungeons[region].locations).should.each.not.equal('inconclusive');
                }));

                with_cases(...location_samples,
                (region, name) => it(`${region} has inconclusive states when deviating above by raising chest count`, () => {
                    model.toggle_region_mark(region, name);

                    model.raise_chest(region);

                    const state = model.state();
                    state.dungeons[region].completable.should.equal('inconclusive');
                    state.dungeons[region].progressable.should.equal('inconclusive');
                    _.map(state.dungeons[region].locations).should.each.be.oneOf(['inconclusive', 'marked']);
                }));

                with_cases(...location_samples,
                (region, name) => it(`${region} has conclusive states when deviating above and then lowering chest count`, () => {
                    model.toggle_region_mark(region, name);
                    model.raise_chest(region);

                    model.lower_chest(region);

                    const state = model.state();
                    state.dungeons[region].completable.should.not.equal('inconclusive');
                    state.dungeons[region].progressable.should.not.equal('inconclusive');
                    _.map(state.dungeons[region].locations).should.each.not.equal('inconclusive');
                }));

                with_cases(...location_samples,
                (region, name) => it(`${region} has conclusive states while marking a location`, () => {
                    const count = model.state().dungeons[region].chests;

                    model.toggle_region_mark(region, name);

                    const state = model.state();
                    state.dungeons[region].chests.should.be.below(count);
                    state.dungeons[region].completable.should.not.equal('inconclusive');
                    state.dungeons[region].progressable.should.not.equal('inconclusive');
                    _.map(state.dungeons[region].locations).should.each.not.equal('inconclusive');
                }));

                with_cases(...location_samples,
                (region, name) => it(`${region} has conclusive states while unmarking a location`, () => {
                    model.toggle_region_mark(region, name);
                    const count = model.state().dungeons[region].chests;

                    model.toggle_region_mark(region, name);

                    const state = model.state();
                    state.dungeons[region].chests.should.be.above(count);
                    state.dungeons[region].completable.should.not.equal('inconclusive');
                    state.dungeons[region].progressable.should.not.equal('inconclusive');
                    _.map(state.dungeons[region].locations).should.each.not.equal('inconclusive');
                }));

                with_cases(...location_samples,
                (region, name) => it(`${region} has conclusive states when deviating below while marking a location`, () => {
                    model.lower_chest(region);
                    const count = model.state().dungeons[region].chests;

                    model.toggle_region_mark(region, name);

                    const state = model.state();
                    state.dungeons[region].chests.should.equal(count);
                    state.dungeons[region].completable.should.not.equal('inconclusive');
                    state.dungeons[region].progressable.should.not.equal('inconclusive');
                    _.map(state.dungeons[region].locations).should.each.not.equal('inconclusive');
                }));

                with_cases(...location_samples,
                (region, name) => it(`${region} has conclusive states when deviating above while unmarking a location`, () => {
                    model.toggle_region_mark(region, name);
                    model.raise_chest(region);
                    const count = model.state().dungeons[region].chests;

                    model.toggle_region_mark(region, name);

                    const state = model.state();
                    state.dungeons[region].chests.should.equal(count);
                    state.dungeons[region].completable.should.not.equal('inconclusive');
                    state.dungeons[region].progressable.should.not.equal('inconclusive');
                    _.map(state.dungeons[region].locations).should.each.not.equal('inconclusive');
                }));

                with_cases(...location_samples,
                (region, name) => it(`${region} has inconclusive states when deviating far below while marking a location`, () => {
                    _.times(2, () => model.lower_chest(region));
                    const count = model.state().dungeons[region].chests;

                    model.toggle_region_mark(region, name);

                    const state = model.state();
                    state.dungeons[region].chests.should.equal(count);
                    state.dungeons[region].completable.should.equal('inconclusive');
                    state.dungeons[region].progressable.should.equal('inconclusive');
                    _.map(state.dungeons[region].locations).should.each.be.oneOf(['inconclusive', 'marked']);
                }));

                with_cases(...location_samples,
                (region, name, second_name) => it(`${region} has inconclusive states when deviating far above while unmarking a location`, () => {
                    model.toggle_region_mark(region, second_name);
                    model.toggle_region_mark(region, name);
                    _.times(2, () => model.raise_chest(region));
                    const count = model.state().dungeons[region].chests;

                    model.toggle_region_mark(region, name);

                    const state = model.state();
                    state.dungeons[region].chests.should.equal(count);
                    state.dungeons[region].completable.should.equal('inconclusive');
                    state.dungeons[region].progressable.should.equal('inconclusive');
                    _.map(state.dungeons[region].locations).should.each.be.oneOf(['inconclusive', 'marked']);
                }));

                with_cases(...each_dungeon,
                (region) => it(`completable ${region} is marked when marking the boss location`, () => {
                    model.toggle_region_mark(region, 'boss');

                    const state = model.state();
                    state.dungeons[region].completable.should.equal('marked');
                    state.dungeons[region].locations.boss.should.equal('marked');
                }));

                with_cases(...each_dungeon,
                (region) => it(`completable ${region} is not marked when unmarking the boss location`, () => {
                    model.toggle_region_mark(region, 'boss');

                    model.toggle_region_mark(region, 'boss');

                    const state = model.state();
                    state.dungeons[region].completable.should.not.equal('marked');
                    state.dungeons[region].locations.boss.should.not.equal('marked');
                }));

                with_cases(...each_dungeon,
                (region) => it(`completable ${region} and boss location is marked when marking completion`, () => {
                    model.toggle_completion(region);

                    const state = model.state();
                    state.dungeons[region].completable.should.equal('marked');
                    state.dungeons[region].locations.boss.should.equal('marked');
                }));

                with_cases(...each_dungeon,
                (region) => it(`completable ${region} and boss location is not marked when unmarking completion`, () => {
                    model.toggle_completion(region);

                    model.toggle_completion(region);

                    const state = model.state();
                    state.dungeons[region].completable.should.not.equal('marked');
                    state.dungeons[region].locations.boss.should.not.equal('marked');
                }));

                with_cases(...each_dungeon,
                (region) => it(`${region} has conclusive states while marking completion`, () => {
                    const count = model.state().dungeons[region].chests;

                    model.toggle_completion(region);

                    const state = model.state();
                    state.dungeons[region].chests.should.be.below(count);
                    state.dungeons[region].completable.should.not.equal('inconclusive');
                    state.dungeons[region].progressable.should.not.equal('inconclusive');
                    _.map(state.dungeons[region].locations).should.each.not.equal('inconclusive');
                }));

                with_cases(...each_dungeon,
                (region) => it(`${region} has conclusive states while unmarking completion`, () => {
                    model.toggle_completion(region);
                    const count = model.state().dungeons[region].chests;

                    model.toggle_completion(region);

                    const state = model.state();
                    state.dungeons[region].chests.should.be.above(count);
                    state.dungeons[region].completable.should.not.equal('inconclusive');
                    state.dungeons[region].progressable.should.not.equal('inconclusive');
                    _.map(state.dungeons[region].locations).should.each.not.equal('inconclusive');
                }));

                with_cases(...each_dungeon,
                (region) => it(`${region} has conclusive states when deviating below while marking completion`, () => {
                    model.lower_chest(region);
                    const count = model.state().dungeons[region].chests;

                    model.toggle_completion(region);

                    const state = model.state();
                    state.dungeons[region].chests.should.equal(count);
                    state.dungeons[region].completable.should.not.equal('inconclusive');
                    state.dungeons[region].progressable.should.not.equal('inconclusive');
                    _.map(state.dungeons[region].locations).should.each.not.equal('inconclusive');
                }));

                with_cases(...each_dungeon,
                (region) => it(`${region} has conclusive states when deviating above while unmarking completion`, () => {
                    model.toggle_completion(region);
                    model.raise_chest(region);
                    const count = model.state().dungeons[region].chests;

                    model.toggle_completion(region);

                    const state = model.state();
                    state.dungeons[region].chests.should.equal(count);
                    state.dungeons[region].completable.should.not.equal('inconclusive');
                    state.dungeons[region].progressable.should.not.equal('inconclusive');
                    _.map(state.dungeons[region].locations).should.each.not.equal('inconclusive');
                }));

                with_cases(...each_dungeon,
                (region) => it(`${region} has inconclusive states when deviating far below while marking completion`, () => {
                    _.times(2, () => model.lower_chest(region));
                    const count = model.state().dungeons[region].chests;

                    model.toggle_completion(region);

                    const state = model.state();
                    state.dungeons[region].chests.should.equal(count);
                    state.dungeons[region].completable.should.equal('marked');
                    state.dungeons[region].progressable.should.equal('inconclusive');
                    _.map(state.dungeons[region].locations).should.each.be.oneOf(['inconclusive', 'marked']);
                }));

                with_cases(...location_samples,
                (region, name, second_name) => it(`${region} has inconclusive states when deviating far above while unmarking completion`, () => {
                    model.toggle_region_mark(region, second_name);
                    model.toggle_region_mark(region, name);
                    _.times(2, () => model.raise_chest(region));
                    const count = model.state().dungeons[region].chests;

                    model.toggle_region_mark(region, name);

                    const state = model.state();
                    state.dungeons[region].chests.should.equal(count);
                    state.dungeons[region].completable.should.equal('inconclusive');
                    state.dungeons[region].progressable.should.equal('inconclusive');
                    _.map(state.dungeons[region].locations).should.each.be.oneOf(['inconclusive', 'marked']);
                }));

                with_cases('desert', 'darkness', 'turtle',
                (region) => it(`${region} doors has conclusive states when not deviating`, () => {
                    _.map(model.state().dungeons[region].doors).should.each.not.equal('inconclusive');
                }));

                with_cases('desert', 'darkness', 'turtle',
                (region) => it(`${region} doors has in conclusive states when deviating`, () => {
                    model.lower_chest(region);
                    _.map(model.state().dungeons[region].doors).should.each.equal('inconclusive');
                }));

            });

        });

    });

});
