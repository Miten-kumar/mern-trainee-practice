import { useFocusManagement } from "../hooks/useFocusManagement";
import '../styles/accessibility.css';

interface AccessibleModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

const AccessibleModal = ({
  isOpen,
  title,
  onClose,
  children,
  triggerRef,
}: AccessibleModalProps) => {
  const {
    containerRef,
    setTrigger,
  } = useFocusManagement({
    isOpen,
    onEscape: onClose,
  });

  if (!isOpen) {
    return null;
  }

  // eslint-disable-next-line react-hooks/refs
  if (triggerRef?.current) {
    // eslint-disable-next-line react-hooks/refs
    setTrigger(triggerRef.current);
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
    >
      <div
        ref={containerRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessible-modal-title"
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2 id="accessible-modal-title">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title} dialog`}
          >
            <span aria-hidden="true">
              ×
            </span>
          </button>
        </div>

        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccessibleModal;