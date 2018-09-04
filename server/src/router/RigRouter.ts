import { Router, Request, Response, NextFunction } from 'express';
import Rig from '../models/rig';

export class RigRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public GetRigs(req: Request, res: Response): void {
        Rig.find()
            .then(data => {
                res.status(200).json({
                    data
                });
            })
            .catch(err => {
                res.status(400).json(err);
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
                res.status(400).json(err);
            });
    }

    public CreateRig(req: Request, res: Response): void {
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
                console.log("rig saved", data);
                res.status(201).json({data});
            })
            .catch(err => {
                console.log('error occured by creating rig', err);
                res.status(400).json({ err });
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
            computerName,
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
        console.info(rig);
        Rig.findByIdAndUpdate( id, {$set: rig}, {new: true}, function(err, model) {
            if (err) res.status(400).json(err);
            
            console.info('update rig data ', model);
            res.status(200).json({
                model
            });
        });
    }

    public PatchName(req: Request, res: Response): void {
        const id: string = req.params.id;
        const name: string = req.body.name;
        console.info('name', name);
        Rig.findByIdAndUpdate( id, {$set: { 'computerName': name }}, {new: true}, function(err, model) {
            if (err) res.status(400).json(err);
            
            console.info('patch rig data ', model);
            res.status(200).json({
                model
            });
        });
    }

    public DeleteRig(req: Request, res: Response): void {
        const id: string = req.params.id;
        Rig.findByIdAndRemove(id)
            .then(data => {
                res.status(200).json({
                    data
                });
            })
            .catch(err => {
                res.status(400).json(err);
            });
    }

    routes() {
        this.router.get('/', this.GetRigs);
        this.router.get('/:id', this.GetRig);
        this.router.post('/', this.CreateRig);
        this.router.put('/:id', this.UpdateRig);
        this.router.put('/:id/name', this.PatchName);
        this.router.delete('/:id', this.DeleteRig);
    }
}

const rigRoutes = new RigRouter();
rigRoutes.routes();

export default rigRoutes.router;