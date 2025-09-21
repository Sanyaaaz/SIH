import React from 'react';
import { MapPin, Clock, DollarSign, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Internship } from '../types';
import { useAuth } from '../context/AuthContext';

interface InternshipCardProps {
  internship: Internship;
}

const InternshipCard: React.FC<InternshipCardProps> = ({ internship }) => {
  const { user } = useAuth();
  const isApplied = user?.appliedInternships.includes(internship.id) || false;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300 group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            {internship.companyLogo && (
              <img
                src={internship.companyLogo}
                alt={`${internship.company} logo`}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {internship.title}
              </h3>
              <p className="text-gray-600 font-medium">{internship.company}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-md text-xs font-medium border ${getTypeColor(internship.type)}`}>
            {internship.type}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            {internship.location}
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            {internship.duration}
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
            {internship.stipend}
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            Apply by {formatDate(internship.applicationDeadline)}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {internship.description}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {internship.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-md"
            >
              {skill}
            </span>
          ))}
          {internship.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-md">
              +{internship.skills.length - 3} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Posted {formatDate(internship.postedDate)}
          </p>
          <div className="flex items-center space-x-3">
            <Link
              to={`/internship/${internship.id}`}
              className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
            >
              <span>View Details</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
            {isApplied ? (
              <span className="px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-md border border-green-200">
                Applied ✓
              </span>
            ) : (
              <Link
                to={`/internship/${internship.id}`}
                className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-md hover:bg-orange-600 transition-colors"
              >
                Apply Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipCard;