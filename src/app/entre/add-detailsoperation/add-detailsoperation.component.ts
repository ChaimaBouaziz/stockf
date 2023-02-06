import { Component, OnInit, Inject } from '@angular/core';
import { Article } from '../../model/article';
import {MatDialog, MatDialogConfig, MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { ArticleService } from '../../service/article.service';
import { NgForm } from '@angular/forms';
import { Detailsoperation } from '../../model/detailsoperation';
import { EntreService } from '../../service/entre.service';
import { DetailsoperationService } from '../../service/detailsoperation.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule,Validators }
from '@angular/forms';

@Component({
  selector: 'app-add-detailsoperation',
  templateUrl: './add-detailsoperation.component.html',
  styleUrls: ['./add-detailsoperation.component.scss']
})
export class AddDetailsoperationComponent {
  Operationid: number;
  formData: FormGroup;
  articleList:Article[];
  isValid:boolean=true;
  constructor( public service:DetailsoperationService,private toastr :ToastrService,
    @Inject(MAT_DIALOG_DATA)  public data :any,
    public dialogRef:MatDialogRef<AddDetailsoperationComponent>,
    private articleService:ArticleService, 
    private entreService:EntreService,public fb: FormBuilder){
      this.Operationid = this.data.operationId;
    }
    get f() { return this.formData.controls; }

    ngOnInit() {
      if(this.data.detailsOperationsDTOIndex==null)
      {
        this.InfoForm();
      }
      else 
      {
       this.formData =this.fb.group(Object.assign({},this.entreService.list[this.data.detailsOperationsDTOIndex]));
      }
     this.articleService.getAll().subscribe(
        response =>{this.articleList= response;
      
        }
       );
    
  }
  
  
  
  InfoForm() {
    this.formData = this.fb.group({
        id: null,
        qte : 0,
        idArticle:0,
        operationId : this.Operationid ,
      });
    } 
  
 
  

    onSubmit() {
      let referenceExists = false;
      let existingIndex = -1;
      for (let i = 0; i < this.entreService.list.length; i++) {
          if (this.entreService.list[i].reference === this.formData.value.idArticle) {
              referenceExists = true;
              existingIndex = i;
              break;
          }
      }
      if (referenceExists) {
          this.entreService.list[existingIndex].qte += this.formData.value.qte;
          this.toastr.info ("La référence existe déjà, la quantité est incrémentée !");
      } else {
          this.entreService.list.push(this.formData.value);
          this.toastr.success("La référence est ajoutée à la liste !");
      }
    
      this.dialogRef.close();
  }
  validateForm(formData:Detailsoperation){
    this.isValid=true;
    if(formData.libelle=='')
      this.isValid=false;
      else if(formData.qte ==0)
      this.isValid=false;
      return this.isValid;
  }
  }