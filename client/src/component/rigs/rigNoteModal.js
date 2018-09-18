import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const RigNoteModal = ({isOpen, rig, onHandleChange, onHandleSubmit, onHandleClose}) => {
    
    if (!isOpen) return (null);
    return (
        <Modal isOpen={isOpen}>
            <form onSubmit={onHandleSubmit}>
                <ModalHeader>Miner : {rig.computerName}</ModalHeader>
                <ModalBody>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Miner Notes:</label>
                        <div className="col-sm-9">
                            <textarea type="text" className="form-control" value={rig && rig.notes} onChange={onHandleChange} ></textarea>
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

export default RigNoteModal;