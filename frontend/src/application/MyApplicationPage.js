import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Col, Container, Row, Card, Button } from 'react-bootstrap';
import { baseApiURL } from '../api/base.ts';
import { Chart, registerables } from 'chart.js';
import { SankeyController, Flow } from 'chartjs-chart-sankey';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

const KanbanBoard = ({ applicationLists, handleCardClick, handleUpdateDetails, handleDeleteApplication, setApplicationList }) => {
	const [expandedCardId, setExpandedCardId] = useState(null);
	const chartRef = useRef(null);
	const chartInstance = useRef(null); // Ref to hold the chart instance
	const categories = {
		'Wish List': "1",
		'Waiting for Referral': "2",
		'No Response': "3",
		'Rejected': "4",
		'Accepted': "5",
		'Took an Interview': "6"
	}
	const [applications, setApplications] = useState(Object.keys(categories).map(() => []))

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

		if (applicationLists) {
			if(filteredData.length > 0){
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
			let temp = [...applications];
			Object.entries(applicationLists).forEach((entry) => {
				temp[parseInt(categories[entry[0]])-1] = entry[1]
			})
			setApplications(temp)
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [applicationLists]);

	const toggleCardExpansion = (id) => {
		setExpandedCardId((prevId) => (prevId === id ? null : id));
	};

	const handleDrag = async (e) => {
		const dst = e.destination
		if(dst !== null){
			const src = e.source
			const newApplications = [...applications]
			const srcArray = newApplications[parseInt(categories[src.droppableId])-1]
			const dstArray = newApplications[parseInt(categories[dst.droppableId])-1]
			const temp = srcArray[src.index];
			temp.status = categories[dst.droppableId]
			try{
				let resp = await fetch(`${baseApiURL}/applications/${temp.id}`, {
					headers: {
						Authorization: 'Bearer ' + localStorage.getItem('token'),
						'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
						'Access-Control-Allow-Credentials': 'true'
					},
					method: 'PUT',
					body: JSON.stringify({
						application: temp
					}),
					contentType: 'application/json'
				})
				if(!resp.ok){
					alert('Update Failed!');
					return;
				}
				setApplicationList((prevApplicationList) => {
					const updatedApplicationList = prevApplicationList.map((jobListing) =>
						jobListing.id === temp.id ? temp : jobListing
					);
					return updatedApplicationList;
				});
			} catch {
				alert('Update Failed!');
				return;
			}
			const removed = srcArray.splice(src.index,1)[0]
			removed.status = categories[dst.droppableId]
			if(dstArray.length > 0) dstArray.splice(dst.index,0, removed)
			else dstArray.push(removed)
			setApplications(newApplications)
		}
	}

	return (
		<Container style={{ marginTop: '20px', marginBottom: '20px', marginLeft: '110px' }}>
			<Row style={{ marginBottom: '40px' }}>
				<canvas ref={chartRef} />
			</Row>
			<Row>
				<DragDropContext onDragEnd={handleDrag}>
				{Object.keys(categories).map((status) => (
					<Col key={status} md={3} style={{ marginBottom: '20px' }}>
						{(
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
									<Droppable droppableId={`${status}`} ignoreContainerClipping={ true }>
											{(provided) => (
												<div ref={provided.innerRef}>
									{applications[parseInt(categories[status])-1].length > 0 && applications[parseInt(categories[status])-1].map((jobListing,index) => (
										<Draggable
											draggableId={jobListing.id.toString()}
											key={jobListing.id}
											index={index}
										>
											{(provided) => (
												<div
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
												>
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
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
									</div>)}
									</Droppable>
								</Card.Body>
							</Card>
						)}
					</Col>
				))}
				</DragDropContext>
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
			setApplicationList={setApplicationList}
		/>
	);
};

export default ApplicationPage;
