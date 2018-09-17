import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

//import logo from './logo.svg';
//import './App.css';
import Routes from './Routes';
import { Header, Menu } from './component/common';

class App extends Component {

    constructor(props) {
        super(props);
        //$('[data-toggle="tooltip"]').tooltip();
    }

    render() {
        let container;
        return (
        <Router>
            <div id="pcoded" className="pcoded">
                
                <div className="pcoded-overlay-box"></div>
                <div className="pcoded-container navbar-wrapper">
                    <Header />
                    <div className="pcoded-main-container">
                        <div className="pcoded-wrapper">
                            <Menu /> 
                            <Routes />
                        </div>
                    </div>
                </div>
            </div>
        </Router>
        );
    }
}

export default App;
