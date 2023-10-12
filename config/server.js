const cronTasks = require("./cron-tasks")

module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  cron: {
    enabled: true,
    tasks: cronTasks,
  },
  // url: " https://0fa0-113-203-241-37.ngrok-free.app",
  url: "https://api.everlybeauty.ca",

  app: {
    keys: env.array("APP_KEYS"),
  },
  webhooks: {
    populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
  },
});
