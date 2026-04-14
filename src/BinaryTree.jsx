import { useState } from 'react'
import './BinaryTree.css'
import menuTree from './data'
import MenuItem from './menuItems'
import NodoVisual from './nodovisual'
import { Nodo, ArbolNario } from './nodos'

const BinaryTree = () => {
  const [seleccionado, setSeleccionado] = useState(menuTree.raiz)
  const [arbol, setArbol] = useState(new ArbolNario(null))
  const [nombreNodo, setNombreNodo] = useState('')
  const [nombrePadre, setNombrePadre] = useState('')
  const [resultado, setResultado] = useState('')

  const normalizarTexto = texto => texto.trim().toLowerCase()

  const refrescarArbol = raizActual => {
    setArbol(new ArbolNario(raizActual))
  }

  const buscarNodo = (node, titulo) => {
    if (!node) return null

    if (normalizarTexto(node.titulo) === normalizarTexto(titulo)) {
      return node
    }

    for (const hijo of node.hijos) {
      const encontrado = buscarNodo(hijo, titulo)
      if (encontrado) return encontrado
    }

    return null
  }

  const agregarNodoRaiz = () => {
    const tituloNuevo = nombreNodo.trim()
    if (!tituloNuevo) return

    const nuevo = new Nodo(tituloNuevo, '/', tituloNuevo)

    if (!arbol.raiz) {
      setArbol(new ArbolNario(nuevo))
      setResultado(`Se creó la raíz "${tituloNuevo}"`)
    } else {
      arbol.raiz.agregarHijo(nuevo)
      refrescarArbol(arbol.raiz)
      setResultado(`Se agregó "${tituloNuevo}" como hijo de la raíz`)
    }

    setNombreNodo('')
  }

  const agregarNodoAHijo = () => {
    if (!arbol.raiz) {
      setResultado('Primero debes crear la raíz del árbol')
      return
    }

    const tituloPadre = nombrePadre.trim()
    const tituloNuevo = nombreNodo.trim()

    if (!tituloPadre || !tituloNuevo) return

    const padre = buscarNodo(arbol.raiz, tituloPadre)

    if (!padre) {
      setResultado(`No se encontró el nodo padre "${tituloPadre}"`)
      return
    }

    const nuevo = new Nodo(tituloNuevo, '/', tituloNuevo)
    padre.agregarHijo(nuevo)

    refrescarArbol(arbol.raiz)
    setResultado(`Se agregó "${tituloNuevo}" como hijo de "${padre.titulo}"`)

    setNombreNodo('')
    setNombrePadre('')
  }

  const ejecutarDFS = () => {
    if (!arbol.raiz) {
      setResultado('No hay árbol para recorrer')
      return
    }

    const recorrido = []

    const dfs = node => {
      if (!node) return

      recorrido.push(node.titulo)

      for (const hijo of node.hijos) {
        dfs(hijo)
      }
    }

    dfs(arbol.raiz)

    setResultado(`DFS: ${recorrido.join(' -> ')}`)
    console.log('DFS:', recorrido)
  }

  const ejecutarBFS = () => {
    if (!arbol.raiz) {
      setResultado('No hay árbol para recorrer')
      return
    }

    const recorrido = []
    const cola = [arbol.raiz]

    while (cola.length > 0) {
      const actual = cola.shift()
      recorrido.push(actual.titulo)
      cola.push(...actual.hijos)
    }

    setResultado(`BFS: ${recorrido.join(' -> ')}`)
    console.log('BFS:', recorrido)
  }

  const mostrarVista = () => {
    switch (seleccionado.componente) {
      case 'inicio':
        return <h2>Selecciona una operación del menú</h2>

      case 'agregarNodo':
        return (
          <>
            <h2>Agregar nodo</h2>
            <input
              type="text"
              placeholder="Nombre del nodo"
              value={nombreNodo}
              onChange={e => setNombreNodo(e.target.value)}
            />
            <button onClick={agregarNodoRaiz}>Agregar</button>
          </>
        )

      case 'agregarHijo':
        return (
          <>
            <h2>Agregar hijo a un nodo</h2>
            <input
              type="text"
              placeholder="Nombre del padre"
              value={nombrePadre}
              onChange={e => setNombrePadre(e.target.value)}
            />
            <input
              type="text"
              placeholder="Nombre del nuevo hijo"
              value={nombreNodo}
              onChange={e => setNombreNodo(e.target.value)}
            />
            <button onClick={agregarNodoAHijo}>Agregar hijo</button>
          </>
        )

      case 'dfs':
        return (
          <>
            <h2>Recorrido DFS</h2>
            <button onClick={ejecutarDFS}>Ejecutar DFS</button>
          </>
        )

      case 'bfs':
        return (
          <>
            <h2>Recorrido BFS</h2>
            <button onClick={ejecutarBFS}>Ejecutar BFS</button>
          </>
        )

      case 'verRaiz':
        return (
          <>
            <h2>Raíz actual</h2>

            {!arbol.raiz ? (
              <p>No existe aún</p>
            ) : (
              <div className="arbol-visual">
                <div className="nodo-visual">
                  <div className="nodo-caja">{arbol.raiz.titulo}</div>
                </div>
              </div>
            )}
          </>
        )

      case 'verHijos':
        return (
          <>
            <h2>Hijos de la raíz</h2>

            {!arbol.raiz ? (
              <p>El árbol todavía no tiene raíz</p>
            ) : arbol.raiz.hijos.length === 0 ? (
              <p>La raíz no tiene hijos</p>
            ) : (
              <>
                <div className="arbol-visual">
                  <div className="nodo-hijos">
                    {arbol.raiz.hijos.map((hijo, index) => (
                      <div key={index} className="nodo-visual">
                        <div className="nodo-caja">{hijo.titulo}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <ul>
                  {arbol.raiz.hijos.map((hijo, index) => (
                    <li key={index}>{hijo.titulo}</li>
                  ))}
                </ul>
              </>
            )}
          </>
        )

      case 'mostrarArbol':
        return (
          <>
            <h2>Estructura actual del árbol</h2>
            <div className="arbol-visual">
              {arbol.raiz ? <NodoVisual nodo={arbol.raiz} /> : <p>No hay árbol todavía</p>}
            </div>
          </>
        )

      case 'limpiar':
        return (
          <>
            <h2>Limpiar árbol</h2>
            <button
              onClick={() => {
                setArbol(new ArbolNario(null))
                setNombreNodo('')
                setNombrePadre('')
                setResultado('Árbol reiniciado')
              }}
            >
              Limpiar
            </button>
          </>
        )

      default:
        return <h2>Opción no implementada</h2>
    }
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Operaciones</h2>
        <MenuItem nodo={menuTree.raiz} onSeleccionar={setSeleccionado} />
      </aside>

      <main className="content">
        {mostrarVista()}

        <div className="component-box">
          <h3>Resultado</h3>
          <p>{resultado}</p>
        </div>
      </main>
    </div>
  )
}

export default BinaryTree