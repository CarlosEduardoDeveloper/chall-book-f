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
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [FormsModule, RouterLink, NgFor, NgIf],
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
  priceDisplay = '';

  authorFilter = '';
  filteredAuthors: Author[] = [];
  showAuthorDropdown = false;

  subjectFilter = '';
  filteredSubjects: Subject[] = [];
  showSubjectDropdown = false;

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
      this.filteredAuthors = a;
      this.cdr.markForCheck();
    });
    this.subjectService.findAll().subscribe(s => {
      this.subjects = s;
      this.filteredSubjects = s;
      this.cdr.markForCheck();
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.isEdit = true;
      this.bookService.findById(this.id).subscribe(res => {
        this.book = res;
        this.priceDisplay = this.book.price != null ? this.formatPriceDisplay(this.book.price) : '';
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

  private formatPriceDisplay(value: number): string {
    try {
      return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } catch {
      return value.toFixed(2);
    }
  }

  onPriceInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value || '';
    this.priceDisplay = raw;

    const normalized = raw.replace(/\./g, '').replace(/,/g, '.').replace(/[^0-9.\-]/g, '');
    const num = parseFloat(normalized);
    if (!isNaN(num)) {
      this.book.price = num;
    } else {
      this.book.price = 0;
    }
  }

  onPriceBlur(): void {
    if (this.book.price != null) {
      this.priceDisplay = 'R$ ' + this.formatPriceDisplay(this.book.price);
    }
    this.cdr.markForCheck();
  }

  onPriceFocus(): void {
    const raw = this.book.price != null ? String(this.book.price).replace('.', ',') : '';
    this.priceDisplay = raw.replace(/R\$\s?/, '');
  }

  onAuthorFilterChange(filter: string): void {
    this.authorFilter = filter;
    this.filteredAuthors = this.authors.filter(a =>
      a.name.toLowerCase().includes(filter.toLowerCase())
    );
    this.cdr.markForCheck();
  }

  selectAuthor(author: Author): void {
    if (!this.book.authors.find(a => a.id === author.id)) {
      this.book.authors.push(author);
    }
    this.authorFilter = '';
    this.filteredAuthors = this.authors;
    this.showAuthorDropdown = false;
    this.cdr.markForCheck();
  }

  removeAuthor(author: Author): void {
    this.book.authors = this.book.authors.filter(a => a.id !== author.id);
    this.cdr.markForCheck();
  }

  onSubjectFilterChange(filter: string): void {
    this.subjectFilter = filter;
    this.filteredSubjects = this.subjects.filter(s =>
      s.description.toLowerCase().includes(filter.toLowerCase())
    );
    this.cdr.markForCheck();
  }

  selectSubject(subject: Subject): void {
    if (!this.book.subjects.find(s => s.id === subject.id)) {
      this.book.subjects.push(subject);
    }
    this.subjectFilter = '';
    this.filteredSubjects = this.subjects;
    this.showSubjectDropdown = false;
    this.cdr.markForCheck();
  }

  removeSubject(subject: Subject): void {
    this.book.subjects = this.book.subjects.filter(s => s.id !== subject.id);
    this.cdr.markForCheck();
  }
}
