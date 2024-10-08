import React, { useState } from 'react'
import axios from 'axios'
import {useNavigate } from 'react-router-dom'

//Backend code to run: APDS7311\Programmes\Backend\Auth\user.js

//Sign up function
const Signup = () => {
    const [id, setId] = useState(''); // Assign empty string for id
    const [name, setName] = useState('') //Assign empty string for name
    const [accountnumber, setAccountnumber] = useState(''); // Assign empty string for accountnumber
    const [surname, setSurname] = useState('') //Assign empty string for name
    const [email, setEmail] = useState('') //Assign empty string for name
    const [password, setPassword] = useState('') //Assign empty string for name
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false); // For loading state
    const [error, setError] = useState(''); 


    

    const handleSignup = (e) =>{
        e.preventDefault()
        setLoading(true); // Start loading
        setError(''); 

        axios.post('https://localhost:3001/signup', {
            id, name, surname, email, accountnumber, password
        })
        .then(response => {
            setLoading(false); // Stop loading
            alert('Account created successfully!');
            navigate('/login');
        })
        .catch(error => {
            setLoading(false);
            const errorMsg = error.response && error.response.data 
                ? error.response.data.message 
                : error.message;
            console.error('Error creating account', errorMsg);
            alert('Error creating account: ' + errorMsg);
        })

    }

    return(
        <form onSubmit={handleSignup}>
            <div>
                <label>ID</label>
                <input type='text' value={id} onChange={(e) => setId(e.target.value)} />
            </div>


            <div>
                <label>Name</label>
                <input type='text' value={name} onChange={(e) => setName(e.target.value)}/>
            </div>

            <div>
                <label>Surname</label>
                <input type='text' value={surname} onChange={(e) => setSurname(e.target.value)}/>
            </div>

            <div>
                <label>Email</label>
                <input type='text' value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>

            <div>
                <label>Account Number</label>
                <input type='text' value={accountnumber} onChange={(e) => setAccountnumber(e.target.value)} />
            </div>

            <div>
                <label>Password</label>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>

            {loading && <p>Creating account...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button type="submit"disabled={loading}>Signup</button>
        </form>
    )

}
export default Signup
