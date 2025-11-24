import { useEffect, useState } from "react";
import "./App.css";
import userIcon from "./assets/user.png";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [accountId, setAccountId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(null);
  const [movements, setMovements] = useState([]);
  const [quantity, setQuantity] = useState(null);
  const [alert, setAlert] = useState(null);
  const [filteredMovements, setFilteredMovements] = useState([]);
  const [filters, setFilters] = useState({
    fecha: "Predeterminado",
    monto: "Predeterminado",
  });
  const API_URL = `http://127.0.0.1:8000`;

  const obtenerDatos = async (accId, apiK) => {
    try {
      const response = await fetch(API_URL + "/consultar", {
        method: "POST",
        body: JSON.stringify({
          account_id: accId,
          api_key: apiK,
        }),
      });
      if (response.status === 401) {
        setAlert("API KEY Invalida");
        setLoading(false);
        setShowModal(true);
        localStorage.removeItem("apiKey");
        localStorage.removeItem("accountId");
        return;
      }
      const data = await response.json();

      setBalance(data.balance);
      setMovements(data.movements);
      setFilteredMovements(data.movements);
      setQuantity(data.total_movements);

      localStorage.setItem("apiKey", apiK);
      localStorage.setItem("accountId", accId);

      setShowModal(false);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedApiKey = localStorage.getItem("apiKey");
    const storedAccountId = localStorage.getItem("accountId");

    setTimeout(() => {
      if (storedApiKey && storedAccountId) {
        setApiKey(storedApiKey);
        setAccountId(storedAccountId);
        obtenerDatos(storedAccountId, storedApiKey);
      } else {
        setLoading(false);
        setShowModal(true);
      }
    }, 1000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    obtenerDatos(accountId, apiKey);
  };

  const handleLogout = () => {
    localStorage.removeItem("apiKey");
    localStorage.removeItem("accountId");
    setApiKey("");
    setAccountId("");
    setBalance(null);
    setMovements([]);
    setFilteredMovements([]);
    setQuantity(null);
    setShowModal(true);
  };

  useEffect(() => {
    let fecha = filters.fecha;
    let monto = filters.monto;
    if (fecha != "Predeterminado") {
      setFilteredMovements(
        movements.toSorted((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (fecha == "Recientes") return dateB - dateA;
          else return dateA - dateB;
        })
      );
    } else if (monto != "Predeterminado") {
      setFilteredMovements(
        movements.toSorted((a, b) => {
          const amountA = a.amount;
          const amountB = b.amount;
          if (monto == "Mayor a menor") return amountB - amountA;
          else return amountA - amountB;
        })
      );
    } else {
      setFilteredMovements(movements);
    }
  }, [filters]);

  return (
    <div className="app">
      <div className="sidebar">
        <div>
          <h1>
            <b>Bank</b>App
          </h1>
          <div className="user">
            <img src={userIcon} alt="Logo del Banco" width="30" />
            <p>{!showModal ? `Usuario #${accountId}` : "..."}</p>
          </div>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="button"
            style={{ background: "#b92d5a", marginBottom: "50px" }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
      <div className="app-content">
        <div className="balance-container">
          <div>
            <h2>Balance Total</h2>
            <p style={balance >= 0 ? { color: "black" } : { color: "red" }}>
              {balance !== null
                ? `${balance < 0 ? "-" : ""}$${
                    balance < 0 ? balance * -1 : balance
                  }`
                : "..."}
            </p>
          </div>
        </div>

        <div className="movements-container">
          <div className="movements-header">
            <h2>
              Todos los Movimientos{" "}
              <span>({quantity !== null ? `${quantity}` : "..."})</span>
            </h2>
            <div className="filters">
              <div style={{ color: "#8e8e93" }}>Ordenar por:</div>
              <div>
                <label>Fecha</label>
                <select
                  value={filters.fecha}
                  onChange={(e) =>
                    setFilters({
                      monto: "Predeterminado",
                      fecha: e.target.value,
                    })
                  }
                >
                  <option>Predeterminado</option>
                  <option>Recientes</option>
                  <option>Antiguos</option>
                </select>
              </div>
              <div>
                <label>Monto</label>
                <select
                  value={filters.monto}
                  onChange={(e) =>
                    setFilters({
                      fecha: "Predeterminado",
                      monto: e.target.value,
                    })
                  }
                >
                  <option>Predeterminado</option>
                  <option>Mayor a menor</option>
                  <option>Menor a mayor</option>
                </select>
              </div>
            </div>
          </div>
          <table className="movements-table">
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Monto</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.map((mov) => {
                let date = new Date(mov.date);
                const options = {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                };

                return (
                  <tr key={mov.date + mov.amount + mov.description}>
                    <td>{mov.description}</td>
                    <td
                      style={
                        mov.amount >= 0
                          ? { color: "#00b500", fontWeight: "bold" }
                          : { color: "red", fontWeight: "bold" }
                      }
                    >
                      {mov.amount}
                    </td>
                    <td style={{ color: "#535862" }}>
                      {date.toLocaleDateString("es-ES", options)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {loading && (
        <div className="modal-background">
          <div className="spinner"></div>
        </div>
      )}
      {showModal && !loading && (
        <div className="modal-background">
          <div className="modal">
            <form onSubmit={handleSubmit}>
              <h2>Crendeciales:</h2>
              <span
                style={{
                  fontWeight: "bold",
                  color: "red",
                  marginBottom: "5px",
                  visibility: alert ? "visible" : "hidden",
                }}
              >
                ¡{alert}!
              </span>
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
                Continuar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
