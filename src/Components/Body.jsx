import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Utils/Firebase';
import { addUser, removeUser } from '../Utils/userSlice';
import Landing from './Landing';
import Login from './Login';
import Browse from './Browse';
import Movies from './Movies';
import Shows from './Shows';
import NewAndPopular from './NewAndPopular';
import MyList from './MyList';
import Games from './Games';
import BrowseByLanguages from './BrowseByLanguages';
import ProtectedRoute from './ProtectedRoute';

const Body = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, photoURL } = user;
        dispatch(addUser({ uid, email, displayName, photoURL }));
      } else {
        dispatch(removeUser());
      }
    });

    return () => unsubscribe();
  }, []);

  const appRouter = createBrowserRouter([
    { path: "/", element: <Landing /> },
    { path: "/login", element: <Login /> },
    { path: "/browse", element: <ProtectedRoute><Browse /></ProtectedRoute> },
    { path: "/movies", element: <ProtectedRoute><Movies /></ProtectedRoute> },
    { path: "/shows", element: <ProtectedRoute><Shows /></ProtectedRoute> },
    { path: "/new-and-popular", element: <ProtectedRoute><NewAndPopular /></ProtectedRoute> },
    { path: "/my-list", element: <ProtectedRoute><MyList /></ProtectedRoute> },
    { path: "/games", element: <ProtectedRoute><Games /></ProtectedRoute> },
    { path: "/browse-by-languages", element: <ProtectedRoute><BrowseByLanguages /></ProtectedRoute> },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;