import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITodoItem } from 'src/app/interface/interface';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
})
export class TodoItemComponent implements OnInit {
  @Input() items!: ITodoItem;
  @Output() handleEdit = new EventEmitter<number>();
  @Output() handleDelete = new EventEmitter<number>();
  @Output() handleStatus = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  editItem() {
    this.handleEdit.emit(this.items.id);
  }

  deleteItem() {
    const result = confirm('Bạn có muốn xoá nó không ?');
    if (result == true) {
      this.handleDelete.emit(this.items.id);
    }
  }

  updateStatus() {
    this.handleStatus.emit(this.items.id);
  }

  getStatusText(itemType: boolean | undefined): string {
    return itemType ? 'Completed' : 'Active';
  }
}
