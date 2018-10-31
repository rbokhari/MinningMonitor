import React from 'react';
import toastr from 'toastr';
import ReactToolTip from 'react-tooltip';

import { IsLoading, DeleteConfirmModal } from '../common/';
import PoolAddModal from './poolAddModal';
import Api from '../../api/Api';

class PoolList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            pools: [],
            showModal: false,
            showDeleteModal: false,
            pool: {}
        };

        this.getData = this.getData.bind(this);
        this.handleModalChange = this.handleModalChange.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalSubmit = this.handleModalSubmit.bind(this);
        this.handleEditModalShow = this.handleEditModalShow.bind(this);

        this.handleDeleteClose = this.handleDeleteClose.bind(this);
        this.handleDeleteModal = this.handleDeleteModal.bind(this);
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);

        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": true,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        this.setState({isLoading: true, pools: []});
        const poolPromise = Api.get('pool').then(res => res.json());
        const groupPromise = Api.get('group').then(res => res.json());

        Promise.all([poolPromise, groupPromise])
            .then(data => {
                const pools = data[0];
                const groups = data[1];
                const poolList = pools.map(pool => {
                    return {
                        ...pool,
                        groups: groups.filter(d=>d.pool == pool._id).length || 0
                    }
                })
                this.setState({pools: poolList, isLoading: false});
            }, err => {
                console.error('error', err);
            });
    }

    handleModalShow() {
        this.setState({showModal: true});
    }

    handleEditModalShow(pool) {
        const poolClone = {...pool};
        this.setState({showModal: true, pool: poolClone});
    }

    handleModalClose() {
        this.setState({showModal: false});
    }
    
    handleModalChange(e) {
        e.preventDefault();
        let { pool } = this.state;
        pool[e.target.name] = e.target.value;
        this.setState({ pool });
    }
    
    handleModalSubmit(e) {
        e.preventDefault();
        const { pool } = this.state;        
        if (pool.id) {
            Api.put(`pool/${pool.id}`, pool)
                .then(res => {
                    toastr.success('New Pool added !', 'Success !');
                    this.handleModalClose();
                    this.getData();
                }, err => {
                    console.error('pool error', err);
                });
        } else {
            Api.post('pool', pool)
                .then(res => {
                    toastr.success('Pool updated !', 'Success !');
                    this.handleModalClose();
                    this.getData();
                }, err => {
                    console.error('pool error', err);
                });
        }
        //this.setState({showModal: false});
    }

    handleDeleteModal(pool) {
        const poolClone = {...pool}; // Object.assign({}, pool);
        this.setState((prevState, props) => ({showDeleteModal: true, pool: poolClone}));
    }

    handleDeleteSubmit(e) {
        e.preventDefault();
        const { pool } = this.state;
        this.setState(prevState => ({showDeleteModal: false}));
        Api.delete(`pool/${pool.id}`)
            .then(res => {
                this.getData();
                })
            .catch(err => console.error('Delete Pool', err));
    }

    handleDeleteClose(e) {
        e.preventDefault();
        this.setState(prevState => ({showDeleteModal: false}));
    }


    render() {
        const { pools, isLoading, showModal, pool, showDeleteModal } = this.state;

        return(
            <div className="pcoded-content">
                <DeleteConfirmModal isOpen={showDeleteModal} title="Pool" msg="Are you sure to delete this Pool ?" onHandleSubmit={this.handleDeleteSubmit} onHandleClose={this.handleDeleteClose} />
                <PoolAddModal isOpen={showModal} pool={pool} onHandleChange={this.handleModalChange} onHandleSubmit={this.handleModalSubmit} onHandleClose={this.handleModalClose} />
                <div className="page-header">
                    <div className="page-block">
                        <div className="row align-items-center">
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
                                                <h5>Pools</h5>
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
                                                                <th className="span4">Name</th>
                                                                <th className="span4">Address</th>
                                                                <th>Groups</th>
                                                                <th className="span3">Notes</th>
                                                                <th className="span1">Functions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {isLoading && <tr><td colSpan="4"><IsLoading /></td></tr>}
                                                            {!isLoading && pools.length == 0 && <tr><td colSpan="4">No Record Found</td></tr>}
                                                            {pools && pools.map((pool, i) => (<tr key={i+1}>
                                                                <td>{pool.name}</td>
                                                                <td>{pool.address}</td>
                                                                <td>{pool.groups}</td>
                                                                <td>
                                                                    {pool.notes}
                                                                </td>
                                                                <td>
                                                                    <i className="fas fa-edit" data-tip data-for={`${pool._id}edit`} onClick={() => this.handleEditModalShow(pool)} style={{cursor: 'pointer'}} ></i>&nbsp;&nbsp;
                                                                    <ReactToolTip id={`${pool._id}edit`}>
                                                                        <span>Update Pool</span>
                                                                    </ReactToolTip>

                                                                    <i data-tip data-for={`${pool._id}delete`}  className="fas fa-trash-alt" onClick={() => this.handleDeleteModal(pool)} style={{cursor: 'pointer'}}></i>
                                                                    <ReactToolTip id={`${pool._id}delete`} >
                                                                        <span>Delete Pool</span>
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

export default PoolList;