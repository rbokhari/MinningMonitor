import React from 'react';
import toastr from 'toastr';
import ReactToolTip from 'react-tooltip';

import { IsLoading } from '../common/';
import WalletAddModal from './walletAddModal';
import Api from '../../api/Api';

class WalletList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            wallets: [],
            showModa: false,
            wallet: {}
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
        const groupPromise = Api.get('group').then(d=>d.json());
        const walletPromise = Api.get('wallet').then(d=>d.json());

        Promise.all([groupPromise, walletPromise])
            .then(data => {
                const groups = data[0];
                const wallets = data[1];
                const walletList = wallets.map(d => {
                    return {
                        ...d,
                        groups: groups.filter(g=>g.wallet == d._id).length || 0
                    }
                });
                this.setState({wallets: walletList, isLoading: false});
            }, err => {
                console.error('error', err);
            });

        // Api.get('client')
        //     .then(res => res.json())
        //     .then(data => {
        //         this.setState({clients: data.data});
        //         Api.get('wallet')
        //             .then(res => res.json())
        //             .then(wallets => {
        //                 this.setState({wallets: wallets, isLoading: false});
        //             }, err => {
        //                 console.error('error', err);
        //             });
        //     });
    }

    handleModalShow() {
        this.setState({showModal: true});
    }

    handleModalClose() {
        this.setState({showModal: false});
    }
    
    handleModalChange(e) {
        e.preventDefault();
        let { wallet } = this.state;
        wallet[e.target.name] = e.target.value;
        this.setState({ wallet });
    }
    
    handleModalSubmit(e) {
        e.preventDefault();
        const { wallet } = this.state;        
        if (wallet.id) {
            Api.put(`wallet/${wallet.id}`, wallet)
                .then(res => {
                    console.info('group post', res);
                    toastr.success('New Wallet added !', 'Success !');
                    this.handleModalClose();
                    this.getData();
                }, err => {
                    console.error('group error', err);
                });
        } else {
            Api.post('wallet', wallet)
                .then(res => {
                    console.info('wallet post', res);
                    toastr.success('Wallet updated !', 'Success !');
                    this.handleModalClose();
                    this.getData();
                }, err => {
                    console.error('group error', err);
                });
        }
        //this.setState({showModal: false});
    }

    render() {
        const { wallets, isLoading, showModal, wallet } = this.state;

        return(
            <div className="pcoded-content">
                <WalletAddModal isOpen={showModal} wallet={wallet} onHandleChange={this.handleModalChange} onHandleSubmit={this.handleModalSubmit} onHandleClose={this.handleModalClose} />
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
                                                <h5>Wallets</h5>
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
                                                            {!isLoading && wallets.length == 0 && <tr><td colSpan="4">No Record Found</td></tr>}
                                                            {wallets && wallets.map((wallet, i) => (<tr key={i+1}>
                                                                <td>{wallet.name}</td>
                                                                <td>{wallet.ethAddress}</td>
                                                                <td>{wallet.groups}</td>
                                                                <td>
                                                                    {wallet.notes}
                                                                </td>
                                                                <td>
                                                                    <i className="fas fa-edit" data-tip data-for={`${wallet._id}edit`} onClick={() => this.handleEditModalShow(wallet)} style={{cursor: 'pointer'}} ></i>&nbsp;&nbsp;
                                                                    <ReactToolTip id={`${wallet._id}edit`}>
                                                                        <span>Update Wallet</span>
                                                                    </ReactToolTip>

                                                                    {wallet.groups == 0 && <i  data-tip data-for={`${wallet._id}delete`} className="fas fa-trash-alt" onClick={() => this.handleDeleteModal(wallet._id)} style={{cursor: 'pointer'}} tooltip="delete"></i>}
                                                                    {wallet.groups > 0 && <i data-tip data-for={`${wallet._id}delete`} className="fas fa-trash-alt" style={{cursor: 'pointer', opacity: 0.5, pointerEvents: 'none'}} tooltip="delete"></i>}
                                                                    <ReactToolTip id={`${wallet._id}delete`} >
                                                                        <span>Delete Wallet</span>
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

export default WalletList;