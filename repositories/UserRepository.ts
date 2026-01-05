import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { User } from '@/types'

export class UserRepository {
  private collectionRef = collection(db, 'users')

  async getAll(): Promise<User[]> {
    const snapshot = await getDocs(this.collectionRef)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as User[]
  }

  async getById(id: string): Promise<User | null> {
    const docRef = doc(this.collectionRef, id)
    const snapshot = await getDoc(docRef)
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt.toDate()
      } as User
    }
    return null
  }

  async create(user: Omit<User, 'id'>): Promise<string> {
    const docRef = await addDoc(this.collectionRef, {
      ...user,
      createdAt: new Date()
    })
    return docRef.id
  }

  async update(id: string, updates: Partial<User>): Promise<void> {
    const docRef = doc(this.collectionRef, id)
    await updateDoc(docRef, updates)
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.collectionRef, id)
    await deleteDoc(docRef)
  }

  subscribeToAll(callback: (users: User[]) => void): () => void {
    const q = query(this.collectionRef, orderBy('createdAt'))
    return onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      })) as User[]
      callback(users)
    })
  }
}