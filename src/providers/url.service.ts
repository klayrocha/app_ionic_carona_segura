import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class UrlService {
  

  public urlServidor : string =  'http://174.138.57.80:8085/'; //'http://localhost:8085/'; //

  constructor(public http: Http) {}

}
