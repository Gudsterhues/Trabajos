import { useState } from 'react'

const MenuItem = ({ nodo, onSeleccionar, nivel = 0 }) => {
  const [abierto, setAbierto] = useState(nivel === 0)

  const tieneHijos = nodo.hijos.length > 0

  const handleClick = () => {
    onSeleccionar(nodo)

    if (tieneHijos) {
      setAbierto(!abierto)
    }
  }

  return (
    <div>
      <div
        className="menu-item"
        style={{ paddingLeft: `${12 + nivel * 18}px` }}
        onClick={handleClick}
      >
        <span>{nodo.titulo}</span>
        {tieneHijos && <span>{abierto ? '−' : '+'}</span>}
      </div>

      {abierto &&
        nodo.hijos.map((hijo, index) => (
          <MenuItem
            key={index}
            nodo={hijo}
            onSeleccionar={onSeleccionar}
            nivel={nivel + 1}
          />
        ))}
    </div>
  )
}

export default MenuItem