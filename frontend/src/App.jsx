import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './components/Signup'
import MainLayout from './components/MainLayout'
import Login from './components/Login'
import Home from './components/Home'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import { io } from "socket.io-client"
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/RealTimeNotif'
import ProtectedRoutes from './components/ProtectedRoutes'
import Explore from './components/Explore'
import SeeAllSuggestedUsers from './components/SeeAllSuggestedUsers'


const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
      children: [
        {
          path: "/",
          element: <ProtectedRoutes><Home /></ProtectedRoutes>
        },
        {
          path: "/profile/:id",
          element: <ProtectedRoutes><Profile /></ProtectedRoutes>
        },
        {
          path: "/account/edit",
          element: <ProtectedRoutes><EditProfile /></ProtectedRoutes>
        },
        {
          path: "/chat",
          element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>
        },
        {
          path: "/explore/",
          element: <ProtectedRoutes><Explore /></ProtectedRoutes>
        },
        {
          path: "/explore/suggested-users",
          element: <ProtectedRoutes><SeeAllSuggestedUsers /></ProtectedRoutes>
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


function App() {

  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log(import.meta.env.VITE_REACT_APP_API_URL)
    if (user) {
      const socketio = io(import.meta.env.VITE_REACT_APP_API_URL, {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      // listening all the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      })

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }

    } else if(socket) {
      socket?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
