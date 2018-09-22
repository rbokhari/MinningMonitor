import React from 'react';
import MinerClientModal from './addNewModal';

import Api from '../../api/Api';

class MinerClient extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            clients: [],
            client: {
                name: '',
                r: 0,
                rx: 0,
                nv: 0,
                remarks: ''
            }
        };

        this.getData = this.getData.bind(this);
        this.handleModalShow = this.handleModalShow.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalChange = this.handleModalChange.bind(this);
        this.handleModalSubmit = this.handleModalSubmit.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        Api.get('client')
            .then(data => data.json())
            .then(res => {
                console.info('get client', res);
                this.setState({clients: res.data});
            }, err => console.error('error', err));
    }

    handleModalShow() {
        this.setState((prevState, props) => ({showModal: true}));
    }

    handleModalClose() {
        this.setState(prevState => ({showModal: false}));
    }

    handleModalChange(e) {
        let { client } = this.state;
        console.info('...>', e.target.name, e.target.type);
        if (e.target.type == 'text') {
            client[e.target.name] = e.target.value;
        }else if (e.target.type== 'checkbox') {
            client[e.target.name] = e.target.checked ? 1 : 0;
        }
        this.setState((prevState, props) => ({ client: client }));
    }

    handleModalSubmit(e) {
        e.preventDefault();
        const { client } = this.state;
        console.info('client', client);
        Api.post('client', client)
            .then(res => {
                this.handleModalClose();
            }, err => {
                console.error('error', err);
            });
    }

    render() {
        const { showModal, client, clients } = this.state;

        return(
            <div className="pcoded-content">
                <MinerClientModal isOpen={showModal} client={client} onHandleChange={this.handleModalChange} onHandleSubmit={this.handleModalSubmit} onHandleClose={this.handleModalClose} />
                <div className="page-header">
                    <div className="page-block">
                        <div className="row align-items-center">
                            {/* <div className="col-md-12">
                                <div className="page-header-title">
                                    <h5 className="m-b-10">Miner Clients </h5>
                                </div>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="index.html">
                                            <i className="feather icon-home"></i>
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item"><a href="#!">Miner Clients</a></li>
                                </ul>
                            </div> */}
                        </div>
                    </div>

                </div>
                <div className="pcoded-inner-content">
                    <div className="main-body">
                        <div className="page-wrapper">
                            <div className="page-body">
                            <div className="row">
                                    <div className="col-xl-12 col-md-12">
                                    <div className="card">
                                            <div className="card-header">
                                                <h5>Miner Clients </h5>
                                                <span>all versions of clients</span>
                                                <div className="card-header-right">
                                                    <button className="btn btn-primary" onClick={() => this.handleModalShow()}><i className="fa fa-plus"></i>&nbsp; Add New</button> 
                                                    {/* <ul className="list-unstyled card-option">
                                                        <li className="first-opt"><i className="feather icon-chevron-left open-card-option"></i></li>
                                                        <li><i className="feather icon-maximize full-card"></i></li>
                                                        <li><i className="feather icon-minus minimize-card"></i></li>
                                                        <li><i className="feather icon-refresh-cw reload-card"></i></li>
                                                        <li><i className="feather icon-trash close-card"></i></li>
                                                        <li><i className="feather icon-chevron-left open-card-option"></i></li>
                                                    </ul> */}
                                                </div>
                                            </div>
                                            <div className="card-block table-border-style">
                                                <div className="table-responsive">
                                                    <table className="table table-">
                                                        <thead>
                                                            <tr>
                                                                <th style={{width:'10pt'}}></th>
                                                                <th>Client Name</th>
                                                                <th>R</th>
                                                                <th>RX</th>
                                                                <th>NV</th>
                                                                <th>Info</th>
                                                                <th>Remarks</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {clients && clients.map((client, i) => (<tr key={i}>
                                                                <td>{i+1}</td>
                                                                <td>{client.name}</td>
                                                                <td>{client.isR}</td>
                                                                <td>{client.isRx}</td>
                                                                <td>{client.isNv}</td>
                                                                <td>{client.info}</td>
                                                                <td>{client.remarks}</td>
                                                            </tr>))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        );

    }
}

export default MinerClient;