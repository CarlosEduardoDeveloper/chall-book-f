import { HttpClient } from "@angular/common/http";
import { Author } from "../models/author.model";
import { Injectable } from "@angular/core";
import { API_BASE } from "../config/api.config";

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private api = `${API_BASE}authors`;

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<Author[]>(this.api);
  }

  create(author: Author) {
    return this.http.post<Author>(this.api, author);
  }
}
