import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import api from '../api';
import '../App.css';

const List = () => {
  const [genre, setGenre] = useState({ id: '', name: '' });
  const [genres, setGenres] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGenre((prevGenre) => ({ ...prevGenre, [name]: value }));
  };

  const saveGenre = async () => {
    if (!genre.name) {
      toast.error('Nome não pode ser vazio');
      return;
    }

    const action = isEditing ? api.put : api.post;
    const url = isEditing ? `genre/${genre.id}` : 'genre';
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    console.log('Salvando gênero:', { name: genre.name });

    try {
      const response = await action(url, { name: genre.name }, { headers });
      console.log('Resposta da API:', response);
      const successMessage = isEditing ? 'Gênero alterado com sucesso' : 'Gênero cadastrado com sucesso';
      Swal.fire('Sucesso!', successMessage, 'success');
      resetForm();
      fetchGenres();
    } catch (error) {
      console.error('Erro ao salvar gênero:', error);
      Swal.fire('Erro!', error.message, 'error');
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await api.get('genre', {
        headers: {
          'Accept': 'application/json',
        },
      });
      console.log('Gêneros recebidos:', response.data);
      setGenres(response.data);
    } catch (error) {
      console.error('Erro ao buscar gêneros:', error);
    }
  };

  const editGenre = async (id) => {
    try {
      const response = await api.get(`genre/${id}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      console.log('Gênero para editar:', response.data);
      setGenre(response.data);
      setIsEditing(true);
    } catch (error) {
      console.error('Erro ao buscar gênero:', error);
      Swal.fire('Erro!', error.message, 'error');
    }
  };

  const deleteGenre = (id) => {
    Swal.fire({
      title: 'Tem certeza que deseja excluir?',
      text: 'Não será possível reverter!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`genre/${id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
          console.log('Resposta da exclusão:', response);
          toast.success('Gênero excluído com sucesso.');
          fetchGenres();
        } catch (error) {
          console.error('Erro ao deletar gênero:', error);
          Swal.fire('Erro!', error.message, 'error');
        }
      }
    });
  };

  const resetForm = () => {
    setGenre({ id: '', name: '' });
    setIsEditing(false);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Gêneros</h1>
        <Link to="/" className="btn-home">
          <button>Voltar para Home</button>
        </Link>
      </header>
      <form>
        <input
          type="text"
          name="name"
          value={genre.name}
          onChange={handleInputChange}
          placeholder="Digite o nome do gênero"
        />
        <button type="button" onClick={saveGenre}>
          {isEditing ? 'Salvar' : 'Cadastrar'}
        </button>
      </form>
      <ToastContainer />
      <div className="lista">
        {genres.map((genre) => (
          <div key={genre.id} className="item">
            <h2>{genre.name}</h2>
            <p>ID: {genre.id}</p>
            <button onClick={() => editGenre(genre.id)}>Editar</button>
            <button onClick={() => deleteGenre(genre.id)}>Deletar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
