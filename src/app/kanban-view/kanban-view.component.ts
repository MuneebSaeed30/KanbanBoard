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
      this.stages[0].cards.push({name: this.newCardName, id: this.stages[0].cards.length + 1, stageId: this.stages[0].id });
      (document.getElementsByClassName('add_card_input')[0] as HTMLInputElement).value = '';
    }
  }

  onCardselect(data: any) {
    const card = this.stages[data.stageId - 1].cards.find(s => s.id === data.cardId);
   (document.getElementsByClassName('selected_card_input')[0] as HTMLInputElement).value = card.name;
   this.selectedCardName = card.name;
   this.selectedCardId = card.id;
   this.selectedStageIndex = data.stageId - 1;
   this.enableOrDisableBtn();
  }

  onMoveBackCard() {
    if(this.selectedStageIndex !== 0 && this.selectedStageIndex !== -1) {
      this.onDeleteCard(true);      
      this.stages[this.selectedStageIndex-1].cards.push(
        {name:this.selectedCardName, id: this.selectedCardId, stageId: this.selectedStageIndex}
      );
      this.selectedStageIndex = this.selectedStageIndex - 1;
      this.enableOrDisableBtn();
    }
  }

  onMoveForwardCard() {
    if(this.selectedStageIndex !== 3 && this.selectedStageIndex !== -1) {
      this.onDeleteCard(true);      
      this.selectedStageIndex = this.selectedStageIndex + 1;
      this.enableOrDisableBtn();
      this.stages[this.selectedStageIndex].cards.push(
        {name:this.selectedCardName, id: this.selectedCardId, stageId: this.selectedStageIndex+1}
      );
    }
  }

  onDeleteCard(dontResetValue?: boolean) {
    const stage = this.stages.find(s => s.id === this.selectedStageIndex + 1);
    const index = this.stages[this.selectedStageIndex].cards.findIndex(s => s.id === this.selectedCardId);
    this.stages[this.selectedStageIndex].cards.splice(index,1);
    if(!dontResetValue) {
      (document.getElementsByClassName('selected_card_input')[0] as HTMLInputElement).value = '';
      this.selectedCardName = '';
      this.selectedStageIndex = -1;
      this.selectedCardId = '';
    }
  }

  enableOrDisableBtn() {
    (document.getElementById('forward') as HTMLInputElement).disabled = this.selectedStageIndex === 3 ? true : false;
    (document.getElementById('backward') as HTMLInputElement).disabled = this.selectedStageIndex === 0 ? true : false;
  }

}
