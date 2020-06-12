const {createSystem} = require('@node-sc2/core');
const {LARVA} = require('@node-sc2/core/constants/unit-type');
const {TRAIN_OVERLORD} = require('@node-sc2/core/constants/ability');

const OverlordsMaker = createSystem({
  name: 'OverlordMaker',
  async onUnitCreated({resources}, newUnit) {
    if (newUnit.unitType === LARVA) {
      const {actions, frame} = resources.get();
      const {playerCommon} = frame._observation;
      const {minirals, foodCap, foodUsed} = playerCommon;
      const freeSupply = foodCap - foodUsed;
      if (freeSupply <= 5 && minirals >= 100) {
        console.log('train over');
        return actions.do(TRAIN_OVERLORD, newUnit.tag);
      }
    }
  }
});

module.exports = OverlordsMaker;