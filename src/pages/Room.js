import React, { useState, useEffect } from 'react'
import client, { databases, DATABASE_ID, COLLECTION_ID_MESSAGES } from '../appwriteConfig';
import { ID, Query, Role,Permission } from 'appwrite';
import { Trash2 } from 'react-feather';
import Header from '../Components/Header';
import { useAuth } from '../utils/AuthContext';

const Room = () => {

    const { user } = useAuth();
    const [messages, setMessages] = useState([]);   //for taking messages from database
    const [messageBody, setMessageBody] = useState('');  //form input field

    useEffect(() => {
        getMessages()
        const unsubscribe = client.subscribe(`databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`, response => {
            // Callback will be executed on changes for documents A and all files.
            console.log("Real time", response);
            if (response.events.includes("databases.*.collections.*.documents.*.create")) {
                console.log("A message was created")
                setMessages(prevState => [response.payload, ...prevState]);
            }
            if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
                console.log("A message was deleted")
                setMessages(prevState => prevState.filter(message => message.$id !== response.payload.$id))
            }
        });


        //Cleanup function which takes only one subscription
        //Closes the subscription 
        return () => {
            unsubscribe();
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let payload = {
            user_id: user.$id,
            username: user.name,
            body: messageBody
        }

        let permissions=[
            Permission.write(Role.user(user.$id))
        ]

        let response = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID_MESSAGES,
            ID.unique(),
            payload,
            permissions
            //import it 

        );
        //console.log("Created", response);
        //setMessages(prevState => [response, ...prevState]);
        setMessageBody('');   // for reseting form values
    }

    const getMessages = async () => {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_MESSAGES,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(100)
            ]);
        console.log('RESPONSE: ', response);
        setMessages(response.documents);
    }

    const deleteMessage = async (message_id) => {
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGES, message_id);
        //setMessages(prevState => messages.filter(message => message.$id !== message_id))  //updating messages array 
    }

    return (
        <main className='container'>
            <Header />
            <div className='room--container'>
                <form id='message--form' onSubmit={handleSubmit}>

                    <div>
                        <textarea required maxLength="1000" value={messageBody} placeholder='Say Something...' onChange={(e) => {
                            setMessageBody(e.target.value)
                        }}>

                        </textarea>
                    </div>

                    <div className='send-btn--wrapper'>
                        <input type='submit' value="Send" className='btn btn--secondary' />
                    </div>
                </form>
                <div>
                    {messages.map(message => (
                        <div key={message.$id} className='message--wrapper'>
                            <div className='message--header'>
                                <p>
                                    {message?.username ? (
                                        <span>{message.username}</span>
                                    ) : (
                                        <span>Anonymous user</span>
                                    )}
                                    <small className='message-timestamp'>{new Date(message.$createdAt).toLocaleString()}</small>
                                </p>

                                {message.$permissions.includes(`delete(\"user:${user.$id}\")`) && <Trash2 onClick={() => { deleteMessage(message.$id) }} className='delete--btn' />} 
                                
                            </div>
                            <div className='message--body'>
                                <span>{message.body}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default Room

//for Trash icon install --  npm install react-feather
