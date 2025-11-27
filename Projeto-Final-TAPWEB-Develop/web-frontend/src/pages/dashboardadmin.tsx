import React from 'react';
import '../pages/styles/dashboardadmin.css';

const Navbar: React.FC = () => (
    <nav className="navbar-container">
        <div className="navbar-content">
            {/* Links/Navegação: Adicionado um link para voltar ao dashboard do usuário */}
            <div className="navbar-link-group">
                <a href="#sobre" className="navbar-link">Sobre Nós</a>
            </div>
            
            {/* Logo da Marca/Título com indicação Admin */}
            <a href="/" className="navbar-brand">
                🏆 Bolão da Rodada | Admin
            </a>
        </div>
    </nav>
);

const Footer: React.FC = () => (
    <footer className="footer-container">
        <div className="footer-content">
            <p className="footer-brand">Bolão da Rodada © 2025</p>
            <div className="footer-links">
                <a href="#termos" className="footer-link">Termos de Uso</a>
                <span className="footer-separator">|</span>
                <a href="#politica" className="footer-link">Política de Privacidade</a>
            </div>
        </div>
    </footer>
);

// Componente principal do Painel de Administração
const AdminDashboard: React.FC = () => {
    return (
        <div className="app-container">
            <Navbar />

            {/* Dashboard Content - Sem o Carousel conforme solicitado */}
            <div className="dashboard-card-wrapper">
                <div className="dashboard-card admin-dashboard-card">
                    
                    {/* Cabeçalho do Painel */}
                    <div className="header-container">
                        <div className="icon-container">
                            👑
                        </div>
                        <h1 className="title">Painel de Administração</h1>
                        <p className="subtitle">Ponto central para gerenciar o Bolão da Rodada.</p>
                    </div>

                    {/* Botões de Ação Administrativa (Grid) */}
                    <div className="admin-actions-grid">
                        
                        {/* Botão 1: Gerenciar Partidas */}
                        <a 
                            href="/admin/gerenciar-partidas" 
                            className="admin-action-button primary-button"
                        >
                            <span className="button-icon">🗓️</span>
                            <span className="button-text">Gerenciar Partidas</span>
                            <span className="button-description">Criar, editar ou excluir os jogos do bolão.</span>
                        </a>

                        {/* Botão 2: Apontar Resultados */}
                        <a 
                            href="/admin/apontar-resultados" 
                            className="admin-action-button primary-button secondary-color"
                        >
                            <span className="button-icon">✅</span>
                            <span className="button-text">Apontar Resultados</span>
                            <span className="button-description">Registrar placares finais e processar pontuações.</span>
                        </a>

                    </div>
                    
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default AdminDashboard;