import { UsuarioService } from './../../providers/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-solicita-senha',
  templateUrl: 'solicita-senha.html',
})
export class SolicitaSenhaPage {

  senhaForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public usuarioService: UsuarioService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
  ) {
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.senhaForm = this.formBuilder.group({
      email:         ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])]
     
    });
  }

  enviarEmail():void{
    
    let loading: Loading = this.showLoading();

    this.usuarioService.enviaSenha(this.senhaForm.value)
    .subscribe((ret: String) => {

         loading.dismiss();
         this.showAlert('Em instantes você recebera um email com a senha nova.');
         this.navCtrl.pop();
    }, error => {
        loading.dismiss();
        this.showAlert('Erro ao Solicitar Senha!'+error);
    });
  }

  public showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Por favor aguarde ...'
    });
    loading.present();
    return loading;
  }

  public showAlert(message: string): void {
    this.alertCtrl.create({
    message: message,
      buttons: ['OK']
    }).present();
  }

}
