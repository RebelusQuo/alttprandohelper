const with_cases = require('./spec_helper').with_cases;

const chai = require('chai');
const expect = chai.expect;
chai.should();

const create_model = require('../src/model');

const each_dungeon = [
    'eastern', 'desert', 'hera', 'darkness', 'swamp',
    'skull', 'thieves', 'ice', 'mire', 'turtle'
];

describe('Model', () => {

    let model;

    beforeEach(() => {
        model = create_model();
    });

    it('can toggle items', () => {
        model.state().items.hammer.should.be.false;
        model.toggle_item('hammer');
        model.state().items.hammer.should.be.true;
        model.toggle_item('hammer');
        model.state().items.hammer.should.be.false;
    });

    it('can level items', () => {
        model.state().items.should.include({ tunic: 1, bow: 0 });
        model.lower_item('tunic');
        model.lower_item('bow');
        model.state().items.should.include({ tunic: 3, bow: 3 });
        model.raise_item('tunic');
        model.raise_item('bow');
        model.state().items.should.include({ tunic: 1, bow: 0 });
    });

    with_cases(...each_dungeon,
    (dungeon) => it(`can level ${dungeon} chests`, () => {
        model.state().dungeons[dungeon].chests.should.be.above(0);
        model.raise_chest(dungeon);
        model.state().dungeons[dungeon].chests.should.equal(0);
        model.lower_chest(dungeon);
        model.state().dungeons[dungeon].chests.should.be.above(0);
    }));

});
