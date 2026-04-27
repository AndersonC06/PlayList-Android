export type PadTheme = {
  id: string;
  name: string;
  colors: string[];
};

export const padThemes: PadTheme[] = [
  {
    id: 'azul-padrao',
    name: 'Azul Padrão',
    colors: Array(12).fill('#6B9EFA')
  },
  {
    id: 'classico',
    name: 'Clássico',
    colors: [
      '#FF0A0A', '#FF370A', '#FF950A',
      '#FFD20A', '#FAFF0A', '#60FF0A',
      '#0AFF16', '#0AFFC4', '#0A91FF',
      '#420AFF', '#A40AFF', '#FF0AE4'
    ]
  },
  {
    id: 'misterio-divino',
    name: 'Mistério Divino',
    colors: [
      '#3f1b8a', '#ffdf00', '#56428c',
      '#8f53ed', '#d3a628', '#8672c4',
      '#1b1c5c', '#f7f1af', '#645d9c',
      '#b8921e', '#7c76ba', '#f9f6cb'
    ]
  },
  {
    id: 'terra-santa',
    name: 'Terra Santa',
    colors: [
      '#8e4a1a', '#435e21', '#9e5a31',
      '#6a8f1f', '#d2803b', '#7e8200',
      '#ce6b21', '#1f821f', '#eba255',
      '#99c92a', '#e3bd8c', '#33ce33'
    ]
  },
  { id: 'coral-quente', name: 'Coral Quente', colors: Array(12).fill('#ff6633') },
  { id: 'noite-indigo', name: 'Noite Indigo', colors: Array(12).fill('#3a0e85') },
  { id: 'vidro-teal', name: 'Vidro Teal', colors: Array(12).fill('#17a8a8') },
  { id: 'carvao-moderno', name: 'Carvão Moderno', colors: Array(12).fill('#5c646b') },
  { id: 'luz-lima', name: 'Luz Lima', colors: Array(12).fill('#a3ff20') },
  { id: 'rosa-choque', name: 'Rosa Choque', colors: Array(12).fill('#ff1493') },
  { id: 'violeta-eletrico', name: 'Violeta Elétrico', colors: Array(12).fill('#7b00ff') },
  { id: 'girassol', name: 'Girassol', colors: Array(12).fill('#ffb300') },
  { id: 'brisa-primavera', name: 'Brisa de Primavera', colors: Array(12).fill('#00ff73') },
  { id: 'gelo-artico', name: 'Gelo Ártico', colors: Array(12).fill('#ccefff') },
];

export const defaultPadTheme = padThemes[0];
