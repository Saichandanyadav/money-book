import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function usePageLoader() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true); 
    const timer = setTimeout(() => setLoading(false), 500); // minimal fallback delay
    return () => clearTimeout(timer);
  }, [location]);

  return loading;
}

