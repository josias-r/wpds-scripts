"use-strict";

process.on("unhandledRejection", err => {
  throw err;
});

const args = process.argv.slice(2);

const scriptIndex = args.findIndex(
  x => x === "build" || x === "start" || x === "test"
);
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];

switch (script) {
  case "build":
  case "start":
  case "test": {
    require("./scripts/" + script);
    break;
  }
  default:
    console.log('Unknown script "' + script + '".');
    console.log("Perhaps you need to update wptb-scripts?");
    break;
}
