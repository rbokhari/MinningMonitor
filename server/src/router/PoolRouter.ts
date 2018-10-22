import { Router, Request, Response, NextFunction } from 'express';
import Pool from '../models/pool';

export class PoolRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public GetAll(req: Request, res: Response): void {
        Pool.find()
            .exec((err, pools) => {
                if (err) res.status(500).json(err); 

                let dataMap = pools.map((p,i) => {
                    return {
                        id: p._id,
                        name: p['name'],
                        address: p['poolAddress'],
                        notes: p['notes'],
                    }
                });

                res.status(200).json(dataMap);
            });
    }
    
    public GetSingle(req: Request, res: Response): void {
        const id: string = req.params.id;
        Pool.findOne({_id: id})
            .then(data => {
                res.status(200).json(data);
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
        const poolAddress = req.body.address;
        const notes: String = req.body.notes;
        const status = 1;

        const pool = new Pool({
            name,
            poolAddress,
            notes,
            status
        });

        pool.save()
            .then(data => {
                res.status(201).json(data);
            })
            .catch(err => {
                console.log('error occured by creating pool', err);
                res.status(500).json({ err });
            });
    }

    public Update(req: Request, res: Response): void {
        const id: string = req.params.id;
        const name: Number = req.body.name;
        const poolAddress: string = req.body.address;
        const notes: Number = req.body.notes;
        const status: string = req.body.status;

        const pool = {
            name,
            poolAddress,
            notes,
            status
        };
        Pool.findByIdAndUpdate( id, {$set: pool}, {new: true}, function(err, updatePool) {
            if (err) res.status(400).json(err);            
            res.status(200).json(updatePool);
        });
    }

    public Delete(req: Request, res: Response): void {
        const id: string = req.params.id;
        Pool.findByIdAndRemove(id)
            .then(pool => {
                if(!pool) {
                    return res.status(404).send({
                        message: "Miner not found with id " + id
                    });
                }
                res.send({message: "MIner deleted successfully!"});
            })
            .catch(err => {
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

const poolRoutes = new PoolRouter();
poolRoutes.routes();

export default poolRoutes.router;