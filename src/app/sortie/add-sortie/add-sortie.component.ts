import { Component } from '@angular/core';
import { Sortie } from 'src/app/model/sortie';
import { SortieService } from 'src/app/service/sortie.service';
import { DepartementService } from 'src/app/service/departement.service';
import { Detailsoperation} from '../../model/detailsoperation';
import { DetailsoperationService } from 'src/app/service/detailsoperation.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule,Validators }
from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import{AddDetailsComponent} from '../../sortie/add-details/add-details.component';
import { Router, ActivatedRoute  } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from "rxjs";
import { Departement } from 'src/app/model/departement';

@Component({
  selector: 'app-add-sortie',
  templateUrl: './add-sortie.component.html',
  styleUrls: ['./add-sortie.component.scss']
})
export class AddSortieComponent {
  DepartementList: Departement[];
  
  isValid:boolean = true;
  articleService: any;
  Date:any;
 
  departement   : any= {};

  constructor(public service:SortieService,
    public detailsoperationService:DetailsoperationService,
    private dialog:MatDialog,public fb: FormBuilder,
    public departementService :DepartementService,
    private toastr :ToastrService,
    private router :Router,
    private currentRoute: ActivatedRoute,
    private datePipe : DatePipe) { }
    get f() { return this.service.formData.controls }
    ngOnInit() {

      if (this.service.choixmenu == "A"){
       this.InfoForm();
       this.service.list = [];
       this.Date = this.transformDate(new Date(Date.now()));
      
       }
         else
       {
       //this.service.getData(this.service.formData.value.id).subscribe(res=> {
      // this.service.formData =this.fb.group(Object.assign({},res));
      // });
       this.detailsoperationService.getAll(this.service.formData.value.id).subscribe(
        response =>{this.service.list = response}
        );
       }
   
   this.departementService.getAll().subscribe(
     response =>{this.DepartementList = response;}
    );
     }
   
   
     
   
   
       
   InfoForm() {
       this.service.formData = this.fb.group({
         id :null,
         totart:0,
         qte:0,
         idDep : 0,
         libDep : '',
         dateOperation : '',
         refOperation : '',
         numeroOperation : '',
         detailsOperationsDTO :[],
         });
       } 
     
   resetForm() {
         this.service.formData.reset();
     }
   
   AddData(detailsOperationsDTOIndex:any,Id:any){  
       const dialogConfig = new MatDialogConfig();
       dialogConfig.autoFocus = true;
       dialogConfig.disableClose = true;
       dialogConfig.width="50%";
       dialogConfig.data={detailsOperationsDTOIndex,Id};
       this.dialog.open(AddDetailsComponent, dialogConfig).afterClosed().subscribe(b10=>{
         this.calcul();
       });
     }
   
     
   onDelete(item : Detailsoperation,Id:number,i:number){
       if(Id != null)
       this.service.formData.value.id+=Id ;
      this.service.list.splice(i,1);
      this.calcul();
      }
   
   calcul(){
     this.f['qte'].setValue(this.service.list.reduce((prev:any, curr:any) => {
       return prev + Number(curr.qte);
     }, 0));
     this.f['totart'].setValue(this.service.list.length, 0);   
      
   
      }
   validateForm(){
        this.isValid = true ;
       
        if(this.service.formData.value.idF==0)
        this.isValid =false;
       
        else if (this.service.list.length==0)
        this.isValid =false;
        return this.isValid;
      }
   
   onSubmit(){
       this.f['detailsOperationsDTO'].setValue(this.service.list);
         this.service.saveOrUpdate(this.service.formData.value).
         subscribe( data => {
           this.toastr.success( 'Validation Faite avec Success'); 
           this.router.navigate(['/home/sorties']);
         });
      }
     
   transformDate(date:any){
        return this.datePipe.transform(date, 'yyyy-MM-dd');
      }
      OnSelectClient(ctrl:any)
      {
         if(ctrl.selectedIndex == 0){
          this.f['libDep'].setValue('');
          this.f['idDep'].setValue('');
         }
         else{
            this.f['libDep'].setValue(this.DepartementList[ctrl.selectedIndex - 1].libDep);
            this.f['idDep'].setValue(this.DepartementList[ctrl.selectedIndex - 1].id);
         }
       }
}