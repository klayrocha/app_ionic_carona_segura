import { Localidade } from './localidade.model';
import { Grupo } from './grupo.model';
export class Carona {
    
        constructor(
            public id: number,
            public origem: Localidade,
            public destino: Localidade,
            public data: number,
            public horaSaida: number,
            public quantidadeVagas: number,
            public observacao: string,
            public formaPagamento: string,
            public grupo: Grupo,
            public idUsuarioCriador:String,
            public idCriadorCarona:number,
        ){}
    }