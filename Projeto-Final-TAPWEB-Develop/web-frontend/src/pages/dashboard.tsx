import React, { useState, useEffect, useMemo, useCallback } from 'react';
import futebol1Image from '../images/futebol1.png'
import futebol2Image from '../images/futebol2.png'
import futebol3Image from '../images/futebol3.png'
import type { Partida, Palpite, PalpiteEmEdicao } from '../types'; 
import '../pages/styles/App.css'; 

const Navbar: React.FC = () => (
    <nav className="navbar-container">
        <div className="navbar-content">
            {}
            <div className="navbar-link-group">
                <a href="#sobre" className="navbar-link">Sobre Nós</a>
            </div>
            
            {}
            <a href="/" className="navbar-brand">
                🏆 Bolão da Rodada
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

const carouselData = [
    { 
        id: 1, 
        image: futebol1Image, 
        title: "Novidades do Bolão", 
        caption: "Confira as estatísticas e as novas funcionalidades do Bolão!" 
    },
    { 
        id: 2, 
        image: futebol2Image, 
        title: "Hora do Palpite", 
        caption: "Não se esqueça de palpitar nas partidas de hoje à noite!" 
    },
    { 
        id: 3, 
        image: futebol3Image, 
        title: "Dica Exclusiva", 
        caption: "Participe do nosso grupo exclusivo no Telegram para receber dicas." 
    },
];

const Carousel: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = carouselData.length;

    const moveSlide = (direction: number) => {
        setCurrentSlide(prev => {
            let next = prev + direction;
            if (next < 0) {
                next = totalSlides - 1;
            } else if (next >= totalSlides) {
                next = 0;
            }
            return next;
        });
    };
    
    useEffect(() => {
        const interval = setInterval(() => moveSlide(1), 7000); 
        return () => clearInterval(interval);
    }, [totalSlides]);

    return (
        <div className="carousel-centering-wrapper">
            <div className="carousel-wrapper-outer">
                <div className="carousel-container">
                    {carouselData.map((slide, index) => (
                        <div 
                            key={slide.id} 
                            className="carousel-slide relative" 
                            style={{ opacity: index === currentSlide ? 1 : 0, zIndex: index === currentSlide ? 1 : 0 }}
                        >
                            <img src={slide.image} alt={slide.caption} className="carousel-image"/>
                            
                            {}
                            <div className="slide-overlay-text">
                                {}
                                <h2 className="slide-title">{slide.title}</h2> 
                                {}
                                <div className="slide-caption">{slide.caption}</div>
                            </div>
                            {}

                        </div>
                    ))}
                </div>
                {}
                <button className="carousel-prev" onClick={() => moveSlide(-1)}>&#10094;</button>
                <button className="carousel-next" onClick={() => moveSlide(1)}>&#10095;</button>
                {}
                <div className="carousel-dots">
                    {carouselData.map((_, index) => (
                        <span 
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        ></span>
                    ))}
                </div>
            </div>
        </div>
    );
};


const mockPartidas: Partida[] = [
    {
        id: 'p1',
        timeA: 'Flamengo',
        timeB: 'Vasco',
        dataHora: '2025-11-20T21:30:00',
        status: 'ABERTA',
        meuPalpite: { placarTimeA: 2, placarTimeB: 1 },
    },
    {
        id: 'p2',
        timeA: 'Corinthians',
        timeB: 'São Paulo',
        dataHora: '2025-11-21T19:00:00',
        status: 'ABERTA',
    },
    {
        id: 'p3',
        timeA: 'Palmeiras',
        timeB: 'Santos',
        dataHora: '2025-11-15T16:00:00',
        status: 'ENCERRADA',
        resultadoA: 1,
        resultadoB: 0,
        meuPalpite: { placarTimeA: 2, placarTimeB: 1 },
        acertou: true, 
        pontosGanhos: 1,
    },
    {
        id: 'p4',
        timeA: 'Grêmio',
        timeB: 'Internacional',
        dataHora: '2025-11-16T18:00:00',
        status: 'ENCERRADA',
        resultadoA: 3,
        resultadoB: 2,
        meuPalpite: { placarTimeA: 0, placarTimeB: 1 },
        acertou: false,
        pontosGanhos: 0,
    },
];


const formatarData = (dataHora: string) => {
    const data = new Date(dataHora);
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

interface PlacarInputProps {
    value: number | null;
    onChange: (value: number | null) => void;
    readOnly?: boolean;
}

const PlacarInput: React.FC<PlacarInputProps> = ({ value, onChange, readOnly = false }) => (
    <input
        type="number"
        min="0"
        value={value ?? ''}
        onChange={(e) => {
            const num = parseInt(e.target.value, 10);
            onChange(isNaN(num) ? null : num);
        }}
        readOnly={readOnly}
        className={`card-input match-placar-input ${readOnly ? 'input-readonly' : ''}`}
    />
);


interface PartidaCardProps {
    partida: Partida;
    palpitesEmEdicao: PalpiteEmEdicao;
    setPalpitesEmEdicao: React.Dispatch<React.SetStateAction<PalpiteEmEdicao>>;
    onSalvarPalpite: (partidaId: string, palpite: Palpite) => void;
}

const PartidaCard: React.FC<PartidaCardProps> = ({
    partida,
    palpitesEmEdicao,
    setPalpitesEmEdicao,
    onSalvarPalpite
}) => {
    const palpiteAtual = useMemo(() => {
        return palpitesEmEdicao[partida.id] || partida.meuPalpite || { placarTimeA: null, placarTimeB: null };
    }, [palpitesEmEdicao, partida.id, partida.meuPalpite]);

    const handleChangePalpite = (campo: 'placarTimeA' | 'placarTimeB', valor: number | null) => {
        setPalpitesEmEdicao(prev => ({
            ...prev,
            [partida.id]: {
                ...palpiteAtual,
                [campo]: valor
            }
        }));
    };

    const handleSalvar = () => {
        if (palpiteAtual.placarTimeA === null || palpiteAtual.placarTimeB === null) {
            console.error("Por favor, insira um placar para ambos os times.");
            return;
        }
        onSalvarPalpite(partida.id, palpiteAtual as Palpite);
    };

    let cardClass = 'match-card';
    if (partida.status === 'ABERTA') {
        cardClass += ' match-card-open';
    } else {
        cardClass += partida.acertou ? ' match-card-acerto' : ' match-card-erro';
    }

    return (
        <div className={cardClass}>
            <div className="match-info">
                <div className="match-times">
                    <span>{partida.timeA}</span>
                    <span className="vs-separator">vs</span>
                    <span>{partida.timeB}</span>
                </div>
                <div className="match-date">
                    {formatarData(partida.dataHora)}
                </div>
            </div>

            {partida.status === 'ABERTA' ? (
                <div className="match-action-area">
                    <span className="palpite-label">Seu Palpite:</span>
                    <PlacarInput
                        value={palpiteAtual.placarTimeA}
                        onChange={(val) => handleChangePalpite('placarTimeA', val)}
                    />
                    <span className="score-separator">x</span>
                    <PlacarInput
                        value={palpiteAtual.placarTimeB}
                        onChange={(val) => handleChangePalpite('placarTimeB', val)}
                    />
                    <button
                        onClick={handleSalvar}
                        className="btn-salvar-palpite primary-button"
                    >
                        {partida.meuPalpite ? 'Atualizar' : 'Palpitar'}
                    </button>
                </div>
            ) : (
                <div className="match-results-area">
                    <div className="result-group">
                        <div className="result-label">Resultado:</div>
                        <span className="score-display score-real">{partida.resultadoA}</span>
                        <span className="score-separator">x</span>
                        <span className="score-display score-real">{partida.resultadoB}</span>
                    </div>

                    <div className="result-group result-palpite">
                        <div className="result-label">Seu Palpite:</div>
                        <span className={`score-display ${partida.acertou ? 'score-acerto' : 'score-erro'}`}>
                            {partida.meuPalpite?.placarTimeA ?? '-'}
                        </span>
                        <span className="score-separator">x</span>
                        <span className={`score-display ${partida.acertou ? 'score-acerto' : 'score-erro'}`}>
                            {partida.meuPalpite?.placarTimeB ?? '-'}
                        </span>
                    </div>

                    <div className="result-group result-points">
                        Pontos: <span className="points-value">{partida.pontosGanhos ?? 0}</span>
                    </div>
                </div>
            )}
        </div>
    );
};


const Dashboard: React.FC = () => {
    const [partidas, setPartidas] = useState<Partida[]>([]);
    const [loading, setLoading] = useState(true);
    const [palpitesEmEdicao, setPalpitesEmEdicao] = useState<PalpiteEmEdicao>({});

    useEffect(() => {
        const fetchPartidas = () => {
            setLoading(true);
            setTimeout(() => {
                setPartidas(mockPartidas);
                setLoading(false);
            }, 500); 
        };
        fetchPartidas();
    }, []);

    const { partidasAbertas, partidasEncerradas } = useMemo(() => {
        const abertas = partidas
            .filter(p => p.status === 'ABERTA')
            .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()); 

        const encerradas = partidas
            .filter(p => p.status === 'ENCERRADA')
            .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()); 

        return { partidasAbertas: abertas, partidasEncerradas: encerradas };
    }, [partidas]);

    const handleSalvarPalpite = useCallback((partidaId: string, palpite: Palpite) => {
        setPartidas(prevPartidas =>
            prevPartidas.map(p =>
                p.id === partidaId ? { ...p, meuPalpite: palpite } : p
            )
        );
        setPalpitesEmEdicao(prev => {
            const newState = { ...prev };
            delete newState[partidaId];
            return newState;
        });
        console.log(`Palpite salvo com sucesso para a partida ${partidaId}! (${palpite.placarTimeA} x ${palpite.placarTimeB})`);

    }, []);

    if (loading) {
        return (
            <div className="app-container">
                {}
                <div className="loading-message">Carregando partidas...</div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <Navbar />

            {}
            <Carousel /> 
            {}

            <div className="dashboard-card-wrapper">
                <div className="dashboard-card">
                    <div className="header-container">
                        <div className="icon-container">
                            ⚽
                        </div>
                        <h1 className="title">Bolão de Futebol</h1>
                        <p className="subtitle">Faça seus palpites e acompanhe os resultados!</p>
                    </div>

                    <h2 className="section-title">Próximos Palpites</h2>
                    {partidasAbertas.length > 0 ? (
                        <div className="matches-list">
                            {partidasAbertas.map(partida => (
                                <PartidaCard
                                    key={partida.id}
                                    partida={partida}
                                    palpitesEmEdicao={palpitesEmEdicao}
                                    setPalpitesEmEdicao={setPalpitesEmEdicao}
                                    onSalvarPalpite={handleSalvarPalpite}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="empty-message">Não há partidas abertas para palpites no momento.</p>
                    )}

                    <h2 className="section-title">Resultados Anteriores</h2>
                    {partidasEncerradas.length > 0 ? (
                        <div className="matches-list">
                            {partidasEncerradas.map(partida => (
                                <PartidaCard
                                    key={partida.id}
                                    partida={partida}
                                    palpitesEmEdicao={palpitesEmEdicao} 
                                    setPalpitesEmEdicao={setPalpitesEmEdicao} 
                                    onSalvarPalpite={() => {}} 
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="empty-message">Nenhum resultado final apurado ainda.</p>
                    )}
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default Dashboard;