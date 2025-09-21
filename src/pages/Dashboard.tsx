import React from 'react';
import { useAuth } from '../context/AuthContext';
import { mockInternships } from '../data/mockData';
import { Calendar, MapPin, DollarSign, Clock, ExternalLink, User, Mail, Phone, CaseSensitive as University } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  const appliedInternships = mockInternships.filter(internship => 
    user.appliedInternships.includes(internship.id)
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 mt-2">Track your applications and manage your profile</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{appliedInternships.length}</h3>
                    <p className="text-sm text-gray-600">Applications</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{appliedInternships.length}</h3>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">95%</h3>
                    <p className="text-sm text-gray-600">Profile Complete</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Applied Internships */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Your Applications</h2>
                  <Link
                    to="/internships"
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    Browse More
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                {appliedInternships.length > 0 ? (
                  <div className="space-y-4">
                    {appliedInternships.map((internship) => (
                      <div key={internship.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            {internship.companyLogo && (
                              <img
                                src={internship.companyLogo}
                                alt={`${internship.company} logo`}
                                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                              />
                            )}
                            <div>
                              <h3 className="font-semibold text-gray-900">{internship.title}</h3>
                              <p className="text-gray-600">{internship.company}</p>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{internship.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>{internship.stipend}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              Pending
                            </span>
                            <p className="text-xs text-gray-500 mt-1">Applied today</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            Deadline: {formatDate(internship.applicationDeadline)}
                          </p>
                          <Link
                            to={`/internship/${internship.id}`}
                            className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                          >
                            <span>View Details</span>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-600 mb-4">Start applying to internships to see them here</p>
                    <Link
                      to="/internships"
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Browse Internships
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
                
                {user.profile?.university && (
                  <div className="flex items-center space-x-3">
                    <University className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">University</p>
                      <p className="font-medium text-gray-900">{user.profile.university}</p>
                    </div>
                  </div>
                )}
                
                {user.profile?.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{user.profile.phone}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <button className="mt-4 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Edit Profile
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/internships"
                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Browse New Internships
                </Link>
                <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  Update Resume
                </button>
                <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  Edit Preferences
                </button>
                <button className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  View Analytics
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-6">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">💡 Pro Tips</h3>
              <ul className="text-sm text-indigo-800 space-y-2">
                <li>• Complete your profile for better matches</li>
                <li>• Apply early to increase your chances</li>
                <li>• Customize your application for each role</li>
                <li>• Follow up on your applications</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;