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
                            <input type="text" name="powerStage" className="form-control" value={option && option.powerStage} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Target Temperature:</label>
                        <div className="col-sm-9">
                            <input name="targetTemp" type="range" list="tickmarks" style={{width: '100%'}} min="1" max="100" step="1" value={option && option.temperature} onChange={onHandleChange} />
                            <datalist id="tickmarks">
                                <option value="1" label="1" />
                                <option value="10" />
                                <option value="20" />
                                <option value="30" />
                                <option value="40" />
                                <option value="50" label="50" />
                                <option value="60"/>
                                <option value="70"/>
                                <option value="80"/>
                                <option value="90"/>
                                <option value="100" label="100"/>
                                </datalist>
                            {/* <input type="text" name="targetTemp" className="form-control" value={option && option.targetTemp} onChange={onHandleChange} /> */}
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Min Fan Speed:</label>
                        <div className="col-sm-9">
                            <input name="minFanSpeed" type="range" list="tickmarks" style={{width: '100%'}} min="1" max="100" step="1" value={option && option.fanSpeed} onChange={onHandleChange} />
                            {/* <input type="text" name="minFanSpeed" className="form-control" value={option && option.minFanSpeed} onChange={onHandleChange} /> */}
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
                    <Button type="button" color="" onClick={onHandleClose} >Cancel</Button>
                </ModalFooter>
            </form>
        </Modal>
    );
}

export default OptionModal;