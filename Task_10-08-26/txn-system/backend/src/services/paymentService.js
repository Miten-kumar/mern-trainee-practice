const { PaymentDeclinedError } = require('../errors');

// Simulates network latency + gateway processing time you'd see calling
// something like Stripe/Razorpay in real life.
function gatewayLatency() {
  return 120 + Math.random() * 280;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simulated authorization call to an external payment processor.
 * Deliberately fails a slice of transactions so the rollback path is exercised:
 *  - amounts ending in .13 always decline (deterministic, easy to demo)
 *  - otherwise a ~8% random decline rate mimics real-world card failures
 */
async function authorize({ amountCents, customerEmail }) {
  await sleep(gatewayLatency());

  const endsInThirteen = amountCents % 100 === 13;
  const randomDecline = Math.random() < 0.08;

  if (endsInThirteen || randomDecline) {
    const reason = endsInThirteen ? 'simulated_hard_decline' : 'issuer_declined';
    throw new PaymentDeclinedError(reason);
  }

  return {
    providerRef: `ch_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
    status: 'succeeded'
  };
}

module.exports = { authorize };
