const express = require('express');
const photos = require('../data/photos');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ images: photos });
});

router.get('/:id', (req, res) => {
  const image = photos.find((p) => p.id === Number(req.params.id));
  if (!image) {
    return res.status(404).json({ message: 'Image not found' });
  }
  res.json({ image });
});

module.exports = router;
