import { Routes } from '@angular/router';
import { BookFormComponent } from './pages/book-form/book-form.component';
import { BooksListComponent } from './pages/books-list/books-list.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'books', component: BooksListComponent },
	{ path: 'books/new', component: BookFormComponent },
	{ path: 'books/edit/:id', component: BookFormComponent },
	{ path: '**', redirectTo: '' }
];
