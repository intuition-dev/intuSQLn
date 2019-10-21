var os = require('os');
var pty = require('node-pty');
var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
var ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
});
const so = require('socket.io')();
so.on('connection', client => {
    client.emit('welcome', { message: 'welcome', id: client.id });
    client.on('cx', console.log);
    console.log(client.id);
});
function sendTime() {
    so.emit('time', { time: new Date().toJSON() });
}
setInterval(sendTime, 1000);
so.listen(3000);
