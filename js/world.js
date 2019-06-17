var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

(function (window) {
    'use strict';

    var dungeon_region = {
        build: function build() {
            return _.create(this, { chests: this.chest_limit, completed: false, prize: 'unknown' });
        }
    };

    var dungeon_medallion_region = {
        build: function build() {
            return _.create(this, { chests: this.chest_limit, completed: false, prize: 'unknown', medallion: 'unknown' });
        }
    };

    var with_keysanity = function with_keysanity(dungeon_region) {
        return update(dungeon_region, {
            build: function build(_build) {
                return function () {
                    return update(_build.call(this), {
                        $merge: {
                            keys: 0,
                            big_key: false,
                            can_complete: function can_complete(_ref) {
                                var _region$locations$bos;

                                var region = _ref.region;

                                return (_region$locations$bos = region.locations.boss).can_access.apply(_region$locations$bos, arguments);
                            },
                            can_progress: function can_progress(_ref2) {
                                var _arguments = arguments;
                                var region = _ref2.region;

                                return _.maxBy(_.map(_.pickBy(region.locations, function (x) {
                                    return x.marked === false;
                                }), function (x) {
                                    return !x.can_access || x.can_access.apply(x, _arguments);
                                }), function (x) {
                                    return [false, 'dark', 'possible', true, 'medallion'].indexOf(x);
                                });
                            },
                            has_deviating_counts: function has_deviating_counts() {
                                return this.chests !== _.filter(this.locations, { marked: false }).length;
                            }
                        },
                        doors: this.doors && function (x) {
                            return _.mapValues(x, function (o) {
                                return _.create(o, { opened: false });
                            });
                        },
                        locations: function locations(x) {
                            return _.mapValues(x, function (o) {
                                return _.create(o, { marked: false });
                            });
                        }
                    });
                };
            }
        });
    };

    var eastern = _extends({}, dungeon_region, {
        caption: 'Eastern Palace {lamp}',
        chest_limit: 3,
        can_complete: function can_complete(_ref3) {
            var items = _ref3.items;

            return items.can_shoot_bow && (items.lamp || 'dark');
        },
        can_progress: function can_progress(_ref4) {
            var items = _ref4.items,
                region = _ref4.region;

            return (region.chests > 2 || items.lamp) && (region.chests > 1 || items.can_shoot_bow) || 'possible';
        }
    });

    var eastern_keysanity = with_keysanity(_extends({}, eastern, {
        chest_limit: 6,
        key_limit: 0,
        locations: {
            compass: {
                caption: 'Compass Chest'
            },
            cannonball: {
                caption: 'Bowling Room'
            },
            map: {
                caption: 'Map Chest'
            },
            big_chest: {
                caption: 'Big Chest',
                can_access: function can_access(_ref5) {
                    var region = _ref5.region;

                    return region.big_key;
                }
            },
            big_key: {
                caption: 'Big Key Chest',
                can_access: function can_access(_ref6) {
                    var items = _ref6.items;

                    return items.lamp || 'dark';
                }
            },
            boss: {
                caption: 'Armos Knights',
                can_access: function can_access(_ref7) {
                    var items = _ref7.items,
                        region = _ref7.region;

                    return region.big_key && items.can_shoot_bow && (items.lamp || 'dark');
                }
            }
        }
    }));

    var desert = _extends({}, dungeon_region, {
        caption: 'Desert Palace',
        chest_limit: 2,
        can_enter: function can_enter(_ref8) {
            var items = _ref8.items;

            return items.book || items.mirror && items.can_lift_heavy && items.can_flute;
        },
        can_complete: function can_complete(_ref9) {
            var items = _ref9.items;

            return items.can_lift_light && items.can_light_torch && (items.fightersword || items.hammer || items.can_shoot_bow || items.has_rod || items.has_cane) && (items.boots || 'possible');
        },
        can_progress: function can_progress(_ref10) {
            var items = _ref10.items,
                region = _ref10.region;

            return items.boots && (items.can_lift_light && items.can_light_torch || region.chests > 1) || 'possible';
        }
    });

    var desert_keysanity = with_keysanity(_extends({}, desert, {
        chest_limit: 6,
        key_limit: 1,
        doors: {
            north: {
                caption: 'North',
                can_access: function can_access(_ref11) {
                    var items = _ref11.items,
                        region = _ref11.region;

                    return items.can_lift_light && (region.keys >= 1 || !region.doors.south.opened);
                }
            },
            south: {
                caption: 'South',
                can_access: function can_access(_ref12) {
                    var items = _ref12.items,
                        region = _ref12.region;

                    return region.keys >= 1 || items.can_lift_light && !region.doors.north.opened;
                }
            }
        },
        locations: {
            map: {
                caption: 'Map Chest'
            },
            torch: {
                caption: 'Item on Torch',
                can_access: function can_access(_ref13) {
                    var items = _ref13.items;

                    return items.boots;
                }
            },
            big_key: {
                caption: 'Big Key Chest',
                can_access: function can_access(_ref14) {
                    var items = _ref14.items,
                        region = _ref14.region;

                    return region.keys >= 1 || region.doors.south.opened || !region.doors.north.opened && items.can_lift_light;
                }
            },
            compass: {
                caption: 'Compass Chest',
                can_access: function can_access(_ref15) {
                    var _region$locations$big;

                    var region = _ref15.region;
                    return (_region$locations$big = region.locations.big_key).can_access.apply(_region$locations$big, arguments);
                }
            },
            big_chest: {
                caption: 'Big Chest',
                can_access: function can_access(_ref16) {
                    var region = _ref16.region;

                    return region.big_key;
                }
            },
            boss: {
                caption: 'Lanmolas',
                can_access: function can_access(_ref17) {
                    var items = _ref17.items,
                        region = _ref17.region;

                    return items.can_lift_light && items.can_light_torch && region.big_key && (region.keys >= 1 || region.doors.north.opened || !region.doors.south.opened) && (items.fightersword || items.hammer || items.can_shoot_bow || items.has_rod || items.has_cane);
                }
            }
        }
    }));

    var hera = _extends({}, dungeon_region, {
        caption: 'Tower of Hera',
        chest_limit: 2,
        can_enter: function can_enter(_ref18) {
            var _world$lightworld_dea;

            var items = _ref18.items,
                world = _ref18.world;

            return (items.mirror || items.hookshot && items.hammer) && (_world$lightworld_dea = world.lightworld_deathmountain_west).can_enter.apply(_world$lightworld_dea, arguments);
        },
        can_enter_dark: function can_enter_dark(_ref19) {
            var _world$lightworld_dea2;

            var items = _ref19.items,
                world = _ref19.world;

            return (items.mirror || items.hookshot && items.hammer) && (_world$lightworld_dea2 = world.lightworld_deathmountain_west).can_enter_dark.apply(_world$lightworld_dea2, arguments);
        },
        can_complete: function can_complete(_ref20) {
            var items = _ref20.items;

            return (items.fightersword || items.hammer) && (items.can_light_torch || 'possible');
        },
        can_progress: function can_progress(_ref21) {
            var items = _ref21.items;

            return items.can_light_torch || 'possible';
        }
    });

    var hera_keysanity = with_keysanity(_extends({}, hera, {
        chest_limit: 6,
        key_limit: 1,
        locations: {
            cage: {
                caption: 'Basement Cage'
            },
            map: {
                caption: 'Map Chest'
            },
            compass: {
                caption: 'Compass Chest',
                can_access: function can_access(_ref22) {
                    var region = _ref22.region;

                    return region.big_key;
                }
            },
            big_chest: {
                caption: 'Big Chest',
                can_access: function can_access(_ref23) {
                    var _region$locations$com;

                    var region = _ref23.region;
                    return (_region$locations$com = region.locations.compass).can_access.apply(_region$locations$com, arguments);
                }
            },
            big_key: {
                caption: 'Big Key Chest',
                can_access: function can_access(_ref24) {
                    var items = _ref24.items,
                        region = _ref24.region;

                    return region.keys >= 1 && items.can_light_torch;
                }
            },
            boss: {
                caption: 'Moldorm',
                can_access: function can_access(_ref25) {
                    var items = _ref25.items,
                        region = _ref25.region;

                    return region.big_key && (items.fightersword || items.hammer);
                }
            }
        }
    }));

    var darkness = _extends({}, dungeon_region, {
        caption: 'Palace of Darkness {lamp}',
        chest_limit: 5,
        can_enter: function can_enter(_ref26) {
            var _world$darkworld_nort;

            var items = _ref26.items,
                world = _ref26.world;

            return items.moonpearl && (_world$darkworld_nort = world.darkworld_northeast).can_enter.apply(_world$darkworld_nort, arguments);
        },
        can_complete: function can_complete(_ref27) {
            var items = _ref27.items;

            return items.can_shoot_bow && items.hammer && (items.lamp || 'dark');
        },
        can_progress: function can_progress(_ref28) {
            var items = _ref28.items,
                region = _ref28.region;

            return items.can_shoot_bow && items.lamp && (region.chests > 1 || items.hammer) || 'possible';
        }
    });

    var darkness_keysanity = with_keysanity(_extends({}, darkness, {
        chest_limit: 14,
        key_limit: 6
    }, function () {
        var keys_left = function keys_left(region) {
            return region.keys - _.sum(_.map(region.doors, function (x) {
                return x.opened;
            }));
        };
        return {
            doors: {
                front: {
                    caption: 'Front',
                    can_access: function can_access(_ref29) {
                        var region = _ref29.region;

                        return keys_left(region) >= 1;
                    }
                },
                arena: {
                    caption: 'Arena',
                    can_access: function can_access(_ref30) {
                        var items = _ref30.items,
                            region = _ref30.region;

                        var keys = keys_left(region);
                        return keys >= 2 || keys >= 1 && (region.doors.front.opened || items.can_shoot_bow && items.hammer);
                    }
                },
                big_key: {
                    caption: 'Big Key',
                    can_access: function can_access(_ref31) {
                        var _region$doors$arena;

                        var region = _ref31.region;
                        return (_region$doors$arena = region.doors.arena).can_access.apply(_region$doors$arena, arguments);
                    }
                },
                hellway: {
                    caption: 'Hellway',
                    can_access: function can_access(_ref32) {
                        var items = _ref32.items,
                            region = _ref32.region;

                        var keys = keys_left(region);
                        return keys >= 3 || (keys >= 2 || keys >= 1 && region.doors.arena.opened) && (region.doors.front.opened || items.can_shoot_bow && items.hammer);
                    }
                },
                maze: {
                    caption: 'Dark Maze',
                    can_access: function can_access(_ref33) {
                        var _region$doors$hellway;

                        var region = _ref33.region;
                        return (_region$doors$hellway = region.doors.hellway).can_access.apply(_region$doors$hellway, arguments);
                    }
                },
                boss: {
                    caption: 'Boss',
                    can_access: function can_access(_ref34) {
                        var items = _ref34.items,
                            region = _ref34.region;

                        return items.can_shoot_bow && items.hammer && keys_left(region) >= 1 && (items.lamp || 'dark');
                    }
                }
            },
            locations: {
                shooter: {
                    caption: 'Shooter Room'
                },
                arena_ledge: {
                    caption: 'Statler & Waldorf',
                    can_access: function can_access(_ref35) {
                        var items = _ref35.items;

                        return items.can_shoot_bow;
                    }
                },
                map: {
                    caption: 'Map Chest',
                    can_access: function can_access(_ref36) {
                        var _region$locations$are;

                        var region = _ref36.region;
                        return (_region$locations$are = region.locations.arena_ledge).can_access.apply(_region$locations$are, arguments);
                    }
                },
                arena_bridge: {
                    caption: 'Arena Bridge',
                    can_access: function can_access(_ref37) {
                        var items = _ref37.items,
                            region = _ref37.region;

                        return region.doors.front.opened || keys_left(region) >= 1 || items.can_shoot_bow && items.hammer;
                    }
                },
                stalfos: {
                    caption: 'Southern Cross',
                    can_access: function can_access(_ref38) {
                        var _region$locations$are2;

                        var region = _ref38.region;
                        return (_region$locations$are2 = region.locations.arena_bridge).can_access.apply(_region$locations$are2, arguments);
                    }
                },
                big_key: {
                    caption: 'Big Key Chest',
                    can_access: function can_access(_ref39) {
                        var items = _ref39.items,
                            region = _ref39.region;

                        return keys_left(region) >= 2 - (region.doors.front.opened || items.can_shoot_bow && items.hammer) - region.doors.big_key.opened;
                    }
                },
                compass: {
                    caption: 'Compass Chest (Terrorpin Station)',
                    can_access: function can_access(_ref40) {
                        var items = _ref40.items,
                            region = _ref40.region;

                        return keys_left(region) >= 2 - (region.doors.front.opened || items.can_shoot_bow && items.hammer) - region.doors.arena.opened;
                    }
                },
                basement_left: {
                    caption: 'Treasury - Left Chest',
                    can_access: function can_access(_ref41) {
                        var items = _ref41.items,
                            region = _ref41.region;

                        return keys_left(region) >= 2 - (region.doors.front.opened || items.can_shoot_bow && items.hammer) - region.doors.arena.opened && (items.lamp || 'dark');
                    }
                },
                basement_right: {
                    caption: 'Treasury - Right Chest',
                    can_access: function can_access(_ref42) {
                        var _region$locations$bas;

                        var region = _ref42.region;
                        return (_region$locations$bas = region.locations.basement_left).can_access.apply(_region$locations$bas, arguments);
                    }
                },
                hellway: {
                    caption: 'Harmless Hellway',
                    can_access: function can_access(_ref43) {
                        var items = _ref43.items,
                            region = _ref43.region;

                        return keys_left(region) >= 3 - (region.doors.front.opened || items.can_shoot_bow && items.hammer) - region.doors.arena.opened - region.doors.hellway.opened;
                    }
                },
                big_chest: {
                    caption: 'Big Chest',
                    can_access: function can_access(_ref44) {
                        var items = _ref44.items,
                            region = _ref44.region,
                            mode = _ref44.mode;

                        return region.big_key && keys_left(region) >= 3 - (region.doors.front.opened || items.can_shoot_bow && items.hammer) - region.doors.arena.opened - (region.doors.maze.opened || mode.hammery_jump) && (mode.hammery_jump || items.lamp || 'dark');
                    }
                },
                maze_top: {
                    caption: 'Dark Maze - Top Chest',
                    can_access: function can_access(_ref45) {
                        var items = _ref45.items,
                            region = _ref45.region,
                            mode = _ref45.mode;

                        return keys_left(region) >= 3 - (region.doors.front.opened || items.can_shoot_bow && items.hammer) - region.doors.arena.opened - (region.doors.maze.opened || mode.hammery_jump) && (items.lamp || 'dark');
                    }
                },
                maze_bottom: {
                    caption: 'Dark Maze - Bottom Chest',
                    can_access: function can_access(_ref46) {
                        var _region$locations$maz;

                        var region = _ref46.region;
                        return (_region$locations$maz = region.locations.maze_top).can_access.apply(_region$locations$maz, arguments);
                    }
                },
                boss: {
                    caption: 'Helmasaur King',
                    can_access: function can_access(_ref47) {
                        var items = _ref47.items,
                            region = _ref47.region;

                        return items.can_shoot_bow && items.hammer && region.big_key && (region.doors.boss.opened || keys_left(region) >= 1) && (items.lamp || 'dark');
                    }
                }
            }
        };
    }()));

    var swamp = _extends({}, dungeon_region, {
        caption: 'Swamp Palace {mirror}',
        chest_limit: 6,
        can_enter: function can_enter(_ref48) {
            var _world$darkworld_sout;

            var items = _ref48.items,
                world = _ref48.world;

            return items.moonpearl && items.mirror && items.flippers && (_world$darkworld_sout = world.darkworld_south).can_enter.apply(_world$darkworld_sout, arguments);
        },
        can_complete: function can_complete(_ref49) {
            var items = _ref49.items;

            return items.hammer && items.hookshot;
        },
        can_progress: function can_progress(_ref50) {
            var items = _ref50.items,
                region = _ref50.region;

            return region.chests <= 4 ? items.hammer && (items.hookshot || region.chests > 2 && 'possible') : items.hammer || region.chests > 5 && 'possible';
        }
    });

    var swamp_keysanity = with_keysanity(_extends({}, swamp, {
        chest_limit: 10,
        key_limit: 1,
        locations: {
            entrance: {
                caption: 'Entrance'
            },
            map: {
                caption: 'Map Chest',
                can_access: function can_access(_ref51) {
                    var region = _ref51.region;

                    return region.keys >= 1;
                }
            },
            big_key: {
                caption: 'Big Key Chest',
                can_access: function can_access(_ref52) {
                    var items = _ref52.items,
                        region = _ref52.region;

                    return region.keys >= 1 && items.hammer;
                }
            },
            west: {
                caption: 'West Wing',
                can_access: function can_access(_ref53) {
                    var _region$locations$big2;

                    var region = _ref53.region;
                    return (_region$locations$big2 = region.locations.big_key).can_access.apply(_region$locations$big2, arguments);
                }
            },
            compass: {
                caption: 'Compass Chest',
                can_access: function can_access(_ref54) {
                    var _region$locations$big3;

                    var region = _ref54.region;
                    return (_region$locations$big3 = region.locations.big_key).can_access.apply(_region$locations$big3, arguments);
                }
            },
            big_chest: {
                caption: 'Big Chest',
                can_access: function can_access(_ref55) {
                    var items = _ref55.items,
                        region = _ref55.region;

                    return region.keys >= 1 && items.hammer && region.big_key;
                }
            },
            waterfall: {
                caption: 'Waterfall Room',
                can_access: function can_access(_ref56) {
                    var items = _ref56.items,
                        region = _ref56.region;

                    return region.keys >= 1 && items.hammer && items.hookshot;
                }
            },
            toilet_left: {
                caption: 'Toilet - Left Chest',
                can_access: function can_access(_ref57) {
                    var _region$locations$wat;

                    var region = _ref57.region;
                    return (_region$locations$wat = region.locations.waterfall).can_access.apply(_region$locations$wat, arguments);
                }
            },
            toilet_right: {
                caption: 'Toilet - Right Chest',
                can_access: function can_access(_ref58) {
                    var _region$locations$wat2;

                    var region = _ref58.region;
                    return (_region$locations$wat2 = region.locations.waterfall).can_access.apply(_region$locations$wat2, arguments);
                }
            },
            boss: {
                caption: 'Arrghus',
                can_access: function can_access(_ref59) {
                    var _region$locations$wat3;

                    var region = _ref59.region;
                    return (_region$locations$wat3 = region.locations.waterfall).can_access.apply(_region$locations$wat3, arguments);
                }
            }
        }
    }));

    var skull = _extends({}, dungeon_region, {
        caption: 'Skull Woods',
        chest_limit: 2,
        can_enter: function can_enter(_ref60) {
            var _world$darkworld_nort2;

            var items = _ref60.items,
                world = _ref60.world;

            return items.moonpearl && (_world$darkworld_nort2 = world.darkworld_northwest).can_enter.apply(_world$darkworld_nort2, arguments);
        },
        can_complete: function can_complete(_ref61) {
            var items = _ref61.items;

            return items.firerod && /*mode.swordless ||*/items.fightersword;
        },
        can_progress: function can_progress(_ref62) {
            var items = _ref62.items,
                region = _ref62.region;

            return items.firerod && (region.chests > 1 || /*mode.swordless ||*/items.fightersword) || 'possible';
        }
    });

    var skull_keysanity = with_keysanity(_extends({}, skull, {
        chest_limit: 7,
        key_limit: 2,
        locations: {
            big_key: {
                caption: 'Big Key Chest'
            },
            compass: {
                caption: 'Compass Chest'
            },
            map: {
                caption: 'Map Chest'
            },
            pot_prison: {
                caption: 'Pot Prison'
            },
            big_chest: {
                caption: 'Big Chest',
                can_access: function can_access(_ref63) {
                    var region = _ref63.region;

                    return region.big_key;
                }
            },
            bridge: {
                caption: 'Bridge Room',
                can_access: function can_access(_ref64) {
                    var items = _ref64.items;

                    return items.firerod;
                }
            },
            boss: {
                caption: 'Mothula',
                can_access: function can_access(_ref65) {
                    var items = _ref65.items;

                    return items.firerod && /*mode.swordless ||*/items.fightersword;
                }
            }
        }
    }));

    var thieves = _extends({}, dungeon_region, {
        caption: 'Thieves\' Town',
        chest_limit: 4,
        can_enter: function can_enter(_ref66) {
            var _world$darkworld_nort3;

            var items = _ref66.items,
                world = _ref66.world;

            return items.moonpearl && (_world$darkworld_nort3 = world.darkworld_northwest).can_enter.apply(_world$darkworld_nort3, arguments);
        },
        can_complete: function can_complete(_ref67) {
            var items = _ref67.items;

            return items.fightersword || items.hammer || items.has_cane;
        },
        can_progress: function can_progress(_ref68) {
            var items = _ref68.items,
                region = _ref68.region;

            // Since all items could be before big_chest/blind, sword/canes logic is canceled out
            return region.chests > 1 || items.hammer || 'possible';
        }
    });

    var thieves_keysanity = with_keysanity(_extends({}, thieves, {
        chest_limit: 8,
        key_limit: 1,
        locations: {
            big_key: {
                caption: 'Big Key Chest'
            },
            map: {
                caption: 'Map Chest'
            },
            compass: {
                caption: 'Compass Chest'
            },
            ambush: {
                caption: 'Ambush Chest'
            },
            attic: {
                caption: 'Attic',
                can_access: function can_access(_ref69) {
                    var region = _ref69.region;

                    return region.big_key;
                }
            },
            cell: {
                caption: "Blind's Cell",
                can_access: function can_access(_ref70) {
                    var _region$locations$att;

                    var region = _ref70.region;
                    return (_region$locations$att = region.locations.attic).can_access.apply(_region$locations$att, arguments);
                }
            },
            big_chest: {
                caption: 'Big Chest',
                can_access: function can_access(_ref71) {
                    var items = _ref71.items,
                        region = _ref71.region;

                    return region.big_key && region.keys >= 1 && items.hammer;
                }
            },
            boss: {
                caption: 'Blind',
                can_access: function can_access(_ref72) {
                    var items = _ref72.items,
                        region = _ref72.region;

                    return region.big_key && (items.fightersword || items.hammer || items.has_cane);
                }
            }
        }
    }));

    var ice = _extends({}, dungeon_region, {
        caption: 'Ice Palace (yellow = might need bomb jump)',
        chest_limit: 3,
        can_enter: function can_enter(_ref73) {
            var items = _ref73.items;

            return items.moonpearl && items.flippers && items.can_lift_heavy && items.can_melt;
        },
        can_complete: function can_complete(_ref74) {
            var items = _ref74.items;

            return items.hammer && (items.somaria || items.hookshot || 'possible');
        },
        can_progress: function can_progress(_ref75) {
            var items = _ref75.items;

            return items.hammer || 'possible';
        }
    });

    var ice_keysanity = with_keysanity(_extends({}, ice, {
        chest_limit: 8,
        key_limit: 2,
        locations: {
            compass: {
                caption: 'Compass Chest'
            },
            freezor: {
                caption: 'Freezor Room'
            },
            iced_t: {
                caption: 'Iced T Room'
            },
            big_chest: {
                caption: 'Big Chest',
                can_access: function can_access(_ref76) {
                    var region = _ref76.region;

                    return region.big_key;
                }
            },
            spike: {
                caption: function caption(_ref77) {
                    var mode = _ref77.mode;
                    return mode.bomb_jump ? 'Spike Room' : 'Spike Room (yellow = might waste key without {hammer}, or need bomb jump)';
                },
                can_access: function can_access(_ref78) {
                    var items = _ref78.items,
                        mode = _ref78.mode;

                    return mode.bomb_jump || items.hookshot || 'possible';
                }
            },
            map: {
                caption: 'Map Chest',
                can_access: function can_access(_ref79) {
                    var _region$locations$spi;

                    var items = _ref79.items,
                        region = _ref79.region;

                    return items.hammer && (_region$locations$spi = region.locations.spike).can_access.apply(_region$locations$spi, arguments);
                }
            },
            big_key: {
                caption: 'Big Key Chest',
                can_access: function can_access(_ref80) {
                    var _region$locations$map;

                    var region = _ref80.region;
                    return (_region$locations$map = region.locations.map).can_access.apply(_region$locations$map, arguments);
                }
            },
            boss: {
                caption: function caption(_ref81) {
                    var mode = _ref81.mode;
                    return mode.bomb_jump ? 'Kholdstare' : 'Kholdstare (yellow = might need bomb jump for a small key)';
                },
                can_access: function can_access(_ref82) {
                    var items = _ref82.items,
                        region = _ref82.region,
                        mode = _ref82.mode;

                    return items.hammer && (mode.bomb_jump || region.big_key && (region.keys >= 1 && items.somaria || region.keys >= 2) || 'possible');
                }
            }
        }
    }));

    var medallion_caption = function medallion_caption(region, caption) {
        return caption.replace('{medallion}', '{medallion--' + region.medallion + '}');
    };

    var medallion_access = function medallion_access(_ref83) {
        var items = _ref83.items,
            region = _ref83.region;
        var then = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
            return true;
        };
        return !items.has_medallion(region.medallion) ? items.might_have_medallion(region.medallion) && 'medallion' : then();
    };

    var mire = _extends({}, dungeon_medallion_region, {
        caption: function caption(_ref84) {
            var world = _ref84.world;
            return medallion_caption(world.mire, 'Misery Mire {medallion}{lamp}');
        },
        chest_limit: 2,
        can_enter: function can_enter(_ref85) {
            var _world$darkworld_mire;

            var items = _ref85.items,
                world = _ref85.world;

            return items.moonpearl && (items.boots || items.hookshot) && /*mode.swordless ||*/items.fightersword && (_world$darkworld_mire = world.darkworld_mire).can_enter.apply(_world$darkworld_mire, arguments);
        },
        can_complete: function can_complete(_ref86) {
            var items = _ref86.items;

            return items.somaria &&
            // (items.fightersword || items.hammer || items.can_shoot_bow) && // swordless checks
            medallion_access.apply(undefined, Array.prototype.slice.call(arguments).concat([function () {
                return items.can_light_torch ? items.lamp || 'dark' : 'possible';
            }]));
        },
        can_progress: function can_progress(_ref87) {
            var items = _ref87.items,
                region = _ref87.region;

            return medallion_access.apply(undefined, Array.prototype.slice.call(arguments).concat([function () {
                return (region.chests > 1 ? items.can_light_torch : items.lamp && items.somaria) || 'possible';
            }]));
        }
    });

    var mire_keysanity = with_keysanity(_extends({}, mire, {
        chest_limit: 8,
        key_limit: 3,
        locations: {
            main: {
                caption: 'Main Lobby',
                can_access: function can_access() {
                    return medallion_access.apply(undefined, arguments);
                }
            },
            bridge: {
                caption: 'Docaty Bridge',
                can_access: function can_access(_ref88) {
                    var _region$locations$mai;

                    var region = _ref88.region;
                    return (_region$locations$mai = region.locations.main).can_access.apply(_region$locations$mai, arguments);
                }
            },
            map: {
                caption: 'Map Chest',
                can_access: function can_access(_ref89) {
                    var _region$locations$mai2;

                    var region = _ref89.region;
                    return (_region$locations$mai2 = region.locations.main).can_access.apply(_region$locations$mai2, arguments);
                }
            },
            spike: {
                caption: 'Spike Chest',
                can_access: function can_access(_ref90) {
                    var _region$locations$mai3;

                    var region = _ref90.region;
                    return (_region$locations$mai3 = region.locations.main).can_access.apply(_region$locations$mai3, arguments);
                }
            },
            compass: {
                caption: 'Compass Chest',
                can_access: function can_access(_ref91) {
                    var items = _ref91.items;

                    return items.can_light_torch && medallion_access.apply(undefined, arguments);
                }
            },
            big_key: {
                caption: 'Big Key Chest',
                can_access: function can_access(_ref92) {
                    var _region$locations$com2;

                    var region = _ref92.region;
                    return (_region$locations$com2 = region.locations.compass).can_access.apply(_region$locations$com2, arguments);
                }
            },
            big_chest: {
                caption: 'Big Chest',
                can_access: function can_access(_ref93) {
                    var region = _ref93.region;

                    return region.big_key && medallion_access.apply(undefined, arguments);
                }
            },
            boss: {
                caption: 'Vitreous',
                can_access: function can_access(_ref94) {
                    var items = _ref94.items,
                        region = _ref94.region;

                    return items.somaria && region.big_key &&
                    // (items.fightersword || items.hammer || items.can_shoot_bow) && // swordless checks
                    medallion_access.apply(undefined, Array.prototype.slice.call(arguments).concat([function () {
                        return items.lamp || 'dark';
                    }]));
                }
            }
        }
    }));

    var turtle = _extends({}, dungeon_medallion_region, {
        caption: function caption(_ref95) {
            var world = _ref95.world;
            return medallion_caption(world.turtle, 'Turtle Rock {medallion}{lamp}');
        },
        chest_limit: 5,
        can_enter: function can_enter(_ref96) {
            var _world$lightworld_dea3;

            var items = _ref96.items,
                world = _ref96.world;

            return items.moonpearl && items.can_lift_heavy && items.hammer && items.somaria && /*mode.swordless ||*/items.fightersword && (_world$lightworld_dea3 = world.lightworld_deathmountain_east).can_enter.apply(_world$lightworld_dea3, arguments);
        },
        can_enter_dark: function can_enter_dark(_ref97) {
            var _world$lightworld_dea4;

            var items = _ref97.items,
                world = _ref97.world;

            return items.moonpearl && items.can_lift_heavy && items.hammer && items.somaria && /*mode.swordless ||*/items.fightersword && (_world$lightworld_dea4 = world.lightworld_deathmountain_east).can_enter_dark.apply(_world$lightworld_dea4, arguments);
        },
        can_complete: function can_complete(_ref98) {
            var items = _ref98.items,
                region = _ref98.region;

            return items.icerod && items.firerod && medallion_access.apply(undefined, Array.prototype.slice.call(arguments).concat([function () {
                return items.can_avoid_laser ? items.lamp || 'dark' : 'possible';
            }]));
        },
        can_progress: function can_progress(_ref99) {
            var items = _ref99.items,
                region = _ref99.region;

            return medallion_access.apply(undefined, Array.prototype.slice.call(arguments).concat([function () {
                return (region.chests > 4 || items.can_avoid_laser) && (region.chests > 2 ? items.firerod && items.lamp || 'possible' : (region.chests > 1 || items.icerod) && items.firerod ? items.lamp || 'dark' : 'possible');
            }]));
        }
    });

    var turtle_keysanity = with_keysanity(_extends({}, turtle, {
        chest_limit: 12,
        key_limit: 4
    }, function () {
        var keys_left = function keys_left(region) {
            return region.keys + !region.locations.big_key.marked - _.sum(_.map(region.doors, function (x) {
                return x.opened;
            }));
        };
        return {
            doors: {
                crystaroller: {
                    caption: 'Crystaroller',
                    can_access: function can_access(_ref100) {
                        var region = _ref100.region;

                        return keys_left(region) >= 3 && region.big_key && medallion_access.apply(undefined, arguments);
                    }
                },
                boss: {
                    caption: 'Boss',
                    can_access: function can_access(_ref101) {
                        var items = _ref101.items,
                            region = _ref101.region;

                        var keys = keys_left(region);
                        return (keys >= 4 || keys >= 3 && region.doors.crystaroller.opened) && region.big_key && medallion_access.apply(undefined, Array.prototype.slice.call(arguments).concat([function () {
                            return items.lamp || 'dark';
                        }]));
                    }
                }
            },
            locations: {
                compass: {
                    caption: 'Compass Chest',
                    can_access: function can_access() {
                        return medallion_access.apply(undefined, arguments);
                    }
                },
                roller_left: {
                    caption: 'Roller Room - Left Chest',
                    can_access: function can_access(_ref102) {
                        var items = _ref102.items;

                        return items.firerod && medallion_access.apply(undefined, arguments);
                    }
                },
                roller_right: {
                    caption: 'Roller Room - Right Chest',
                    can_access: function can_access(_ref103) {
                        var _region$locations$rol;

                        var region = _ref103.region;
                        return (_region$locations$rol = region.locations.roller_left).can_access.apply(_region$locations$rol, arguments);
                    }
                },
                chain_chomps: {
                    caption: 'Chain Chomps',
                    can_access: function can_access(_ref104) {
                        var region = _ref104.region;

                        return region.keys >= 1 && medallion_access.apply(undefined, arguments);
                    }
                },
                big_key: {
                    caption: 'Big Key Chest',
                    can_access: function can_access(_ref105) {
                        var region = _ref105.region;

                        return keys_left(region) >= 3 && medallion_access.apply(undefined, arguments);
                    }
                },
                big_chest: {
                    caption: 'Big Chest',
                    can_access: function can_access(_ref106) {
                        var region = _ref106.region;

                        return region.big_key && region.keys >= 2 && medallion_access.apply(undefined, arguments);
                    }
                },
                crystaroller: {
                    caption: 'Crystaroller Room',
                    can_access: function can_access(_ref107) {
                        var _region$locations$big4;

                        var region = _ref107.region;
                        return (_region$locations$big4 = region.locations.big_chest).can_access.apply(_region$locations$big4, arguments);
                    }
                },
                eye_bl: {
                    caption: 'Laser Bridge - Bottom Left Chest',
                    can_access: function can_access(_ref108) {
                        var items = _ref108.items,
                            region = _ref108.region;

                        return region.big_key && (region.doors.crystaroller.opened || keys_left(region) >= 3) && items.can_avoid_laser && medallion_access.apply(undefined, Array.prototype.slice.call(arguments).concat([function () {
                            return items.lamp || 'dark';
                        }]));
                    }
                },
                eye_br: {
                    caption: 'Laser Bridge - Bottom Right Chest',
                    can_access: function can_access(_ref109) {
                        var _region$locations$eye;

                        var region = _ref109.region;
                        return (_region$locations$eye = region.locations.eye_bl).can_access.apply(_region$locations$eye, arguments);
                    }
                },
                eye_tl: {
                    caption: 'Laser Bridge - Top Left Chest',
                    can_access: function can_access(_ref110) {
                        var _region$locations$eye2;

                        var region = _ref110.region;
                        return (_region$locations$eye2 = region.locations.eye_bl).can_access.apply(_region$locations$eye2, arguments);
                    }
                },
                eye_tr: {
                    caption: 'Laser Bridge - Top Right Chest',
                    can_access: function can_access(_ref111) {
                        var _region$locations$eye3;

                        var region = _ref111.region;
                        return (_region$locations$eye3 = region.locations.eye_bl).can_access.apply(_region$locations$eye3, arguments);
                    }
                },
                boss: {
                    caption: 'Trinexx',
                    can_access: function can_access(_ref112) {
                        var items = _ref112.items,
                            region = _ref112.region;

                        return region.big_key && keys_left(region) >= 4 - region.doors.crystaroller.opened - region.doors.boss.opened && items.firerod && items.icerod && medallion_access.apply(undefined, Array.prototype.slice.call(arguments).concat([function () {
                            return items.lamp || 'dark';
                        }]));
                    }
                }
            }
        };
    }()));

    var encounter_with_keys_region = {
        build: function build() {
            return update(_.create(this, { completed: false, keys: 0 }), {
                locations: function locations(x) {
                    return _.mapValues(x, function (o) {
                        return _.create(o, { marked: false });
                    });
                }
            });
        }
    };

    var castle_tower = _extends({}, encounter_with_keys_region, {
        caption: 'Agahnim {mastersword}/ ({cape}{fightersword}){lamp}',
        key_limit: 2,
        can_enter: function can_enter(_ref113) {
            var items = _ref113.items;

            return items.cape || items.mastersword /*|| mode.swordless && items.hammer*/;
        },
        can_complete: function can_complete(_ref114) {
            var items = _ref114.items,
                region = _ref114.region,
                mode = _ref114.mode;

            return (!mode.keysanity || region.keys >= 2) && items.fightersword /*|| mode.swordless && (items.hammer || items.net)*/ && (items.lamp || 'dark');
        },

        locations: {
            castle_foyer: {
                caption: 'Castle Tower Foyer'
            },
            castle_maze: {
                caption: 'Castle Tower Dark Maze',
                can_access: function can_access(_ref115) {
                    var items = _ref115.items,
                        region = _ref115.region;

                    return region.keys >= 1 && (items.lamp || 'dark');
                }
            }
        }
    });

    var overworld_region = {
        build: function build() {
            return update(this, {
                locations: function locations(x) {
                    return _.mapValues(x, function (o) {
                        return _.create(o, { marked: false });
                    });
                }
            });
        }
    };

    var lightworld_deathmountain_west = _extends({}, overworld_region, {
        can_enter: function can_enter(_ref116) {
            var items = _ref116.items;

            return items.can_flute || items.can_lift_light && items.lamp;
        },
        can_enter_dark: function can_enter_dark(_ref117) {
            var items = _ref117.items;

            return items.can_lift_light;
        },

        locations: {
            ether: {
                caption: 'Ether Tablet {mastersword}{book}',
                can_access: function can_access(_ref118) {
                    var items = _ref118.items,
                        mode = _ref118.mode;

                    return items.book && (items.mirror || items.hammer && items.hookshot) && (items.mastersword /*|| mode.swordless && items.hammer*/ || 'viewable');
                }
            },
            spectacle_rock: {
                caption: 'Spectacle Rock {mirror}',
                can_access: function can_access(_ref119) {
                    var items = _ref119.items;

                    return items.mirror || 'viewable';
                }
            },
            spectacle_cave: {
                caption: 'Spectacle Rock Cave'
            },
            old_man: {
                caption: 'Lost Old Man {lamp}',
                can_access: function can_access(_ref120) {
                    var items = _ref120.items;

                    return items.lamp || 'dark';
                }
            }
        }
    });

    var lightworld_deathmountain_east = _extends({}, overworld_region, {
        can_enter: function can_enter(_ref121) {
            var _world$lightworld_dea5;

            var items = _ref121.items,
                world = _ref121.world;

            return (items.hammer && items.mirror || items.hookshot) && (_world$lightworld_dea5 = world.lightworld_deathmountain_west).can_enter.apply(_world$lightworld_dea5, arguments);
        },
        can_enter_dark: function can_enter_dark(_ref122) {
            var _world$lightworld_dea6;

            var items = _ref122.items,
                world = _ref122.world;

            return (items.hammer && items.mirror || items.hookshot) && (_world$lightworld_dea6 = world.lightworld_deathmountain_west).can_enter_dark.apply(_world$lightworld_dea6, arguments);
        },

        locations: {
            island_dm: {
                caption: 'Floating Island {mirror}',
                can_access: function can_access(_ref123) {
                    var items = _ref123.items;

                    return items.mirror && items.moonpearl && items.can_lift_heavy || 'viewable';
                }
            },
            spiral: {
                caption: 'Spiral Cave'
            },
            paradox: {
                caption: 'Death Mountain East (5 + 2 {bomb})'
            },
            mimic: {
                caption: function caption(_ref124) {
                    var world = _ref124.world,
                        mode = _ref124.mode;
                    return medallion_caption(world.turtle, 'Mimic Cave ({mirror} outside of Turtle Rock)(Yellow = {medallion} unknown' + (mode.keysanity ? '' : ' OR possible w/out {firerod}') + ')');
                },
                can_access: function can_access(_ref125) {
                    var items = _ref125.items,
                        turtle = _ref125.world.turtle,
                        mode = _ref125.mode;

                    // turtle.can_enter_dark to check basic access,
                    // actual dark state from lightworld_deathmountain_east
                    return turtle.can_enter_dark.apply(turtle, arguments) && items.mirror && medallion_access({ items: items, region: turtle }, function () {
                        return mode.keysanity ? turtle.keys >= 2 : items.firerod || 'possible';
                    });
                }
            }
        }
    });

    var lightworld_northwest = _extends({}, overworld_region, {
        locations: {
            altar: {
                caption: 'Master Sword Pedestal {pendant-courage}{pendant-power}{pendant-wisdom} (can check with {book})',
                can_access: function can_access(_ref126) {
                    var items = _ref126.items,
                        world = _ref126.world;

                    // PendantOfPower && PendantOfWisdom && PendantOfCourage
                    var pendants = _.reduce(world, function (s, dungeon) {
                        return dungeon.completed && _.includes(['pendant', 'pendant-green'], dungeon.prize) ? s + 1 : s;
                    }, 0);
                    return pendants >= 3 || items.book && 'viewable';
                }
            },
            mushroom: {
                caption: 'Mushroom'
            },
            hideout: {
                caption: 'Forest Hideout'
            },
            tree: {
                caption: 'Lumberjack Tree {agahnim}{boots}',
                can_access: function can_access(_ref127) {
                    var items = _ref127.items,
                        world = _ref127.world;

                    // DefeatAgahnim && items.boots
                    return world.agahnim() && items.boots || 'viewable';
                }
            },
            graveyard_w: {
                caption: 'West of Sanctuary {boots}',
                can_access: function can_access(_ref128) {
                    var items = _ref128.items;

                    return items.boots;
                }
            },
            graveyard_n: {
                caption: 'Graveyard Cliff Cave {mirror}',
                can_access: function can_access(_ref129) {
                    var _world$darkworld_nort4;

                    var items = _ref129.items,
                        world = _ref129.world;

                    return items.mirror && (_world$darkworld_nort4 = world.darkworld_northwest).can_enter.apply(_world$darkworld_nort4, arguments);
                }
            },
            graveyard_e: {
                caption: 'King\'s Tomb {boots} + {mitts}/{mirror}',
                can_access: function can_access(_ref130) {
                    var _world$darkworld_nort5;

                    var items = _ref130.items,
                        world = _ref130.world;

                    return items.boots && (items.can_lift_heavy || items.mirror && (_world$darkworld_nort5 = world.darkworld_northwest).can_enter.apply(_world$darkworld_nort5, arguments));
                }
            },
            well: {
                caption: 'Kakariko Well (4 + {bomb})'
            },
            thief_hut: {
                caption: 'Thieve\'s Hut (4 + {bomb})'
            },
            bottle: {
                caption: 'Bottle Vendor: Pay 100 rupees'
            },
            chicken: {
                caption: 'Chicken House {bomb}'
            },
            kid: {
                caption: 'Dying Boy: Distract him with {bottle} so that you can rob his family!',
                can_access: function can_access(_ref131) {
                    var items = _ref131.items;

                    return items.has_bottle;
                }
            },
            tavern: {
                caption: 'Tavern'
            },
            // We have chosen to show the frog on light world map
            frog: {
                caption: 'Take the frog home {mirror} / Save+Quit',
                can_access: function can_access(_ref132) {
                    var items = _ref132.items;

                    return items.moonpearl && items.can_lift_heavy;
                }
            },
            bat: {
                caption: 'Mad Batter {hammer}/{mirror} + {powder}',
                can_access: function can_access(_ref133) {
                    var items = _ref133.items;

                    return items.powder && (items.hammer || items.moonpearl && items.mirror && items.can_lift_heavy);
                }
            }
        }
    });

    var lightworld_northeast = _extends({}, overworld_region, {
        locations: {
            zora: {
                caption: 'King Zora: Pay 500 rupees',
                can_access: function can_access(_ref134) {
                    var items = _ref134.items;

                    return items.flippers || items.can_lift_light;
                }
            },
            river: {
                caption: 'Zora River Ledge {flippers}',
                can_access: function can_access(_ref135) {
                    var items = _ref135.items;

                    return items.flippers || items.can_lift_light && 'viewable';
                }
            },
            fairy_lw: {
                caption: 'Waterfall of Wishing (2) {flippers}',
                can_access: function can_access(_ref136) {
                    var items = _ref136.items;

                    return items.flippers;
                }
            },
            witch: {
                caption: 'Witch: Give her {mushroom}',
                can_access: function can_access(_ref137) {
                    var items = _ref137.items;

                    return items.mushroom;
                }
            },
            sahasrahla_hut: {
                caption: 'Sahasrahla\'s Hut (3) {bomb}/{boots}'
            },
            sahasrahla: {
                caption: 'Sahasrahla {pendant-courage}',
                can_access: function can_access(_ref138) {
                    var world = _ref138.world;

                    // PendantOfCourage
                    return _.some(world, function (dungeon) {
                        return dungeon.completed && dungeon.prize === 'pendant-green';
                    });
                }
            }
        }
    });

    var lightworld_south = _extends({}, overworld_region, {
        locations: {
            maze: {
                caption: 'Race Minigame {bomb}/{boots}'
            },
            library: {
                caption: 'Library {boots}',
                can_access: function can_access(_ref139) {
                    var items = _ref139.items;

                    return items.boots || 'viewable';
                }
            },
            grove_n: {
                caption: 'Buried Itam {shovel}',
                can_access: function can_access(_ref140) {
                    var items = _ref140.items;

                    return items.shovel;
                }
            },
            grove_s: {
                caption: 'South of Grove {mirror}',
                can_access: function can_access(_ref141) {
                    var _world$darkworld_sout2;

                    var items = _ref141.items,
                        world = _ref141.world;

                    return items.mirror && (_world$darkworld_sout2 = world.darkworld_south).can_enter.apply(_world$darkworld_sout2, arguments);
                }
            },
            link_house: {
                caption: 'Stoops Lonk\'s Hoose'
            },
            desert_w: {
                caption: 'Desert West Ledge {book}/{mirror}',
                can_access: function can_access(_ref142) {
                    var _world$desert;

                    var world = _ref142.world;

                    return (_world$desert = world.desert).can_enter.apply(_world$desert, arguments) || 'viewable';
                }
            },
            desert_ne: {
                caption: 'Checkerboard Cave {mirror}',
                can_access: function can_access(_ref143) {
                    var _world$darkworld_mire2;

                    var items = _ref143.items,
                        world = _ref143.world;

                    return (_world$darkworld_mire2 = world.darkworld_mire).can_enter.apply(_world$darkworld_mire2, arguments) && items.mirror;
                }
            },
            aginah: {
                caption: 'Aginah\'s Cave {bomb}'
            },
            bombos: {
                caption: 'Bombos Tablet {mirror}{mastersword}{book}',
                can_access: function can_access(_ref144) {
                    var _world$darkworld_sout3;

                    var items = _ref144.items,
                        world = _ref144.world,
                        mode = _ref144.mode;

                    return items.book && items.mirror && (_world$darkworld_sout3 = world.darkworld_south).can_enter.apply(_world$darkworld_sout3, arguments) && (items.mastersword /*|| mode.swordless && items.hammer*/ || 'viewable');
                }
            },
            dam: {
                caption: 'Light World Swamp (2)'
            },
            lake_sw: {
                caption: 'Minimoldorm Cave (NPC + 4) {bomb}'
            },
            island_lake: {
                caption: 'Lake Hylia Island {mirror}',
                can_access: function can_access(_ref145) {
                    var _world$darkworld_sout4, _world$darkworld_nort6;

                    var items = _ref145.items,
                        world = _ref145.world;

                    return items.flippers && items.moonpearl && items.mirror && ((_world$darkworld_sout4 = world.darkworld_south).can_enter.apply(_world$darkworld_sout4, arguments) || (_world$darkworld_nort6 = world.darkworld_northwest).can_enter.apply(_world$darkworld_nort6, arguments)) || 'viewable';
                }
            },
            hobo: {
                caption: 'Fugitive under the bridge {flippers}',
                can_access: function can_access(_ref146) {
                    var items = _ref146.items;

                    return items.flippers;
                }
            },
            ice_cave: {
                caption: 'Ice Rod Cave {bomb}'
            }
        }
    });

    var lightworld_south_standard = update(lightworld_south, {
        build: function build(_build2) {
            return function () {
                return update(_build2.call(this), {
                    locations: { link_house: { $merge: { marked: true } } }
                });
            };
        }
    });

    var darkworld_deathmountain_west = _extends({}, overworld_region, {
        can_enter: function can_enter(_ref147) {
            var _world$lightworld_dea7;

            var world = _ref147.world;

            return (_world$lightworld_dea7 = world.lightworld_deathmountain_west).can_enter.apply(_world$lightworld_dea7, arguments);
        },
        can_enter_dark: function can_enter_dark(_ref148) {
            var _world$lightworld_dea8;

            var world = _ref148.world;

            return (_world$lightworld_dea8 = world.lightworld_deathmountain_west).can_enter_dark.apply(_world$lightworld_dea8, arguments);
        },

        locations: {
            spike: {
                caption: 'Byrna Spike Cave',
                can_access: function can_access(_ref149) {
                    var items = _ref149.items;

                    return items.moonpearl && items.hammer && items.can_lift_light && (items.cape || items.byrna);
                }
            }
        }
    });

    var darkworld_deathmountain_east = _extends({}, overworld_region, {
        can_enter: function can_enter(_ref150) {
            var _world$lightworld_dea9;

            var items = _ref150.items,
                world = _ref150.world;

            return items.can_lift_heavy && (_world$lightworld_dea9 = world.lightworld_deathmountain_east).can_enter.apply(_world$lightworld_dea9, arguments);
        },
        can_enter_dark: function can_enter_dark(_ref151) {
            var _world$lightworld_dea10;

            var items = _ref151.items,
                world = _ref151.world;

            return items.can_lift_heavy && (_world$lightworld_dea10 = world.lightworld_deathmountain_east).can_enter_dark.apply(_world$lightworld_dea10, arguments);
        },

        locations: {
            rock_hook: {
                caption: 'Cave Under Rock (3 top chests) {hookshot}',
                can_access: function can_access(_ref152) {
                    var items = _ref152.items;

                    return items.moonpearl && items.hookshot;
                }
            },
            rock_boots: {
                caption: 'Cave Under Rock (bottom chest) {hookshot}/{boots}',
                can_access: function can_access(_ref153) {
                    var items = _ref153.items;

                    return items.moonpearl && (items.hookshot || items.boots);
                }
            },
            bunny: {
                caption: 'Super Bunny Chests (2)',
                can_access: function can_access(_ref154) {
                    var items = _ref154.items;

                    return items.moonpearl;
                }
            }
        }
    });

    var darkworld_northwest = _extends({}, overworld_region, {
        can_enter: function can_enter(_ref155) {
            var _world$darkworld_nort7;

            var items = _ref155.items,
                world = _ref155.world;

            return items.moonpearl && ((_world$darkworld_nort7 = world.darkworld_northeast).can_enter.apply(_world$darkworld_nort7, arguments) && items.hookshot && (items.flippers || items.can_lift_light || items.hammer) || items.can_lift_light && items.hammer || items.can_lift_heavy);
        },

        locations: {
            bumper: {
                caption: 'Bumper Cave {cape}',
                can_access: function can_access(_ref156) {
                    var items = _ref156.items;

                    return items.can_lift_light && items.cape || 'viewable';
                }
            },
            chest_game: {
                caption: 'Treasure Chest Minigame: Pay 30 rupees'
            },
            c_house: {
                caption: 'C House'
            },
            bomb_hut: {
                caption: 'Bombable Hut {bomb}'
            },
            purple: {
                caption: 'Gary\'s Lunchbox (save the frog first)',
                can_access: function can_access(_ref157) {
                    var items = _ref157.items;

                    return items.can_lift_heavy;
                }
            },
            pegs: {
                caption: '{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}!!!!!!!!',
                can_access: function can_access(_ref158) {
                    var items = _ref158.items;

                    return items.can_lift_heavy && items.hammer;
                }
            }
        }
    });

    var darkworld_northeast = _extends({}, overworld_region, {
        can_enter: function can_enter(_ref159) {
            var items = _ref159.items,
                world = _ref159.world;

            // DefeatAgahnim
            return world.agahnim() || items.moonpearl && (items.can_lift_light && items.hammer || items.can_lift_heavy && items.flippers);
        },

        locations: {
            catfish: {
                caption: 'Catfish',
                can_access: function can_access(_ref160) {
                    var items = _ref160.items;

                    return items.moonpearl && items.can_lift_light;
                }
            },
            pyramid: {
                caption: 'Pyramid'
            },
            fairy_dw: {
                caption: 'Pyramid Faerie: Buy OJ bomb from Dark Link\'s House after {red-crystal}5 {red-crystal}6 (2 items)',
                can_access: function can_access(_ref161) {
                    var _world$darkworld_sout5;

                    var items = _ref161.items,
                        world = _ref161.world;

                    // Crystal5 && Crystal6
                    var crystals = _.reduce(world, function (s, dungeon) {
                        return dungeon.completed && dungeon.prize === 'crystal-red' ? s + 1 : s;
                    }, 0);
                    return crystals >= 2 && items.moonpearl && (_world$darkworld_sout5 = world.darkworld_south).can_enter.apply(_world$darkworld_sout5, arguments) && (items.hammer || items.mirror && world.agahnim());
                }
            }
        }
    });

    var darkworld_south = _extends({}, overworld_region, {
        can_enter: function can_enter(_ref162) {
            var _world$darkworld_nort8;

            var items = _ref162.items,
                world = _ref162.world;

            return items.moonpearl && ((_world$darkworld_nort8 = world.darkworld_northeast).can_enter.apply(_world$darkworld_nort8, arguments) && (items.hammer || items.hookshot && (items.can_lift_light || items.flippers)) || items.can_lift_light && items.hammer || items.can_lift_heavy);
        },

        locations: {
            dig_game: {
                caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees'
            },
            stumpy: {
                caption: 'Ol\' Stumpy'
            },
            swamp_ne: {
                caption: 'Hype Cave! {bomb} (NPC + 4 {bomb})'
            }
        }
    });

    var darkworld_mire = _extends({}, overworld_region, {
        can_enter: function can_enter(_ref163) {
            var items = _ref163.items;

            return items.can_flute && items.can_lift_heavy;
        },

        locations: {
            mire_w: {
                caption: 'West of Mire (2)',
                can_access: function can_access(_ref164) {
                    var items = _ref164.items;

                    return items.moonpearl;
                }
            }
        }
    });

    var castle_escape = {
        key_limit: 1,
        locations: {
            sanctuary: {
                caption: 'Sanctuary'
            },
            escape_side: {
                caption: 'Escape Sewer Side Room (3) {bomb}/{boots}'
            },
            escape_dark: {
                caption: 'Escape Sewer Dark Room {lamp}'
            },
            castle: {
                caption: 'Hyrule Castle Dungeon (3)'
            },
            secret: {
                caption: 'Castle Secret Entrance (Uncle + 1)'
            }
        }
    };

    var keys_region = {
        build: function build() {
            return update(_.create(this, { keys: 0 }), {
                locations: function locations(x) {
                    return _.mapValues(x, function (o) {
                        return _.create(o, { marked: false });
                    });
                }
            });
        }
    };

    var castle_escape_open = update(_extends({}, keys_region, castle_escape), {
        locations: {
            escape_side: {
                caption: function caption(text) {
                    return function (_ref165) {
                        var mode = _ref165.mode;
                        return mode.keysanity ? text : text + ' (yellow = need small key)';
                    };
                },
                $merge: {
                    can_access: function can_access(_ref166) {
                        var items = _ref166.items,
                            region = _ref166.region,
                            mode = _ref166.mode;

                        return items.can_lift_light || (mode.keysanity ? region.keys >= 1 && (items.lamp || 'dark') : items.lamp ? 'possible' : 'dark');
                    }
                }
            },
            escape_dark: { $merge: {
                    can_access: function can_access(_ref167) {
                        var items = _ref167.items;

                        return items.lamp || 'dark';
                    }
                } }
        }
    });

    var castle_escape_standard = _extends({}, castle_escape, {
        build: function build() {
            return update(this, {
                locations: {
                    $apply: function $apply(x) {
                        return _.mapValues(x, function (o) {
                            return _.create(o, { marked: true });
                        });
                    },
                    escape_side: { $merge: { marked: false } }
                }
            });
        }
    });

    var ganon_tower = {
        key_limit: 4,
        chest_limit: 27,
        build: function build() {
            return _.create(this, { keys: 0, big_key: false, chests: this.chest_limit });
        }
    };

    window.create_world = function (_ref168) {
        var standard = _ref168.standard,
            keysanity = _ref168.keysanity;
        return {
            world: _extends({}, _.mapValues(_.pickBy({
                eastern: keysanity ? eastern_keysanity : eastern,
                desert: keysanity ? desert_keysanity : desert,
                hera: keysanity ? hera_keysanity : hera,
                darkness: keysanity ? darkness_keysanity : darkness,
                swamp: keysanity ? swamp_keysanity : swamp,
                skull: keysanity ? skull_keysanity : skull,
                thieves: keysanity ? thieves_keysanity : thieves,
                ice: keysanity ? ice_keysanity : ice,
                mire: keysanity ? mire_keysanity : mire,
                turtle: keysanity ? turtle_keysanity : turtle,
                lightworld_deathmountain_west: lightworld_deathmountain_west,
                lightworld_deathmountain_east: lightworld_deathmountain_east,
                lightworld_northwest: lightworld_northwest,
                lightworld_northeast: lightworld_northeast,
                lightworld_south: standard ? lightworld_south_standard : lightworld_south,
                darkworld_deathmountain_west: darkworld_deathmountain_west,
                darkworld_deathmountain_east: darkworld_deathmountain_east,
                darkworld_northwest: darkworld_northwest,
                darkworld_northeast: darkworld_northeast,
                darkworld_south: darkworld_south,
                darkworld_mire: darkworld_mire,
                castle_escape: standard ? castle_escape_standard : castle_escape_open,
                castle_tower: castle_tower,
                ganon_tower: keysanity && ganon_tower
            }), function (x) {
                return x.build();
            }), {
                agahnim: function agahnim() {
                    return this.castle_tower.completed;
                }
            })
        };
    };
})(window);