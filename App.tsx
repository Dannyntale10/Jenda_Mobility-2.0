import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Rentals } from './pages/Rentals';
import { Fleet } from './pages/Fleet';
import { ISP } from './pages/ISP';
import { LegalAI } from './pages/LegalAI';
import { MOCK_FLEET, MOCK_PROPERTIES, MOCK_SUBSCRIBERS, MOCK_ANALYTICS } from './constants';

const AppContent: React.FC = () => {
    const location = useLocation();
    const [contextData, setContextData] = useState<any>({});

    // Dynamic Context Switching for AI
    useEffect(() => {
        const path = location.pathname;
        let data = {};
        if (path === '/' || path === '/dashboard') {
            data = { type: 'Dashboard', stats: MOCK_ANALYTICS };
        } else if (path.includes('rentals') || path.includes('short-stay')) {
            data = { type: 'Rentals', properties: MOCK_PROPERTIES };
        } else if (path.includes('fleet')) {
            data = { type: 'Fleet', vehicles: MOCK_FLEET };
        } else if (path.includes('isp')) {
            data = { type: 'ISP', subscribers: MOCK_SUBSCRIBERS };
        } else if (path.includes('legal')) {
            data = { type: 'Legal', context: 'Ugandan Rental & Telecom Law' };
        }
        setContextData(data);
    }, [location]);

    return (
        <Layout contextData={contextData}>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/rentals" element={<Rentals />} />
                <Route path="/short-stay" element={<Rentals />} /> {/* Reusing Rentals for demo simplicity */}
                <Route path="/fleet" element={<Fleet />} />
                <Route path="/isp" element={<ISP />} />
                <Route path="/legal" element={<LegalAI />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Layout>
    );
};

const