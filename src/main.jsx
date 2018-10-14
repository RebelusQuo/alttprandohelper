(function(window) {
    'use strict';

    const Item = (props) =>
      <div className={classNames('item', props.name,
          props.value === true ? 'active' :
          props.value > 0 ? `active-${props.value}` : null)}
        onClick={() => props.onClick(props.name)} />;

    const TunicItem = (props) => {
        const { tunic, moonpearl } = props.items;
        return <div className={classNames('item', 'tunic',
            'active-'+tunic, { bunny: !moonpearl })}
          onClick={() => props.onClick('tunic')} />;
    };

    const Dungeon = (props) =>
      <React.Fragment>
        <div
          className={classNames('boss', props.name, { defeated: props.dungeon.completed })}
          onClick={() => props.onCompletionClick(props.name)} />
        <div
          className={`prize prize-${props.dungeon.prize}`}
          onClick={() => props.onPrizeClick(props.name)} />
      </React.Fragment>;

    const WithMedallion = (Wrapped) =>
      (props) => {
          const { onMedallionClick, ...pass_props } = props;
          return <React.Fragment>
              <Wrapped {...pass_props} />
              <div className={`medallion medallion-${props.dungeon.medallion}`}
                onClick={() => onMedallionClick(props.name)} />
          </React.Fragment>;
      };

    const DungeonWithMedallion = WithMedallion(Dungeon);

    const Keys = (props) => {
        const source = props.value;
        return !source.key_limit ?
            <div className="keys"><span>{'\u2014'}</span></div> :
            <div className="keys"
              onClick={() => props.onClick(props.name)}>
                <span>{`${source.keys}/${source.key_limit}`}</span>
            </div>;
    };

    const BigKey = (props) => {
        const source = props.value;
        return <div className={classNames('big-key', { collected: source.big_key })}
          onClick={() => props.onClick(props.name)} />;
    };

    const WithBigKey = (Wrapped) =>
        (props) => {
            const { onBigKeyClick, ...pass_props } = props;
            return <React.Fragment>
                <Wrapped {...pass_props} />
                <BigKey name={props.name} value={props.dungeon} onClick={onBigKeyClick} />
            </React.Fragment>;
        };

    const DungeonWithBigkey = WithBigKey(Dungeon);
    const DungeonWithMedallionWithBigkey = WithBigKey(DungeonWithMedallion);

    const SingleChest = (props) => {
        const dungeon = props.value;
        return <div className={classNames('chest', { empty: !dungeon.chests })}
          onClick={() => props.onClick(props.name)}>
          <span>{`${dungeon.chests}`}</span>
        </div>;
    };

    const Chests = (props) => {
        const dungeon = props.value;
        return <div className={`chest chest-${dungeon.chests}`}
          onClick={() => props.onClick(props.name)} />;
    };

    class BaseTracker extends React.Component {
        render() {
            return <div id="tracker" className={classNames({ cell: this.props.horizontal })}>
              {grid([
                  grid([
                      this.corner()
                  ], [
                      this.dungeon_boss('eastern'),
                      this.dungeon('eastern')
                  ], [
                      this.dungeon_boss('desert'),
                      this.dungeon('desert')
                  ], [
                      this.dungeon_boss('hera'),
                      this.dungeon('hera')
                  ]),
                  grid([
                      this.item('bow'),
                      this.item('boomerang'),
                      this.item('hookshot'),
                      this.item('mushroom'),
                      this.item('powder')
                  ], [
                      this.item('firerod'),
                      this.item('icerod'),
                      this.item('bombos'),
                      this.item('ether'),
                      this.item('quake')
                  ], [
                      this.item('lantern'),
                      this.item('hammer'),
                      this.item('shovel'),
                      this.item('net'),
                      this.item('book')
                  ], [
                      this.item('bottle'),
                      this.item('somaria'),
                      this.item('byrna'),
                      this.item('cape'),
                      this.item('mirror')
                  ], [
                      this.item('boots'),
                      this.item('glove'),
                      this.item('flippers'),
                      this.item('flute'),
                      this.agahnim()
                  ])
              ], [
                  this.dungeon_boss('darkness'),
                  this.dungeon_boss('swamp'),
                  this.dungeon_boss('skull'),
                  this.dungeon_boss('thieves'),
                  this.dungeon_boss('ice'),
                  this.medallion_dungeon_boss('mire'),
                  this.medallion_dungeon_boss('turtle')
              ], [
                  this.dungeon('darkness'),
                  this.dungeon('swamp'),
                  this.dungeon('skull'),
                  this.dungeon('thieves'),
                  this.dungeon('ice'),
                  this.dungeon('mire'),
                  this.dungeon('turtle')
              ])}
            </div>;
        }

        corner() {
            return <React.Fragment>
              {this.tunic()}
              {this.item('sword')}
              {this.item('shield')}
              {this.item('moonpearl')}
            </React.Fragment>;
        }

        tunic() {
            return <TunicItem items={this.props.model.items} onClick={this.props.item_click} />;
        }

        item(name) {
            return <Item name={name} value={this.props.model.items[name]} onClick={this.props.item_click} />;
        }
    }

    class Tracker extends BaseTracker {
        dungeon_boss(name) {
            return <Dungeon name={name} dungeon={this.props.model.dungeons[name]}
              onCompletionClick={name => this.props.completion_click('dungeons', name)}
              onPrizeClick={this.props.prize_click} />;
        }

        medallion_dungeon_boss(name) {
            return <DungeonWithMedallion name={name} dungeon={this.props.model.dungeons[name]}
              onCompletionClick={name => this.props.completion_click('dungeons', name)}
              onPrizeClick={this.props.prize_click}
              onMedallionClick={this.props.medallion_click} />;
        }

        agahnim() {
            return <Item name="agahnim"
              value={this.props.model.encounters.agahnim.completed}
              onClick={name => this.props.completion_click('encounters', name)} />;
        }

        dungeon(name) {
            return <Chests name={name} value={this.props.model.dungeons[name]}
              onClick={name => this.props.chest_click('dungeons', name)} />;
        }
    }

    class KeysanityTracker extends BaseTracker {
        corner() {
            const value = this.props.model.regions.ganon_tower;
            return <React.Fragment>
              <div className="avatar">
                {this.tunic()}
                {this.item('sword')}
                {this.item('shield')}
                {this.item('moonpearl')}
              </div>
              <div className="ganon-tower">
                <SingleChest name="ganon_tower" value={value} onClick={name => this.props.chest_click('regions', name)} />
                <Keys name="ganon_tower" value={value} onClick={name => this.props.key_click('regions', name)} />
                <BigKey name="ganon_tower" value={value} onClick={name => this.props.big_key_click('regions', name)} />
              </div>
            </React.Fragment>;
        }

        dungeon_boss(name) {
            return <DungeonWithBigkey name={name} dungeon={this.props.model.dungeons[name]}
              onCompletionClick={name => this.props.completion_click('dungeons', name)}
              onPrizeClick={this.props.prize_click}
              onBigKeyClick={name => this.props.big_key_click('dungeons', name)} />;
        }

        medallion_dungeon_boss(name) {
            return <DungeonWithMedallionWithBigkey name={name} dungeon={this.props.model.dungeons[name]}
                onCompletionClick={name => this.props.completion_click('dungeons', name)}
                onPrizeClick={this.props.prize_click}
                onMedallionClick={this.props.medallion_click}
                onBigKeyClick={name => this.props.big_key_click('dungeons', name)} />;
        }

        agahnim() {
            const model = this.props.model;
            return <React.Fragment>
              <Item name="agahnim" value={model.encounters.agahnim.completed}
                onClick={name => this.props.completion_click('encounters', name)} />
              <div className="agahnim-keys">
                <Keys name="castle_tower" value={model.regions.castle_tower} onClick={name => this.props.key_click('regions', name)} />
                <Keys name="escape" value={model.regions.escape} onClick={name => this.props.key_click('regions', name)} />
              </div>
            </React.Fragment>;
        }

        dungeon(name) {
            return <div className="dungeon">
              <Keys name={name} value={this.props.model.dungeons[name]} onClick={name => this.props.key_click('dungeons', name)} />
              <SingleChest name={name} value={this.props.model.dungeons[name]} onClick={name => this.props.chest_click('dungeons', name)} />
            </div>;
        }
    }

    const WithHighlight = (Wrapped) =>
        class extends React.Component {
            state = { highlighted: false }

            render() {
                return <Wrapped
                  highlighted={this.state.highlighted}
                  onHighlight={this.onHighlight}
                  {...this.props} />
            }

            onHighlight = (highlighted) => {
                const model = this.props.model;
                const location = Wrapped.source(this.props);
                this.props.change_caption(highlighted ?
                    typeof location.caption === 'function' ? location.caption(model) : location.caption :
                    null);
                this.setState({ highlighted });
            }
        };

    const MapChest = (props) => {
        const { name, model } = props;
        const chest = model.chests[name];
        return <div className={classNames('chest', as_location(name),
            chest.marked || chest.is_available(model.items, model), {
                marked: chest.marked,
                highlight: props.highlighted
          })}
          onClick={() => props.onClick(name)}
          onMouseOver={() => props.onHighlight(true)}
          onMouseOut={() => props.onHighlight(false)} />;
    };

    MapChest.source = (props) => _.get(props.model, ['chests', props.name]);

    const MapEncounter = (props) => {
        const { name, model } = props;
        const encounter = model.encounters[name];
        return <React.Fragment>
          <div className={`boss ${as_location(name)}`}
            onMouseOver={() => props.onHighlight(true)}
            onMouseOut={() => props.onHighlight(false)} />
          <div className={classNames('encounter', as_location(name),
              encounter.completed || encounter.can_complete(model.items, model), {
                  marked: encounter.completed,
                  highlight: props.highlighted
            })}
            onMouseOver={() => props.onHighlight(true)}
            onMouseOut={() => props.onHighlight(false)} />
        </React.Fragment>;
    };

    MapEncounter.source = (props) => _.get(props.model, ['encounters', props.name]);

    const MapDungeon = (props) => {
        const { name, model, deviated } = props;
        const dungeon = model.dungeons[name];
        return <React.Fragment>
            <div className={classNames('boss', as_location(name),
                !deviated && !dungeon.completed && dungeon.can_complete(model.items, model), {
                    marked: dungeon.completed,
                    possible: deviated && !dungeon.completed,
              })}
              onClick={() => props.onClick(name)}
              onMouseOver={() => props.onHighlight(true)}
              onMouseOut={() => props.onHighlight(false)} />
            <div className={classNames('dungeon', as_location(name),
                !deviated && dungeon.chests !== 0 && dungeon.can_progress(model.items, model), {
                    marked: dungeon.chests === 0,
                    possible: deviated && dungeon.chests !== 0,
                    highlight: props.highlighted
              })}
              onClick={() => props.onClick(name)}
              onMouseOver={() => props.onHighlight(true)}
              onMouseOut={() => props.onHighlight(false)} />
        </React.Fragment>;
    };

    MapDungeon.source = (props) => _.get(props.model, ['dungeons', props.name]);

    const MapChestWithHighlight = WithHighlight(MapChest);
    const MapEncounterWithHighlight = WithHighlight(MapEncounter);
    const MapDungeonWithHighlight = WithHighlight(MapDungeon);

    const MiniMapDoor = (props) => {
        const { name, dungeon: dungeon_name, model } = props;
        const dungeon = model.dungeons[dungeon_name];
        const door = dungeon.doors[name];
        return <div className={classNames('door', as_location(name), props.dungeon,
            !props.deviated && !door.opened && door.can_reach.call(dungeon, model.items, model), {
                marked: door.opened,
                possible: props.deviated && !door.opened,
                highlight: props.highlighted
          })}
          onClick={() => props.onClick(dungeon_name, name)}
          onMouseOver={() => props.onHighlight(true)}
          onMouseOut={() => props.onHighlight(false)}>
          <div className="image" />
        </div>;
    };

    MiniMapDoor.source = (props) => _.get(props.model, ['dungeons', props.dungeon, 'doors', props.name]);

    const MiniMapLocation = function(props) {
        const { name, dungeon: dungeon_name, model } = props;
        const dungeon = model.dungeons[dungeon_name];
        const location = dungeon.locations[name];
        return <div className={classNames('location', as_location(name),
            !props.deviated && !location.marked && location.can_reach.call(dungeon, model.items, model), {
                marked: location.marked,
                possible: props.deviated && !location.marked,
                highlight: props.highlighted
          })}
          onClick={() => props.onClick(dungeon_name, name)}
          onMouseOver={() => props.onHighlight(true)}
          onMouseOut={() => props.onHighlight(false)}>
          {name === 'big_chest' && <div className="image" />}
          {name === 'boss' && <div className={`image boss ${props.dungeon}`} />}
        </div>;
    };

    MiniMapLocation.source = (props) => _.get(props.model, ['dungeons', props.dungeon, 'locations', props.name]);

    const MiniMapDoorWithHighlight = WithHighlight(MiniMapDoor);
    const MiniMapLocationWithHighlight = WithHighlight(MiniMapLocation);

    class Caption extends React.Component {
        render() {
            const each_part = /[^{]+|\{[\w]+\}/g;
            const text = this.props.text;
            return <div id="caption">{!text ? '\u00a0' : text.match(each_part).map(this.parse)}</div>;
        }

        parse = (part) => {
            const dm = part.match(/^\{(medallion|pendant)(\d+)\}/);
            const pm = part.match(/^\{(\w+?)(\d+)?\}/);
            const m = dm || pm;
            return !m ? part : <div className={classNames(
              'icon',
              dm ? `${m[1]}-${m[2]}` : m[1],
              !dm && m[2] && `active-${m[2]}`
            )} />;
        }
    }

    class Map extends React.Component {
        state = { caption: null }

        render() {
            const { horizontal, dungeon } = this.props;
            const locations = _.partition(dungeon ? this.dungeon_locations() : this.world_locations(), x => x.second);
            const maps = [
                <div className={`first ${dungeon || 'world'}`}>{locations[1].map(x => x.tag)}</div>,
                <div className={`second ${dungeon || 'world'}`}>{locations[0].map(x => x.tag)}</div>
            ];

            var dungeon_click = this.props.dungeon_click;
            return <div id="map" className={classNames({ cell: this.props.horizontal })}>
                {this.props.horizontal ? grid(maps) : maps}
                {dungeon && span('.close', { onClick: function() { dungeon_click(null); } }, '\u00d7')}
                <Caption text={this.state.caption} />
            </div>;
        }

        world_locations() {
            const { model, keysanity, chest_click } = this.props;
            const dungeon_click = this.dungeon_click;
            const change_caption = this.change_caption;

            return _.flatten([
                _.map(model.chests, (chest, name) => ({
                    second: chest.darkworld,
                      tag: <MapChestWithHighlight name={name} model={model} onClick={chest_click} change_caption={change_caption} />
                })),
                _.map(model.encounters, (encounter, name) => ({
                    second: encounter.darkworld,
                    tag: <MapEncounterWithHighlight name={name} model={model} change_caption={change_caption} />
                })),
                _.map(model.dungeons, (dungeon, name) => ({
                    second: dungeon.darkworld,
                    tag: <MapDungeonWithHighlight name={name} model={model} deviated={keysanity && dungeon.is_deviating()}
                      onClick={dungeon_click} change_caption={change_caption} />
                }))
            ]);
        }

        dungeon_locations() {
            const { model, dungeon: dungeon_name } = this.props;
            const dungeon = model.dungeons[dungeon_name];
            const deviated = dungeon.is_deviating();
            const { door_click, location_click } = this.props;
            const change_caption = this.change_caption;

            return _.flatten([
                _.map(dungeon.doors, (door, name) => ({
                    second: door.second_map,
                    tag: <MiniMapDoorWithHighlight
                        name={name} dungeon={dungeon_name} model={model} deviated={deviated}
                        onClick={door_click} change_caption={change_caption} />
                })),
                _.map(dungeon.locations, (location, name) => ({
                    second: location.second_map,
                    tag: <MiniMapLocationWithHighlight
                        name={name} dungeon={dungeon_name} model={model} deviated={deviated}
                        onClick={location_click} change_caption={change_caption} />
                }))
            ]);
        }

        dungeon_click = (name) => {
            if (this.props.dungeon_click) {
                this.props.dungeon_click(name);
                this.change_caption(null);
            }
        }

        change_caption = (caption) => {
            this.setState({ caption: caption });
        }
    }

    function grid() {
        const [...rows] = arguments;
        return rows.map(row =>
            <div className="row">
              {row.map(cell => <div className="cell">{cell}</div>)}
            </div>
        );
    }

    class App extends React.Component {
        constructor(props) {
            super(props);
            const { mode, ipbj, podbj } = props.query;
            const opts = { ipbj: !!ipbj, podbj: !!podbj };
            this.state = { model: { ...item_model(mode), ...location_model(mode, opts) } };
        }

        render() {
            const query = this.props.query;
            const keysanity = query.mode === 'keysanity';
            const ItemTracker = keysanity ? KeysanityTracker : Tracker;

            return <div id="page" className={classNames({
                  row: query.hmap,
                  hmap: query.hmap,
                  vmap: query.vmap,
                  keysanity: keysanity
              }, query.sprite)}
              style={query.bg && { 'background-color': query.bg }}>
              <ItemTracker
                item_click={this.item_click}
                completion_click={this.completion_click}
                prize_click={this.prize_click}
                medallion_click={this.medallion_click}
                chest_click={this.chest_click}
                horizontal={query.hmap}
                model={this.state.model}
                {...(keysanity ? {
                  big_key_click: this.big_key_click,
                  key_click: this.key_click
                } : {})} />
              {(query.hmap || query.vmap) && <Map
                chest_click={this.map_chest_click}
                horizontal={query.hmap}
                model={this.state.model}
                {...(keysanity ? {
                  dungeon_click: this.map_dungeon_click,
                  door_click: this.door_click,
                  location_click: this.location_click,
                  dungeon: this.state.dungeon,
                  keysanity: true
                } : {})} />}
            </div>;
        }

        map_dungeon_click = (name) => {
            this.setState({ dungeon: name });
        }

        item_click = (name) => {
            const items = this.state.model.items;
            const change = typeof items[name] === 'boolean' ?
                update.toggle(name) :
                { [name]: { $set: items.inc(name) } };
            this.setState({ model: update(this.state.model, { items: change }) });
        }

        completion_click = (source, name) => {
            const model = this.state.model;
            const target = model[source][name];
            const completed = target.completed;
            const update_keysanity = this.props.query.mode === 'keysanity' && source === 'dungeons';

            this.setState({ model: update(model, { [source]: { [name]: {
                    completed: { $set: !completed },
                    ...(update_keysanity && {
                        locations: { boss: { marked: { $set: !completed } } },
                        chests: !target.is_deviating() && (x => x - (!completed ? 1 : -1))
                    })
                } }
            }) });
        }

        prize_click = (name) => {
            const value = counter(this.state.model.dungeons[name].prize, 1, 4);
            this.setState({ model: update(this.state.model, { dungeons: { [name]: { prize: { $set: value } } } }) });
        }

        medallion_click = (name) => {
            const value = counter(this.state.model.dungeons[name].medallion, 1, 3);
            this.setState({ model: update(this.state.model, { dungeons: { [name]: { medallion: { $set: value } } } }) });
        }

        door_click = (dungeon, name) => {
            this.setState({ model: update(this.state.model, { dungeons: { [dungeon]: { doors: { [name]: update.toggle('opened') } } } }) });
        }

        location_click = (dungeon, name) => {
            const model = this.state.model;
            const target = model.dungeons[dungeon];
            const marked = target.locations[name].marked;

            this.setState({ model: update(model, { dungeons: { [dungeon]: {
                    locations: { [name]: { marked: { $set: !marked } } },
                    completed: name === 'boss' && { $set: !marked },
                    chests: !target.is_deviating() && (x => x - (!marked ? 1 : -1))
                } }
            }) });
        }

        big_key_click = (source, name) => {
            this.setState({ model: update(this.state.model, { [source]: { [name]: update.toggle('big_key') } }) });
        }

        key_click = (source, name) => {
            const target = this.state.model[source][name],
                value = counter(target.keys, 1, target.key_limit);
            this.setState({ model: update(this.state.model, { [source]: { [name]: { keys: { $set: value } } } }) });
        }

        chest_click = (source, name) => {
            const target = this.state.model[source][name],
                value = counter(target.chests, -1, target.chest_limit);
            this.setState({ model: update(this.state.model, { [source]: { [name]: { chests: { $set: value } } } }) });
        }

        map_chest_click = (name) => {
            this.setState({ model: update(this.state.model, { chests: { [name]: update.toggle('marked') } }) });
        }
    }

    window.start = () => {
        ReactDOM.render(<App query={uri_query()} />, document.getElementById('app'));
    }

    function as_location(s) {
        return s.replace(/_/, '-');
    }
}(window));