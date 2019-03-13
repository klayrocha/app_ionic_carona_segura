import { Usuario } from './usuario.model';
import { Carona } from './carona.model';

export class Message {
    
        constructor(
            public texto:   string,
            public carona:  Carona,
            public usuario: Usuario,
        ){}
    }