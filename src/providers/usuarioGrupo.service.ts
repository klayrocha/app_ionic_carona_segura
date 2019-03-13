import { GrupoService } from './grupo.service';
import { UsuarioService } from './usuario.service';
import { UsuarioGrupo } from './../model/usuarioGrupo.model';
import { UrlService } from './url.service';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";

@Injectable()
export class UsuarioGrupoService {

  currentUser: UsuarioGrupo;
  perfilUser: UsuarioGrupo;
  urlCompleta: string;

  private urlCreate: string = "app/grupo/cadastro/usuario";
  private urlCreateAgenda: string = "app/grupo/cadastro/usuarios";
  private headers: Headers = new Headers({'Content-Type':'application/json'});

  constructor(
    public urlService: UrlService,
    public http: Http,
    public usuarioService: UsuarioService,
    public grupoService: GrupoService,
    ) {}


  create(usuarioGrupo: UsuarioGrupo, idgrupo: number): Observable<UsuarioGrupo> {
    usuarioGrupo.idgp = idgrupo;
    this.urlCompleta = "/"+usuarioGrupo.idgp+"/"+usuarioGrupo.telefone;
    return this.http.post(this.urlService.urlServidor+this.urlCreate+this.urlCompleta,this.headers.getAll)
            .map((res:  Response) => {
                return res.json() as UsuarioGrupo;
            });
    }


    createAgenda(telefonesArroba: string, idgrupo: number): Observable<string> {
      this.urlCompleta = "/"+idgrupo+"/"+telefonesArroba;
      return this.http.post(this.urlService.urlServidor+this.urlCreateAgenda+this.urlCompleta,this.headers.getAll)
              .map((res:  Response) => {
                  return res.text();
              });
      }

}
