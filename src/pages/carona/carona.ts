import { Localidade } from './../../model/localidade.model';
import { LocalidadeService } from './../../providers/localidade.service';
import { PopoverLocalidadePage } from './../popover-localidade/popover-localidade';
import { Carona } from './../../model/carona.model';
import { CaronaService } from './../../providers/carona.Service';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController, PopoverController, App } from 'ionic-angular';


@Component({
  selector: 'page-carona',
  templateUrl: 'carona.html',
})
export class CaronaPage {

  caronaForm: FormGroup;
  localidadeLista: Localidade[];
  idgrupoLoc: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public caronaService: CaronaService,
    public popoverCtrl: PopoverController,
    public localiadeService: LocalidadeService,
    public app: App,
  ) {
    this.caronaForm = this.formBuilder.group({
      origem:          ['', [Validators.required]],
      destino:         ['', [Validators.required]],
      data:            ['', [Validators.required]],
      horaSaida:       ['', [Validators.required]],
      quantidadeVagas: ['', [Validators.required]],
      formaPagamento:  ['', ],
      observacao:      ['', ],
    });

    if(this.navParams.data.idlista != "S"){
      this.idgrupoLoc = this.navParams.data;
    }else {
       this.idgrupoLoc = this.navParams.data
    }

  }

  ionViewDidLoad() {
    this.lerLocalidade();
  }

  lerLocalidade() {
    this.localiadeService.listaLocalidade(this.idgrupoLoc)
      .subscribe((localidadeLista: Localidade[]) => {
        this.localidadeLista = localidadeLista;
       
   }, error => {
       this.showAlert('Erro na lista de Localidades!');
   });
  }

  onSubmit(): void {

    if(this.caronaForm.get('origem').value == null ||  this.caronaForm.get('origem').value == ""){
      this.showAlert('Origem da Carona Obrigatório');
    } else
    if(this.caronaForm.get('destino').value == null ||  this.caronaForm.get('destino').value == ""){
      this.showAlert('Destino da Carona Obrigatório');
    } else
    if(this.caronaForm.get('data').value == null ||  this.caronaForm.get('data').value == ""){
      this.showAlert('Data da Carona Obrigatório');
    } else
    if(this.caronaForm.get('horaSaida').value == null ||  this.caronaForm.get('horaSaida').value == ""){
      this.showAlert('Hora da Carona Obrigatório');
    } else
    if(this.caronaForm.get('quantidadeVagas').value == null ||  this.caronaForm.get('quantidadeVagas').value == ""){
      this.showAlert('Quantidade de Vagas da Carona Obrigatório');
    } else
    if(this.caronaForm.get('formaPagamento').value == null ||  this.caronaForm.get('formaPagamento').value == ""){
      this.showAlert('Forma de Pagamento da Carona Obrigatório');
    } else {

      this.caronaService.currentGrupo = this.idgrupoLoc;
      let loading: Loading = this.showLoading();
  
      this.caronaService.create(this.caronaForm.value)
      .subscribe((carona: Carona) => {
  
           this.caronaService.currentUser = carona;
           loading.dismiss();
           this.app.getRootNav().pop();
      }, error => {
          loading.dismiss();
          this.showAlert('Erro no cadastro!');
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

  presentPopover() {
    var idgrupo = this.navParams.data;
    var idlista = 'S';
    let popover = this.popoverCtrl.create(PopoverLocalidadePage, {idgrupo,idlista});
    popover.present({
  
    });

    popover.onDidDismiss(() => {
    this.lerLocalidade();
    });

}

}
