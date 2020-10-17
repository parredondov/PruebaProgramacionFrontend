import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatTable, MatPaginator, MatTableDataSource } from '@angular/material';
import { PeliculaService } from 'src/app/_services/pelicula.service';
import { nuevaPeliculaDialogComponent } from './nueva-pelicula-dialog/nueva-pelicula-dialog.component';

@Component({
  selector: 'app-peliculas',
  templateUrl: './peliculas.component.html',
  styleUrls: ['./peliculas.component.scss'],
  providers :[PeliculaService]
})
export class PeliculasComponent implements OnInit {

  displayedColumns: string[] = [ 'titulo', 'anio', 'descripcion', 'reparto', 'action'];
  dataSource = new MatTableDataSource([]);;

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild('paginator2', { static: false }) paginator: MatPaginator;
  
  constructor(private peliculaService: PeliculaService, private formBuilder: FormBuilder, public dialog: MatDialog) { }

  ngOnInit() {
		this.peliculaService.getAll().subscribe((response) => {
			let data = response;
			data.forEach((element, index) => {
				data[index].actoresString = element.actores.map(x=>x.nombre).join(', ');
			});
			this.dataSource = new MatTableDataSource(data);
			setTimeout(() => this.dataSource.paginator = this.paginator);
		});
  }

	openDialog(action, obj) {
		const dialogRef = this.dialog.open(nuevaPeliculaDialogComponent, {
			width: '450px',
			data: {
				...obj,
				action
			},
			//disableClose : true
		});

		dialogRef.afterClosed().subscribe(result => {
			this.peliculaService.getAll().subscribe((response) => {
				let data = response;
				data.forEach((element, index) => {
					data[index].actoresString = element.actores.map(x=>x.nombre).join(', ');
				});
				this.dataSource = new MatTableDataSource(data);
				setTimeout(() => this.dataSource.paginator = this.paginator);
			});
		});
	}
}
