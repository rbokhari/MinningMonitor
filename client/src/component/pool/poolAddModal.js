import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const PoolAddModal = ({isOpen, pool, onHandleChange, onHandleSubmit, onHandleClose}) => {
    
    if (!isOpen) return (null);
    return (
        <Modal isOpen={isOpen}>
            <form onSubmit={onHandleSubmit}>
                <ModalHeader>{pool ? 'Edit Pool' : 'New Pool'}</ModalHeader>
                <ModalBody>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Name:</label>
                        <div className="col-sm-9">
                            <input type="text" name="name" className="form-control" value={pool && pool.name} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Pool Address:</label>
                        <div className="col-sm-9">
                            <textarea name="address" className="form-control" rows="5" value={pool && pool.address}  onChange={onHandleChange}></textarea>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Notes:</label>
                        <div className="col-sm-9">
                            <textarea name="notes" className="form-control" rows="5" value={pool && pool.notes}  onChange={onHandleChange}></textarea>
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

export default PoolAddModal;