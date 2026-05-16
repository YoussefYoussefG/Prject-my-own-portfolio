import { supabase } from '../supabase';

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link_text: string;
  link_url: string;
}

export interface ProjectCategory {
  id: string;
  category: string;
  count: number;
  projects: Project[];
}

export async function getProjectsByCategory(): Promise<ProjectCategory[]> {
  // Fetch categories, ordered by sort_order
  const { data: categories, error: categoryError } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (categoryError) {
    console.error('Error fetching categories:', categoryError);
    return [];
  }

  // Fetch all projects, ordered by sort_order
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true });

  if (projectsError) {
    console.error('Error fetching projects:', projectsError);
    return [];
  }

  // Group projects by category and map to the format expected by the frontend
  return categories.map((cat) => {
    const categoryProjects = projects.filter((p) => p.category_id === cat.id);
    return {
      id: cat.id,
      category: cat.name,
      count: categoryProjects.length,
      projects: categoryProjects.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        tags: p.tags,
        link_text: p.link_text,
        link_url: p.link_url,
      }))
    };
  });
}
