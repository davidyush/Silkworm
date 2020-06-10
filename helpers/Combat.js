const {createSystem} = require('@node-sc2/core');

const Combat = createSystem({
  name: 'Combat',

  async onUnitCreated({ resources }, newUnit) {
    const {actions, map} = resources.get();
    if (newUnit.isCombatUnit()) {
      actions.attackMove(newUnit, map.getCombatRally());
    }
  },

});

module.exports = Combat;