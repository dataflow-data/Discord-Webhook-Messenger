
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4 py-10 max-w-md mx-auto animate-fade-in">
        <span className="inline-block px-2.5 py-1 bg-accent text-accent-foreground rounded-full text-xs font-medium tracking-wide mb-4">
          Error 404
        </span>
        <h1 className="text-4xl font-semibold tracking-tight mb-4">Page not found</h1>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
