import { Component, Input } from '@angular/core';

import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

import { Observable, of } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';
import { NumberFormatStyle } from '@angular/common';
export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  messagingtoken?: string;
}
@Component({
  selector: 'app-uibutton',
  templateUrl: './uibutton.component.html',
  styleUrls: ['./uibutton.component.scss'],
})
export class UIButtonComponent {
  internalversion: number = 1;
  @Input() externalversion: number;
  test: string;
  @Input() title: string;
  @Input() imageurl: string;
  @Input() seedcost: number;
  @Input() fertilizecost: number;
  @Input() mowcost: number;
  @Input() costvariance: number;

  @Input() numsqftperhour: number;
  @Input() gallonswaterpersqft: number;

  inputwidth: number;
  inputlength: number;
  inputtotal: number;

  seedtotal: number;
  fertilizetotal: number;
  mowtotal: number;
  totalwatersavings: number;
  totalcostsavings: number;
  totalhourssavings: number;
  totalrangedsavingslow: number;
  totalrangedsavingshigh: number;

  editvars: boolean;
  editedvars: boolean;
  user$: Observable<any>;
  optout = false;
  showresults = true;
  totaldetermined = false;
  sqftmsg = 'or enter the total square feet ...';
  hoursmsg = 'Hour';

  constructor(public afauth: AngularFireAuth, public db: AngularFireDatabase) {
    this.user$ = this.afauth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.db.object(`usercalculations/${user.uid}`).valueChanges();
          // return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async userAuth(): Promise<boolean> {
    const user = await this.getUser();
    const loggedIn = !!user;

    if (!loggedIn) {
      console.log(user);
    }

    return loggedIn;
  }
  getUser() {
    return this.afauth.authState.pipe(first()).toPromise();
  }

  updatetotalbywidthxlength() {
    if (this.inputwidth && this.inputlength) {
      this.sqftmsg = 'Total square feet:';
      this.inputtotal = this.inputwidth * this.inputlength;
      this.updatetotalsavingsif();
    }
  }
  updatetotalsavingsif() {
    this.updatetotalsavings();
    this.totaldetermined = true;
    // this.optout);
    // if (this.isloggedin() || this.optout) {
    //   this.updatetotalsavings();
    // }
  }

  updatetotalsavings() {
    this.seedtotal = this.inputtotal * this.seedcost;
    this.fertilizetotal = this.inputtotal * this.fertilizecost;
    this.mowtotal = this.inputtotal * this.mowcost;

    this.totalcostsavings =
      this.moneyformat(this.seedtotal) +
      this.moneyformat(this.fertilizetotal) +
      this.moneyformat(this.mowtotal);

    this.totalwatersavings = this.gallonswaterpersqft * this.inputtotal;

    this.totalhourssavings = this.inputtotal / this.numsqftperhour;
    if (this.numberWithCommas(this.totalhourssavings) == 1) {
      this.hoursmsg = 'Hour';
    } else {
      this.hoursmsg = 'Hours';
    }
    this.totalrangedsavingslow =
      this.moneyformat(this.seedtotal) +
      this.moneyformat(
        this.fertilizetotal - this.fertilizetotal * this.costvariance
      ) +
      this.moneyformat(this.mowtotal - this.mowtotal * this.costvariance);
    this.totalrangedsavingshigh =
      this.moneyformat(this.seedtotal) +
      this.moneyformat(
        this.fertilizetotal + this.fertilizetotal * this.costvariance
      ) +
      this.moneyformat(this.mowtotal + this.mowtotal * this.costvariance);
  }

  updateseed() {
    this.seedtotal = this.inputtotal * this.seedcost;
  }
  updatefertilizer() {
    this.fertilizetotal = this.inputtotal * this.fertilizecost;
  }
  updatemow() {
    this.mowtotal = this.inputtotal * this.mowcost;
  }

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  moneyformat(num: number) {
    return Math.ceil(num * 100) / 100;
  }

  fixedformat(num: number) {
    return this.numberWithCommas(parseInt(this.moneyformat(num).toFixed(2)));
  }

  numberWithCommas(x) {
    if (x) {
      if (x.toFixed() == 0) {
        return 1;
      } else {
        return x
          .toFixed()
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    } else {
      return ' ';
    }
  }
}
