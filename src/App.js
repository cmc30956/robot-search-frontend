import React, { useState, useEffect } from 'react';

// Main application component
const App = () => {
  const [query, setQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSource, setSelectedSource] = useState('All');
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [sortOption, setSortOption] = useState('stars'); // Add state for sort option

  const backendUrl = "https://robot-search-backend.onrender.com";

  // The main function to perform the combined search via the backend.
  const performSearch = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        query: query,
        source: selectedSource,
        tags: selectedTags.join(','),
        sort: sortOption,
      }).toString();

      const response = await fetch(`${backendUrl}/api/search?${params}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setFilteredProjects(data);

    } catch (err) {
      console.error("Search failed:", err);
      setError("搜索失败，请检查后端服务是否已启动或API密钥是否有效。");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all tags from the backend to populate the filter buttons.
  const fetchAllTags = async () => {
    try {
      const allProjects = await fetch(`${backendUrl}/api/search`).then(res => res.json());

      const tags = [...new Set(
        allProjects.flatMap(p => p.tags)
      )].map(t => t.replace('-', ' ')).sort();
      
      setAllTags(tags);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
      setError("无法获取标签，请重试。");
    }
  };

  useEffect(() => {
    // Load all tags for the filter UI.
    fetchAllTags();
    // Perform initial search.
    performSearch();
  }, [selectedSource, selectedTags, sortOption]); // Remove dependency on selectedRobotType

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800 p-4 sm:p-8 flex flex-col items-center">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 w-full max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 text-gray-900">
          开源机器人项目搜索
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          在这里发现来自 GitHub 和 Hugging Face 的开源机器人项目、模型和算法。
        </p>

        {/* Search form */}
        <form onSubmit={handleSearchSubmit} className="mb-8">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索项目，例如 'ROS2' 或 'robotic arm'"
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-colors ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? '搜索中...' : '搜索'}
            </button>
          </div>
        </form>

        {/* Filter and Sort controls */}
        <div className="mb-8 flex flex-col sm:flex-row sm:space-x-4">
          <div className="mb-4 sm:mb-0 flex-1">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">按来源筛选</h3>
            <div className="flex flex-wrap gap-2">
              {['All', 'GitHub', 'Hugging Face'].map(source => (
                <button
                  key={source}
                  onClick={() => setSelectedSource(source)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedSource === source
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {source}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">按排序</h3>
            <div className="flex flex-wrap gap-2">
              {['stars', 'growth', 'growth_week', 'growth_month'].map(option => (
                <button
                  key={option}
                  onClick={() => setSortOption(option)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    sortOption === option
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {option === 'stars' ? '最多 Stars' : 
                   option === 'growth' ? '增长最快' :
                   option === 'growth_week' ? '最近一周增长最快' : '最近一月增长最快'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Display content */}
        {error && (
          <div className="text-center py-4 text-red-600 font-medium">
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg text-gray-600">正在努力搜索中...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <div key={project.id} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="block">
                    <h2 className="text-xl font-bold text-blue-600 mb-1 hover:underline">
                      {project.name}
                    </h2>
                    <p className="text-sm font-semibold text-gray-500 mb-2">
                      来源: {project.source}
                    </p>
                    <p className="text-gray-700 mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </a>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>没有找到匹配的项目。</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;

