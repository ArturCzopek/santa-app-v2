import { db } from './firebaseConfig'; // Ensure db is properly exported in firebaseConfig
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';

// Type for a message object
export interface Message {
    createDate: Timestamp;
    userUuid: string;
    userName: string;
    message: string;
    email: string;
}

// Function to send a new message to Firestore
export const sendMessage = async (messageContent: string) => {
    const { user } = useAuth();

    if (!user) {
        throw new Error('User must be logged in to send a message');
    }

    try {
        const docRef = await addDoc(collection(db, "messages"), {
            createDate: Timestamp.fromDate(new Date()),
            userUuid: user.uid,
            userName: user.displayName || 'Anonymous',
            message: messageContent,
            email: user.email || 'No email',
        });

        console.log("Message sent with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};
