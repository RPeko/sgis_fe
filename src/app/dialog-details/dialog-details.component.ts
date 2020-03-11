import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-details',
  templateUrl: './dialog-details.component.html',
  styleUrls: ['./dialog-details.component.scss']
})
export class DialogDetailsComponent implements OnInit {
  detalji: Map<string, string> = new Map<string, string>();
  lista: { key: string, value: string }[] = [];
  displayedColumns: string[] = ['key', 'value'];

  constructor(public dialogRef: MatDialogRef<DialogDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string) {
    try {
      this.detalji = JSON.parse(data);
    } catch (e) {

    }
  }


  ngOnInit() {
    Object.keys(this.detalji).forEach(k => {
      this.lista.push({ key: k, value: this.detalji[k] });
    });

  }

}
