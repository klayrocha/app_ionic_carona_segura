import { listaUsuarioGrupo } from './../model/listaUsuarioGrupo';
import { UsuarioService } from './usuario.service';
import { UrlService } from './url.service';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";

@Injectable()
export class listaUsuarioGrupoService {

  private headers: Headers = new Headers({'Content-Type':'application/json'});
 // private usuariogrupoList: string = "/app/usuarios/";
  private usuariogrupoList: string = "app/paginado/usuarios/";
  private usuarioAdmGrupo: string = "/app/usuario/verificaradm/";

  
  constructor(
    public urlService: UrlService,
    public http: Http,
    public usuarioService: UsuarioService,
    ) {
    }

      listaGrupo(idGrupo: number,numeroPagina: number): Observable<listaUsuarioGrupo[]>{
          var urlCompleta = this.urlService.urlServidor+this.usuariogrupoList+idGrupo+"/"+numeroPagina;
          return this.http.get(urlCompleta,this.headers.getAll)
            .map((res: Response) => {
                return res.json() as listaUsuarioGrupo[]
            });
      }

      usuarioAdm(idGrupo: number, idAdmGrupo: number){
        var urlCompleta = this.urlService.urlServidor+this.usuarioAdmGrupo+idGrupo+"/"+idAdmGrupo;
        return this.http.get(urlCompleta,this.headers.getAll)
          .map((res: Response) => {
              return res.text();
              
          });
    }
}