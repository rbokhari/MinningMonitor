import React from 'react';
import toastr from 'toastr';

import { IsLoading } from '../common/';
import PoolAddModal from './poolAddModal';
import Api from '../../api/Api';

class PoolList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            pools: [],
            showModa: false,
            pool: {}
        };

        this.getData = this.getData.bind(this);
        this.handleModalChange = this.handleModalChange.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalSubmit = this.handleModalSubmit.bind(this);

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
        //toastr.info('Getting data !');
        this.setState({isLoading: true});
        Api.get('pool')
            .then(res => res.json())
            .then(data => {
                console.info("data", data);
                this.setState({pools: data, isLoading: false});

            });
    }

    handleModalShow() {
        this.setState({showModal: true});
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
                    console.info('group post', res);
                    toastr.success('New Pool added !', 'Success !');
                    this.handleModalClose();
                    this.getData();
                }, err => {
                    console.error('pool error', err);
                });
        } else {
            Api.post('pool', pool)
                .then(res => {
                    console.info('pool post', res);
                    toastr.success('Pool updated !', 'Success !');
                    this.handleModalClose();
                    this.getData();
                }, err => {
                    console.error('pool error', err);
                });
        }
        //this.setState({showModal: false});
    }

    render() {
        const { pools, isLoading, showModal, pool } = this.state;

        return(
            <div className="pcoded-content">
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
                                                                <td>
                                                                    {pool.notes}
                                                                </td>

                                                                <td>
                                                                    {/* <i className="fas fa-edit" data-tip data-for={`${wallet._id}edit`} onClick={() => this.handleEditModalShow(wallet)} style={{cursor: 'pointer'}} ></i>&nbsp;&nbsp;
                                                                    <ReactToolTip id={`${wallet._id}edit`}>
                                                                        <span>Update Wallet</span>
                                                                    </ReactToolTip>

                                                                    <i data-tip data-for={`${wallet._id}delete`}  className="fas fa-trash-alt" tooltip="delete"></i>
                                                                    <ReactToolTip id={`${wallet._id}delete`} >
                                                                        <span>Delete Wallet</span>
                                                                    </ReactToolTip> */}
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