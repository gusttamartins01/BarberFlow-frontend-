import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Home from './pages/Home';
import ManagementPage from './pages/ManagementPage';
import SchedulingPage from './pages/SchedulingPage';
import ServicesPage from './pages/ServicesPage';

export default function App() {
	return (
		<BrowserRouter>
			<Navbar />

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/scheduling" element={<SchedulingPage />} />
				<Route path="/services" element={<ServicesPage />} />
				<Route
					path="/appointments"
					element={<ManagementPage section="appointments" />}
				/>
				<Route path="/barbers" element={<ManagementPage section="barbers" />} />
				<Route
					path="/business-hours"
					element={<ManagementPage section="business-hours" />}
				/>
				<Route path="/combos" element={<ManagementPage section="combos" />} />
				<Route
					path="/customers"
					element={<ManagementPage section="customers" />}
				/>
			</Routes>
		</BrowserRouter>
	);
}
