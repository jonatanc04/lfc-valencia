import "../styles/Header.module.css"

export const Header = () => {
    return (
        <header>
            <nav className="navbar navbar-expand-lg bg-orange px-3">
                <div className="container-fluid">

                    <a className="navbar-brand d-flex align-items-center" href="/">
                        <img
                            src="/img/lfc-valencia.png"
                            alt="Logo"
                            width="80"
                            height="80"
                            className="me-2 rounded"
                        />
                        <h2 className="m-0">LFC Valencia</h2>
                    </a>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link active" href="/">
                                    <p>Inicio</p>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/">
                                    <p>Jugadores</p>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/">
                                    <p>Contacto</p>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};
