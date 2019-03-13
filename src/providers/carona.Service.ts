import { Message } from './../model/message.model';
import { Localidade } from './../model/localidade.model';
import { Usuario } from './../model/usuario.model';
import { Grupo } from './../model/grupo.model';
import { Carona } from './../model/carona.model';
import { GrupoService } from './grupo.service';
import { UsuarioService } from './usuario.service';
import { UrlService } from './url.service';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";

@Injectable()
export class CaronaService {

  currentUser: Carona;
  urlCompleta: string;
  currentGrupo: number;
  currentUserLogado: Usuario;
  currentLocalidadeOrigem: Localidade;
  currentLocalidadeDestino: Localidade;
  caronaId: number;
  origemId: number;
  destinoId: number;
  public mensagem: Message;

  private urlCreate: string = "app/carona/cadastro";
  private caronaLista: string = "app/caronas/";
  private caronaListaUsuario: string = "app/caronas/usuario/";
  private caronadetalhe: string ="app/carona/";
  private caronaFiltro: string = "app/caronas/parametros/";
  private reservarVaga: string = "app/caronas/cadastro/usuario/";
  private sairdaVaga: string = "app/caronas/excluir/usuario/";
  private usuarioscarona: string = "app/caronas/usuarios/";
  private alteraCarona: String = "app/carona/alterar";
  private excluiCarona: String = "app/carona/excluir/";
  private sendMensagem: string = "app/carona/cadastro/mensagem/";
  private listaChatCarona: string ="app/carona/";
  private headers: Headers = new Headers({'Content-Type':'application/json'});

  constructor(
    public urlService: UrlService,
    public http: Http,
    public usuarioService: UsuarioService,
    public grupoService: GrupoService,
    ) {}


  create(carona: Carona): Observable<Carona> {
    let iduser = this.usuarioService.currentUser.id;
    let idgrupo = this.currentGrupo;

    let id = new Grupo(idgrupo, "", iduser);
    
    carona.grupo = id;
    carona.idUsuarioCriador = this.usuarioService.currentUser.id+'';

    return this.http.post(this.urlService.urlServidor+this.urlCreate,carona,this.headers.getAll)
            .map((res:  Response) => {
                return res.json() as Carona;
            });
    }

    alterarCarona(carona: Carona): Observable<Carona> {
        let iduser = this.usuarioService.currentUser.id;
        let idgrupo = this.currentGrupo;

        let origem = this.origemId;
        let destino = this.destinoId;

        let id = new Grupo(idgrupo, "", iduser);
        let idOrigem = new Localidade(origem,"",id);
        let iddestino = new Localidade(destino,"",id);
        
        carona.grupo = id;
        carona.origem = idOrigem;
        carona.destino = iddestino;
        carona.id = this.caronaId;
        return this.http.post(this.urlService.urlServidor+this.alteraCarona,carona,this.headers.getAll)
                .map((res:  Response) => {
                    return res.json() as Carona;
                });
        }

    excluirCarona(carona: number) {
        return this.http.post(this.urlService.urlServidor+this.excluiCarona+carona,this.headers.getAll);
    }    

    listaCarona(idGrupoLoc: number): Observable<Carona[]>{
      var urlCompleta = this.urlService.urlServidor+this.caronaLista+idGrupoLoc;
      return this.http.get(urlCompleta,this.headers.getAll)
        .map((res: Response) => {
            return res.json() as Carona[]
        });
  } 

  listaCaronaUsuario(idUsuario: number): Observable<Carona[]>{
    var urlCompleta = this.urlService.urlServidor+this.caronaListaUsuario+idUsuario;
    return this.http.get(urlCompleta,this.headers.getAll)
      .map((res: Response) => {
          return res.json() as Carona[]
      });
} 

  detalheCarona(idCarona: number){
    var urlCompleta = this.urlService.urlServidor+this.caronadetalhe+idCarona;

    return this.http.get(urlCompleta,this.headers.getAll)
      .map((res: Response) => {
          return res.json() as Carona
      });
} 
filtraCarona(idGrupoLoc: number,origem: number,destino: number,dataPesquisa: string): Observable<Carona[]>{
  var urlCompleta = this.urlService.urlServidor+this.caronaFiltro+idGrupoLoc+"/"+origem+"/"+destino+"/"+dataPesquisa;
  return this.http.get(urlCompleta,this.headers.getAll)
    .map((res: Response) => {
        return res.json() as Carona[]
    });
} 

reservaVaga(idCarona: number, userId: number): Observable<Carona>{
  var urlCompleta = this.urlService.urlServidor+this.reservarVaga+idCarona+"/"+userId;
   return this.http.post(urlCompleta,this.headers.getAll)
    .map((res: Response) => {
        return res.json() as Carona
    });
}

sairVaga(idCarona: number, userId: number) {
    var urlCompleta = this.urlService.urlServidor+this.sairdaVaga+idCarona+"/"+userId;
     return this.http.post(urlCompleta,this.headers.getAll);
  }

listaCaronaUser(caronaId: number): Observable<Usuario[]>{
    var urlCompleta = this.urlService.urlServidor+this.usuarioscarona+caronaId;
    return this.http.get(urlCompleta,this.headers.getAll)
      .map((res: Response) => {
          return res.json() as Usuario[]
      });
}

enviarMensagem(mensagem: Message): Observable<Message>{
   var urlCompleta = this.urlService.urlServidor+this.sendMensagem;
   return this.http.post(urlCompleta,mensagem,this.headers.getAll)
   .map((res: Response) => {
    return res.json() as Message
   });

}

listaMensagem(idcarona: number) : Observable<Message[]>{
    var urlCompleta = this.urlService.urlServidor+this.listaChatCarona+idcarona;
    return this.http.get(urlCompleta,this.headers.getAll)
      .map((res: Response) => {
          return res.json() as Message[]
      });
}

}