import { Author } from './author.model';
import { Subject } from './subject.model';

export interface Book {
  id?: number;
  title: string;
  publisher: string;
  edition?: number;
  publicationYear?: string;
  price?: number;
  authors: Author[];
  subjects: Subject[];
}