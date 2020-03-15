clear

tsc

// error 431 : https://stackoverflow.com/questions/32763165/DEV=true node-js-http-get-url-length-limitation

DEV=true node agentg-srv.js

// nohup DEV=true node agentg-srv.js &


// node --max-http-header-size 65535 agentg-srv.js


// nohup node --max-http-header-size 65535 agentg-srv.js &