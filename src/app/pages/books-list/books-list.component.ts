import { Component, ChangeDetectorRef } from "@angular/core";
import { Book } from "../../core/models/book.model";
import { BookService } from "../../core/services/book.service";
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from "@angular/router";
import { Author } from "../../core/models/author.model";
import { Subject } from "../../core/models/subject.model";

@Component({
    selector: 'app-books-list',
    standalone: true,
    imports: [NgFor, NgIf, CurrencyPipe, RouterLink],
    templateUrl: './books-list.component.html'
})
export class BooksListComponent  {

    books: Book[] = [];
    loading = true;

    constructor(private service: BookService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.loading = true;
        this.service.findAll().subscribe(res => {
            this.books = res;
            this.loading = false;
            this.cdr.markForCheck();
        });
    }

    delete(id: number): void {
        if (!confirm('Deseja realmente excluir este livro?')) return;

        this.service.delete(id).subscribe(() => this.load());
    }

    formatAuthors(authors: Author[]): string {
        return authors?.map(a => a.name).join(', ') ?? '';
    }

    formatSubjects(subjects: Subject[]): string {
        return subjects?.map(s => s.description).join(', ') ?? '';
    }

}
