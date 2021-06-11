import { Injectable } from '@angular/core';

import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { AngularFireDatabase } from '@angular/fire/database';


import { Observable, of } from 'rxjs';
import { switchMap, first, tap } from 'rxjs/operators';
export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  messagingtoken?: string;
  calculations?: Calculations;
}

export interface Calculations {
  uid: string;
  inputWidth?: number;
  inputLength?: number;
  inputTotal?: number;
  seedCost?: number;
  seedTotal?: number;
  fertilizeCost?: number;
  fertilizeTotal?: number;
  mowCost?: number;
  mowTotal?: number;
  numSqFtPerHour?: number;
  gallonsWaterPerSqFt?: number;
  totalWaterSavings?: number;
  totalCostSavings?: number;
  totalHoursSavings?: number;
  editvars?: boolean;
  editedvars?: boolean;
}

export interface CalculatorDefaultValues {
  annualcostofseed?: number;
  annualcostoffertilizer?: number;
  numbersquarefeetperhourofwork?: number;
  gallonsofwatersavedpersquarefootannually?: number;
}
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public user$: Observable<any>;
  public emailsubmitted = false;
  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public db: AngularFireDatabase
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db.object(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  public getUser() {
    this.afAuth.authState.pipe(
      tap(user => {
        if (user) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

  getUserPromise(): Promise<any> {
    return this.afAuth.authState.pipe(first()).toPromise();
}

  async googleSignin(totalSqFt) {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserData(credential.user, totalSqFt);
  }

  async signOut() {
    await this.afAuth.signOut();
  }

  private updateUserData(user, totalSqFt) {
    // Sets user data to firestore on login
    const userRef = this.db.object(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      totalSqFt: totalSqFt
    };

    return userRef.update(data);

  }
  async submitEmail(email, totalSqFt) {

      this.emailsubmitted = true;
      const emailaddressesRef = this.db.list(`emailaddresses`);
      return emailaddressesRef.push({
        email: email,
        totalSqFt: totalSqFt
      });

  }
}
