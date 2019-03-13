import { DomSanitizer } from '@angular/platform-browser';
import { Contacts } from '@ionic-native/contacts';
import { UsuarioGrupo } from './../../model/usuarioGrupo.model';
import { UsuarioGrupoService } from './../../providers/usuarioGrupo.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Loading, LoadingController, AlertController, App } from 'ionic-angular';

@Component({
  selector: 'page-usuario-grupo',
  templateUrl: 'usuario-grupo.html',
})
export class UsuarioGrupoPage {
  UsuarioForm: FormGroup;
  public formatoTel: String;
  public formatoTel2: String;
  public formatoTel3: String;
  UserGrupo: UsuarioGrupo;
  view: string = 'addUser';
  nomeContato: string;

  constructor(
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public usuarioGrupoService: UsuarioGrupoService,
    public app: App,
    private contacts: Contacts,
    private sanitizer: DomSanitizer,
  ) {
    this.UsuarioForm = this.formBuilder.group({
      telefone: ['',],
      telefoneCelular: ['',]
    });
  }

  contactList = [];
  contactListParaFiltrar = [];
  contactListInterna = [];
  contactListSelected = [];

  onSubmit(): void {
    if (this.UsuarioForm.get('telefone').value == null || this.UsuarioForm.get('telefone').value == "") {
      this.showAlert('Telefone Obrigatório');
    } else {
      let loading: Loading = this.showLoading();

      let grupoId = this.navParams.data

      let formatoTel = this.UsuarioForm.get('telefone').value.replace('(', '');
      let formatoTel2 = formatoTel.replace(')', '');
      let formatoTel3 = formatoTel2.replace('-', '');
      let formatoTel4 = formatoTel3.replace(' ', '');
      this.UsuarioForm.get('telefone').setValue(formatoTel4);

      this.usuarioGrupoService.create(this.UsuarioForm.value, grupoId)
        .subscribe((usuarioGrupo: UsuarioGrupo) => {
          this.usuarioGrupoService.currentUser = usuarioGrupo;
          loading.dismiss();
          this.showAlert('usuario cadastrado com sucesso !');
          this.app.getRootNav().pop();
        }, error => {
          loading.dismiss();
          this.showAlert('Telefone não cadastrado no Carona Segura!');
        });
    }
  }

  onSubmitCelular() {

    if (this.contactListSelected.length == 0) {
      this.showAlert('Selecione pelo menos um contato !');
    } else {
      let loading: Loading = this.showLoading();

      let grupoId = this.navParams.data
      let telefonesSelected: string = "";

      let formatoTel: string = '';
      let formatoTel1: string = '';
      let formatoTel2: string = '';
      let formatoTel3: string = '';
      let formatoTel4: string = '';

      for (var i = 0; i < this.contactListSelected.length; i++) {
        formatoTel = this.contactListSelected[i].number;
        formatoTel1 = formatoTel.replace('(', '');
        formatoTel2 = formatoTel1.replace(')', '');
        formatoTel3 = formatoTel2.replace('-', '');
        formatoTel4 = formatoTel3.replace(' ', '');
        telefonesSelected += formatoTel4 + '@';
      }
      this.usuarioGrupoService.createAgenda(telefonesSelected, grupoId)
        .subscribe((retorno: string) => {
          loading.dismiss();
          if (retorno == "OK") {
            this.showAlert('Usuários cadastrados com sucesso !');
          } else {
            this.showAlert('Telefones da agenda não cadastrado no Carona Segura :' + retorno);
          }
          for (var i = 0; i < this.contactList.length; i++) {
            this.contactList[i].selected = false;
          }
        }, error => {
          loading.dismiss();
          for (var i = 0; i < this.contactList.length; i++) {
            this.contactList[i].selected = false;
          }
          this.showAlert('Exite :' + error);
        });
    }
  }


  getContacts(): void {
    let loading: Loading = this.showLoading();
    this.contacts.find(
      ["displayName", "phoneNumbers", "photos"],
      { multiple: true, hasPhoneNumber: true }
    ).then((contacts) => {
      for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].displayName !== null) {
          var contact = {};
          contact["name"] = contacts[i].displayName;
          contact["number"] = contacts[i].phoneNumbers[0].value;
          if (contacts[i].photos != null) {
            contact["image"] = this.sanitizer.bypassSecurityTrustUrl(contacts[i].photos[0].value);
          } else {
            contact["image"] = "assets/dummy-profile-pic.png";
          }
          contact["selected"] = false;
          contact["show"] = true;
          this.contactListInterna.push(contact);
        }
      }
      this.contactList = this.contactListInterna.sort((a: any, b: any) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      }
      );

      for (var j = 0; j <  this.contactList.length; j++) {
        this.contactListParaFiltrar.push(this.contactList[j]);
      }

      loading.dismiss();
    });

  }

  selecionarContato(telefone: string): void {
    for (var i = 0; i < this.contactList.length; i++) {
      if (this.contactList[i].number == telefone) {
        if (this.contactList[i].selected) {
          this.contactList[i].selected = false;
          let index = this.contactListSelected.findIndex(d => d.number === this.contactList[i].number);
          this.contactListSelected.splice(index, 1);
        } else {
          this.contactList[i].selected = true;
          this.contactListSelected.push(this.contactList[i]);
        }
      }
    }
  }

  filtrarLista(ev: any): void {

    this.nomeContato = ev.target.value;

    if (this.nomeContato == '') {
      this.contactList = this.contactListParaFiltrar;
    } else {
      this.contactList = this.contactListParaFiltrar.filter((item) => {
        return (item.name.toLowerCase().indexOf(this.nomeContato.toLowerCase()) > -1);
      }, error => {
        this.showAlert('Error Filtro:' + error);
      });
    }
  }

  apagarLista(ev: any): void {
    this.contactList = this.contactListParaFiltrar;
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
