import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import {
  ModalDismissReasons,
  NgbDatepickerModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { Users } from '../get-user.modal';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  allUser: Users []=[];
  
  userForm: FormGroup;
  isEditMood: boolean = false;

  constructor(
    private modalService: NgbModal,
    private _HttpClient: HttpClient
  ) {}

  ngOnInit(): void {
    
    const url: string = '/assets/db.json';
    this._HttpClient.get(url).subscribe((respones) => {
      // console.log(respones['data']),
      this.allUser = respones['data'];
      this.getItem();
      this.userForm = new FormGroup({
       
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        age: new FormControl('', [
          Validators.required,
          Validators.pattern(/^[0-9]{0,2}$/),
        ]),
        calendar: new FormControl('', [Validators.required]),
      });
    });
  }

  getUserData(userForm: FormGroup) {}

 
  getItem() {
      const storageUsers = JSON.parse(localStorage.getItem('user'));
      this.allUser.push(...storageUsers); 
  }

 //////////add user
  AddUser() {
     this.allUser.push(this.userForm.value)
    localStorage.setItem('user', JSON.stringify(this.allUser ));
    this.clearData()
  }
  //////////delete user
  Deleteusert(deleteIndex: any) {
    if (deleteIndex >= 0 && deleteIndex < this.allUser.length) {
      this.allUser.splice(deleteIndex, 1);
      localStorage.setItem('user', JSON.stringify(this.allUser));
    } else {
      console.error('Invalid delete index');
    }
  }
   //////////updata user to open model
  updateUser(userINfo: any, content: TemplateRef<any>) {
    this.isEditMood = true;
    this.userForm.patchValue(userINfo);
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  //////////clear data user
  clearData(){
    this.userForm.reset();
  }

   //////////updata user 
  submitForm() {
    if (this.isEditMood) {
      
      const userToUpdateIndex = this.userForm.value.index;
      const userToUpdate = this.allUser.find(user => user.index == userToUpdateIndex);
    
      if (userToUpdate) {
        userToUpdate.name = this.userForm.value.name;
        userToUpdate.email = this.userForm.value.email;
        userToUpdate.age= this.userForm.value.age
        
      } 
    
    } else {
      this.AddUser();
    }
  }
 
  closeResult = '';

  open(content: TemplateRef<any>) {
    this.isEditMood = false;
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
}
