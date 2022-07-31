const app = require("./app");
// Init environment
require('dotenv').config();
const port = Number(process.env.PORT || 3000);
const homeurl = process.env.HOME_URL;
// starting the server
app.listen(port, (req, res) => console.log(`🚀 Server running on port ${port} ${homeurl}`));