import { Worker } from "node:worker_threads";
import path from "node:path";


export function calculateInWorker(): Promise<number> {

  return new Promise((resolve, reject) => {


    const worker = new Worker(
      path.join(
        process.cwd(),
        "src/workers/cpu.worker.ts"
      )
    );


    worker.on(
      "message",
      (result) => {
        resolve(result);
        worker.terminate();
      }
    );


    worker.on(
      "error",
      reject
    );

  });
}