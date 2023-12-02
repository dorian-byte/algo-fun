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
      submittedAt
      askedByFaang
      acceptanceRate
      frequency
      difficulty
      timeComplexityRequirement
      spaceComplexityRequirement
      submissions {
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
  const [showDropdown, setShowDropdown] = useState(false);
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
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            All Tags
          </button>
          {showDropdown && (
            <div className="dropdown">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={() => setActiveTab('Topics')}>Topics</button>
              <button onClick={() => setActiveTab('Companies')}>
                Companies
              </button>
              {activeTab === 'Topics'
                ? itemsToShow(
                    topics.filter((t: any) => t.name.includes(searchTerm))
                  ).map((topic: any) => (
                    <div key={topic.id} onClick={() => toggleTag(topic.name)}>
                      {tagFilters.includes(topic.name) ? (
                        <strong>{topic.name}</strong>
                      ) : (
                        topic.name
                      )}
                    </div>
                  ))
                : itemsToShow(
                    companies.filter((c: any) => c.name.includes(searchTerm))
                  ).map((company: any) => (
                    <div
                      key={company.id}
                      onClick={() => toggleTag(company.name)}
                    >
                      {tagFilters.includes(company.name) ? (
                        <strong>{company.name}</strong>
                      ) : (
                        company.name
                      )}
                    </div>
                  ))}
              <button onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>
            </div>
          )}
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
