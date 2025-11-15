import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "../models/subject.model";

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private api = 'http://localhost:8081/api/subjects';

  constructor(private http: HttpClient) {}

  findAll() {
    return this.http.get<Subject[]>(this.api);
  }

  create(subject: Subject) {
    return this.http.post<Subject>(this.api, subject);
  }
}
