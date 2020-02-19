clear

tsc

// error 431 : https://stackoverflow.com/questions/32763165/node-js-http-get-url-length-limitation

node --max-http-header-size 65535 agentg-srv.js

// nohup node --max-http-header-size 65535 agentg-srv.js &