export interface Vehicle {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  submodelo: string;
  ano_fab: number;
  ano_mod: number;
  cor: string;
  combustivel: string;
  km: number;
  cambio: string;
  tipo: string;
  portas: string;
  valor: number;
  imagens: string[];
  opcionais: string[];
  observacao: string;
  video_url?: string;
}