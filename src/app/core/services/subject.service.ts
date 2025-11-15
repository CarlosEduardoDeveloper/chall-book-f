import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "../models/subject.model";
import { API_BASE } from "../config/api.config";

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private api = `${API_BASE}subjects`;

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<Subject[]>(this.api);
  }

  create(subject: Subject) {
    return this.http.post<Subject>(this.api, subject);
  }
}
