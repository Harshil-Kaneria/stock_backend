require('@babel/register');

/* eslint-disable no-console */
const dotenv = require('dotenv');
const http = require('http');
const app = require('./app');

const serverMain = http.createServer(app);

// Setup an express server and define port to listen all incoming requests for this application
const setUpExpress = () => {
    dotenv.config({ path: '.env' });
    const port = process.env.APP_PORT || 8000;
    const server = serverMain.listen(port, () => {
        console.log(`App running on port ${port}...`);
    });
};
setUpExpress()
