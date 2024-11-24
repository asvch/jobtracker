import React, { useState, useEffect, useCallback, useMemo, useRef} from 'react';
import { Col, Container, Row, Card, Button } from 'react-bootstrap';
import { baseApiURL } from '../api/base.ts';
import { Chart, registerables } from 'chart.js';
import { SankeyController, Flow } from 'chartjs-chart-sankey';

// Add utility functions after imports
const ensureArray = (data) => {
	if (!data) return [];
	return Array.isArray(data) ? data : [];
};

const safelyParseResponse = async (response) => {
	try {
		const data = await response.json();
		return ensureArray(data);
	} catch (error) {
		console.error('Error parsing response:', error);
		return [];
	}
};

Chart.register(SankeyController, Flow, ...registerables);

const findStatus = (value) => {
	let status = '';
	if (value === '1') status = 'Wish List';
	else if (value === '2') status = 'Waiting for Referral';
	else if (value === '3') status = 'No Response';
	else if (value === '4') status = 'Rejected';
	else if (value === '5') status = 'Accepted';
	else if (value === '6') status = 'Took an Interview';

	return status;
};

const KanbanBoard = ({ applicationLists, handleCardClick, handleUpdateDetails, handleDeleteApplication }) => {
	const [expandedCardId, setExpandedCardId] = useState(null);
	const chartRef = useRef(null);
	const chartInstance = useRef(null); // Ref to hold the chart instance

	const colors = {
		Applications: 'brown',
		'Wish List': 'pink',
		'Waiting for Referral': 'purple',
		Applied: 'green',
		Accepted: 'green',
		Rejected: 'red',
		'Took an Interview': 'orange',
		'No Response': 'grey'
	};

	const statusFrom = {
		'Wish List': 'Applications',
		'Waiting for Referral': 'Applications',
		Applied: 'Applications',
		Accepted: 'Applied',
		Rejected: 'Applied',
		'Took an Interview': 'Applied',
		'No Response': 'Applied'
	};

	// Prepare data only if applicationLists is available
	const filteredData = [];
	let cnt = 0;
	let all_cnt = {
		'Wish List': 0,
		'Waiting for Referral': 0,
		Accepted: 0,
		Rejected: 0,
		'Took an Interview': 0,
		'No Response': 0
	};
	if (applicationLists) {
		Object.keys(applicationLists).forEach((status) => {
			const applications = applicationLists[status];
			applications.forEach(() => {
				if (statusFrom[status] === 'Applied') {
					cnt += 1;
				}
				all_cnt[status] += 1;
			});
		});

		Object.keys(all_cnt).forEach((status) => {
			if (all_cnt[status] > 0) {
				filteredData.push({
					from: statusFrom[status],
					to: status,
					flow: all_cnt[status]
				});
			}
		});

		if (cnt > 0) {
			filteredData.push({
				from: 'Applications',
				to: 'Applied',
				flow: cnt
			});
		}
	}

	// Reinitialize the chart whenever applicationLists changes
	useEffect(() => {
		console.log('applicationLists:', applicationLists);
		console.log('filteredData:', filteredData);

		if (applicationLists && filteredData.length > 0) {
			const ctx = chartRef.current.getContext('2d');

			if (chartInstance.current) {
				chartInstance.current.destroy();
			}

			chartInstance.current = new Chart(ctx, {
				type: 'sankey',
				data: {
					datasets: [
						{
							label: 'ATS Flow',
							data: filteredData,
							colorFrom: (c) => colors[c.dataset.data[c.dataIndex].from],
							colorTo: (c) => colors[c.dataset.data[c.dataIndex].to],
							colorMode: 'gradient',
							alpha: 0.5,
							size: 'max'
						}
					]
				}
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [applicationLists]);

	const toggleCardExpansion = (id) => {
		setExpandedCardId((prevId) => (prevId === id ? null : id));
	};

	return (
		<Container style={{ marginTop: '20px', marginBottom: '20px', marginLeft: '110px' }}>
			<Row style={{ marginBottom: '40px' }}>
				<canvas ref={chartRef} />
			</Row>
			<Row>
				{Object.keys(applicationLists).map((status) => (
					<Col key={status} md={3} style={{ marginBottom: '20px' }}>
						{applicationLists[status] && (
							<Card style={{ borderRadius: '5px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', overflow: 'hidden' }}>
								<Card.Header
									as='h5'
									style={{
										backgroundColor: colors[status],
										borderBottom: '1px solid #dee2e6',
										color: 'black'
									}}
								>
									{status}
								</Card.Header>
								<Card.Body style={{ padding: '20px' }}>
									{applicationLists[status].map((jobListing) => (
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
						)}
					</Col>
				))}
			</Row>
		</Container>
	);
};

const ApplicationPage = () => {
	const [applicationList, setApplicationList] = useState([]);
	// eslint-disable-next-line no-unused-vars
	const [_selectedApplication, setSelectedApplication] = useState(null);
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
				.then(safelyParseResponse)
				.then(data => setApplicationList(data))
				.catch(error => {
					console.error('Error fetching applications:', error);
					setApplicationList([]);
				});
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
					// contentType: 'application/json'
				})
					.then(safelyParseResponse)
					.then(data => {
						if (data && data.id) {
							application.id = data.id;
							setApplicationList(prevList => {
								const currentList = ensureArray(prevList);
								return [...currentList, application];
							});
							alert('New application added successfully!');
						} else {
							throw new Error('Invalid response data');
						}
					})
					.catch(error => {
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
					.then(safelyParseResponse)
					.then(() => {
						setApplicationList(prevList => {
							const currentList = ensureArray(prevList);
							return currentList.map(jobListing =>
								jobListing.id === application.id ? application : jobListing
							);
						});
					})
					.catch(error => {
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

	// Update organizedApplications using useMemo
	const organizedApplications = useMemo(() => {
		const validList = ensureArray(applicationList);

		return validList.reduce((acc, jobListing) => {
			if (!jobListing?.status) return acc;

			const status = findStatus(jobListing.status);
			if (!status) return acc;

			if (!acc[status]) {
				acc[status] = [];
			}
			acc[status].push(jobListing);
			return acc;
		}, {});
	}, [applicationList]);

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
