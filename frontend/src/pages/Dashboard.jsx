import React, { useState } from 'react';
import "./Dashboard.css";
export default function Dashboard() {
  // Dados estáticos de estatísticas
  const stats = {
    open: 23,
    in_progress: 7,
    solved_today: 12,
  };

  // Dados estáticos de tabela
  const [tickets] = useState([
    { id: 1, status: 'Aberto', category: 'TI', technician: 'Carlos', solvedate: '2025-08-01', closedate: '2025-08-02' },
    { id: 2, status: 'Em Atendimento', category: 'Financeiro', technician: 'Ana', solvedate: '2025-08-03', closedate: '2025-08-04' },
    { id: 3, status: 'Fechado', category: 'RH', technician: 'Felipe', solvedate: '2025-08-05', closedate: '2025-08-06' },
  ]);

  // Função para limpar filtros (para exemplo)
  const reset = () => {
    console.log('Filtros limpos');
    // Aqui você pode resetar o estado dos filtros
  };

  return (
    <div className="dashboard-container">
      <header>
        <h1>GLPI — Painel</h1>
      
      </header>
      
      {/* Cards de Estatísticas */}
      <div className="cards-container">
        <div className="card">
          <div className="card-title">Chamados Abertos</div>
          <div className="card-value">{stats.open}</div>
        </div>
        <div className="card">
          <div className="card-title">Em Atendimento</div>
          <div className="card-value">{stats.in_progress}</div>
        </div>
        <div className="card">
          <div className="card-title">Realizados Hoje</div>
          <div className="card-value">{stats.solved_today}</div>
        </div>
      </div>

      {/* Filtros */}
      {/* <div className="filters-container">
        <div className="filters-header">
          <h2 className="filters-title">Filtros</h2>
          <button onClick={reset} className="clear-filters-button">
            Limpar Filtros
          </button>
        </div>
        <div className="filters-grid">
          <div className="filter-container">
            <label className="filter-label">Status</label>
            <input
              className="filter-input"
              placeholder="Ex: Aberto, Em Atendimento, Fechado"
            />
          </div>
          <div className="filter-container">
            <label className="filter-label">Técnico</label>
            <input
              className="filter-input"
              placeholder="Ex: Carlos, Ana"
            />
          </div>
          <div className="filter-container">
            <label className="filter-label">Categoria</label>
            <input
              className="filter-input"
              placeholder="Ex: TI, RH, Financeiro"
            />
          </div>
          <div className="filter-container">
            <label className="filter-label">Data</label>
            <input
              className="filter-input"
              type="date"
            />
          </div>
        </div>
      </div> */}

      {/* Tabela de Chamados */}
      <div className="table-container">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Categoria</th>
              <th>Técnico</th>
              <th>Data Resolvido</th>
              <th>Data Fechado</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.status}</td>
                <td>{ticket.category}</td>
                <td>{ticket.technician}</td>
                <td>{ticket.solvedate}</td>
                <td>{ticket.closedate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
