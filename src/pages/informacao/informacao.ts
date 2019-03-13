import { FaleConoscoPage } from './../fale-conosco/fale-conosco';
import { DadosAppPage } from './../dados-app/dados-app';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-informacao',
  templateUrl: 'informacao.html',
})
export class InformacaoPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    ) {
  }

  dadosApp(){
      this.navCtrl.push(DadosAppPage);
  }

  faleConosco(){
    this.navCtrl.push(FaleConoscoPage);
  }

}
