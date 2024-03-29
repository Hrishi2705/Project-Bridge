import React from 'react'
import { useParams } from 'react-router-dom';
import './student_home.css'
const StudentHome = () => {
  const { userId } = useParams();
  return (
    <div style={{textAlign:"center"}}>
        <p>User ID: {userId}</p>
        <h1>Student Home</h1>
        <a href={`/students/ProjectBank/${userId}`}> Project Bank </a>
      </div>
  )
}

export default StudentHome