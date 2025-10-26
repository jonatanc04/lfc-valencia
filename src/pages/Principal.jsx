import { useState, useMemo, useEffect } from 'react';
import styles from '../styles/Principal.module.css';
import clasSenior from '../data/clasificacion.json';
import clasJunior from '../data/clas_junior.json';
import jornadasSenior from '../data/jornadas.json';
import jornadasJunior from '../data/jor_junior.json';

export const Principal = () => {
    const [categoria, setCategoria] = useState('senior');
    const [jornadaActual, setJornadaActual] = useState(0);

    // Reiniciar jornada cuando cambia la categoría
    useEffect(() => {
        setJornadaActual(0);
    }, [categoria]);

    const calcularClasificacion = (jugadoresBase, jornadas) => {
        const estadisticas = {};
        
        jugadoresBase.forEach(jugador => {
            if (jugador.nombre !== "Descansa") {
                estadisticas[jugador.nombre] = {
                    PTS: 0,
                    PJ: 0,
                    G: 0,
                    E: 0,
                    P: 0,
                    GF: 0,
                    GC: 0,
                    DG: 0
                };
            }
        });

        jornadas.jornadas.forEach(jornada => {
            jornada.partidos.forEach(partido => {
                if (partido.jugador1 !== "Descansa" && partido.jugador2 !== "Descansa" && partido.resultado) {
                    const [goles1, goles2] = partido.resultado.split('-').map(Number);
                    
                    estadisticas[partido.jugador1].PJ++;
                    estadisticas[partido.jugador1].GF += goles1;
                    estadisticas[partido.jugador1].GC += goles2;
                    estadisticas[partido.jugador1].DG = estadisticas[partido.jugador1].GF - estadisticas[partido.jugador1].GC;

                    estadisticas[partido.jugador2].PJ++;
                    estadisticas[partido.jugador2].GF += goles2;
                    estadisticas[partido.jugador2].GC += goles1;
                    estadisticas[partido.jugador2].DG = estadisticas[partido.jugador2].GF - estadisticas[partido.jugador2].GC;

                    if (goles1 > goles2) {
                        estadisticas[partido.jugador1].G++;
                        estadisticas[partido.jugador1].PTS += 3;
                        estadisticas[partido.jugador2].P++;
                    } else if (goles1 < goles2) {
                        estadisticas[partido.jugador2].G++;
                        estadisticas[partido.jugador2].PTS += 3;
                        estadisticas[partido.jugador1].P++;
                    } else {
                        estadisticas[partido.jugador1].E++;
                        estadisticas[partido.jugador1].PTS += 1;
                        estadisticas[partido.jugador2].E++;
                        estadisticas[partido.jugador2].PTS += 1;
                    }
                }
            });
        });

        return jugadoresBase.map(jugador => {
            if (jugador.nombre === "Descansa") return jugador;
            
            const stats = estadisticas[jugador.nombre] || {
                PTS: 0, PJ: 0, G: 0, E: 0, P: 0, GF: 0, GC: 0, DG: 0
            };
            
            return {
                ...jugador,
                ...stats
            };
        });
    };

    // Dependiendo de la categoría, se usan los datos correctos
    const data = useMemo(() => {
        const baseData = categoria === 'senior' ? clasSenior : clasJunior;
        const jornadas = categoria === 'senior' ? jornadasSenior : jornadasJunior;
        return {
            ...baseData,
            jornadas,
            clasificacion: calcularClasificacion(baseData.clasificacion, jornadas)
        };
    }, [categoria]);

    const clasificacionOrdenada = [...data.clasificacion].sort((a, b) => {
        if (b.PTS !== a.PTS) return b.PTS - a.PTS;
        if (b.DG !== a.DG) return b.DG - a.DG;
        if (b.GF !== a.GF) return b.GF - a.GF;
        return a.nombre.localeCompare(b.nombre);
    });

    // Jornadas correspondientes a la categoría actual
    const todasLasJornadas = data.jornadas.jornadas;
    const jornadaSeleccionada = todasLasJornadas[jornadaActual];

    const siguienteJornada = () => {
        if (jornadaActual < todasLasJornadas.length - 1) {
            setJornadaActual(prev => prev + 1);
        }
    };

    const anteriorJornada = () => {
        if (jornadaActual > 0) {
            setJornadaActual(prev => prev - 1);
        }
    };

    return (
        <div className="container-fluid pt-5 d-flex flex-column align-items-center">
            <div className="content col-12 col-xxl-10">
                
                {/* Botones categoría */}
                <div className="d-flex justify-content-center mb-4">
                    <div className="btn-group" role="group">
                        <button
                            type="button"
                            className={`${styles.botonCategoria} ${categoria === 'senior' ? styles.activo : ''} m-2`}
                            onClick={() => setCategoria('senior')}
                        >
                            Senior
                        </button>
                        <button
                            type="button"
                            className={`${styles.botonCategoria} ${categoria === 'junior' ? styles.activo : ''} m-2`}
                            onClick={() => setCategoria('junior')}
                        >
                            Junior
                        </button>
                    </div>
                </div>

                <div className="row justify-content-center">
                    {/* Clasificación - Izquierda */}
                    <div className="col-12 col-lg-7 col-xl-6 mb-4">
                        <div className={`${styles.clasificacion}`}>
                            <p className="col-12 m-0 text-center bg-orange p-2 fs-4 fw-bold">
                                Clasificación {categoria === 'senior' ? 'Senior' : 'Junior'} 25/26
                            </p>

                            <table className="table table-striped table-bordered text-center mb-0 align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th>#</th>
                                        <th>Jugador</th>
                                        <th>PTS</th>
                                        <th>PJ</th>
                                        <th>V</th>
                                        <th>E</th>
                                        <th>D</th>
                                        <th className={styles.colOculta}>GF</th>
                                        <th className={styles.colOculta}>GC</th>
                                        <th>DG</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clasificacionOrdenada.map((jugador, index) => (
                                        <tr key={jugador.id}>
                                            <td>{index + 1}</td>
                                            <td className="text-start d-flex align-items-center gap-2">
                                                <img
                                                    src={`/jugadores/${jugador.imagen || 'default.jpg'}`}
                                                    alt={jugador.nombre}
                                                    className={styles.fotoJugador}
                                                />
                                                <span>{jugador.nombre}</span>
                                            </td>
                                            <td>{jugador.PTS}</td>
                                            <td>{jugador.PJ}</td>
                                            <td>{jugador.G}</td>
                                            <td>{jugador.E}</td>
                                            <td>{jugador.P}</td>
                                            <td className={styles.colOculta}>{jugador.GF}</td>
                                            <td className={styles.colOculta}>{jugador.GC}</td>
                                            <td>{jugador.DG}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Jornadas - Derecha */}
                    <div className="col-12 col-lg-5 col-xl-4">
                        <div className={`${styles.jornadas} ${styles.clasificacion}`}>
                            <p className="col-12 m-0 text-center bg-orange p-2 fs-4 fw-bold">
                                Jornada {jornadaSeleccionada.numero}
                            </p>
                            
                            <div className="card-body p-3">
                                {/* Navegación */}
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <button 
                                        className={`btn ${styles.botonCategoria} ${jornadaActual === 0 ? 'opacity-50' : ''}`}
                                        onClick={anteriorJornada}
                                        disabled={jornadaActual === 0}
                                    >
                                        ← Anterior
                                    </button>
                                    <span className="fw-bold text-dark">
                                        {jornadaSeleccionada.fecha}
                                    </span>
                                    <button 
                                        className={`btn ${styles.botonCategoria} ${jornadaActual === todasLasJornadas.length - 1 ? 'opacity-50' : ''}`}
                                        onClick={siguienteJornada}
                                        disabled={jornadaActual === todasLasJornadas.length - 1}
                                    >
                                        Siguiente →
                                    </button>
                                </div>
                                
                                {/* Partidos */}
                                <div className="table-responsive">
                                    <table className="table table-bordered text-center mb-0">
                                        <thead className="table-secondary">
                                            <tr>
                                                <th>Local</th>
                                                <th>Resultado</th>
                                                <th>Visitante</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jornadaSeleccionada.partidos.map((partido, index) => (
                                                <tr key={index}>
                                                    <td className="text-end">
                                                        <div className="d-flex align-items-center justify-content-end">
                                                            <span>{partido.jugador1}</span>
                                                            {partido.jugador1 !== "Descansa" && (
                                                                <img
                                                                    src={`/jugadores/${data.clasificacion.find(j => j.nombre === partido.jugador1)?.imagen || 'default.jpg'}`}
                                                                    alt={partido.jugador1}
                                                                    className={styles.fotoJornada}
                                                                />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className={`${styles.resultado} fw-bold`}>
                                                        {partido.resultado || '-'}
                                                    </td>
                                                    <td className="text-start">
                                                        <div className="d-flex align-items-center">
                                                            {partido.jugador2 !== "Descansa" && (
                                                                <img
                                                                    src={`/jugadores/${data.clasificacion.find(j => j.nombre === partido.jugador2)?.imagen || 'default.jpg'}`}
                                                                    alt={partido.jugador2}
                                                                    className={styles.fotoJornada}
                                                                />
                                                            )}
                                                            <span>{partido.jugador2}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
