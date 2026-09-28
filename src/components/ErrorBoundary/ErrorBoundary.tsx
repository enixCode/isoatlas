import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  message: string | null;
}

// This library is embedded in someone else's page, so an exception thrown while
// rendering a malformed model would unmount the host application along with the
// editor. Styles are inline on purpose: the fallback must not depend on the
// theme provider, which sits below this boundary.
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { message: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { message: error.message };
  }

  render(): React.ReactNode {
    const { message } = this.state;
    const { children } = this.props;

    if (message === null) return children;

    return (
      <div
        role="alert"
        style={{
          padding: 16,
          fontFamily: 'sans-serif',
          fontSize: 13,
          lineHeight: 1.5,
          color: '#333'
        }}
      >
        <strong>The diagram could not be rendered.</strong>
        <div style={{ marginTop: 8 }}>{message}</div>
      </div>
    );
  }
}
