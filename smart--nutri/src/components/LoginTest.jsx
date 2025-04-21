import axios from 'axios';
import { useEffect, useState } from 'react';

export function LoginTest() {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/login/')
      .then(res => setResponse(res.data))
      .catch(err => console.error('Erro ao conectar:', err));
  }, []);

  return (
    <div>
      <h1>Resposta do Backend</h1>
      <pre>{JSON.stringify(response, null, 2)}</pre>
    </div>
  );
}
