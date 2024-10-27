import React, { useState, useEffect, useCallback } from 'react';
import { Card, Col, Container, Row, Modal, Button } from 'react-bootstrap';
import { baseApiURL } from '../api/base.ts';

const ApplicationsList = ({
	applicationList,
	handleCardClick,
	selectedApplication,
	handleUpdateDetails,
	handleDeleteApplication
}) => {
	const [closeModal, setCloseModal] = useState(true);
	const [job, setJob] = useState();
	const [company, setCompany] = useState();
	const [location, setLocation] = useState();
	const [status, setStatus] = useState();
	const [date, setDate] = useState();
	const [jobLink, setJobLink] = useState();
	const [isCreate, setIsCreate] = useState();
	const [searchCriteria, setSearchCriteria] = useState({
		jobTitle: '',
		companyName: '',
		location: '',
		status: ''
	});
	const [notes, setNotes] = useState('');
	const [updates, setUpdates] = useState('');

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

	const filteredApplications = applicationList.filter((jobListing) => {
		const titleMatch = jobListing.jobTitle.toLowerCase().includes(searchCriteria.jobTitle.toLowerCase());
		const companyMatch = jobListing.companyName.toLowerCase().includes(searchCriteria.companyName.toLowerCase());
		const locationMatch = jobListing.location.toLowerCase().includes(searchCriteria.location.toLowerCase());
		const statusMatch = jobListing.status === searchCriteria.status || searchCriteria.status === '';

		return titleMatch && companyMatch && locationMatch && statusMatch;
	});

	return (
		<>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					marginBottom: '20px'
				}}
			>
				<div style={{ marginRight: '20px', marginLeft: '110px' }}>
					<label>Job Title:</label>
					<input
						type='text'
						value={searchCriteria.jobTitle}
						onChange={(e) => setSearchCriteria({ ...searchCriteria, jobTitle: e.target.value })}
					/>
				</div>

				<div style={{ marginRight: '20px' }}>
					<label>Company Name:</label>
					<input
						type='text'
						value={searchCriteria.companyName}
						onChange={(e) => setSearchCriteria({ ...searchCriteria, companyName: e.target.value })}
					/>
				</div>

				<div style={{ marginRight: '20px' }}>
					<label>Location:</label>
					<input
						type='text'
						value={searchCriteria.location}
						onChange={(e) => setSearchCriteria({ ...searchCriteria, location: e.target.value })}
					/>
				</div>

				<div>
					<label>Status:</label>
					<select
						value={searchCriteria.status}
						onChange={(e) => setSearchCriteria({ ...searchCriteria, status: e.target.value })}
					>
						<option value=''>All</option>
						<option value='1'>Wish list</option>
						<option value='2'>Waiting for Referral</option>
						<option value='3'>No Response</option>
						<option value='4'>Rejected</option>
						<option value='5'>Accepted</option>
						<option value='6'>Took an Interview</option>
					</select>
				</div>
			</div>

			<Button
				style={{ marginLeft: '11%', marginTop: '4%', backgroundColor: '#296E85' }}
				size='lg'
				onClick={() => {
					handleCardClick(null);
					setCloseModal(false);
					setIsCreate(true);
					setJob(null);
					setCompany(null);
					setLocation(null);
					setStatus(null);
					setDate(null);
					setStatus(null);
					setJobLink(null);
				}}
			>
				+ Add New Application
			</Button>
			<Container style={{ marginTop: '20px' }}>
				<Row>
					{filteredApplications.map((jobListing) => (
						<Col key={jobListing.id} md={12} style={{ marginBottom: '20px' }}>
							<Card
								style={{
									marginLeft: '10%',
									borderColor: '#ccc',
									borderRadius: '5px',
									boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
									transition: '0.3s',
									cursor: 'pointer'
								}}
								onClick={() => {
									handleCardClick(jobListing);
									setCloseModal(false);
									setJob(jobListing?.jobTitle);
									setCompany(jobListing?.companyName);
									setLocation(jobListing?.location);
									setStatus(jobListing?.status);
									setDate(jobListing?.date);
									setStatus(jobListing?.status);
									setJobLink(jobListing?.jobLink);
									setIsCreate(false);
								}}
							>
								<Card.Body style={{ padding: '20px' }}>
									<Row>
										<Col sm={6} mb={3} mb-sm={0}>
											<Card.Title style={{ fontSize: '20px' }}>{jobListing?.jobTitle}</Card.Title>
											<Card.Subtitle style={{ fontSize: '16px' }}>{jobListing?.companyName}</Card.Subtitle>
										</Col>
										<Col sm={6} mb={3} mb-sm={0}>
											<Card.Text style={{ fontSize: '14px' }}>
												<div style={{ display: 'flex' }}>
													<div>Location: </div>
													<div>{jobListing.location}</div>
												</div>
												<div style={{ display: 'flex' }}>
													<div>Date: </div>
													<div>{jobListing.date}</div>
												</div>
												<div style={{ display: 'flex' }}>
													<div>Status: </div>
													<div>{findStatus(jobListing.status)}</div>
												</div>
											</Card.Text>
										</Col>
										<Col sm={12} mb={3} mb-sm={0}>
											<Card.Text style={{ fontSize: '14px' }}>
												<div style={{ display: 'flex' }}>
													<div>Notes: </div>
													<div>{jobListing.notes}</div>
												</div>
											</Card.Text>
										</Col>
										<Col sm={12} mb={3} mb-sm={0}>
											<Card.Text style={{ fontSize: '14px' }}>
												<div style={{ display: 'flex' }}>
													<div>Updates: </div>
													<div>{jobListing.updates}</div>
												</div>
											</Card.Text>
										</Col>
									</Row>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
			</Container>

			{/* Modal for updating details */}
			<Modal show={!closeModal} onHide={() => setCloseModal(true)}>
				<Modal.Header closeButton>
					<Modal.Title>Update Details</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{
						<>
							<div className='form-group'>
								<label className='col-form-label'>Job Title</label>
								<input
									type='text'
									className='form-control'
									id='jobTitle'
									placeholder='Job Title'
									value={job}
									onChange={(e) => setJob(e.target.value)}
								/>
							</div>

							<div className='form-group'>
								<label className='col-form-label'>Company Name</label>
								<input
									type='text'
									className='form-control'
									id='companyName'
									placeholder='Company Name'
									value={company}
									onChange={(e) => setCompany(e.target.value)}
								/>
							</div>

							<div className='form-group'>
								<label className='col-form-label'>Date</label>
								<input
									type='date'
									className='form-control'
									id='date'
									value={date}
									onChange={(e) => setDate(e.target.value)}
								/>
							</div>

							<div className='form-group'>
								<label className='col-form-label'>Job Link</label>
								<input
									type='text'
									className='form-control'
									id='jobLink'
									placeholder='Job Link'
									value={jobLink}
									onChange={(e) => setJobLink(e.target.value)}
								/>
							</div>

							<div className='form-group'>
								<label className='col-form-label'>Location</label>
								<input
									type='text'
									className='form-control'
									id='location'
									placeholder='Location'
									value={location}
									onChange={(e) => setLocation(e.target.value)}
								/>
							</div>
							<div className='form-group'>
								<label className='col-form-label'>Notes</label>
								<textarea
									className='form-control'
									id='notes'
									placeholder='Add notes...'
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
								/>
							</div>
							<div className='form-group'>
								<label className='col-form-label'>Updates</label>
								<textarea
									className='form-control'
									id='updates'
									placeholder='Add updates...'
									value={updates}
									onChange={(e) => setUpdates(e.target.value)}
								/>
							</div>

							<div className='input-group mb-3'>
								<div className='input-group-prepend'>
									<label className='input-group-text'>Application Type</label>
								</div>
								<select
									className='custom-select'
									id='status'
									value={status}
									onChange={(e) => setStatus(e.target.value)}
								>
									<option>Choose...</option>
									<option value='1'>Wish list</option>
									<option value='2'>Waiting for Referral</option>
									<option value='3'>No Response</option>
									<option value='4'>Rejected</option>
									<option value='5'>Accepted</option>
									<option value='6'>Took an Interview</option>
								</select>
							</div>
						</>
					}
				</Modal.Body>
				<Modal.Footer>
					{!isCreate && (
						<>
							<Button
								variant='danger'
								onClick={(e) => {
									e.preventDefault();
									handleDeleteApplication(selectedApplication);
									setCloseModal(true);
								}}
							>
								Delete
							</Button>{' '}
						</>
					)}
					<Button
						variant='success'
						onClick={(e) => {
							e.preventDefault();
							let jobTitle = document.querySelector('#jobTitle').value;
							let companyName = document.querySelector('#companyName').value;
							let location = document.querySelector('#location').value;
							let date = document.querySelector('#date').value;
							let status = document.querySelector('#status').value;
							let jobLink = document.querySelector('#jobLink').value;
							handleUpdateDetails(
								selectedApplication?.id,
								jobTitle,
								companyName,
								location,
								date,
								status,
								jobLink,
								notes,
								updates
							);
							setCloseModal(true);
						}}
					>
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</>
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

	return (
		<ApplicationsList
			applicationList={applicationList}
			handleCardClick={handleCardClick}
			selectedApplication={selectedApplication}
			handleUpdateDetails={handleUpdateDetails}
			handleDeleteApplication={handleDeleteApplication}
		/>
	);
};
export default ApplicationPage;
