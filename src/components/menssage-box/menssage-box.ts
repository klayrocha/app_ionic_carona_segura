import { Message } from './../../model/message.model';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'menssage-box',
  templateUrl: 'menssage-box.html',
  host: {
    '[style.justify-content]':'((!isFromSender) ? "flex-start" : "flex-end")',
    '[style.text-align]': '((!isFromSender) ? "left" : "right")'
  }
})
export class MenssageBoxComponent {

  @Input() mensage: Message[];
  @Input() isFromSender: boolean;

  constructor() {
 
  }

}
