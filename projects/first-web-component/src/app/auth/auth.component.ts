import { Component, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import 'firebase/auth'
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { switchMap, first, tap } from 'rxjs/operators';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  @Input() totalsqft: number;
  email: string;
  emailvalid: boolean;
  emailsubmitted: boolean = false;
  public user$: Observable<any>;
  constructor(public afauth: AngularFireAuth, public db: AngularFireDatabase) {
    this.emailvalid = false;
    this.user$ = this.afauth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db.object(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
   }

   async googleSignin(totalsqft) {
    var provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afauth.signInWithPopup(provider);
    return this.updateUserData(credential.user, this.totalsqft);
  }

  async signOut() {
    await this.afauth.signOut();
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

  validateEmail(email) {
   if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email)) {
      //this.emailvalid = true;
      this.emailvalid = true;
    } else {
      //this.emailvalid = false;
      this.emailvalid = false;
    }
    console.log(this.emailvalid);
  }

  submitemail() {
      this.emailsubmitted = true;
    const emailaddressesRef = this.db.list(`emailaddresses`);
    return emailaddressesRef.push({
      email: this.email,
      totalSqFt: this.totalsqft
    });
  }

}
