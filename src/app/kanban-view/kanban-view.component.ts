import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kanban-view',
  templateUrl: './kanban-view.component.html',
  styleUrls: ['./kanban-view.component.css']
})
export class KanbanViewComponent implements OnInit {

  stages = [{
    id: 1,
    name: 'Backlog',
    cards: [],
  }, {
    id: 2,
    name: 'To Do',
    cards: [],
  }, {
    id: 3,
    name: 'Ongoing',
    cards: [],
  }, {
    id: 4,
    name: 'Done',
    cards: [],
  }];
  newCardName = '';
  selectedCardName = '';
  selectedStageIndex = -1;
  selectedCardId;
  constructor() { }

  ngOnInit() {
  }

  onAddCard() {
    this.newCardName = (document.getElementsByClassName('add_card_input')[0] as HTMLInputElement).value
    if(this.newCardName) {
      this.stages[0].cards.push({name: this.newCardName, id: this.stages[0].cards.length + 1, parentId: this.stages[0].id });
      (document.getElementsByClassName('add_card_input')[0] as HTMLInputElement).value = '';
    }
  }

  onCardselect(data: any) {
   (document.getElementsByClassName('selected_card_input')[0] as HTMLInputElement).value = data.name;
   this.selectedCardName = data.name;
   this.selectedCardId = data.id;
   this.selectedStageIndex = data.parentId - 1;

  }

  onMoveBackCard() {
    if(this.selectedStageIndex !== 0 && this.selectedStageIndex !== -1) {
      this.onDeleteCard(true);      
      this.stages[this.selectedStageIndex-1].cards.push(
        {name:this.selectedCardName, id: this.selectedCardId, parentId: this.selectedStageIndex}
      );
      this.selectedStageIndex = this.selectedStageIndex - 1;
    }
  }

  onMoveForwardCard() {
    if(this.selectedStageIndex !== 3 && this.selectedStageIndex !== -1) {
      this.onDeleteCard(true);      
      this.selectedStageIndex = this.selectedStageIndex + 1;
      this.stages[this.selectedStageIndex].cards.push(
        {name:this.selectedCardName, id: this.selectedCardId, parentId: this.selectedStageIndex+1}
      );
    }
  }

  onDeleteCard(dontResetValue?: boolean) {
    const stage = this.stages.find(s => s.id === this.selectedStageIndex);
    const index = this.stages[this.selectedStageIndex].cards.findIndex(s => s.id === this.selectedCardId);
    this.stages[this.selectedStageIndex].cards.splice(index,1);
    if(!dontResetValue) {
      (document.getElementsByClassName('selected_card_input')[0] as HTMLInputElement).value = '';
      this.selectedCardName = '';
      this.selectedStageIndex = -1;
      this.selectedCardId = '';
    }
  }

}
