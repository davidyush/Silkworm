const {createSystem, taskFunctions} = require('@node-sc2/core');
const {Alliance} = require('@node-sc2/core/constants/enums');
const {SPAWNINGPOOL, ZERGLING, OVERLORD} = require('@node-sc2/core/constants/unit-type');
const {build, train} = taskFunctions;

const LingRush = createSystem({
  name: 'LingRush',
  type: 'build',
  buildOrder: [
    [11, build(SPAWNINGPOOL)],
    [13, train(OVERLORD)],
    [13, train(ZERGLING)],
    [13, train(ZERGLING)],
    [13, train(ZERGLING)],
    [13, train(ZERGLING)],
    [13, train(ZERGLING)],
    [13, train(ZERGLING)],
    [13, train(ZERGLING)],
    [13, train(ZERGLING)],
    [13, train(ZERGLING)],
    [13, train(ZERGLING)],
    [13, train(ZERGLING)],
    [13, train(ZERGLING)],
    [13, train(ZERGLING)],
    [13, train(ZERGLING)],
    [13, train(ZERGLING)],
    [22, train(OVERLORD)],
  ],

  async onStep({resources}) {
    const {units, actions, map} = resources.get();
    if (units.getCombatUnits().length > 1) {
      const allUnits = units.getAll();
      const expansions = map.getExpansions(Alliance.ENEMY);
      actions.attackMove(allUnits, expansions[0].townhallPosition, true);
      actions.attackMove(allUnits, expansions[1].townhallPosition, true);
    }
  },
});

module.exports = LingRush;