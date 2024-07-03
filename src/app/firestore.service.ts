import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from '../config/firebase';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private db = getFirestore(initializeApp(firebaseConfig));
  private isTest = false;
  private dbName = this.isTest ?  'users-test' : 'users';


  constructor() { }

  async addUser(name: string, surname: string, phoneNumber: string, allergies: string[], menuPreference: string, presence: boolean, message: string): Promise<void> {
    try {
      const docRef = await addDoc(collection(this.db, this.dbName), {
        name,
        surname,
        phoneNumber,
        allergies,
        menuPreference,
        presence,
        message,
        createdAt: serverTimestamp(),
        confirmedAt: null
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async getUserCount(): Promise<number> {
    const querySnapshot = await getDocs(collection(this.db, this.dbName));
    return querySnapshot.size;
  }

  public observeUserCount(updateCallback: (count: number) => void): void {
    const q = query(collection(this.db, this.dbName));
    
    onSnapshot(q, querySnapshot => {
      updateCallback(querySnapshot.size);
    }, error => {
      console.error("Error observing user count: ", error);
    });
  }

  public observeUserCount2(): Observable<{ total: number, present: number }> {
    return new Observable(observer => {
      const q = query(collection(this.db, this.dbName));
      
      const unsubscribe = onSnapshot(q, querySnapshot => {
        let total = 0;
        let present = 0;
  
        querySnapshot.forEach(doc => {
          total++;
          if (doc.data()['presence'] === "true") {
            present++;
          }
        });
  
        observer.next({ total, present });
      }, error => {
        observer.error(error);
      });
  
      return { unsubscribe };
    });
  }
  
}
