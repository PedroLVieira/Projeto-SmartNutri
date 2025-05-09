import React, { useEffect, useState } from "react";
import "../styles/planoalimentar.css";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { FaUtensils, FaSpinner, FaCalendarDay, FaAppleAlt, FaLeaf, FaClock, FaListAlt } from "react-icons/fa";

export function PlanoAlimentar() {
  const navigate = useNavigate();
  const [planos, setPlanos] = useState([]);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);
  const [diaSelecionado, setDiaSelecionado] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [animateCards, setAnimateCards] = useState(false);
  const diasDaSemana = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

  useEffect(() => {
    const fetchPlanos = async () => {
      try {
        setLoading(true);
        
        // Buscar todos os planos do cliente
        let response = await axios.get("/api/planoalimentar/planos/");
        console.log("Resposta planos do cliente:", response.data);
        
        if (response.data && response.data.length > 0) {
          // Processar cada plano do cliente
          const planosProcessados = await Promise.all(response.data.map(async (plano) => {
            try {
              // Buscar detalhes do plano
              const detalhesResponse = await axios.get(`/api/planoalimentar/planos/${plano.id}/por_dia_semana/`);
              console.log(`Detalhes do plano ${plano.id}:`, detalhesResponse.data);
              
              // Preparar dados para o formato que o componente espera
              const diasProcessados = {};
              
              // Loop pelos dias da semana no objeto retornado pela API
              Object.keys(detalhesResponse.data).forEach((nomeDia) => {
                const refeicoes = detalhesResponse.data[nomeDia];
                // Encontrar o índice do dia da semana
                const indiceDia = diasDaSemana.findIndex(dia => 
                  dia.toLowerCase() === nomeDia.toLowerCase() || 
                  nomeDia.toLowerCase().includes(dia.toLowerCase())
                );
                
                if (indiceDia !== -1) {
                  // Se encontrou o dia, adiciona as refeições
                  diasProcessados[indiceDia] = {
                    refeicoes: refeicoes.map(r => ({
                      tipo: r.refeicao,
                      horario: r.horario || '',
                      descricao: r.recomendado || '',
                      substituicoes: r.substituicoes || ''
                    }))
                  };
                }
              });
              
              // Retornar o plano com os dias processados
              return {
                id: plano.id,
                nome: plano.nome || `Plano ${plano.id}`,
                descricao: plano.descricao || `Plano alimentar criado em ${new Date(plano.data_criacao).toLocaleDateString()}`,
                ativo: plano.ativo,
                dias_semana: diasProcessados,
                data_criacao: plano.data_criacao
              };
            } catch (error) {
              console.error(`Erro ao processar plano ${plano.id}:`, error);
              // Se falhar, retorna o plano com informação mínima
              return {
                id: plano.id,
                nome: plano.nome || `Plano ${plano.id}`,
                descricao: plano.descricao || "Plano sem detalhes disponíveis",
                ativo: plano.ativo,
                dias_semana: {},
                data_criacao: plano.data_criacao
              };
            }
          }));
          
          // Filtrar planos que têm pelo menos um dia com refeições
          const planosComRefeicoes = planosProcessados.filter(plano => 
            Object.keys(plano.dias_semana).length > 0
          );
          
          console.log("Planos processados:", planosComRefeicoes);
          
          if (planosComRefeicoes.length > 0) {
            setPlanos(planosComRefeicoes);
            setPlanoSelecionado(planosComRefeicoes[0]);
            
            // Selecionar o primeiro dia que tem refeições no plano selecionado
            const primeiroDiaComRefeicoes = Object.keys(planosComRefeicoes[0].dias_semana)[0];
            if (primeiroDiaComRefeicoes) {
              setDiaSelecionado(parseInt(primeiroDiaComRefeicoes));
            }
            
            // Ativar animação dos cards após um breve delay
            setTimeout(() => {
              setAnimateCards(true);
            }, 300);
            
            console.log("Planos alimentares carregados com sucesso");
          } else {
            // Se existem planos, mas nenhum com refeições
            setPlanos(planosProcessados);
            setPlanoSelecionado(planosProcessados[0]);
            setError("Seus planos alimentares não possuem refeições cadastradas ainda.");
          }
        } else {
          setError("Você não possui planos alimentares ativos.");
          console.log("Nenhum plano encontrado para o cliente");
        }
      } catch (error) {
        console.error("Erro ao buscar planos alimentares:", error);
        
        if (error.response) {
          // O servidor respondeu com um código de erro
          if (error.response.status === 404) {
            setError("Você ainda não possui um plano alimentar ativo. Entre em contato com seu nutricionista.");
          } else if (error.response.status === 403) {
            setError("Você não tem permissão para acessar estes dados. Tente fazer login novamente.");
            // Redirecionar para login após alguns segundos
            setTimeout(() => navigate("/login"), 3000);
          } else {
            setError(`Erro ao carregar plano alimentar: ${error.response.data?.detail || error.response.statusText}`);
          }
        } else if (error.request) {
          // A requisição foi feita mas não houve resposta
          setError("O servidor não respondeu. Verifique sua conexão com a internet.");
        } else {
          // Erro na configuração da requisição
          setError("Erro na requisição do plano alimentar. Tente novamente mais tarde.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlanos();
  }, [navigate]);

  const handleChangePlano = (e) => {
    const planoId = parseInt(e.target.value);
    const plano = planos.find(p => p.id === planoId);
    setPlanoSelecionado(plano);
    
    // Resetar animação e depois ativar novamente
    setAnimateCards(false);
    setTimeout(() => {
      setAnimateCards(true);
    }, 100);
    
    // Selecionar o primeiro dia que tem refeições
    const primeiroDiaDisponivel = Object.keys(plano.dias_semana)[0];
    if (primeiroDiaDisponivel) {
      setDiaSelecionado(parseInt(primeiroDiaDisponivel));
    } else {
      setDiaSelecionado(0);
    }
  };

  const handleChangeDia = (index) => {
    setDiaSelecionado(index);
    
    // Resetar animação e depois ativar novamente
    setAnimateCards(false);
    setTimeout(() => {
      setAnimateCards(true);
    }, 100);
  };

  // Verificar se o dia selecionado tem refeições
  const diaTemRefeicoes = (dia) => {
    if (!planoSelecionado || !planoSelecionado.dias_semana) return false;
    const diaAtual = planoSelecionado.dias_semana[dia];
    return diaAtual && diaAtual.refeicoes && diaAtual.refeicoes.length > 0;
  };

  return (
    <div className="layout-wrapper">
      <NavBar userType="cliente" />
      
      <div className="plano-container">
        <div className="plano-header">
          <h1>Meu Plano Alimentar</h1>
          <p>Acompanhe sua dieta personalizada</p>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Carregando seu plano alimentar...</p>
          </div>
        ) : error ? (
          <div className="erro-message">
            <p>{error}</p>
          </div>
        ) : planos.length === 0 ? (
          <div className="nenhum-plano">
            <h2>Nenhum plano alimentar disponível</h2>
            <p>Entre em contato com seu nutricionista para receber um plano alimentar.</p>
          </div>
        ) : (
          <>
            <div className="plano-overview">
              <div className="selector-container">
                <label htmlFor="plano-select">Escolha seu plano:</label>
                <select
                  id="plano-select"
                  className="plano-selector"
                  value={planoSelecionado?.id}
                  onChange={handleChangePlano}
                >
                  {planos.map((plano) => (
                    <option key={plano.id} value={plano.id}>
                      {plano.nome || `Plano ${plano.id}`}
                    </option>
                  ))}
                </select>
              </div>
              
              {planoSelecionado && (
                <div className="plano-info">
                  <div className="plano-badge">
                    {planoSelecionado.ativo ? 
                      <span className="badge active">Ativo</span> : 
                      <span className="badge inactive">Inativo</span>
                    }
                  </div>
                  <h2 className="plano-nome">{planoSelecionado.nome || `Plano ${planoSelecionado.id}`}</h2>
                  <p className="plano-descricao">{planoSelecionado.descricao || "Sem descrição disponível"}</p>
                </div>
              )}
            </div>
            
            {planoSelecionado && (
              <>
                <div className="dias-semana-section">
                  <h2>Dias da Semana</h2>
                  <div className="dias-semana-nav">
                    {diasDaSemana.map((dia, index) => (
                      <button
                        key={index}
                        className={`dia-btn ${diaSelecionado === index ? 'ativo' : ''} ${!diaTemRefeicoes(index) ? 'vazio' : ''}`}
                        onClick={() => handleChangeDia(index)}
                        disabled={!diaTemRefeicoes(index)}
                      >
                        <FaCalendarDay className="dia-icon" />
                        <span>{dia}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="dia-conteudo">
                  <h3 className="dia-titulo">
                    <FaListAlt className="section-icon" />
                    Refeições para {diasDaSemana[diaSelecionado]}
                  </h3>
                  
                  {planoSelecionado.dias_semana && planoSelecionado.dias_semana[diaSelecionado] && 
                   planoSelecionado.dias_semana[diaSelecionado].refeicoes && 
                   planoSelecionado.dias_semana[diaSelecionado].refeicoes.length > 0 ? (
                    <div className={`refeicoes ${animateCards ? 'animate-cards' : ''}`}>
                      {planoSelecionado.dias_semana[diaSelecionado].refeicoes.map((refeicao, index) => (
                        <div 
                          key={index} 
                          className="refeicao-card"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="refeicao-header">
                            <div className="refeicao-icon-container">
                              <FaUtensils className="refeicao-icon" />
                            </div>
                            <div className="refeicao-title">
                              <h3>{refeicao.tipo || `Refeição ${index + 1}`}</h3>
                              <span className="refeicao-horario">
                                <FaClock className="icon-small" />
                                {refeicao.horario || "Horário flexível"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="refeicao-detalhes">
                            <div className="recomendado-section">
                              <h4>Recomendado</h4>
                              <p className="refeicao-descricao">{refeicao.descricao}</p>
                            </div>
                            
                            {refeicao.substituicoes && (
                              <div className="substituicoes-section">
                                <h4>Substituições</h4>
                                <p className="refeicao-substituicoes">{refeicao.substituicoes}</p>
                              </div>
                            )}
                            
                            {refeicao.alimentos && refeicao.alimentos.length > 0 && (
                              <div className="refeicao-alimentos">
                                <h4>
                                  <FaAppleAlt className="icon-small" />
                                  Alimentos
                                </h4>
                                <ul className="alimentos-list">
                                  {refeicao.alimentos.map((alimento, idx) => (
                                    <li key={idx}>
                                      <FaLeaf className="leaf-icon" />
                                      <span className="alimento-nome">{alimento.nome}</span>
                                      {alimento.quantidade && (
                                        <span className="alimento-quantidade"> - {alimento.quantidade}</span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="sem-refeicoes">
                      <div className="sem-refeicoes-icon">
                        <FaUtensils />
                      </div>
                      <h3>Nenhuma refeição disponível</h3>
                      <p>Não há refeições planejadas para {diasDaSemana[diaSelecionado]}.</p>
                      <p>Entre em contato com seu nutricionista para atualizar seu plano.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
