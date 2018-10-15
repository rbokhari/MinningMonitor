import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const OptionModal = ({isOpen, option, onHandleChange, onHandleSubmit, onHandleClose}) => {
    
    if (!isOpen) return (null);
    return (
        <Modal isOpen={isOpen}>
            <form onSubmit={onHandleSubmit}>
                <ModalHeader>{option ? 'Add New option' : 'Edit option'}</ModalHeader>
                <ModalBody>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Label:</label>
                        <div className="col-sm-9">
                            <input type="text" name="label" className="form-control" value={option && option.label} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Core:</label>
                        <div className="col-sm-9">
                            <input type="text" name="core" className="form-control" value={option && option.core} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Memory:</label>
                        <div className="col-sm-9">
                            <input type="text" name="memory" className="form-control" value={option && option.memory} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Voltage:</label>
                        <div className="col-sm-9">
                            <input type="text" name="voltage" className="form-control" value={option && option.voltage} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Powerstage:</label>
                        <div className="col-sm-9">
                            <input type="text" name="powerstage" className="form-control" value={option && option.powerstage} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Target Temperature:</label>
                        <div className="col-sm-9">
                            <input type="text" name="targetTemp" className="form-control" value={option && option.targetTemp} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Min Fan Speed:</label>
                        <div className="col-sm-9">
                            <input type="text" name="minFanSpeed" className="form-control" value={option && option.minFanSpeed} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Notes:</label>
                        <div className="col-sm-9">
                            <textarea name="notes" className="form-control" rows="5" value={option && option.notes}  onChange={onHandleChange}></textarea>
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

export default OptionModal;