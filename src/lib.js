async function navigate() {
  for (let i = 0; i < 2; i++) {
    await sleep(2000);
    console.log("navigating...");
  }

  return 2;
}


async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const stateLibrary = [
  {
    id: 1,
    handler: navigate
  }
];

function nextHandler(id) {
  for (let i = 0; i < stateLibrary.length; i++) {
    if (stateLibrary[i].id === id) {
      return stateLibrary[i];
    }
  }

  console.error("geen state met id:", id);
  process.exit(22);
}

module.exports = {
  sleep: sleep,
  nextHandler: nextHandler
};
