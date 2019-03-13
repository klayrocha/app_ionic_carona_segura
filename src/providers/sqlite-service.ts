import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';


@Injectable()
export class SqliteService {

  private db: SQLiteObject;

  constructor(
    public platform: Platform,
    public sqlite: SQLite
  ) {}

  private createDatabase(dbName?: string): Promise<SQLiteObject> {
    return this.platform.ready()
      .then( (readySource: string) => {
        return this.sqlite.create({
          name: dbName || 'caronaSeguraDBLogin.db',
          location: 'default'
        }).then ((db: SQLiteObject) => {
          this.db = db;
          return this.db;
        }).catch((error: Error) => {
          console.log('Erro na criação do Bando de dados: ', error);
          return Promise.reject(error.message || error);
        }); 
      });
  }

  public getDB(dbName?: string): Promise<SQLiteObject> {
    return (this.db) ? Promise.resolve(this.db) : this.createDatabase(dbName);
  }
}
