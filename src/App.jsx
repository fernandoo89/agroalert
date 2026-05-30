import AppRouter from './js/router';
import ErrorBoundary from './components/ErrorBoundary';
import InstallPrompt from './components/InstallPrompt';
import OfflineIndicator from './components/OfflineIndicator';

function App() {
  return (
    <ErrorBoundary>
      <AppRouter />
      <InstallPrompt />
      <OfflineIndicator />
    </ErrorBoundary>
  );
}

export default App;
