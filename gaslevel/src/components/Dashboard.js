import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import GaugeChart from './charts/GaugeChart';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Dashboard() {
  const [gasLevel, setGasLevel] = useState(0);
  const [loading, setLoading] = useState(true);
  const maxGasLevel = 40;
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/login');
      } else {
        const gasLevelRef = ref(db, 'LPG_Level/gaslevel');

        onValue(gasLevelRef, (snapshot) => {
          const gasLevelData = snapshot.val();
          setGasLevel(gasLevelData ? gasLevelData : 0);
          setLoading(false);
        });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>User Dashboard</h2>
      <p>Your current LPG gas level:</p>
      <div className="gauge-container">
        <GaugeChart value={gasLevel} maxValue={maxGasLevel} />
        <div className="gas-level-text">
          ({gasLevel} / {maxGasLevel})
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

