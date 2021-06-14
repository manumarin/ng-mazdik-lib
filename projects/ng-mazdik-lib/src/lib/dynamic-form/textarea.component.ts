import { Component, ChangeDetectionStrategy } from '@angular/core';
import { InputComponent } from './input.component';

@Component({
  selector: 'app-form-textarea',
  template: `
    <div class="dt-group" [ngClass]="{'dt-has-error':dynElement.hasError}">
      <label [attr.for]="dynElement.name">{{dynElement.title}}</label>
      <textarea class="dt-input"
                id="{{dynElement.name}}"
                [value]="model || null"
                (input)="onInputModel($event)"
                [disabled]="disabled">
      </textarea>
      <div class="dt-help-block">
        <span *ngFor="let err of dynElement.errors">{{err}}<br></span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent extends InputComponent {

}
