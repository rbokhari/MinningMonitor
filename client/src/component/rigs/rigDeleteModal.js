import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const RigDeleteModal = ({isOpen, onHandleSubmit, onHandleClose}) => {
    
    if (!isOpen) return (null);
    return (
        <Modal isOpen={isOpen}>
            <form onSubmit={onHandleSubmit}>
                <ModalHeader>Miner Delete</ModalHeader>
                <ModalBody>
                    <p>
                        Are you sure you want to delete this miner ?
                    </p>
                    
                </ModalBody>
                <ModalFooter>
                    <input type="submit" value="Delete" color="danger" className="btn btn-danger pull-right" />
                    <Button type="button" color="default" onClick={onHandleClose} >Cancel</Button>
                </ModalFooter>
            </form>
        </Modal>
    );
}


export default RigDeleteModal;