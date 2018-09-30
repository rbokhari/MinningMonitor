import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const RigEditModal = ({isOpen, rig, groups, onHandleChange, onHandleSubmit, onHandleClose}) => {
    if (!isOpen) return (null);
    return (
        <Modal isOpen={isOpen}>
            <form onSubmit={onHandleSubmit}>
                <ModalHeader>Miner {rig.computerName}</ModalHeader>
                <ModalBody>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Miner Name:</label>
                        <div className="col-sm-9">
                            <input type="text" name="computerName" className="form-control" value={rig && rig.computerName} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Group:</label>
                        <div className="col-sm-9">
                            <select className="form-control" name="group" onChange={onHandleChange}>
                                <option></option>
                                {groups && groups.map((gp,i) => (<option key={i} value={gp.group._id} selected={gp.group._id==rig.group}>{gp.group.name}</option>))}
                            </select>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <input type="submit" value="Submit" color="primary" className="btn btn-primary" />
                    <Button color="danger" onClick={onHandleClose} >Cancel</Button>
                </ModalFooter>
            </form>
        </Modal>
    );
}

// class RigEditModal extends React.Component {
//     constructor(props) {
//         super(props);
//         console.info('123456', this.props.isOpen);
//         this.state = {
//             rig: {},
//             isOpen: this.props.isOpen
//         };
//     }

//     render() {
//         const { isOpen, name, group, rig } = this.state;
//         console.info('open', isOpen, rig);
//         if (!isOpen) return (null);
//         return (
//             <Modal isOpen={isOpen}>
//                 <form onSubmit={handleSubmit}>
//                     <ModalHeader>Miner Detail</ModalHeader>
//                     <ModalBody>
//                         <div className="form-group row">
//                             <label className="col-sm-3 col-form-label">Miner Name:</label>
//                             <div className="col-sm-9">
//                                 <input type="text" className="form-control" value={rig && rig.computerName} />
//                             </div>
//                         </div>
//                         <div className="form-group row">
//                             <label className="col-sm-3 col-form-label">Group:</label>
//                             <div className="col-sm-9">
//                                 <select className="form-control">
//                                     <option></option>
//                                     <option>Default</option>
//                                 </select>
//                             </div>
//                         </div>
//                     </ModalBody>
//                     <ModalFooter>
//                         <input type="submit" value="Submit" color="primary" className="btn btn-primary" />
//                         <Button color="danger" onClick={onCloseModal} >Cancel</Button>
//                     </ModalFooter>
//                 </form>
//             </Modal>
//         );
//     }
// }

// const RigNameModal =({open, onCloseModal, handleSubmit, rig}) => {
//     console.info('props', rig);
// }
// import {
//     Modal,
//     ModalHeader,
//     ModalTitle,
//     ModalClose,
//     ModalBody,
//     ModalFooter
//   } from 'react-modal-bootstrap';
//import { Modal } from 'react-bootstrap';

// const RigNameModal = ({open, handleClose}) => {
//     return (
//         <Modal isOpen={open} onRequestHide={handleClose}>
//             <ModalHeader>
//                 <ModalClose onClick={handleClose}></ModalClose>
//                 <ModalTitle>Modal title</ModalTitle>
//             </ModalHeader>
//             <ModalBody>
//                 <p>Ab ea ipsam iure perferendis! Ad debitis dolore excepturi
//                 explicabo hic incidunt placeat quasi repellendus soluta,
//                 vero. Autem delectus est laborum minus modi molestias
//                 natus provident, quidem rerum sint, voluptas!</p>
//             </ModalBody>
//             <ModalFooter>
//                 <button className='btn btn-default' onClick={this.hideModal}>
//                 Close
//                 </button>
//                 <button className='btn btn-primary'>
//                 Save changes
//                 </button>
//             </ModalFooter>
//         </Modal>
//     );
// }

// const RigNameModal = ({open, onCloseModal}) => {
//     console.info('open', open);
//     return (
//         <Modal show={open} close={onCloseModal} title="Modal Title" style={{zIndex: '10000', position:'relative'}}>
//           <div className="modal fade">
// //             <div className="modal-dialog" role="document">
// //                 <div className="modal-content">
// //                     <div className="modal-header">
// //                         <h5 className="modal-title">Rig Update</h5>
// //                         <button type="button" className="close" data-dismiss="modal" aria-label="Close">
// //                             <span aria-hidden="true">&times;</span>
// //                         </button>
// //                     </div>
// //                     <div className="modal-body">
// //                         <h6>{name}</h6>
// //                         {/* <p className="m-b-0"></p> */}
// //                         <input type="text" />
// //                     </div>
// //                     <div className="modal-footer">
// //                         <button type="button" className="btn btn-default waves-effect " data-dismiss="modal">Close</button>
// //                         <button type="button" className="btn btn-primary waves-effect waves-light ">Save changes</button>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
//         </Modal>
//     );
// };

// let RigNameModal = ({show, title, name, hide}) => {
//     return (
//         <div className="modal fade" id="default-Modal" role="dialog">
//             <div className="modal-dialog" role="document">
//                 <div className="modal-content">
//                     <div className="modal-header">
//                         <h5 className="modal-title">Rig Update</h5>
//                         <button type="button" className="close" data-dismiss="modal" aria-label="Close">
//                             <span aria-hidden="true">&times;</span>
//                         </button>
//                     </div>
//                     <div className="modal-body">
//                         <h6>{name}</h6>
//                         {/* <p className="m-b-0"></p> */}
//                         <input type="text" />
//                     </div>
//                     <div className="modal-footer">
//                         <button type="button" className="btn btn-default waves-effect " data-dismiss="modal">Close</button>
//                         <button type="button" className="btn btn-primary waves-effect waves-light ">Save changes</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

export default RigEditModal;