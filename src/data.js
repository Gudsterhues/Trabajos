import { Nodo, ArbolNario } from './nodos'

const raiz = new Nodo('Operaciones Árbol N-ario', '/', 'inicio')

const agregar = new Nodo('Agregar', '/agregar', 'agregar')
const agregarNodo = new Nodo('Agregar nodo', '/agregar/nodo', 'agregarNodo')
const agregarHijo = new Nodo('Agregar hijo', '/agregar/hijo', 'agregarHijo')

const recorridos = new Nodo('Recorridos', '/recorridos', 'recorridos')
const dfs = new Nodo('DFS', '/recorridos/dfs', 'dfs')
const bfs = new Nodo('BFS', '/recorridos/bfs', 'bfs')

const consultas = new Nodo('Consultas', '/consultas', 'consultas')
const verRaiz = new Nodo('Ver raíz', '/consultas/raiz', 'verRaiz')
const verHijos = new Nodo('Ver hijos', '/consultas/hijos', 'verHijos')

const acciones = new Nodo('Acciones', '/acciones', 'acciones')
const mostrarArbol = new Nodo('Mostrar árbol', '/acciones/mostrar', 'mostrarArbol')
const limpiar = new Nodo('Limpiar árbol', '/acciones/limpiar', 'limpiar')

agregar.agregarHijo(agregarNodo)
agregar.agregarHijo(agregarHijo)

recorridos.agregarHijo(dfs)
recorridos.agregarHijo(bfs)

consultas.agregarHijo(verRaiz)
consultas.agregarHijo(verHijos)

acciones.agregarHijo(mostrarArbol)
acciones.agregarHijo(limpiar)

raiz.agregarHijo(agregar)
raiz.agregarHijo(recorridos)
raiz.agregarHijo(consultas)
raiz.agregarHijo(acciones)

const menuTree = new ArbolNario(raiz)

export default menuTree