import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

const ClientLayout = ({ children }) => {
    return (
        <div className="flex flex-col pt-48" style={{ backgroundColor: '#f5f5f5' }}>
            <Header />
            <div className="pb-36 relative" style={{ minHeight: '70vh' }}>
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default ClientLayout;
