import './App.css';
import Login from './components/Login';
import Error from './components/Error';
import React from 'react';
import Header from './components/Headers';
import StudentHome from './components/student/student_home';
import TeacherHome from './components/teacher/home/teacher_home';
import StudentProfile from './components/student/student_profile';
import TeacherProfile from './components/teacher/profile/teacher_profile';
import ProjectBank from './components/student/student_projectBank';
import { Route, Routes, useParams } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/students/StudentHome/:userId/*" element={<PageWrapper component={StudentHome} />} />
      <Route path="/teachers/TeacherHome/:userId/*" element={<PageWrapper component={TeacherHome} />} />
      <Route path="/students/StudentProfile/:userId/*" element={<PageWrapper component={StudentProfile} />} />
      <Route path="/teachers/TeacherProfile/:userId/*" element={<PageWrapper component={TeacherProfile} />} />
      <Route path="/students/ProjectBank/:userId/*" element={<PageWrapper component={ProjectBank} />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

function PageWrapper({ component: Component }) {
  const { userId } = useParams();
  return (
    <>
      <Header userId={userId} />
      <Component />
    </>
  );
}

export default App;
