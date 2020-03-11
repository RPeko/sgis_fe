import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-legend',
  templateUrl: './dialog-legend.component.html',
  styleUrls: ['./dialog-legend.component.scss']
})
export class DialogLegendComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<DialogLegendComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  nePrikazuj() {
    this.dialogRef.close(false);
  }
}
