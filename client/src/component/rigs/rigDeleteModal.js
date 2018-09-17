import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const RigDeleteModal = ({isOpen, onHandleSubmit, onHandleClose}) => {
    
    if (!isOpen) return (null);
    return (
        <Modal isOpen={isOpen}>
            <form onSubmit={onHandleSubmit}>
                <ModalHeader>Miner Delete</ModalHeader>
                <ModalBody>
                    <h4>
                        Are you sure to delete this miner ?
                    </h4>
                    
                </ModalBody>
                <ModalFooter>
                    <input type="submit" value="Delete" color="primary" className="btn btn-primary pull-right" />
                    <Button color="default" onClick={onHandleClose} >Cancel</Button>
                </ModalFooter>
            </form>
        </Modal>
    );
}


export default RigDeleteModal;