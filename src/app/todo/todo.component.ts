import { Component, OnInit } from '@angular/core';
import { ITodoItem } from 'src/app/interface/interface';
import ItemServiceService from '../Services/item-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Filter } from 'src/enum/enum';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  enumFilter = Filter;
  selectedFilter: string = Filter.all;
  showDialog: boolean = false;
  inputForm: FormGroup;
  isEdit: boolean | undefined = false;
  disableSubmit = false;

  private showItem: ITodoItem[] = [];
  idEdit!: number;

  constructor(
    private itemService: ItemServiceService,
    private fb: FormBuilder
  ) {
    this.inputForm = this.fb.group({
      itemName: ['', Validators.required],
      itemDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getItem();
  }

  private getItem() {
    this.itemService.getItem().subscribe((data) => {
      this.showItem = data;
    });
  }

  filter(filterValue: string) {
    this.selectedFilter = filterValue;
  }

  get filterTodo() {
    if (this.selectedFilter === Filter.active) {
      return this.showItem.filter((item) => {
        return !item.status;
      });
    }

    if (this.selectedFilter === Filter.completed) {
      return this.showItem.filter((item) => {
        return item.status;
      });
    }
    return this.showItem;
  }

  // Mở dialog
  add() {
    this.showDialog = true;
  }

  close() {
    this.showDialog = false;
    this.isEdit = false;
    this.inputForm.setValue({
      itemName: '',
      itemDate: '',
    });
  }

  edit(id: number) {
    this.showDialog = true;

    this.isEdit = true;

    this.idEdit = id;

    this.itemService.callInfo(id).subscribe((data) => {
      this.inputForm.setValue({
        itemName: data.content,
        itemDate: data.createdAt,
      });
    });
  }

  clickStatus(id: number) {
    const item = this.showItem.find((data) => data.id === id);
    if (item) {
      item.status = !item.status;
      this.itemService.callInfo(id).subscribe((data) => {
        this.isEdit = !data.status;
        const statusItem = { status: this.isEdit };
        this.itemService.updateStatus(id, statusItem).subscribe(() => {});
      });
    }
  }

  delete(idDelete: number) {
    this.itemService.deleteItem(idDelete).subscribe(() => {
      this.getItem();
    });
  }

  submitForm(todo: FormGroup) {
    this.disableSubmit = true;
    this.itemService.getItem().subscribe((data) => {
      this.getItem();
    });
    this.showDialog = false;
  }
}
