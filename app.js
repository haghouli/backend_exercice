const express = require('express');
const bodyParse = require('body-parser');
const authRouter = require('./src/routes/authRouter')
const profileRouter = require('./src/routes/profileRouter')

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(bodyParse.json());

app.use(authRouter);
app.use(profileRouter);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}.`);
})