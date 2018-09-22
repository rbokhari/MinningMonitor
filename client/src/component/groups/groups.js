import React from 'react';
import MinerGroupModal from './addNewModal';

import Api from '../../api/Api';

class Groups extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            group: {
                name: '',
                client: 0,
                config: '',
                notes: ''
            },
            groups: [],
            clients: []
        };

        this.getData = this.getData.bind(this);
        this.handleModalChange = this.handleModalChange.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalShow = this.handleModalShow.bind(this);
        this.handleModalSubmit = this.handleModalSubmit.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        Api.get('group')
            .then(res => res.json())
            .then(data => {
                console.info('group data', data);
                this.setState({groups: data.data});
            }, err => {
                console.error('error', err);
            });
    }

    handleModalShow() {
        Api.get('client')
            .then(res => res.json())
            .then(data => {
                this.setState({clients: data.data, showModal: true});
            }, err => {
                console.error('err', err);
            });
    }
    
    handleModalClose() {
        this.setState({ showModal: false});
    }

    handleModalChange(e) {
        e.preventDefault();
        let { group } = this.state;
        group[e.target.name] = e.target.value;
        this.setState({ group: group });
    }

    handleModalSubmit(e) {
        e.preventDefault();
        const { group } = this.state;
        console.info('group', group);
        Api.post('group', group)
            .then(res => {
                console.info('group post', res);
                this.handleModalClose();
            }, err => {
                console.error('group error', err);
            });

    }

    render() {
        const { showModal, group, clients, groups } = this.state;
        return (
            <div className="pcoded-content">
                <MinerGroupModal isOpen={showModal} group={group} clients={clients} onHandleChange={this.handleModalChange} onHandleSubmit={this.handleModalSubmit} onHandleClose={this.handleModalClose} />
                <div className="page-header">
                    <div className="page-block">
                        <div className="row align-items-center">
                            {/* <div className="col-md-12">
                                <div className="page-header-title">
                                    <h5 className="m-b-10">Groups </h5>
                                </div>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="index.html">
                                            <i className="feather icon-home"></i>
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item"><a href="#!">Groups</a></li>
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
                                                <h5>Miner Groups</h5>
                                                <span></span> 
                                                <div className="card-header-right">
                                                    <button className="btn btn-primary" onClick={(e) => this.handleModalShow(e)}><i className="fa fa-plus"></i>&nbsp; Add New</button> 
                                                </div>

                                            </div>
                                            <div className="card-block table-border-style">
                                                <div className="table-responsive">
                                                    <table className="table table-">
                                                        <thead>
                                                            <tr>
                                                                <th>Group Name</th>
                                                                <th>Notes</th>
                                                                <th>Miners</th>
                                                                <th>Miner Client</th>
                                                                <th>Configuration</th>
                                                                <th>Functions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {groups && groups.map((gp, i) => (<tr key={i+1}>
                                                                <td>{gp.name}</td>
                                                                <td>{gp.notes}</td>
                                                                <td>{}</td>
                                                                <td></td>
                                                                <td>{gp.configuration}</td>
                                                                <td></td>
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

export default Groups;