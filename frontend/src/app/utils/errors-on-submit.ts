import { NgForm } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'

export class ErrorsOnSubmitStateMatcher implements ErrorStateMatcher {
  isErrorState(control: any, form: NgForm): boolean {
    if (form && !form.submitted) {
      return false
    }
    return !!(control && control.invalid)
  }
}
