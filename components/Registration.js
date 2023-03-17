import React, { useState } from 'react';

function Registration() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [photo, setPhoto] = useState(null);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleBloodGroupChange = (event) => {
    setBloodGroup(event.target.value);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setPhoto(URL.createObjectURL(file));
    } else {
      setPhoto(null);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ name, phone, address, gender, bloodGroup, photo });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={handleNameChange} required />
      </div>
      <div>
        <label>Phone:</label>
        <input type="tel" value={phone} onChange={handlePhoneChange} required />
      </div>
      <div>
        <label>Address:</label>
        <textarea value={address} onChange={handleAddressChange} required />
      </div>
      <div>
        <label>Gender:</label>
        <select value={gender} onChange={handleGenderChange} required>
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label>Blood Group:</label>
        <select type="text" value={bloodGroup} onChange={handleBloodGroupChange} required >
          <option value="A+ve">A+ve</option>
          <option value="A-ve">A-ve</option>
          <option value="B+ve">B+ve</option>
          <option value="B-ve">B-ve</option>
          <option value="AB+ve">AB+ve</option>
          <option value="AB-ve">AB-ve</option>
          <option value="O+ve">O+ve</option>
          <option value="O-ve">O-ve</option>
        </select>
      </div>
      <div>
        <label>Photo:</label>
        <input type="file" accept="image/png,image/jpeg" onChange={handlePhotoChange} required />
        {photo && <img src={photo} alt="uploaded" />}
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
}

export default Registration;
