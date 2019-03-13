import { CadastrePage } from './../cadastre/cadastre';
import { MyApp } from './../../app/app.component';
import { File } from '@ionic-native/file';
import { Usuario } from './../../model/usuario.model';
import { UsuarioService } from './../../providers/usuario.service';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Loading, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage extends CadastrePage{

  idusuario: number;
  usuarioForm: FormGroup;
  usuariodetalhe: Usuario;
  public foto: string;
  public fileFoto: File;
  public retornoFormatado: string;
  public formatoTelefone: string;
  public formatoTel: String;
  public formatoTel2: String;
  public formatoTel3: String;

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

      this.usuarioForm = this.formBuilder.group({
        nome:          ['', Validators.required],
        email:         ['', Validators.required],
        telefone:      ['', Validators.required],
        foto:          ['', ],
       
      });
      this.idusuario = this.usuarioService.currentUser.id;
  }

  ionViewDidLoad() {
    this.lerPerfil();
  }

  lerPerfil() {
    let loading: Loading = this.showLoading();
    this.usuarioService.detalheUsuario(this.idusuario)
      .subscribe((usuariodetalhe: Usuario) => {
        this.usuariodetalhe = new Usuario(0,'','',0,'','');
        this.usuariodetalhe.id = usuariodetalhe.id;
        this.usuariodetalhe.nome = usuariodetalhe.nome;
        this.usuariodetalhe.email = usuariodetalhe.email;
        this.usuariodetalhe.telefone = usuariodetalhe.telefone;
        this.usuariodetalhe.senha = usuariodetalhe.senha;
        this.usuariodetalhe.foto = usuariodetalhe.foto;

        this.usuarioForm.get('nome').setValue(usuariodetalhe.nome);
        this.usuarioForm.get('email').setValue(usuariodetalhe.email);
        this.formatoTelefone = usuariodetalhe.telefone.toString();
        this.retornoFormatado = '('+this.formatoTelefone.slice(0,2 )+')'+this.formatoTelefone.slice(2,7 )+'-'+this.formatoTelefone.slice(7,12 );
        this.usuarioForm.get('telefone').setValue(this.retornoFormatado);
        this.foto = usuariodetalhe.foto;
        this.usuarioForm.get('foto').setValue(this.foto);
        this.componetApp.fotoMenu = usuariodetalhe.foto;
        this.componetApp.loginForm.get('nomeLogin').setValue(usuariodetalhe.nome);
        loading.dismiss(); 
   }, error => {
        loading.dismiss();
       this.showAlert('Erro no Perfil! '+error);
   });
  }

  onSubmit() {
    let loading: Loading = this.showLoading();
          
          this.usuarioService.IdUser = this.idusuario;
          this.usuarioForm.get('foto').setValue(this.foto);

          let formatoTel = this.usuarioForm.get('telefone').value.replace('(','');
          let formatoTel2 = formatoTel.replace(')','');
          let formatoTel3 = formatoTel2.replace('-','');
          let formatoTel4 = formatoTel3.replace(' ','');

          this.usuarioForm.get('telefone').setValue(formatoTel4);

          this.usuarioService.alterarPerfil(this.usuarioForm.value)
          .subscribe((usuario: Usuario) => {

            let usuarioSalvoBanco: Promise<Usuario> = this.usuarioService.alterarUsuarioBanco(usuario);
            usuarioSalvoBanco.then((usuario: Usuario) => {
           })
           .catch((error: Error) => {
             this.showAlert('Erro ao buscar o usuairo'+error);
             this.usuarioService.currentUser = null;
           });

            this.lerPerfil();
               loading.dismiss();
          }, error => {
              loading.dismiss();
              this.showAlert('Erro ao alterar Perfil!');
          });
  }

  public  showAlert(message: string): void {
    this.alertCtrl.create({
    message: message,
      buttons: ['OK']
    }).present();
  }

  onPhoto(event): void{

    this.fileFoto = event.target.files[0];
    
   if(this.fileFoto){

    if(event.target.files[0].size > 700000){
        this.showAlert('Tamanho máximo da imagem é de 700 KB !');
    } else {
          var reader = new FileReader();
          reader.onloadend = (e: Event) => {
              this.foto = reader.result;
          }
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  }

  public showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Por favor aguarde ...'
    });
    loading.present();
    return loading;
  }

}
