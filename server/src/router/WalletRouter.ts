import { Router, Request, Response, NextFunction } from 'express';
import Wallet from '../models/wallet';

export class WalletRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public GetAll(req: Request, res: Response): void {
        Wallet.find()
            
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => {
                res.status(400).json(err);
            });
    }
    
    public GetSingle(req: Request, res: Response): void {
        const id: string = req.params.id;
        Wallet.findOne({_id: id})
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => {
                res.status(400).json(err);
            });
    }

    public CreateWallet(req: Request, res: Response): void {
        const name: string = req.body.name;
        const ethAddress: string = req.body.address;
        const notes: string = req.body.notes;
        const status: string = req.body.status;

        const wallet = new Wallet({            
            name,
            ethAddress,
            notes,
            status
        });

        wallet.save()
            .then(data => {
                res.status(201).json({data});
            })
            .catch(err => {
                console.log('error occured by creating action', err);
                res.status(400).json({ err });
            });
    }

    public UpdateWallet(req: Request, res: Response): void {
        const id: string = req.params.id;
        const name: Number = req.body.name;
        const ethAddress: string = req.body.address;
        const notes: string = req.body.notes;
        const status: string = req.body.status;

        const wallet = {
            name,
            ethAddress,
            notes,
            status
        };
        Wallet.findByIdAndUpdate( id, {$set: wallet}, {new: true}, function(err, model) {
            if (err) res.status(400).json(err);
            
            res.status(200).json(model);
        });
    }

    public DeleteWallet(req: Request, res: Response): void {
        const id: string = req.params.id;
        Wallet.findByIdAndRemove(id)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => {
                res.status(400).json(err);
            });
    }

    routes() {
        this.router.get('/', this.GetAll);
        this.router.get('/:id', this.GetSingle);
        this.router.post('/', this.CreateWallet);
        this.router.put('/:id', this.UpdateWallet);
        this.router.delete('/:id', this.DeleteWallet);
    }
}

const walletRoutes = new WalletRouter();
walletRoutes.routes();

export default walletRoutes.router;