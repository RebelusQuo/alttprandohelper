(function(window) {
    'use strict';

    const styled = window.styled.default;
    const css = window.styled.css;

    const ModelContext = React.createContext();

    const Slot = styled.div`
      width: 64px;
      height: 64px;
    `;
    const ActiveItem = styled(Slot)`
      filter: contrast(${props => props.active ? 100 : 80}%)
              brightness(${props => props.active ? 100 : 30}%);
    `;

    const Item = (props) =>
      <ModelContext.Consumer>
        {model => <ActiveItem
          className={classNames(props.name, props.value && `${props.name}--active`)}
          active={props.value}
          onClick={() => model.toggle_item(props.name)} />}
      </ModelContext.Consumer>;

    const LeveledItem = (props) =>
      <ModelContext.Consumer>
        {model => <ActiveItem
          className={classNames(props.name, props.value && `${props.name}--active-${props.value}`)}
          active={props.value > 0}
          onClick={() => model.raise_item(props.name)}
          onContextMenu={(e) => { model.lower_item(props.name); e.preventDefault(); }} />}
      </ModelContext.Consumer>;

    const AgahnimCompletion = (props) =>
      <ModelContext.Consumer>
        {model => <ActiveItem
          className={classNames('agahnim', props.value && 'agahnim--active')}
          active={props.value}
          onClick={() => model.toggle_completion('castle_tower')} />}
      </ModelContext.Consumer>;

    const SubSlot = styled.div`
      width: 32px;
      height: 32px;
    `;
    const ActiveSubItem = styled(SubSlot)`
      filter: contrast(${props => props.active ? 100 : 80}%)
              brightness(${props => props.active ? 100 : 30}%);
    `;

    const BigKey = (props) =>
      <ModelContext.Consumer>
        {model =>
        <ActiveSubItem className="big-key"
          active={props.source.big_key}
          onClick={() => model.toggle_big_key(props.name)} />}
      </ModelContext.Consumer>;

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
      <ModelContext.Consumer>
        {model =>
        <StyledDungeon keysanity={props.keysanity}>
          <ActiveItem
            className={`boss boss---${props.name}`}
            active={props.dungeon.completed}
            onClick={() => model.toggle_completion(props.name)} />
          {props.medallion &&
          <SubSlot
            className={`medallion medallion--${props.dungeon.medallion}`}
            onClick={() => model.raise_medallion(props.name)}
            onContextMenu={(e) => { model.lower_medallion(props.name); e.preventDefault(); }} />}
          {props.keysanity &&
          <BigKey name={props.name} source={props.dungeon} />}
          <SubSlot
            className={`prize prize--${props.dungeon.prize}`}
            onClick={() => model.raise_prize(props.name)}
            onContextMenu={(e) => { model.lower_prize(props.name); e.preventDefault(); }} />
        </StyledDungeon>}
      </ModelContext.Consumer>;

    const Chests = (props) =>
      <ModelContext.Consumer>
        {model =>
        <Slot className={`chest-${props.source.chests}`}
          onClick={() => model.lower_chest(props.name)}
          onContextMenu={(e) => { model.raise_chest(props.name); e.preventDefault(); }} />}
      </ModelContext.Consumer>;

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
      <ModelContext.Consumer>
        {model =>
        <TextSubSlot className={classNames('chest', { 'chest--empty': !props.source.chests })}
          onClick={() => model.lower_chest(props.name)}
          onContextMenu={(e) => { model.raise_chest(props.name); e.preventDefault(); }}>
          <ChestText>{`${props.source.chests}`}</ChestText>
        </TextSubSlot>}
      </ModelContext.Consumer>;

    const Keys = (props) => {
        const { keys, key_limit } = props.source;
        return !key_limit ?
            <TextSubSlot className="key"><KeyText>{'\u2014'}</KeyText></TextSubSlot> :
            <ModelContext.Consumer>
              {model =>
              <TextSubSlot className="key"
                onClick={() => model.raise_key(props.name)}
                onContextMenu={(e) => { model.lower_key(props.name); e.preventDefault(); }}>
                <KeyText>{`${keys}/${key_limit}`}</KeyText>
              </TextSubSlot>}
            </ModelContext.Consumer>;
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
      return <ModelContext.Consumer>
        {model => <Sprite
          className={classNames(`tunic--active-${items.tunic}`, { 'tunic--bunny': !items.moonpearl })}
          keysanity={keysanity}
          onClick={(e) => e.target === e.currentTarget && model.raise_item('tunic')}
          onContextMenu={(e) => { e.target === e.currentTarget && model.lower_item('tunic'); e.preventDefault(); }}>
          <LeveledItem name="sword" value={items.sword} />
          <LeveledItem name="shield" value={items.shield} />
          <Item name="moonpearl" value={items.moonpearl} />
        </Sprite>}
      </ModelContext.Consumer>;
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
            const { keysanity, model_state: { items, ganon_tower, castle_escape, castle_tower } } = this.props;
            const portrait = <Portrait keysanity={keysanity} items={items} />
            const agahnim = <AgahnimCompletion value={castle_tower.completed} />;
            return <TrackerGrid>
              {keysanity ?
              <KeysanityPortrait>
                {portrait}
                <KeysanityChest name="ganon_tower" source={ganon_tower} onLevel={onChest} />
                <Keys name="ganon_tower" source={ganon_tower} />
                <BigKey name="ganon_tower" source={ganon_tower} />
              </KeysanityPortrait> :
              portrait}
              <TrackerItemGrid>
                <LeveledItem name="bow" value={items.bow} />
                <LeveledItem name="boomerang" value={items.boomerang} />
                <Item name="hookshot" value={items.hookshot} />
                <Item name="mushroom" value={items.mushroom} />
                <Item name="powder" value={items.powder} />
                <Item name="firerod" value={items.firerod} />
                <Item name="icerod" value={items.icerod} />
                <Item name="bombos" value={items.bombos} />
                <Item name="ether" value={items.ether} />
                <Item name="quake" value={items.quake} />
                <Item name="lamp" value={items.lamp} />
                <Item name="hammer" value={items.hammer} />
                <Item name="shovel" value={items.shovel} />
                <Item name="net" value={items.net} />
                <Item name="book" value={items.book} />
                <LeveledItem name="bottle" value={items.bottle} />
                <Item name="somaria" value={items.somaria} />
                <Item name="byrna" value={items.byrna} />
                <Item name="cape" value={items.cape} />
                <Item name="mirror" value={items.mirror} />
                <Item name="boots" value={items.boots} />
                <LeveledItem name="glove" value={items.glove} />
                <Item name="flippers" value={items.flippers} />
                <Item name="flute" value={items.flute} />
                {keysanity ?
                <KeysanityAgahnim>
                  {agahnim}
                  <Keys name="castle_tower" source={castle_tower} />
                  <Keys name="castle_escape" source={castle_escape} />
                </KeysanityAgahnim> :
                agahnim}
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
            const dungeon = this.props.model_state[name];
            const keysanity = this.props.keysanity;
            return <Dungeon name={name} dungeon={dungeon} keysanity={keysanity} {...medallion} />;
        }

        inner_dungeon(name) {
            const dungeon = this.props.model_state[name];
            const keysanity = this.props.keysanity;
            return keysanity ?
              <KeysanityDungeon>
                <Keys name={name} source={dungeon} />
                <KeysanityChest name={name} source={dungeon} />
              </KeysanityDungeon> :
              <Chests name={name} source={dungeon} />;
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
                const location = Wrapped.source(this.props);
                this.props.change_caption(highlighted ?
                    typeof location.caption === 'function' ? location.caption(this.props.model) : location.caption :
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
        const { model, region: region_name, name, highlighted } = props;
        const region = model.world[region_name];
        const location = region.locations[name];
        const args = { ...model, region };
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

    OverworldLocation.source = (props) => props.model.world[props.region].locations[props.name];

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
        const { model, region: region_name, highlighted } = props;
        const region = model.world[region_name];
        const name = _.kebabCase(region_name);
        const args = { ...model, region };
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

    EncounterLocation.source = (props) => props.model.world[props.region];

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
        const { model, region: region_name, deviated, highlighted } = props;
        const region = model.world[region_name];
        const name = _.kebabCase(region_name);
        const args = { ...model, region };
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

    DungeonLocation.source = (props) => props.model.world[props.region];

    const OverworldLocationWithHighlight = WithHighlight(OverworldLocation);
    const EncounterLocationWithHighlight = WithHighlight(EncounterLocation);
    const DungeonLocationWithHighlight = WithHighlight(DungeonLocation);

    const MedialDungeonPoi = styled(MedialPoi)`
      background-repeat: no-repeat;
      background-position: center;
      background-size: 24px;
    `;

    const DungeonMapDoor = (props) => {
        const { model, region: region_name, name, deviated, highlighted } = props;
        const region = model.world[region_name];
        const door = region.doors[name];
        const args = { ...model, region };
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

    DungeonMapDoor.source = (props) => props.model.world[props.region].doors[props.name];

    const DungeonMapLocation = function(props) {
        const { model, region: region_name, name, deviated, highlighted } = props;
        const region = model.world[region_name];
        const location = region.locations[name];
        const args = { ...model, region };
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

    DungeonMapLocation.source = (props) => props.model.world[props.region].locations[props.name];

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
            const { model, horizontal } = this.props;
            const { world, mode } = model;
            const { onOverworldMark, onDungeon } = this.props;
            const change_caption = (caption) => this.setState({ caption: caption });

            const create_dungeons = _.rest((world, regions) =>
                _.map(_.pick(world, regions), (dungeon, region) =>
                    <DungeonLocationWithHighlight model={model} region={region} deviated={mode.keysanity && dungeon.has_deviating_counts()}
                      onDungeon={onDungeon} change_caption={change_caption} />));
            const create_overworld = _.rest((world, regions) =>
                _.flatMap(_.pick(world, regions), (x, region) =>
                    (mode.keysanity || region !== 'castle_tower') && _.map(x.locations, (x, name) =>
                        <OverworldLocationWithHighlight model={model} region={region} name={name}
                            onMark={onOverworldMark} change_caption={change_caption} />)));

            return <MapGrid horizontal={horizontal}>
              <StyledMap className="world---light">
                {create_overworld(world,
                  'lightworld_deathmountain_west',
                  'lightworld_deathmountain_east',
                  'lightworld_northwest',
                  'lightworld_northeast',
                  'lightworld_south',
                  'castle_escape',
                  'castle_tower')}
                <EncounterLocationWithHighlight model={model} region="castle_tower" change_caption={change_caption} />
                {create_dungeons(world, 'eastern', 'desert', 'hera')}
              </StyledMap>
              <StyledMap className="world---dark">
                {create_overworld(world,
                  'darkworld_deathmountain_west',
                  'darkworld_deathmountain_east',
                  'darkworld_northwest',
                  'darkworld_northeast',
                  'darkworld_south',
                  'darkworld_mire')}
                {create_dungeons(world, 'darkness', 'swamp', 'skull', 'thieves', 'ice', 'mire', 'turtle')}
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
        static layouts = dungeon_layouts()

        state = { caption: null }

        render() {
            const { model, dungeon: dungeon_name } = this.props;
            const dungeon = model.world[dungeon_name];
            const deviating = dungeon.has_deviating_counts();
            const { horizontal, onDoorMark, onLocationMark, onDismiss } = this.props;
            const change_caption = (caption) => this.setState({ caption: caption });

            const create_door = (name) =>
                <DungeonMapDoorWithHighlight
                  model={model} region={dungeon_name} name={name} deviated={deviating}
                  onMark={onDoorMark} change_caption={change_caption} />;
            const create_location = (name) =>
                <DungeonMapLocationWithHighlight
                  model={model} region={dungeon_name} name={name} deviated={deviating}
                  onMark={onLocationMark} change_caption={change_caption} />;

            const { first, second } = DungeonMap.layouts[dungeon_name];
            const [first_locations, first_doors] = first;
            const [second_locations, second_doors] = second;
            return <MapGrid horizontal={horizontal}>
                <StyledMap className={`${dungeon_name}---first`}>
                  {first_doors && _.map(first_doors, create_door)}
                  {_.map(first_locations, create_location)}
                </StyledMap>
                <StyledMap className={`${dungeon_name}---second`}>
                  {second_doors && _.map(second_doors, create_door)}
                  {_.map(second_locations, create_location)}
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
            const mode_name = props.query.mode;
            const mode = {
                standard: mode_name === 'standard',
                open: mode_name === 'open' || mode_name === 'keysanity',
                keysanity: mode_name === 'keysanity',
                bomb_jump: !!props.query.ipbj,
                hammery_jump: !!props.query.podbj
            };
            this.state = {
                dungeon_map: null,
                keysanity: mode.keysanity,
                model: create_model(mode)
            };
        }

        render() {
            const query = this.props.query;
            const show_map = query.hmap || query.vmap;
            const { dungeon_map, keysanity, model } = this.state;
            const model_state = model.state();

            return <ModelContext.Provider value={this.state.model}>
              <StyledApp className={query.sprite}
                horizontal={query.hmap}
                vertical={query.vmap}
                style={query.bg && { 'background-color': query.bg }}>
                <Tracker
                  horizontal={query.hmap}
                  model_state={model_state}
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
                  model_state={model_state}
                  onDungeon={keysanity ? this.show_dungeon_map : _.noop} /> :
                <DungeonMap
                  horizontal={query.hmap}
                  model_state={model_state}
                  dungeon={dungeon_map}
                  onDismiss={this.dismiss_dungeon_map}
                  onDoorMark={this.door_mark}
                  onLocationMark={this.location_mark} />)}
              </StyledApp>
            </ModelContext.Provider>;
        }

        show_dungeon_map = (dungeon) => {
            this.setState({ dungeon_map: dungeon });
        }

        dismiss_dungeon_map = () => {
            this.setState({ dungeon_map: null });
        }

        toggle = (name) => {
            this.setState({ model: update(this.state.model, { items: update.toggle(name) }) });
        }

        level = ({ raise, lower }) => {
            const name = raise || lower;
            const delta = raise ? 1 : -1;
            const items = this.state.model.items;
            const limit = items.limit[name];
            const [max, min] = limit[0] ? limit : [limit, 0];
            const modulo = max-min+1;
            const value = (items[name]-min + modulo + delta) % modulo + min;
            this.setState({ model: update(this.state.model, { items: { [name]: { $set: value } } }) });
        }

        completion = (region_name, trait = { dungeon: false }) => {
            const { world, mode } = this.state.model;
            const keysanity = mode.keysanity && trait.dungeon;
            const region = world[region_name];
            const completed = region.completed;
            this.setState({ model: update(this.state.model, { 
                world: { [region_name]: {
                    completed: { $set: !completed },
                    locations: keysanity && { boss: { marked: { $set: !completed } } },
                    chests: keysanity && !region.has_deviating_counts() && (x => x - (!completed ? 1 : -1))
                } }
            }) });
        }

        prize = ({ raise, lower }) => {
            const region_name = raise || lower;
            const delta = raise ? 1 : -1;
            const prize_order = ['unknown', 'pendant-green', 'pendant', 'crystal', 'crystal-red'];
            const prize = this.state.model.world[region_name].prize;
            const index = prize_order.indexOf(prize);
            const modulo = prize_order.length;
            const value = prize_order[(index + modulo + delta) % modulo];
            this.setState({ model: update(this.state.model, { world: { [region_name]: { prize: { $set: value } } } }) });
        }

        medallion = ({ raise, lower }) => {
            const region_name = raise || lower;
            const delta = raise ? 1 : -1;
            const medallion_order = ['unknown', 'bombos', 'ether', 'quake'];
            const medallion = this.state.model.world[region_name].medallion;
            const index = medallion_order.indexOf(medallion);
            const modulo = medallion_order.length;
            const value = medallion_order[(index + modulo + delta) % modulo];
            this.setState({ model: update(this.state.model, { world: { [region_name]: { medallion: { $set: value } } } }) });
        }

        big_key = (region_name) => {
            this.setState({ model: update(this.state.model, { world: { [region_name]: update.toggle('big_key') } }) });
        }

        key = ({ raise, lower }) => {
            const region_name = raise || lower;
            const delta = raise ? 1 : -1;
            const { keys, key_limit } = this.state.model.world[region_name];
            const modulo = key_limit + 1;
            const value = (keys + modulo + delta) % modulo;
            this.setState({ model: update(this.state.model, { world: { [region_name]: { keys: { $set: value } } } }) });
        }

        chest = ({ raise, lower }) => {
            const region_name = raise || lower;
            const delta = raise ? 1 : -1;
            const { chests, chest_limit } = this.state.model.world[region_name];
            const modulo = chest_limit + 1;
            const value = (chests + modulo + delta) % modulo;
            this.setState({ model: update(this.state.model, { world: { [region_name]: { chests: { $set: value } } } }) });
        }

        overworld_mark = (region_name, name) => {
            this.setState({ model: update(this.state.model, { world: { [region_name]: { locations: { [name]: update.toggle('marked') } } } }) });
        }

        door_mark = (region_name, name) => {
            this.setState({ model: update(this.state.model, { world: { [region_name]: { doors: { [name]: update.toggle('opened') } } } }) });
        }

        location_mark = (region_name, name) => {
            const dungeon = this.state.model.world[region_name];
            const marked = dungeon.locations[name].marked;
            this.setState({ model: update(this.state.model, {
                world: { [region_name]: {
                    locations: { [name]: { marked: { $set: !marked } } },
                    completed: name === 'boss' && { $set: !marked },
                    chests: !dungeon.has_deviating_counts() && (x => x - (!marked ? 1 : -1))
                } }
            }) });
        }
    }

    window.start = () => {
        ReactDOM.render(<App query={uri_query()} />, document.getElementById('app'));
    }
}(window));
