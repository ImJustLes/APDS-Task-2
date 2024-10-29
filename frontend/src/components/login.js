import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [form, setForm] = useState({
        name: "",
        accountNumber: "",
        password: ""
    });

    const navigate = useNavigate();

    function updateForm(value) {
        setForm((prev) => {
            return { ...prev, ...value };
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const user = { ...form };

            const response = await fetch("https://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const { generatedToken, name } = data;

            console.log(name + " " + generatedToken);

            localStorage.setItem("jwt", generatedToken);
            localStorage.setItem("name", name);

            setForm({ name: "", accountNumber: "", password: "" });
            navigate("/");
        } catch (err) {
            console.log("Error occurred: " + err);
            window.alert("Login failed: " + err.message);
        }
    }
    
    return (
        <div>
            <h3>LOGIN</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor='name'>Name:</label>
                    <input 
                        type='text' 
                        className='form-control' 
                        id='name' 
                        value={form.name} 
                        onChange={(e) => updateForm({ name: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor='accountNumber'>Account Number:</label>
                    <input 
                        type='text' 
                        className='form-control' 
                        id='accountNumber' 
                        value={form.accountNumber} 
                        onChange={(e) => updateForm({ accountNumber: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor='password'>Password:</label>
                    <input 
                        type='password' 
                        className='form-control' 
                        id='password' 
                        value={form.password} 
                        onChange={(e) => updateForm({ password: e.target.value })}
                    />
                </div>
                <div className='form-group'>
                    <input type='submit' value="Login" className='btn btn-primary'/>
                </div>
            </form>
        </div>
    );
}
