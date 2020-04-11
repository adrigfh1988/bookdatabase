import { IBook } from 'app/shared/model/book.model';

export interface IAuthor {
  id?: number;
  name?: string;
  lastName?: string;
  imageContentType?: string;
  image?: any;
  about?: string;
  books?: IBook[];
}

export class Author implements IAuthor {
  constructor(
    public id?: number,
    public name?: string,
    public lastName?: string,
    public imageContentType?: string,
    public image?: any,
    public about?: string,
    public books?: IBook[]
  ) {}
}
