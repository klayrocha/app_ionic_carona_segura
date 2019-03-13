import { TrocaSenhaPage } from './../pages/troca-senha/troca-senha';
import { CaronasCriadasPage } from './../pages/caronas-criadas/caronas-criadas';
import { InformacaoPage } from './../pages/informacao/informacao';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsuarioService } from './../providers/usuario.service';
import { Usuario } from './../model/usuario.model';
import { LoginPage } from './../pages/login/login';
import { GrupoPage } from './../pages/grupo/grupo';
import { PerfilPage } from './../pages/perfil/perfil';
import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  pagesMenu: [{title: string, component: any}];
  rootPage:any = LoginPage;
  user: Usuario;
  fotoMenu: String;
  loginForm: FormGroup;
  
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public usuarioService: UsuarioService,
    public formBuilder: FormBuilder,
    
  ) {
    
    this.pagesMenu = [
      {title: 'Perfil', component: PerfilPage},
      {title: 'Grupos', component: GrupoPage},
      {title: 'Minhas Caronas', component: CaronasCriadasPage},
      {title: 'Alterar Senha', component: TrocaSenhaPage},
      {title: 'Sair', component: 'Sair'},
      {title: 'Ajuda', component: InformacaoPage}
    ];

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
   
    this.loginForm = this.formBuilder.group({
      nomeLogin: ['',]
    });
  
  }

   openPage(page: {title: string, component: any}): void {
     if(page.component == 'Sair'){
       this.onLogout();
     } else{
      this.nav.setRoot(page.component);
     }
    
  }

  onLogout(): void {
    this.usuarioService.currentUser = null;
    this.usuarioService.excluirUsuarioBanco();
    this.nav.setRoot(LoginPage);
  }

}
