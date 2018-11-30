(function(window) {
    'use strict';

    const styled = window.styled.default;
    const css = window.styled.css;

    const Slot = styled.div`
      width: 64px;
      height: 64px;
    `;
    const ActiveItem = styled(Slot)`
      filter: contrast(${props => props.active ? 100 : 80}%)
              brightness(${props => props.active ? 100 : 30}%);
    `;

    const Item = (props) =>
      <ActiveItem
        className={classNames(props.name, props.value && `${props.name}--active`)}
        active={props.value}
        onClick={() => props.onToggle(props.name)} />;

    const LeveledItem = (props) =>
      <ActiveItem
        className={classNames(props.name, props.value && `${props.name}--active-${props.value}`)}
        active={props.value > 0}
        onClick={() => props.onLevel(props.name)} />

    const SubSlot = styled.div`
      width: 32px;
      height: 32px;
    `;
    const ActiveSubItem = styled(SubSlot)`
      filter: contrast(${props => props.active ? 100 : 80}%)
              brightness(${props => props.active ? 100 : 30}%);
    `;

    const BigKey = (props) =>
      <ActiveSubItem className="big-key"
        active={props.source.big_key}
        onClick={() => props.onToggle(props.name)} />;

    const StyledDungeon = styled(Slot)`
      position: relative;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      grid-template-areas:
      ${props => props.keysanity ? `
        ".  mn"
        "bk pz"
      ` : `
        ".  ."
        "mn pz"
      `};
      & .medallion { grid-area: mn; }
      & .prize { grid-area: pz; }
      & .big-key { grid-area: bk; }
      & .boss { position: absolute; }
      & ${SubSlot} { z-index: 1; }
    `;

    const Dungeon = (props) =>
      <StyledDungeon keysanity={props.keysanity}>
        <ActiveItem
          className={`boss boss---${props.name}`}
          active={props.dungeon.completed}
          onClick={() => props.onCompletion(props.name)} />
        {props.medallion &&
        <SubSlot
          className={`medallion medallion--${props.dungeon.medallion}`}
          onClick={() => props.onMedallion(props.name)} />}
        {props.keysanity &&
        <BigKey name={props.name} source={props.dungeon} onToggle={props.onBigKey} />}
        <SubSlot
          className={`prize prize--${props.dungeon.prize}`}
          onClick={() => props.onPrize(props.name)} />
      </StyledDungeon>;

    const Chests = (props) =>
      <Slot className={`chest-${props.dungeon.chests}`}
        onClick={() => props.onLevel(props.name)} />;

    const OutlinedText = styled.span`
      color: white;
      font-weight: bold;
      text-shadow:
        -2px -2px black,  0px -2px black,
         2px -2px black,  2px  0px black,
         2px  2px black,  0px  2px black,
        -2px  2px black, -2px  0px black;
      user-select: none;
    `;
    const ChestText = styled(OutlinedText)`
      font-size: 20px;
    `;
    const KeyText = styled(OutlinedText)`
      font-size: 14px;
    `;
    const TextSubSlot = styled(SubSlot)`
      display: flex;
      justify-content: center;
      align-items: center;
    `;

    const KeysanityChest = (props) =>
      <TextSubSlot className={classNames('chest', { 'chest--empty': !props.source.chests })}
        onClick={() => props.onLevel(props.name)}>
        <ChestText>{`${props.source.chests}`}</ChestText>
      </TextSubSlot>;

    const Keys = (props) => {
        const { keys, key_limit } = props.source;
        return !key_limit ?
            <TextSubSlot className="key"><KeyText>{'\u2014'}</KeyText></TextSubSlot> :
            <TextSubSlot className="key"
              onClick={() => props.onLevel(props.name)}>
              <KeyText>{`${keys}/${key_limit}`}</KeyText>
            </TextSubSlot>;
    };

    const Sprite = styled.div`
      width: ${props => props.keysanity ? 96 : 128}px;
      height: ${props => props.keysanity ? 96 : 128}px;
      background-size: 100%;
      display: grid;
      grid-template-areas:
        ".  sw"
        "sh mp";
      & .sword { grid-area: sw }
      & .shield { grid-area: sh }
      & .moonpearl { grid-area: mp }
      ${props => props.keysanity && css`
        & .sword,
        & .shield {
          width: 48px;
          height: 48px;
          background-size: 100%;
        }
      `}
      & .moonpearl {
        margin-top: ${props => props.keysanity ? 12 : 16}px;
        margin-left: ${props => props.keysanity ? 12 : 16}px;
        width: ${props => props.keysanity ? 36 : 48}px;
        height: ${props => props.keysanity ? 36 : 48}px;
        background-size: 100%;
      }
    `;

    const Portrait = (props) => {
      const { items, keysanity } = props;
      const { onToggle, onLevel } = props;
      return <Sprite
        className={classNames(`tunic--active-${items.tunic}`, { 'tunic--bunny': !items.moonpearl })}
        keysanity={keysanity}
        onClick={(e) => e.target === e.currentTarget && onLevel('tunic')}>
        <LeveledItem name="sword" value={items.sword} onLevel={onLevel} />
        <LeveledItem name="shield" value={items.shield} onLevel={onLevel} />
        <Item name="moonpearl" value={items.moonpearl} onToggle={onToggle} />
      </Sprite>;
    };

    const TrackerItemGrid = styled.div`
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(5, 1fr);
    `;
    const TrackerLwGrid = styled.div`
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr 1fr;
      grid-auto-flow: column;
    `;
    const TrackerDwGrid = styled.div`
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-template-rows: 1fr 1fr;
    `;
    const TrackerGrid = styled.div`
      display: grid;
      grid-template-areas:
        "p i"
        "l i"
        "d d";
      & ${TrackerItemGrid} { grid-area: i; }
      & ${TrackerDwGrid} { grid-area: d; }
    `;
    const KeysanityPortrait = styled.div`
      width: 128px;
      height: 128px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: repeat(4, 1fr);
      & ${Sprite} { grid-row: 1 / 4; }
    `;
    const KeysanityAgahnim = styled(Slot)`
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      & .agahnim { position: absolute; }
      & ${SubSlot} { z-index: 1; }
    `;
    const KeysanityDungeon = styled(Slot)`
      display: flex;
      flex-direction: column;
      align-items: center;
    `;

    class Tracker extends React.Component {
        render() {
            const { model, mode: { keysanity } } = this.props;
            const { items, ganon_tower, castle_escape, castle_tower } = model;
            const { onToggle, onLevel, onChest, onCompletion, onKey, onBigKey } = this.props;
            return <TrackerGrid>
              {keysanity ?
              <KeysanityPortrait>
                <Portrait keysanity={true} items={items} onToggle={onToggle} onLevel={onLevel} />
                <KeysanityChest name="ganon_tower" source={ganon_tower} onLevel={onChest} />
                <Keys name="ganon_tower" source={ganon_tower} onLevel={onKey} />
                <BigKey name="ganon_tower" source={ganon_tower} onToggle={onBigKey} />
              </KeysanityPortrait> :
              <Portrait items={items} onToggle={onToggle} onLevel={onLevel} />}
              <TrackerItemGrid>
                <LeveledItem name="bow" value={items.bow} onLevel={onLevel} />
                <LeveledItem name="boomerang" value={items.boomerang} onLevel={onLevel} />
                <Item name="hookshot" value={items.hookshot} onToggle={onToggle} />
                <Item name="mushroom" value={items.mushroom} onToggle={onToggle} />
                <Item name="powder" value={items.powder} onToggle={onToggle} />
                <Item name="firerod" value={items.firerod} onToggle={onToggle} />
                <Item name="icerod" value={items.icerod} onToggle={onToggle} />
                <Item name="bombos" value={items.bombos} onToggle={onToggle} />
                <Item name="ether" value={items.ether} onToggle={onToggle} />
                <Item name="quake" value={items.quake} onToggle={onToggle} />
                <Item name="lamp" value={items.lamp} onToggle={onToggle} />
                <Item name="hammer" value={items.hammer} onToggle={onToggle} />
                <Item name="shovel" value={items.shovel} onToggle={onToggle} />
                <Item name="net" value={items.net} onToggle={onToggle} />
                <Item name="book" value={items.book} onToggle={onToggle} />
                <LeveledItem name="bottle" value={items.bottle} onLevel={onLevel} />
                <Item name="somaria" value={items.somaria} onToggle={onToggle} />
                <Item name="byrna" value={items.byrna} onToggle={onToggle} />
                <Item name="cape" value={items.cape} onToggle={onToggle} />
                <Item name="mirror" value={items.mirror} onToggle={onToggle} />
                <Item name="boots" value={items.boots} onToggle={onToggle} />
                <LeveledItem name="glove" value={items.glove} onLevel={onLevel} />
                <Item name="flippers" value={items.flippers} onToggle={onToggle} />
                <Item name="flute" value={items.flute} onToggle={onToggle} />
                {keysanity ?
                <KeysanityAgahnim>
                  <Item name="agahnim" value={castle_tower.completed} onToggle={() => onCompletion('castle_tower')} />
                  <Keys name="castle_tower" source={castle_tower} onLevel={onKey} />
                  <Keys name="castle_escape" source={castle_escape} onLevel={onKey} />
                </KeysanityAgahnim> :
                <Item name="agahnim" value={castle_tower.completed} onToggle={() => onCompletion('castle_tower')} />}
              </TrackerItemGrid>
              <TrackerLwGrid>
                {this.dungeon('eastern')}
                {this.dungeon('desert')}
                {this.dungeon('hera')}
                {this.inner_dungeon('eastern')}
                {this.inner_dungeon('desert')}
                {this.inner_dungeon('hera')}
              </TrackerLwGrid>
              <TrackerDwGrid>
                {this.dungeon('darkness')}
                {this.dungeon('swamp')}
                {this.dungeon('skull')}
                {this.dungeon('thieves')}
                {this.dungeon('ice')}
                {this.dungeon('mire', { medallion: true })}
                {this.dungeon('turtle', { medallion: true })}
                {this.inner_dungeon('darkness')}
                {this.inner_dungeon('swamp')}
                {this.inner_dungeon('skull')}
                {this.inner_dungeon('thieves')}
                {this.inner_dungeon('ice')}
                {this.inner_dungeon('mire')}
                {this.inner_dungeon('turtle')}
              </TrackerDwGrid>
            </TrackerGrid>;
        }

        dungeon(name, medallion = { medallion: false }) {
            const { onCompletion, onPrize, onMedallion, onBigKey } = this.props;
            return <Dungeon name={name} dungeon={this.props.model[name]}
              {...medallion}
              keysanity={this.props.mode.keysanity}
              onCompletion={name => onCompletion(name, { dungeon: true })}
              onPrize={onPrize}
              onMedallion={onMedallion}
              onBigKey={onBigKey} />;
        }

        inner_dungeon(name) {
            const dungeon = this.props.model[name];
            const { onKey, onChest } = this.props;
            return this.props.mode.keysanity ?
              <KeysanityDungeon>
                <Keys name={name} source={dungeon} onLevel={onKey} />
                <KeysanityChest name={name} source={dungeon} onLevel={onChest} />
              </KeysanityDungeon> :
              <Chests name={name} dungeon={dungeon} onLevel={onChest} />;
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
                const { model, mode } = this.props;
                const location = Wrapped.source(this.props);
                this.props.change_caption(highlighted ?
                    typeof location.caption === 'function' ? location.caption({ model, mode }) : location.caption :
                    null);
                this.setState({ highlighted });
            }
        };

    const Availability = styled.div`
      background-color: ${({ state }) =>
        state === 'marked' ? 'hsl(0 0% 50%)':
        state === 'dark' ? 'blue' :
        _.includes(['possible', 'viewable', 'medallion'], state) ? 'yellow' :
        _.includes(['available', true], state) ? 'lime' :
        _.includes(['unavailable', false], state) ? 'red' :
        'unset'}
    `;
    const Poi = styled(Availability)`
      border: solid hsl(${props => props.highlight ? '55 100% 50%' : '0 0% 10%'});
    `;

    const region_state = (region, args) =>
        !region.can_enter || region.can_enter(args) ||
        !!region.can_enter_dark && region.can_enter_dark(args) && 'dark';

    // respects dark higher, but possible/viewable highest
    const derive_state = (region, location) =>
        region === true ? location :
        location === true ? region :
        location;

    const MinorPoi = styled(Poi)`
      width: 24px;
      height: 24px;
      margin-left: -12px;
      margin-top: -12px;
      position: absolute;
      border-width: 3px;
    `;

    const OverworldLocation = (props) => {
        const { model, mode, region: region_name, name, highlighted } = props;
        const { items } = model;
        const region = model[region_name];
        const location = region.locations[name];
        const args = { items, region, model, mode };
        let state;
        return <MinorPoi className={`world---${_.kebabCase(name)}`}
          state={
              location.marked ? 'marked' :
              (state = region_state(region, args)) &&
              derive_state(state, !location.can_access || location.can_access(args))
          }
          highlight={highlighted}
          onClick={() => props.onMark(region_name, name)}
          onMouseOver={() => props.onHighlight(true)}
          onMouseOut={() => props.onHighlight(false)} />;
    };

    OverworldLocation.source = (props) => props.model[props.region].locations[props.name];

    const MedialPoi = styled(Poi)`
      width: 36px;
      height: 36px;
      margin-left: -18px;
      margin-top: -18px;
      position: absolute;
      border-width: 4px;
    `;
    const EncounterPoi = styled(MedialPoi)`
      background-repeat: no-repeat;
      background-position: center;
      background-size: 18px;
    `;

    const EncounterLocation = (props) => {
        const { model, mode, region: region_name, highlighted } = props;
        const { items } = model;
        const region = model[region_name];
        const name = _.kebabCase(region_name);
        const args = { items, region, model, mode };
        let state;
        return <EncounterPoi className={`world---${name} boss---${name}`}
          state={
            region.completed ? 'marked' :
            (state = region_state(region, args)) &&
            derive_state(state, region.can_complete(args))
          }
          highlight={highlighted}
          onMouseOver={() => props.onHighlight(true)}
          onMouseOut={() => props.onHighlight(false)} />;
    };

    EncounterLocation.source = (props) => props.model[props.region];

    const MajorPoi = styled(Poi)`
      width: 48px;
      height: 48px;
      margin-left: -24px;
      margin-top: -24px;
      position: absolute;
      border-width: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    const DungeonBoss = styled(Availability)`
      width: 24px;
      height: 24px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 18px;
    `;

    const DungeonLocation = (props) => {
        const { model, mode, region: region_name, deviated, highlighted } = props;
        const { items } = model;
        const region = model[region_name];
        const name = _.kebabCase(region_name);
        const args = { items, region, model, mode };
        let state;
        return <MajorPoi className={`world---${name}`}
          state={
            region.chests === 0 ? 'marked' :
            deviated ? 'possible' :
            (state || (state = region_state(region, args))) &&
            derive_state(state, region.can_progress(args))
          }
          highlight={highlighted}
          onClick={() => props.onDungeon(region_name)}
          onMouseOver={() => props.onHighlight(true)}
          onMouseOut={() => props.onHighlight(false)}>
          <DungeonBoss className={`boss---${name}`}
            state={
              region.completed ? 'marked' :
              deviated ? 'possible' :
              (state || (state = region_state(region, args))) &&
              derive_state(state, region.can_complete(args))
            } />
        </MajorPoi>;
    };

    DungeonLocation.source = (props) => props.model[props.region];

    const OverworldLocationWithHighlight = WithHighlight(OverworldLocation);
    const EncounterLocationWithHighlight = WithHighlight(EncounterLocation);
    const DungeonLocationWithHighlight = WithHighlight(DungeonLocation);

    const MedialDungeonPoi = styled(MedialPoi)`
      background-repeat: no-repeat;
      background-position: center;
      background-size: 24px;
    `;

    const DungeonMapDoor = (props) => {
        const { model, mode, region: region_name, name, deviated, highlighted } = props;
        const { items } = model;
        const region = model[region_name];
        const door = region.doors[name];
        const args = { items, region, model, mode };
        let state;
        return <MedialDungeonPoi className={classNames(
            `${region_name}---door---${_.kebabCase(name)}`,
            `${region_name}---door`,
            door.opened && `${region_name}---door--open`
          )}
          state={
            door.opened ? 'marked' :
            deviated ? 'possible' :
            (state = region_state(region, args)) &&
            derive_state(state, door.can_access && door.can_access(args))
          }
          highlight={highlighted}
          onClick={() => props.onMark(region_name, name)}
          onMouseOver={() => props.onHighlight(true)}
          onMouseOut={() => props.onHighlight(false)} />;
    };

    DungeonMapDoor.source = (props) => props.model[props.region].doors[props.name];

    const DungeonMapLocation = function(props) {
        const { model, mode, region: region_name, name, deviated, highlighted } = props;
        const { items } = model;
        const region = model[region_name];
        const location = region.locations[name];
        const args = { items, region, model, mode };
        let state;
        const Poi = _.includes(['big_chest', 'boss'], name) ? MedialDungeonPoi : MinorPoi;
        return <Poi className={classNames(
            `${region_name}---${_.kebabCase(name)}`, {
              'big-chest': name === 'big_chest',
              'big-chest--open': name === 'big_chest' && location.marked,
              [`boss---${region_name}`]: name === 'boss'
          })}
          state={
            location.marked ? 'marked' :
            deviated ? 'possible' :
            (state = region_state(region, args)) &&
            derive_state(state, !location.can_access || location.can_access(args))
          }
          highlight={highlighted}
          onClick={() => props.onMark(region_name, name)}
          onMouseOver={() => props.onHighlight(true)}
          onMouseOut={() => props.onHighlight(false)} />;
    };

    DungeonMapLocation.source = (props) => props.model[props.region].locations[props.name];

    const DungeonMapDoorWithHighlight = WithHighlight(DungeonMapDoor);
    const DungeonMapLocationWithHighlight = WithHighlight(DungeonMapLocation);

    const StyledCaption = styled.div`
      width: 100%;
      position: absolute;
      bottom: 0;
      color: white;
      background-color: black;
      font-size: 16px;
      text-align: center;
    `;
    const CaptionIcon = styled.div`
      width: 16px;
      height: 16px;
      display: inline-block;
      vertical-align: text-bottom;
      background-size: 100%;
    `;

    const Caption = (props) => {
        const parts = /\{([\w-]+)\}|[^{]+/g;
        return <StyledCaption>
          {!props.text ? '\u00a0' :
            _.matchAll(props.text, parts).map(([text, icon]) =>
              !icon ? text :
              <CaptionIcon className={{
                  fightersword: 'sword--active-1',
                  mastersword: 'sword--active-2',
                  mitts: 'glove--active-2'
                }[icon] || icon
              } />
            )}
        </StyledCaption>;
    };

    const StyledMap = styled.div`
      width: 442px;
      height: 442px;
      position: relative;
    `;
    const MapGrid = styled.div`
      position: relative;
      display: grid;
      ${props => props.horizontal &&
      'grid-template-columns: 1fr 1fr;'}
      gap: 4px;
      & > ${StyledMap} { margin: 0 auto; }
    `;

    class OverworldMap extends React.Component {
        state = { caption: null }

        render() {
            const { model, mode, horizontal } = this.props;
            const { keysanity } = mode;
            const { onOverworldMark, onDungeon } = this.props;
            const change_caption = (caption) => this.setState({ caption: caption });

            const create_dungeons = _.rest((world, regions) =>
                _.map(_.pick(world, regions), (dungeon, region) =>
                    <DungeonLocationWithHighlight model={model} mode={mode} region={region} deviated={keysanity && dungeon.has_deviating_counts()}
                      onDungeon={onDungeon} change_caption={change_caption} />));
            const create_overworld = _.rest((world, regions) =>
                _.flatMap(_.pick(world, regions), (x, region) =>
                    (keysanity || region !== 'castle_tower') && _.map(x.locations, (x, name) =>
                        <OverworldLocationWithHighlight model={model} mode={mode} region={region} name={name}
                            onMark={onOverworldMark} change_caption={change_caption} />)));

            return <MapGrid horizontal={horizontal}>
              <StyledMap className="world---light">
                {create_overworld(model,
                  'lightworld_deathmountain_west',
                  'lightworld_deathmountain_east',
                  'lightworld_northwest',
                  'lightworld_northeast',
                  'lightworld_south',
                  'castle_escape',
                  'castle_tower')}
                <EncounterLocationWithHighlight model={model} mode={mode} region="castle_tower" change_caption={change_caption} />
                {create_dungeons(model, 'eastern', 'desert', 'hera')}
              </StyledMap>
              <StyledMap className="world---dark">
                {create_overworld(model,
                  'darkworld_deathmountain_west',
                  'darkworld_deathmountain_east',
                  'darkworld_northwest',
                  'darkworld_northeast',
                  'darkworld_south',
                  'darkworld_mire')}
                {create_dungeons(model, 'darkness', 'swamp', 'skull', 'thieves', 'ice', 'mire', 'turtle')}
              </StyledMap>
              <Caption text={this.state.caption} />
            </MapGrid>;
        }
    }

    const Close = styled.span`
      margin: 10px;
      position: absolute;
      top: 0;
      color: white;
      line-height: 1;
      font-size: 30px;
      font-weight: bold;
      cursor: pointer;
    `;

    class DungeonMap extends React.Component {
        state = { caption: null }

        render() {
            const { model, mode, dungeon: dungeon_name } = this.props;
            const dungeon = model[dungeon_name];
            const deviating = dungeon.has_deviating_counts();
            const { horizontal, onDoorMark, onLocationMark, onDismiss } = this.props;
            const change_caption = (caption) => this.setState({ caption: caption });

            const create_door = (x, name) =>
                <DungeonMapDoorWithHighlight
                  model={model} mode={mode} region={dungeon_name} name={name} deviated={deviating}
                  onMark={onDoorMark} change_caption={change_caption} />;
            const create_location = (x, name) =>
                <DungeonMapLocationWithHighlight
                  model={model} mode={mode} region={dungeon_name} name={name} deviated={deviating}
                  onMark={onLocationMark} change_caption={change_caption} />;

            return <MapGrid horizontal={horizontal}>
                <StyledMap className={`${dungeon_name}---first`}>
                  {_.map(_.pickBy(dungeon.doors, x => !x.second_map), create_door)}
                  {_.map(_.pickBy(dungeon.locations, x => !x.second_map), create_location)}
                </StyledMap>
                <StyledMap className={`${dungeon_name}---second`}>
                  {_.map(_.pickBy(dungeon.doors, x => x.second_map), create_door)}
                  {_.map(_.pickBy(dungeon.locations, x => x.second_map), create_location)}
                </StyledMap>
                <Close onClick={onDismiss}>{'\u00d7'}</Close>
                <Caption text={this.state.caption} />
            </MapGrid>;
        }
    }

    const StyledApp = styled.div`
      display: grid;
      ${props => props.horizontal &&
      `grid-template-columns: 1fr 1fr;`}
      gap: 4px;
      ${props => props.vertical && `
        height: 0px;
        transform: scale(.6, .6) translate(-33%, -33%);
      `}
    `;

    class App extends React.Component {
        constructor(props) {
            super(props);
            const { mode: mode_name } = props.query;
            const mode = {
                standard: mode_name === 'standard',
                open: mode_name === 'open' || mode_name === 'keysanity',
                keysanity: mode_name === 'keysanity',
                bomb_jump: !!props.query.ipbj,
                hammery_jump: !!props.query.podbj
            };
            this.state = {
                model: { ...item_model(), ...location_model(mode) },
                mode,
                dungeon_map: null
            };
        }

        render() {
            const query = this.props.query;
            const show_map = query.hmap || query.vmap;
            const { model, mode, dungeon_map } = this.state;

            return <StyledApp className={query.sprite}
              horizontal={query.hmap}
              vertical={query.vmap}
              style={query.bg && { 'background-color': query.bg }}>
              <Tracker
                horizontal={query.hmap}
                model={model}
                mode={mode}
                onToggle={this.toggle}
                onLevel={this.level}
                onCompletion={this.completion}
                onPrize={this.prize}
                onMedallion={this.medallion}
                onKey={this.key}
                onBigKey={this.big_key}
                onChest={this.chest} />
              {show_map && (!dungeon_map ?
              <OverworldMap
                horizontal={query.hmap}
                model={model}
                mode={mode}
                onOverworldMark={this.overworld_mark}
                onDungeon={mode.keysanity ? this.show_dungeon_map : _.noop} /> :
              <DungeonMap
                horizontal={query.hmap}
                model={model}
                mode={mode}
                dungeon={dungeon_map}
                onDismiss={this.dismiss_dungeon_map}
                onDoorMark={this.door_mark}
                onLocationMark={this.location_mark} />)}
            </StyledApp>;
        }

        show_dungeon_map = (dungeon) => {
            this.setState({ dungeon_map: dungeon });
        }

        dismiss_dungeon_map = () => {
            this.setState({ dungeon_map: null });
        }

        toggle = (name) => {
            const items = this.state.model.items;
            this.setState({ model: update(this.state.model, { items: update.toggle(name) }) });
        }

        level = (name) => {
            const items = this.state.model.items;
            this.setState({ model: update(this.state.model, { items: { [name]: { $set: items.inc(name) } } }) });
        }

        completion = (region, trait = { dungeon: false }) => {
            const keysanity = this.state.mode.keysanity && trait.dungeon;
            const _region = this.state.model[region];
            const completed = _region.completed;
            this.setState({ model: update(this.state.model, { [region]: {
                completed: { $set: !completed },
                locations: keysanity && { boss: { marked: { $set: !completed } } },
                chests: keysanity && !_region.has_deviating_counts() && (x => x - (!completed ? 1 : -1))
            } }) });
        }

        prize = (region) => {
            const prize_order = ['unknown', 'pendant-green', 'pendant', 'crystal', 'crystal-red'];
            const prize = this.state.model[region].prize;
            const index = prize_order.indexOf(prize);
            const modulo = prize_order.length;
            const value = prize_order[(index + 1) % modulo];
            this.setState({ model: update(this.state.model, { [region]: { prize: { $set: value } } }) });
        }

        medallion = (region) => {
            const medallion_order = ['unknown', 'bombos', 'ether', 'quake'];
            const medallion = this.state.model[region].medallion;
            const index = medallion_order.indexOf(medallion);
            const modulo = medallion_order.length;
            const value = medallion_order[(index + 1) % modulo];
            this.setState({ model: update(this.state.model, { [region]: { medallion: { $set: value } } }) });
        }

        big_key = (region) => {
            this.setState({ model: update(this.state.model, { [region]: update.toggle('big_key') }) });
        }

        key = (region) => {
            const { keys, key_limit } = this.state.model[region];
            const value = counter(keys, 1, key_limit);
            this.setState({ model: update(this.state.model, { [region]: { keys: { $set: value } } }) });
        }

        chest = (region) => {
            const { chests, chest_limit } = this.state.model[region];
            const value = counter(chests, -1, chest_limit);
            this.setState({ model: update(this.state.model, { [region]: { chests: { $set: value } } }) });
        }

        overworld_mark = (region, name) => {
            this.setState({ model: update(this.state.model, { [region]: { locations: { [name]: update.toggle('marked') } } }) });
        }

        door_mark = (region, name) => {
            this.setState({ model: update(this.state.model, { [region]: { doors: { [name]: update.toggle('opened') } } }) });
        }

        location_mark = (region, name) => {
            const dungeon = this.state.model[region];
            const marked = dungeon.locations[name].marked;
            this.setState({ model: update(this.state.model, { [region]: {
                locations: { [name]: { marked: { $set: !marked } } },
                completed: name === 'boss' && { $set: !marked },
                chests: !dungeon.has_deviating_counts() && (x => x - (!marked ? 1 : -1))
            } }) });
        }
    }

    window.start = () => {
        ReactDOM.render(<App query={uri_query()} />, document.getElementById('app'));
    }
}(window));
