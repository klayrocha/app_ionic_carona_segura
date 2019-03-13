import { UsuarioService } from './usuario.service';
import { Grupo } from './../model/grupo.model';
import { UrlService } from './url.service';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";

@Injectable()
export class GrupoService {

    currentUser: Grupo;
    perfilUser: Grupo;
    retorno: string;

  private urlCreate: string = "/app/grupo/cadastro";
  private urlLogin: string = "/app/usuario/login";
  private urlGetUsuario: string = "/app/grupo/";
  private headers: Headers = new Headers({'Content-Type':'application/json'});
  private grupoList: string = "/app/grupos/";
  private sairGrupoUSer: string = "app/grupo/sair/";

  constructor(
    public urlService: UrlService,
    public http: Http,
    public usuarioService: UsuarioService,
    ) {
    }

    create(grupo: Grupo): Observable<Grupo> {
        grupo.idUsuario = this.usuarioService.currentUser.id;
        return this.http.post(this.urlService.urlServidor+this.urlCreate,grupo,this.headers.getAll)
              .map((res:  Response) => {
                  return res.json() as Grupo;
              });
      }

      login(grupo: Grupo): Observable<Grupo> {
        return this.http.post(this.urlService.urlServidor+this.urlLogin,grupo,this.headers.getAll)
              .map((res:  Response) => {
                  return res.json() as Grupo;
              });
      }

      getGrupo(idGrupo: number): Observable<Grupo> {
        var urlCompleta = this.urlService.urlServidor+this.urlGetUsuario+idGrupo;
        return this.http.get(urlCompleta,this.headers.getAll)
              .map((res:  Response) => {
                  return res.json() as Grupo;
              });
      }

      listaGrupo(idUsuario: number): Observable<Grupo[]>{
          var urlCompleta = this.urlService.urlServidor+this.grupoList+idUsuario;
          return this.http.get(urlCompleta,this.headers.getAll)
            .map((res: Response) => {
                return res.json() as Grupo[]
            });
      }

      sairGrupo(idGrupo: number, idUser: number) {
        var urlCompleta = this.urlService.urlServidor+this.sairGrupoUSer+idGrupo+"/"+idUser;
        return this.http.post(urlCompleta,this.headers.getAll);
      }
}