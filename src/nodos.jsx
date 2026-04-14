export class Nodo {
  constructor(titulo, link = '/', componente = null) {
    this.titulo = titulo
    this.link = link
    this.componente = componente
    this.hijos = []
  }

  agregarHijo(nodo) {
    this.hijos.push(nodo)
  }
}

export class ArbolNario {
  constructor(raiz = null) {
    this.raiz = raiz
  }

  dfs(node = this.raiz) {
    if (!node) return

    console.log(node.titulo)

    for (const hijo of node.hijos) {
      this.dfs(hijo)
    }
  }

  bfs() {
    if (!this.raiz) return

    const cola = [this.raiz]

    while (cola.length > 0) {
      const nodoActual = cola.shift()
      console.log(nodoActual.titulo)
      cola.push(...nodoActual.hijos)
    }
  }
}