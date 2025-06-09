
export interface ContentType {
  id: string;
  name: string;
  icon: string;
  fields: ContentField[];
}

export interface ContentField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'textarea';
  required: boolean;
  options?: string[]; // For select fields
}

export interface LifeBlockContent {
  id: string;
  contentTypeId: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomLifeBlock {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  contentTypes: ContentType[];
  contents: LifeBlockContent[];
  createdAt: Date;
  updatedAt: Date;
}
