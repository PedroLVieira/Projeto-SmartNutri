import axios from 'axios';
import { useEffect, useState } from 'react';

export function UserList() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/usuarios/')
      .then(response => setUsuarios(response.data))
      .catch(error => console.error('Erro ao buscar usuários:', error));
  }, []);

  return (
    <div>
      <h1>Lista de Usuários</h1>
      <ul>
        {usuarios.map((usuario, index) => (
          <li key={index}>{usuario.nome}</li>
        ))}
      </ul>
    </div>
  );
}
