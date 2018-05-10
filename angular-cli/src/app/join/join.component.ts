import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {

  public form: FormGroup;

  @Output() onSubmit: EventEmitter<{ username: string, interest: string }> = new EventEmitter();

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.form = this._fb.group({
      username: new FormControl(null, Validators.required),
      interest: new FormControl(null, Validators.required),
    });
  }

  submit(): void {
    this.onSubmit.emit(this.form.value);
  }

}
