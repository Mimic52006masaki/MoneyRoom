import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Allocation } from '@/types'

export class AllocationRepository {
  private collectionRef = collection(db, 'allocations')

  async getAll(): Promise<Allocation[]> {
    const snapshot = await getDocs(this.collectionRef)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as Allocation[]
  }

  async getById(id: string): Promise<Allocation | null> {
    const docRef = doc(this.collectionRef, id)
    const snapshot = await getDoc(docRef)
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
        createdAt: snapshot.data().createdAt.toDate()
      } as Allocation
    }
    return null
  }

  async create(allocation: Omit<Allocation, 'id'>): Promise<string> {
    const docRef = await addDoc(this.collectionRef, {
      ...allocation,
      createdAt: new Date()
    })
    return docRef.id
  }

  async update(id: string, updates: Partial<Allocation>): Promise<void> {
    const docRef = doc(this.collectionRef, id)
    await updateDoc(docRef, updates)
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.collectionRef, id)
    await deleteDoc(docRef)
  }

  subscribeToAll(callback: (allocations: Allocation[]) => void): () => void {
    const q = query(this.collectionRef, orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      const allocations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate()
      })) as Allocation[]
      callback(allocations)
    })
  }
}