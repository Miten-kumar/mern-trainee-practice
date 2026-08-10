const app = require('./app');

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log('Note: this only handles the HTTP api. Run "npm run worker" separately to actually process jobs.');
});
