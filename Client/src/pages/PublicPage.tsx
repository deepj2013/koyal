import React from 'react';
import { Music, Video, Upload, Mic, Edit, UserCircle, LogIn } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Logowhite from '../assets/images/logowhite.png';
import bgvedio from '../assets/vedio/bgvedio.mp4';



function PublicPage() {
  const navigate = useNavigate();
  const goToUploadPage = () => {
    navigate("/upload");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Video Background */}
        <div className="absolute inset-0 overflow-hidden">
          <video 
            className="w-full h-full object-cover opacity-50"
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src={bgvedio} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 px-4 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {/* <Music className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold">KOYAL</span> */}
              <img src={Logowhite} className='w-40 h-15' />
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="hover:text-red-500 transition">Features</a>
              <a href="#pricing" className="hover:text-red-500 transition">Pricing</a>
              <button className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition">
                <LogIn className="w-4 h-4 inline mr-2" />
                Sign In
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 h-[calc(100vh-5rem)] flex items-center">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Transform Your <span className="text-red-600">Audio</span> Into
              <br /> Stunning <span className="text-red-600">Videos</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Create professional music videos with custom avatars, synchronized lyrics,
              and stunning visuals in minutes.
            </p>
            <button
  onClick={goToUploadPage}
  className="bg-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition transform hover:scale-105"
>
  What's Your Name
</button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Create Your Perfect <span className="text-red-600">Video</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Upload />}
              title="Upload Audio"
              description="Import your audio tracks with ease"
            />
            <FeatureCard 
              icon={<UserCircle />}
              title="Custom Avatar"
              description="Choose or upload your own avatar"
            />
            <FeatureCard 
              icon={<Edit />}
              title="Edit Lyrics"
              description="Sync and customize your lyrics"
            />
            <FeatureCard 
              icon={<Video />}
              title="Video Effects"
              description="Add stunning visual effects"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-red-900 to-black py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Ready to Create Your Next Hit?
          </h2>
          <button className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105">
            Get Started For Free
          </button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition">
      <div className="text-red-600 w-12 h-12 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

export default PublicPage;