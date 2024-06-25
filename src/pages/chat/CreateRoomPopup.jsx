import React, { useState } from 'react';

const CreateRoomPopup = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>채팅방 만들기</h2>
        <form onSubmit={handleSubmit}>
          <label>
            채팅방 이름
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="ex) IT 취업 준비방" required />
          </label>
          <label>
            채팅방 설명
            <input type="text" name="description" value={form.description} onChange={handleChange} placeholder="ex) 서류 준비, 면접 준비, 코딩 테스트 준비" required />
          </label>
          <label>
            채팅방 카테고리
            <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="ex) 기획, 개발, 엔지니어, PM" required />
          </label>
          <button type="submit" className="submit-button">채팅방 만들기</button>
        </form>
      </div>
      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .popup {
          background: white;
          padding: 20px;
          border-radius: 10px;
          position: relative;
          width: 300px;
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }
        form {
          display: flex;
          flex-direction: column;
        }
        label {
          margin-bottom: 10px;
        }
        input {
          padding: 8px;
          margin-top: 5px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .submit-button {
          padding: 10px;
          background-color: #66b2b2;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        .submit-button:hover {
          background-color: #549999;
        }
      `}</style>
    </div>
  );
};

export default CreateRoomPopup;
