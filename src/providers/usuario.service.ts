import { TrocaSenha } from './../model/trocaSenha.model';
import { Email } from './../model/email.model';
import { SqliteService } from './sqlite-service';
import { SQLiteObject } from '@ionic-native/sqlite';
import { Usuario } from './../model/usuario.model';
import { UrlService } from './url.service';
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";

@Injectable()
export class UsuarioService {

  currentUser: Usuario;
  perfilUser: Usuario;
  IdUser: number;

  private urlCreate: string = "/app/usuario/cadastro";
  private urlLogin: string = "/app/usuario/login";
  private urlUpdate: string = "app/usuario/alterar";
  private usuariodetalhe: string ="/app/usuario/";
  private enviaEmail: string = "app/usuario/recuperarsenha/";
  private trocaSenha: string = "app/usuario/trocarsenha/";
  private headers: Headers = new Headers({'Content-Type':'application/json'});
  private db: SQLiteObject;
  private primeiraChamada: boolean = true;

  constructor(
    public urlService: UrlService,
    public http: Http,
    public sqliteService: SqliteService
    ) {}

  public getDB(): Promise<SQLiteObject> {
      if( this.primeiraChamada ){
        this.primeiraChamada = false; 
        return this.sqliteService.getDB()
            .then((db: SQLiteObject) => {
                this.db = db;
                this.db.executeSql('CREATE TABLE IF NOT EXISTS USUARIO (id INTEGER, nome TEXT, email TEXT, telefone TEXT, senha TEXT,foto BLOB)',{})
                .then(success => console.log('Tabela usuario criada com sucesso !', success))
                .catch((error: Error) => console.log('Erro ao criar a tabela usuario!', error));
                return this.db;
            });
      }
      return this.sqliteService.getDB();
  }

  getUsuarioBanco(): Promise<Usuario>{
       return this.getDB()
            .then((db: SQLiteObject) => {
                 return <Promise<Usuario>> this.db.executeSql(' SELECT * FROM USUARIO ',[])
                    .then(resultSet => {
                        return <Usuario> resultSet.rows.item(0);
                    }).catch((error: Error) => console.log('Erro no getUsuarioBanco',error));   
            }); 
  }

  salvaUsuarioBanco(usuario: Usuario): Promise<Usuario>{
    return this.getDB()
        .then((db: SQLiteObject) => {
            return <Promise<Usuario>> this.db.executeSql(' INSERT INTO USUARIO (id, nome, email, telefone, senha,foto) VALUES(?,?,?,?,?,?)',
                                      [usuario.id,usuario.nome,usuario.email,usuario.telefone,usuario.senha,usuario.foto])
                .then(resultSet => {
                    usuario.id = resultSet.insertId;
                    return usuario;
                }).catch((error: Error) => console.log('Erro no salvaUsuarioBanco',error));   
        }); 
  }

  alterarUsuarioBanco(usuario: Usuario): Promise<Usuario>{
    return this.getDB()
        .then((db: SQLiteObject) => {
            return <Promise<Usuario>> this.db.executeSql(' UPDATE USUARIO SET nome = ?,  email = ? , telefone = ? , senha = ? ,foto = ? ',
                                      [usuario.nome,usuario.email,usuario.telefone,usuario.senha,usuario.foto])
                .then(resultSet => {
                    usuario.id = resultSet.insertId;
                    return usuario;
                }).catch((error: Error) => console.log('Erro no alterar usuario local',error));   
        }); 
  }

  excluirUsuarioBanco(): Promise<Usuario>{
    return this.getDB()
    .then((db: SQLiteObject) => {
        return <Promise<Usuario>> this.db.executeSql(' DELETE FROM USUARIO ',[])
            .then(resultSet => {
                return null;
            }).catch((error: Error) => console.log('Erro no salvaUsuarioBanco',error));   
    });   
  }



  create(usuario: Usuario): Observable<Usuario> {
      return this.http.post(this.urlService.urlServidor+this.urlCreate,usuario,this.headers.getAll)
            .map((res:  Response) => {
                return res.json() as Usuario;
            });
    }


    login(usuario: Usuario): Observable<Usuario> {
      return this.http.post(this.urlService.urlServidor+this.urlLogin,usuario,this.headers.getAll)
            .map((res:  Response) => {
                return res.json() as Usuario;
            });
    }

    alterarPerfil(usuario: Usuario): Observable<Usuario> {
        usuario.id = this.IdUser;

        return this.http.post(this.urlService.urlServidor+this.urlUpdate,usuario,this.headers.getAll)
        .map((res:  Response) => {
            return res.json() as Usuario;
        });
    }

    detalheUsuario(idUsuario: number){
        var urlCompleta = this.urlService.urlServidor+this.usuariodetalhe+idUsuario;
        return this.http.get(urlCompleta,this.headers.getAll)
          .map((res: Response) => {
              return res.json() as Usuario
          });
    }

    enviaSenha(senha: Email){
        let completa = ".XX"
        return this.http.post(this.urlService.urlServidor+this.enviaEmail+senha.email+completa,this.headers.getAll)
        .map((res: Response) => {
            return res.text();
        }); 
    }

      alteraSenha(senha: TrocaSenha, id: number){
        senha.userId = id;  
        let completa = senha.userId+"/"+senha.senhaAtual+"/"+senha.novaSenha
        return this.http.post(this.urlService.urlServidor+this.trocaSenha+completa,this.headers.getAll)
        .map((res: Response) => {
            return res.text();
        });
      }

}
