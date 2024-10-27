import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';

export default class SearchCard extends Component {
	constructor(props) {
		super(props);
		console.log('props');
		console.log(props.application);
		this.state = {
			handleCloseEditModal: props.handleCloseEditModal,
			deleteApplication: props.deleteApplication,
			submitFunc: props.submitFunc,
			id: props.application.id,
			jobTitle: props.application.jobTitle,
			companyName: props.application.companyName,
			date: props.application.date,
			jobLink: props.application.jobLink,
			location: props.application.location,
			class: '1'
		};
		console.log(this.state);
	}

	// set data to state automatically corresponding to the attribute 'id' of input field
	// ex: <input id = 'date'> => setState({date: value})
	handleChange(event) {
		this.setState({ [event.target.id]: event.target.value });
	}

	submitAction() {
		alert('Submitted !');
		this.state.handleCloseEditModal();
		const application = {
			id: this.state.id,
			companyName: this.state.companyName,
			jobTitle: this.state.jobTitle,
			date: this.state.date,
			jobLink: this.state.jobLink,
			location: this.state.location,
			status: this.state.class
		};
		if (application.jobLink && !application.jobLink.startsWith('http')) {
			application.jobLink = 'http://' + application.jobLink;
		}
		console.log(application);
		// call parent function to handle data change
		this.state.submitFunc(application);
	}

	render() {
		const functionBtn = (
			<button type='button' className='btn btn-success' onClick={this.submitAction.bind(this)}>
				Create
			</button>
		);
		if (!this.props.application) {
			return <div />;
		}

		return (
			<div>
				<Modal show={this.props.show} onHide={this.state.handleCloseEditModal}>
					<Modal.Header closeButton>
						<Modal.Title>Add New Job</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className='form-group'>
							<label htmlFor='companyName' className='col-form-label'>
								Company Name
							</label>
							<input
								type='text'
								className='form-control'
								id='companyName'
								value={this.state.companyName}
								onChange={this.handleChange.bind(this)}
							/>
						</div>
						<div className='form-group'>
							<label htmlFor='job_title' className='col-form-label'>
								Job Title
							</label>
							<input
								type='text'
								className='form-control'
								id='jobTitle'
								value={this.state.jobTitle}
								onChange={this.handleChange.bind(this)}
							/>
						</div>
						<div className='form-group'>
							<label htmlFor='date' className='col-form-label'>
								Date
							</label>
							<input
								type='date'
								className='form-control'
								id='date'
								value={this.state.date}
								onChange={this.handleChange.bind(this)}
							/>
						</div>
						<div className='form-group'>
							<label htmlFor='jobLink' className='col-form-label'>
								Job link
							</label>
							<input
								type='text'
								className='form-control'
								id='jobLink'
								value={this.state.jobLink}
								onChange={this.handleChange.bind(this)}
							/>
						</div>
						<div className='form-group'>
							<label htmlFor='location' className='col-form-label'>
								Location
							</label>
							<input
								type='text'
								className='form-control'
								id='location'
								value={this.state.location}
								onChange={this.handleChange.bind(this)}
							/>
						</div>
						<div className='input-group mb-3'>
							<div className='input-group-prepend'>
								<label className='input-group-text' htmlFor='class'>
									Application Type
								</label>
							</div>
							<select
								className='custom-select'
								id='class'
								value={this.state.class}
								onChange={this.handleChange.bind(this)}
							>
								<option>Choose...</option>
								<option value='1'>Wish list</option>
								<option value='2'>Waiting for Referral</option>
								<option value='3'>Applied</option>
								<option value='4'>Rejected</option>
							</select>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<button type='button' className='btn btn-secondary' onClick={this.state.handleCloseEditModal}>
							Close
						</button>
						{functionBtn}
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}
