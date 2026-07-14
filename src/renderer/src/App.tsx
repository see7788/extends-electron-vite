import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'

function App(): React.JSX.Element {
  return (
    <BrowserRouter basename="/renderer">
      <Routes>
        <Route
          path="/a"
          element={
            <div>
              a
              <div style={{ marginTop: 16 }}>
                <Link to="/">回到默认</Link>
              </div>
            </div>
          }
        />
        <Route
          path="*"
          element={
            <div>
              默认
              <div style={{ marginTop: 16 }}>
                <Link to="/a">到 /a</Link>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
