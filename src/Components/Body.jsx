import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Utils/Firebase';
import { addUser, removeUser } from '../Utils/userSlice';
import useMyListSync from '../hooks/useMyListSync';
import useContinueWatchingSync from '../hooks/useContinueWatchingSync';
import useChatHistorySync from '../hooks/useChatHistorySync';
import ProtectedRoute from './ProtectedRoute';
import LoadingScreen from './LoadingScreen';

const Landing = lazy(() => import('./Landing'));
const Login = lazy(() => import('./Login'));
const Browse = lazy(() => import('./Browse'));
const Movies = lazy(() => import('./Movies'));
const Shows = lazy(() => import('./Shows'));
const NewAndPopular = lazy(() => import('./NewAndPopular'));
const MyList = lazy(() => import('./MyList'));
const Games = lazy(() => import('./Games'));
const BrowseByLanguages = lazy(() => import('./BrowseByLanguages'));
const Notifications = lazy(() => import('./Notifications'));
const InfoPage = lazy(() => import('./InfoPage'));

const withSuspense = (Component) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
);

const Body = () => {
  const dispatch = useDispatch();
  useMyListSync();
  useContinueWatchingSync();
  useChatHistorySync();

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
  }, [dispatch]);

  const appRouter = createBrowserRouter([
    { path: "/", element: withSuspense(Landing) },
    { path: "/login", element: withSuspense(Login) },
    { path: "/browse", element: <ProtectedRoute>{withSuspense(Browse)}</ProtectedRoute> },
    { path: "/movies", element: <ProtectedRoute>{withSuspense(Movies)}</ProtectedRoute> },
    { path: "/shows", element: <ProtectedRoute>{withSuspense(Shows)}</ProtectedRoute> },
    { path: "/new-and-popular", element: <ProtectedRoute>{withSuspense(NewAndPopular)}</ProtectedRoute> },
    { path: "/my-list", element: <ProtectedRoute>{withSuspense(MyList)}</ProtectedRoute> },
    { path: "/games", element: <ProtectedRoute>{withSuspense(Games)}</ProtectedRoute> },
    { path: "/browse-by-languages", element: <ProtectedRoute>{withSuspense(BrowseByLanguages)}</ProtectedRoute> },
    { path: "/notifications", element: <ProtectedRoute>{withSuspense(Notifications)}</ProtectedRoute> },
    { path: "/info/:slug", element: withSuspense(InfoPage) },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;