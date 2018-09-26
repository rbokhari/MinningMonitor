import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const MinerGroupModal = ({isOpen, group, clients, onHandleChange, onHandleSubmit, onHandleClose}) => {
    
    if (!isOpen) return (null);
    return (
        <Modal isOpen={isOpen}>
            <form onSubmit={onHandleSubmit}>
                <ModalHeader>{group ? 'Edit Group' : 'Add New Group'}</ModalHeader>
                <ModalBody>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Name:</label>
                        <div className="col-sm-9">
                            <input type="text" name="name" className="form-control" value={group && group.name} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Miner Client:</label>
                        <div className="col-sm-9">
                            <select name="client" className="form-control" value={group && group.client} onChange={onHandleChange}>
                                <option></option>
                                {clients && clients.map((client, i) => (<option key={i} value={client._id}>{client.name}</option>))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Configuration:</label>
                        <div className="col-sm-9">
                            <textarea name="config" className="form-control" rows="5" value={group && group.config}  onChange={onHandleChange}></textarea>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Remarks:</label>
                        <div className="col-sm-9">
                            <textarea name="notes" className="form-control" rows="5"  value={group && group.notes} onChange={onHandleChange}></textarea>
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

export default MinerGroupModal;