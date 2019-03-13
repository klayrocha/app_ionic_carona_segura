import { Grupo } from './../model/grupo.model';
import { Localidade } from './../model/localidade.model';
import { UsuarioService } from './usuario.service';
import { UrlService } from './url.service';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";

@Injectable()
export class LocalidadeService {

    currentUser: Localidade;
    currentGrupo: number;

  private urlCreate: string = "app/localidade/cadastro";
  private localidadeLista: string = "/app/locais/";
  private headers: Headers = new Headers({'Content-Type':'application/json'});

  constructor(
    public urlService: UrlService,
    public http: Http,
    public usuarioService: UsuarioService,
    ) {
    }

    create(localidade: Localidade): Observable<Localidade> {
            let iduser = this.usuarioService.currentUser.id;
            let idgrupo = this.currentGrupo;
            let id = new Grupo(idgrupo, "", iduser);
            localidade.grupo = id;
        
        return this.http.post(this.urlService.urlServidor+this.urlCreate,localidade,this.headers.getAll)
              .map((res:  Response) => {
                  return res.json() as Localidade;
              });
      }

      listaLocalidade(idGrupoLoc: number): Observable<Localidade[]>{
        var urlCompleta = this.urlService.urlServidor+this.localidadeLista+idGrupoLoc;
        return this.http.get(urlCompleta,this.headers.getAll)
          .map((res: Response) => {
              return res.json() as Localidade[]
          });
    }  
}