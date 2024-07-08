function TableHead({ headers }) {
  return (
    <thead>
      <tr>
        {headers.map((key) => {
          return <th key={key}>{key}</th>;
        })}
      </tr>
    </thead>
  );
}

export default TableHead;
