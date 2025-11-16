import { Component, ChangeDetectorRef } from "@angular/core";
import { Book } from "../../core/models/book.model";
import { BookService } from "../../core/services/book.service";
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from "@angular/router";
import { Author } from "../../core/models/author.model";
import { Subject } from "../../core/models/subject.model";
import { API_BASE } from '../../core/config/api.config';

@Component({
    selector: 'app-books-list',
    standalone: true,
    imports: [NgFor, NgIf, CurrencyPipe, RouterLink],
    templateUrl: './books-list.component.html'
})
export class BooksListComponent  {

    books: Book[] = [];
    loading = true;
    downloading = false;
    downloadUrl = `${API_BASE}download/reports/books-by-author`;

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

    downloadReport() {
        this.downloading = true;
        this.service.downloadReport().subscribe({
            next: (blob: Blob) => {
                const filename = `books-report.pdf`;
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                this.downloading = false;
                this.cdr.markForCheck();
            },
            error: (err) => {
                console.error('Download error', err);
                alert('Erro ao gerar o relatório.');
                this.downloading = false;
                this.cdr.markForCheck();
            }
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
