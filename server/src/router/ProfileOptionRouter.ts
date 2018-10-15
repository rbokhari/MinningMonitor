import { Router, Request, Response, NextFunction } from 'express';
import ProfileOption from '../models/profileOption';

export class ProfileOptionRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public GetAll(req: Request, res: Response): void {
        ProfileOption.find()
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => {
                res.status(400).json(err);
            });
    }
    
    public GetSingle(req: Request, res: Response): void {
        const id: string = req.params.id;
        ProfileOption.findOne({_id: id})
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => {
                res.status(400).json(err);
            });
    }

    public CreateProfileOption(req: Request, res: Response): void {
        const label: String = req.body.label;
        const core: number = req.body.core;
        const memory: number = req.body.memory;
        const voltage: number = req.body.voltage;
        const powerStage: number = req.body.powerstage;
        const temperature: number = req.body.targetTemp;
        const fanSpeed: number = req.body.minFanSpeed;
        const notes: number = req.body.notes;
        const status: number = 1;

        const profileOption = new ProfileOption({
            label,
            core,
            memory,
            voltage,
            powerStage,
            temperature,
            fanSpeed,
            notes,
            status
        });

        profileOption.save()
            .then(data => {
                res.status(201).json(data);
            })
            .catch(err => {
                console.log('error occured by creating action', err);
                res.status(400).json({ err });
            });
    }

    public UpdateProfileOption(req: Request, res: Response): void {
        const id: string = req.params.id;
        const label: String = req.body.label;
        const core: number = req.body.core;
        const memory: number = req.body.memory;
        const voltage: number = req.body.voltage;
        const powerStage: number = req.body.powerstage;
        const temperature: number = req.body.targetTemp;
        const fanSpeed: number = req.body.minFanSpeed;
        const notes: number = req.body.notes;
        const status: number = 1;

        const profileOption = {
            label,
            core,
            memory,
            voltage,
            powerStage,
            temperature,
            fanSpeed,
            notes,
            status
        };
        ProfileOption.findByIdAndUpdate( id, {$set: profileOption}, {new: true}, function(err, data) {
            if (err) res.status(400).json(err);
            
            res.status(200).json(data);
        });
    }

    public DeleteProfileOption(req: Request, res: Response): void {
        const id: string = req.params.id;
        ProfileOption.findByIdAndRemove(id)
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
        this.router.post('/', this.CreateProfileOption);
        this.router.put('/:id', this.UpdateProfileOption);
        this.router.delete('/:id', this.DeleteProfileOption);
    }
}

const profileOptionRoutes = new ProfileOptionRouter();
profileOptionRoutes.routes();

export default profileOptionRoutes.router;