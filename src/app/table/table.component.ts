import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  isAddForm = false;
  isEditForm = false;
  showData:any[] =[];
  editData:any;
  constructor(private _storageService: StorageService) { }

  loginReactiveForm = new FormGroup({
    name:new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]*')]),
    description:new FormControl("", [Validators.required, Validators.pattern('[a-zA-Z]*')]),
    // image:new FormControl('', [Validators.required]),
    // password:new FormControl('', [Validators.required, Validators.minLength(5)]),
    select:new FormControl('', [Validators.required]),
    radioinput:new FormControl('', [Validators.required]),
    price:new FormControl('', [Validators.required]),
    quantity:new FormControl('', [Validators.required]),
  })

  loginEditReactiveForm = new FormGroup({
    name:new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]*')]),
    description:new FormControl("", [Validators.required, Validators.pattern('[a-zA-Z]*')]),
    // image:new FormControl('', [Validators.required]),
    // password:new FormControl('', [Validators.required, Validators.minLength(5)]),
    select:new FormControl('', [Validators.required]),
    radioinput:new FormControl('', [Validators.required]),
    price:new FormControl('', [Validators.required]),
    quantity:new FormControl('', [Validators.required]),
  })


  ngOnInit(): void {
     this.showData = this._storageService.getItemsFromLocalStorage();
  }

  submitEditData() {
     console.log(this.loginEditReactiveForm.value);
     const index = this.showData.findIndex(ele => ele.code == this.editData.code);
     this.showData[index] = this.loginEditReactiveForm.value;
     this.isEditForm = !this.isEditForm;
     this._storageService.editItemInLocalStorage(this.loginEditReactiveForm.value, this.editData.code);
  }
  submitData(myForm:any) {
    console.log(this.loginReactiveForm.value); 
    this._storageService.setItemInLocalStorage(this.loginReactiveForm.value);
    this.isAddForm= !this.isAddForm;
    myForm.value = '';
    this.loginReactiveForm.reset();
  }

  checking(id:string) {
    const index = this.showData.findIndex(ele => ele.code == id);
    this.showData[index].isCheck = !this.showData[index].isCheck;
    this._storageService.editItemInLocalStorage(this.showData[index], id);
  }
  deleteRow(id:string) {
    this.showData = this.showData.filter(ele => ele.code != id)
    this._storageService.deleteItemFromLocalStorage(id);
  }

  openEditForm(id:number) {
    this.isEditForm = !this.isEditForm;
    this.editData =  this.showData.find(ele => ele.code == id);
    console.log(this.editData);
  }

  deleteSelected() {
    this.showData = this.showData.filter(ele => ele.isCheck==false);
    this._storageService.deleteSelectedInLocStorage();
  }

  selectAll() {
    this.showData.forEach(ele => ele.isCheck = ele.isCheck==false? true: !ele.isCheck);
  }
  // ----------------------------------------------------------------------------------------------------------------
  openForm() {
    this.isAddForm= !this.isAddForm;
  }

  closeForm() {
    this.isAddForm= !this.isAddForm;
  }

  
  closeEditForm() {
    this.isEditForm = !this.isEditForm;
  }
}
