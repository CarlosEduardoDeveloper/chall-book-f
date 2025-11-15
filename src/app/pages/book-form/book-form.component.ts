import { Component, ChangeDetectorRef } from "@angular/core";
import { Book } from "../../core/models/book.model";
import { Author } from "../../core/models/author.model";
import { Subject } from "../../core/models/subject.model";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthorService } from "../../core/services/author.service";
import { BookService } from "../../core/services/book.service";
import { SubjectService } from "../../core/services/subject.service";
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [FormsModule, RouterLink, NgFor],
  templateUrl: './book-form.component.html'
})
export class BookFormComponent {

  book: Book = {
    title: '',
    publisher: '',
    edition: 1,
    publicationYear: '',
    price: 0,
    authors: [],
    subjects: []
  };

  authors: Author[] = [];
  subjects: Subject[] = [];

  isEdit = false;
  id?: number;

  newAuthorName = '';
  newSubjectDescription = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private authorService: AuthorService,
    private subjectService: SubjectService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authorService.findAll().subscribe(a => {
      this.authors = a;
      this.cdr.markForCheck();
    });
    this.subjectService.findAll().subscribe(s => {
      this.subjects = s;
      this.cdr.markForCheck();
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEdit = true;
      this.bookService.findById(this.id).subscribe(res => {
        this.book = res;
        this.cdr.markForCheck();
      });
    }
  }

  save(): void {
    const bookPayload = {
      ...this.book,
      authorIds: this.book.authors.map(a => a.id!),
      subjectIds: this.book.subjects.map(s => s.id!),
      authors: undefined,
      subjects: undefined
    };

    if (this.isEdit) {
      this.bookService.update(this.id!, bookPayload as any)
        .subscribe(() => this.router.navigate(['/books']));
    } else {
      this.bookService.create(bookPayload as any)
        .subscribe(() => this.router.navigate(['/books']));
    }
  }

  addAuthor(): void {
    if (!this.newAuthorName.trim()) return;

    const newAuthor: Author = {
      name: this.newAuthorName.trim()
    };

    this.authorService.create(newAuthor).subscribe(author => {
      this.authors.push(author);
      this.book.authors.push(author);
      this.newAuthorName = '';
      this.cdr.markForCheck();
    });
  }

  addSubject(): void {
    if (!this.newSubjectDescription.trim()) return;

    const newSubject: Subject = {
      description: this.newSubjectDescription.trim()
    };

    this.subjectService.create(newSubject).subscribe(subject => {
      this.subjects.push(subject);
      this.book.subjects.push(subject);
      this.newSubjectDescription = '';
      this.cdr.markForCheck();
    });
  }
}
