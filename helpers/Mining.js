const {createSystem} = require('@node-sc2/core');

const Mining = createSystem({
  name: 'Mining',

  async onUnitCreated({resources}, newUnit) {
    const {units, actions} = resources.get();
    if (newUnit.isWorker()) {
      const minerals = units.getMineralFields();
      const [target] = units.getClosest(newUnit.pos,  minerals, 1);
      actions.gather(newUnit, target);
    }
  },

  async onUnitIdle({ resources }, idleUnit) {
    if (idleUnit.isWorker()) {
      const {actions} = resources.get();
      actions.gather(idleUnit);
    }
  },

  async onUnitFinished({ resources }, newBuilding) {
    if (newBuilding.isGasMine()) {
      const {units, actions} = resources.get();
      const threeWorkers = units.getClosest(newBuilding.pos, units.getMineralWorkers(), 3);
      threeWorkers.forEach((worker) => worker.labels.set('gasWorker', true));
  
      actions.mine(threeWorkers, newBuilding);
    }
  }

});

module.exports = Mining;