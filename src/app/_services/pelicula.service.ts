import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class PeliculaService {

	constructor(private http: HttpClient) { }

	getAll(): Observable<any> {
		return this.http.get<any>(`${environment.baseUrl}peliculas/indice`); // request options as second parameter
	}

	getAllActores(): Observable<any> {
		return this.http.get<any>(`${environment.baseUrl}actores/indice`);
	}

	create(data) {
		return this.http.put<any>(`${environment.baseUrl}peliculas/crear`, data)
		.pipe(
				map(response => {
					return response;
				}
				)
			)
	}

	edit(data): Observable<any>{
		return this.http.post<any>(`${environment.baseUrl}peliculas/editar/${data.id}`, data); // request options as second parameter
	}


	delete(id: Number): Observable<any> {
		return this.http.get<any>(`${environment.baseUrl}peliculas/eliminar/${id}`); // request options as second parameter
	}

  }
  