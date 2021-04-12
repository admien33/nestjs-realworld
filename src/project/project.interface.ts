import { UserData } from '../user/user.interface';
import { ProjectEntity } from './project.entity';
interface File {
  body: string;
}

interface ProjectData {
  slug: string;
  title: string;
  description: string;
  body?: string;
  tagList?: string[];
  createdAt?: Date
  updatedAt?: Date
  // favorited?: boolean;
  // favoritesCount?: number;
  owner?: UserData;
}

export interface FilesRO {
  files: File[];
}

export interface ProjectRO {
  project: ProjectEntity;
}

export interface ProjectsRO {
  projects: ProjectEntity[];
  projectsCount: number;
}

