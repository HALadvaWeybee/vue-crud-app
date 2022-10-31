import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from '../services/storage.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  isAddForm = false;
  isEditForm = false;
  showData: any[] = [];
  editData: any;
  arrow = 'up';
  page = 1;
  total = 0;
  productPerPageArr = [5, 10, 15, 20];
  productPerPage: number = 5;
  loginReactiveForm: FormGroup;

  searchword = '';

  constructor(private _storageService: StorageService) {}

  makeForm(id?:any) {
    if(!this.isEditForm) {
      this.loginReactiveForm = new FormGroup({
        name: new FormControl('', [
          Validators.required,
          Validators.pattern('[a-zA-Z]*'),
        ]),
        description: new FormControl('', [
          Validators.required,
          Validators.pattern('[a-zA-Z]*'),
        ]),
        image: new FormControl('', [Validators.required]),
        rating: new FormControl('', [Validators.required]),
        inventory_status: new FormControl('', [Validators.required]),
        category: new FormControl('', [Validators.required]),
        price: new FormControl('', [Validators.required]),
        quantity: new FormControl('', [Validators.required]),
      });
    } else {
      this.editData = this.showData.find((ele) => ele.code == id);
      this.loginReactiveForm = new FormGroup({
        name: new FormControl(this.editData['name'], [
          Validators.required,
          Validators.pattern('[a-zA-Z]*'),
        ]),
        description: new FormControl(this.editData['description'], [
          Validators.required,
          Validators.pattern('[a-zA-Z]*'),
        ]),
        image: new FormControl(this.editData['image'], [Validators.required]),
        rating: new FormControl(this.editData['rating'], [Validators.required]),
        inventory_status: new FormControl(this.editData['inventory_status'], [Validators.required]),
        category: new FormControl(this.editData['category'], [
          Validators.required,
        ]),
        price: new FormControl(this.editData['price'], [Validators.required]),
        quantity: new FormControl(this.editData['quantity'], [
          Validators.required,
        ]),
      });
    }
  }

  ngOnInit(): void {
    this.makeForm();
    this.loadData();
  }

  loadData() {
    if (this.searchword == '') {
      this.showData = this._storageService.getItemsFromLocalStorage();
      this.total = this.showData.length;
    } else {
      console.log("this searchword", this.searchword);
      
      this.showData = this.showData.filter((ele) =>
        ele.code.includes(this.searchword) || 
        ele.name.includes(this.searchword) ||
        ele.rating == +this.searchword ||
        ele.inventory_status.includes(this.searchword.toUpperCase()) ||
        ele.category.includes(this.searchword) 
      );
      this.total = this.showData.length;
    }
  }
  
  submitData() {
    console.log('hello in submit');
    if(!this.isEditForm) {
      this._storageService.setItemInLocalStorage(this.loginReactiveForm.value);
    this.isAddForm = !this.isAddForm;
    this.total = this.total + 1;
    this.loadData();
    } else {
      const index = this.showData.findIndex(
        (ele) => ele.code == this.editData.code
      );
      this.showData[index] = this.loginReactiveForm.value;
      this._storageService.editItemInLocalStorage(
        this.loginReactiveForm.value,
        this.editData.code
      );
    }
    this.loginReactiveForm.reset();
  }

  checking(id: string) {
    const index = this.showData.findIndex((ele) => ele.code == id);
    this.showData[index].isCheck = !this.showData[index].isCheck;
    this._storageService.editItemInLocalStorage(this.showData[index], id);
  }
  deleteRow(id: string) {
      if(confirm('Are you sure you want to delete')) {
        this.showData = this.showData.filter((ele) => ele.code != id);
        this.total = this.showData.length;
        this._storageService.deleteItemFromLocalStorage(id);  
      }

  }
  
  deleteSelected() {
    if(confirm('Are you sure you want to delete')) {
    this.showData = this.showData.filter((ele) => ele.isCheck == false);
    this._storageService.deleteSelectedInLocStorage();
    this.total = this.showData.length;
    }
  }

  selectAll(data: any) {
    this.showData.forEach((ele) =>
      data.checked ? (ele.isCheck = true) : (ele.isCheck = false)
    );
  }
  // ----------------------------------------------------------------------------------------------------------------
  openForm() {
    this.isAddForm = true;
  }

  openEditForm(id: any) {
    this.isEditForm = true;
    this.makeForm(id);
    console.log(this.editData);
  }

  closeForm() {
    this.isAddForm = false;
    this.isEditForm = false;
    this.loginReactiveForm.reset();
  }

  sortList(sortVal: string) {
    this.arrow == 'up'
      ? this.showData.sort((a, b) => (a[sortVal] > b[sortVal] ? -1 : 1))
      : this.showData.sort((a, b) => (a[sortVal] > b[sortVal] ? 1 : -1));
    this.arrow = this.arrow == 'up' ? 'down' : 'up';
  }

  searchInput(word: string) {
    this.searchword = word;
    
    this.loadData();
  }

  itemPerPage(perPageNumber: number) {
    this.productPerPage = perPageNumber;
    this.page = 1;
  }
  pageChangeEvent(event: number) {
    this.page = event;
  }

  fileDownload() {
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      useBom: true,
      noDownload: false,
      headers: ['Name', 'Description', 'Image', 'Rating', 'Incventory Status', 'Category', 'Price', 'Quantity', 'ID', 'CheckBox'],
    };

    new ngxCsv(this.showData, 'product list', options);
  }
}
