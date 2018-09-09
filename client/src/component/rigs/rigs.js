import React from 'react';
import moment from 'moment';
import MappleToolTip from 'reactjs-mappletooltip'; 
import Api from '../../api/Api';

class Rigs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isEditable: false,
            indexEdit: -1,
            idEdit: '',
            rigs: [],
            interval: 1000*30   // 30 seconds
        };
        this.getData = this.getData.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        console.info('e', e.target.value);
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
        const { idEdit, indexEdit } = this.state;
        const computerName = this.state.rigs[indexEdit].computerName;
        let rigs = this.state.rigs;
        rigs[indexEdit].isNameEdit = false;
        Api.put(`rigs/${idEdit}/name`, {'name': this.state.rigs[indexEdit].computerName})
            .then(res => {
                this.setState({rigs: rigs});
            });
    }

    getData() {
        Api.get('rigs')
        .then(res => res.json())
        .then(data => {
            console.info(data.data);
            const rigs = data.data
                .map(rig => {
                    return {
                        ...rig,
                        totalHashrate: Math.floor((new Date() - new Date(rig.updatedAt))/1000/60) > 2 ? 0 : rig.totalHashrate,
                        isNameEdit: false,
                        minutes: Math.floor((new Date() - new Date(rig.updatedAt))/1000/60),
                        isOnline: Math.floor((new Date() - new Date(rig.updatedAt))/1000/60) > 2 ? 0 : 1,
                        format: moment(rig.ping_time).fromNow()
                    }
                });
            this.setState((prevState, props) => ({rigs: rigs}));
        })
        .catch(err => console.error('fetch error', err));
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

    render() {
        return (
            <div className="pcoded-content">
                <div className="page-header">
                    <div className="page-block">
                        <div className="row align-items-center">
                            <div className="col-md-12">
                                <div className="page-header-title">
                                    <h5 className="m-b-10">Rigs </h5>
                                </div>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="index.html">
                                            <i className="feather icon-home"></i>
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item"><a href="#!">Rigs</a></li>
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
                                        <h5 className="m-t-15">Total Hash power</h5>
                                        <h3 className="m-b-15">{this.state.rigs && this.state.rigs.reduce((a,b) => (a + parseFloat(b.totalHashrate)), 0).toFixed(0)}&nbsp;MH/s</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-6">
                                <div className="card o-hidden bg-c-green web-num-card">
                                    <div className="card-block text-white">
                                        <h5 className="m-t-15">Total GPU</h5>
                                        <h3 className="m-b-15">2,536</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-6">
                                <div className="card o-hidden bg-c-red web-num-card">
                                    <div className="card-block text-white">
                                        <h5 className="m-t-15">Total Rigs</h5>
                                        <h3 className="m-b-15">{this.state.rigs.filter(c=>c.isOnline==1).length + ' / ' + this.state.rigs.length}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-6">
                                <div className="card o-hidden bg-c-yellow web-num-card">
                                    <div className="card-block text-white">
                                        <h5 className="m-t-15">Unpaid Balance</h5>
                                        <h3 className="m-b-15">$ 421,980</h3>
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                                <div className="row">
                                    <div className="col-xl-12 col-md-12">
                                    <div className="card">
                                            <div className="card-header">
                                                <h5>Rigs </h5>
                                                <span>status of all registered rigs</span> 
                                            </div>
                                            <div className="card-block table-border-style">
                                                <div className="table-responsive">
                                                    <table className="table table-">
                                                        <thead>
                                                            <tr>
                                                                <th style={{width:'10pt'}}></th>
                                                                <th>Rig Name</th>
                                                                <th>Group</th>
                                                                <th>Hash Power</th>
                                                                <th>Max ℃</th>
                                                                <th>UpTime</th>
                                                                <th>Functions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.state.rigs && this.state.rigs.map((rig,i) => (
                                                            <tr key={rig._id}
                                                                // className={rig.minutes > 125 ? 'alert alert-danger' : 'alert alert-success'}
                                                                >
                                                                <td>
                                                                    <MappleToolTip float={true} direction={'bottom'} mappleType={rig.minutes > 2 ? 'warning' : 'success'}>
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
                                                                    {!rig.isNameEdit && <a href="#" onClick={this.setEdit.bind(this,i)}>
                                                                        <MappleToolTip float={true} direction={'bottom'} mappleType={'warning'}>
                                                                            <div>
                                                                                {rig.computerName}
                                                                            </div>
                                                                            <div>
                                                                                OS Version = <br/>
                                                                                Rig Id = <br/>
                                                                                Lan IP = {rig.ip}<br/>
                                                                                Public IP = <br/> 
                                                                                Gpu =
                                                                            </div>
                                                                        </MappleToolTip>
                                                                    </a>}
                                                                    </div>
                                                                </td>
                                                                <td></td>
                                                                <td>
                                                                    <MappleToolTip float={true} direction={'top'} mappleType={'success'}>
                                                                        <div>
                                                                            <label className=''>{(rig.totalHashrate/1).toFixed(2)} MH/s</label>
                                                                        </div>
                                                                        <div>
                                                                            {rig.singleHashrate.map((hash,j) => (<span key={(j+1)*11}>GPU{j} : &nbsp;{(hash/1000).toFixed(2)}&nbsp;<small>MH/s</small><br /></span>))}
                                                                        </div>
                                                                    </MappleToolTip>
                                                                </td>
                                                                <td>
                                                                    <MappleToolTip float={true} direction={'top'} mappleType={'success'}>
                                                                        <div>
                                                                            {Math.max(...rig.temperatures)}℃<br/>
                                                                            {Math.max(...rig.fanSpeeds)}%<br/>
                                                                            {/* {(rig.temperatures.reduce(function(a, b) { return a < b; })).toFixed(0)}&nbsp;℃<br/> */}
                                                                            {/* {rig.fanSpeeds.reduce(function(a, b) { return a + b; })/rig.fanSpeeds.length}&nbsp;% */}
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
                                                                    <MappleToolTip float={true} direction={'top'} mappleType={'success'}>
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
                                                                                Last Seen : {this.formatLastSeen(rig.updatedAt)}<br />
                                                                                {/* {rig.updatedAt} */}
                                                                            </span>
                                                                        </div>
                                                                    </MappleToolTip>
                                                                </td>
                                                                <td>
                                                                    {/* {moment(rig.updatedAt).format('MMM D YYYY, h:mm:ss a')} */}
                                                                    <i className="fa fa-lock" onClick={this.setAction.bind(this, rig)}></i>
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
            );
    }
}

export default Rigs;