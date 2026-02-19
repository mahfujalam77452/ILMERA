import HeroSection from '../components/home/HeroSection';
import DonationBox from '../components/home/DonationBox';
import CorePillars from '../components/home/CorePillars';
import OngoingActivities from '../components/home/OngoingActivities';
import DonationFunds from '../components/home/DonationFunds';
import JoinUs from '../components/home/JoinUs';
import HomeGallery from '../components/home/HomeGallery';
import RecentBlogs from '../components/home/RecentBlogs'; // <-- Import
import HeroSlider from '../components/home/HeroSlider';
const Home = () => {
  return (
    <div className="flex flex-col w-full">
      <HeroSlider />
      <HeroSection />
      <DonationBox />
      <CorePillars />
      <OngoingActivities />
      <DonationFunds />
      <JoinUs />
      <HomeGallery />
      <RecentBlogs /> {/* <-- Add it here */}
      
      {/* Next: Footer */}
    </div>
  );
};

export default Home;