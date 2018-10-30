import { Router, Request, Response, NextFunction } from 'express';
import Rig from '../models/rig';
import Action from '../models/action';
import MinerGroup from '../models/minerGroup';

import { parse } from 'querystring';

export class RigRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public GetRigs(req: Request, res: Response): void {
        Rig.find()
            .sort('computerName')
            .then(data => {

                Action.find()
                    .then(actions => {

                        let rigData = data.map(d => {
                            return {
                                ...d.toJSON(),
                                action: actions.filter(c => (c['rig'].equals(d._id) && c['status'] == 1)).map(act => {
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
            })
            .catch(err => {
                res.status(500).json(err);
            });
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

        // const cards: Number = req.body.cards;
        const osName: string = req.body.osName;
        const email: string = req.body.email;
        const ip: string = req.body.ip;
        const kernelName: string = req.body.kernel;
        // const computerName: string = req.body.worker;
        // const totalHashrate: string = req.body.totalHashrate;
        // const shares: string = req.body.t_shares;
        // const invalidShares: string = req.body.i_shares;
        // const singleHashrate = req.body.gpu;
        const updatedAt = new Date(); // req.body.updatedAt;
        // const core = req.body.cores;
        // const memory = req.body.memory;
        const wanIp = req.body.wanIp || '';
        // const gpuModel = req.body.gpuModel || '';
        const appVersion = req.body.appVersion || '';
        const rigId = req.body.rigId || '';

        if (rigId == '') {
            res.status(500).json({ err : 'serial id not availabel' });
            return;
        }

        // const temperatures = req.body.temps.map(t=> t);
        // const fanSpeeds = req.body.fans.map(f => f);

        const rig = {
//            cards,
            osName,
            ip,
            // kernelName,
            // computerName,
            // totalHashrate,
            // singleHashrate,
            // shares,
            // invalidShares,
            status: 1,
            // temperatures,
            // fanSpeeds,
            email,
            updatedAt,
            // core,
            // memory,
            wanIp,
            rigId
            // gpuModel,
            // appVersion,
            // rigId
        };

        Rig.findOneAndUpdate({rigId: rigId}, rig, {upsert: true, new: true, setDefaultsOnInsert: true})
            .then(data => {
                res.status(201).json(data);
            })
            .catch(err => {
                console.error('error rig', err);
            })

        // rig.save()
        //     .then(data => {
        //         res.status(201).json({data});
        //     })
        //     .catch(err => {
        //         console.log('error occured by creating rig', err);
        //         res.status(500).json({ err });
        //     });
    }

    // TODO : Separate this api for both python files with their appropriate data
    public UpdateRig(req: Request, res: Response): void {
        const rigId: string = req.params.id;
        const cards: Number = req.body.cards;
        const osName: string = req.body.osName;
        const email: string = req.body.email;
        const ip: string = req.body.ip;
        const kernelName: string = req.body.kernel;
        const totalHashrate: string = req.body.totalHashrate;
        const shares: string = req.body.t_shares;
        const invalidShares: string = req.body.i_shares;
        const singleHashrate = req.body.gpu;
        const updatedAt = new Date();
        const rigUpTime = parseInt(req.body.rigUpTime);
        const temperatures = req.body.temps.map(t=> t);
        const fanSpeeds = req.body.fans.map(f => f);
        const core = req.body.cores;
        const memory = req.body.memory;
        const wanIp = req.body.wanIp || '';
        const gpuModel = req.body.gpuModel || '';
        const appVersion = req.body.appVersion || '';
        // const rigId = req.body.rigId || '';

        const perform_action = req.body.performAction;

        const rig = {
            cards,
            osName,
            ip,
            kernelName,
            totalHashrate,
            singleHashrate,
            shares,
            invalidShares,
            status: 1,
            temperatures,
            fanSpeeds,
            email,
            updatedAt,
            rigUpTime,
            core,
            memory,
            wanIp,
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
        Rig.findOneAndUpdate( {rigId: rigId}, {$set: rig}, {new: true}, function(err, updRig) {
            if (err) res.status(400).json(err);
            console.info("Miner is update by Miner Serial Id");
            //const _rig: Rig = updatedRig;
            Action.find({rig: updRig._id})
                .then(data => {
                    //const rigReturn = {...model, actions: data};
                    let rigReturn = {
                        rigId: updRig._id,
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

                                console.log('group detail', gp);
                                //let config = '{"minerPath":"\/root\/miner\/$MinerClient\/ethdcrminer64","minerOptions":"-epool $MinerPool -ewal $MinerWallet.$MinerName -epsw x","ocCore": $MinerCore, "ocMemory":$MinerMemory, "ocPowerlimit":$MinerPowerStage, "ocTempTarget":$MinerTemperature, "ocFanSpeedMin": $MinerFanSpeed, "srrEnabled":"","srrSerial":"","srrSlot":"","ocVddc":$MinerVoltage,"ocMode":"0","ebSerial":"","LABSOhGodAnETHlargementPill":"off"}';
                                let config = gp['minerClient']['info'] 
                                config = config.replace('$MinerClient', gp['minerClient']['execFile']);
                                config = config.replace('$MinerPool', gp['pool']['poolAddress']);
                                config = config.replace('$MinerWallet', gp['wallet']['ethAddress']);

                                if (gp['clocktone']) {
                                    config = config.replace('$MinerCore', gp['clocktone']['core']);
                                    config = config.replace('$MinerMemory', gp['clocktone']['memory']);
                                    config = config.replace('$MinerPowerStage', gp['clocktone']['powerStage']);
                                    config = config.replace('$MinerTemperature', gp['clocktone']['temperature']);
                                    config = config.replace('$MinerFanSpeed', gp['clocktone']['fanSpeed']);
                                    config = config.replace('$MinerVoltage', gp['clocktone']['voltage']);
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
        Rig.findByIdAndUpdate( id, {$set: { 'computerName': name, 'group': group }}, {new: true}, function(err, model) {
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