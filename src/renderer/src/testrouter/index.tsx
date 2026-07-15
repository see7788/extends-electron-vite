import { Link,Outlet, Route, Routes } from 'react-router-dom'
// export default function TestRouter() {
//     return (
//         <Routes>
//             <Route
//                 path="/a"
//                 element={<div>a </div> }
//             />
//             <Route
//                 path="*"
//                 element={<Link to="/a">鍒?/a</Link>}
//             />
//         </Routes>
//     )
// }

export default function TestRouter() {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link to="a">到 a</Link>
      </div>
      <Outlet />
    </div>
  )
}
