const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ok: true});
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

module.exports = {app}
 