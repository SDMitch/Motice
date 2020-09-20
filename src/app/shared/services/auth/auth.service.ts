import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import { User } from '../../interfaces/user';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: Observable<User>;

  constructor( private afAuth: AngularFireAuth, private afStore: AngularFirestore, private router: Router ) {

    this.user = this.afAuth.authState.pipe(switchMap(user => {
      if(user) {
        return this.afStore.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return of(null);
      }
    }));

  }

  emailLogin(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(email, password).then((credential) => {
        this.router.navigate(['/dashboard']);
        resolve(credential.user);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider).then((credential) => {
      this.router.navigate(['/dashboard']);
      this.updateUserData(credential.user);
    });
  }

  emailRegister(email: string, password: string, company: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.createUserWithEmailAndPassword(email, password).then((credential) => {
        this.updateUserData(credential.user).then(() => {
          resolve(credential.user);
          this.router.navigate(['/dashboard']);
        }).catch((error) => {
          reject(error);
        })
      }).catch((error) => {
        reject(error);
      });
    });
  }

  updateUserData(user) {
    return new Promise((resolve, reject) => {
      const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
      const data: User = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user?.displayName,
        photoURL: user?.photoURL
      }
      userRef.set(data, { merge: true }).then((result) => {
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  signOut() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

}
