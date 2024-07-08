function TableBody({ values, headers, onEdit, onDelete }) {
  return (
    <tbody>
      {values.map((item, index) => {
        return (
          item && (
            <tr key={index}>
              {headers.map((header) => {
                if (Array.isArray(item[header])) {
                  return (
                    <td key={header}>
                      <div>
                      {item[header].map((book, i) => (
                        <div key={i}>
                          <img src={book.image_url} alt={book.name}/>
                          <p>{book.name}</p>
                        </div>
                      ))}
                      </div>
                    </td>
                  );
                } else 
                return (
                  <td key={header}>
                    {typeof item[header] === 'object' ? JSON.stringify(item[header]) : item[header]}
                  </td>
                );
              })}
              <td>
                <div>
                  <button onClick={() => onEdit(item['id'])}>Editar</button>
                </div>
                <div>
                  <button onClick={() => onDelete(item['id'])}>Excluir</button>
                </div>
              </td>
            </tr>
          )
        );
      })}
    </tbody>
  );
}

export default TableBody;
  