import React, { useState } from 'react';
import Heading from '../../components/common/Heading/Heading';
import MyButton from '../../components/common/Button/Button';
import { useNavigate } from 'react-router-dom';


function ForgotPassword() {
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   await fetch('http://localhost:5000/api/auth/forgot-password', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ email }),
  //   });
  //   alert('Check your email for instructions.');
  // };

  const handleSubmit = () => {
    navigate('/reset-password')
  }

  return (
    <div className="flex flex-col items-center justify-center mb-20">
      <Heading text="FORGOT PASSWORD?"/>
      <form onSubmit={handleSubmit} className='flex gap-y-5 flex-col'>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className='bg-[#ffffffb8] w-[300px] lg:w-[400px] p-4 rounded-md border-b-2 border-black'
          required
        />
        <MyButton buttonText="Proceed..." pageUrl="/" onClick={handleSubmit} />
      </form>
    </div>
  );
}

export default ForgotPassword;
