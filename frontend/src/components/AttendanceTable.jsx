export default function AttendanceTable({ records = [], onUpdate }) {
	return (
		<table className="min-w-full text-sm">
			<thead>
				<tr className="bg-gray-50">
					<th className="text-left p-2">Date</th>
					<th className="text-left p-2">User</th>
					<th className="text-left p-2">Status</th>
					<th className="text-left p-2">Actions</th>
				</tr>
			</thead>
			<tbody>
				{records.map((r) => (
					<tr key={r.id} className="border-b">
						<td className="p-2">{r.date}</td>
						<td className="p-2">{r.user?.name || r.userId}</td>
						<td className="p-2 capitalize">{r.status}</td>
						<td className="p-2">
							<select className="border p-1"
								onChange={(e) => onUpdate?.(r.id, e.target.value)}
								defaultValue={r.status}
							>
								<option value="present">Present</option>
								<option value="absent">Absent</option>
								<option value="leave">Leave</option>
							</select>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}



