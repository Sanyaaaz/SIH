import React from 'react';
import Hero from '../components/Hero';
import InternshipCard from '../components/InternshipCard';
import { mockInternships } from '../data/mockData';
import { ArrowRight, Star, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const featuredInternships = mockInternships.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose InternshipHub?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make finding and applying for internships simple, secure, and successful.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Curated Opportunities</h3>
              <p className="text-gray-600">
                Hand-picked internships from top companies ensuring quality and relevance for your career goals.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Career Growth</h3>
              <p className="text-gray-600">
                Build valuable skills and experience that will accelerate your professional development.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Platform</h3>
              <p className="text-gray-600">
                Safe and reliable application process with privacy protection and secure data handling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Internships */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Internships</h2>
              <p className="text-gray-600 mt-2">Discover top opportunities from leading companies</p>
            </div>
            <Link
              to="/internships"
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredInternships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found their perfect internships through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Create Account
            </Link>
            <Link
              to="/internships"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition-colors"
            >
              Browse Internships
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;