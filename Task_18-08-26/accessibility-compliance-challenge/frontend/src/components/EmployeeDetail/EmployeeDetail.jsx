import React, { useId } from 'react';
import Modal from '../Modal/Modal.jsx';
import Button from '../common/Button.jsx';
import VisuallyHidden from '../common/VisuallyHidden.jsx';

export default function EmployeeDetail({ employee, isOpen, onClose }) {
  const titleId = useId();

  if (!employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} titleId={titleId}>
      <div className="modal-header">
        <h2 id={titleId}>{employee.name}</h2>
        <Button variant="icon" onClick={onClose} aria-label="Close dialog">
          <span aria-hidden="true">✕</span>
        </Button>
      </div>

      <div className="modal-body">
        <dl>
          <dt>Role</dt>
          <dd>{employee.role}</dd>

          <dt>Department</dt>
          <dd>{employee.department}</dd>

          <dt>Location</dt>
          <dd>{employee.location}</dd>

          <dt>Status</dt>
          <dd>{employee.status}</dd>

          <dt>Email</dt>
          <dd>
            <a href={`mailto:${employee.email}`}>
              {employee.email}
              <VisuallyHidden> (opens your email client)</VisuallyHidden>
            </a>
          </dd>

          {employee.bio && (
            <>
              <dt>About</dt>
              <dd>{employee.bio}</dd>
            </>
          )}
        </dl>
      </div>

      <div className="modal-footer">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
