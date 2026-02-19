import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <Header />
      {/* The Outlet is where the current page content will be rendered */}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;