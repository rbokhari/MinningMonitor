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
            .then(data => {
                res.status(200).json({
                    data
                });
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

        const cards: Number = req.body.cards;
        const osName: string = req.body.osName;
        const email: string = req.body.email;
        const ip: string = req.body.ip;
        const kernelName: string = req.body.kernel;
        const computerName: string = req.body.worker;
        const totalHashrate: string = req.body.totalHashrate;
        const shares: string = req.body.t_shares;
        const invalidShares: string = req.body.i_shares;
        const singleHashrate = req.body.gpu;
        const serverTime = req.body.serverTime

        const temperatures = req.body.temps.map(t=> t);
        const fanSpeeds = req.body.fans.map(f => f);

        const rig = new Rig({
            cards,
            osName,
            ip,
            kernelName,
            computerName,
            totalHashrate,
            singleHashrate,
            shares,
            invalidShares,
            status: 1,
            temperatures,
            fanSpeeds,
            email,
            serverTime
        });

        rig.save()
            .then(data => {
                res.status(201).json({data});
            })
            .catch(err => {
                console.log('error occured by creating rig', err);
                res.status(500).json({ err });
            });
    }

    public UpdateRig(req: Request, res: Response): void {
        const id: string = req.params.id;
        const cards: Number = req.body.cards;
        const osName: string = req.body.osName;
        const email: string = req.body.email;
        const ip: string = req.body.ip;
        const kernelName: string = req.body.kernel;
        const computerName: string = req.body.worker;
        const totalHashrate: string = req.body.totalHashrate;
        const shares: string = req.body.t_shares;
        const invalidShares: string = req.body.i_shares;
        const singleHashrate = req.body.gpu;
        const updatedAt = new Date();
        const rigUpTime = parseInt(req.body.rigUpTime);
        const temperatures = req.body.temps.map(t=> t);
        const fanSpeeds = req.body.fans.map(f => f);

        const rig = {
            cards,
            osName,
            ip,
            kernelName,
            //computerName,
            totalHashrate,
            singleHashrate,
            shares,
            invalidShares,
            status: 1,
            temperatures,
            fanSpeeds,
            email,
            updatedAt,
            rigUpTime
        };
        Rig.findByIdAndUpdate( id, {$set: rig}, {new: true}, function(err, updRig) {
            if (err) res.status(400).json(err);
            
            //const _rig: Rig = updatedRig;
            Action.find({rig: id})
                .then(data => {
                    //const rigReturn = {...model, actions: data};
                    let rigReturn = {
                        rigId: updRig._id,
                        computer: updRig['computerName'],
                        action: data,
                        group: {}
                    };

                    if (updRig['group']) {
                        MinerGroup.findById(updRig['group'])
                            .then(gp => {
                                rigReturn.group = gp;
                                res.status(200).json({
                                    rigReturn
                                });
                            })
                            .catch(err => res.status(400).json(err));
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