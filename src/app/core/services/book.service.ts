import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Book } from "../models/book.model";

@Injectable({ providedIn: 'root' })
export class BookService {
  private api = 'http://localhost:8081/api/books';

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<Book[]>(this.api);
  }

  findById(id: number) {
    return this.http.get<Book>(`${this.api}/${id}`);
  }

  create(book: Book) {
    return this.http.post<Book>(this.api, book);
  }

  update(id: number, book: Book) {
    return this.http.put<Book>(`${this.api}/${id}`, book);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}