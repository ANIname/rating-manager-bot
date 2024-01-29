const {
  BOT_1,
  BOT_2,
  BOT_3,
  BOT_4,
  BOT_5,
  BOT_6,
  BOT_7,
  BOT_8,
  BOT_9,
  BOT_10,
  BOT_11,
  BOT_12,
  BOT_13,
  BOT_14,
  BOT_15,
  BOT_16,
  BOT_17,
  BOT_18,
  BOT_19,
  BOT_20,
  BOT_21,
  BOT_22,
  BOT_23,
  BOT_24,
  BOT_25,


  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE
} = process.env

module.exports = {
  apps: [{
    name: 'main-discord-bot',
    script: 'dist/src/index.js',
    restart_delay: 1000 * 60 * 1, // Every 1 minutes
    env: {
      BOT_1,
      BOT_2,
      BOT_3,
      BOT_4,
      BOT_5,
      BOT_6,
      BOT_7,
      BOT_8,
      BOT_9,
      BOT_10,
      BOT_11,
      BOT_12,
      BOT_13,
      BOT_14,
      BOT_15,
      BOT_16,
      BOT_17,
      BOT_18,
      BOT_19,
      BOT_20,
      BOT_21,
      BOT_22,
      BOT_23,
      BOT_24,
      BOT_25,
      
      POSTGRES_HOST,
      POSTGRES_USER,
      POSTGRES_PASSWORD,
      POSTGRES_DATABASE
    }
  }]
}