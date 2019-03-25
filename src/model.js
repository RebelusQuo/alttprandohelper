(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./items'), require('../js/lib/immutable-update'));
    } else {
        root.create_model = factory(root.create_items, root.update);
    }
}(typeof self !== 'undefined' ? self : this, function(create_items, update) {
    const create_model = () => {
        let items = create_items().items;
        return {
            state() {
                return { items };
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
            }
        }
    };

    const level = (value, limit, delta) => {
        const [max, min] = limit[0] ? limit : [limit, 0];
        const modulo = max-min+1;
        return (value-min + modulo + delta) % modulo + min;
    };

    return create_model;
}));
