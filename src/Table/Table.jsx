import TableHead from './TableHead';
import TableBody from './TableBody';

function Table({ itens, onEdit, onDelete }) {
  const headers = itens && itens.length > 0
    ? Object.keys(itens[0]).filter(header => header !== 'isEmployee')
    : [];

  const filteredItens = itens.map(item => {
    const { isEmployee, ...filteredItem } = item;
    return filteredItem;
  });

  return (
    <div className="container">
      <table className="table">
        <TableHead headers={headers} />
        <TableBody
          values={filteredItens}
          headers={headers}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </table>
    </div>
  );
}

export default Table;
