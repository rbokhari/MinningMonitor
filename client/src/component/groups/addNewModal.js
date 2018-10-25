import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const MinerGroupModal = ({isOpen, group, clients, wallets, pools, clocktones, onHandleChange, onHandleSubmit, onHandleClose}) => {
    
    if (!isOpen) return (null);
    return (
        <Modal isOpen={isOpen}>
            <form onSubmit={onHandleSubmit}>
                <ModalHeader>{group ? 'New Group' : 'Edit Group'}</ModalHeader>
                <ModalBody>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Name:</label>
                        <div className="col-sm-9">
                            <input type="text" name="name" className="form-control" value={group && group.name} onChange={onHandleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Miner Client:</label>
                        <div className="col-sm-9">
                            <select name="client" className="form-control" value={group && group.client} onChange={onHandleChange}>
                                <option></option>
                                {clients && clients.map((client, i) => (<option key={i} value={client._id}>{client.name}</option>))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Wallet:</label>
                        <div className="col-sm-9">
                            <select name="wallet" className="form-control" value={group && group.wallet} onChange={onHandleChange}>
                                <option></option>
                                {wallets && wallets.map((w, i) => (<option key={i} value={w._id}>{w.name}</option>))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Pool:</label>
                        <div className="col-sm-9">
                            <select name="pool" className="form-control" value={group && group.pool} onChange={onHandleChange}>
                                <option></option>
                                {pools && pools.map((pool, i) => (<option key={i} value={pool.id}>{pool.name}</option>))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Clocktone:</label>
                        <div className="col-sm-9">
                            <select name="clocktone" className="form-control" value={group && group.clocktone} onChange={onHandleChange}>
                                <option></option>
                                {clocktones && clocktones.map((c, i) => (<option key={i} value={c._id}>{c.label}</option>))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Configuration:</label>
                        <div className="col-sm-9">
                            <textarea name="config" className="form-control" rows="3" value={group && group.config}  onChange={onHandleChange}></textarea>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label">Remarks:</label>
                        <div className="col-sm-9">
                            <textarea name="notes" className="form-control" rows="2"  value={group && group.notes} onChange={onHandleChange}></textarea>
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

export default MinerGroupModal;