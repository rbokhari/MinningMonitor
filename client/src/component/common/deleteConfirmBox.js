import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const DeleteConfirmModal = ({isOpen, title, msg, onHandleSubmit, onHandleClose}) => {
    
    if (!isOpen) return (null);
    return (
        <Modal isOpen={isOpen}>
            <form onSubmit={onHandleSubmit}>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>
                    <p>
                        {msg}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <input type="submit" value="Delete" color="danger" className="btn btn-danger pull-right" />
                    <Button color="default" onClick={onHandleClose} >Cancel</Button>
                </ModalFooter>
            </form>
        </Modal>
    );
}

export default DeleteConfirmModal;