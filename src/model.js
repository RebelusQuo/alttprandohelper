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
            }
        }
    };

    return create_model;
}));
