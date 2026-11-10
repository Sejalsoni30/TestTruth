import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '../types/index.js';
import { projectService } from '../services/projectService.js';
import { useAuth } from './AuthContext.js';

interface ProjectContextType {
  projects: Project[];
  activeProject: Project | null;
  loading: boolean;
  setActiveProject: (project: Project | null) => void;
  refreshProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshProjects = async () => {
    if (!user) {
      setProjects([]);
      setActiveProject(null);
      return;
    }
    setLoading(true);
    try {
      const list = await projectService.listProjects();
      setProjects(list);
      if (list.length > 0) {
        // Keep active or default to first
        setActiveProject((prev) => {
          if (!prev) return list[0];
          const found = list.find((p) => p._id === prev._id);
          return found || list[0];
        });
      } else {
        setActiveProject(null);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProjects();
  }, [user]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProject,
        loading,
        setActiveProject,
        refreshProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

