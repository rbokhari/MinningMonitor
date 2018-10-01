import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ConfirmModal = ({isOpen, title, message, onHandleSubmit, onHandleClose}) => {
    
    if (!isOpen) return (null);
    return (
        <Modal isOpen={isOpen}>
            <form>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>
                    <p>
                        {message}
                    </p>
                    
                </ModalBody>
                <ModalFooter>
                    <Button type="button" onClick={onHandleSubmit} value="confirm" color="primary" className="btn btn-primary pull-right">Submit</Button>
                    <Button color="default" onClick={onHandleClose} >Cancel</Button>
                </ModalFooter>
            </form>
        </Modal>
    );
}


export default ConfirmModal;