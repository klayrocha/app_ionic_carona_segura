import { PopoverListaUsuarioPage } from './../popover-lista-usuario/popover-lista-usuario';
import { listaUsuarioGrupoService } from './../../providers/listaUsuarioGrupo.service';
import { listaUsuarioGrupo } from './../../model/listaUsuarioGrupo';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, PopoverController, LoadingController, Loading } from 'ionic-angular';


@Component({
  selector: 'page-lista-usuario-grupo',
  templateUrl: 'lista-usuario-grupo.html',
})
export class ListaUsuarioGrupoPage {

  usuariogrupoList: listaUsuarioGrupo[];
  idgrupo: number;
  numeroPagina: number = 1;
  idAdmGrupo: string;

  constructor(
    public loadingCtrl: LoadingController,
     public navCtrl: NavController,
     public navParams: NavParams,
     public usuariogrupoService: listaUsuarioGrupoService,
     public alertCtrl: AlertController,
     public popoverCtrl: PopoverController,
    ) {

      if(this.navParams.data.idlista != "S"){
        this.idgrupo = this.navParams.data;
      }else {
         this.idgrupo = this.navParams.data;
      }
  }

  lerUsuarioGrupo() {
    let loading: Loading = this.showLoading();
    this.usuariogrupoService.listaGrupo(this.idgrupo,this.numeroPagina)
      .subscribe((usuariogrupoList: listaUsuarioGrupo[]) => {
        this.usuariogrupoList = usuariogrupoList;

        loading.dismiss(); 
   }, error => {
        loading.dismiss();
       this.showAlert('Erro na lista de Grupos!');
   });
  }

  lerUsuarioGrupoLista() {
     this.usuariogrupoService.listaGrupo(this.idgrupo,this.numeroPagina)
       .subscribe((usuariogrupoList: listaUsuarioGrupo[]) => {
         if(this.usuariogrupoList == null){
           this.usuariogrupoList =  new Array();
         }
         
         for (var i=0 ; i < usuariogrupoList.length; i++){
           this.usuariogrupoList.push(usuariogrupoList[i]);
         }
 
    }, error => {
        this.showAlert('Erro na lista de Grupos!');
    });
   }

  ionViewDidLoad() {
    this.lerUsuarioGrupo();
    this.lerUsuarioGrupoAdm();
  }

  private showAlert(message: string): void {
    this.alertCtrl.create({
    message: message,
      buttons: ['OK']
    }).present();
  }

  presentPopover(iduser) {
    
    if(this.idAdmGrupo == 'S'){
    var idgrupo = this.navParams.data;
    var idlista = 'S';
    let popover = this.popoverCtrl.create(PopoverListaUsuarioPage, { idgrupo, iduser, idlista });
    popover.present({
  
    });

    popover.onDidDismiss(() => {
      this.lerUsuarioGrupo();
      });
  }
 }

  private showLoading(): Loading {
  let loading: Loading = this.loadingCtrl.create({
    content: 'Por favor aguarde ...'
  });
  loading.present();
  return loading;
}

doInfinite(infiniteScroll) {

  setTimeout(() => {
    this.numeroPagina++;
    this.lerUsuarioGrupoLista();
    infiniteScroll.complete();
  }, 600);
}

lerUsuarioGrupoAdm() {
  let loading: Loading = this.showLoading();

  let idUser = this.usuariogrupoService.usuarioService.currentUser.id

  this.usuariogrupoService.usuarioAdm(this.idgrupo,idUser)
    .subscribe((idAdmGrupo: string) => {
      this.idAdmGrupo = idAdmGrupo;
      loading.dismiss(); 
 }, error => {
      loading.dismiss(); 
 });
}

}


