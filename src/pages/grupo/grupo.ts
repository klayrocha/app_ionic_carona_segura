import { DetalheGrupoPage } from './../detalhe-grupo/detalhe-grupo';
import { UsuarioService } from './../../providers/usuario.service';
import { Grupo } from './../../model/grupo.model';
import { GrupoService } from './../../providers/grupo.service';
import { FormGroup, FormBuilder, Validators} from "@angular/forms";
import { Component } from '@angular/core';
import { NavController, NavParams, Loading, AlertController, LoadingController } from 'ionic-angular';


@Component({
  selector: 'page-grupo',
  templateUrl: 'grupo.html',
})

export class GrupoPage {

  grupoForm: FormGroup;
  view: string = 'grupo';
  grupoList: Grupo[];

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public grupoService: GrupoService,
    public loadingCtrl: LoadingController,
    public usuarioService: UsuarioService,
    
    ) {
      this.grupoForm = this.formBuilder.group({
        nome: ['',[Validators.required, Validators.minLength(1)]]
      });
  }

  lerGrupo() {
    let loading: Loading = this.showLoading();
        this.grupoService.listaGrupo(this.usuarioService.currentUser.id)
          .subscribe((grupoLista: Grupo[]) => {
            loading.dismiss();
            this.grupoList = grupoLista;
      }, error => {
        loading.dismiss();
          this.showAlert('Erro na lista de Grupos!');
      });
  }

  ionViewDidLoad() {
    this.lerGrupo();
  }

  salvarGrupo(): void { 

          if(this.grupoForm.get('nome').value == null ||  this.grupoForm.get('nome').value == ""){
            this.showAlert('Nome do Grupo Obrigatório');
          } else{
            let loading: Loading = this.showLoading();
            this.grupoService.create(this.grupoForm.value)
            .subscribe((grupo: Grupo) => {
                 loading.dismiss();
                 this.navCtrl.setRoot(GrupoPage);
            }, error => {
                loading.dismiss();
                this.showAlert('Erro no cadastro do Grupo!');
            });
          }
      }

      pushTela(grupo): void {
        this.navCtrl.push(DetalheGrupoPage,grupo);
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
