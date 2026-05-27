-- Create categories table
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create projects table
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    link_text TEXT NOT NULL DEFAULT 'GITHUB REPO',
    link_url TEXT NOT NULL DEFAULT '#',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create messages table (for contact form)
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
-- We want anyone to be able to read categories and projects
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
-- We want anyone to be able to insert messages, but only authenticated users to read them
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access for projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert for messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Insert Initial Seed Data (Your current portfolio data)
DO $$
DECLARE
    web_id UUID := gen_random_uuid();
    mobile_id UUID := gen_random_uuid();
    data_id UUID := gen_random_uuid();
BEGIN
    -- Insert Categories
    INSERT INTO public.categories (id, name, sort_order) VALUES
        (web_id, 'Web Apps', 1),
        (mobile_id, 'Mobile Apps', 2),
        (data_id, 'Data Analytics', 3);

    -- Insert Web Apps Projects
    INSERT INTO public.projects (category_id, title, description, tags, link_text, link_url, sort_order) VALUES
        (web_id, 'SafeOR: Operating Room QMS', 'An interactive Quality Management System designed to digitize and monitor safety standards within operating rooms, featuring secure authentication, live dashboards, and incident reporting.', ARRAY['WEB APP', 'REACT', 'DJANGO'], 'GITHUB REPO', 'https://github.com/YoussefYoussefG/OR-Safety-Management-System-Operating-Room-QMS', 1),
        (web_id, 'Image Processing Application', 'An interactive web app that allows users to mix visual components from images and perform corner detection, enabling creative experimentation and intuitive understanding of image processing concepts.', ARRAY['WEB APP'], 'GITHUB REPO', '#', 2),
        (web_id, 'BM - Backend Service', 'A modular backend service that provides secure API endpoints with authentication support, designed for scalability and deployed using a serverless architecture.', ARRAY['WEB APP'], 'GITHUB REPO', '#', 3);

    -- Insert Mobile Apps Projects
    INSERT INTO public.projects (category_id, title, description, tags, link_text, link_url, sort_order) VALUES
        (mobile_id, 'SafeOR: Operating Room QMS', 'An interactive Quality Management System designed to digitize and monitor safety standards within operating rooms, featuring secure authentication, live dashboards, and incident reporting.', ARRAY['WEB APP', 'REACT', 'DJANGO'], 'GITHUB REPO', 'https://github.com/YoussefYoussefG/OR-Safety-Management-System-Operating-Room-QMS', 1),
        (mobile_id, 'QR Authentication System', 'Architected a secure login system utilizing UUID-based QR code generation for touchless authentication. Implemented real-time token validation to prevent session hijacking and unauthorized access.', ARRAY['MOBILE'], 'GITHUB REPO', '#', 2),
        (mobile_id, 'EchoPlay', 'A cross-platform mobile game that delivers a modern Truth or Dare experience with a clean interface, smooth performance, and engaging gameplay for social gatherings.', ARRAY['MOBILE'], 'GITHUB REPO', '#', 3);

    -- Insert Data Analytics Projects
    INSERT INTO public.projects (category_id, title, description, tags, link_text, link_url, sort_order) VALUES
        (data_id, 'HR Dashboard', 'Developed an interactive HR dashboard in Power BI to analyze workforce data, including employee distribution, promotions, retrenchment, and performance insights. The project involved transforming a raw dataset by using Split Column by Tab in Power Query.', ARRAY['DATA'], 'VIEW ANALYTICS', '#', 1),
        (data_id, 'E-Commerce Sales Dashboard', 'Developed an interactive E-commerce Sales Dashboard using Power BI to analyze key metrics including sales, profit, quantity, and shipping cost. Enabled dynamic insights across categories, markets, countries, and shipping modes.', ARRAY['DATA'], 'VIEW ANALYTICS', '#', 2),
        (data_id, 'ISP-Dashboard', 'Built an interactive ISP Power BI dashboard leveraging subscriber-level data to analyze customer segmentation, engagement, revenue optimization (ARPU), and network usage trends, supporting strategic and operational decisions.', ARRAY['DATA'], 'VIEW ANALYTICS', '#', 3);
END $$;
