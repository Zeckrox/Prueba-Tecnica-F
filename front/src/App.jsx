import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('MiClaveSecreta123');
  const [accountId, setAccountId] = useState(999);
  const [showModal, setShowModal] = useState(true);
  const [balance, setBalance] = useState(null)
  const [movements, setMovements] = useState([])
  const [quantity, setQuantity] = useState(null)
  const [alert, setAlert] = useState(null)
  const [filteredMovements, setFilteredMovements] = useState([])
  const [filters, setFilters] = useState(
    {
      fecha:"Predeterminado",
      monto:"Predeterminado"
  })
  const API_URL = `http://127.0.0.1:8000`

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const obtenerDatos = async () => {
      try {
        const response = await fetch(API_URL+"/consultar", {
          method: 'POST',
          body: JSON.stringify({
          account_id: accountId,
          api_key: apiKey  
        })
        });
        if (response.status === 401) return setAlert("API KEY Invalida")
        const data = await response.json();
        console.log("Data:", data);
        
        setBalance(data.balance)
        setMovements(data.movements)
        setFilteredMovements(data.movements)
        setQuantity(data.total_movements)

        
      setShowModal(false);
      } catch (error) {
        console.error("Error:", error)
      }
    }
    obtenerDatos()
  };

  useEffect(() => {
    let fecha = filters.fecha
    let monto = filters.monto
    if (fecha != "Predeterminado"){
      setFilteredMovements(movements.toSorted((a,b)=>{
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if(fecha == "Recientes") return dateB - dateA;
          else return dateA - dateB
      }))
    }else if (monto != "Predeterminado"){
      setFilteredMovements(movements.toSorted((a,b)=>{
        const amountA = a.amount;
        const amountB = b.amount;
        if(monto == "Mayor a menor") return amountB - amountA;
          else return amountA - amountB
      }))
    }else{
      setFilteredMovements(movements)
    }
  }, [filters]);

  return (
    <>
      <div className='header' onClick={()=> console.log(movements)}>
          <h1>BankApp</h1>
          <div>
            <button className='button' style={{background: '#b92d5a'}}>Cerrar sesión</button>
          </div>
      </div>
      <div className='balance-container'>

        <div>
          <h2>Balance:</h2>
          <p style={balance >= 0? {color: 'black'}: {color:"red"}}>
            {balance !== null ? `$${balance}` : '...'}
          </p>
        </div>

        <div>
          <h2>Movimientos:</h2>
          <p>
            {quantity !== null ? `${quantity}` : '...'}
          </p>
        </div>

        <div>
          <h2>Cuenta:</h2>
          <p>
            {!showModal? `Usuario #${accountId}` : '...'}
          </p>
        </div>

      </div>

      <div className='movements-container'>
        <h2>Movimientos</h2>
        <div className='filters'>
          <div>Ordenar por:</div>
          <div>
            <label>Fecha</label>
            <select value={filters.fecha} onChange={(e)=> setFilters({monto: "Predeterminado", fecha: e.target.value })}>
              <option>Predeterminado</option>
              <option>Recientes</option>
              <option>Antiguos</option>
            </select>
          </div>

          <div>
            <label >Monto</label>
            <select value={filters.monto}  onChange={(e)=> setFilters({fecha: "Predeterminado", monto: e.target.value })}>
              <option>Predeterminado</option>
              <option>Mayor a menor</option>
              <option>Menor a mayor</option>
            </select>
          </div>
        </div>
        <table className='movements-table'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredMovements.map((mov)=>{
              return(
              <tr key={mov.date+mov.amount+mov.description}>
                <td>{mov.date}</td>
                <td>{mov.description}</td>
                <td style={mov.amount >= 0? {color: '#00b500', fontWeight:'bold'}: {color:"red", fontWeight:'bold'}}>{mov.amount}</td>
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {showModal &&
        <div className='modal-background'>
          <div className="modal">
              <form onSubmit={handleSubmit}>
                <h2>Crendeciales:</h2>
                <span style={{fontWeight:'bold', color: 'red', marginBottom:'5px', visibility: alert? "visible": "hidden"}}>¡{alert}!</span>
                <div className="form-group">
                  <label htmlFor="apiKey">API Key</label>
                  <input
                    type="text"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="accountId">Account ID</label>
                  <input
                    type="text"
                    id="accountId"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="input"
                  />
                </div>
                <button type="submit" className="button">
                  Submit
                </button>
              </form>
            </div>
        </div>
      }
    </>
  );
}

export default App;
