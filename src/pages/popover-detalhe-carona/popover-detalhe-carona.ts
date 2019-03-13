import { CaronaService } from './../../providers/carona.Service';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading, AlertController, LoadingController, App, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-popover-detalhe-carona',
  template: `
  <ion-list>
    <ion-item>
      <button ion-item (click)="alterarCarona()">Alterar Carona</button>
    </ion-item>
    <ion-item>
      <button ion-item (click)="excluirCarona()">Excluir Carona</button>
    </ion-item>
  </ion-list>
`

})
export class PopoverDetalheCaronaPage {

  idcarona: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public caronaService: CaronaService,
    public app: App,
    public viewCtrl: ViewController,
    ) {
      this.idcarona = this.navParams.data.caronaId;
  }


  excluirCarona(): void {
    let loading: Loading = this.showLoading();
    this.idcarona = this.idcarona
    this.caronaService.excluirCarona(this.idcarona)
    .subscribe(() => {
         loading.dismiss();
         this.viewCtrl.dismiss();
         this.app.getRootNav().pop();
         this.viewCtrl._didEnter();
    }, error => {
        loading.dismiss();
        this.viewCtrl.dismiss();
        this.showAlert('Erro ao Excluir Carona!');
    });
  }

  alterarCarona()  {
    let alterar = false;
    this.viewCtrl.dismiss(alterar);
  }

  showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Por favor aguarde ...'
    });
    loading.present();
    return loading;
  }

  showAlert(message: string): void {
    this.alertCtrl.create({
    message: message,
      buttons: ['OK']
    }).present();
  }

}
