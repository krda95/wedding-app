import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, onSnapshot } from 'firebase/firestore';
import { firebaseConfig } from '../config/firebase';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private db = getFirestore(initializeApp(firebaseConfig));


  constructor() { }

  async addUser(name: string, surname: string, phoneNumber: string, allergies: string[], menuPreference: string, presence: boolean, message: string): Promise<void> {
    try {
      const docRef = await addDoc(collection(this.db, "users"), {
        name,
        surname,
        phoneNumber,
        allergies,
        menuPreference,
        presence,
        message
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async getUserCount(): Promise<number> {
    const querySnapshot = await getDocs(collection(this.db, "users"));
    return querySnapshot.size; // Returns the count of documents in the collection
  }

  public observeUserCount(updateCallback: (count: number) => void): void {
    const q = query(collection(this.db, "users"));
    
    onSnapshot(q, querySnapshot => {
      updateCallback(querySnapshot.size); // Execute callback with the new count
    }, error => {
      console.error("Error observing user count: ", error);
    });
  }

  public observeUserCount2(): Observable<{ total: number, present: number }> {
    return new Observable(observer => {
      const q = query(collection(this.db, "users"));
      
      const unsubscribe = onSnapshot(q, querySnapshot => {
        let total = 0;
        let present = 0;
  
        querySnapshot.forEach(doc => {
          total++;
          if (doc.data()['presence'] === "true") {
            present++;
          }
        });
  
        observer.next({ total, present }); // Emit both counts
      }, error => {
        observer.error(error); // Emit any errors
      });
  
      // Return the unsubscribe function for cleanup
      return { unsubscribe };
    });
  }
  
}
