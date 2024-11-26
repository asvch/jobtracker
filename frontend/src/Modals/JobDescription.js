import React from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'react-bootstrap';

const JobDescription = (props) => {
	const { selectedJob, setState } = props;
	const { qualifications, responsibilities, benefits } = selectedJob;
	return (
		<Modal centered show={true} scrollable size='xl'>
			<Modal.Header style={{ backgroundColor: '#296E85', color: '#fff' }}>
				<h4 className='mb-0 p-2'>Job Description</h4>
			</Modal.Header>
			<ModalBody className='p-4'>
				{qualifications && qualifications.length > 0 && (
					<div className='mb-4'>
						<div style={{ fontSize: 22, fontWeight: '500' }}>Qualifications</div>
						<ul>
							{qualifications.map((ele, index) => (
								<li key={index}>{ele}</li>
							))}
						</ul>
					</div>
				)}
				{responsibilities && responsibilities.length > 0 && (
					<div className='my-4'>
						<div style={{ fontSize: 22, fontWeight: '500' }}>Responsibilities</div>
						<ul>
							{responsibilities.map((ele, index) => (
								<li key={index}>{ele}</li>
							))}
						</ul>
					</div>
				)}
				{benefits && benefits.length > 0 && (
					<div className='mt-4'>
						<div style={{ fontSize: 22, fontWeight: '500' }}>Benefits</div>
						<ul>
							{benefits.map((ele, index) => (
								<li key={index}>{ele}</li>
							))}
						</ul>
					</div>
				)}
			</ModalBody>
			<ModalFooter>
				<Button className='custom-btn px-3 py-2' onClick={() => setState(null)}>
					Close
				</Button>
			</ModalFooter>
		</Modal>
	);
};

export default JobDescription;
