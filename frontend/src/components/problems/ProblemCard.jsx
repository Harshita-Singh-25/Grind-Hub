import React from 'react';
import { Clock, Users, Star, ExternalLink, Code } from 'lucide-react';
import { useProblemStore } from '../../store/useProblemStore';

const ProblemCard = ({ problem }) => {
  const { likeProblem } = useProblemStore();

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'badge-success';
      case 'medium': return 'badge-warning';
      case 'hard': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  const handleLike = async () => {
    await likeProblem(problem._id);
  };

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
      <div className="card-body p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-base-content">{problem.title}</h3>
              <span className={`badge ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
            </div>
            
            <p className="text-base-content/70 mb-4 line-clamp-2">
              {problem.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge badge-outline">{problem.category}</span>
              {problem.tags?.slice(0, 3).map((tag, index) => (
                <span key={index} className="badge badge-ghost text-xs">
                  {tag}
                </span>
              ))}
              {problem.tags?.length > 3 && (
                <span className="badge badge-ghost text-xs">
                  +{problem.tags.length - 3} more
                </span>
              )}
            </div>

            {problem.companies && problem.companies.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-base-content/80 mb-1">Asked by:</p>
                <div className="flex flex-wrap gap-1">
                  {problem.companies.slice(0, 4).map((company, index) => (
                    <span key={index} className="badge badge-primary badge-sm">
                      {company}
                    </span>
                  ))}
                  {problem.companies.length > 4 && (
                    <span className="badge badge-primary badge-sm">
                      +{problem.companies.length - 4}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-base-content/70">
              <div className="flex items-center gap-1">
                <Star size={16} />
                <span>{problem.likes || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span>{problem.submissions || 0} submissions</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => window.open(`/problems/${problem._id}`, '_blank')}
            >
              <Code size={16} />
              Solve
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleLike}
            >
              <Star size={16} className="text-yellow-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemCard;