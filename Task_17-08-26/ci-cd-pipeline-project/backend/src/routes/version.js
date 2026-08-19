const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    version: process.env.APP_VERSION || 'local-dev',
    commit: process.env.GIT_SHA || 'unknown',
    builtAt: process.env.BUILD_TIME || 'unknown',
  });
});

module.exports = router;
