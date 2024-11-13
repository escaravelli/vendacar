import { z } from 'zod';

export const vehicleSchema = z.object({
  placa: z.string().min(7, 'Placa é obrigatória').max(8),
  marca: z.string().min(1, 'Marca é obrigatória'),
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  submodelo: z.string().optional(),
  ano_fab: z.number().min(1900).max(new Date().getFullYear() + 1),
  ano_mod: z.number().min(1900).max(new Date().getFullYear() + 2),
  cor: z.string().min(1, 'Cor é obrigatória'),
  combustivel: z.string().min(1, 'Combustível é obrigatório'),
  km: z.number().min(0, 'Quilometragem deve ser maior ou igual a zero'),
  cambio: z.string().min(1, 'Câmbio é obrigatório'),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  portas: z.string(),
  valor: z.number().min(0, 'Valor deve ser maior ou igual a zero'),
  opcionais: z.array(z.string()),
  observacao: z.string().optional(),
  video_url: z.string().url().optional().or(z.literal('')),
  imagens: z.array(z.string().url()).min(1, 'Pelo menos uma imagem é obrigatória'),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;

export const validateVehicle = (data: unknown) => {
  return vehicleSchema.safeParse(data);
};