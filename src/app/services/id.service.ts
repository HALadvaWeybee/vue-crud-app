import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdService {
  
 idCount = JSON.parse(localStorage.getItem('idCount')) || 0;
 constructor() { }
  
  generateId(len:number) {
    const ch = String.fromCharCode(97+this.idCount);
    if(((len+1)%10)==0) {
       this.idCount++; 
    }
     localStorage.setItem('idCount', JSON.stringify(this.idCount));
     const idFormat = (ch+'-'+10+(len%10));
     return idFormat;
  }
}
