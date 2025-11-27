
export interface Palpite {
  placarTimeA: number | null;
  placarTimeB: number | null;
}


export interface Partida {
  id: string;
  timeA: string;
  timeB: string;
  dataHora: string;
  status: 'ABERTA' | 'ENCERRADA'; 

  
  resultadoA?: number;
  resultadoB?: number;

  
  meuPalpite?: Palpite; 
  acertou?: boolean; 
  pontosGanhos?: number; 
}

export interface PalpiteEmEdicao {
    [partidaId: string]: Palpite;
}