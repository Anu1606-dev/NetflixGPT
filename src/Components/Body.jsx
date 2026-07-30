import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Landing from './Landing';
import Login from './Login';
import Browse from './Browse';

const Body = () => {
  const appRouter = createBrowserRouter([
    { path: "/", element: <Landing /> },
    { path: "/login", element: <Login /> },
    { path: "/browse", element: <Browse /> },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;