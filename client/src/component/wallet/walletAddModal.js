import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const WalletAddModal = ({isOpen, wallet, onHandleChange, onHandleSubmit, onHandleClose}) => {
    
    if (!isOpen) return (null);
    return (
        <Modal isOpen={isOpen}>
            <form onSubmit={onHandleSubmit}>
                <ModalHeader>{wallet ? 'Edit Wallet' : 'Add New Wallet'}</ModalHeader>
                <ModalBody>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Name:</label>
                        <div className="col-sm-9">
                            <input type="text" name="name" className="form-control" value={wallet && wallet.name} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Eth Address:</label>
                        <div className="col-sm-9">
                            <textarea name="address" className="form-control" rows="5" value={wallet && wallet.address}  onChange={onHandleChange}></textarea>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Notes:</label>
                        <div className="col-sm-9">
                            <textarea name="notes" className="form-control" rows="5" value={wallet && wallet.notes}  onChange={onHandleChange}></textarea>
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

export default WalletAddModal;