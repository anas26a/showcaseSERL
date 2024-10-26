'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [titleFilter, setTitleFilter] = useState(''); // State for search input
  const [selectedTag, setSelectedTag] = useState(''); // State for selected tag
  const [selectedType, setSelectedType] = useState(''); // State for selected project type
  const [filteredProjectCount, setFilteredProjectCount] = useState(0);
  const refreshInterval = 30000; // 30 sec  in milliseconds

  // Function to fetch the project data
  const fetchProjects = () => {
    fetch('/data/projects.json')
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
        setFilteredProjectCount(data.length);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
      });
  };

  useEffect(() => {
    // Initial fetch
    fetchProjects();

    // Set up interval to reload the project specification file every minute
    const interval = setInterval(() => {
      fetchProjects();
    }, refreshInterval);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const tags = [...new Set(projects.flatMap((project) => project.tags))];
  const types = [...new Set(projects.map((project) => project.type))]; // Extract unique project types

  const clearFilters = () => {
    setTitleFilter('');
    setSelectedTag('');
    setSelectedType('');
  };

  const filteredProjects = projects.filter((project) => {
    const matchesTitle = titleFilter === '' || project.title.toLowerCase().includes(titleFilter.toLowerCase()) || project.description.toLowerCase().includes(titleFilter.toLowerCase());
    const matchesTag = selectedTag === '' || project.tags.includes(selectedTag);
    const matchesType = selectedType === '' || project.type === selectedType;
    return matchesTitle && matchesTag && matchesType;
  });

  useEffect(() => {
    setFilteredProjectCount(filteredProjects.length);
  }, [filteredProjects]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Projects</h1>

      {/* Filters Section */}
      <div className="mb-6">
        {/* Search Input for filtering by project title or description */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by project title or description..."
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded mb-4 w-full text-black"
          />
        </div>

        {/* Dropdown for filtering by tags */}
        <div className="mb-4">
          <label htmlFor="tagFilter" className="block mb-2">
            Filter by Tags:
          </label>
          <select
            id="tagFilter"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="border border-gray-300 p-2 rounded mb-4 w-full text-black"
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown for filtering by project type */}
        <div className="mb-4">
          <label htmlFor="typeFilter" className="block mb-2">
            Filter by Project Type:
          </label>
          <select
            id="typeFilter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 p-2 rounded mb-4 w-full text-black"
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="mb-4 bg-blue-600 text-white py-2 px-4 rounded"
        >
          Clear Filters
        </button>
      </div>

      {/* Total Projects Counter */}
      <div className="text-lg font-semibold text-gray-700 mb-4">
        Showing {filteredProjectCount} {filteredProjectCount === 1 ? 'project' : 'projects'}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="project-card p-4 border rounded shadow hover:shadow-lg transition-all duration-300">
              <h4 className="text-xl font-semibold mb-2">{project.title}</h4>
              <p className="text-gray-800 mb-2">{project.description}</p>
              <p className="text-sm text-gray-600 mb-2">
                Tags: {project.tags.join(', ')}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Type: {project.type}
              </p>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500">No projects match your filters.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
