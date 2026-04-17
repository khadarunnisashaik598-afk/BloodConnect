import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "50px",
          textAlign: "center",
          color: "white",
          background: "rgba(179,0,0,0.1)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <h2 style={{ fontSize: "3rem" }}>⚠️ Something went wrong</h2>
          <p style={{ fontSize: "1.2rem", margin: "20px 0" }}>
            The application encountered an error. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 30px",
              background: "#b30000",
              color: "white",
              border: "none",
              borderRadius: "25px",
              cursor: "pointer",
              fontSize: "1.1rem"
            }}
          >
            🔄 Refresh Page
          </button>
          
          <details style={{ marginTop: "40px", whiteSpace: "pre-wrap", textAlign: "left", maxWidth: "800px", opacity: 0.5 }}>
            <summary>Error Details (Technical)</summary>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
