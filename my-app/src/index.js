import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import MakePlaylist from './components/MakePlaylist';
import Playlists from './components/Playlists';
import Root, { loader as rootLoader } from './components/Root/root';
import About from './components/About';
import Playlist, {loader as playlistLoader} from './components/Playlist';
import AddSongsPage from './components/AddSongsPage';

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      loader: rootLoader,
      children: [
        {
          path: "about",
          element: <About/>
        },
        {
          path: "playlists",
          element: <Playlists />,
        },
        {
          path: "playlists/:playlistId",
          element: <Playlist/>,
          loader: playlistLoader
        },
        {
          path: "make-playlist",
          element: <MakePlaylist />,
        },
        {
          path: "add-songs",
          element: <AddSongsPage />,
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
          element: <AddSongsPage />,
        },
        {
          path: "playlists",
          element: <Playlists />,
        },
        {
          path: "playlists/:playlistId",
          element: <Playlist/>,
          loader: playlistLoader
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
