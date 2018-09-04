import React from 'react';
import moment from 'moment';
import MappleToolTip from 'reactjs-mappletooltip'; 

class Rigs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rigs: [],
            interval: 1000*30   // 30 seconds
        };
    }

    componentDidMount() {
        fetch('http://46.101.227.146:3000/api/v1/rigs')
            .then(res => res.json())
            .then(data => {
                console.info(data.data);
                const rigs = data.data
                    .map(rig => {
                        return {
                            ...rig,
                            minutes: Math.floor((new Date() - new Date(rig.updatedAt))/1000/60) ,
                            format: moment(rig.ping_time).fromNow()
                        }
                    });
                this.setState({rigs: data.data});
            })
            .catch(err => console.error('fetch error', err));
    }

    calculateTime(d1) {
        const result = Math.floor((new Date() - new Date(d1))/1000/60);
        return result;
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
                                                                <th>Rig Name</th>
                                                                <th>Group</th>
                                                                <th>Status</th>
                                                                <th>Hash Power</th>
                                                                <th>Temp/Fan</th>
                                                                <th>Core/Memory</th>
                                                                <th>Functions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.state.rigs && this.state.rigs.map((rig,i) => (
                                                            <tr key={rig._id}
                                                                className={rig.minutes > 125 ? 'alert alert-danger' : 'alert alert-success'}>
                                                                <td>
                                                                    <MappleToolTip float={true} direction={'bottom'} mappleType={'warning'}>
                                                                        <div>
                                                                            {rig.computerName}
                                                                        </div>
                                                                        <div>
                                                                            OS Version = <br/>
                                                                            Rig Id = <br/>
                                                                            Lan IP = <br/>
                                                                            Public IP = 
                                                                            Gpu =
                                                                        </div>
                                                                    </MappleToolTip>
                                                                </td>
                                                                <td></td>
                                                                <td>{rig.status == 1 ? 'ON' : 'OFF'}</td>
                                                                <td>
                                                                    <MappleToolTip float={true} direction={'top'} mappleType={'success'}>
                                                                        <div>
                                                                            <label className='label label-success'>{(rig.totalHashrate/1).toFixed(2)}&nbsp;MH/s</label>
                                                                        </div>
                                                                        <div>
                                                                            {rig.singleHashrate.map((hash,j) => (<span>GPU{j} : &nbsp;{(hash/1000).toFixed(2)}&nbsp;<small>MH/s</small><br /></span>))}
                                                                        </div>
                                                                    </MappleToolTip>
                                                                </td>
                                                                <td>
                                                                    <MappleToolTip float={true} direction={'top'} mappleType={'success'}>
                                                                        <div>
                                                                            {(rig.temperatures.reduce(function(a, b) { return a + b; })/rig.temperatures.length).toFixed(0)}&nbsp;℃<br/>
                                                                            {rig.fanSpeeds.reduce(function(a, b) { return a + b; })/rig.fanSpeeds.length}&nbsp;%
                                                                        </div>
                                                                        <div>
                                                                            <span>
                                                                                {rig.temperatures.map((temp,j)=> (<span>{temp}&nbsp;</span>))}
                                                                            </span>&nbsp;℃<br/>
                                                                            <span>
                                                                                {rig.fanSpeeds.map((speed,j)=> (<span>{speed}&nbsp;</span>))}
                                                                            </span>&nbsp;%
                                                                        </div>
                                                                    </MappleToolTip>
                                                                    {/* {rig.temperatures.map((temp,j)=> (<label key={(i+j+1)*102}>{temp}C&nbsp;&nbsp;</label>))}<br/>
                                                                    {rig.fanSpeeds.map((fan,j)=> (<label key={(i+j+1)*201}>{fan}%&nbsp;&nbsp;</label>))}<br/> */}
                                                                </td>
                                                                <td>&nbsp;
                                                                </td>
                                                                <td>{moment(rig.updatedAt).format('MMM D YYYY, h:mm:ss a')}</td>
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