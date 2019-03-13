import { UsuarioAdm } from './../model/usuarioAdm.model';
import { UrlService } from './url.service';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";

@Injectable()
export class UsuarioAdmService {

  currentUser: UsuarioAdm;
  perfilUser: UsuarioAdm;
  urlparametro: string

  private urlCreate: string = "app/grupo/cadastro/usuario/adm";
  private urlExcluir: string =  "app/grupo/excluir/usuario";
  private headers: Headers = new Headers({'Content-Type':'application/json'});

  constructor(
    public urlService: UrlService,
    public http: Http
    ) {}


  create(idgrupo: number, iduser: number): Observable<UsuarioAdm> {
     this.urlparametro = "/"+idgrupo+"/"+iduser;
     return this.http.post(this.urlService.urlServidor + this.urlCreate + this.urlparametro, this.headers.getAll)
            .map((res:  Response) => {
                return res.json() as any;
            });
    }

    excluir(idgrupo: number, iduser: number) {
      this.urlparametro = "/"+idgrupo+"/"+iduser;
      return this.http.post(this.urlService.urlServidor + this.urlExcluir + this.urlparametro, this.headers.getAll);
     }

}