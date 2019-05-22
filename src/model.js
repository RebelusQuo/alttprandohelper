(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory(
            require('./world'),
            require('./items'),
            require('../js/lib/immutable-update'),
            require('lodash'));
    } else {
        root.create_model = factory(root.create_world, root.create_items, root.update, root._);
    }
}(typeof self !== 'undefined' ? self : this, function(create_world, create_items, update, _) {
    const open_mode_setting = {};
    const prizes = ['unknown', 'pendant-green', 'pendant', 'crystal', 'crystal-red'];
    const medallions = ['unknown', 'bombos', 'ether', 'quake'];

    const create_model = (mode) => {
        let world = create_world(mode).world;
        let items = create_items().items;
        return {
            state() {
                const args = { items, world, mode };
                const derive_state = (region, args, location) => {
                    region = !region.can_enter || region.can_enter(args) ||
                        !!region.can_enter_dark && region.can_enter_dark(args) && 'dark';
                    // respects dark higher, but possible/viewable highest
                    const state = region && (location =>
                        region === true ? location :
                        location === true ? region :
                        location
                    )(location(args));
                    return _.isString(state) ? state :
                        state ? 'available' : 'unavailable';
                };
                const dungeons = (...dungeons) =>
                    _.mapValues(_.pick(world, dungeons), region => {
                        const deviating = mode.keysanity && region.has_deviating_counts();
                        return {
                            completable: region.completed ? 'marked' : deviating ? 'inconclusive' :
                                derive_state(region, { ...args, region }, region.can_complete),
                            progressable: !region.chests ? 'marked' : deviating ? 'inconclusive' :
                                derive_state(region, { ...args, region }, region.can_progress),
                            ..._.pick(region, 'chests', 'prize', 'medallion', 'keys', 'big_key'),
                            ...(mode.keysanity && {
                                locations: _.mapValues(region.locations, location => location.marked ? 'marked' : deviating ? 'inconclusive' :
                                    derive_state(region, { ...args, region }, args => !location.can_access || location.can_access(args)))
                            }),
                            ...(mode.keysanity && region.doors && {
                                doors: _.mapValues(region.doors, door => door.opened ? 'marked' : deviating ? 'inconclusive' :
                                    derive_state(region, { ...args, region }, args => !door.can_access || door.can_access(args)))
                            })
                        };
                    });
                const overworld = (...regions) =>
                    _.assign(..._.map(_.pick(world, regions), (region, name) => ({
                        ..._.mapValues(region.locations, location => ({
                            region: name,
                            state: location.marked ? 'marked' : derive_state(region, { ...args, region },
                                args => !location.can_access || location.can_access(args))
                        }))
                    })));
                return {
                    items,
                    dungeons: dungeons(
                        'eastern', 'desert', 'hera', 'darkness', 'swamp',
                        'skull', 'thieves', 'ice', 'mire', 'turtle'),
                    encounters: {
                        castle_tower: {
                            completable: (region => region.completed ? 'marked' :
                                derive_state(region, { ...args, region }, region.can_complete))(world.castle_tower)
                        }
                    },
                    lightworld: overworld(
                        'lightworld_deathmountain_west',
                        'lightworld_deathmountain_east',
                        'lightworld_northwest',
                        'lightworld_northeast',
                        'lightworld_south',
                        'castle_escape'),
                    darkworld: overworld(
                        'darkworld_deathmountain_west',
                        'darkworld_deathmountain_east',
                        'darkworld_northwest',
                        'darkworld_northeast',
                        'darkworld_south',
                        'darkworld_mire'),
                    ...(mode.keysanity && {
                        castle_escape: _.pick(world.castle_escape, 'keys'),
                        castle_tower: _.pick(world.castle_tower, 'keys'),
                        ganon_tower: _.pick(world.ganon_tower, 'chests', 'keys', 'big_key')
                    })
                };
            },
            toggle_item(name) {
                items = update(items, update.toggle(name));
            },
            raise_item(name) {
                const value = level(items[name], items.limit[name], 1);
                items = update(items, { [name]: { $set: value } });
            },
            lower_item(name) {
                const value = level(items[name], items.limit[name], -1);
                items = update(items, { [name]: { $set: value } });
            },
            toggle_completion(region) {
                const completed = !world[region].completed;
                const dungeon = mode.keysanity && _.has(world[region].locations, 'boss');
                world = update(world, { [region]: {
                    completed: { $set: completed },
                    locations: dungeon && { boss: { marked: { $set: completed } } },
                    chests: dungeon && !world[region].has_deviating_counts() && (x => x - (completed ? 1 : -1))
                } });
            },
            toggle_big_key(region) {
                world = update(world, { [region]: update.toggle('big_key') });
            },
            raise_key(region) {
                const { keys, key_limit } = world[region];
                const value = level(keys, key_limit, 1);
                world = update(world, { [region]: { keys: { $set: value } } });
            },
            lower_key(region) {
                const { keys, key_limit } = world[region];
                const value = level(keys, key_limit, -1);
                world = update(world, { [region]: { keys: { $set: value } } });
            },
            raise_chest(region) {
                const { chests, chest_limit } = world[region];
                const value = level(chests, chest_limit, 1);
                world = update(world, { [region]: { chests: { $set: value } } });
            },
            lower_chest(region) {
                const { chests, chest_limit } = world[region];
                const value = level(chests, chest_limit, -1);
                world = update(world, { [region]: { chests: { $set: value } } });
            },
            raise_prize(region) {
                const value = level_symbol(world[region].prize, prizes, 1);
                world = update(world, { [region]: { prize: { $set: value } } });
            },
            lower_prize(region) {
                const value = level_symbol(world[region].prize, prizes, -1);
                world = update(world, { [region]: { prize: { $set: value } } });
            },
            raise_medallion(region) {
                const value = level_symbol(world[region].medallion, medallions, 1);
                world = update(world, { [region]: { medallion: { $set: value } } });
            },
            lower_medallion(region) {
                const value = level_symbol(world[region].medallion, medallions, -1);
                world = update(world, { [region]: { medallion: { $set: value } } });
            },
            toggle_region_mark(region, name) {
                const marked = !world[region].locations[name].marked;
                const dungeon = mode.keysanity && _.has(world[region].locations, 'boss');
                world = update(world, { [region]: {
                    locations: { [name]: { marked: { $set: marked } } },
                    completed: name === 'boss' && { $set: marked },
                    chests: dungeon && !world[region].has_deviating_counts() && (x => x - (marked ? 1 : -1))
                } });
            },
            toggle_door_mark(region, name) {
                world = update(world, { [region]: { doors: { [name]: update.toggle('opened') } } });
            }
        }
    };

    const level = (value, limit, delta) => {
        const [max, min] = limit[0] ? limit : [limit, 0];
        const modulo = max-min+1;
        return (value-min + modulo + delta) % modulo + min;
    };

    const level_symbol = (value, symbols, delta) => {
        const modulo = symbols.length;
        const index = symbols.indexOf(value);
        return symbols[(index + modulo + delta) % modulo];
    };

    return create_model;
}));
