import type { RedBayesiana } from './tiposObed';

export const redesM: RedBayesiana[] = [
  {
    id: 'ejercicio_1',
    nombre: 'Ejercicio 1: Diagnóstico Médico',
    descripcion: 'Fumador -> Cáncer -> RayosX / Disnea',
    nodos: [
      { id: 'Fumador', label: 'Fumador', padres: [], estados: ['Si', 'No'], posicion: { x: 200, y: 60 }, cpt: { padres: [], estados: ['Si', 'No'], tabla: { 'Si': 0.3, 'No': 0.7 } } },
      { id: 'Cancer', label: 'Cáncer de Pulmón', padres: ['Fumador'], estados: ['Si', 'No'], posicion: { x: 200, y: 180 }, cpt: { padres: ['Fumador'], estados: ['Si', 'No'], tabla: { 'Si,Si': 0.1, 'Si,No': 0.9, 'No,Si': 0.01, 'No,No': 0.99 } } },
      { id: 'RayosX', label: 'Rayos X Positivo', padres: ['Cancer'], estados: ['Si', 'No'], posicion: { x: 100, y: 300 }, cpt: { padres: ['Cancer'], estados: ['Si', 'No'], tabla: { 'Si,Si': 0.9, 'Si,No': 0.1, 'No,Si': 0.2, 'No,No': 0.8 } } },
      { id: 'Disnea', label: 'Disnea', padres: ['Cancer'], estados: ['Si', 'No'], posicion: { x: 300, y: 300 }, cpt: { padres: ['Cancer'], estados: ['Si', 'No'], tabla: { 'Si,Si': 0.65, 'Si,No': 0.35, 'No,Si': 0.1, 'No,No': 0.9 } } }
    ],
    conexiones: [
      { from: 'Fumador', to: 'Cancer' },
      { from: 'Cancer', to: 'RayosX' },
      { from: 'Cancer', to: 'Disnea' }
    ]
  },
  {
    id: 'ejercicio_2',
    nombre: 'Ejercicio 2: Calidad de Software',
    descripcion: 'Habilidad -> Errores -> FalloPruebas',
    nodos: [
      { id: 'Habilidad', label: 'Habilidad Dev', padres: [], estados: ['Alta', 'Baja'], posicion: { x: 200, y: 60 }, cpt: { padres: [], estados: ['Alta', 'Baja'], tabla: { 'Alta': 0.7, 'Baja': 0.3 } } },
      { id: 'Errores', label: 'Bugs en Código', padres: ['Habilidad'], estados: ['Muchos', 'Pocos'], posicion: { x: 200, y: 180 }, cpt: { padres: ['Habilidad'], estados: ['Muchos', 'Pocos'], tabla: { 'Alta,Muchos': 0.1, 'Alta,Pocos': 0.9, 'Baja,Muchos': 0.6, 'Baja,Pocos': 0.4 } } },
      { id: 'FalloPruebas', label: 'Fallo en CI/CD', padres: ['Errores'], estados: ['Si', 'No'], posicion: { x: 200, y: 300 }, cpt: { padres: ['Errores'], estados: ['Si', 'No'], tabla: { 'Muchos,Si': 0.85, 'Muchos,No': 0.15, 'Pocos,Si': 0.05, 'Pocos,No': 0.95 } } }
    ],
    conexiones: [
      { from: 'Habilidad', to: 'Errores' },
      { from: 'Errores', to: 'FalloPruebas' }
    ]
  },
  {
    id: 'ejercicio_3',
    nombre: 'Ejercicio 3: Tráfico Urbano',
    descripcion: 'Clima y Obras -> Congestión',
    nodos: [
      { id: 'Clima', label: 'Clima Lluvia', padres: [], estados: ['Si', 'No'], posicion: { x: 100, y: 60 }, cpt: { padres: [], estados: ['Si', 'No'], tabla: { 'Si': 0.25, 'No': 0.75 } } },
      { id: 'Obras', label: 'Obras Viales', padres: [], estados: ['Si', 'No'], posicion: { x: 300, y: 60 }, cpt: { padres: [], estados: ['Si', 'No'], tabla: { 'Si': 0.15, 'No': 0.85 } } },
      { id: 'Congestion', label: 'Congestión Alta', padres: ['Clima', 'Obras'], estados: ['Si', 'No'], posicion: { x: 200, y: 200 }, cpt: { padres: ['Clima', 'Obras'], estados: ['Si', 'No'], tabla: { 'Si,Si,Si': 0.95, 'Si,Si,No': 0.05, 'Si,No,Si': 0.70, 'Si,No,No': 0.30, 'No,Si,Si': 0.60, 'No,Si,No': 0.40, 'No,No,Si': 0.10, 'No,No,No': 0.90 } } }
    ],
    conexiones: [
      { from: 'Clima', to: 'Congestion' },
      { from: 'Obras', to: 'Congestion' }
    ]
  },
  {
    id: 'ejercicio_4',
    nombre: 'Ejercicio 4: Rendimiento Académico',
    descripcion: 'Estudio y Asistencia -> Aprobado',
    nodos: [
      { id: 'Estudio', label: 'Horas de Estudio', padres: [], estados: ['Alto', 'Bajo'], posicion: { x: 100, y: 60 }, cpt: { padres: [], estados: ['Alto', 'Bajo'], tabla: { 'Alto': 0.6, 'Bajo': 0.4 } } },
      { id: 'Asistencia', label: 'Asistencia', padres: [], estados: ['Buena', 'Mala'], posicion: { x: 300, y: 60 }, cpt: { padres: [], estados: ['Buena', 'Mala'], tabla: { 'Buena': 0.8, 'Mala': 0.2 } } },
      { id: 'Aprobado', label: 'Examen Aprobado', padres: ['Estudio', 'Asistencia'], estados: ['Si', 'No'], posicion: { x: 200, y: 200 }, cpt: { padres: ['Estudio', 'Asistencia'], estados: ['Si', 'No'], tabla: { 'Alto,Buena,Si': 0.98, 'Alto,Buena,No': 0.02, 'Alto,Mala,Si': 0.80, 'Alto,Mala,No': 0.20, 'Bajo,Buena,Si': 0.50, 'Bajo,Buena,No': 0.50, 'Bajo,Mala,Si': 0.10, 'Bajo,Mala,No': 0.90 } } }
    ],
    conexiones: [
      { from: 'Estudio', to: 'Aprobado' },
      { from: 'Asistencia', to: 'Aprobado' }
    ]
  },
  {
    id: 'ejercicio_5',
    nombre: 'Ejercicio 5: Sistema Financiero',
    descripcion: 'Ingresos y Historial -> Aprobación Crédito',
    nodos: [
      { id: 'Ingresos', label: 'Ingresos Altos', padres: [], estados: ['Si', 'No'], posicion: { x: 100, y: 60 }, cpt: { padres: [], estados: ['Si', 'No'], tabla: { 'Si': 0.5, 'No': 0.5 } } },
      { id: 'Historial', label: 'Buen Historial', padres: [], estados: ['Si', 'No'], posicion: { x: 300, y: 60 }, cpt: { padres: [], estados: ['Si', 'No'], tabla: { 'Si': 0.7, 'No': 0.3 } } },
      { id: 'Credito', label: 'Crédito Aprobado', padres: ['Ingresos', 'Historial'], estados: ['Si', 'No'], posicion: { x: 200, y: 200 }, cpt: { padres: ['Ingresos', 'Historial'], estados: ['Si', 'No'], tabla: { 'Si,Si,Si': 0.95, 'Si,Si,No': 0.05, 'Si,No,Si': 0.60, 'Si,No,No': 0.40, 'No,Si,Si': 0.45, 'No,Si,No': 0.55, 'No,No,Si': 0.05, 'No,No,No': 0.95 } } }
    ],
    conexiones: [
      { from: 'Ingresos', to: 'Credito' },
      { from: 'Historial', to: 'Credito' }
    ]
  }
];