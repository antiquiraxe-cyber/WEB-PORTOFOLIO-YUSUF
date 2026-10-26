export interface PortfolioItem {
  id: string;
  name: string;
  tags: string[];
  description: string;
  link: string;
  github?: string;
  isDeployed?: boolean;
  images: string[];
}

export interface ArchiveItem {
  id: string;
  year: string;
  name: string;
  tech: string[];
  link: string;
}
