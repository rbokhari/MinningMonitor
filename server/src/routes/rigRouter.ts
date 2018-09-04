// import { Request, Response, Router } from 'express';
// import Rig from '../models/rig';

// export class RigRouter {
//   public router: Router;

//     constructor() {
//         this.router = Router();
//         this.routes();
//     }

//     // get all of the posts in the database
//     public all(req: Request, res: Response): void {
//         Rig.find()
//             .then((data) => {
//                 res.status(200).json({ data });
//             })
//             .catch((error) => {
//                 res.json({ error });
//             });
//     }

//   // get a single post by params of 'slug'
//     public one(req: Request, res: Response): void {
//         const { id } = req.params;

//         Rig.findOne({ id })
//             .then((data) => {
//                 res.status(200).json({ data });
//             })
//             .catch((error) => {
//                 res.status(500).json({ error });
//             });
//     }

//   // create a new post
//     public create(req: Request, res: Response): void {
//         const {
//             cards,
//             ip,
//             os,
//             kernel,
//             email,
//             computer,
//             totalHash,
//             status,
//             singleHash,
//             temperatures,
//             fanSpeeds,
//             coreMemory,
//             shares,
//             invalidShares,
//             gpu
//         } = req.body;

//         const rig = new Rig({
//             cards,
//             ip,
//             os,
//             kernel,
//             email,
//             computer,
//             totalHash,
//             status,
//             singleHash,
//             temperatures,
//             fanSpeeds,
//             coreMemory,
//             shares,
//             invalidShares,
//             gpu
//         });

//         rig.save()
//             .then((data) => {
//                 res.status(201).json({ data });
//             })
//             .catch((error) => {
//                 res.status(500).json({ error });
//             });
//     }

//     // update post by params of 'slug'
//     public update(req: Request, res: Response): void {
//         const { id } = req.body;

//         Rig.findOneAndUpdate({ id }, req.body)
//             .then((data) => {
//                 res.status(200).json({ data });
//             })
//             .catch((error) => {
//                 res.status(500).json({ error });
//             });
//     }

//     // delete post by params of 'slug'
//     public delete(req: Request, res: Response): void {
//         const { id } = req.body;

//         Rig.findOneAndRemove({ id })
//         .then(() => {
//             res.status(204).end();
//         })
//         .catch((error) => {
//             res.status(500).json({ error });
//         });
//     }

//     public routes() {
//         this.router.get('/', this.all);
//         this.router.get('/:id', this.one);
//         this.router.post('/', this.create);
//         this.router.put('/:id', this.update);
//         this.router.delete('/:id', this.delete);
//     }
// }

// const rigRoutes = new RigRouter();
// rigRoutes.routes();

// export default rigRoutes.router;