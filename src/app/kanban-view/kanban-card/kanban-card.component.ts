import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-kanban-card',
  templateUrl: './kanban-card.component.html',
  styleUrls: ['./kanban-card.component.css']
})
export class KanbanCardComponent implements OnInit {
  @Input() card: object;
  @Output() onCardSelected: EventEmitter<Object> = new EventEmitter<Object>();

  constructor() { }

  ngOnInit() {
    console.log(this.card)
  }

  onCardSelect(data) {
    console.log(data)
    this.onCardSelected.emit(data);
  }
}
