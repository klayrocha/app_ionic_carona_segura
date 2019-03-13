import { PopoverSemAdmPage } from './../popover-sem-adm/popover-sem-adm';
import { listaUsuarioGrupo } from './../../model/listaUsuarioGrupo';
import { listaUsuarioGrupoService } from './../../providers/listaUsuarioGrupo.service';
import { Localidade } from './../../model/localidade.model';
import { LocalidadeService } from './../../providers/localidade.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DetalheCaronaPage } from './../detalhe-carona/detalhe-carona';
import { Carona } from './../../model/carona.model';
import { CaronaService } from './../../providers/carona.Service';
import { Grupo } from './../../model/grupo.model';
import { GrupoService } from './../../providers/grupo.service';

import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController , Loading} from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { PopoverMenupage } from "../popoverMenu/popoverMenu";

@Component({
  selector: 'page-detalhe-grupo',
  templateUrl: 'detalhe-grupo.html',
  
})
export class DetalheGrupoPage {
  grupo: Grupo;
  idgrupoLoc: number;
  caronaLista: Carona[];
  filtroForm: FormGroup;
  view: string = 'carona';
  localidadeLista: Localidade[];
  caronafiltro: Carona[];
  usuariogrupoList: listaUsuarioGrupo[];
  nomeGrupo: string;
  idAdmGrupo: string;

  constructor(
    public loadingCtrl: LoadingController,
     public navCtrl: NavController,
     public navParams: NavParams,
     public popoverCtrl: PopoverController,
     public grupoService: GrupoService,
     public caronaService: CaronaService,
     public alertCtrl: AlertController,
     public formBuilder: FormBuilder,
     public localiadeService: LocalidadeService,
     public usuariogrupoService: listaUsuarioGrupoService,
     
    ) {
      
      if(this.navParams.data.idlistacarona != "S"){
        this.idgrupoLoc = this.navParams.data.id;
      }else {
        this.idgrupoLoc = this.navParams.data.idgrupo.data;
      }

      this.nomeGrupo = this.navParams.data.nome;

      this.filtroForm = this.formBuilder.group({
        origem:  ['',[]],
        destino: ['',[]],
        data:    ['',[]],
      });
  }

  ionViewWillEnter() {
    this.lerCarona();
  }

  ionViewDidLoad() {
    this.lerUsuarioGrupoAdm();
  }

  lerCarona() {
    let loading: Loading = this.showLoading();
        this.caronaService.listaCarona(this.idgrupoLoc)
          .subscribe((caronaLista: Carona[]) => {
            this.caronaLista = caronaLista;    
            loading.dismiss();      
       }, error => {
            loading.dismiss();
           this.showAlert('Erro na lista de Caronas!');
       });
      }

  presentPopover(myEvent) {

    if(this.idAdmGrupo == 'S'){
    var idgrupo = this.idgrupoLoc;
    var idlistacarona = 'S';
    let popover = this.popoverCtrl.create(PopoverMenupage,{idgrupo,idlistacarona});
    popover.present({
      ev: myEvent,
    });
  } else {
    var idgrupo = this.idgrupoLoc;
    var idlistacarona = 'S';
    let popover = this.popoverCtrl.create(PopoverSemAdmPage,{idgrupo,idlistacarona});
    popover.present({
      ev: myEvent,
    });
  }
  }

  private showAlert(message: string): void {
    this.alertCtrl.create({
    message: message,
      buttons: ['OK']
    }).present();
  }
 
  pushTela(id): void {
    this.navCtrl.push(DetalheCaronaPage,id);
  }

  lerLocalidade() {
    let loading: Loading = this.showLoading();
    this.localiadeService.listaLocalidade(this.idgrupoLoc)
      .subscribe((localidadeLista: Localidade[]) => {
        this.localidadeLista = localidadeLista;
        loading.dismiss(); 
   }, error => {
       loading.dismiss();
       this.showAlert('Erro na lista de Localidades!');
   });
  }

  filtrarCarona(): void{
    let loading: Loading = this.showLoading();
    let origem : number;
    let destino : number;
    let dataPesquisa : string;

    if(this.filtroForm.get('origem').value == null){
      origem = 0;
    } else {
      origem = this.filtroForm.get('origem').value;
    }

    if(this.filtroForm.get('destino').value == null){
      destino = 0;
    } else {
      destino = this.filtroForm.get('destino').value;
    }

    if(this.filtroForm.get('data').value == null){
      dataPesquisa = 'vazio';
    } else {
      dataPesquisa = this.filtroForm.get('data').value;
    }
    this.caronaService.filtraCarona(this.idgrupoLoc,origem,destino,dataPesquisa)
    .subscribe((caronaListaFiltro: Carona[]) => {
      this.caronafiltro = caronaListaFiltro;
      loading.dismiss(); 
 }, error => {
     loading.dismiss(); 
     this.showAlert('Não existem Caronas!');
 });
  }

  lerUsuarioGrupoAdm() {
    let loading: Loading = this.showLoading();

    let idUser = this.usuariogrupoService.usuarioService.currentUser.id

    this.usuariogrupoService.usuarioAdm(this.idgrupoLoc,idUser)
      .subscribe((idAdmGrupo: string) => {
        this.idAdmGrupo = idAdmGrupo;
        loading.dismiss(); 
   }, error => {
        loading.dismiss(); 
   });
  }

  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Por favor aguarde ...'
    });
    loading.present();
    return loading;
  }
}
