// src/components/LogoutModal.js

import React from 'react';

const LogoutModal = ({ show, onClose, onLogout }) => {
  return (
    <div className={`modal fade ${show ? 'show' : ''}`} tabIndex="-1" aria-labelledby="logoutModalLabel" aria-hidden={!show}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="logoutModalLabel">Confirm Logout</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            Are you sure you want to log out?
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
