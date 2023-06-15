import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITodoItem } from 'src/app/interface/interface';
import ItemServiceService from 'src/app/Services/item-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.scss'],
})
export class TodoDialogComponent implements OnInit {
  @Input() showDialog!: boolean;
  @Output() onClose = new EventEmitter();

  @Input() inputForm!: FormGroup;
  @Output() onSubmit = new EventEmitter<FormGroup>();

  @Input() isEdit: boolean | undefined = false;

  @Input() idEdit!: number;
  disableSubmit = false;

  closeDialog() {
    this.onClose.emit();
  }

  constructor(
    private itemService: ItemServiceService,
    private fb: FormBuilder
  ) {
    this.inputForm = this.fb.group({
      itemName: ['', Validators.required],
      itemDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  private addItem(todo: FormGroup) {
    const newItem: ITodoItem = {
      content: todo.value.itemName,
      createdAt: todo.value.itemDate,
      status: false,
    };
    this.disableSubmit = true;
    this.itemService
      .addItem(newItem)
      .pipe(
        catchError((error) => {
          this.disableSubmit = false;
          throw error;
        })
      )
      .subscribe((data: any) => {
        this.inputForm.reset();
        this.disableSubmit = false;
      });
      this.isEdit = true;
  }

  private editItem(todo: FormGroup) {
    const newItem: ITodoItem = {
      content: todo.value.itemName,
      createdAt: todo.value.itemDate,
    };
    this.disableSubmit = true;
    this.itemService
      .update(this.idEdit, newItem)
      .pipe(
        catchError((error) => {
          this.disableSubmit = false;
          throw error;
        })
      )
      .subscribe((data) => {
        this.inputForm.reset();
        this.disableSubmit = false;
      });
      this.isEdit = false;
  }
  handledSubmit(todo: FormGroup) {
    this.onSubmit.emit(todo);
    if (this.isEdit) {
      this.editItem(todo);
    } else {
      this.addItem(todo);
    }
  }
}
