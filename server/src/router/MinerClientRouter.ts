import { Router, Request, Response, NextFunction } from 'express';
import MinerClient from '../models/minerClient';

export class MinerClientRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public GetAll(req: Request, res: Response): void {
        MinerClient.find()
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
        MinerClient.findOne({_id: id})
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
        const execFile: Number = req.body.exec;
        const isR: string = req.body.r;
        const isRx: string = req.body.rx;
        const isNv: string = req.body.nv;
        const info: string = req.body.info;
        const remarks: string = req.body.remarks;
        const status: string = req.body.status;

        const client = new MinerClient({
            name,
            execFile,
            isR,
            isRx,
            isNv,
            remarks,
            status
        });

        client.save()
            .then(data => {
                res.status(201).json({data});
            })
            .catch(err => {
                console.log('error occured by creating miner client', err);
                res.status(500).json({ err });
            });
    }

    public Update(req: Request, res: Response): void {
        const id: string = req.params.id;
        const name: Number = req.body.name;
        const execFile: Number = req.body.exec;
        const isR: string = req.body.r;
        const isRx: string = req.body.rx;
        const isNv: string = req.body.nv;
        const remarks: string = req.body.remarks;
        const status: string = req.body.status;

        const client = {
            name,
            execFile,
            isR,
            isRx,
            isNv,
            remarks,
            status
        };
        MinerClient.findByIdAndUpdate( id, {$set: client}, {new: true}, function(err, updateClient) {
            if (err) res.status(400).json(err);
            
            res.status(200).json({
                updateClient
            })
        });
    }

    public Delete(req: Request, res: Response): void {
        const id: string = req.params.id;
        MinerClient.findByIdAndRemove(id)
            .then(client => {
                if(!client) {
                    return res.status(404).send({
                        message: "Client not found with id " + id
                    });
                }
                res.send({message: "Client deleted successfully!"});
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

const minerClientRoutes = new MinerClientRouter();
minerClientRoutes.routes();

export default minerClientRoutes.router;