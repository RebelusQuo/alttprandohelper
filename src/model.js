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
        let world = create_world(open_mode_setting).world;
        let items = create_items().items;
        return {
            state() {
                const dungeons = (...dungeons) =>
                    _.mapValues(_.pick(world, dungeons), region =>
                        _.pick(region, 'chests', 'prize', 'medallion'));
                return {
                    items,
                    dungeons: dungeons(
                        'eastern', 'desert', 'hera', 'darkness', 'swamp',
                        'skull', 'thieves', 'ice', 'mire', 'turtle')
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
