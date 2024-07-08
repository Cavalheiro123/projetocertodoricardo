import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import api from '../api.js';
import '../App.css';
import '../List.css';

function List() {
  const [book, setBook] = useState({
    id: null,
    name: '',
    image_url: '',
    genreId: 0,
    authorsId: []
  });
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'authorsId') {
      setBook(prevBook => ({
        ...prevBook,
        authorsId: [parseInt(value)]
      }));
    } else {
      setBook(prevBook => ({
        ...prevBook,
        [name]: name === 'genreId' ? parseInt(value) : value
      }));
    }
  };


  const cadastrar = async () => {
    try {
      // Validation checks
      if (book.name === '') {
        Swal.fire({
          icon: 'error',
          title: 'Nome não pode ser vazio'
        });
        return;
      } else if (book.image_url === '') {
        Swal.fire({
          icon: 'error',
          title: 'Image URL não pode ser vazio'
        });
        return;
      } else if (book.genreId === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Selecione um gênero'
        });
        return;
      } else if (book.authorsId.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Selecione um autor'
        });
        return;
      }

      
      if (isEditing) {
        const { id, ...bookToUpdate } = book;
        await api.put(`book/${id}`, bookToUpdate);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Livro atualizado com sucesso',
          showConfirmButton: false,
          timer: 5000
        });
      } else {
        const { id, ...bookToCreate } = book;
        await api.post('book', bookToCreate);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Cadastro efetuado com sucesso',
          showConfirmButton: false,
          timer: 5000
        });
      }

     
      setBook({
        id: null,
        name: '',
        image_url: '',
        genreId: 0,
        authorsId: []
      });
      setIsEditing(false);
      getBooks();
    } catch (error) {
      console.error('Erro ao cadastrar/atualizar livro:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: isEditing ? 'Erro na tentativa de atualização' : 'Erro na tentativa de cadastro',
        text: 'Erro ao efetuar a operação: ' + JSON.stringify(error.response?.data || error.message)
      });
    }
  };

  
  const getBooks = async () => {
    try {
      const response = await api.get('book');
      setBooks(response.data);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
    }
  };

 
  const getGenres = async () => {
    try {
      const response = await api.get('genre');
      setGenres(response.data);
    } catch (error) {
      console.error('Erro ao buscar gêneros:', error);
    }
  };

  
  const getAuthors = async () => {
    try {
      const response = await api.get('authors');
      setAuthors(response.data);
    } catch (error) {
      console.error('Erro ao buscar autores:', error);
    }
  };

 
  const onDelete = (id) => {
    Swal.fire({
      title: 'Tem certeza que deseja excluir?',
      text: 'Não será possível reverter!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Não, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`book/${id}`)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Excluído com sucesso'
            });
            getBooks();
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Livro não encontrado'
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Erro ao excluir o livro'
              });
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelado',
          icon: 'error'
        });
      }
    });
  };

  const onEdit = (livro) => {
    setBook({
      id: livro.id,
      name: livro.name,
      image_url: livro.image_url,
      genreId: livro.genreId,
      authorsId: livro.authors.map(author => author.id)
    });
    setIsEditing(true);
  };

  
  useEffect(() => {
    getBooks();
    getGenres();
    getAuthors();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1>Livros</h1>
        <Link to="/" className="btn-home">
          <button>Voltar para Home</button>
        </Link>
      </div>
      <form>
        <input
          type="text"
          name="name"
          value={book.name}
          onChange={handleChange}
          placeholder="Digite o nome do livro"
        />
        <input
          type="text"
          name="image_url"
          value={book.image_url}
          onChange={handleChange}
          placeholder="Digite o URL da imagem"
        />
        <select name="genreId" value={book.genreId} onChange={handleChange}>
          <option value="0">Selecione o Gênero</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
        <select name="authorsId" value={book.authorsId[0] || ''} onChange={handleChange}>
          <option value="">Selecione o Autor</option>
          {authors.map(author => (
            <option key={author.id} value={author.id}>{author.name}</option>
          ))}
        </select>
        <button type="button" onClick={cadastrar}>
          {isEditing ? 'Salvar' : 'Cadastrar'}
        </button>
      </form>
      <div className="lista">
        {books.map(livro => (
          <div key={livro.id} className="item">
            <img src={livro.image_url} alt={livro.name} />
            <h2>{livro.name}</h2>
            <p>Gênero: {genres.find(genre => genre.id === livro.genreId)?.name}</p>
            <p>Autor(es): {livro.authors.map(author => author.name).join(', ')}</p>
            <button onClick={() => onEdit(livro)}>Editar</button>
            <button onClick={() => onDelete(livro.id)}>Deletar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default List;
