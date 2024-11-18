import { Directive, Input, OnChanges, forwardRef } from '@angular/core'
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms'

@Directive({
  selector: '[match][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => MatchValidator), multi: true }],
})
export class MatchValidator implements Validator, OnChanges {
  @Input() match?: string

  public ngOnChanges(): void {
    if (this.onChange) {
      this.onChange()
    }
  }

  public onChange?: () => void

  public registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn
  }

  public validate(control: AbstractControl): { [key: string]: any } | null {
    const matchValue = this.match ?? ''
    const currentValue = control.value ?? ''

    const isMatch = matchValue === currentValue
    if (!isMatch) {
      return { mismatch: true } 
    }
    return null
  }
}
