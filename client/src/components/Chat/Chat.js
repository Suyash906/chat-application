import React, {useState, useEffect} from 'react'; // useEffect lets you use lifecycle methods
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css'

let socket;

// location comes from react router
const Chat = ({location}) => {

    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const ENDPOINT = `localhost:5000`
    useEffect( () => {
        const {name, room} = queryString.parse(location.search); // location.serach gives url parameters
        
        socket = io(ENDPOINT);
        
        setName(name);
        setRoom(room);

        socket.emit('join', {name, room}, () => {

        })

        return () => {
            socket.emit('disconnect')

            socket.off();
        }
    }, [ENDPOINT, location.search])


    // listener for getting new messages
    useEffect( () => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        })
    }, [messages]);

    // function for sending messages

    const sendMessage = (event) => {
        event.preventDefault();

        if (message) {
            socket.emit('sendMessage', message, () => {setMessage('')})
        }
    }

    console.log(message, messages)

    return (
        <div className="outerContainer">
            <div className="container">
                <input 
                    value={message}
                    onChange= { (event) => setMessage(event.target.value)}
                    onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                />
            </div>
        </div>
    )
}


export default Chat;