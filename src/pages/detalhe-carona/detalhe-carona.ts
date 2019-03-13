import { LocalidadeService } from './../../providers/localidade.service';
import { PopoverLocalidadePage } from './../popover-localidade/popover-localidade';
import { PopoverDetalheCaronaPage } from './../popover-detalhe-carona/popover-detalhe-carona';
import { Grupo } from './../../model/grupo.model';
import { Message } from './../../model/message.model';
import { Localidade } from './../../model/localidade.model';
import { Usuario } from './../../model/usuario.model';
import { UsuarioService } from './../../providers/usuario.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Carona } from './../../model/carona.model';
import { CaronaService } from './../../providers/carona.Service';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, AlertController, Loading, LoadingController, App, PopoverController, Content } from 'ionic-angular';


@Component({
  selector: 'page-detalhe-carona',
  templateUrl: 'detalhe-carona.html',
})
export class DetalheCaronaPage {

  @ViewChild(Content) content: Content;
  idcarona: number;
  caronadetalhe: Carona;
  caronaForm: FormGroup;
  qtdVaga: number;
  usuarioCaronaList: Usuario[];
  idGrupo: number;
  origem: Localidade;
  destino: Localidade;
  view: string = 'carona';
  mensagemLista: Message[];
  idUser: number;
  grupo: Grupo;
  editar: boolean;
  naoEdita: boolean;
  localidadeLista: Localidade[];
  ori: string;
  public stopCondition: boolean = false;
  idCriadorCarona: number;
  usuariosCarona: number;
  retornoIdUser:  number;



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public caronaService: CaronaService,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public usuarioService: UsuarioService,
    public app: App,
    public popoverCtrl: PopoverController,
    public localiadeService: LocalidadeService,
  ) {
    this.idcarona = this.navParams.data;

    this.caronaForm = this.formBuilder.group({
      origem: ['',],
      destino: ['',],
      data: ['',],
      horaSaida: ['',],
      quantidadeVagas: ['',],
      formaPagamento: ['',],
      observacao: ['',],
    });

    this.editar = true;
    this.naoEdita = false;
  }

  ionViewDidLoad() {
    this.lerCarona();
    this.lerUsuarioCarona();
    this.lerMensagem(this.idcarona);
  }

  lerCarona() {
    let loading: Loading = this.showLoading();
    this.caronaService.detalheCarona(this.idcarona)
      .subscribe((caronadetalhe: Carona) => {
        this.caronadetalhe = caronadetalhe;
        this.caronaForm.get('origem').setValue(this.caronadetalhe.origem.id);
        this.caronaForm.get('destino').setValue(this.caronadetalhe.destino.id);
        this.caronaForm.get('data').setValue(this.caronadetalhe.data);
        this.caronaForm.get('horaSaida').setValue(this.caronadetalhe.horaSaida);
        this.caronaForm.get('quantidadeVagas').setValue(this.caronadetalhe.quantidadeVagas);
        this.caronaForm.get('formaPagamento').setValue(this.caronadetalhe.formaPagamento);
        this.qtdVaga = this.caronadetalhe.quantidadeVagas;
        this.ori = this.caronadetalhe.origem.nome;

        this.idCriadorCarona = this.caronadetalhe.idCriadorCarona;

        this.caronaForm.get('observacao').setValue(this.caronadetalhe.observacao);

        this.idGrupo = this.caronadetalhe.grupo.id;
        this.origem = this.caronadetalhe.origem;
        this.destino = this.caronadetalhe.destino;
        this.idUser = this.usuarioService.currentUser.id;

        this.lerLocalidade();
        loading.dismiss();

      }, error => {
        loading.dismiss();
        this.showAlert('Erro na Carona!');
      });
  }

  showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['OK']
    }).present();
  }

  reservaVaga(): void {
    let loading: Loading = this.showLoading();
    let caronaId = this.idcarona;
    let userId = this.usuarioService.currentUser.id;
    this.caronaService.reservaVaga(caronaId, userId)
      .subscribe((carona: Carona) => {
        loading.dismiss();
        this.lerUsuarioCarona();
      }, error => {
        loading.dismiss();
        this.showAlert('Erro na reserva da carona!');
      });
  }

  sairVaga(): void {
    let loading: Loading = this.showLoading();
    let caronaId = this.idcarona;
    let userId = this.usuarioService.currentUser.id;
    this.caronaService.sairVaga(caronaId, userId)
      .subscribe(() => {
        loading.dismiss();
        this.lerUsuarioCarona();
      }, error => {
        loading.dismiss();
        this.showAlert('Erro ao sair da carona!');
      });
  }

  lerUsuarioCarona() {
    let caronaId = this.idcarona;
    this.caronaService.listaCaronaUser(caronaId)
      .subscribe((usuarioCaronaList: Usuario[]) => {
        this.usuarioCaronaList = usuarioCaronaList;

        this.usuariosCarona = this.usuarioCaronaList.length;

        this.usuariosCarona = this.usuariosCarona - 1;

        let retorno = this.usuarioCaronaList.find(item => item.id == this.usuarioService.currentUser.id)
       
        if(retorno != undefined){
          this.retornoIdUser = retorno.id
        } else {
          this.retornoIdUser = 0;
        }
      }, error => {
        this.showAlert('Erro na lista de Usuarios da carona!');
      });
  }

  enviarMensagem(novaMensagem: string): void {

    let carona = new Carona(this.idcarona, this.origem, this.destino, 0, 0, 0, "", "", this.grupo, "", 0);
    let user = new Usuario(this.idUser, "", "", 0, "", "");
    let Mes = new Message(novaMensagem, carona, user);

    this.caronaService.enviarMensagem(Mes)
      .subscribe((mens: Message) => {
        this.lerMensagem(this.idcarona);
      }, error => {
        this.showAlert('Erro ao enviar mensagem');
      });
  }

  lerMensagem(carona: number): void {
    this.caronaService.listaMensagem(carona)
      .subscribe((MensagemList: Message[]) => {

        this.mensagemLista = MensagemList;
       if(this.view == 'chat'){
        this.scrollTooBar();
       }
        
      }, error => {
        this.showAlert('Erro na lista do Chat!');
      });
  }

  alterarCarona(): void {
    let loading: Loading = this.showLoading();

    this.caronaService.currentGrupo = this.idGrupo;
    this.caronaService.origemId = this.caronaForm.get('origem').value;
    this.caronaService.destinoId = this.caronaForm.get('destino').value;

    this.caronaService.caronaId = this.idcarona;

    this.caronaService.alterarCarona(this.caronaForm.value)
      .subscribe((carona: Carona) => {
        loading.dismiss();
        this.editar = true;
        this.naoEdita = false;
      }, error => {
        loading.dismiss();
        this.showAlert('Erro ao alterar Carona!');
      });
  }

  showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: 'Por favor aguarde ...'
    });
    loading.present();
    return loading;
  }

  presentPopover(myEvent) {
    var caronaId = this.idcarona
    var idlista = 'S';
    let popover = this.popoverCtrl.create(PopoverDetalheCaronaPage, { caronaId, idlista });
    popover.present({
      ev: myEvent,
    });

    popover.onDidDismiss((alt) => {
      if (alt == false && this.usuariosCarona > 0) {
        this.showAlert('Você não pode alterar a carona se já estiver vaga reservada.!');
      } else if (alt == false) {
        this.editar = false;
        this.naoEdita = true;
        this.view = 'carona';
      }

    });

  }

  cancelar() {
    this.editar = true;
    this.naoEdita = false;
    this.lerCarona();
  }

  presentPopoverLocalidade() {
    var idgrupo = this.idGrupo;
    var idlista = 'S';
    let popover = this.popoverCtrl.create(PopoverLocalidadePage, { idgrupo, idlista });
    popover.present({

    });

    popover.onDidDismiss(() => {
      this.lerLocalidade();
    });

  }

  lerLocalidade() {
    this.localiadeService.listaLocalidade(this.idGrupo)
      .subscribe((localidadeLista: Localidade[]) => {
        this.localidadeLista = localidadeLista;
      }, error => {
        this.showAlert('Erro na lista de Localidades!');
      });
  }

  public async run() {
    while (!this.stopCondition) {
      await new Promise<void>(resolve => {
        setTimeout(resolve, 5000);
      });
      this.lerMensagem(this.idcarona);
    }
  }

  ionViewWillLeave() {
    this.stopCondition = true;
    this.view = 'carona';
  }

  Chat() {
    if(this.retornoIdUser == 0){
      this.view = 'carona';
      this.showAlert('Chat apenas para usuários da carona!');
    } else{
      this.scrollTooBar();
      this.run();
    }
    
  }

  carona() {
    this.stopCondition = true;
  }

  scrollTooBar(duration?: number): void{
    setTimeout(() => {
      if(this.content){
        this.content.scrollToBottom(duration || 300);
      }
    },50);
  }
}
