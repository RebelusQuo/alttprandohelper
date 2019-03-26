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

    const create_model = () => {
        const mode = open_mode_setting;
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
                    _.mapValues(_.pick(world, dungeons), region => ({
                        completable: region.completed ? 'marked' :
                            derive_state(region, { ...args, region }, region.can_complete),
                        progressable: !region.chests ? 'marked' :
                            derive_state(region, { ...args, region }, region.can_progress),
                        ..._.pick(region, 'chests', 'prize', 'medallion')
                    }));
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
                    }
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
                world = update(world, { [region]: update.toggle('completed') });
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
