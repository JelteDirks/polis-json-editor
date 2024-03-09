async function readOne() {
  return new Promise((resolve) => {
    process.stdin.setEncoding("utf8");
    process.stdin.setRawMode(true);
    const onData = async (data) => {
      if (data === '\u0003') {
        process.exit();
      }
      process.stdin.removeListener("data", onData);
      process.stdin.setRawMode(false);
      resolve(data);
    };

    process.stdin.on("data", onData);
  });
}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  sleep: sleep,
  readOne: readOne
};
