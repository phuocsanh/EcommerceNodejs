const app = require("./src/app");
const {
  app: { port },
} = require("./src/configs/configConnect");
const PORT = port || 8080;

const server = app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});

// process.on("SIGINT", () => {
//   server.close(() => console.log("Server closed"));
// });
