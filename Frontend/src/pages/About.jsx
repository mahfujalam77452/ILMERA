import AboutHero from '../components/about/AboutHero';
import Principles from '../components/about/Principles';
import Goals from '../components/about/Goals';

const About = () => {
  return (
    <div className="w-full bg-white min-h-screen pb-20 pt-20"> {/* Added pt-20 to account for fixed navbar if you have one */}
      
      {/* 1. Hero Section (Solid Green) */}
      <AboutHero />

      {/* 2. Main Content Container */}
      {/* Removed the negative margin (-mt-16) since we don't have a big image anymore */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        
        {/* Principles Section */}
        <Principles />

        {/* Goals Section */}
        <Goals />
        
      </div>
    </div>
  );
};

export default About;