import { useState, useEffect } from 'react';

export default function useTokenParam() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    setToken(token);
  }, []);

  return token;
}
