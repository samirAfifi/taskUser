import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeUser'
})
export class PipeUserPipe implements PipeTransform {

  transform(date:any ,limit:number):number {
    return date.split(' ').slice(0,limit).join(' ')
  }

}
