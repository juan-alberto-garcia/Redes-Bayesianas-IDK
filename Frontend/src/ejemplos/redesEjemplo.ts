import type { RedBayesiana } from '../tipos/red';

export const redesEjemplo: RedBayesiana[] = [
  {
    id: 'lluvia_aspersor',
    nombre: 'Lluvia y Aspersor',
    descripcion: 'Red clásica de inferencia meteorológica y césped mojado',
    nodos: [
      {
        id: 'Lluvia',
        label: 'Lluvia',
        padres: [],
        estados: ['Si', 'No'],
        posicion: { x: 100, y: 100 },
        cpt: { padres: [], estados: ['Si', 'No'], tabla: { 'Si': 0.2, 'No': 0.8 } }
      },
      {
        id: 'Aspersor',
        label: 'Aspersor',
        padres: ['Lluvia'],
        estados: ['Encendido', 'Apagado'],
        posicion: { x: 350, y: 100 },
        cpt: {
          padres: ['Lluvia'],
          estados: ['Encendido', 'Apagado'],
          tabla: {
            'Si,Encendido': 0.01, 'Si,Apagado': 0.99,
            'No,Encendido': 0.40, 'No,Apagado': 0.60
          }
        }
      },
      {
        id: 'CespedMojado',
        label: 'Césped Mojado',
        padres: ['Lluvia', 'Aspersor'],
        estados: ['Si', 'No'],
        posicion: { x: 225, y: 260 },
        cpt: {
          padres: ['Lluvia', 'Aspersor'],
          estados: ['Si', 'No'],
          tabla: {
            'Si,Encendido,Si': 0.99, 'Si,Encendido,No': 0.01,
            'Si,Apagado,Si': 0.80, 'Si,Apagado,No': 0.20,
            'No,Encendido,Si': 0.90, 'No,Encendido,No': 0.10,
            'No,Apagado,Si': 0.00, 'No,Apagado,No': 1.00
          }
        }
      }
    ],
    conexiones: [
      { from: 'Lluvia', to: 'Aspersor' },
      { from: 'Lluvia', to: 'CespedMojado' },
      { from: 'Aspersor', to: 'CespedMojado' }
    ]
  },
  {
    id: 'alarma_robo',
    nombre: 'Alarma de Terremoto y Robo',
    descripcion: 'Red bayesiana clásica de Pearl para detección de robos',
    nodos: [
      {
        id: 'Robo',
        label: 'Robo',
        padres: [],
        estados: ['Si', 'No'],
        posicion: { x: 100, y: 80 },
        cpt: { padres: [], estados: ['Si', 'No'], tabla: { 'Si': 0.001, 'No': 0.999 } }
      },
      {
        id: 'Terremoto',
        label: 'Terremoto',
        padres: [],
        estados: ['Si', 'No'],
        posicion: { x: 350, y: 80 },
        cpt: { padres: [], estados: ['Si', 'No'], tabla: { 'Si': 0.002, 'No': 0.998 } }
      },
      {
        id: 'Alarma',
        label: 'Alarma',
        padres: ['Robo', 'Terremoto'],
        estados: ['Si', 'No'],
        posicion: { x: 225, y: 200 },
        cpt: {
          padres: ['Robo', 'Terremoto'],
          estados: ['Si', 'No'],
          tabla: {
            'Si,Si,Si': 0.95, 'Si,Si,No': 0.05,
            'Si,No,Si': 0.94, 'Si,No,No': 0.06,
            'No,Si,Si': 0.29, 'No,Si,No': 0.71,
            'No,No,Si': 0.001, 'No,No,No': 0.999
          }
        }
      },
      {
        id: 'JuanLlama',
        label: 'Juan Llama',
        padres: ['Alarma'],
        estados: ['Si', 'No'],
        posicion: { x: 100, y: 320 },
        cpt: {
          padres: ['Alarma'],
          estados: ['Si', 'No'],
          tabla: {
            'Si,Si': 0.90, 'Si,No': 0.10,
            'No,Si': 0.05, 'No,No': 0.95
          }
        }
      },
      {
        id: 'MariaLlama',
        label: 'María Llama',
        padres: ['Alarma'],
        estados: ['Si', 'No'],
        posicion: { x: 350, y: 320 },
        cpt: {
          padres: ['Alarma'],
          estados: ['Si', 'No'],
          tabla: {
            'Si,Si': 0.70, 'Si,No': 0.30,
            'No,Si': 0.01, 'No,No': 0.99
          }
        }
      }
    ],
    conexiones: [
      { from: 'Robo', to: 'Alarma' },
      { from: 'Terremoto', to: 'Alarma' },
      { from: 'Alarma', to: 'JuanLlama' },
      { from: 'Alarma', to: 'MariaLlama' }
    ]
  }
];