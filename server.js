require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const usrRoute = require('./route/usr.route');
const actRoute = require('./route/act.route');
const mntrgRoute = require('./route/mntrg.route');
const stgRoute = require('./route/stg.route');
const dvcRoute = require('./route/dvc.route');
const authRoute = require('./route/auth.route');

// Config
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("database is connectedd"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

//middleware
app.use(express.json());
app.use('/api/user', usrRoute)
app.use('/api/actuator', actRoute)
app.use('/api/monitoring', mntrgRoute)
app.use('/api/setting',stgRoute)
app.use('/api/device',dvcRoute)
app.use('/api/auth',authRoute)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`app is running on port:${PORT}`);
});
