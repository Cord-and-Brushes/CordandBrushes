import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MyButton from '../../components/common/Button/Button';
import Heading from '../../components/common/Heading/Heading';

function ResetPassword() {
  const { userId, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [match, setMatch] = useState(false); // State to track if passwords match
  const [showWarning, setShowWarning] = useState(false); // State to control the visibility of the warning message

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Update match state whenever password changes
    setMatch(e.target.value === confirmPassword);
    // Show warning if passwords do not match
    setShowWarning(e.target.value!== confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    // Update match state whenever confirm password changes
    setMatch(e.target.value === password);
    // Show warning if passwords do not match
    setShowWarning(e.target.value!== password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Only proceed if passwords match
    if (!match) {
      alert('Passwords do not match.');
      return;
    }
    // Call your API to reset the password
    // This is just a placeholder function, replace it with your actual API call
    await fetch(`http://localhost:5000/api/auth/reset-password/${userId}/${token}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password, confirmPassword }),
    });
    alert('Password reset successful!');
  };

  return (
    <div className="flex flex-col items-center justify-center mb-20">
      <Heading text="RESET YOUR PASSWORD?"/>
      <form onSubmit={handleSubmit} className='flex gap-y-5 flex-col'>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="New Password"
          className='bg-[#ffffffb8] w-[300px] lg:w-[400px] p-4 rounded-md border-b-2 border-black'
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="Confirm New Password"
          className='bg-[#ffffffb8] w-[300px] lg:w-[400px] p-4 rounded-md border-b-2 border-black'
          required
        />
        {/* Display warning message if passwords do not match */}
        {showWarning && <p className="warning-message">The password and confirm password do not match</p>}
        <MyButton buttonText="Reset Password" disabled={!match} pageUrl="/aboutus" onClick={handleSubmit} />
      </form>
    </div>
  );
}

export default ResetPassword;
