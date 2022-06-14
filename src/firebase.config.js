import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// My web app's Firebase configuration
const firebaseConfig = {}

initializeApp(firebaseConfig)

export const db = getFirestore()
