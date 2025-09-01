import { Bar } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AttendanceChart({ stats }) {
	const labels = Object.keys(stats || {});
	const values = Object.values(stats || {});
	const data = {
		labels,
		datasets: [
			{
				label: 'Attendance %',
				data: values,
				backgroundColor: 'rgba(99, 102, 241, 0.5)',
			},
		],
	};
	const options = { responsive: true, plugins: { legend: { position: 'top' } } };
	return <Bar options={options} data={data} />;
}



