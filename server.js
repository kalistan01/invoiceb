const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({
    origin: "*"
}))
app.use(express.json()); // parse json bodies in the request object
app.use("/user", require("./routes/login"));
app.use("/routes", require("./routes/route"));
app.use("/shops", require("./routes/shop"));
app.use("/invoice", require("./routes/invoice"));
app.use("/bill", require("./routes/bill"));
app.use("/dashboard", require("./routes/dashboard"));


// Listen on pc port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

