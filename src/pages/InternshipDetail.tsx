import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Calendar, Building, Users, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockInternships } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const InternshipDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, applyToInternship } = useAuth();
  
  const internship = mockInternships.find(i => i.id === id);
  
  if (!internship) {
    return <Navigate to="/internships" replace />;
  }

  const isApplied = user?.appliedInternships.includes(internship.id) || false;

  const handleApply = () => {
    if (user) {
      applyToInternship(internship.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Remote':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Part-time':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/internships"
          className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Internships</span>
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              {internship.companyLogo && (
                <img
                  src={internship.companyLogo}
                  alt={`${internship.company} logo`}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{internship.title}</h1>
                <div className="flex items-center space-x-2 mb-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <span className="text-lg font-medium text-gray-700">{internship.company}</span>
                </div>
                <div className={`inline-flex px-3 py-1 rounded-md text-sm font-medium border ${getTypeColor(internship.type)}`}>
                  {internship.type}
                </div>
              </div>
            </div>
            
            {user ? (
              isApplied ? (
                <div className="flex items-center space-x-2 px-6 py-3 bg-green-100 text-green-800 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Applied</span>
                </div>
              ) : (
                <button
                  onClick={handleApply}
                  className="px-8 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm hover:shadow-md"
                >
                  Apply Now
                </button>
              )
            ) : (
              <Link
                to="/login"
                className="px-8 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors shadow-sm hover:shadow-md"
              >
                Login to Apply
              </Link>
            )}
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{internship.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium text-gray-900">{internship.duration}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Stipend</p>
                <p className="font-medium text-gray-900">{internship.stipend}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Apply By</p>
                <p className="font-medium text-gray-900">{formatDate(internship.applicationDeadline)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About the Role */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Role</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">{internship.description}</p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-3">
                {internship.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-3">
                {internship.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg border border-indigo-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Deadline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Posted</p>
                  <p className="font-medium text-gray-900">{formatDate(internship.postedDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Deadline</p>
                  <p className="font-medium text-orange-600">{formatDate(internship.applicationDeadline)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <p className="font-medium text-green-600">Open</p>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About {internship.company}</h3>
              <div className="flex items-center space-x-3 mb-4">
                {internship.companyLogo && (
                  <img
                    src={internship.companyLogo}
                    alt={`${internship.company} logo`}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">{internship.company}</p>
                  <p className="text-sm text-gray-500">Technology Company</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                Join our innovative team and work on cutting-edge projects that impact millions of users worldwide.
              </p>
            </div>

            {/* Share */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share This Opportunity</h3>
              <div className="flex space-x-3">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                  LinkedIn
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-900 transition-colors">
                  Twitter
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors">
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetail;