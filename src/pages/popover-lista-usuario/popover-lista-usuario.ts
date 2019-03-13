import { UsuarioAdm } from './../../model/usuarioAdm.model';
import { UsuarioAdmService } from './../../providers/usuarioAdm.service';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Loading, PopoverController, App, LoadingController, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-popover-lista-usuario',
  template: `
  <ion-list>
    <ion-item>
      <button ion-item (click)="UserAdm()">Tornar Adm</button>
    </ion-item>
    <ion-item>
      <button ion-item (click)="ExcluirUser()">Excluir</button>
    </ion-item>
  </ion-list>
`
})
export class PopoverListaUsuarioPage {
  idgrupo: number
  iduser: number

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public popoverCtrl: PopoverController,
    public app: App,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public usuarioadmservice: UsuarioAdmService
  ) {
  }

  UserAdm(): void {
    this.idgrupo = this.navParams.get('idgrupo');
    this.iduser = this.navParams.get('iduser');
    let loading: Loading = this.showLoading();
    this.usuarioadmservice.create(this.idgrupo, this.iduser)
      .subscribe((usuarioAdm: UsuarioAdm) => {
        loading.dismiss();
        this.viewCtrl.dismiss();
      }, error => {
        loading.dismiss();
        this.showAlert('Erro ao incluir adm!');
      });
  }

  ExcluirUser(): void {
    this.idgrupo = this.navParams.get('idgrupo');
    this.iduser = this.navParams.get('iduser');
    let loading: Loading = this.showLoading();
    this.usuarioadmservice.excluir(this.idgrupo, this.iduser)
      .subscribe(() => {
        loading.dismiss();
        this.viewCtrl.dismiss();
      }, error => {
        loading.dismiss();
        this.showAlert('Erro ao Excluir usuario!');
      });
  }

  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Por favor aguarde ...'
    });
    loading.present();
    return loading;
  }

  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['OK']
    }).present();
  }

}
