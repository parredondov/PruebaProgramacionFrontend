import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, Inject, Optional, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PeliculaService } from 'src/app/_services/pelicula.service';

export interface PeliculaData {
  id: number;
  name: string;
}

@Component({
  selector: 'app-nueva-pelicula-dialog',
  templateUrl: './nueva-pelicula-dialog.component.html',
  styleUrls: ['./nueva-pelicula-dialog.component.scss']
})
export class nuevaPeliculaDialogComponent {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  actoresFiltrados: Observable<string[]>;
  actores: string[];
  actoresTodos: string[];

  action:string;
  local_data:any;
  formGroup: FormGroup;
  titleAlert: string = '* Este campo es requerido';
  post: any = '';
  response:string;

  showSpinner: boolean;
  
  @ViewChild('actorInput', {static: false}) actorInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  constructor(
    public dialogRef: MatDialogRef<nuevaPeliculaDialogComponent>, private formBuilder: FormBuilder,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: PeliculaData, private peliculaService: PeliculaService, private router: Router, private authenticationService: AuthenticationService) {
    this.local_data = {...data};
    this.action = this.local_data.action;

    this.actores = [];
    
    this.createForm();

    this.peliculaService.getAllActores().subscribe((response) => {
      this.actoresTodos = response.map(x => x.nombre);

    
      this.actoresFiltrados = this.formGroup.controls['actores'].valueChanges.pipe(
        startWith(null),
        map((actor: string | null) => actor ? this._filter(actor) : this.actoresTodos.slice()));
      this.formGroup.controls['anio'].valueChanges.pipe(
        startWith(null),
        map(anio => {
          if(isNaN(anio)){
            this.formGroup.controls['anio'].setErrors({valido: true});
          }})
      );
    });

    // this.setChangeValidate();
  }

  ngOnInit() {
  }

  doAction(){

    //this.dialogRef.close({event:this.action,data:this.local_data});
    this.dialogRef.close();
  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }



  createForm() {
    this.formGroup = this.formBuilder.group({
      'titulo': [this.action === 'Editar' ? this.local_data.titulo : null, Validators.required],
      'descripcion': [this.action === 'Editar' ? this.local_data.descripcion : null, Validators.required],
      'anio': [this.action === 'Editar' ? this.local_data.anio : null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)])],
      'actores': [null , Validators.required],
      'validate': ''
    });
    this.actores = this.action === 'Editar' ? this.local_data.actores.map(x=>x.nombre) : []
  }

  // setChangeValidate() {
  //   this.formGroup.get('validate').valueChanges.subscribe(
  //     (validate) => {
  //       this.formGroup.get('name').setValidators(Validators.required);
  //       this.formGroup.get('name').updateValueAndValidity();
  //     }
  //   )
  // }

  get name() {
    return this.formGroup.get('name') as FormControl
  }

  onSubmitNew(newUser){
    //Depending of action, call url service.
    if(this.action === 'Nuevo'){
      this.createNewUser(newUser);
    }else if(this.action === 'Editar'){
      this.editUser(newUser);
    }
  }

  onSubmitDelete(){
    this.peliculaService.delete(this.local_data.id).subscribe(response => {
      //console.log(response);
      this.dialogRef.close();
    });
  }


  createNewUser(data) {
    let body = {
			"titulo": data.titulo,
			"descripcion": data.descripcion,
			"anio": data.anio,
			"actores": this.actores
    }

    this.peliculaService.create(body).subscribe( response =>{
      console.log(response);
      this.dialogRef.close();
    });
  }


  editUser(data){
    
    let body = {
      "id": this.local_data.id,
			"titulo": data.titulo,
			"descripcion": data.descripcion,
			"anio": data.anio,
			"actores": this.actores
    }

    this.peliculaService.edit(body).subscribe( response =>{
      console.log(response);
      this.dialogRef.close();
    });

  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.actores.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.formGroup.controls['actores'].setValue(" ");
  }

  remove(fruit: string): void {
    const index = this.actores.indexOf(fruit);

    if (index >= 0) {
      this.actores.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.actores.push(event.option.viewValue);
    this.actorInput.nativeElement.value = '';
    this.formGroup.controls['actores'].setValue(" ");
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.actoresTodos.filter(actor => actor.toLowerCase().indexOf(filterValue) === 0);
  }
}
