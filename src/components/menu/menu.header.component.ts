import { LoginPage } from './../../pages/login/login';
import { NavController } from 'ionic-angular';
import { UsuarioService } from './../../providers/usuario.service';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'menu-header',
  templateUrl: 'menu.header.component.html'
})
export class MenuHeader {

  @Input() title: string;

  constructor(
    public usuarioService: UsuarioService,
    public navCtrl: NavController
  ) {}

  onLogout(): void {
    this.usuarioService.currentUser = null;
    this.navCtrl.setRoot(LoginPage);
  }

}
