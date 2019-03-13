import { UsuarioService } from './../../providers/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-troca-senha',
  templateUrl: 'troca-senha.html',
})
export class TrocaSenhaPage {

  alteraSenhaForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public usuarioService: UsuarioService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
  ) {

    this.alteraSenhaForm = this.formBuilder.group({
      senhaAtual:          ['', Validators.required],
      novaSenha:           ['', Validators.required],
      senhaConfirma:       ['', Validators.required],
     
    });
  }

  trocaSenha():void{
    
    if(this.alteraSenhaForm.get('novaSenha').value !=   this.alteraSenhaForm.get('senhaConfirma').value){
      this.showAlert('A senha nova e a confirmação de senha são diferentes!');
    } else {
    let loading: Loading = this.showLoading();

    let userid = this.usuarioService.currentUser.id

    this.usuarioService.alteraSenha(this.alteraSenhaForm.value, userid)
    .subscribe((ret: String) => {
      
         loading.dismiss();
         this.showAlert('Senha Alterada com sucesso');
         
    }, error => {
        loading.dismiss();
        this.showAlert('Erro ao Solicitar Senha!'+error);
    });
  }
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
