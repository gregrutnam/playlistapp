import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import MakePlaylist from './components/MakePlaylist';
import AddSongs from './components/AddSongs';
import Playlists from './components/Playlists';
import Root from './components/Root/root';
import About from './components/About';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: "about",
          element: <About/>
        },
        {
          path: "make-playlist",
          element: <MakePlaylist />,
        },
        {
          path: "add-songs",
          element: <AddSongs />,
        },
      ]
    },

    {
      path: "callback",
      element: <Root />,
      children: [
        {
          path: "make-playlist",
          element: <MakePlaylist />,
        },
        {
          path: "add-songs",
          element: <AddSongs />,
        },
        {
          path: "playlists",
          element: <Playlists />,
        },
        {
          path: "about",
          element: <About/>
        }
      ]
    },
  ])

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
