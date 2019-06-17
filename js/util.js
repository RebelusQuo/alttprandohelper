(function (window) {
    'use strict';

    _.mixin({
        matchAll: function matchAll(text, pattern) {
            var result = [];
            var match = void 0;
            while (match = pattern.exec(text)) {
                result.push(match);
            }
            return result;
        }
    });

    // based on https://github.com/medialize/URI.js/blob/gh-pages/src/URI.js
    window.uri_query = _.memoize(function () {
        var q = void 0;
        var href = location.href + '';
        var qi = href.indexOf('?');
        var hi = href.indexOf('#');

        q = hi >= 0 ? href.substring(0, hi) : href;
        q = qi >= 0 ? q.substring(qi) : '';

        // clean out leading question, trim amps, and consecutive amps
        return q.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '').split('&').reduce(function (items, param) {
            if (!param) return items;
            var v = param.split('=', 2);
            var name = decodeURIComponent(v.shift());
            var value = v[0] ? decodeURIComponent(v.shift()) : true;
            items[name] = value;
            return items;
        }, {});
    });
})(window);