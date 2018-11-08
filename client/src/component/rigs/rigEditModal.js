import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const RigEditModal = ({isOpen, rig, groups, clocktones, onHandleChange, onHandleSubmit, onHandleClose}) => {
    if (!isOpen) return (null);
    return (
        <Modal isOpen={isOpen}>
            <form onSubmit={onHandleSubmit}>
                <ModalHeader>Miner : {rig.computerName}</ModalHeader>
                <ModalBody>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Miner Name:</label>
                        <div className="col-sm-9">
                            <input type="text" name="computerName" className="form-control" value={rig && rig.computerName} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Group:</label>
                        <div className="col-sm-9">
                            <select className="form-control" name="group" onChange={onHandleChange} defaultValue={rig.group && rig.group._id}>
                                <option></option>
                                {groups && groups.map((gp,i) => (<option key={i} value={gp.group._id}>{gp.group.name}</option>))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Clocktone:</label>
                        <div className="col-sm-9">
                            <select className="form-control" name="clocktone" onChange={onHandleChange} defaultValue={rig.clocktone && rig.clocktone._id}>
                                <option></option>
                                {clocktones && clocktones.map((ck,i) => (<option key={i} value={ck._id} >{ck.label}</option>))}
                            </select>
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

export default RigEditModal;