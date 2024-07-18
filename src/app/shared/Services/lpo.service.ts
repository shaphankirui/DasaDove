import { Injectable } from '@angular/core';
import { LpoInterface } from '../interfaces/lpo.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../Environments/environments';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class LpoService {
  private apiUrl: string;
  savedOrg: string | null;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.savedOrg = this.localStorageService.getSavedOrgId();
    this.apiUrl = `${environment.apiRootUrl}lpo`;
  }

  getAllLpo(): Observable<LpoInterface[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<LpoInterface[]>(url);
  }

  addLpo(lpoInterface: LpoInterface): Observable<LpoInterface> {
    const url = `${this.apiUrl}`;
    return this.http.post<LpoInterface>(url, lpoInterface);
  }

  getLpoId(id: number): Observable<LpoInterface> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<LpoInterface>(url);
  }

  updateLpo(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteLpo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
