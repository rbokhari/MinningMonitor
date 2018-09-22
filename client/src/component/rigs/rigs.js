import React from 'react';
import moment from 'moment';
import MappleToolTip from 'reactjs-mappletooltip'; 
import { ToastContainer } from "react-toastr";
import Api from '../../api/Api';
//import { Modal } from '../common/';
import { Modal } from 'react-bootstrap';
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
        //this.setEdit = this.setEdit.bind(this);
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
            return {
                ...rig,
                isNameEdit: (i==index)
            }
        });
        console.info('rigs', rigs);
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
                this.getData();
            });
    }

    handleModal(rig) {
        const rigClone = Object.assign({}, rig);
        Api.get('group')
            .then(res => res.json())
            .then(data => {
                this.setState((prevState, props) => ({groups: data.data, showModal: true, rig: rigClone}));
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
            .then(data => {
                this.setState({groups: data.data});
                Api.get('rigs')
                    .then(res => res.json())
                    .then(data => {
                        const rigs = data.data
                            // .sort((a,b) => {
                            //     //a.computerName < b.computerName
                            //     var x = a.computerName.toLowerCase();
                            //     var y = b.computerName.toLowerCase();
                            //     if (x < y) {return -1;}
                            //     if (x > y) {return 1;}
                            // })
                            .map(rig => {
                                return {
                                    ...rig,
                                    totalHashrate: Math.floor((new Date() - new Date(rig.updatedAt))/1000/60) > 2 ? 0 : rig.totalHashrate,
                                    maxTemp: 0,
                                    maxFan: 0,
                                    groupName: rig.group && this.state.groups.filter(c=>c._id==rig.group)[0].name,
                                    isNameEdit: false,
                                    minutes: Math.floor((new Date() - new Date(rig.updatedAt))/1000/60),
                                    isOnline: Math.floor((new Date() - new Date(rig.updatedAt))/1000/60) > 2 ? 0 : 1,
                                    format: moment(rig.ping_time).fromNow()
                                }
                            });
                        this.setState((prevState, props) => ({rigs: rigs}));
                    })
                    .catch(err => console.error('fetch error', err));
            }, err => {
                console.error('loading rig data error', err);
             })
    }

    deleteRig(id) {
        Api.delete(`rigs/${id}`)
            .then(res => this.getData())
            .catch(err => console.error('Delete Rig', err));
    }

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
            this.refs.container.success(
                "Success !",
                "Miner is delete.", {
                timeOut: 1000,
                extendedTimeOut: 100
              });
            })
            .catch(err => console.error('Delete Rig', err));
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
        console.info('rig', rig);
        this.setState(prevState => ({showNoteModal: false}));
        Api.put(`rigs/${rig._id}/note`, {'note': rig.notes})
            .then(res => {
                this.getData();
                this.refs.container.success(
                    "Success !",
                    "Miner's Note added.", {
                    timeOut: 1000,
                    extendedTimeOut: 100
                });
                })
            .catch(err => console.error('Delete Rig', err));
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

    setAction(rig) {
        const action = {
            rig: rig._id,
            action: 1,
            status: 1
        };
        
        Api.post('actions', action)
            .then(res => console.info('action', res))
            .catch(err => console.error('action error', err));
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
            ${isNaN(seconds) ? 0 : seconds}s
        `;
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

    render() {
        const { showModal, showDeleteModal, showNoteModal, rigs, rig, groups } = this.state;
        return (<div>
            <div className="pcoded-content">
                <ToastContainer ref="container"
                        className="toast-top-right" />
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
                                                <span>status of all registered miners</span> 
                                            </div>
                                            <div className="card-block table-border-style">
                                                <div className="table-responsive">
                                                    <table className="table table-">
                                                        <thead>
                                                            <tr>
                                                                <th style={{width:'10pt'}}></th>
                                                                <th>Miner Name</th>
                                                                <th>Group</th>
                                                                <th>Notes</th>
                                                                <th>Hashrate</th>
                                                                <th>Max ℃</th>
                                                                <th>UpTime</th>
                                                                <th>Functions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {rigs && rigs.sort((a,b) => a.computerName - b.computerName).map((rig,i) => (
                                                            <tr key={rig._id}
                                                                // className={rig.minutes > 125 ? 'alert alert-danger' : 'alert alert-success'}
                                                                // className={(Math.max(...rig.temperatures))>80 ? 'alert alert-danger' : ''}
                                                                // style={{'backgroundColor': ((Math.max(...rig.temperatures))>75 && (Math.max(...rig.temperatures))<=85) ? '#fff8e6' : (Math.max(...rig.temperatures))>85 ? '#ffece6' : ''}}
                                                                >
                                                                <td>
                                                                    <MappleToolTip float={true} direction={'bottom'} mappleType={rig.minutes > 2 ? 'info' : 'info'}>
                                                                        <div>
                                                                            <i className="fa fa-circle" style={{color:rig.minutes > 2 ? 'silver' : 'green'}}></i>&nbsp;
                                                                        </div>
                                                                        <div>
                                                                            {rig.minutes > 2 ? 'offline' : 'online'}
                                                                        </div>
                                                                    </MappleToolTip>
                                                                </td>
                                                                <td>
                                                                    <div>
                                                                    {rig.isNameEdit && 
                                                                        <form onSubmit={this.handleSubmit}>
                                                                            <input type="text" value={rig.computerName} onChange={this.handleNameChange} />
                                                                        </form>
                                                                    }
                                                                    {!rig.isNameEdit && <a>
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
                                                                    </div>
                                                                </td>
                                                                <td>{rig.groupName}</td>
                                                                <td>
                                                                    {rig.notes && <a href="#" onClick={()=> this.handleNoteModal(rig)}>{rig.notes}</a>}
                                                                    {rig.notes == null && <i className="fas fa-sticky-note" style={{cursor: 'pointer'}} onClick={()=> this.handleNoteModal(rig)}></i>}
                                                                </td>
                                                                <td>
                                                                    <MappleToolTip float={true} direction={'top'} mappleType={'info'}>
                                                                        <div>
                                                                            <label className=''>{(rig.totalHashrate/1).toFixed(2)} MH/s</label>
                                                                        </div>
                                                                        <div>
                                                                            {rig.singleHashrate.map((hash,j) => (<span key={(j+1)*11}>GPU{j} : &nbsp;{(hash/1000).toFixed(2)}&nbsp;<small>MH/s</small><br /></span>))}
                                                                        </div>
                                                                    </MappleToolTip>
                                                                </td>
                                                                <td>
                                                                    <MappleToolTip float={true} direction={'top'} mappleType={'info'}>
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
                                                                    </MappleToolTip>
                                                                    {/* {rig.temperatures.map((temp,j)=> (<label key={(i+j+1)*102}>{temp}C&nbsp;&nbsp;</label>))}<br/>
                                                                    {rig.fanSpeeds.map((fan,j)=> (<label key={(i+j+1)*201}>{fan}%&nbsp;&nbsp;</label>))}<br/> */}
                                                                </td>
                                                                <td>
                                                                    <MappleToolTip float={true} direction={'top'} mappleType={'info'}>
                                                                        <div>
                                                                            {/* {moment(rig.updatedAt).format('MMM D YYYY h:mm:ss')} */}
                                                                            {rig.isOnline ==1 && this.formatMinerUpTime(rig.rigUpTime)}
                                                                            {rig.isOnline == 0 && '--'}
                                                                        </div>
                                                                        <div>
                                                                            <span>
                                                                                System Up Time : <br />
                                                                                Miner Up Time : {rig.isOnline == 0 && '--'} {rig.isOnline ==1 && this.formatMinerUpTime(rig.rigUpTime)} <br/>
                                                                                {/* Last Seen Seconds : {((new Date() - new Date(rig.updatedAt))/1000).toFixed(0)}&nbsp;sec<br /> */}
                                                                                Last Seen : {this.formatLastSeen2(rig.updatedAt)}<br />
                                                                                {/* {rig.updatedAt} */}
                                                                            </span>
                                                                        </div>
                                                                    </MappleToolTip>
                                                                </td>
                                                                <td>
                                                                    {/* <i data-toggle="modal" data-id="id value" data-target="#default-Modal" className="fas fa-edit"></i>&nbsp;&nbsp; */}
                                                                    <i className="fas fa-edit" style={{cursor: 'pointer'}} onClick={() => this.handleModal(rig)}></i>&nbsp;&nbsp;
                                                                    <i className="fas fa-redo" id="redo" onClick={this.setAction.bind(this, rig)} tooltip="delete"></i>&nbsp;&nbsp;
                                                                    {rig.minutes > 2 && 
                                                                        <i className="fas fa-trash-alt" onClick={() => this.handleDeleteModal(rig)} style={{cursor: 'pointer'}} tooltip="delete"></i>}
                                                                    {rig.minutes <= 2 && 
                                                                        <i className="fas fa-trash-alt" style={{opacity: 0.5, pointerEvents: 'none'}} tooltip="delete"></i>}
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