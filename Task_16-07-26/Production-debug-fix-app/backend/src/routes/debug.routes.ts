import { Router } from "express";

import { blockEventLoop } from "../bugs/eventLoop";
import { withdraw, getBalance } from "../bugs/raceCondition";

import { preventMemoryLeak } from "../fixes/memoryFix";
import { calculateInWorker } from "../fixes/eventLoopFix";
import { withdrawSafe, getBalanceSafe } from "../fixes/raceFix";
import { createMemoryLeak } from "../bugs/memoryLeak";


const router = Router();


// =======================
// BUG ROUTES
// =======================


// Memory leak simulation
router.get(
  "/bug/memory",
  (_, res) => {

    createMemoryLeak();

    res.json({
      message: "Memory leak started"
    });

  }
);


// Event loop blocking simulation
router.get(
  "/bug/cpu",
  (_, res) => {

    const result = blockEventLoop();

    res.json({
      result
    });

  }
);


// Race condition simulation
router.post(
  "/bug/withdraw/:amount",
  async (req, res) => {

    const amount = Number(
      req.params.amount
    );


    const result = await withdraw(amount);


    res.json({
      balance: result
    });

  }
);


router.get(
  "/bug/balance",
  (_, res) => {

    res.json({
      balance: getBalance()
    });

  }
);



// =======================
// FIXED ROUTES
// =======================


// Memory leak fixed
router.get(
  "/fix/memory",
  (_, res) => {

    const size = preventMemoryLeak();

res.json({
  message:"Memory leak fixed version running",
  cacheSize:size
});
  }
);



// Event loop fixed
router.get(
  "/fix/cpu",
  async (_, res) => {


    const result =
      await calculateInWorker();


    res.json({
      result
    });


  }
);



// Race condition fixed
router.post(
  "/fix/withdraw/:amount",
  async (req, res) => {


    const amount =
      Number(req.params.amount);


    const result =
      await withdrawSafe(amount);


    res.json({
      balance: result
    });


  }
);

router.get(
  "/fix/balance",
  (_, res) => {

    res.json({
      balance: getBalanceSafe()
    });

  }
);

export default router;