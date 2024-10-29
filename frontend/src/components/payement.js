import React, { useState } from 'react';
import axios from 'axios';

const Payment = () => {
  const [formData, setFormData] = useState({
    amount: '',
    currency: '',
    provider: '',
    name: '',
    accountnumber: '',
    code: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:443/payement', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Payment successful!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl mb-4">Make a Payment</h2>
        {['amount', 'currency', 'provider', 'name', 'accountnumber', 'code'].map((field) => (
          <div className="mb-4" key={field}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id={field}
              name={field}
              type={field === 'amount' ? 'number' : 'text'}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Make Payment
          </button>
        </div>
      </form>
      {message && <p className="text-center text-green-500">{message}</p>}
    </div>
  );
};

export default Payment;