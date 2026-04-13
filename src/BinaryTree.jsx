import { useEffect, useMemo, useState } from 'react'
import Tree from 'react-d3-tree'
import TreeNode from './TreeNode'
import './BinaryTree.css'

const crearNodo = value => {
  return {
    value,
    left: null,
    right: null
  }
}

const insertarEnArbol = (node, value) => {
  if (node === null) return crearNodo(value)

  if (value === node.value) return node

  if (value < node.value) {
    return {
      ...node,
      left: insertarEnArbol(node.left, value)
    }
  }

  return {
    ...node,
    right: insertarEnArbol(node.right, value)
  }
}

const buscarEnArbol = (node, value) => {
  if (node === null) return false
  if (value === node.value) return true

  if (value < node.value) {
    return buscarEnArbol(node.left, value)
  }

  return buscarEnArbol(node.right, value)
}

const preOrder = (node, resultado = []) => {
  if (!node) return resultado

  resultado.push(node.value)
  preOrder(node.left, resultado)
  preOrder(node.right, resultado)

  return resultado
}

const inOrder = (node, resultado = []) => {
  if (!node) return resultado

  inOrder(node.left, resultado)
  resultado.push(node.value)
  inOrder(node.right, resultado)

  return resultado
}

const postOrder = (node, resultado = []) => {
  if (!node) return resultado

  postOrder(node.left, resultado)
  postOrder(node.right, resultado)
  resultado.push(node.value)

  return resultado
}

const convertirAD3 = node => {
  if (!node) return null

  const children = [convertirAD3(node.left), convertirAD3(node.right)].filter(Boolean)

  if (children.length > 0) {
    return {
      name: String(node.value),
      children
    }
  }

  return {
    name: String(node.value)
  }
}

const construirArbolDesdeLista = valores => {
  let raiz = null

  for (const valor of valores) {
    raiz = insertarEnArbol(raiz, valor)
  }

  return raiz
}

const BinaryTree = ({ initialValues }) => {
  const [root, setRoot] = useState(null)
  const [nuevoValor, setNuevoValor] = useState('')
  const [valorBusqueda, setValorBusqueda] = useState('')
  const [resultadoBusqueda, setResultadoBusqueda] = useState(null)

  useEffect(() => {
    const arbolInicial = construirArbolDesdeLista(initialValues)
    setRoot(arbolInicial)
  }, [initialValues])

  useEffect(() => {
    if (!root) return

    console.log('INORDER:', inOrder(root).join(' - '))
    console.log('POSTORDER:', postOrder(root).join(' - '))
    console.log('PREORDER:', preOrder(root).join(' - '))
  }, [root])

  const agregarNumero = () => {
    if (nuevoValor.trim() === '') return

    const numero = Number(nuevoValor)
    if (Number.isNaN(numero)) return

    setRoot(prevRoot => insertarEnArbol(prevRoot, numero))
    setNuevoValor('')
  }

  const buscarNumero = () => {
    if (valorBusqueda.trim() === '') return

    const numero = Number(valorBusqueda)
    if (Number.isNaN(numero)) return

    const existe = buscarEnArbol(root, numero)
    setResultadoBusqueda(existe)

    console.log(`¿El valor ${numero} está en el árbol?`, existe)
  }

  const dataD3 = useMemo(() => {
    const data = convertirAD3(root)
    return data ? [data] : []
  }, [root])

  return (
    <div className="binary-tree-page">
      <h1>Challenge 08 - Binary Tree</h1>

      <div className="controls">
        <div className="control-box">
          <h3>Insertar número</h3>
          <input
            type="number"
            value={nuevoValor}
            onChange={e => setNuevoValor(e.target.value)}
            placeholder="Ej: 55"
          />
          <button onClick={agregarNumero}>Insertar</button>
        </div>

        <div className="control-box">
          <h3>Buscar número</h3>
          <input
            type="number"
            value={valorBusqueda}
            onChange={e => setValorBusqueda(e.target.value)}
            placeholder="Ej: 40"
          />
          <button onClick={buscarNumero}>Buscar</button>

          {resultadoBusqueda !== null && (
            <p className="search-result">
              {resultadoBusqueda ? 'Sí está en el árbol' : 'No está en el árbol'}
            </p>
          )}
        </div>
      </div>

      <div className="prints">
        <h3>Recorridos</h3>
        <p><strong>InOrder:</strong> {root ? inOrder(root).join(' - ') : ''}</p>
        <p><strong>PostOrder:</strong> {root ? postOrder(root).join(' - ') : ''}</p>
        <p><strong>PreOrder:</strong> {root ? preOrder(root).join(' - ') : ''}</p>
      </div>

      <div className="preview-section">
        <div className="html-preview">
          <h3>Vista recursiva simple</h3>
          {root && <TreeNode node={root} />}
        </div>

        <div className="d3-preview">
          <h3>Vista con react-d3-tree</h3>
          <div className="tree-wrapper">
            {dataD3.length > 0 && (
              <Tree
                data={dataD3}
                orientation="vertical"
                translate={{ x: 350, y: 80 }}
                pathFunc="elbow"
                collapsible={false}
                separation={{ siblings: 1.5, nonSiblings: 2 }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BinaryTree