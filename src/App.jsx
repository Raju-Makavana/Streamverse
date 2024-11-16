import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Mainlayout from './sections/layout/Mainlayout';
import { AuthProvider } from './context/AuthProvider';
import Login from './pages/Login';
import Browse from './pages/Browse';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import Home from './pages/Home';
import TVShowsPage from './pages/TvShow';
import MoviesPage from './pages/Movies';
import NewsAndPopularPage from './pages/News';
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
           <Route path="/login" element={<Login />} />

          <Route element={<Mainlayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/tv-shows" element={<TVShowsPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/news" element={<NewsAndPopularPage />} />
          {/* <Route path="/my-list" element={<Profile />} /> */}

            
            <Route path="/browse" element={<Browse />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/profile" element={<Profile />} />
            {/* Add other routes */}
          </Route>

          {/* Default Redirect */}
          <Route
              path="/"
              element={
  
                  <Login />
               
              }
            />

        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;