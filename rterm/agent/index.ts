
var os = require('os');
var pty = require('node-pty'); 

const WebSocket = require('ws')

const ws = new WebSocket.Server({ port: 8080 })

ws.on('connection', function connection(soc) {
  
   soc.on('message', function incoming(message) {
    console.log('received: %s', message)
  })

  soc.send('something')
})

console.log('running')


var shell = 'bash'


var ptyProcess = pty.spawn(shell, [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env
})

ptyProcess.on('data', function(data) {
  process.stdout.write(data);
});
 
ptyProcess.write('ls\r');
ptyProcess.resize(100, 40);
ptyProcess.write('ls\r');
