import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const MinerClientModal = ({isOpen, client, onHandleChange, onHandleSubmit, onHandleClose}) => {

    if (!isOpen) return (null);
    return (
        <Modal isOpen={isOpen}>
            <form onSubmit={onHandleSubmit}>
                <ModalHeader>{client ? 'Edit Client' : 'New Client'}</ModalHeader>
                <ModalBody>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Name:</label>
                        <div className="col-sm-9">
                            <input type="text" name="name" className="form-control" value={client && client.name} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Executable:</label>
                        <div className="col-sm-9">
                            <input type="text" name="exec" className="form-control" value={client && client.exec} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">R:</label>
                        <div className="col-sm-9">
                            <input type="checkbox" name="r" className="" checked={client && client.r == 1 ? '1': '0'} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">RX {client && client.rx}:</label>
                        <div className="col-sm-9">
                            <input type="checkbox" name="rx" className="" checked={client && client.rx  == 1 ? '1': '0'} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">NV:</label>
                        <div className="col-sm-9">
                            <input type="checkbox" name="nv" className="" value={client && client.nv == 1 ? '1': '0'} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Info:</label>
                        <div className="col-sm-9">
                            <textarea name="info" rows="5" className="form-control" value={client && client.info}  onChange={onHandleChange}></textarea>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Remakrs:</label>
                        <div className="col-sm-9">
                            <input type="text" name="remarks" className="form-control" value={client && client.remarks}  onChange={onHandleChange} />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <input type="submit" value="Submit" color="primary" className="btn btn-primary" />
                    <Button color="" onClick={onHandleClose} >Cancel</Button>
                </ModalFooter>
            </form>
        </Modal>
    );
}

export default MinerClientModal;