import { Injectable } from '@angular/core';
import * as alerfify from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() { }

confirm(message: string, okCallback: () => any){
  alerfify.confirm(message, (e: any) => {
    if (e){

      okCallback();
    } else{}

  }

  );
}

success(message: string){
  alerfify.success(message);
}

error(message: string){
  alerfify.error(message);
}

warning(message: string){
  alerfify.warning(message);
}

message(message: string){
  alerfify.message(message);
}

}
