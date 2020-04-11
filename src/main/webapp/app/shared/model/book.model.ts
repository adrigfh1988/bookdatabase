import { Moment } from 'moment';
import { IAuthor } from 'app/shared/model/author.model';
import { TypeOfBook } from 'app/shared/model/enumerations/type-of-book.model';

export interface IBook {
  id?: number;
  iSBN?: string;
  name?: string;
  typeOfBook?: TypeOfBook;
  description?: string;
  publicationDate?: Moment;
  authors?: IAuthor[];
}

export class Book implements IBook {
  constructor(
    public id?: number,
    public iSBN?: string,
    public name?: string,
    public typeOfBook?: TypeOfBook,
    public description?: string,
    public publicationDate?: Moment,
    public authors?: IAuthor[]
  ) {}
}
