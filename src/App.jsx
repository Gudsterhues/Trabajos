import './App.css'
import BinaryTree from './BinaryTree'
import { numerosIniciales } from './data'

function App() {
  return (
    <BinaryTree initialValues={numerosIniciales} />
  )
}

export default App