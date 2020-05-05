import { AbsSlotCustel } from 'https://cdn.jsdelivr.net/gh/intuition-dev/mbToolBelt@v8.4.25/slotCustel/slotCustel/AbsSlotCustel.min.js';
class PgCustel extends AbsSlotCustel {
    constructor() {
        super();
        console.log('pgComp');
        this.setup(this.defTemplate);
        this.addScript('https://cdn.jsdelivr.net/npm/list.js@1.5.0/dist/list.min.js', function () {
            console.log('cons');
            defEventFlux.addListener('contact-data', PgCustel.onData);
        });
    }
    static onData(data) {
        console.log('onData');
        let options = {
            valueNames: ['cpu',
                'memUsed',
                'nicR',
                'nicT',
                'dateTime'],
            item: `<tr> 
          <td class="cpu"></td> 
          <td class="memUsed"></td> 
          <td class="nicR"></td> 
          <td class="nicT"></td>
          <td class="dateTime"></td>

       </tr>`
        };
        if (!(PgCustel.contactLst)) {
            let contactLstEl = document.getElementById('contactLst');
            PgCustel.contactLst = new List(contactLstEl, options, data);
        }
        else {
            PgCustel.contactLst.add(data);
        }
        console.log('listjs', data);
    }
}
customElements.define('pg-custel', PgCustel);
console.log('loaded');
