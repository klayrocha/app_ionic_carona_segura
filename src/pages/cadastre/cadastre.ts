import { LoginPage } from './../login/login';
import { MyApp } from './../../app/app.component';
import { GrupoPage } from './../grupo/grupo';
import { File } from '@ionic-native/file';
import { Usuario } from './../../model/usuario.model';
import { UsuarioService } from './../../providers/usuario.service';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators} from "@angular/forms";


@Component({
  selector: 'page-cadastre',
  templateUrl: 'cadastre.html',

})
export class CadastrePage extends LoginPage {

  cadastreForm: FormGroup;
  public formatoTel: String;
  public formatoTel2: String;
  public formatoTel3: String;
  public foto: string;
  public fileFoto: File;
  

  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public usuarioService: UsuarioService,
    public navCtrl: NavController, 
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public componetApp: MyApp
    ) {
      super(alertCtrl,loadingCtrl,
            usuarioService,navCtrl,formBuilder,navParams,componetApp);

      let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
  
      this.cadastreForm = this.formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
        senha: ['',[Validators.required, Validators.minLength(6)]],
        nome: ['',[Validators.required, Validators.minLength(1)]],
        telefone: ['',[Validators.required, Validators.minLength(10)]],
        foto: ['',[]]
      });
  }

  onSubmit(): void {

      let loading: Loading = this.showLoading();
      let formatoTel = this.cadastreForm.get('telefone').value.replace('(','');
      let formatoTel2 = formatoTel.replace(')','');
      let formatoTel3 = formatoTel2.replace('-','');
      let formatoTel4 = formatoTel3.replace(' ','');
      this.cadastreForm.get('telefone').setValue(formatoTel4);
      this.cadastreForm.get('foto').setValue(this.foto);

      this.usuarioService.create(this.cadastreForm.value)
      .subscribe((usuario: Usuario) => {
           this.usuarioService.currentUser = new Usuario(0,'','',0,'','');
           this.usuarioService.currentUser.id = usuario.id;
           this.usuarioService.currentUser.nome = usuario.nome;
           this.usuarioService.currentUser.email = usuario.email;
           this.usuarioService.currentUser.telefone = usuario.telefone;
           this.usuarioService.currentUser.senha = usuario.senha;
           this.usuarioService.currentUser.foto = usuario.foto;

           loading.dismiss();

           this.componetApp.fotoMenu = usuario.foto;

           this.componetApp.loginForm.get('nomeLogin').setValue(usuario.nome);
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
          this.showAlert('Erro no cadastro. Email ou telefone já cadastrado !'+error);
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

  onPhoto(event): void{
     this.fileFoto = event.target.files[0];
    if(this.fileFoto){
      if(event.target.files[0].size > 1000000){
        this.showAlert('Tamanho máximo da imagem é de 1 MB !');
    } else {
          var reader = new FileReader();
          reader.onloadend = (e: Event) => {
              this.foto = reader.result;
          }
      reader.readAsDataURL(event.target.files[0]);
    }
    }
    
  }
  
}
