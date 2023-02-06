import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EntreService } from '../../service/entre.service';
import { Entre } from '../../model/entre';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators }
  from '@angular/forms';
  import jsPDF from 'jspdf';
  import html2canvas from 'html2canvas';
import { ConfirmDialogComponent } from 'src/app/confirmDialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-list-entre',
  templateUrl: './list-entre.component.html',
  styleUrls: ['./list-entre.component.scss']
})
export class ListEntreComponent {
  p: number = 1;
  entreListe: any;
  SearchText: string;
  constructor(private service: EntreService, private router: Router,private dialog: MatDialog,
    private toastr: ToastrService, public fb: FormBuilder,
    private datePipe: DatePipe) { }

  ngOnInit() {

    this.refreshListe();

  }
  refreshListe() {
    this.service.getAll().subscribe(
      response => { this.entreListe = response; }
    );

  }


  onDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Êtes-vous sûr de vouloir supprimer cet entre ?' }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.deleteAll(id)
          .subscribe(
            data => {
              console.log(data);
              this.toastr.warning(' données supprimées avec succès !');
              this.refreshListe();
            },
            error => console.log(error));
      }
    });
  }




  
  newComm() {
    this.service.choixmenu = "A"
    this.router.navigate(['/home/entre']);
  }

  onSelect(item: Entre) {
    this.service.formData = this.fb.group(Object.assign({}, item));
    this.service.choixmenu = "M"
    this.router.navigate(['/home/entre']);
    this.toastr.info("on select");
  }
  transformDate(date: any) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }
  public openPDF(): void {
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 10;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('entres.pdf');
    });
  }
}
