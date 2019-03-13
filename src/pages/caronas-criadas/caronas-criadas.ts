import { UsuarioService } from './../../providers/usuario.service';
import { DetalheCaronaPage } from './../detalhe-carona/detalhe-carona';
import { Carona } from './../../model/carona.model';
import { CaronaService } from './../../providers/carona.Service';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-caronas-criadas',
  templateUrl: 'caronas-criadas.html',
})
export class CaronasCriadasPage {

  caronaLista: Carona[];
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public caronaService: CaronaService,
    public alertCtrl: AlertController,
    public usuarioService: UsuarioService,
  ) {
  }

  ionViewDidEnter(){
    this.lerCarona();
  }

  lerCarona() {
    let loading: Loading = this.showLoading();
        this.caronaService.listaCaronaUsuario(this.usuarioService.currentUser.id)
          .subscribe((caronaLista: Carona[]) => {
            this.caronaLista = caronaLista;    
            loading.dismiss();      
       }, error => {
        loading.dismiss();
           this.showAlert('Erro na lista de Caronas!');
       });
      }

      pushTela(id): void {
        this.navCtrl.push(DetalheCaronaPage,id);
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
