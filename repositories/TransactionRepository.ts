import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Transaction } from '@/types'

export class TransactionRepository {
  private collectionRef = collection(db, 'transactions')

  async getAll(): Promise<Transaction[]> {
    const snapshot = await getDocs(this.collectionRef)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as Transaction[]
  }

  async getByUserId(userId: string): Promise<Transaction[]> {
    const q = query(this.collectionRef, where('userId', '==', userId), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as Transaction[]
  }

  async getById(id: string): Promise<Transaction | null> {
    const docRef = doc(this.collectionRef, id)
    const snapshot = await getDoc(docRef)
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt.toDate()
      } as Transaction
    }
    return null
  }

  async create(transaction: Omit<Transaction, 'id'>): Promise<string> {
    const docRef = await addDoc(this.collectionRef, {
      ...transaction,
      createdAt: new Date()
    })
    return docRef.id
  }

  async update(id: string, updates: Partial<Transaction>): Promise<void> {
    const docRef = doc(this.collectionRef, id)
    await updateDoc(docRef, updates)
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.collectionRef, id)
    await deleteDoc(docRef)
  }

  subscribeToAll(callback: (transactions: Transaction[]) => void): () => void {
    const q = query(this.collectionRef, orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      })) as Transaction[]
      callback(transactions)
    })
  }

  subscribeToUser(userId: string, callback: (transactions: Transaction[]) => void): () => void {
    const q = query(this.collectionRef, where('userId', '==', userId), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      })) as Transaction[]
      callback(transactions)
    })
  }
}