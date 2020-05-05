declare var defEventFlux


import { EventFlux } from 'https://cdn.jsdelivr.net/gh/intuition-dev/mbToolBelt@v8.4.14/eventFlux/EventFlux.min.js';
// req for rpc
import { HttpRPC } from 'https://cdn.jsdelivr.nethttps://cdn.jsdelivr.net/npm/http-rpc@2.4.24/webApp/httpRPC..min.js';

EventFlux.init()

export class BoxesVM {
    
    static rpc

    constructor() {
        console.log('cons');
        HttpRPC.regInst('vm', this)
        let THIZ = this;
        BoxesVM.rpc = new HttpRPC('http', 'localhost', 8888);
        this.getBoxes() // populate asap
        
        defEventFlux.register('boxes_get', function (arg?) {
            THIZ.getBoxes();
        })
        defEventFlux.register('boxes_get', function (arg) {
            THIZ.getBox(arg['box_id']);
        })

        console.log(BoxesVM.rpc.getItem('jwt'))
    } //

    getBoxes() {
        let args = {};
      
        console.log('fetch', args);
        BoxesVM.rpc.invoke('dash', 'getBoxes', args)
            .then(function (resp) {
                console.log('got data');
                defEventFlux.dispatch('boxes_data', resp[1])
            })
            .catch(function(err) {
                console.warn('goFetch err ', err);
        })
    } //()


    getBox(box_id) {
        let args:any = {};
        args.box_id = box_id
        console.log('fetch', args);
        BoxesVM.rpc.invoke('dash', 'getBoxData', args)
            .then(function (resp) {
                console.log('got data');
                defEventFlux.dispatch('box-data', resp[1])
            })
            .catch(function(err) {
                console.warn('goFetch err ', err);
        })
    } //()

   

} //class
new BoxesVM();
