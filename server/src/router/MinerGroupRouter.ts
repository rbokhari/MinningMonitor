import { Router, Request, Response, NextFunction } from 'express';
import MinerGroup from '../models/minerGroup';

export class MinerGroupRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public GetAll(req: Request, res: Response): void {
        MinerGroup.find()
            .populate('MinerClient')
            .sort('name')
            .then(data => {
                res.status(200).json({
                    data
                });
            })
            .catch(err => {
                res.status(500).json(err);
            });
    }
    
    public GetSingle(req: Request, res: Response): void {
        const id: string = req.params.id;
        MinerGroup.findOne({_id: id})
            .then(data => {
                res.status(200).json({
                    data
                });
            })
            .catch(err => {
                res.status(500).json(err);
            });
    }

    public Create(req: Request, res: Response): void {
        // if (!req.body.content) {
        //     res.status(400).send({
        //         message: "Note content can not be empty"
        //     });
        //     return;
        // }
        const name: Number = req.body.name;
        const minerClient = req.body.client;
        const notes: String = req.body.notes;
        const configuration: String = req.body.config;
        const status = 1;

        const group = new MinerGroup({
            name,
            notes,
            minerClient,
            configuration,
            status
        });

        group.save()
            .then(data => {
                res.status(201).json({data});
            })
            .catch(err => {
                console.log('error occured by creating group', err);
                res.status(500).json({ err });
            });
    }

    public Update(req: Request, res: Response): void {
        const id: string = req.params.id;
        const name: Number = req.body.name;
        const notes: Number = req.body.notes;
        const minerClient: string = req.body.client;
        const configuration: string = req.body.config;
        const status: string = req.body.status;

        const group = {
            name,
            notes,
            minerClient,
            configuration,
            status
        };
        MinerGroup.findByIdAndUpdate( id, {$set: group}, {new: true}, function(err, updateGroup) {
            if (err) res.status(400).json(err);            
            res.status(200).json({
                updateGroup
            });
        });
    }

    public Delete(req: Request, res: Response): void {
        const id: string = req.params.id;
        MinerGroup.findByIdAndRemove(id)
            .then(group => {
                // res.status(200).json({
                //     data
                // });
                if(!group) {
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
        this.router.get('/', this.GetAll);
        this.router.get('/:id', this.GetSingle);
        this.router.post('/', this.Create);
        this.router.put('/:id', this.Update);
        this.router.delete('/:id', this.Delete);
    }

}

const minerGroupRoutes = new MinerGroupRouter();
minerGroupRoutes.routes();

export default minerGroupRoutes.router;