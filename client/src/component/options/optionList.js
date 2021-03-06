import React from 'react';
import toastr from 'toastr';
import ReactToolTip from 'react-tooltip';

import { IsLoading, DeleteConfirmModal } from '../common/';
import OptionModal from './optionModal';

import Api from '../../api/Api';


class OptionList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            options: [],
            showModal: false,
            showDeleteModal: false,
            option: {}
        };

        this.getData = this.getData.bind(this);
        this.handleModalChange = this.handleModalChange.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalSubmit = this.handleModalSubmit.bind(this);
        this.handleEditModalShow = this.handleEditModalShow.bind(this);


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
        this.setState({isLoading: true, options: []});
        Api.get('profileOption')
            .then(res => res.json())
            .then(data => {
                console.info(data);
                this.setState({options: data, isLoading: false});
            })
            .catch(err => {
                console.error('err', err);
                this.setState({isLoading: false});
            });
    }

    handleModalShow() {
        this.setState({showModal: true});
    }

    handleEditModalShow(clocktone) {
        const clocktoneClone = {...clocktone};
        this.setState({showModal: true, option: clocktoneClone});
    }
    
    handleModalClose() {
        this.setState({showModal: false});
    }
    
    handleModalChange(e) {
        e.preventDefault();
        let { option } = this.state;
        option[e.target.name] = e.target.value;
        this.setState({ option });
    }
    
    handleModalSubmit(e) {
        e.preventDefault();
        const { option } = this.state;
        console.info('option', option);
        if (option._id) {
            Api.put(`profileOption/${option._id}`, option)
                .then(res => {
                    console.info('group put', res);
                    toastr.success('Option Updated !', 'Success !');
                    this.handleModalClose();
                    this.getData();
                }, err => {
                    console.error('option error', err);
                });
        } else {
            Api.post('profileOption', option)
                .then(res => {
                    console.info('Option post', res);
                    toastr.success('Option updated !', 'Success !');
                    this.handleModalClose();
                    this.getData();
                }, err => {
                    console.error('option error', err);
                });
        }
        //this.setState({showModal: false});
    }


    render() {
        const { options, isLoading, showModal, showDeleteModal, option } = this.state;

        return(
            <div className="pcoded-content">
                <DeleteConfirmModal isOpen={showDeleteModal} title="Clocktone" msg="Are you sure to delete this Clocktone ?" onHandleSubmit={this.handleDeleteSubmit} onHandleClose={this.handleDeleteClose} />
                <OptionModal isOpen={showModal} option={option} 
                    onHandleChange={this.handleModalChange} 
                    onHandleSubmit={this.handleModalSubmit} 
                    onHandleClose={this.handleModalClose} />
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
                                                <h5>Options</h5>
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
                                                                <th>Label</th>
                                                                <th>Core</th>
                                                                <th>Memory</th>
                                                                <th>Voltage</th>
                                                                <th>PowerStage</th>
                                                                <th>Target Temp</th>
                                                                <th>Min Fan</th>
                                                                <th>Functions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {isLoading && <tr><td colSpan="4"><IsLoading /></td></tr>}
                                                            {!isLoading && options.length == 0 && <tr><td colSpan="4">No Record Found</td></tr>}
                                                            {options && options.map((opt, i) => (<tr key={i+1}>
                                                                <td>{opt.label}</td>
                                                                <td>{opt.core}</td>
                                                                <td>{opt.memory}</td>
                                                                <td>{opt.voltage}</td>
                                                                <td>{opt.powerStage}</td>
                                                                <td>{opt.temperature}</td>
                                                                <td>{opt.fanSpeed}</td>
                                                                <td>
                                                                    <i data-tip data-for={`${opt._id}label`} 
                                                                        style={{cursor: 'pointer'}} onClick={() => this.handleEditModalShow(opt)} 
                                                                        className="fas fa-edit" ></i>&nbsp;&nbsp;
                                                                    <ReactToolTip id={`${opt._id}label`}>
                                                                        <span>Modify Option</span>
                                                                    </ReactToolTip>
                                                                    &nbsp;
                                                                    <i data-tip data-for={`${opt._id}delete`}  className="fas fa-trash-alt" tooltip="delete"></i>
                                                                    <ReactToolTip id={`${opt._id}delete`} >
                                                                        <span>Delete Option</span>
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

export default OptionList;