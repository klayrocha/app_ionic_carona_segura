import { GrupoPage } from './../grupo/grupo';
import { GrupoService } from './../../providers/grupo.service';
import { UsuarioService } from './../../providers/usuario.service';
import { CaronaPage } from './../carona/carona';
import { ListaUsuarioGrupoPage } from './../lista-usuario-grupo/lista-usuario-grupo';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, PopoverController, App, Loading, AlertController, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-popover-sem-adm',
  template: `
  <ion-list>
    <button ion-item (click)="TelaCarona()">Criar Carona</button>
    <button ion-item (click)="TelaListaUsuarioGrupo()">Usúarios do Grupo</button>
    <button ion-item (click)="SairGrupo()">Sair do Grupo</button>
  </ion-list>
`
})
export class PopoverSemAdmPage {

  iduser: number;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public popoverCtrl: PopoverController,
    public app: App,
    public alertCtrl: AlertController,
    public usuarioService: UsuarioService,
    public grupoService: GrupoService,
    public loadingCtrl: LoadingController,
  ) {
  }

  close() {
    this.viewCtrl.dismiss();
     }

  TelaListaUsuarioGrupo(): void {
    this.app.getRootNav().push(ListaUsuarioGrupoPage,this.navParams.data.idgrupo);
    this.viewCtrl.dismiss();
  }
  TelaCarona(): void {
    this.app.getRootNav().push(CaronaPage,this.navParams.data.idgrupo);
    this.viewCtrl.dismiss();
  }

  SairGrupo(): void {
    let loading: Loading = this.showLoading();
    this.iduser = this.usuarioService.currentUser.id
    this.grupoService.sairGrupo(this.navParams.data.idgrupo,this.iduser)
    .subscribe(() => {
    
         loading.dismiss();
         this.app.getRootNav().push(GrupoPage);
         this.viewCtrl.dismiss();
    }, error => {
        loading.dismiss();
        this.viewCtrl.dismiss();
        this.showAlert('Erro ao sair do Grupo!');
    });

  }

  public showLoading(): Loading {
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
