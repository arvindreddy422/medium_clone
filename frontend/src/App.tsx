import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Blog } from './pages/Blog'
import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
import { Blogs } from './pages/Blogs'
import { Publish } from './pages/Publish'
import AuthLayer from './components/AuthLayer'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Blogs />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route
            path="/blog/:id"
            element={
              <AuthLayer>
                <Blog />
              </AuthLayer>
            }
          />
          <Route
            path="/blogs"
            element={
              <AuthLayer>
                <Blogs />
              </AuthLayer>
            }
          />
          <Route
            path="/publish"
            element={
              <AuthLayer>
                <Publish />
              </AuthLayer>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
