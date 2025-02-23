import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>The ATL MARTA AVIS Display, George's Version.</h1>
      <p>Note that this is not endorsed or affiliated with MARTA in any way. This project uses the publicly available MARTA Train API.</p>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Work in Progress!
        </p>
      </div>
      <p className="read-the-docs">
        This project is created with Vite and uses React. Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
