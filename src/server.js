const app = require("./app");
// Init environment
require('dotenv').config();
const port = Number(process.env.PORT || 3331);
// starting the server
app.listen(port, () => console.log(`🚀 Server running on port ${port}!`));