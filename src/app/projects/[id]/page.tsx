"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';

const ProjectDetail = ({ params }) => {
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false); // show or hide QR code

  const { id } = params; // Access ID from params directly

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch('/data/projects.json');
        const projects = await response.json();
        const foundProject = projects.find((proj) => proj.id === parseInt(id));
        setProject(foundProject || null);
      } catch (error) {
        console.error('Failed to fetch project:', error);
        setProject(null); 
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    if (id) {
      fetchProject(); // Call fetchProject with the id
    } else {
      setLoading(false); // Set loading to false if no id is available
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found.</div>; // ONLY IF. case when project is not found
  }

  // URL to the current project detail page
  const projectUrl = `${window.location.origin}/projects/${id}`;

  return (
    <div className="container mx-auto p-8 bg-white shadow-md rounded-md">
      {/* Back button */}
      <button onClick={() => router.push('/projects')} className="mb-6 bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition">
        ← Back to Projects
      </button>

      {/* Project Title */}
      <h1 className="text-4xl font-extrabold mb-4 text-gray-800">{project.title}</h1>

      {/* description */}
      <p className="text-lg text-gray-700 mb-6 leading-relaxed">{project.description}</p>

      {/* GitHub URL */}
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mb-8 text-blue-500 hover:underline text-lg"
        >
          View Project on GitHub ↗
        </a>
      )}

      {/* Screenshots Section */}
      {project.screenshots.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Screenshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.screenshots.map((screenshot, index) => (
              <img
                key={index}
                src={screenshot}
                alt={`Screenshot ${index + 1}`}
                className="w-full h-64 object-cover rounded-md border border-gray-300"
                style={{ objectFit: 'cover', width: '100%', height: '200px' }} // Fixed size for images
              />
            ))}
          </div>
        </div>
      )}

      {/* Button to generate QR Code */}
      <div className="mb-8">
        <button
          onClick={() => setShowQRCode(!showQRCode)}
          className="bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition"
        >
          {showQRCode ? "Hide QR Code" : "Generate QR Code"}
        </button>

        {/* QR Code Section */}
        {showQRCode && (
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Scan this QR Code:</h2>
            <QRCodeCanvas value={projectUrl} size={200} includeMargin={true} className="mx-auto" />
            <p className="mt-4 text-gray-500">Scan to visit this project page.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
