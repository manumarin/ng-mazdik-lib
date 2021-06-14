import {
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy
} from '@angular/core';
import { GetOptionsFunc, KeyElementChangeEventArgs } from './types';
import { DynamicFormElement } from './dynamic-form-element';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DynamicFormComponent {

  @Input() dynElements: DynamicFormElement[];
  @Input() item: any;
  @Input() isNewItem = true;
  @Input() getOptionsFunc: GetOptionsFunc;
  @Input() selectPlaceholder: string;
  @Input() searchInputPlaceholder: string;

  @Output() valid: EventEmitter<boolean> = new EventEmitter();
  @Output() loaded: EventEmitter<any> = new EventEmitter();

  private validElements: any = {};

  constructor() { }

  elemEnabled(dynElement: DynamicFormElement): boolean {
    return (!dynElement.hidden);
  }

  onValid(event: any, dynElement: DynamicFormElement): void {
    this.validElements[dynElement.name] = event;
    this.isValid();
  }

  isValid(): void {
    const result = Object.keys(this.validElements).some(x => this.validElements[x] === false);
    this.valid.emit(!result);
  }

  onKeyElementChange(event: KeyElementChangeEventArgs): void {
    this.item[event.keyElementName] = event.keyElementValue;
    this.item[event.elementName] = event.elementValue;
  }

  isDisabled(dynElement: DynamicFormElement): boolean {
    return (!this.isNewItem && dynElement.disableOnEdit);
  }

  onSelectPopupNameChanged(value: any, dynElement: DynamicFormElement): void {
    if (dynElement.keyElement) {
      this.item[dynElement.name] = value;
    }
  }

}
