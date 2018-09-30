import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ConfirmModal = ({isOpen, title, message, onHandleSubmit, onHandleClose}) => {
    
    if (!isOpen) return (null);
    return (
        <Modal isOpen={isOpen}>
            <form onSubmit={onHandleSubmit}>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>
                    <p>
                        {message}
                    </p>
                    
                </ModalBody>
                <ModalFooter>
                    <input type="submit" value="confirm" color="primary" className="btn btn-primary pull-right" />
                    <Button color="default" onClick={onHandleClose} >Cancel</Button>
                </ModalFooter>
            </form>
        </Modal>
    );
}


export default ConfirmModal;