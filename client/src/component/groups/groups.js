import React from 'react';
import toastr from 'toastr';
import ReactToolTip from 'react-tooltip';

import MinerGroupModal from './addNewModal';
import GroupDeleteModal from './groupDeleteModal';

import { IsLoading } from '../common/';
import Api from '../../api/Api';

class Groups extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            showDeleteModal: false,
            group: {
                isLoading: true,
                name: '',
                client: 0,
                config: '',
                notes: ''
            },
            groups: [],
            clients: [],
            miners: []
        };

        this.getData = this.getData.bind(this);
        this.handleModalChange = this.handleModalChange.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalShow = this.handleModalShow.bind(this);
        this.handleModalSubmit = this.handleModalSubmit.bind(this);

        this.handleEditModalShow = this.handleEditModalShow.bind(this);

        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
        this.handleDeleteModal = this.handleDeleteModal.bind(this);
        this.handleDeleteClose = this.handleDeleteClose.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        //toastr.info('Getting data !');
        this.setState({isLoading: true});
        Api.get('client')
            .then(res => res.json())
            .then(data => {
                this.setState({clients: data.data});
                Api.get('group')
                    .then(res => res.json())
                    .then(group => {
                        console.info('group data', group);
                        this.setState({groups: group, isLoading: false});
                    }, err => {
                        console.error('error', err);
                    });
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
        
        if (group.id) {
            Api.put(`group/${group.id}`, group)
                .then(res => {
                    console.info('group post', res);
                    this.handleModalClose();
                    this.getData();
                }, err => {
                    console.error('group error', err);
                });
        } else {
            Api.post('group', group)
                .then(res => {
                    console.info('group post', res);
                    this.handleModalClose();
                    this.getData();
                }, err => {
                    console.error('group error', err);
                });
        }
    }

    handleEditModalShow(group) {
        const updateGp = {
            id: group._id,
            name: group.name,
            notes: group.notes,
            client: group.minerClient,
            config: group.configuration,
            status: group.status
        };
        Api.get('client')
            .then(res => res.json())
            .then(data => {
                this.setState({clients: data.data, showModal: true, group: updateGp});
            }, err => {
                console.error('err', err);
            });
    }
    
    handleDeleteModal(group) {
        const groupClone = Object.assign({}, group);
        this.setState((prevState, props) => ({showDeleteModal: true, group: groupClone}));
    }

    handleDeleteSubmit(e) {
        e.preventDefault();
        const { group } = this.state;
        this.setState(prevState => ({showDeleteModal: false}));
        Api.delete(`group/${group._id}`)
            .then(res => {
                this.getData();
                // this.refs.container.success(
                //     "Success !",
                //     "Miner is delete.", {
                //     timeOut: 1000,
                //     extendedTimeOut: 100
                //   });
                })
            .catch(err => console.error('Delete Group', err));
    }

    handleDeleteClose(e) {
        e.preventDefault();
        this.setState(prevState => ({showDeleteModal: false}));
    }


    render() {
        const { showModal, group, clients, groups, showDeleteModal, miners, isLoading } = this.state;
        return (
            <div className="pcoded-content">
                <GroupDeleteModal isOpen={showDeleteModal} onHandleClose={this.handleDeleteClose} onHandleSubmit={this.handleDeleteSubmit} />
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
                                                    <button className="btn btn-primary" onClick={(e) => this.handleModalShow(e)}>
                                                        <i className="fas fa-plus-square" style={{color:'white'}}></i>&nbsp;Add New
                                                    </button> 
                                                </div>

                                            </div>
                                            <div className="card-block table-border-style">
                                                <div className="table-responsive">
                                                    <table className="table table-xl">
                                                        <thead>
                                                            <tr>
                                                                <th className="span2">Group Name</th>
                                                                <th className="span2">Notes</th>
                                                                <th className="span1">Miners</th>
                                                                <th className="span2">Miner Client</th>
                                                                <th className="span4" style={{'wordWrap':'break-word'}}>Configuration</th>
                                                                <th className="span1">Functions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {isLoading && <tr><td colSpan="6"><IsLoading /></td></tr>}
                                                            {groups && groups.map((gp, i) => (<tr key={i+1}>
                                                                <td>{gp.group.name}</td>
                                                                <td>{gp.group.notes}</td>
                                                                <td>
                                                                    {gp.miner.length == 0 ? '' : gp.miner.length}
                                                                </td>

                                                                <td>
                                                                    {clients && clients.filter(c=>c._id==gp.group.minerClient)[0].name}
                                                                </td>
                                                                <td>
                                                                    <p>{gp.group.configuration.length > 50 ? gp.group.configuration.substring(1, 50) + '  ...' : gp.group.configuration}</p>
                                                                </td>
                                                                <td>
                                                                    <i className="fas fa-edit" data-tip data-for={`${gp._id}edit`} onClick={() => this.handleEditModalShow(gp.group)} style={{cursor: 'pointer'}} ></i>&nbsp;&nbsp;
                                                                    <ReactToolTip id={`${gp._id}edit`}>
                                                                        <span>Update Group</span>
                                                                    </ReactToolTip>

                                                                    {gp.miner.length == 0 && <i  data-tip data-for={`${gp._id}delete`} className="fas fa-trash-alt" onClick={() => this.handleDeleteModal(gp.group)} style={{cursor: 'pointer'}} tooltip="delete"></i>}
                                                                    {gp.miner.length > 0 && <i data-tip data-for={`${gp._id}delete`} className="fas fa-trash-alt" style={{cursor: 'pointer', opacity: 0.5, pointerEvents: 'none'}} tooltip="delete"></i>}

                                                                    <ReactToolTip id={`${gp._id}delete`} >
                                                                        <span>Delete Group</span>
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

export default Groups;