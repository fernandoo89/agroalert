import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log to console for local debugging; in production send to monitoring
    // eslint-disable-next-line no-console
    console.error('Unhandled error caught by ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-xl text-center bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Ha ocurrido un error</h2>
            <p className="text-gray-700 mb-4">Lo siento — algo falló al renderizar la aplicación. Revisa la consola para más detalles.</p>
            <details className="text-left text-xs text-gray-500 whitespace-pre-wrap">
              {String(this.state.error)}
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
