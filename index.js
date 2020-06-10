const {createAgent, createSystem, createEngine, createPlayer, taskFunctions} = require('@node-sc2/core');
const {Difficulty, PlayerType, Race} = require('@node-sc2/core/constants/enums');
const {OVERLORD} = require('@node-sc2/core/constants/unit-type');

const RoachAllIn = require('./builds/RoachAllIn');
const Mining = require('./helpers/Mining');
const Combat = require('./helpers/Combat');

function createBot() {
  const bot = createAgent({
    settings: {
      type: PlayerType.PARTICIPANT,
      race: Race.ZERG,
    },
    async onGameStart({resources}) {
      const {units, actions, map} = resources.get();
      const closeExp = map.getExpansions()[1];
      const overlord = units.getById(OVERLORD);
      return actions.move(overlord, closeExp.townhallPosition);
    }
  });

  bot.use(RoachAllIn);
  bot.use(Mining);
  bot.use(Combat);

  return bot;
}

const bot = createBot();
const engine = createEngine();
engine.connect().then(() => {
  engine.runGame('Zen LE', [
    createPlayer(bot.settings, bot),
    createPlayer({race: Race.RANDOM, difficulty: Difficulty.MEDIUMHARD}),
  ])
});