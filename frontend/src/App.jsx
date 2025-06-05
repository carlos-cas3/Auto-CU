import { useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import routes from './routes/routes.jsx';

function App() {
  const routing = useRoutes(routes);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {routing}
    </>
  );
}

export default App;
