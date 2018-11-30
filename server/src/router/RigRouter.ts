import { Router, Request, Response, NextFunction } from 'express';
import Rig from '../models/rig';
import Action from '../models/action';
import MinerGroup from '../models/minerGroup';

export class RigRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public GetRigs(req: Request, res: Response): void {
        Rig.find()
            .sort('computerName')
            .populate('group')
            .populate('clocktone')
            .exec((err, data) => {

                if (err) {
                    console.log(err);
                    res.status(500).json(err)
                }
                Action.find()
                    .then(actions => {

                        let rigData = data.map(d => {
                            return {
                                ...d.toJSON(),
                                action: actions.filter(c => (c['rig']==d['rigId'] && c['status'] == 1)).map(act => {
                                    return {
                                        actionId: act['action'],
                                        status: act['status']
                                    }
                                })
                            }
                        });

                        res.status(200).json(rigData);
                    })
                    .catch(err => res.status(500).json(err));
            });
            // .catch(err => {
            //     res.status(500).json(err);
            // });
    }
    
    public GetRig(req: Request, res: Response): void {
        const id: string = req.params.id;
        Rig.findOne({_id: id})
            .then(data => {
                res.status(200).json({
                    data
                });
            })
            .catch(err => {
                res.status(500).json(err);
            });
    }

    public CreateRig(req: Request, res: Response): void {
        // if (!req.body.content) {
        //     res.status(400).send({
        //         message: "Note content can not be empty"
        //     });
        //     return;
        // }
        const osName: string = req.body.osName;
        const email: string = req.body.email;
        const ip: string = req.body.ip;
        const updatedAt = new Date(); // req.body.updatedAt;
        const wanIp = req.body.wanIp || '';
        const rigId = req.body.rigId || '';

        if (rigId == '') {
            res.status(400).json({ message : 'Serial Id not availabel !' });
            return;
        }

        const rig = {
            osName,
            ip,
            status: 1,
            email,
            updatedAt,
            wanIp,
            rigId,

        };

        // update function
        Rig.findOne({rigId: rigId})
            .exec((err, data) => {
                if (err) {
                    console.error(err);
                    res.status(500).json(err)
                }

                // calculation for restart factor, if more then 2 min delay it count as restart
                const updated = data['updatedAt'];
                let milliseconds: number = new Date().valueOf() - new Date(updated).valueOf();
                let seconds: number = Math.floor(milliseconds / 1000);
                let minute = Math.floor(seconds / 60);
                // console.error('date', new Date().valueOf(), data)
                // console.error('minutes calculated', milliseconds, seconds, minute, data['updatedAt']); 
                if (minute > 2) {
                    // console.error('---- Inside 2 -----')
                    rig['restart'] = data['restart'] ? data['restart'] + 1 : 1;
                } else {
                    // console.error('---- Inside else -----')
                    rig['restart'] = data['restart'] ? data['restart'] : 0;
                }

                Rig.findOneAndUpdate({rigId: rigId}, rig, {upsert: true, new: true, setDefaultsOnInsert: true})
                    .then(data => {
                        res.status(201).json(data);
                    })
                    .catch(err => {
                        console.error('error rig', err);
                    })
            });
        // Rig.findOneAndUpdate({rigId: rigId}, rig, {upsert: true, new: true, setDefaultsOnInsert: true})
        //     .then(data => {
        //         res.status(201).json(data);
        //     })
        //     .catch(err => {
        //         console.error('error rig', err);
        //     })
    }

    // call from startup file only

    // TODO : Separate this api for both python files with their appropriate data
    public UpdateRig(req: Request, res: Response): void {
        const rigId: string = req.params.id;
        const cards: Number = req.body.cards;
        //const osName: string = req.body.osName;
        //const email: string = req.body.email;
        //const ip: string = req.body.ip;
        //const kernelName: string = req.body.kernel;
        const totalHashrate: string = req.body.totalHashrate;
        const shares: string = req.body.t_shares;
        const invalidShares: string = req.body.i_shares;
        const singleHashrate = req.body.gpu;
        //const updatedAt = new Date();
        const rigUpTime = parseInt(req.body.rigUpTime);
        const temperatures = req.body.temps.map(t=> t);
        const fanSpeeds = req.body.fans.map(f => f);
        const core = req.body.cores;
        const memory = req.body.memory;
        //const wanIp = req.body.wanIp || '';
        const gpuModel = req.body.gpuModel || '';
        const appVersion = req.body.appVersion || '';
        // const rigId = req.body.rigId || '';

        const perform_action = req.body.performAction;

        const rig = {
            cards,
            // osName,
            // ip,
            // kernelName,
            totalHashrate,
            singleHashrate,
            shares,
            invalidShares,
            status: 1,
            temperatures,
            fanSpeeds,
            // email,
            // updatedAt,
            rigUpTime,
            core,
            memory,
            // wanIp,
            gpuModel,
            appVersion
            // rigId
        };

        if (perform_action != 0) {
            Action.findOneAndRemove({ $and: [ { action: perform_action }, { rig: rigId}]})
                .then(res => {

                })
                .catch(err => console.error(err));
        }

        //Rig.findByIdAndUpdate( id, {$set: rig}, {new: true}, function(err, updRig) {
        Rig.findOneAndUpdate( {rigId: rigId}, {$set: rig}, {new: true})
            .populate('clocktone')
            .exec((err, updRig) => {
                
                if (err) res.status(400).json(err);
            //const _rig: Rig = updatedRig;
                Action.find({rig: updRig['rigId']})
                .then(data => {
                    //const rigReturn = {...model, actions: data};
                    let rigReturn = {
                        rigId: updRig['rigId'],
                        computer: updRig['computerName'],
                        action: data,
                        group: {}
                    };

                    if (updRig['group']) {
                        MinerGroup.findOne({_id: updRig['group']})
                            .populate('minerClient', 'name execFile info')
                            .populate('pool', 'name poolAddress -_id')
                            .populate('clocktone')
                            .populate('wallet', 'name ethAddress -_id')
                            .exec((err, gp) => {
                                if (err) console.error('miner group error', err);

                                //let config = '{"minerPath":"\/root\/miner\/$MinerClient\/ethdcrminer64","minerOptions":"-epool $MinerPool -ewal $MinerWallet.$MinerName -epsw x","ocCore": $MinerCore, "ocMemory":$MinerMemory, "ocPowerlimit":$MinerPowerStage, "ocTempTarget":$MinerTemperature, "ocFanSpeedMin": $MinerFanSpeed, "srrEnabled":"","srrSerial":"","srrSlot":"","ocVddc":$MinerVoltage,"ocMode":"0","ebSerial":"","LABSOhGodAnETHlargementPill":"off"}';
                                let config = gp['minerClient']['info'] 
                                config = config.replace('$MinerClient', gp['minerClient']['execFile']);
                                config = config.replace('$MinerPool', gp['pool']['poolAddress']);
                                config = config.replace('$MinerWallet', gp['wallet']['ethAddress']);

                                if (updRig['clocktone']) {
                                    const _rigClocktone = updRig['clocktone'];
                                    config = config.replace('$MinerCore', _rigClocktone['core'] ? _rigClocktone['core'] : '');
                                    config = config.replace('$MinerMemory', _rigClocktone['memory'] ? _rigClocktone['memory'] : '');
                                    config = config.replace('$MinerPowerStage', _rigClocktone['powerStage'] ? _rigClocktone['powerStage'] : '');
                                    config = config.replace('$MinerTemperature', _rigClocktone['temperature'] ? _rigClocktone['temperature'] : '');
                                    config = config.replace('$MinerFanSpeed', _rigClocktone['fanSpeed'] ? _rigClocktone['fanSpeed'] : '');
                                    config = config.replace('$MinerVoltage', _rigClocktone['voltage'] ? _rigClocktone['voltage'] : '');
                                } else if (gp['clocktone']) {
                                    config = config.replace('$MinerCore', gp['clocktone']['core'] ? gp['clocktone']['core'] : '');
                                    config = config.replace('$MinerMemory', gp['clocktone']['memory'] ? gp['clocktone']['memory'] : '');
                                    config = config.replace('$MinerPowerStage', gp['clocktone']['powerStage'] ? gp['clocktone']['powerStage'] : '');
                                    config = config.replace('$MinerTemperature', gp['clocktone']['temperature'] ? gp['clocktone']['temperature'] : '');
                                    config = config.replace('$MinerFanSpeed', gp['clocktone']['fanSpeed'] ? gp['clocktone']['fanSpeed'] : '');
                                    config = config.replace('$MinerVoltage', gp['clocktone']['voltage'] ? gp['clocktone']['voltage'] : '');
                                } else {
                                    config = config.replace('$MinerCore', '');
                                    config = config.replace('$MinerMemory', '');
                                    config = config.replace('$MinerPowerStage', '');
                                    config = config.replace('$MinerTemperature', '');
                                    config = config.replace('$MinerFanSpeed', '');
                                    config = config.replace('$MinerVoltage', '');                                    
                                }
                                //config = config.replace('$MinerPool', )
                                rigReturn.group = config;

                                res.status(200).json({
                                    rigReturn
                                });
                            });
                    } else {
                        res.status(200).json({
                            rigReturn
                        });
                    }
                })
                .catch(err => {
                    res.status(400).json(err);
                });
        });
    }

    public PatchName(req: Request, res: Response): void {
        const id: string = req.params.id;
        const name: string = req.body.name;
        const group: string = req.body.group;
        const clocktone: string = req.body.clocktone;
        Rig.findByIdAndUpdate( id, {$set: { 'computerName': name, 'group': group, 'clocktone': clocktone }}, {new: true}, function(err, model) {
            if (err) res.status(400).json(err);
            
            res.status(200).json({
                model
            });
        });
    }

    public PatchNote(req: Request, res: Response): void {
        const id: string = req.params.id;
        const note: string = req.body.note;
        Rig.findByIdAndUpdate( id, {$set: { 'notes': note }}, {new: true}, function(err, rig) {
            if (err) res.status(400).json(err);
            
            res.status(200).json({
                rig
            });
        });
    }


    public DeleteRig(req: Request, res: Response): void {
        const id: string = req.params.id;
        console.log("delete rig id ", id);
        Rig.findByIdAndRemove(id)
            .then(rig => {
                // res.status(200).json({
                //     data
                // });
                if(!rig) {
                    return res.status(404).send({
                        message: "Miner not found with id " + id
                    });
                }
                res.send({message: "MIner deleted successfully!"});
            })
            .catch(err => {
                if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return res.status(404).send({
                        message: "Miner not found with id " + id
                    });                
                }
                return res.status(500).send({
                    message: "Could not delete Miner with id " + id
                });
                // console.error('delete rig error :', err);
                // res.status(400).json(err);
            });
    }

    routes() {
        this.router.get('/', this.GetRigs);
        this.router.get('/:id', this.GetRig);
        this.router.post('/', this.CreateRig);
        this.router.put('/:id', this.UpdateRig);
        this.router.put('/:id/name', this.PatchName);
        this.router.put('/:id/note', this.PatchNote);
        this.router.delete('/:id', this.DeleteRig);
    }
}

const rigRoutes = new RigRouter();
rigRoutes.routes();

export default rigRoutes.router;