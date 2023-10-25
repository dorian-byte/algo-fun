import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import ProblemList from '../components/ProblemList';

const ALL_PROBLEMS = gql`
  query AllProblems {
    allProblems {
      id
      title
      leetcodeNumber
      description
      createdAt
      updatedAt
      askedByFaang
      acceptanceRate
      frequency
      difficulty
      timeComplexityRequirement
      spaceComplexityRequirement
      submissions {
        id
      }
      notes {
        id
      }
      resources {
        id
      }
      companies {
        id
        name
      }
      topics {
        id
        name
      }
      url
      lintcodeEquivalentProblemNumber
      lintcodeEquivalentProblemUrl
      submissions {
        passed
      }
    }
  }
`;
const ALL_TOPICS = gql`
  query AllTopics {
    allTopics {
      id
      name
    }
  }
`;

const ALL_COMPANIES = gql`
  query AllCompanies {
    allCompanies {
      id
      name
    }
  }
`;

const ProblemListPage = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'Topics' | 'Companies'>('Topics');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [topics, setTopics] = useState([]);
  const [companies, setCompanies] = useState([]);

  const { data: topicsData } = useQuery(ALL_TOPICS);
  const { data: companiesData } = useQuery(ALL_COMPANIES);
  const { loading, error, data } = useQuery(ALL_PROBLEMS);

  useEffect(() => {
    if (topicsData) {
      setTopics(topicsData.allTopics);
    }
  }, [topicsData]);

  useEffect(() => {
    if (companiesData) {
      setCompanies(companiesData.allCompanies);
    }
  }, [companiesData]);

  useEffect(() => {
    if (data) {
      setProblems(data.allProblems);
      setFilteredProblems(data.allProblems);
    }
  }, [data]);

  useEffect(() => {
    let result = problems.filter((pb: any) => {
      return (
        (!difficultyFilter || pb.difficulty === difficultyFilter) &&
        (tagFilters.length === 0 ||
          tagFilters.some(
            (tag) =>
              pb.topics.some((t: any) => t.name === tag) ||
              pb.companies.some((c: any) => c.name === tag)
          ))
      );
    });
    setFilteredProblems(result);
  }, [difficultyFilter, tagFilters, problems]);

  const toggleTag = (tag: string) => {
    setTagFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const itemsToShow = (items: any[]) => {
    return isExpanded ? items : items.slice(0, 10);
  };

  if (error) return <p>Error :( {error.message}</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div id="problemlist">
      <div
        id="problemlist-header"
        className="container d-flex flex-row justify-content-between align-items-center"
      >
        <h2 className="page-header">Problems</h2>
        <div className="d-flex flex-row align-items-center gap-3">
          <div className="dropdown">
            <button
              className="btn btn-outline-primary dropdown-toggle"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
            >
              Tags
            </button>
            <div className="dropdown-menu">
              <input
                className="dropdown-item"
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="d-flex dropdown-item nav-tabs">
                <div
                  className={`dropdown-item nav-item text-light ${
                    activeTab === 'Topics' ? 'active' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('Topics');
                  }}
                >
                  Topics
                </div>
                <div
                  className={`dropdown-item nav-item text-light ${
                    activeTab === 'Companies' ? 'active' : ''
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('Companies');
                  }}
                >
                  Companies
                </div>
              </div>
              {activeTab === 'Topics'
                ? itemsToShow(
                    topics.filter((t: any) => t.name.includes(searchTerm))
                  ).map((topic: any) => (
                    <span
                      className="badge bg-secondary"
                      key={topic.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTag(topic.name);
                      }}
                    >
                      {tagFilters.includes(topic.name) ? (
                        <strong className="text-primary">{topic.name}</strong>
                      ) : (
                        <span className="text-light">{topic.name}</span>
                      )}
                    </span>
                  ))
                : itemsToShow(
                    companies.filter((c: any) => c.name.includes(searchTerm))
                  ).map((company: any) => (
                    <span
                      className="badge bg-secondary"
                      key={company.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTag(company.name);
                      }}
                    >
                      {tagFilters.includes(company.name) ? (
                        <strong className="text-primary">{company.name}</strong>
                      ) : (
                        <span className="text-light">{company.name}</span>
                      )}
                    </span>
                  ))}
              <button
                className="btn btn-primary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>
            </div>
          </div>
          <select
            value={difficultyFilter || ''}
            onChange={(e) => setDifficultyFilter(e.target.value || null)}
            className="btn btn-outline-primary"
          >
            <option value="">Difficulty</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
          <button
            className="btn btn-outline-primary btn-sm"
            style={{ height: 30, width: 30 }}
            onClick={() => navigate('/problems/new')}
          >
            +
          </button>
        </div>
      </div>
      <div className="main container" id="problemlist-bottom">
        <ProblemList problems={filteredProblems} />
      </div>
    </div>
  );
};

export default ProblemListPage;
