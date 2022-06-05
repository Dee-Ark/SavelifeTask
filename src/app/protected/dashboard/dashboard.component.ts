import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LOCALSTORAGE_TOKEN_KEY } from 'src/app/app.module';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { AuthService } from '../../public/services/auth-service/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  noteForm = new FormGroup({
    title: new FormControl(null, [Validators.required]),
    content: new FormControl(null, [Validators.required])
  },)
  displayedColumns = ['title', 'content', 'edit', 'delete'];
  dataSource: any;
  per_page = 10;
  total = 0;
  constructor(
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog

  ) {}

  ngOnInit() {
    this.GetAll(this.total, this.per_page)
  }

  logout() {
    // Removes the jwt token from the local storage, so the user gets logged out & then navigate back to the "public" routes
    localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
    this.router.navigate(['../../']);
  }

  addNote() {
    if (!this.noteForm.valid) {
      return;
    }
    this.authService.addNote(this.noteForm.value).pipe().subscribe();
  }

  edit(record: any) {
    this.noteForm.patchValue({
      title: record.title,
      content: record.content

    })
    
  }

  update() {
    if (!this.noteForm.valid) {
      return;
    }
    this.authService.update(this.noteForm.value).pipe().subscribe();
  }
  

  delete(id: any) {

    const dialogRef = this.dialog.open(DialogdeleteDialog, {
      width: '250px',
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.authService.delete(id).pipe().subscribe();
    });

    
  }

  GetAll(page: number, per_page: number) {
    this.authService.GetAll(page, per_page).pipe(
    ).subscribe((res) => {

      console.log(res)
      this.dataSource = res;
      console.log(res)
    });
  }

}


@Component({
  selector: 'deletedialog',
  templateUrl: 'deletedialog.html',
})
export class DialogdeleteDialog {
  constructor(public dialogRef: MatDialogRef<DialogdeleteDialog>) { }
}
