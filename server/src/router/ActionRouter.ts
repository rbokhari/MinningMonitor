import { Router, Request, Response, NextFunction } from 'express';
import Action from '../models/action';

export class ActionRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public GetActions(req: Request, res: Response): void {
        Action.find()
            .then(data => {
                res.status(200).json({
                    data
                });
            })
            .catch(err => {
                res.status(400).json(err);
            });
    }
    
    public GetAction(req: Request, res: Response): void {
        const id: string = req.params.id;
        Action.findOne({_id: id})
            .then(data => {
                res.status(200).json({
                    data
                });
            })
            .catch(err => {
                res.status(400).json(err);
            });
    }

    public CreateAction(req: Request, res: Response): void {
        const rig: Number = req.body.rig;
        const act: string = req.body.action;
        const status: string = req.body.status;

        const action = new Action({
            rig,
            action: act,
            status
        });

        action.save()
            .then(data => {
                console.log("action saved", data);
                res.status(201).json({data});
            })
            .catch(err => {
                console.log('error occured by creating action', err);
                res.status(400).json({ err });
            });
    }

    public UpdateAction(req: Request, res: Response): void {
        const id: string = req.params.id;
        const rig: Number = req.body.rig;
        const act: string = req.body.action;
        const status: string = req.body.status;

        const action = {
            rig,
            action: act,
            status
        };
        Action.findByIdAndUpdate( id, {$set: action}, {new: true}, function(err, model) {
            if (err) res.status(400).json(err);
            
            console.info('update action data ', model);
            res.status(200).json({
                model
            });
        });
    }

    public PatchName(req: Request, res: Response): void {
        const id: string = req.params.id;
        const name: string = req.body.name;
        console.info('name', name);
        Action.findByIdAndUpdate( id, {$set: { 'computerName': name }}, {new: true}, function(err, model) {
            if (err) res.status(400).json(err);
            
            console.info('patch rig data ', model);
            res.status(200).json({
                model
            });
        });
    }

    public DeleteAction(req: Request, res: Response): void {
        const id: string = req.params.id;
        Action.findByIdAndRemove(id)
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
        this.router.get('/', this.GetActions);
        this.router.get('/:id', this.GetAction);
        this.router.post('/', this.CreateAction);
        this.router.put('/:id', this.UpdateAction);
        this.router.put('/:id/name', this.PatchName);
        this.router.delete('/:id', this.DeleteAction);
    }
}

const actionRoutes = new ActionRouter();
actionRoutes.routes();

export default actionRoutes.router;