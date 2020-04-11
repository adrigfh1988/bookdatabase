import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IBook, Book } from 'app/shared/model/book.model';
import { BookService } from './book.service';
import { IAuthor } from 'app/shared/model/author.model';
import { AuthorService } from 'app/entities/author/author.service';

@Component({
  selector: 'jhi-book-update',
  templateUrl: './book-update.component.html'
})
export class BookUpdateComponent implements OnInit {
  isSaving = false;
  authors: IAuthor[] = [];

  editForm = this.fb.group({
    id: [],
    iSBN: [null, [Validators.required]],
    name: [null, [Validators.required]],
    typeOfBook: [],
    description: [],
    publicationDate: [],
    authors: []
  });

  constructor(
    protected bookService: BookService,
    protected authorService: AuthorService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ book }) => {
      if (!book.id) {
        const today = moment().startOf('day');
        book.publicationDate = today;
      }

      this.updateForm(book);

      this.authorService.query().subscribe((res: HttpResponse<IAuthor[]>) => (this.authors = res.body || []));
    });
  }

  updateForm(book: IBook): void {
    this.editForm.patchValue({
      id: book.id,
      iSBN: book.iSBN,
      name: book.name,
      typeOfBook: book.typeOfBook,
      description: book.description,
      publicationDate: book.publicationDate ? book.publicationDate.format(DATE_TIME_FORMAT) : null,
      authors: book.authors
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const book = this.createFromForm();
    if (book.id !== undefined) {
      this.subscribeToSaveResponse(this.bookService.update(book));
    } else {
      this.subscribeToSaveResponse(this.bookService.create(book));
    }
  }

  private createFromForm(): IBook {
    return {
      ...new Book(),
      id: this.editForm.get(['id'])!.value,
      iSBN: this.editForm.get(['iSBN'])!.value,
      name: this.editForm.get(['name'])!.value,
      typeOfBook: this.editForm.get(['typeOfBook'])!.value,
      description: this.editForm.get(['description'])!.value,
      publicationDate: this.editForm.get(['publicationDate'])!.value
        ? moment(this.editForm.get(['publicationDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      authors: this.editForm.get(['authors'])!.value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBook>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: IAuthor): any {
    return item.id;
  }

  getSelected(selectedVals: IAuthor[], option: IAuthor): IAuthor {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
