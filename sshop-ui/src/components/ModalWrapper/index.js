const ModalWrapper = ({ children, color = 'rgba(0, 0, 0, 0.5)' }) => {
    return (
        <div style={{ backgroundColor: color, zIndex: 1000 }} className="fixed mx-0 bottom-0 top-0 left-0 right-0">
            {children}
        </div>
    );
};

export default ModalWrapper;
