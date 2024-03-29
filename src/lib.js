import { ESCAPE_SEQUENCE } from "./constants.js";

export async function readOne() {
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

export async function readLine() {
  return new Promise((resolve) => {
    process.stdin.setEncoding("utf8");
    process.stdin.setRawMode(false);

    const onData = async (data) => {
      process.stdin.removeListener("data", onData);
      resolve(data);
    };
    process.stdin.on("data", onData);
  });
}

export async function clearView() {
  process.stdout.write(ESCAPE_SEQUENCE.CLEAR_TERM);
}

export async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function showStatus(regel) {
  process.stdout.write("Huidig object:\n");
  process.stdout.write(JSON.stringify(regel, null, 2));
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
