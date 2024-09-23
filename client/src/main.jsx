import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './i18n';



import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './Pages/Home';
import Iiuc from './Pages/Iiuc';
import CreateQuiz from './Pages/CreateQuiz';
import ParticipateQuiz from './Pages/ParticipateQuiz';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/iiuc",
    element: <Iiuc/>,
  },
  {
    path: "/quiz",
    element: <CreateQuiz/>,
  },
  {
    path: "/quiz/:id",
    element: <ParticipateQuiz />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>,
)
