import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { KanbanViewComponent } from './kanban-view.component';
import { KanbanStageComponent } from './kanban-stage/kanban-stage.component';
import { FormsModule } from '@angular/forms';
import { KanbanCardComponent } from './kanban-card/kanban-card.component';
import { ChangeDetectionStrategy, NgZone } from '@angular/core';

describe('KanbanViewComponent', () => {
    let component: KanbanViewComponent;
    let fixture: ComponentFixture<KanbanViewComponent>;
    let ngZone;
    let stages,
        cards,
        kanbanControls,
        selectedInput,
        cardMoveBackBtn,
        cardMoveForwardBtn,
        cardDeleteBtn,
        addCardInput,
        addCardBtn;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [KanbanViewComponent, KanbanStageComponent, KanbanCardComponent]
        })
            .compileComponents();
    }));
    beforeEach(inject([NgZone], (injectedNgZone: NgZone) => {
        ngZone = injectedNgZone;
    }));
    beforeEach(() => {
        // ngZone = injectedNgZone;
        fixture = TestBed.createComponent(KanbanViewComponent);
        component = fixture.componentInstance;
        component.stages = [{
            id: 1,
            name: 'Backlog',
            cards: [{
                name: 'Add drag and drop feature',
                id: 1
            }, {
                name: 'UI redesign',
                id: 2
            }],
        }, {
            id: 2,
            name: 'To Do',
            cards: [{
                name: 'Resolve a merge conflict',
                id: 1
            }, {
                name: 'Improve performance of sale APP',
                id: 2
            }, {
                name: 'Improve performance of CRM APP',
                id: 3
            }, {
                name: 'Improve performance of Leave APP',
                id: 4
            }],
        }, {
            id: 3,
            name: 'Ongoing',
            cards: [{
                name: 'Bug Fixing #20',
                id: 1
            }],
        }, {
            id: 4,
            name: 'Done',
            cards: [{
                name: 'Bug Fixing #1',
                id: 1
            }],
        }];
        fixture.detectChanges();
        stages = fixture.nativeElement.querySelectorAll('.kanban_view .kanban_stage');
        cards = fixture.nativeElement.querySelectorAll('.kanban_view .kanban_card');
        kanbanControls = fixture.nativeElement.querySelectorAll('.kanban_view .kanban_controls');
        addCardInput = kanbanControls[0].querySelectorAll('.add_card input');
        addCardBtn = kanbanControls[0].querySelectorAll('.add_card_btn');
        selectedInput = kanbanControls[0].querySelectorAll('.edit_card .selected_card_input'),
            cardMoveBackBtn = kanbanControls[0].querySelectorAll('.edit_card .card_move_back_btn'),
            cardMoveForwardBtn = kanbanControls[0].querySelectorAll('.edit_card .card_forward_back_btn'),
            cardDeleteBtn = kanbanControls[0].querySelectorAll('.edit_card .card_delete_back_btn');

    });

    it("Clicking on any card should display the name in textbox.", () => {
        ngZone.run(() => {
            let firstCard = stages[0].querySelectorAll('.kanban_card');
            firstCard[0].click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(cardMoveBackBtn[0].hasAttribute('disabled')).toBeTruthy('Move back button should be disabled as it is first stage');
                expect(cardMoveForwardBtn[0].hasAttribute('disabled')).toBeFalsy('Move forward button should be enabled as it is first stage');
                expect(cardDeleteBtn[0].hasAttribute('disabled')).toBeFalsy('Delete button should be enabled');
                expect(selectedInput[0].value).toBe(firstCard[0].innerText, "Selected card's content should come in input");
                // select first card of second stage
                firstCard = stages[1].querySelectorAll('.kanban_card');
                firstCard[0].click();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(cardMoveBackBtn[0].hasAttribute('disabled')).toBeFalsy('Move back button should be enabled as it is second stage');
                    expect(cardMoveForwardBtn[0].hasAttribute('disabled')).toBeFalsy('Move forward button should be enabled as it is second stage');
                    expect(cardDeleteBtn[0].hasAttribute('disabled')).toBeFalsy('Delete button should be enabled');
                    expect(selectedInput[0].value).toBe(firstCard[0].innerText, "Selected card's content should come in input");
                });
            });
        });
    });

    it('Once the card selected based on current stage able to move forward', () => {
        // Select first card of third stage
        const currentStage = stages[2];
        const nextStage = stages[3];
        const card = {
            currentStage: currentStage.querySelectorAll('.kanban_card'),
        }
        const oldCardLength = {
            nextStage: nextStage.querySelectorAll('.kanban_card').length,
            currentStage: currentStage.querySelectorAll('.kanban_card').length
        }
        card.currentStage[0].click();
        fixture.detectChanges();
        cardMoveForwardBtn[0].click();
        fixture.detectChanges();
        expect(cardMoveForwardBtn[0].hasAttribute('disabled'))
            .toBeTruthy('Move forward button should be disabled as selected card is in last stage now');
        expect(nextStage.querySelectorAll('.kanban_card').length)
            .toBe(oldCardLength.nextStage + 1, 'After move in 4th stage there should be 1 card present.');
        expect(currentStage.querySelectorAll('.kanban_card').length)
            .toBe(oldCardLength.currentStage - 1, 'After move in 3rd stage 1 card should be removed.');
    });

    it('Once the card selected based on current stage able to move Backward.', () => {
        // Select first card of second stage
        const currentStage = stages[1];
        const preStage = stages[0];
        const card = {
            currentStage: currentStage.querySelectorAll('.kanban_card'),
        }
        const oldCardLength = {
            preStage: preStage.querySelectorAll('.kanban_card').length,
            currentStage: currentStage.querySelectorAll('.kanban_card').length
        }
        card.currentStage[0].click();
        fixture.detectChanges();
        cardMoveBackBtn[0].click();
        fixture.detectChanges();
        expect(cardMoveBackBtn[0].hasAttribute('disabled'))
            .toBeTruthy('Move Back button should be disabled as selected card is in last stage now');
        expect(preStage.querySelectorAll('.kanban_card').length)
            .toBe(oldCardLength.preStage + 1, 'After move in 4th stage there should be 1 card present.');
        expect(currentStage.querySelectorAll('.kanban_card').length)
            .toBe(oldCardLength.currentStage - 1, 'After move in 3rd stage 1 card should be removed.');
    });

    it('If the card/task selected from the 1st stage should disable the "Move Backward" button.', () => {
        ngZone.run(() => {
            let firstCard = stages[0].querySelectorAll('.kanban_card');
            firstCard[0].click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(cardMoveBackBtn[0].hasAttribute('disabled')).toBeTruthy('Move back button should be disabled as it is first stage');
                expect(cardMoveForwardBtn[0].hasAttribute('disabled'))
                    .toBeFalsy('Move forward button should be enabled as it is first stage');
                expect(cardDeleteBtn[0].hasAttribute('disabled')).toBeFalsy('Delete button should be enabled');
                expect(selectedInput[0].value).toBe(firstCard[0].innerText, 'Selected card content should come in input');
                // select first card of second stage
                firstCard = stages[1].querySelectorAll('.kanban_card');
                firstCard[0].click();
                fixture.detectChanges();
                fixture.whenStable().then(() => {
                    expect(cardMoveBackBtn[0].hasAttribute('disabled'))
                        .toBeFalsy('Move back button should be enabled as it is second stage');
                    expect(cardMoveForwardBtn[0].hasAttribute('disabled'))
                        .toBeFalsy('Move forward button should be enabled as it is second stage');
                    expect(cardDeleteBtn[0].hasAttribute('disabled')).toBeFalsy('Delete button should be enabled');
                    expect(selectedInput[0].value).toBe(firstCard[0].innerText, 'Selected card content should come in input');
                });
            });
        });
    });

    it('If the card/task selected from the last stage should disable the "Move Forward" button.', () => {
        ngZone.run(() => {
            const card = stages[stages.length - 1].querySelectorAll('.kanban_card');
            card[0].click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                expect(cardMoveForwardBtn[0].hasAttribute('disabled'))
                    .toBeTruthy('Move forward button should be disabled as it is last stage');
                expect(cardMoveBackBtn[0].hasAttribute('disabled'))
                    .toBeFalsy('Move back button should be enabled as it is last stage');
                expect(cardDeleteBtn[0].hasAttribute('disabled'))
                    .toBeFalsy('Delete button should be enabled');
                expect(selectedInput[0].value).toBe(card[0].innerText, 'Selected card content should come in input');
            });
        });
    });

    it('After selecting task from 2nd stage and clicking on Move Forward move card to 3rd stage', () => {
        // Select first card of third stage
        const currentStage = stages[1];
        const nextStage = stages[2];
        const card = {
            currentStage: currentStage.querySelectorAll('.kanban_card'),
        }
        const oldCardLength = {
            nextStage: nextStage.querySelectorAll('.kanban_card').length,
            currentStage: currentStage.querySelectorAll('.kanban_card').length
        }
        card.currentStage[0].click();
        fixture.detectChanges();
        cardMoveForwardBtn[0].click();
        fixture.detectChanges();
        expect(nextStage.querySelectorAll('.kanban_card').length)
            .toBe(oldCardLength.nextStage + 1, 'After move in 4th stage there should be 1 card present.');
        expect(currentStage.querySelectorAll('.kanban_card').length)
            .toBe(oldCardLength.currentStage - 1, 'After move in 3rd stage 1 card should be removed.');
    });

    it('After selecting task from 2nd stage and clicking on Move Backward move card to 1st stage', () => {
        // Select first card of third stage
        const currentStage = stages[1];
        const destStage = stages[0];
        const card = {
            currentStage: currentStage.querySelectorAll('.kanban_card'),
        }
        const oldCardLength = {
            destStage: destStage.querySelectorAll('.kanban_card').length,
            currentStage: currentStage.querySelectorAll('.kanban_card').length
        }
        card.currentStage[0].click();
        fixture.detectChanges();
        cardMoveBackBtn[0].click();
        fixture.detectChanges();
        expect(destStage.querySelectorAll('.kanban_card').length)
            .toBe(oldCardLength.destStage + 1, 'After move in 1st stage there should be appropriate card present.');
        expect(currentStage.querySelectorAll('.kanban_card').length)
            .toBe(oldCardLength.currentStage - 1, 'After move in 1st stage appropriate card should be removed.');
    });

    it("Once the card selected and clicking on  Delete button should remove the card from board.", () => {
        // Select first card of first stage
        let currentStage = stages[0];
        let card = currentStage.querySelectorAll('.kanban_card');
        let oldCardLength = card.length;
        card[0].click();
        fixture.detectChanges();
        cardDeleteBtn[0].click();
        fixture.detectChanges();
        expect(cardMoveBackBtn[0].hasAttribute('disabled')).toBeTruthy('Move back button should be disabled as it is first stage');
        expect(cardMoveForwardBtn[0].hasAttribute('disabled')).toBeTruthy('Move forward button should be enabled as it is first stage');
        expect(cardDeleteBtn[0].hasAttribute('disabled')).toBeTruthy('Delete button should be enabled');
        expect(currentStage.querySelectorAll('.kanban_card').length).toBe(oldCardLength - 1, 'After delete in 1st stage 1 card should be deleted.');
        expect(selectedInput[0].value).toEqual(
            '',
            'selected card input should be empty after delete'
        );
    });

    it('"Add card" should add one card in first stage and click on that card should move forward and backward correctly', () => {
        let stage_1_cards = stages[0].querySelectorAll('.kanban_card');
        expect(stage_1_cards.length).toBe(2, 'Before add 2 cards should be present in stage - 1')
        let newStageName = 'UI fixes';
        addCardInput[0].value = newStageName;
        addCardInput[0].dispatchEvent(new Event('input'));
        addCardBtn[0].click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            stage_1_cards = stages[0].querySelectorAll('.kanban_card');
            expect(stage_1_cards.length).toBe(3, 'After add  3 cards should be present in stage - 1');

            let newCard = stage_1_cards[2];
            expect(newCard.innerText).toBe(newStageName, 'New card should add at last of stage');
            let currentStage = stages[0];
            let nextStage = stages[1];
            let oldCardLength = {
                nextStage: nextStage.querySelectorAll('.kanban_card').length,
                currentStage: currentStage.querySelectorAll('.kanban_card').length
            }
            newCard.click();
            fixture.detectChanges();
            cardMoveForwardBtn[0].click();
            fixture.detectChanges();
            expect(nextStage.querySelectorAll('.kanban_card').length).toBe(oldCardLength.nextStage + 1, 'After move in 2nd stage 1 card should be added.');
            expect(currentStage.querySelectorAll('.kanban_card').length).toBe(oldCardLength.currentStage - 1, 'After move 1 card should be removed from first stage.');
            cardMoveBackBtn[0].click();
            fixture.detectChanges();
            expect(nextStage.querySelectorAll('.kanban_card').length).toBe(oldCardLength.nextStage, 'After move back in 1st stage 1 card should be removed from second stage.');
            expect(currentStage.querySelectorAll('.kanban_card').length).toBe(oldCardLength.currentStage, 'After move back 1 card should be added to forst stage.');
        });
    });

    it('Clicking on "Add card" button without any input should not affect anything.', () => {
        let stage_1_cards = stages[0].querySelectorAll('.kanban_card');
        expect(stage_1_cards.length).toBe(2, 'Before add 2 cards should be present in stage - 1')
        let blankStageName = '';
        addCardInput[0].value = blankStageName;
        addCardInput[0].dispatchEvent(new Event('input'));
        addCardBtn[0].click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            stage_1_cards = stages[0].querySelectorAll('.kanban_card');
            expect(stage_1_cards.length).toBe(2, 'After clicking on add UI should be affected');
            let tempStageName = 'Any name';
            addCardInput[0].value = tempStageName;
            addCardInput[0].dispatchEvent(new Event('input'));
            addCardBtn[0].click();
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                stage_1_cards = stages[0].querySelectorAll('.kanban_card');
                expect(stage_1_cards.length).toBe(3, 'Now card should be added');
            });
        });
    });

    it('Move forward an item till the last state and should disable the move forward button', () => {
        const currentStage = stages[0];
        const card = {
            currentStage: currentStage.querySelectorAll('.kanban_card'),
        }
        card.currentStage[0].click();
        fixture.detectChanges();
        cardMoveForwardBtn[0].click();
        fixture.detectChanges();
        cardMoveForwardBtn[0].click();
        fixture.detectChanges();
        cardMoveForwardBtn[0].click();
        fixture.detectChanges();
        expect(cardMoveForwardBtn[0].hasAttribute('disabled')).toBeTruthy('Move back button should be disabled as it is first stage');
    });

    it('Move backward an item till the first state and should disable the move backward button', () => {
        const currentStage = stages[3];
        const card = {
            currentStage: currentStage.querySelectorAll('.kanban_card'),
        }
        card.currentStage[0].click();
        fixture.detectChanges();
        cardMoveBackBtn[0].click();
        fixture.detectChanges();
        cardMoveBackBtn[0].click();
        fixture.detectChanges();
        cardMoveBackBtn[0].click();
        fixture.detectChanges();
        expect(cardMoveBackBtn[0].hasAttribute('disabled')).toBeTruthy('Move back button should be disabled as it is first stage');
    });

});
