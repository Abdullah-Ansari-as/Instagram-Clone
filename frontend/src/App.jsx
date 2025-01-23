import { createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import Signup from './components/Signup'
import MainLayout from './components/MainLayout'
import Login from './components/Login'
import Home from './components/Home'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'

function App() {

  
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <Home />
          },
          {
            path: "/profile/:id",
            element: <Profile />
          },
          {
            path: "/account/edit",
            element: <EditProfile />
          }
        ]
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      },
    ]
  )

  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
