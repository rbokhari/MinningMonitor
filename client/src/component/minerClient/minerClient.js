import React from 'react';
import ReactToolTip from 'react-tooltip';
import toastr from 'toastr';

import { DeleteConfirmModal } from '../common';
import MinerClientModal from './addNewModal';
import Api from '../../api/Api';

class MinerClient extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            showDeleteModal: false,
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

        this.handleDeleteModalClose = this.handleDeleteModalClose.bind(this);
        this.handleDeleteModalShow = this.handleDeleteModalShow.bind(this);
        this.handleDeleteModalSubmit = this.handleDeleteModalSubmit.bind(this);

    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        let clients = Api.get('client').then(d => d.json());
        let groups = Api.get('group').then(d => d.json());

        Promise.all([clients, groups])
            .then(data => {
                const clients = data[0].data;
                const groups = data[1];
                const clientsData = clients.map((c,i) => {
                    return {
                        ...c,
                        groups: groups.filter(d=>d.group.minerClient == c._id).length || 0
                    }
                });
                this.setState({clients: clientsData});
            });
    }

    handleModalShow() {
        this.setState((prevState, props) => ({showModal: true}));
    }

    handleEditModalShow(client) {
        const clientClone = Object.assign({}, client, { exec: client.execFile });
        this.setState((prevState, props) => ({showModal: true, client: clientClone}));
    }

    handleModalClose(){
        this.setState(prevState => ({showModal: false}));
    }
    
    handleModalChange(e) {
        let { client } = this.state;
        if (e.target.type== 'checkbox') {
            client[e.target.name] = e.target.checked ? 1 : 0;
        } else {
            client[e.target.name] = e.target.value;
        }
        // if (e.target.type == 'text') {
        //     client[e.target.name] = e.target.value;
        this.setState((prevState, props) => ({ client: client }));
    }
    
    handleModalSubmit(e) {
        e.preventDefault();
        const { client } = this.state;
        console.info('client', client);
        if (client._id) {
            Api.put(`client/${client._id}`, client)
                .then(res => {
                    this.handleModalClose();
                    this.getData();
                }, err => {
                    console.error('error', err);
                });
        } else {
            Api.post('client', client)
                .then(res => {
                    this.handleModalClose();
                    this.getData();
                }, err => {
                    console.error('error', err);
                });
        }
    }
    handleDeleteModalShow(client) {
        const clientClone = Object.assign({}, client);
        this.setState((prevState, props) => ({showDeleteModal: true, client: clientClone}));
    }

    handleDeleteModalClose() {
        this.setState(prevState => ({showDeleteModal: false}));
    }
    
    handleDeleteModalSubmit(e) {
        e.preventDefault();
        const { client } = this.state;
        Api.delete(`client/${client._id}`)
            .then(res => {
                this.getData();
                toastr.success(`Client ${client.name} Deleted `, 'Success !');
                this.setState(prevState => ({showDeleteModal: false}));
                })
                .catch(err => {
                    toastr.error(`Unable to delete ${client.name} `, 'Error !');
                    console.error('Delete Client', err);
                });
    }
    
    render() {
        const { showModal, client, clients, showDeleteModal } = this.state;

        return(
            <div className="pcoded-content"> 
                <DeleteConfirmModal isOpen={showDeleteModal} title="Miner Client" msg="Are you sure to delete this Client ?" onHandleSubmit={this.handleDeleteModalSubmit} onHandleClose={this.handleDeleteModalClose} />
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
                                                                <th>Executable</th>
                                                                <th>Groups</th>
                                                                <th>R</th>
                                                                <th>RX</th>
                                                                <th>NV</th>
                                                                <th>Functions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {clients && clients.map((client, i) => (<tr key={i}>
                                                                <td>{i+1}</td>
                                                                <td>{client.name}</td>
                                                                <td>{client.execFile}</td>
                                                                <td>{client.groups}</td>
                                                                <td>{client.isR}</td>
                                                                <td>{client.isRx}</td>
                                                                <td>{client.isNv}</td>
                                                                <td>
                                                                    <i className="fas fa-edit" data-tip data-for={`${client._id}edit`} onClick={() => this.handleEditModalShow(client)} style={{cursor: 'pointer'}} ></i>&nbsp;&nbsp;
                                                                    <ReactToolTip id={`${client._id}edit`}>
                                                                        <span>Update Client</span>
                                                                    </ReactToolTip>

                                                                    {client.groups == 0 && <i  data-tip data-for={`${client._id}delete`} className="fas fa-trash-alt" onClick={() => this.handleDeleteModalShow(client)} style={{cursor: 'pointer'}} tooltip="delete"></i>}
                                                                    {client.groups > 0 && <i data-tip data-for={`${client._id}delete`} className="fas fa-trash-alt" style={{cursor: 'pointer', opacity: 0.5, pointerEvents: 'none'}} tooltip="delete"></i>}

                                                                    <ReactToolTip id={`${client._id}delete`} >
                                                                        <span>Delete Client</span>
                                                                    </ReactToolTip>
                                                                </td>
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