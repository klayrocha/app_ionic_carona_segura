import { Grupo } from './grupo.model';

export class Localidade {
    
        constructor(
            public id: number,
            public nome: string,
            public grupo: Grupo,
        ){}
    }