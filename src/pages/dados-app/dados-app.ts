import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-dados-app',
  templateUrl: 'dados-app.html',
})
export class DadosAppPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
  }

}
