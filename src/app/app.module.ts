import { TrocaSenhaPage } from './../pages/troca-senha/troca-senha';
import { SolicitaSenhaPage } from './../pages/solicita-senha/solicita-senha';
import { CaronasCriadasPage } from './../pages/caronas-criadas/caronas-criadas';
import { DadosAppPage } from './../pages/dados-app/dados-app';
import { FaleConoscoPage } from './../pages/fale-conosco/fale-conosco';
import { InformacaoPage } from './../pages/informacao/informacao';
import { PopoverSemAdmPage } from './../pages/popover-sem-adm/popover-sem-adm';
import { PopoverDetalheCaronaPage } from './../pages/popover-detalhe-carona/popover-detalhe-carona';
import { DetalheCaronaPage } from './../pages/detalhe-carona/detalhe-carona';
import { LocalidadeService } from './../providers/localidade.service';
import { PopoverLocalidadePage } from './../pages/popover-localidade/popover-localidade';
import { CaronaService } from './../providers/carona.Service';
import { CaronaPage } from './../pages/carona/carona';
import { UsuarioAdmService } from './../providers/usuarioAdm.service';
import { PopoverListaUsuarioPage } from './../pages/popover-lista-usuario/popover-lista-usuario';
import { listaUsuarioGrupoService } from './../providers/listaUsuarioGrupo.service';
import { ListaUsuarioGrupoPage } from './../pages/lista-usuario-grupo/lista-usuario-grupo';
import { Contacts } from '@ionic-native/contacts';
import { UsuarioGrupoService } from './../providers/usuarioGrupo.service';
import { UsuarioGrupoPage } from './../pages/usuario-grupo/usuario-grupo';
import { PopoverMenupage } from './../pages/popoverMenu/popoverMenu';
import { DetalheGrupoPage } from './../pages/detalhe-grupo/detalhe-grupo';
import { GrupoService } from './../providers/grupo.service';
import { GrupoPage } from './../pages/grupo/grupo';
import { PerfilPage } from './../pages/perfil/perfil';
import { CadastrePage } from './../pages/cadastre/cadastre';
import { LoginPage } from './../pages/login/login';
import { MenuHeader } from './../components/menu/menu.header.component';
import { UsuarioService } from './../providers/usuario.service';
import { UrlService } from './../providers/url.service';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { SQLite } from '@ionic-native/sqlite';

import { MyApp } from './app.component';
import { File } from '@ionic-native/file';
import { MenssageBoxComponent } from '../components/menssage-box/menssage-box';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { SqliteService } from '../providers/sqlite-service';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    CadastrePage,
    PerfilPage,
    MenuHeader,
    GrupoPage,
    DetalheGrupoPage,
    PopoverMenupage,
    UsuarioGrupoPage,
    ListaUsuarioGrupoPage,
    PopoverListaUsuarioPage,
    CaronaPage,
    PopoverLocalidadePage,
    DetalheCaronaPage,
    MenssageBoxComponent,
    PopoverDetalheCaronaPage,
    PopoverSemAdmPage,
    InformacaoPage,
    FaleConoscoPage,
    DadosAppPage,
    CaronasCriadasPage,
    SolicitaSenhaPage,
    TrocaSenhaPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    BrMaskerModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    PerfilPage,
    CadastrePage,
    GrupoPage,
    DetalheGrupoPage,
    PopoverMenupage,
    UsuarioGrupoPage,
    ListaUsuarioGrupoPage,
    PopoverListaUsuarioPage,
    CaronaPage,
    PopoverLocalidadePage,
    DetalheCaronaPage,
    PopoverDetalheCaronaPage,
    PopoverSemAdmPage,
    InformacaoPage,
    FaleConoscoPage,
    DadosAppPage,
    CaronasCriadasPage,
    SolicitaSenhaPage,
    TrocaSenhaPage,
  ],
  providers: [
    SQLite,
    StatusBar,
    SplashScreen,
    UrlService,
    UsuarioService,
    GrupoService,
    UsuarioGrupoService,
    listaUsuarioGrupoService,
    UsuarioAdmService,
    CaronaService,
    File,
    Contacts,
    LocalidadeService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SqliteService
  ]
})
export class AppModule {}
