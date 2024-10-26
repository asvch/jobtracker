import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Col, Container, Row, Card, Button } from 'react-bootstrap';
import { baseApiURL } from '../api/base.ts';
import { Chart, registerables } from 'chart.js';
import { SankeyController, Flow } from 'chartjs-chart-sankey';

Chart.register(SankeyController, Flow, ...registerables);

const findStatus = (value) => {
	let status = '';
	if (value === '1') status = 'Wish List';
	else if (value === '2') status = 'Waiting for referral';
	else if (value === '3') status = 'Applied';
	else if (value === '4') status = 'Rejected';

	return status;
};

const KanbanBoard = ({ applicationLists, handleCardClick, handleUpdateDetails, handleDeleteApplication }) => {
	const [expandedCardId, setExpandedCardId] = useState(null);

	const toggleCardExpansion = (id) => {
		setExpandedCardId((prevId) => (prevId === id ? null : id));
	};

	const chartRef = useRef(null);

	useEffect(() => {
		const colors = {
			Applications: 'purple',
			Applied: '#90EE90', // Light Green for Applied
			Rejected: '#FF0000', // Red for Rejected
			'Wish List': '#ffff00', // Yellow for Wish List
			'Waiting for referral': '#b3afff', // Light Blue for Waiting for referral
			Interview: 'orange',
			'No Response': 'grey',
			Offer: 'green',
			'No Offer': 'red',
			'Offer Accepted': 'green',
			'Offer Declined': 'red'
		};

		const getHover = (key) => colors[key];
		const getColor = (key) => colors[key];

		const ctx = chartRef.current.getContext('2d');

		const chart = new Chart(ctx, {
			type: 'sankey',
			data: {
				datasets: [
					{
						label: 'ATS Flow',
						data: [
							{ from: 'Applications', to: 'Waiting for referral', flow: 10 },
							{ from: 'Applications', to: 'Wish List', flow: 15 },
							{ from: 'Applications', to: 'Applied', flow: 25 },
							{ from: 'Applied', to: 'Rejected', flow: 6 },
							{ from: 'Applied', to: 'Interview', flow: 10 },
							{ from: 'Applied', to: 'No Response', flow: 9 },
							{ from: 'Interview', to: 'Offer', flow: 6 },
							{ from: 'Interview', to: 'Rejected', flow: 4 },
							{ from: 'Offer', to: 'Offer Accepted', flow: 5 },
							{ from: 'Offer', to: 'Offer Declined', flow: 1 }
						],

						colorFrom: (c) => getColor(c.dataset.data[c.dataIndex].from),
						colorTo: (c) => getColor(c.dataset.data[c.dataIndex].to),

						colorMode: 'gradient',
						alpha: 0.5,
						size: 'max',
						// no overlap
						overlap: 0
					}
				]
			}
		});

		return () => {
			chart.destroy(); // Clean up on component unmount
		};
	}, []);

	return (
		<Container style={{ marginTop: '20px', marginBottom: '20px', marginLeft: '110px' }}>
			<Row style={{ marginBottom: '40px' }}>
				<canvas ref={chartRef} />
			</Row>
			<Row>
				{['Wish List', 'Waiting for referral', 'Applied', 'Rejected'].map((status) => (
					<Col key={status} md={3} style={{ marginBottom: '20px' }}>
						<Card style={{ borderRadius: '5px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', overflow: 'hidden' }}>
							<Card.Header
								as='h5'
								style={{
									backgroundColor:
										status === 'Wish List'
											? '#ffff00'
											: status === 'Waiting for referral'
												? '#b3afff'
												: status === 'Applied'
													? '#90EE90'
													: status === 'Rejected'
														? '#FF0000'
														: '',
									borderBottom: '1px solid #dee2e6',
									color: 'black'
								}}
							>
								{status}
							</Card.Header>
							<Card.Body style={{ padding: '20px' }}>
								{applicationLists &&
									applicationLists[status] &&
									applicationLists[status].map((jobListing) => (
										<div key={jobListing.id} style={{ marginBottom: '10px' }}>
											<Card
												style={{
													borderColor: '#ccc',
													borderRadius: '5px',
													boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
													transition: '0.3s',
													cursor: 'pointer',
													marginBottom: '10px'
												}}
											>
												<Card.Body style={{ padding: '20px' }}>
													<div>
														<strong>{jobListing?.jobTitle}</strong> - {jobListing?.companyName}
													</div>
													{expandedCardId === jobListing.id && (
														<>
															<div>
																<strong>Location:</strong> {jobListing?.location}
															</div>
															<div>
																<strong>Date:</strong> {jobListing?.date}
															</div>
														</>
													)}
													<Button onClick={() => toggleCardExpansion(jobListing.id)}>
														{expandedCardId === jobListing.id ? 'Collapse' : 'Expand'}
													</Button>
												</Card.Body>
											</Card>
										</div>
									))}
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>
		</Container>
	);
};

const ApplicationPage = () => {
	const [applicationList, setApplicationList] = useState([]);
	const [selectedApplication, setSelectedApplication] = useState(null);
	const [isChanged, setISChanged] = useState(true);

	useEffect(() => {
		// Fetch the list of applications from the backend API
		if (isChanged) {
			fetch(`${baseApiURL}/applications`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
					'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
					'Access-Control-Allow-Credentials': 'true'
				},
				method: 'GET'
			})
				.then((response) => response.json())
				.then((data) => setApplicationList(data));
		}
	}, [isChanged]);

	var handleCardClick = (jobListing) => {
		setSelectedApplication(jobListing);
	};

	const handleUpdateDetails = useCallback(
		(id, job, company, location, date, status, jobLink, notes, updates) => {
			let application = {
				id: id ? id : null,
				jobTitle: job,
				companyName: company,
				location: location,
				date: date,
				status: status,
				jobLink: jobLink,
				notes: notes,
				updates: updates
			};

			if (application.id === null) {
				fetch(`${baseApiURL}/applications`, {
					headers: {
						Authorization: 'Bearer ' + localStorage.getItem('token'),
						'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
						'Access-Control-Allow-Credentials': 'true'
					},
					method: 'POST',
					body: JSON.stringify({
						application: {
							...application
						}
					}),
					contentType: 'application/json'
				})
					.then((response) => response.json())
					.then((data) => {
						// Update the application id
						application.id = data.id;
						setApplicationList((prevApplicationList) => [...prevApplicationList, application]);

						// Display an alert for new application added successfully
						alert('New application added successfully!');
					})
					.catch((error) => {
						// Handle error
						console.error('Error:', error);
						alert('Adding application failed!');
					});
			} else {
				fetch(`${baseApiURL}/applications/${application.id}`, {
					headers: {
						Authorization: 'Bearer ' + localStorage.getItem('token'),
						'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
						'Access-Control-Allow-Credentials': 'true'
					},
					method: 'PUT',
					body: JSON.stringify({
						application: application
					}),
					contentType: 'application/json'
				})
					.then((response) => response.json())
					.then((data) => {
						setApplicationList((prevApplicationList) => {
							const updatedApplicationList = prevApplicationList.map((jobListing) =>
								jobListing.id === application.id ? application : jobListing
							);
							return updatedApplicationList;
						});
					})
					.catch((error) => {
						// Handle error
						console.error('Error:', error);
						alert('Update Failed!');
					});
			}
			setSelectedApplication(null);
		},
		[setApplicationList]
	);

	const handleDeleteApplication = (application) => {
		fetch(`${baseApiURL}/applications/${application?.id}`, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
				'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
				'Access-Control-Allow-Credentials': 'true'
			},
			method: 'DELETE',
			body: JSON.stringify({
				application: application
			}),
			contentType: 'application/json'
		})
			.then((response) => response.json())
			.then((data) => {
				setISChanged(true);
			})
			.catch((error) => {
				// Handle error
				console.error('Error:', error);
				alert('Error while deleting the application!');
			});
		setISChanged(false);
		setSelectedApplication(null);
	};

	const organizedApplications = applicationList.reduce((acc, jobListing) => {
		const status = findStatus(jobListing.status);
		if (!acc[status]) {
			acc[status] = [];
		}
		acc[status].push(jobListing);
		return acc;
	}, {});

	return (
		<KanbanBoard
			applicationLists={organizedApplications}
			handleCardClick={handleCardClick}
			handleUpdateDetails={handleUpdateDetails}
			handleDeleteApplication={handleDeleteApplication}
		/>
	);
};

export default ApplicationPage;
