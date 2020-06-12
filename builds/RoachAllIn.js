const {createSystem, taskFunctions} = require('@node-sc2/core');
const {Alliance} = require('@node-sc2/core/constants/enums');
const {
  EXTRACTOR,
  SPAWNINGPOOL,
  OVERLORD,
  HATCHERY,
  QUEEN,
  ROACHWARREN,
  ROACH,
  LARVA,
  ROACHBURROWED,
} = require('@node-sc2/core/constants/unit-type');
const {BURROW} = require('@node-sc2/core/constants/upgrade');
const {BURROWDOWN_ROACH, BURROWUP_ROACH, TRAIN_ROACH} = require('@node-sc2/core/constants/ability');

const {build, upgrade, train} = taskFunctions;

const RoachAllIn = createSystem({
  name: 'RoachAllIn',
  type: 'build',
  defaultOptions: {
    state: {
      attackMode: false,
      allInMode: false,
    }
  },
  buildOrder: [
    [13, train(OVERLORD)],
    [16, build(HATCHERY)],
    [17, build(SPAWNINGPOOL)],
    [18, build(EXTRACTOR)],
    [19, train(QUEEN)],
    [19, train(QUEEN)],
    [20, build(ROACHWARREN)],
    [21, train(OVERLORD)],
    [22, build(EXTRACTOR)],
    [24, train(OVERLORD)],
    [27, train(ROACH)],
    [27, train(ROACH)],
    [27, train(ROACH)],
    [27, train(ROACH)],
    [28, train(OVERLORD)],
    [29, upgrade(BURROW)],
    [30, train(OVERLORD)],
    [30, train(ROACH)],
    [30, train(ROACH)],
    [30, train(ROACH)],
    [30, train(ROACH)],
    [31, train(OVERLORD)],
    [32, train(ROACH)],
    [33, train(ROACH)],
    [34, train(ROACH)],
    [35, train(ROACH)]
  ],

  async onUnitCreated({resources}, newUnit) {
    const {actions, map} = resources.get();
    if (newUnit.canInject()) {
      newUnit.inject();
    } else if(newUnit.isCombatUnit() && this.state.attackMode) {
      const [mainExp ,exp] = map.getExpansions(Alliance.ENEMY);
      actions.attackMove(newUnit, mainExp.townhallPosition, true);
      actions.attackMove(newUnit, exp.townhallPosition, true);
    }
  },

  async onUnitFinished({resources}, newBuilding) {
    const {actions, units} = resources.get();
    
    if(newBuilding.isTownhall()) {
      actions.train(QUEEN, newBuilding);
    } else if (newBuilding.unitType(SPAWNINGPOOL)) {
      const hatcheries = units.getById(HATCHERY);
      hatcheries.forEach(hatch => actions.train(QUEEN, hatch));
    }
  },

  async onUpgradeComplete({resources}, technology) {
    if (technology === BURROW) {
      this.setState({attackMode: true});
    }
  },

  async buildComplete() {
    this.setState({allInMode: true});
  },

  async onUnitDamaged({resources}, damagedUnit) {
    const {actions} = resources.get();
    if (damagedUnit.unitType === ROACH && damagedUnit.health < damagedUnit.healthMax/2) {
      actions.do(BURROWDOWN_ROACH, damagedUnit);
    }
  },

  async onStep({resources}) {
    const {units, map, actions} = resources.get();

    const roaches = units.getById(ROACHBURROWED).filter(roach => roach.health === roach.healthMax);
    if (roaches.length) {
      roaches.forEach(roach => actions.do(BURROWUP_ROACH, roach));
    }

    if (this.state.attackMode) {
      const combatUnits = units.getCombatUnits();
      const [mainExp ,exp] = map.getExpansions(Alliance.ENEMY);
      actions.attackMove(combatUnits, mainExp.townhallPosition, true);
      actions.attackMove(combatUnits, exp.townhallPosition, true);
    }

    if (this.state.allInMode) {
      const larvae = units.getById(LARVA);
      larvae.length && larvae.map(larva => {
        actions.do(TRAIN_ROACH, larva.tag);
      });
    }
  }

});

module.exports = RoachAllIn;