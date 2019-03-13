import { CaronaService } from './../../providers/carona.Service';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Localidade } from './../../model/localidade.model';
import { LocalidadeService } from './../../providers/localidade.service';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading, AlertController, LoadingController, App, ViewController, PopoverController } from 'ionic-angular';


@Component({
  selector: 'page-popover-localidade',
  template: `
  <form [formGroup]="localidadeForm">
    <ion-item>
      <ion-label>Localidade</ion-label>
      <ion-icon name="checkmark" item-end color="primary" (click)="criarLocalidade()"></ion-icon>
    </ion-item>
    <ion-item>
      <ion-input type="text" placeholder="Nome" formControlName="nome"></ion-input>
    </ion-item>
  </form>  
`
})
export class PopoverLocalidadePage{
  localidadeForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public localiadeService: LocalidadeService,
    public formBuilder: FormBuilder,
    public app: App,
    public viewCtrl: ViewController,
    public caronaService: CaronaService,
    public popoverCtrl: PopoverController,
  ) {
    this.localidadeForm = this.formBuilder.group({
      nome: ['',],
    });
  }

  criarLocalidade() {
    if(this.localidadeForm.get('nome').value == null ||  this.localidadeForm.get('nome').value == ""){
      this.showAlert('Localidade Obrigatório');
    } else {

      this.localiadeService.currentGrupo = this.navParams.get('idgrupo');
      let loading: Loading = this.showLoading();
      this.localiadeService.create(this.localidadeForm.value)
      .subscribe((localidade: Localidade) => {
           loading.dismiss();
           this.viewCtrl.dismiss();
  
      }, error => {
          loading.dismiss();
          this.showAlert('Erro no cadastro da Localidade!');
      });
    }
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
