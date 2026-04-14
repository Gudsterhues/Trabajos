const NodoVisual = ({ nodo }) => {
  if (!nodo) return null

  return (
    <div className="nodo-visual">
      <div className="nodo-caja">{nodo.titulo}</div>

      {nodo.hijos.length > 0 && (
        <div className="nodo-hijos">
          {nodo.hijos.map((hijo, index) => (
            <NodoVisual key={index} nodo={hijo} />
          ))}
        </div>
      )}
    </div>
  )
}

export default NodoVisual