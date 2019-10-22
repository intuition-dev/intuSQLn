
var pty = require('node-pty') // pipped terminal

const WebSocket = require('ws')

export class PShell {

   allowedIP

   shell

   ws // ws

   constructor(port:number, allowedIP? ) {
      this.allowedIP = allowedIP

      this.ws = new WebSocket.Server({ port: port })
      this.ws.on('connection', this.onCon)
   }


   onCon(soc, req) {
      // check auth/sec first
      const ip = req.connection.remoteAddress;


      // after auth/sec continue
      var shell = 'bash'
      this.shell = pty.spwan(shell,[], {
         name: 'xterm-color',
         cols: 80,
         rows: 30,
         cwd: process.env.HOME,
         env: process.env 
      })
   
      soc.on('message', (msg)=>{
         this.shell.write(msg)
      })

      this.shell.on('data', (data)=>{
         soc.send(data)
      })

   }//()

}

