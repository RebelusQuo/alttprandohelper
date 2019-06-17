var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n      width: 64px;\n      height: 64px;\n    '], ['\n      width: 64px;\n      height: 64px;\n    ']),
    _templateObject2 = _taggedTemplateLiteral(['\n      filter: contrast(', '%)\n              brightness(', '%);\n    '], ['\n      filter: contrast(', '%)\n              brightness(', '%);\n    ']),
    _templateObject3 = _taggedTemplateLiteral(['\n      width: 32px;\n      height: 32px;\n    '], ['\n      width: 32px;\n      height: 32px;\n    ']),
    _templateObject4 = _taggedTemplateLiteral(['\n      position: relative;\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      grid-template-rows: 1fr 1fr;\n      grid-template-areas:\n      ', ';\n      & .medallion { grid-area: mn; }\n      & .prize { grid-area: pz; }\n      & .big-key { grid-area: bk; }\n      & .boss { position: absolute; }\n      & ', ' { z-index: 1; }\n    '], ['\n      position: relative;\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      grid-template-rows: 1fr 1fr;\n      grid-template-areas:\n      ', ';\n      & .medallion { grid-area: mn; }\n      & .prize { grid-area: pz; }\n      & .big-key { grid-area: bk; }\n      & .boss { position: absolute; }\n      & ', ' { z-index: 1; }\n    ']),
    _templateObject5 = _taggedTemplateLiteral(['\n      color: white;\n      font-weight: bold;\n      text-shadow:\n        -2px -2px black,  0px -2px black,\n         2px -2px black,  2px  0px black,\n         2px  2px black,  0px  2px black,\n        -2px  2px black, -2px  0px black;\n      user-select: none;\n    '], ['\n      color: white;\n      font-weight: bold;\n      text-shadow:\n        -2px -2px black,  0px -2px black,\n         2px -2px black,  2px  0px black,\n         2px  2px black,  0px  2px black,\n        -2px  2px black, -2px  0px black;\n      user-select: none;\n    ']),
    _templateObject6 = _taggedTemplateLiteral(['\n      font-size: 20px;\n    '], ['\n      font-size: 20px;\n    ']),
    _templateObject7 = _taggedTemplateLiteral(['\n      font-size: 14px;\n    '], ['\n      font-size: 14px;\n    ']),
    _templateObject8 = _taggedTemplateLiteral(['\n      display: flex;\n      justify-content: center;\n      align-items: center;\n    '], ['\n      display: flex;\n      justify-content: center;\n      align-items: center;\n    ']),
    _templateObject9 = _taggedTemplateLiteral(['\n      width: ', 'px;\n      height: ', 'px;\n      background-size: 100%;\n      display: grid;\n      grid-template-areas:\n        ".  sw"\n        "sh mp";\n      & .sword { grid-area: sw }\n      & .shield { grid-area: sh }\n      & .moonpearl { grid-area: mp }\n      ', '\n      & .moonpearl {\n        margin-top: ', 'px;\n        margin-left: ', 'px;\n        width: ', 'px;\n        height: ', 'px;\n        background-size: 100%;\n      }\n    '], ['\n      width: ', 'px;\n      height: ', 'px;\n      background-size: 100%;\n      display: grid;\n      grid-template-areas:\n        ".  sw"\n        "sh mp";\n      & .sword { grid-area: sw }\n      & .shield { grid-area: sh }\n      & .moonpearl { grid-area: mp }\n      ', '\n      & .moonpearl {\n        margin-top: ', 'px;\n        margin-left: ', 'px;\n        width: ', 'px;\n        height: ', 'px;\n        background-size: 100%;\n      }\n    ']),
    _templateObject10 = _taggedTemplateLiteral(['\n        & .sword,\n        & .shield {\n          width: 48px;\n          height: 48px;\n          background-size: 100%;\n        }\n      '], ['\n        & .sword,\n        & .shield {\n          width: 48px;\n          height: 48px;\n          background-size: 100%;\n        }\n      ']),
    _templateObject11 = _taggedTemplateLiteral(['\n      display: grid;\n      grid-template-columns: repeat(5, 1fr);\n      grid-template-rows: repeat(5, 1fr);\n    '], ['\n      display: grid;\n      grid-template-columns: repeat(5, 1fr);\n      grid-template-rows: repeat(5, 1fr);\n    ']),
    _templateObject12 = _taggedTemplateLiteral(['\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      grid-template-rows: 1fr 1fr 1fr;\n      grid-auto-flow: column;\n    '], ['\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      grid-template-rows: 1fr 1fr 1fr;\n      grid-auto-flow: column;\n    ']),
    _templateObject13 = _taggedTemplateLiteral(['\n      display: grid;\n      grid-template-columns: repeat(7, 1fr);\n      grid-template-rows: 1fr 1fr;\n    '], ['\n      display: grid;\n      grid-template-columns: repeat(7, 1fr);\n      grid-template-rows: 1fr 1fr;\n    ']),
    _templateObject14 = _taggedTemplateLiteral(['\n      display: grid;\n      grid-template-areas:\n        "p i"\n        "l i"\n        "d d";\n      & ', ' { grid-area: i; }\n      & ', ' { grid-area: d; }\n    '], ['\n      display: grid;\n      grid-template-areas:\n        "p i"\n        "l i"\n        "d d";\n      & ', ' { grid-area: i; }\n      & ', ' { grid-area: d; }\n    ']),
    _templateObject15 = _taggedTemplateLiteral(['\n      width: 128px;\n      height: 128px;\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      grid-template-rows: repeat(4, 1fr);\n      & ', ' { grid-row: 1 / 4; }\n    '], ['\n      width: 128px;\n      height: 128px;\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      grid-template-rows: repeat(4, 1fr);\n      & ', ' { grid-row: 1 / 4; }\n    ']),
    _templateObject16 = _taggedTemplateLiteral(['\n      display: flex;\n      flex-direction: column;\n      align-items: flex-end;\n      & .agahnim { position: absolute; }\n      & ', ' { z-index: 1; }\n    '], ['\n      display: flex;\n      flex-direction: column;\n      align-items: flex-end;\n      & .agahnim { position: absolute; }\n      & ', ' { z-index: 1; }\n    ']),
    _templateObject17 = _taggedTemplateLiteral(['\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n    '], ['\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n    ']),
    _templateObject18 = _taggedTemplateLiteral(['\n      background-color: ', '\n    '], ['\n      background-color: ', '\n    ']),
    _templateObject19 = _taggedTemplateLiteral(['\n      border: solid hsl(', ');\n    '], ['\n      border: solid hsl(', ');\n    ']),
    _templateObject20 = _taggedTemplateLiteral(['\n      width: 24px;\n      height: 24px;\n      margin-left: -12px;\n      margin-top: -12px;\n      position: absolute;\n      border-width: 3px;\n    '], ['\n      width: 24px;\n      height: 24px;\n      margin-left: -12px;\n      margin-top: -12px;\n      position: absolute;\n      border-width: 3px;\n    ']),
    _templateObject21 = _taggedTemplateLiteral(['\n      width: 36px;\n      height: 36px;\n      margin-left: -18px;\n      margin-top: -18px;\n      position: absolute;\n      border-width: 4px;\n    '], ['\n      width: 36px;\n      height: 36px;\n      margin-left: -18px;\n      margin-top: -18px;\n      position: absolute;\n      border-width: 4px;\n    ']),
    _templateObject22 = _taggedTemplateLiteral(['\n      background-repeat: no-repeat;\n      background-position: center;\n      background-size: 18px;\n    '], ['\n      background-repeat: no-repeat;\n      background-position: center;\n      background-size: 18px;\n    ']),
    _templateObject23 = _taggedTemplateLiteral(['\n      width: 48px;\n      height: 48px;\n      margin-left: -24px;\n      margin-top: -24px;\n      position: absolute;\n      border-width: 6px;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n    '], ['\n      width: 48px;\n      height: 48px;\n      margin-left: -24px;\n      margin-top: -24px;\n      position: absolute;\n      border-width: 6px;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n    ']),
    _templateObject24 = _taggedTemplateLiteral(['\n      width: 24px;\n      height: 24px;\n      background-repeat: no-repeat;\n      background-position: center;\n      background-size: 18px;\n    '], ['\n      width: 24px;\n      height: 24px;\n      background-repeat: no-repeat;\n      background-position: center;\n      background-size: 18px;\n    ']),
    _templateObject25 = _taggedTemplateLiteral(['\n      background-repeat: no-repeat;\n      background-position: center;\n      background-size: 24px;\n    '], ['\n      background-repeat: no-repeat;\n      background-position: center;\n      background-size: 24px;\n    ']),
    _templateObject26 = _taggedTemplateLiteral(['\n      width: 100%;\n      position: absolute;\n      bottom: 0;\n      color: white;\n      background-color: black;\n      font-size: 16px;\n      text-align: center;\n    '], ['\n      width: 100%;\n      position: absolute;\n      bottom: 0;\n      color: white;\n      background-color: black;\n      font-size: 16px;\n      text-align: center;\n    ']),
    _templateObject27 = _taggedTemplateLiteral(['\n      width: 16px;\n      height: 16px;\n      display: inline-block;\n      vertical-align: text-bottom;\n      background-size: 100%;\n    '], ['\n      width: 16px;\n      height: 16px;\n      display: inline-block;\n      vertical-align: text-bottom;\n      background-size: 100%;\n    ']),
    _templateObject28 = _taggedTemplateLiteral(['\n      width: 442px;\n      height: 442px;\n      position: relative;\n    '], ['\n      width: 442px;\n      height: 442px;\n      position: relative;\n    ']),
    _templateObject29 = _taggedTemplateLiteral(['\n      position: relative;\n      display: grid;\n      ', '\n      gap: 4px;\n      & > ', ' { margin: 0 auto; }\n    '], ['\n      position: relative;\n      display: grid;\n      ', '\n      gap: 4px;\n      & > ', ' { margin: 0 auto; }\n    ']),
    _templateObject30 = _taggedTemplateLiteral(['\n      margin: 10px;\n      position: absolute;\n      top: 0;\n      color: white;\n      line-height: 1;\n      font-size: 30px;\n      font-weight: bold;\n      cursor: pointer;\n    '], ['\n      margin: 10px;\n      position: absolute;\n      top: 0;\n      color: white;\n      line-height: 1;\n      font-size: 30px;\n      font-weight: bold;\n      cursor: pointer;\n    ']),
    _templateObject31 = _taggedTemplateLiteral(['\n      display: grid;\n      ', '\n      gap: 4px;\n      ', '\n    '], ['\n      display: grid;\n      ', '\n      gap: 4px;\n      ', '\n    ']);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

(function (window) {
    'use strict';

    var styled = window.styled.default;
    var css = window.styled.css;

    var Slot = styled.div(_templateObject);
    var ActiveItem = styled(Slot)(_templateObject2, function (props) {
        return props.active ? 100 : 80;
    }, function (props) {
        return props.active ? 100 : 30;
    });

    var Item = function Item(props) {
        return React.createElement(ActiveItem, {
            className: classNames(props.name, props.value && props.name + '--active'),
            active: props.value,
            onClick: function onClick() {
                return props.onToggle(props.name);
            } });
    };

    var LeveledItem = function LeveledItem(props) {
        return React.createElement(ActiveItem, {
            className: classNames(props.name, props.value && props.name + '--active-' + props.value),
            active: props.value > 0,
            onClick: function onClick() {
                return props.onLevel({ raise: props.name });
            },
            onContextMenu: function onContextMenu(e) {
                props.onLevel({ lower: props.name });e.preventDefault();
            } });
    };

    var SubSlot = styled.div(_templateObject3);
    var ActiveSubItem = styled(SubSlot)(_templateObject2, function (props) {
        return props.active ? 100 : 80;
    }, function (props) {
        return props.active ? 100 : 30;
    });

    var BigKey = function BigKey(props) {
        return React.createElement(ActiveSubItem, { className: 'big-key',
            active: props.source.big_key,
            onClick: function onClick() {
                return props.onToggle(props.name);
            } });
    };

    var StyledDungeon = styled(Slot)(_templateObject4, function (props) {
        return props.keysanity ? '\n        ".  mn"\n        "bk pz"\n      ' : '\n        ".  ."\n        "mn pz"\n      ';
    }, SubSlot);

    var Dungeon = function Dungeon(props) {
        return React.createElement(
            StyledDungeon,
            { keysanity: props.keysanity },
            React.createElement(ActiveItem, {
                className: 'boss boss---' + props.name,
                active: props.dungeon.completed,
                onClick: function onClick() {
                    return props.onCompletion(props.name);
                } }),
            props.medallion && React.createElement(SubSlot, {
                className: 'medallion medallion--' + props.dungeon.medallion,
                onClick: function onClick() {
                    return props.onMedallion({ raise: props.name });
                },
                onContextMenu: function onContextMenu(e) {
                    props.onMedallion({ lower: props.name });e.preventDefault();
                } }),
            props.keysanity && React.createElement(BigKey, { name: props.name, source: props.dungeon, onToggle: props.onBigKey }),
            React.createElement(SubSlot, {
                className: 'prize prize--' + props.dungeon.prize,
                onClick: function onClick() {
                    return props.onPrize({ raise: props.name });
                },
                onContextMenu: function onContextMenu(e) {
                    props.onPrize({ lower: props.name });e.preventDefault();
                } })
        );
    };

    var Chests = function Chests(props) {
        return React.createElement(Slot, { className: 'chest-' + props.dungeon.chests,
            onClick: function onClick() {
                return props.onLevel({ lower: props.name });
            },
            onContextMenu: function onContextMenu(e) {
                props.onLevel({ raise: props.name });e.preventDefault();
            } });
    };

    var OutlinedText = styled.span(_templateObject5);
    var ChestText = styled(OutlinedText)(_templateObject6);
    var KeyText = styled(OutlinedText)(_templateObject7);
    var TextSubSlot = styled(SubSlot)(_templateObject8);

    var KeysanityChest = function KeysanityChest(props) {
        return React.createElement(
            TextSubSlot,
            { className: classNames('chest', { 'chest--empty': !props.source.chests }),
                onClick: function onClick() {
                    return props.onLevel({ lower: props.name });
                },
                onContextMenu: function onContextMenu(e) {
                    props.onLevel({ raise: props.name });e.preventDefault();
                } },
            React.createElement(
                ChestText,
                null,
                '' + props.source.chests
            )
        );
    };

    var Keys = function Keys(props) {
        var _props$source = props.source,
            keys = _props$source.keys,
            key_limit = _props$source.key_limit;

        return !key_limit ? React.createElement(
            TextSubSlot,
            { className: 'key' },
            React.createElement(
                KeyText,
                null,
                '\u2014'
            )
        ) : React.createElement(
            TextSubSlot,
            { className: 'key',
                onClick: function onClick() {
                    return props.onLevel({ raise: props.name });
                },
                onContextMenu: function onContextMenu(e) {
                    props.onLevel({ lower: props.name });e.preventDefault();
                } },
            React.createElement(
                KeyText,
                null,
                keys + '/' + key_limit
            )
        );
    };

    var Sprite = styled.div(_templateObject9, function (props) {
        return props.keysanity ? 96 : 128;
    }, function (props) {
        return props.keysanity ? 96 : 128;
    }, function (props) {
        return props.keysanity && css(_templateObject10);
    }, function (props) {
        return props.keysanity ? 12 : 16;
    }, function (props) {
        return props.keysanity ? 12 : 16;
    }, function (props) {
        return props.keysanity ? 36 : 48;
    }, function (props) {
        return props.keysanity ? 36 : 48;
    });

    var Portrait = function Portrait(props) {
        var items = props.items,
            keysanity = props.keysanity;
        var onToggle = props.onToggle,
            onLevel = props.onLevel;

        return React.createElement(
            Sprite,
            {
                className: classNames('tunic--active-' + items.tunic, { 'tunic--bunny': !items.moonpearl }),
                keysanity: keysanity,
                onClick: function onClick(e) {
                    return e.target === e.currentTarget && onLevel({ raise: 'tunic' });
                },
                onContextMenu: function onContextMenu(e) {
                    e.target === e.currentTarget && onLevel({ lower: 'tunic' });e.preventDefault();
                } },
            React.createElement(LeveledItem, { name: 'sword', value: items.sword, onLevel: onLevel }),
            React.createElement(LeveledItem, { name: 'shield', value: items.shield, onLevel: onLevel }),
            React.createElement(Item, { name: 'moonpearl', value: items.moonpearl, onToggle: onToggle })
        );
    };

    var TrackerItemGrid = styled.div(_templateObject11);
    var TrackerLwGrid = styled.div(_templateObject12);
    var TrackerDwGrid = styled.div(_templateObject13);
    var TrackerGrid = styled.div(_templateObject14, TrackerItemGrid, TrackerDwGrid);
    var KeysanityPortrait = styled.div(_templateObject15, Sprite);
    var KeysanityAgahnim = styled(Slot)(_templateObject16, SubSlot);
    var KeysanityDungeon = styled(Slot)(_templateObject17);

    var Tracker = function (_React$Component) {
        _inherits(Tracker, _React$Component);

        function Tracker() {
            _classCallCheck(this, Tracker);

            return _possibleConstructorReturn(this, (Tracker.__proto__ || Object.getPrototypeOf(Tracker)).apply(this, arguments));
        }

        _createClass(Tracker, [{
            key: 'render',
            value: function render() {
                var _props$model = this.props.model,
                    items = _props$model.items,
                    world = _props$model.world,
                    keysanity = _props$model.mode.keysanity;
                var ganon_tower = world.ganon_tower,
                    castle_escape = world.castle_escape,
                    castle_tower = world.castle_tower;
                var _props = this.props,
                    onToggle = _props.onToggle,
                    onLevel = _props.onLevel,
                    onChest = _props.onChest,
                    onCompletion = _props.onCompletion,
                    onKey = _props.onKey,
                    onBigKey = _props.onBigKey;

                return React.createElement(
                    TrackerGrid,
                    null,
                    keysanity ? React.createElement(
                        KeysanityPortrait,
                        null,
                        React.createElement(Portrait, { keysanity: true, items: items, onToggle: onToggle, onLevel: onLevel }),
                        React.createElement(KeysanityChest, { name: 'ganon_tower', source: ganon_tower, onLevel: onChest }),
                        React.createElement(Keys, { name: 'ganon_tower', source: ganon_tower, onLevel: onKey }),
                        React.createElement(BigKey, { name: 'ganon_tower', source: ganon_tower, onToggle: onBigKey })
                    ) : React.createElement(Portrait, { items: items, onToggle: onToggle, onLevel: onLevel }),
                    React.createElement(
                        TrackerItemGrid,
                        null,
                        React.createElement(LeveledItem, { name: 'bow', value: items.bow, onLevel: onLevel }),
                        React.createElement(LeveledItem, { name: 'boomerang', value: items.boomerang, onLevel: onLevel }),
                        React.createElement(Item, { name: 'hookshot', value: items.hookshot, onToggle: onToggle }),
                        React.createElement(Item, { name: 'mushroom', value: items.mushroom, onToggle: onToggle }),
                        React.createElement(Item, { name: 'powder', value: items.powder, onToggle: onToggle }),
                        React.createElement(Item, { name: 'firerod', value: items.firerod, onToggle: onToggle }),
                        React.createElement(Item, { name: 'icerod', value: items.icerod, onToggle: onToggle }),
                        React.createElement(Item, { name: 'bombos', value: items.bombos, onToggle: onToggle }),
                        React.createElement(Item, { name: 'ether', value: items.ether, onToggle: onToggle }),
                        React.createElement(Item, { name: 'quake', value: items.quake, onToggle: onToggle }),
                        React.createElement(Item, { name: 'lamp', value: items.lamp, onToggle: onToggle }),
                        React.createElement(Item, { name: 'hammer', value: items.hammer, onToggle: onToggle }),
                        React.createElement(Item, { name: 'shovel', value: items.shovel, onToggle: onToggle }),
                        React.createElement(Item, { name: 'net', value: items.net, onToggle: onToggle }),
                        React.createElement(Item, { name: 'book', value: items.book, onToggle: onToggle }),
                        React.createElement(LeveledItem, { name: 'bottle', value: items.bottle, onLevel: onLevel }),
                        React.createElement(Item, { name: 'somaria', value: items.somaria, onToggle: onToggle }),
                        React.createElement(Item, { name: 'byrna', value: items.byrna, onToggle: onToggle }),
                        React.createElement(Item, { name: 'cape', value: items.cape, onToggle: onToggle }),
                        React.createElement(Item, { name: 'mirror', value: items.mirror, onToggle: onToggle }),
                        React.createElement(Item, { name: 'boots', value: items.boots, onToggle: onToggle }),
                        React.createElement(LeveledItem, { name: 'glove', value: items.glove, onLevel: onLevel }),
                        React.createElement(Item, { name: 'flippers', value: items.flippers, onToggle: onToggle }),
                        React.createElement(Item, { name: 'flute', value: items.flute, onToggle: onToggle }),
                        keysanity ? React.createElement(
                            KeysanityAgahnim,
                            null,
                            React.createElement(Item, { name: 'agahnim', value: castle_tower.completed, onToggle: function onToggle() {
                                    return onCompletion('castle_tower');
                                } }),
                            React.createElement(Keys, { name: 'castle_tower', source: castle_tower, onLevel: onKey }),
                            React.createElement(Keys, { name: 'castle_escape', source: castle_escape, onLevel: onKey })
                        ) : React.createElement(Item, { name: 'agahnim', value: castle_tower.completed, onToggle: function onToggle() {
                                return onCompletion('castle_tower');
                            } })
                    ),
                    React.createElement(
                        TrackerLwGrid,
                        null,
                        this.dungeon('eastern'),
                        this.dungeon('desert'),
                        this.dungeon('hera'),
                        this.inner_dungeon('eastern'),
                        this.inner_dungeon('desert'),
                        this.inner_dungeon('hera')
                    ),
                    React.createElement(
                        TrackerDwGrid,
                        null,
                        this.dungeon('darkness'),
                        this.dungeon('swamp'),
                        this.dungeon('skull'),
                        this.dungeon('thieves'),
                        this.dungeon('ice'),
                        this.dungeon('mire', { medallion: true }),
                        this.dungeon('turtle', { medallion: true }),
                        this.inner_dungeon('darkness'),
                        this.inner_dungeon('swamp'),
                        this.inner_dungeon('skull'),
                        this.inner_dungeon('thieves'),
                        this.inner_dungeon('ice'),
                        this.inner_dungeon('mire'),
                        this.inner_dungeon('turtle')
                    )
                );
            }
        }, {
            key: 'dungeon',
            value: function dungeon(name) {
                var medallion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { medallion: false };

                var dungeon = this.props.model.world[name];
                var keysanity = this.props.model.mode.keysanity;
                var _props2 = this.props,
                    _onCompletion = _props2.onCompletion,
                    onPrize = _props2.onPrize,
                    onMedallion = _props2.onMedallion,
                    onBigKey = _props2.onBigKey;

                return React.createElement(Dungeon, _extends({ name: name, dungeon: dungeon
                }, medallion, {
                    keysanity: keysanity,
                    onCompletion: function onCompletion(name) {
                        return _onCompletion(name, { dungeon: true });
                    },
                    onPrize: onPrize,
                    onMedallion: onMedallion,
                    onBigKey: onBigKey }));
            }
        }, {
            key: 'inner_dungeon',
            value: function inner_dungeon(name) {
                var dungeon = this.props.model.world[name];
                var keysanity = this.props.model.mode.keysanity;
                var _props3 = this.props,
                    onKey = _props3.onKey,
                    onChest = _props3.onChest;

                return keysanity ? React.createElement(
                    KeysanityDungeon,
                    null,
                    React.createElement(Keys, { name: name, source: dungeon, onLevel: onKey }),
                    React.createElement(KeysanityChest, { name: name, source: dungeon, onLevel: onChest })
                ) : React.createElement(Chests, { name: name, dungeon: dungeon, onLevel: onChest });
            }
        }]);

        return Tracker;
    }(React.Component);

    var WithHighlight = function WithHighlight(Wrapped) {
        return function (_React$Component2) {
            _inherits(_class2, _React$Component2);

            function _class2() {
                var _ref;

                var _temp, _this2, _ret;

                _classCallCheck(this, _class2);

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, (_ref = _class2.__proto__ || Object.getPrototypeOf(_class2)).call.apply(_ref, [this].concat(args))), _this2), _this2.state = { highlighted: false }, _this2.onHighlight = function (highlighted) {
                    var location = Wrapped.source(_this2.props);
                    _this2.props.change_caption(highlighted ? typeof location.caption === 'function' ? location.caption(_this2.props.model) : location.caption : null);
                    _this2.setState({ highlighted: highlighted });
                }, _temp), _possibleConstructorReturn(_this2, _ret);
            }

            _createClass(_class2, [{
                key: 'render',
                value: function render() {
                    return React.createElement(Wrapped, _extends({
                        highlighted: this.state.highlighted,
                        onHighlight: this.onHighlight
                    }, this.props));
                }
            }]);

            return _class2;
        }(React.Component);
    };

    var Availability = styled.div(_templateObject18, function (_ref2) {
        var state = _ref2.state;
        return state === 'marked' ? 'hsl(0 0% 50%)' : state === 'dark' ? 'blue' : _.includes(['possible', 'viewable', 'medallion'], state) ? 'yellow' : _.includes(['available', true], state) ? 'lime' : _.includes(['unavailable', false], state) ? 'red' : 'unset';
    });
    var Poi = styled(Availability)(_templateObject19, function (props) {
        return props.highlight ? '55 100% 50%' : '0 0% 10%';
    });

    var region_state = function region_state(region, args) {
        return !region.can_enter || region.can_enter(args) || !!region.can_enter_dark && region.can_enter_dark(args) && 'dark';
    };

    // respects dark higher, but possible/viewable highest
    var derive_state = function derive_state(region, location) {
        return region === true ? location : location === true ? region : location;
    };

    var MinorPoi = styled(Poi)(_templateObject20);

    var OverworldLocation = function OverworldLocation(props) {
        var model = props.model,
            region_name = props.region,
            name = props.name,
            highlighted = props.highlighted;

        var region = model.world[region_name];
        var location = region.locations[name];
        var args = _extends({}, model, { region: region });
        var state = void 0;
        return React.createElement(MinorPoi, { className: 'world---' + _.kebabCase(name),
            state: location.marked ? 'marked' : (state = region_state(region, args)) && derive_state(state, !location.can_access || location.can_access(args)),
            highlight: highlighted,
            onClick: function onClick() {
                return props.onMark(region_name, name);
            },
            onMouseOver: function onMouseOver() {
                return props.onHighlight(true);
            },
            onMouseOut: function onMouseOut() {
                return props.onHighlight(false);
            } });
    };

    OverworldLocation.source = function (props) {
        return props.model.world[props.region].locations[props.name];
    };

    var MedialPoi = styled(Poi)(_templateObject21);
    var EncounterPoi = styled(MedialPoi)(_templateObject22);

    var EncounterLocation = function EncounterLocation(props) {
        var model = props.model,
            region_name = props.region,
            highlighted = props.highlighted;

        var region = model.world[region_name];
        var name = _.kebabCase(region_name);
        var args = _extends({}, model, { region: region });
        var state = void 0;
        return React.createElement(EncounterPoi, { className: 'world---' + name + ' boss---' + name,
            state: region.completed ? 'marked' : (state = region_state(region, args)) && derive_state(state, region.can_complete(args)),
            highlight: highlighted,
            onMouseOver: function onMouseOver() {
                return props.onHighlight(true);
            },
            onMouseOut: function onMouseOut() {
                return props.onHighlight(false);
            } });
    };

    EncounterLocation.source = function (props) {
        return props.model.world[props.region];
    };

    var MajorPoi = styled(Poi)(_templateObject23);
    var DungeonBoss = styled(Availability)(_templateObject24);

    var DungeonLocation = function DungeonLocation(props) {
        var model = props.model,
            region_name = props.region,
            deviated = props.deviated,
            highlighted = props.highlighted;

        var region = model.world[region_name];
        var name = _.kebabCase(region_name);
        var args = _extends({}, model, { region: region });
        var state = void 0;
        return React.createElement(
            MajorPoi,
            { className: 'world---' + name,
                state: region.chests === 0 ? 'marked' : deviated ? 'possible' : (state || (state = region_state(region, args))) && derive_state(state, region.can_progress(args)),
                highlight: highlighted,
                onClick: function onClick() {
                    return props.onDungeon(region_name);
                },
                onMouseOver: function onMouseOver() {
                    return props.onHighlight(true);
                },
                onMouseOut: function onMouseOut() {
                    return props.onHighlight(false);
                } },
            React.createElement(DungeonBoss, { className: 'boss---' + name,
                state: region.completed ? 'marked' : deviated ? 'possible' : (state || (state = region_state(region, args))) && derive_state(state, region.can_complete(args)) })
        );
    };

    DungeonLocation.source = function (props) {
        return props.model.world[props.region];
    };

    var OverworldLocationWithHighlight = WithHighlight(OverworldLocation);
    var EncounterLocationWithHighlight = WithHighlight(EncounterLocation);
    var DungeonLocationWithHighlight = WithHighlight(DungeonLocation);

    var MedialDungeonPoi = styled(MedialPoi)(_templateObject25);

    var DungeonMapDoor = function DungeonMapDoor(props) {
        var model = props.model,
            region_name = props.region,
            name = props.name,
            deviated = props.deviated,
            highlighted = props.highlighted;

        var region = model.world[region_name];
        var door = region.doors[name];
        var args = _extends({}, model, { region: region });
        var state = void 0;
        return React.createElement(MedialDungeonPoi, { className: classNames(region_name + '---door---' + _.kebabCase(name), region_name + '---door', door.opened && region_name + '---door--open'),
            state: door.opened ? 'marked' : deviated ? 'possible' : (state = region_state(region, args)) && derive_state(state, door.can_access && door.can_access(args)),
            highlight: highlighted,
            onClick: function onClick() {
                return props.onMark(region_name, name);
            },
            onMouseOver: function onMouseOver() {
                return props.onHighlight(true);
            },
            onMouseOut: function onMouseOut() {
                return props.onHighlight(false);
            } });
    };

    DungeonMapDoor.source = function (props) {
        return props.model.world[props.region].doors[props.name];
    };

    var DungeonMapLocation = function DungeonMapLocation(props) {
        var model = props.model,
            region_name = props.region,
            name = props.name,
            deviated = props.deviated,
            highlighted = props.highlighted;

        var region = model.world[region_name];
        var location = region.locations[name];
        var args = _extends({}, model, { region: region });
        var state = void 0;
        var Poi = _.includes(['big_chest', 'boss'], name) ? MedialDungeonPoi : MinorPoi;
        return React.createElement(Poi, { className: classNames(region_name + '---' + _.kebabCase(name), _defineProperty({
                'big-chest': name === 'big_chest',
                'big-chest--open': name === 'big_chest' && location.marked
            }, 'boss---' + region_name, name === 'boss')),
            state: location.marked ? 'marked' : deviated ? 'possible' : (state = region_state(region, args)) && derive_state(state, !location.can_access || location.can_access(args)),
            highlight: highlighted,
            onClick: function onClick() {
                return props.onMark(region_name, name);
            },
            onMouseOver: function onMouseOver() {
                return props.onHighlight(true);
            },
            onMouseOut: function onMouseOut() {
                return props.onHighlight(false);
            } });
    };

    DungeonMapLocation.source = function (props) {
        return props.model.world[props.region].locations[props.name];
    };

    var DungeonMapDoorWithHighlight = WithHighlight(DungeonMapDoor);
    var DungeonMapLocationWithHighlight = WithHighlight(DungeonMapLocation);

    var StyledCaption = styled.div(_templateObject26);
    var CaptionIcon = styled.div(_templateObject27);

    var Caption = function Caption(props) {
        var parts = /\{([\w-]+)\}|[^{]+/g;
        return React.createElement(
            StyledCaption,
            null,
            !props.text ? '\xA0' : _.matchAll(props.text, parts).map(function (_ref3) {
                var _ref4 = _slicedToArray(_ref3, 2),
                    text = _ref4[0],
                    icon = _ref4[1];

                return !icon ? text : React.createElement(CaptionIcon, { className: {
                        fightersword: 'sword--active-1',
                        mastersword: 'sword--active-2',
                        mitts: 'glove--active-2'
                    }[icon] || icon });
            })
        );
    };

    var StyledMap = styled.div(_templateObject28);
    var MapGrid = styled.div(_templateObject29, function (props) {
        return props.horizontal && 'grid-template-columns: 1fr 1fr;';
    }, StyledMap);

    var OverworldMap = function (_React$Component3) {
        _inherits(OverworldMap, _React$Component3);

        function OverworldMap() {
            var _ref5;

            var _temp2, _this3, _ret2;

            _classCallCheck(this, OverworldMap);

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return _ret2 = (_temp2 = (_this3 = _possibleConstructorReturn(this, (_ref5 = OverworldMap.__proto__ || Object.getPrototypeOf(OverworldMap)).call.apply(_ref5, [this].concat(args))), _this3), _this3.state = { caption: null }, _temp2), _possibleConstructorReturn(_this3, _ret2);
        }

        _createClass(OverworldMap, [{
            key: 'render',
            value: function render() {
                var _this4 = this;

                var _props4 = this.props,
                    model = _props4.model,
                    horizontal = _props4.horizontal;
                var world = model.world,
                    mode = model.mode;
                var _props5 = this.props,
                    onOverworldMark = _props5.onOverworldMark,
                    onDungeon = _props5.onDungeon;

                var change_caption = function change_caption(caption) {
                    return _this4.setState({ caption: caption });
                };

                var create_dungeons = _.rest(function (world, regions) {
                    return _.map(_.pick(world, regions), function (dungeon, region) {
                        return React.createElement(DungeonLocationWithHighlight, { model: model, region: region, deviated: mode.keysanity && dungeon.has_deviating_counts(),
                            onDungeon: onDungeon, change_caption: change_caption });
                    });
                });
                var create_overworld = _.rest(function (world, regions) {
                    return _.flatMap(_.pick(world, regions), function (x, region) {
                        return (mode.keysanity || region !== 'castle_tower') && _.map(x.locations, function (x, name) {
                            return React.createElement(OverworldLocationWithHighlight, { model: model, region: region, name: name,
                                onMark: onOverworldMark, change_caption: change_caption });
                        });
                    });
                });

                return React.createElement(
                    MapGrid,
                    { horizontal: horizontal },
                    React.createElement(
                        StyledMap,
                        { className: 'world---light' },
                        create_overworld(world, 'lightworld_deathmountain_west', 'lightworld_deathmountain_east', 'lightworld_northwest', 'lightworld_northeast', 'lightworld_south', 'castle_escape', 'castle_tower'),
                        React.createElement(EncounterLocationWithHighlight, { model: model, region: 'castle_tower', change_caption: change_caption }),
                        create_dungeons(world, 'eastern', 'desert', 'hera')
                    ),
                    React.createElement(
                        StyledMap,
                        { className: 'world---dark' },
                        create_overworld(world, 'darkworld_deathmountain_west', 'darkworld_deathmountain_east', 'darkworld_northwest', 'darkworld_northeast', 'darkworld_south', 'darkworld_mire'),
                        create_dungeons(world, 'darkness', 'swamp', 'skull', 'thieves', 'ice', 'mire', 'turtle')
                    ),
                    React.createElement(Caption, { text: this.state.caption })
                );
            }
        }]);

        return OverworldMap;
    }(React.Component);

    var Close = styled.span(_templateObject30);

    var DungeonMap = function (_React$Component4) {
        _inherits(DungeonMap, _React$Component4);

        function DungeonMap() {
            var _ref6;

            var _temp3, _this5, _ret3;

            _classCallCheck(this, DungeonMap);

            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            return _ret3 = (_temp3 = (_this5 = _possibleConstructorReturn(this, (_ref6 = DungeonMap.__proto__ || Object.getPrototypeOf(DungeonMap)).call.apply(_ref6, [this].concat(args))), _this5), _this5.state = { caption: null }, _temp3), _possibleConstructorReturn(_this5, _ret3);
        }

        _createClass(DungeonMap, [{
            key: 'render',
            value: function render() {
                var _this6 = this;

                var _props6 = this.props,
                    model = _props6.model,
                    dungeon_name = _props6.dungeon;

                var dungeon = model.world[dungeon_name];
                var deviating = dungeon.has_deviating_counts();
                var _props7 = this.props,
                    horizontal = _props7.horizontal,
                    onDoorMark = _props7.onDoorMark,
                    onLocationMark = _props7.onLocationMark,
                    onDismiss = _props7.onDismiss;

                var change_caption = function change_caption(caption) {
                    return _this6.setState({ caption: caption });
                };

                var create_door = function create_door(name) {
                    return React.createElement(DungeonMapDoorWithHighlight, {
                        model: model, region: dungeon_name, name: name, deviated: deviating,
                        onMark: onDoorMark, change_caption: change_caption });
                };
                var create_location = function create_location(name) {
                    return React.createElement(DungeonMapLocationWithHighlight, {
                        model: model, region: dungeon_name, name: name, deviated: deviating,
                        onMark: onLocationMark, change_caption: change_caption });
                };

                var _DungeonMap$layouts$d = DungeonMap.layouts[dungeon_name],
                    first = _DungeonMap$layouts$d.first,
                    second = _DungeonMap$layouts$d.second;

                var _first = _slicedToArray(first, 2),
                    first_locations = _first[0],
                    first_doors = _first[1];

                var _second = _slicedToArray(second, 2),
                    second_locations = _second[0],
                    second_doors = _second[1];

                return React.createElement(
                    MapGrid,
                    { horizontal: horizontal },
                    React.createElement(
                        StyledMap,
                        { className: dungeon_name + '---first' },
                        first_doors && _.map(first_doors, create_door),
                        _.map(first_locations, create_location)
                    ),
                    React.createElement(
                        StyledMap,
                        { className: dungeon_name + '---second' },
                        second_doors && _.map(second_doors, create_door),
                        _.map(second_locations, create_location)
                    ),
                    React.createElement(
                        Close,
                        { onClick: onDismiss },
                        '\xD7'
                    ),
                    React.createElement(Caption, { text: this.state.caption })
                );
            }
        }]);

        return DungeonMap;
    }(React.Component);

    DungeonMap.layouts = dungeon_layouts();


    var StyledApp = styled.div(_templateObject31, function (props) {
        return props.horizontal && 'grid-template-columns: 1fr 1fr;';
    }, function (props) {
        return props.vertical && '\n        height: 0px;\n        transform: scale(.6, .6) translate(-33%, -33%);\n      ';
    });

    var App = function (_React$Component5) {
        _inherits(App, _React$Component5);

        function App(props) {
            _classCallCheck(this, App);

            var _this7 = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

            _initialiseProps.call(_this7);

            var mode_name = props.query.mode;
            var mode = {
                standard: mode_name === 'standard',
                open: mode_name === 'open' || mode_name === 'keysanity',
                keysanity: mode_name === 'keysanity',
                bomb_jump: !!props.query.ipbj,
                hammery_jump: !!props.query.podbj
            };
            _this7.state = {
                dungeon_map: null,
                model: _extends({}, create_items(), create_world(mode), { mode: mode })
            };
            return _this7;
        }

        _createClass(App, [{
            key: 'render',
            value: function render() {
                var query = this.props.query;
                var show_map = query.hmap || query.vmap;
                var _state = this.state,
                    model = _state.model,
                    dungeon_map = _state.dungeon_map;
                var keysanity = model.mode.keysanity;


                return React.createElement(
                    StyledApp,
                    { className: query.sprite,
                        horizontal: query.hmap,
                        vertical: query.vmap,
                        style: query.bg && { 'background-color': query.bg } },
                    React.createElement(Tracker, {
                        horizontal: query.hmap,
                        model: model,
                        onToggle: this.toggle,
                        onLevel: this.level,
                        onCompletion: this.completion,
                        onPrize: this.prize,
                        onMedallion: this.medallion,
                        onKey: this.key,
                        onBigKey: this.big_key,
                        onChest: this.chest }),
                    show_map && (!dungeon_map ? React.createElement(OverworldMap, {
                        horizontal: query.hmap,
                        model: model,
                        onOverworldMark: this.overworld_mark,
                        onDungeon: keysanity ? this.show_dungeon_map : _.noop }) : React.createElement(DungeonMap, {
                        horizontal: query.hmap,
                        model: model,
                        dungeon: dungeon_map,
                        onDismiss: this.dismiss_dungeon_map,
                        onDoorMark: this.door_mark,
                        onLocationMark: this.location_mark }))
                );
            }
        }]);

        return App;
    }(React.Component);

    var _initialiseProps = function _initialiseProps() {
        var _this8 = this;

        this.show_dungeon_map = function (dungeon) {
            _this8.setState({ dungeon_map: dungeon });
        };

        this.dismiss_dungeon_map = function () {
            _this8.setState({ dungeon_map: null });
        };

        this.toggle = function (name) {
            _this8.setState({ model: update(_this8.state.model, { items: update.toggle(name) }) });
        };

        this.level = function (_ref7) {
            var raise = _ref7.raise,
                lower = _ref7.lower;

            var name = raise || lower;
            var delta = raise ? 1 : -1;
            var items = _this8.state.model.items;
            var limit = items.limit[name];

            var _ref8 = limit[0] ? limit : [limit, 0],
                _ref9 = _slicedToArray(_ref8, 2),
                max = _ref9[0],
                min = _ref9[1];

            var modulo = max - min + 1;
            var value = (items[name] - min + modulo + delta) % modulo + min;
            _this8.setState({ model: update(_this8.state.model, { items: _defineProperty({}, name, { $set: value }) }) });
        };

        this.completion = function (region_name) {
            var trait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { dungeon: false };
            var _state$model = _this8.state.model,
                world = _state$model.world,
                mode = _state$model.mode;

            var keysanity = mode.keysanity && trait.dungeon;
            var region = world[region_name];
            var completed = region.completed;
            _this8.setState({ model: update(_this8.state.model, {
                    world: _defineProperty({}, region_name, {
                        completed: { $set: !completed },
                        locations: keysanity && { boss: { marked: { $set: !completed } } },
                        chests: keysanity && !region.has_deviating_counts() && function (x) {
                            return x - (!completed ? 1 : -1);
                        }
                    })
                }) });
        };

        this.prize = function (_ref10) {
            var raise = _ref10.raise,
                lower = _ref10.lower;

            var region_name = raise || lower;
            var delta = raise ? 1 : -1;
            var prize_order = ['unknown', 'pendant-green', 'pendant', 'crystal', 'crystal-red'];
            var prize = _this8.state.model.world[region_name].prize;
            var index = prize_order.indexOf(prize);
            var modulo = prize_order.length;
            var value = prize_order[(index + modulo + delta) % modulo];
            _this8.setState({ model: update(_this8.state.model, { world: _defineProperty({}, region_name, { prize: { $set: value } }) }) });
        };

        this.medallion = function (_ref11) {
            var raise = _ref11.raise,
                lower = _ref11.lower;

            var region_name = raise || lower;
            var delta = raise ? 1 : -1;
            var medallion_order = ['unknown', 'bombos', 'ether', 'quake'];
            var medallion = _this8.state.model.world[region_name].medallion;
            var index = medallion_order.indexOf(medallion);
            var modulo = medallion_order.length;
            var value = medallion_order[(index + modulo + delta) % modulo];
            _this8.setState({ model: update(_this8.state.model, { world: _defineProperty({}, region_name, { medallion: { $set: value } }) }) });
        };

        this.big_key = function (region_name) {
            _this8.setState({ model: update(_this8.state.model, { world: _defineProperty({}, region_name, update.toggle('big_key')) }) });
        };

        this.key = function (_ref12) {
            var raise = _ref12.raise,
                lower = _ref12.lower;

            var region_name = raise || lower;
            var delta = raise ? 1 : -1;
            var _state$model$world$re = _this8.state.model.world[region_name],
                keys = _state$model$world$re.keys,
                key_limit = _state$model$world$re.key_limit;

            var modulo = key_limit + 1;
            var value = (keys + modulo + delta) % modulo;
            _this8.setState({ model: update(_this8.state.model, { world: _defineProperty({}, region_name, { keys: { $set: value } }) }) });
        };

        this.chest = function (_ref13) {
            var raise = _ref13.raise,
                lower = _ref13.lower;

            var region_name = raise || lower;
            var delta = raise ? 1 : -1;
            var _state$model$world$re2 = _this8.state.model.world[region_name],
                chests = _state$model$world$re2.chests,
                chest_limit = _state$model$world$re2.chest_limit;

            var modulo = chest_limit + 1;
            var value = (chests + modulo + delta) % modulo;
            _this8.setState({ model: update(_this8.state.model, { world: _defineProperty({}, region_name, { chests: { $set: value } }) }) });
        };

        this.overworld_mark = function (region_name, name) {
            _this8.setState({ model: update(_this8.state.model, { world: _defineProperty({}, region_name, { locations: _defineProperty({}, name, update.toggle('marked')) }) }) });
        };

        this.door_mark = function (region_name, name) {
            _this8.setState({ model: update(_this8.state.model, { world: _defineProperty({}, region_name, { doors: _defineProperty({}, name, update.toggle('opened')) }) }) });
        };

        this.location_mark = function (region_name, name) {
            var dungeon = _this8.state.model.world[region_name];
            var marked = dungeon.locations[name].marked;
            _this8.setState({ model: update(_this8.state.model, {
                    world: _defineProperty({}, region_name, {
                        locations: _defineProperty({}, name, { marked: { $set: !marked } }),
                        completed: name === 'boss' && { $set: !marked },
                        chests: !dungeon.has_deviating_counts() && function (x) {
                            return x - (!marked ? 1 : -1);
                        }
                    })
                }) });
        };
    };

    window.start = function () {
        ReactDOM.render(React.createElement(App, { query: uri_query() }), document.getElementById('app'));
    };
})(window);