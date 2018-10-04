import React from 'react';
import moment from 'moment';
//import MappleToolTip from 'reactjs-mappletooltip'; 
import toastr from 'toastr';
import ReactToolTip from 'react-tooltip';
import Api from '../../api/Api';
import { IsLoading, ConfirmDialog } from '../common/';
import RigEditModal from './rigEditModal';
import RigDeleteModal from './rigDeleteModal';
import RigNoteModal from './rigNoteModal';

require('../../toastr.min.css');

const styles = {
    'danger': {

    }
};

class Rigs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isConfirmModal: false,
            isConfirmSuccess: false,
            isConfirmFail: false,
            isLoading: true,
            sortBy: 'computerName',
            sortDirection: 0,
            actionId: 0,
            actionPosting: 0,
            actionRigId: '',
            isEditable: false,
            indexEdit: -1,
            idEdit: '',
            rigs: [],
            groups: [],
            rig: {},
            showModal: false,
            showDeleteModal: false,
            showNoteModal: false,
            interval: 1000*30   // 30 seconds
        };
        this.getData = this.getData.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleModal = this.handleModal.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.calculateMining = this.calculateMining.bind(this);
        
        this.handleDeleteModal = this.handleDeleteModal.bind(this);
        this.handleDeleteClose = this.handleDeleteClose.bind(this);
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);

        this.handleNoteModal = this.handleNoteModal.bind(this);
        this.handleNoteClose = this.handleNoteClose.bind(this);
        this.handleNoteSubmit = this.handleNoteSubmit.bind(this);
        this.handleNoteChange = this.handleNoteChange.bind(this);
        this.sorting = this.sorting.bind(this);
        this.compare = this.compare.bind(this);
        this.setAction = this.setAction.bind(this);

        this.handleConfirmModalShow = this.handleConfirmModalShow.bind(this);
        this.handleConfirmClose = this.handleConfirmClose.bind(this);
        this.handleConfirmSubmit = this.handleConfirmSubmit.bind(this);
        //this.setEdit = this.setEdit.bind(this);

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
          }
    }

    compare(a, b) {
        const { sortBy, sortDirection } = this.state;
        if (sortDirection == 1) {
            if (a[sortBy] > b[sortBy])
              return -1;
            if (a[sortBy] < b[sortBy])
              return 1; 
        } else {
            if (a[sortBy] < b[sortBy])
              return -1;
            if (a[sortBy] > b[sortBy])
              return 1; 
        }
        return 0;
    }

    sorting(rigs, sortedBy) {
        if (sortedBy != '') {
            this.setState({ sortBy: sortedBy });
        }
        const sortedRigs = rigs.sort(this.compare);
        this.setState({ rigs: sortedRigs });
    }
    
    sortByHeader(rigs, sortedBy) {
        const { sortDirection } = this.state;
        this.sorting(rigs, sortedBy);
        this.setState({ sortDirection: sortDirection ==  1 ? 0 : 1 });
    }

    componentDidMount() {
        this.getData();
        this.timerId = setInterval(this.getData, 20000);
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
    }

    setEdit(index) {
        let { rigs, idEdit } = this.state;

        rigs = rigs.map((rig, i) => {
            return (
                {
                    ...rig,
                    isNameEdit: (i==index)
                }
            );
        });
        // let currRig = this.state.rigs.filter((r,i) => (i == index));
        // console.info(currRig);
        // currRig.isNameEdit = true;
        // let otherRig = this.state.rigs.filter((r,i) => i != index);
        // let updateRig = 
        // this.setState((prevState, props) => ({rigs: otherRig}));
        this.setState((prevState, props) => ({rigs: rigs, indexEdit: index, idEdit: rigs[index]._id}));
    }

    handleNameChange(e) {
        e.preventDefault();
        let { rigs, indexEdit } = this.state;
        rigs = rigs.map((rig,i) => {
            return {
                ...rig,
                computerName: i==indexEdit ? e.target.value : rig.computerName
            };
        });
        this.setState((prevState, props) => ({rigs: rigs}));
    }

    handleSubmit(e) {
        e.preventDefault();
        // const { idEdit, indexEdit } = this.state;
        // const computerName = this.state.rigs[indexEdit].computerName;
        // let rigs = this.state.rigs;
        // rigs[indexEdit].isNameEdit = false;
        const { rig } = this.state;
        Api.put(`rigs/${rig._id}/name`, {'name': rig.computerName, 'group': rig.group})
            .then(res => {
                this.handleModalClose();
                this.setState({rig: rig, actionId: 1});
                this.setAction(rig, 2);
                this.getData();
                toastr.success('Name / Group changed!', 'Success !');
            })
            .catch(err => {
                toastr.error('Some error occured !', 'Error  !');
            });
    }

    handleModal(rig) {
        const rigClone = Object.assign({}, rig);
        Api.get('group')
            .then(res => res.json())
            .then(data => {
                this.setState((prevState, props) => ({groups: data, showModal: true, rig: rigClone}));
            })
    }

    handleModalClose() {
        this.setState(prevState => ({showModal: false}));
    }

    handleChange(e) {
        e.preventDefault();
        let { rig } = this.state;
        rig[e.target.name] = e.target.value;
        this.setState({ rig: rig });
    }

    getData() {
        Api.get('group')
            .then(res => res.json())
            .then(groups => {
                this.setState({groups: groups});
                Api.get('rigs')
                    .then(res => res.json())
                    .then(data =>    {
                        console.info('data', data);
                        const rigs = data
                            .map(rig => {
                                return {
                                    ...rig,
                                    notes: rig.notes ? rig.notes : '',
                                    totalHashrate: Math.floor((new Date() - new Date(rig.updatedAt))/1000/60) > 2 ? 0 : rig.totalHashrate,
                                    maxTemp: 0,
                                    maxFan: 0,
                                    groupName: rig.group && groups && groups.filter(c=>c.group._id==rig.group)[0].group.name,
                                    isNameEdit: false,
                                    minutes: Math.floor((new Date() - new Date(rig.updatedAt))/1000/60),
                                    isOnline: Math.floor((new Date() - new Date(rig.updatedAt))/1000/60) > 2 ? 0 : 1,
                                    format: moment(rig.ping_time).fromNow()
                                }
                            });
                        this.setState({isLoading: false});
                        let sortRigs = this.sorting(rigs, '')
                        //this.setState((prevState, props) => ({rigs: sortRigs}));
                    })
                    .catch(err => {
                        console.error('fetch error', err);
                    });
            }, err => {
                console.error('loading rig data error', err);
             })
    }

    // deleteRig(id) {
    //     Api.delete(`rigs/${id}`)
    //         .then(res => this.getData())
    //         .catch(err => console.error('Delete Rig', err));
    // }

    handleDeleteModal(rig) {
        const rigClone = Object.assign({}, rig);
        this.setState((prevState, props) => ({showDeleteModal: true, rig: rigClone}));
    }

    handleDeleteSubmit(e) {
        e.preventDefault();
        const { rig } = this.state;
        this.setState(prevState => ({showDeleteModal: false}));
        Api.delete(`rigs/${rig._id}`)
        .then(res => {
            this.getData();
            toastr.success(`Miner ${rig.computerName} Deleted `, 'Success !');
            })
            .catch(err => {
                toastr.error(`Unable to delete ${rig.computerName} `, 'Error !');
                console.error('Delete Rig', err);
            });
    }

    handleDeleteClose(e) {
        e.preventDefault();
        this.setState(prevState => ({showDeleteModal: false}));
    }

    handleNoteModal(rig) {
        const rigClone = Object.assign({}, rig);
        this.setState((prevState, props) => ({showNoteModal: true, rig: rigClone}));
    }

    handleNoteSubmit(e) {
        e.preventDefault();
        const { rig } = this.state;
        this.setState(prevState => ({showNoteModal: false}));
        Api.put(`rigs/${rig._id}/note`, {'note': rig.notes})
            .then(res => {
                this.getData();
                toastr.success(`Note for ${rig.computerName} is added `, 'Success !');                
            })
            .catch(err => {
                toastr.error(`Error Occured for creating note `, 'Error !');
                console.error('Delete Rig', err)
            });
    }

    handleNoteChange(e) {
        e.preventDefault();
        const { rig } = this.state;
        rig.notes = e.target.value;
        this.setState({ rig: rig });
    }


    handleNoteClose(e) {
        e.preventDefault();
        this.setState(prevState => ({showNoteModal: false}));
    }

    setAction(rig, actionId) {
        const action = {
            rig: rig._id,
            action: actionId,
            status: 1
        };
        let msg = '';
        
        if (actionId == 1) msg = `Machine ${rig.computerName} Restart action added`
        else if (actionId == 2) msg = `Miner ${rig.computerName} Reset action added.`

        this.setState({ actionId: actionId, actionPosting: 1, actionRigId: rig._id});
        Api.post('actions', action)
            .then(res => {
                toastr.success(msg, 'Success !');
                this.setState({ actionId: 0, actionPosting: 0, actionRigId: ''});
                this.getData();
            })
            .catch(err => {
                toastr.error('Error occured !', 'Error');
                console.error('action error', err);
            });
    }

    calculateTime(d1) {
        const result = Math.floor((new Date() - new Date(d1))/1000/60);
        return result;
    }
 
    formatLastSeen(d) {
        let secs = ((new Date() - new Date(d))/1000).toFixed(0);
        // const hours = secs / 60 / 60;
        // const mins = secs / 60;
        //return `${hours.toFixed(0)}h:${mins.toFixed(0)}m`
        // return moment(secs, 'ss').format('h:mm:ss');
        //return secs;
        return moment() //(secs * 1000)
                .startOf('day')
                .seconds(secs)
                .format('d[d] H[h] m[m] s[s]');
    }

    formatLastSeen2(t) {
        // return moment().startOf('day')
        //         .seconds(t*60)
        //         .format('H[h] m[m] s[s]');
        var milliseconds = new Date() - new Date(t);
        var day, hour, minute, seconds;
        seconds = Math.floor(milliseconds / 1000);
        minute = Math.floor(seconds / 60);
        seconds = seconds % 60;
        hour = Math.floor(minute / 60);
        minute = minute % 60;
        day = Math.floor(hour / 24);
        hour = hour % 24;
        return `
            ${isNaN(day) ? '' : day}d
            ${isNaN(hour) ? '' : hour}h 
            ${isNaN(minute) ? 0 : minute}m 
            ${isNaN(seconds) ? 0 : seconds}s
        `;
    }

    formatMinerUpTime(t) {
        // return moment().startOf('day')
        //         .seconds(t*60)
        //         .format('H[h] m[m] s[s]');
        var milliseconds = t * 60 * 1000;
        var day, hour, minute, seconds;
        seconds = Math.floor(milliseconds / 1000);
        minute = Math.floor(seconds / 60);
        seconds = seconds % 60;
        hour = Math.floor(minute / 60);
        minute = minute % 60;
        day = Math.floor(hour / 24);
        hour = hour % 24;
        return `
            ${isNaN(day) ? 0 : day}d
            ${isNaN(hour) ? 0 : hour}h 
            ${isNaN(minute) ? 0 : minute}m 
        `;
            // ${isNaN(seconds) ? 0 : seconds}s
    }

    calculateMining() {
        const { rigs } = this.state;
        let total = rigs.reduce((a,b) => (a + parseFloat(b.totalHashrate)), 0);
        if (total > 1024) {
            total = (total/1024).toFixed(2) + ' GH/s';
        } else {
            total = total.toFixed(0) + ' MH/s';
        }
        return total;
    }

    styleMaxTemp(temps) {
        if (typeof temps == undefined) return;
        if (temps == null) return;
        const max = Math.max(...temps);
        if (max > 85 ) return (<p className="text-danger">{max}&nbsp;℃</p>)
        else if (max > 75) return (<p className="text-warning">{max}&nbsp;℃</p>)
        else return (<p>{max}&nbsp;℃</p>)
    }

    handleConfirmModalShow(rig, actionId) {
        this.setState({isConfirmModal: true, rig: rig, actionId: actionId});
    }

    handleConfirmSubmit() {
        
        const { rig, actionId} = this.state;

        const action = {
            rig: rig._id,
            action: actionId,
            status: 1
        };
        let msg = '';
        
        if (actionId == 1) msg = `Machine ${rig.computerName} Restart action added`
        else if (actionId == 2) msg = `Miner ${rig.computerName} Reset action added.`

        this.setState({ actionId: actionId, actionPosting: 1, actionRigId: rig._id});
        Api.post('actions', action)
            .then(res => {
                toastr.success(msg, 'Success !');
                this.setState({ isConfirmModal: false, actionId: 0, actionPosting: 0, actionRigId: ''});
                this.getData();
            })
            .catch(err => {
                toastr.error('Error occured !', 'Error');
                console.error('action error', err);
            });
    }

    handleConfirmClose() {
        this.setState({isConfirmModal: false});
    }

    render() {
        const { isLoading, showModal, showDeleteModal, showNoteModal, rigs, rig, groups, sortBy, sortDirection, 
            actionId, actionPosting, actionRigId, isConfirmModal } = this.state;
        
        var msg = '';
        if (actionId==1) msg = `Are you sure to restart miner machine : ${rig.computerName} ?`;
        else if (actionId==2) msg = `Are you sure to reset miner application : ${rig.computerName} ?`

        return (<div>
            <div className="pcoded-content">
                <ConfirmDialog isOpen={isConfirmModal} title={`Miner : ${rig.computerName}`} message={msg} onHandleSubmit={this.handleConfirmSubmit} onHandleClose={this.handleConfirmClose} />
                <RigEditModal isOpen={showModal} rig={rig} groups={groups} onHandleClose={this.handleModalClose} onHandleChange={this.handleChange} onHandleSubmit={this.handleSubmit}  />
                <RigDeleteModal isOpen={showDeleteModal} onHandleClose={this.handleDeleteClose} onHandleSubmit={this.handleDeleteSubmit} />
                <RigNoteModal isOpen={showNoteModal} rig={rig} onHandleClose={this.handleNoteClose} onHandleSubmit={this.handleNoteSubmit} onHandleChange={this.handleNoteChange} />
                <div className="page-header">
                    <div className="page-block">
                        <div className="row align-items-center">
                            <div className="col-md-12">
                                <div className="page-header-title">
                                    <h5 className="m-b-10">Miners </h5>
                                </div>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="index.html">
                                            <i className="feather icon-home"></i>
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item"><a href="#!">Miners</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pcoded-inner-content">
                    <div className="main-body">
                        <div className="page-wrapper">
                            <div className="page-body">
                                <div className="row">
                                    <div className="col-xl-3 col-md-6">
                                        <div className="card o-hidden bg-c-blue web-num-card">
                                            <div className="card-block text-white">
                                                <h5 className="m-t-15">Mining Hashrate</h5>
                                                {/* <h3 className="m-b-15">{rigs && rigs.reduce((a,b) => (a + parseFloat(b.totalHashrate)), 0).toFixed(0)}&nbsp;MH/s</h3> */}
                                                <h3 className="m-b-15">{this.calculateMining()}</h3>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-3 col-md-6">
                                        <div className="card o-hidden bg-c-green web-num-card">
                                            <div className="card-block text-white">
                                                <h5 className="m-t-15">Active GPU</h5>
                                                <h3 className="m-b-15">0</h3>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-3 col-md-6">
                                        <div className="card o-hidden bg-c-red web-num-card">
                                            <div className="card-block text-white">
                                                <h5 className="m-t-15">Active Miners</h5>
                                                <h3 className="m-b-15">{rigs && rigs.filter(c=>c.isOnline==1).length + ' / ' + rigs.length}</h3>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-xl-3 col-md-6">
                                        <div className="card o-hidden bg-c-yellow web-num-card">
                                            <div className="card-block text-white">
                                                <h5 className="m-t-15">Unpaid Balance</h5>
                                                <h3 className="m-b-15">$ 0</h3>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                        
                                <div className="row">
                                    <div className="col-xl-12 col-md-12">
                                    <div className="card">
                                            <div className="card-header">
                                                <h5>Miners </h5>
                                                <span>click headers to sort accordingly</span> 
                                                <div className="card-header-right">
                                                    <i className="fas fa-plus-square" onClick={(e) => this.getData(e)} style={{color:'white'}}></i>Refresh
                                                </div>
                                            </div>
                                            <div className="card-block table-border-style">
                                                <div className="table-responsive">
                                                    <table className="table table-">
                                                        <thead>
                                                            <tr>
                                                                <th style={{width:'10pt'}}></th>
                                                                <th style={{cursor: 'pointer'}} onClick={() => this.sortByHeader(rigs, 'computerName')}>
                                                                    Miner Name&nbsp;
                                                                    {sortBy == 'computerName' && sortDirection == 1 && <i style={{opacity: 0.5}} className="fas fa-long-arrow-alt-down"></i>}
                                                                    {sortBy == 'computerName' && sortDirection == 0 && <i style={{opacity: 0.5}} className="fas fa-long-arrow-alt-up"></i>}
                                                                </th>
                                                                <th style={{cursor: 'pointer'}} onClick={() => this.sortByHeader(rigs, 'groupName')}>
                                                                    Group&nbsp;
                                                                    {sortBy == 'groupName' && sortDirection == 1 && <i style={{opacity: 0.5}} className="fas fa-long-arrow-alt-down"></i>}
                                                                    {sortBy == 'groupName' && sortDirection == 0 && <i style={{opacity: 0.5}} className="fas fa-long-arrow-alt-up"></i>}
                                                                </th>
                                                                <th style={{cursor: 'pointer'}} onClick={() => this.sortByHeader(rigs, 'notes')}>
                                                                    Notes&nbsp;
                                                                    {sortBy == 'notes' && sortDirection == 1 && <i style={{opacity: 0.5}} className="fas fa-long-arrow-alt-down"></i>}
                                                                    {sortBy == 'notes' && sortDirection == 0 && <i style={{opacity: 0.5}} className="fas fa-long-arrow-alt-up"></i>}
                                                                </th>
                                                                <th style={{cursor: 'pointer'}} onClick={() => this.sortByHeader(rigs, 'totalHashrate')}>
                                                                    Hashrate&nbsp;
                                                                    {sortBy == 'totalHashrate' && sortDirection == 1 && <i style={{opacity: 0.5}} className="fas fa-long-arrow-alt-down"></i>}
                                                                    {sortBy == 'totalHashrate' && sortDirection == 0 && <i style={{opacity: 0.5}} className="fas fa-long-arrow-alt-up"></i>}
                                                                </th>
                                                                <th>
                                                                    Core/Mem
                                                                </th>
                                                                <th>Max ℃</th>
                                                                <th style={{cursor: 'pointer'}} onClick={() => this.sortByHeader(rigs, 'rigUpTime')}>
                                                                    UpTime&nbsp;
                                                                    {sortBy == 'rigUpTime' && sortDirection == 1 && <i style={{opacity: 0.5}} className="fas fa-long-arrow-alt-down"></i>}
                                                                    {sortBy == 'rigUpTime' && sortDirection == 0 && <i style={{opacity: 0.5}} className="fas fa-long-arrow-alt-up"></i>}
                                                                </th>
                                                                <th>Functions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {isLoading && <tr><td colSpan='5'><IsLoading /></td></tr>}
                                                            {rigs && rigs.map((rig,i) => (
                                                            <tr key={rig._id}
                                                                // className={rig.minutes > 125 ? 'alert alert-danger' : 'alert alert-success'}
                                                                // className={(Math.max(...rig.temperatures))>80 ? 'alert alert-danger' : ''}
                                                                // style={{'backgroundColor': ((Math.max(...rig.temperatures))>75 && (Math.max(...rig.temperatures))<=85) ? '#fff8e6' : (Math.max(...rig.temperatures))>85 ? '#ffece6' : ''}}
                                                                >
                                                                <td>
                                                                    {/* <MappleToolTip float={true} direction={'bottom'} mappleType={rig.minutes > 2 ? 'info' : 'info'}>
                                                                        <div>
                                                                            <i className="fa fa-circle" style={{color:rig.minutes > 2 ? 'silver' : 'green'}}></i>&nbsp;
                                                                        </div>
                                                                        <div>
                                                                            {rig.minutes > 2 ? 'offline' : 'online'}
                                                                        </div>
                                                                    </MappleToolTip> */}
                                                                    <i data-tip data-for={`${rig._id}status`} className="fa fa-circle" style={{color:rig.minutes > 2 ? 'silver' : 'green'}}></i>&nbsp;
                                                                    <ReactToolTip id={`${rig._id}status`} type="info"  >
                                                                        <span>{rig.minutes > 2 ? 'offline' : 'online'}</span>
                                                                    </ReactToolTip>
                                                                </td>
                                                                <td>
                                                                    <span data-tip data-for={`${rig._id}name`}>{rig.computerName}</span>
                                                                    <ReactToolTip id={`${rig._id}name`} type="info"  >
                                                                        <ul>
                                                                            <li>OS Version : {rig.osName}</li>
                                                                            <li>Miner ID :</li>
                                                                            <li>Lan IP : {rig.ip}</li>
                                                                            <li>Public IP :</li>
                                                                        </ul>
                                                                    </ReactToolTip>
                                                                    {/* <div> */}
                                                                    {/* {rig.isNameEdit && 
                                                                        <form onSubmit={this.handleSubmit}>
                                                                            <input type="text" value={rig.computerName} onChange={this.handleNameChange} />
                                                                        </form>
                                                                    } */}
                                                                    {/* {!rig.isNameEdit && <a>
                                                                        <MappleToolTip float={true} direction={'bottom'} mappleType={'info'}>
                                                                            <div>
                                                                                {rig.computerName}
                                                                                
                                                                            </div>
                                                                            <div>
                                                                                OS Version : <br/>
                                                                                Rig Id : <br/>
                                                                                Lan IP : {rig.ip}<br/>
                                                                                Public IP : <br/> 
                                                                                Gpu :
                                                                            </div>
                                                                        </MappleToolTip>
                                                                    </a>}
                                                                    </div> */}
                                                                </td>
                                                                <td>{rig.groupName}</td>
                                                                <td>
                                                                    {rig.notes !== '' && <a href="#" onClick={()=> this.handleNoteModal(rig)}>{rig.notes}</a>}
                                                                    {rig.notes == '' && <i className="fas fa-sticky-note" style={{cursor: 'pointer'}} onClick={()=> this.handleNoteModal(rig)}></i>}
                                                                </td>
                                                                <td>
                                                                    <ul>
                                                                        <li>
                                                                            <span data-tip data-for={`${rig._id}hashrate`}>{(rig.totalHashrate/1).toFixed(2)} MH/s</span>
                                                                            <ReactToolTip id={`${rig._id}hashrate`} type="info"  >
                                                                                <ul>
                                                                                    {rig.singleHashrate.map((hash,j) => (<li key={(j+1)*11}>GPU{j} : &nbsp;{(hash/1000).toFixed(2)}&nbsp;<small>MH/s</small></li>))}
                                                                                </ul>
                                                                            </ReactToolTip>
                                                                        </li>
                                                                        <li>
                                                                            <span>({rig.singleHashrate.length})</span>
                                                                        </li>
                                                                    </ul>
                                                                    {/* <MappleToolTip float={true} direction={'top'} mappleType={'info'}>
                                                                        <div>
                                                                            <label className=''>{(rig.totalHashrate/1).toFixed(2)} MH/s</label>
                                                                        </div>
                                                                        <div>
                                                                            {rig.singleHashrate.map((hash,j) => (<span key={(j+1)*11}>GPU{j} : &nbsp;{(hash/1000).toFixed(2)}&nbsp;<small>MH/s</small><br /></span>))}
                                                                        </div>
                                                                    </MappleToolTip> */}
                                                                </td>
                                                                <td>
                                                                    <ul>
                                                                        <li>
                                                                            {rig.core && rig.core.map((core,j)=> (<span key={(j+1)*3}>{core}&nbsp;</span>))}
                                                                        </li>
                                                                        <li>
                                                                            {rig.memory && rig.memory.map((mem,j)=> (<span key={(j+1)*3}>{mem}&nbsp;</span>))}
                                                                        </li>
                                                                    </ul>
                                                                </td>
                                                                <td>
                                                                    <span data-tip data-for={`${rig._id}temp`}>
                                                                        {this.styleMaxTemp(rig.temperatures)}
                                                                        {Math.max(...rig.fanSpeeds)}&nbsp;%
                                                                    </span>
                                                                    <ReactToolTip id={`${rig._id}temp`} type="info"  >
                                                                        <ul>
                                                                            <li>
                                                                                {rig.temperatures.map((temp,j)=> (<span key={(j+1)*3}>{temp}&nbsp;</span>))}
                                                                            </li>
                                                                            <li>
                                                                            {rig.fanSpeeds.map((speed,j)=> (<span key={(j+1)*10}>{speed}&nbsp;</span>))}
                                                                            </li>
                                                                        </ul>
                                                                    </ReactToolTip>
                                                                    {/* <MappleToolTip float={true} direction={'top'} mappleType={'info'}>
                                                                        <div>
                                                                            {this.styleMaxTemp(rig.temperatures)}
                                                                            {Math.max(...rig.fanSpeeds)}&nbsp;%
                                                                        </div>
                                                                        <div>
                                                                            <span>
                                                                                {rig.temperatures.map((temp,j)=> (<span key={(j+1)*3}>{temp}&nbsp;</span>))}
                                                                            </span>℃<br/>
                                                                            <span>
                                                                                {rig.fanSpeeds.map((speed,j)=> (<span key={(j+1)*10}>{speed}&nbsp;</span>))}
                                                                            </span>%
                                                                        </div>
                                                                    </MappleToolTip> */}
                                                                    {/* {rig.temperatures.map((temp,j)=> (<label key={(i+j+1)*102}>{temp}C&nbsp;&nbsp;</label>))}<br/>
                                                                    {rig.fanSpeeds.map((fan,j)=> (<label key={(i+j+1)*201}>{fan}%&nbsp;&nbsp;</label>))}<br/> */}
                                                                </td>
                                                                <td>
                                                                    <span data-tip data-for={`${rig._id}uptime`}>
                                                                        {rig.isOnline ==1 && this.formatMinerUpTime(rig.rigUpTime)}
                                                                        {rig.isOnline == 0 && '--'}
                                                                    </span>
                                                                    <ReactToolTip id={`${rig._id}uptime`} type="info"  >
                                                                        <ul>
                                                                            <li>
                                                                                System Up Time : {moment(rig.serverTime).format('DD/MM/YYYY hh:mm')}
                                                                            </li>
                                                                            <li>
                                                                                Miner Up Time : {rig.isOnline == 0 && '--'} {rig.isOnline ==1 && this.formatMinerUpTime(rig.rigUpTime)}
                                                                            </li>
                                                                            <li>
                                                                                Last Seen : {this.formatLastSeen2(rig.updatedAt)}
                                                                            </li>
                                                                            <li>
                                                                                Miner Restart Count : 0
                                                                            </li>
                                                                        </ul>
                                                                    </ReactToolTip>
                                                                    {/* <MappleToolTip float={true} direction={'top'} mappleType={'info'}>
                                                                        <div>
                                                                            {rig.isOnline ==1 && this.formatMinerUpTime(rig.rigUpTime)}
                                                                            {rig.isOnline == 0 && '--'}
                                                                        </div>
                                                                        <div>
                                                                            <span>
                                                                                System Up Time : {moment(rig.serverTime).format('DD/MM/YYYY hh:mm')}<br />
                                                                                Miner Up Time : {rig.isOnline == 0 && '--'} {rig.isOnline ==1 && this.formatMinerUpTime(rig.rigUpTime)} <br/>
                                                                                Last Seen : {this.formatLastSeen2(rig.updatedAt)}<br />
                                                                            </span>
                                                                        </div>
                                                                    </MappleToolTip> */}
                                                                </td>
                                                                <td>
                                                                    {/* <i data-toggle="modal" data-id="id value" data-target="#default-Modal" className="fas fa-edit"></i>&nbsp;&nbsp; */}
                                                                    <i data-tip data-for={`${rig._id}minerName`} style={{cursor: 'pointer'}} className="fas fa-edit" onClick={() => this.handleModal(rig)}></i>&nbsp;&nbsp;
                                                                    <ReactToolTip id={`${rig._id}minerName`}>
                                                                        <span>Modify Miner name & group</span>
                                                                    </ReactToolTip>


                                                                    <i data-tip data-for={`${rig._id}minerReset`} 
                                                                        className={actionId== 2 && actionPosting == 1 && actionRigId == rig._id ? 'fas fa-sync-alt fa-spin' : 'fas fa-sync-alt'} 
                                                                        onClick={() => this.handleConfirmModalShow(rig, 2)} 
                                                                        style={{cursor: 'pointer', color: rig.action.filter(f=>f.actionId ==2).length > 0 ? 'red' : 'black'}} >
                                                                    </i>&nbsp;&nbsp;
                                                                    <ReactToolTip id={`${rig._id}minerReset`}>
                                                                        <span>Reset Miner application</span>
                                                                    </ReactToolTip>


                                                                    <i data-tip data-for={`${rig._id}machineReset`} className={actionId== 1 && actionPosting == 1 && actionRigId == rig._id ? 'fas fa-recycle fa-spin' : 'fas fa-recycle'} id="redo" 
                                                                        onClick={() => this.handleConfirmModalShow(rig, 1)} 
                                                                        style={{cursor: 'pointer', color: rig.action.filter(f=>f.actionId ==1).length > 0 ? 'red' : 'black'}} >
                                                                    </i>&nbsp;&nbsp;
                                                                    <ReactToolTip id={`${rig._id}machineReset`} >
                                                                        <span>Restart Miner Machine</span>
                                                                    </ReactToolTip>


                                                                    {rig.minutes > 2 && 
                                                                        <i data-tip data-for={`${rig._id}minerDelete`}  className="fas fa-trash-alt" onClick={() => this.handleDeleteModal(rig)} style={{cursor: 'pointer'}} tooltip="delete"></i>}
                                                                    {rig.minutes <= 2 && 
                                                                        <i data-tip data-for={`${rig._id}minerDelete`}  className="fas fa-trash-alt" style={{opacity: 0.5, pointerEvents: 'none'}} tooltip="delete"></i>}
                                                                    <ReactToolTip id={`${rig._id}minerDelete`} >
                                                                        <span>Delete Miner</span>
                                                                    </ReactToolTip>
                                                                </td>
                                                            </tr>)
                                                            )}
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
            </div>
            );
    }
}

export default Rigs;