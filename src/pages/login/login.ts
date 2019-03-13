import { SolicitaSenhaPage } from './../solicita-senha/solicita-senha';
import { MyApp } from './../../app/app.component';
import { GrupoPage } from './../grupo/grupo';
import { Usuario } from './../../model/usuario.model';
import { UsuarioService } from './../../providers/usuario.service';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { CadastrePage } from './../cadastre/cadastre';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
 
  loginForm: FormGroup;

  constructor(
      public alertCtrl: AlertController,
      public loadingCtrl: LoadingController,
      public usuarioService: UsuarioService,
      public navCtrl: NavController, 
      public formBuilder: FormBuilder,
      public navParams: NavParams,
      public componetApp: MyApp
      ) {

      let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

      this.loginForm = this.formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
        senha: ['',[Validators.required, Validators.minLength(6)]]
      });
       if(!this.usuarioService.currentUser) {
            let usuarioBanco: Promise<Usuario> = this.usuarioService.getUsuarioBanco();
             usuarioBanco.then((usuario: Usuario) => {
              if(usuario != null){
                this.usuarioService.currentUser = new Usuario(0,'','',0,'','');
                this.usuarioService.currentUser.id = usuario.id;
                this.usuarioService.currentUser.nome = usuario.nome;
                this.usuarioService.currentUser.email = usuario.email;
                this.usuarioService.currentUser.telefone = usuario.telefone;
                this.usuarioService.currentUser.senha = usuario.senha;
                this.usuarioService.currentUser.foto = usuario.foto;
                this.componetApp.fotoMenu = this.usuarioService.currentUser.foto;
                this.componetApp.loginForm.get('nomeLogin').setValue(this.usuarioService.currentUser.nome);
                if(this.usuarioService.currentUser) {
                    this.navCtrl.setRoot(GrupoPage);
                }
              }
            }) 
            .catch((error: Error) => {
              this.showAlert('Erro ao buscar o usuairo : '+error);
              this.usuarioService.currentUser = null;
            });
      } 
  }

  ionViewCanEnter(): boolean {
    return true;
  }

  criarConta():void {
    this.navCtrl.push(CadastrePage);
  }

  onSubmit():void {

    let loading: Loading = this.showLoading();

    this.usuarioService.login(this.loginForm.value)
      .subscribe((usuario: Usuario) => {
           this.usuarioService.currentUser = new Usuario(0,'','',0,'','');
           this.usuarioService.currentUser.id = usuario.id;
           this.usuarioService.currentUser.nome = usuario.nome;
           this.usuarioService.currentUser.email = usuario.email;
           this.usuarioService.currentUser.telefone = usuario.telefone;
           this.usuarioService.currentUser.senha = usuario.senha;
           this.usuarioService.currentUser.foto = usuario.foto;
           this.componetApp.fotoMenu = this.usuarioService.currentUser.foto;
           this.componetApp.loginForm.get('nomeLogin').setValue(this.usuarioService.currentUser.nome);

           loading.dismiss();

           let usuarioSalvoBanco: Promise<Usuario> = this.usuarioService.salvaUsuarioBanco(usuario);
           usuarioSalvoBanco.then((usuario: Usuario) => {
          })
          .catch((error: Error) => {
            this.showAlert('Erro ao buscar o usuairo'+error);
            this.usuarioService.currentUser = null;
          });  
          this.navCtrl.setRoot(GrupoPage);
      }, error => {
          loading.dismiss();
          this.showAlert('Email ou senha inválidos !');
      });
  }

  esqueceuSenha():void  {
    this.navCtrl.push(SolicitaSenhaPage);
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
