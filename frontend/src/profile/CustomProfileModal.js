import axios from 'axios';
import React, { useState } from 'react';
import { Modal, ModalBody, ModalFooter, Form } from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/esm/ModalHeader';
import { CONSTANTS } from '../data/Constants';
import { baseApiURL } from '../api/base.ts';

const CustomProfileModal = (props) => {
	const { profile, setProfile, setModalOpen, updateProfile } = props;
	const [data, setData] = useState(profile);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState(''); // new state for error message
	const [skills, setSkills] = useState(data[CONSTANTS.PROFILE.SKILLS]);
	const [experienceLevel, setExperienceLevel] = useState(data[CONSTANTS.PROFILE.EXPERIENCE_LEVEL]);
	const [location, setLocation] = useState(data[CONSTANTS.PROFILE.LOCATION]);

	const handleSave = async () => {
		if (data[CONSTANTS.PROFILE.NAME] === '' || skills === '' || experienceLevel === '' || location === '') {
			setError(true);
			setErrorMessage('Please fill in all required fields.'); // set error message
		} else {
			try {
				await axios.post(
					`${baseApiURL}/updateProfile`,
					{
						...data,
						[CONSTANTS.PROFILE.SKILLS]: skills,
						[CONSTANTS.PROFILE.EXPERIENCE_LEVEL]: experienceLevel,
						[CONSTANTS.PROFILE.LOCATION]: location
					},
					{
						headers: {
							userid: profile.id,
							Authorization: `Bearer ${localStorage.getItem('userId')}`
						}
					}
				);

				updateProfile({ ...profile, ...data });
				console.log(data);
				setModalOpen(false);
			} catch (err) {
				console.log(err.message);
				setModalOpen(false);
			}
		}
	};

	const fields = [
		{ label: 'Name', key: CONSTANTS.PROFILE.NAME },
		{ label: 'Email', key: CONSTANTS.PROFILE.EMAIL },
		{ label: 'Phone', key: CONSTANTS.PROFILE.CONTACT },
		{ label: 'Address', key: CONSTANTS.PROFILE.ADDRESS }
	];

	return (
		<Modal show={true} centered>
			<ModalHeader>
				<h5 class='modal-title'>Edit Details</h5>
				<button type='button' class='btn-close' aria-label='Close' onClick={() => setModalOpen(false)}></button>
			</ModalHeader>
			<ModalBody>
				{error && <div style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>{errorMessage}</div>}
				<Form>
					{fields.map((field) => (
						<Form.Group className='mb-3'>
							<Form.Label>
								{field.label}
								<span style={{ color: 'red' }}>*</span>
							</Form.Label>
							<Form.Control
								type='text'
								placeholder={`Enter ${field.label.toLowerCase()}`}
								value={data[field.key]}
								onChange={(e) => setData({ ...data, [field.key]: e.target.value })}
							/>
							{error && <span style={{ color: 'red', fontSize: 12 }}>This field is required</span>}
						</Form.Group>
					))}

					{/* Add Form.Group sections for other fields here */}
				</Form>
			</ModalBody>
			<ModalFooter>
				<button type='button' className='btn btn-primary' onClick={handleSave}>
					Save
				</button>
			</ModalFooter>
		</Modal>
	);
};

export default CustomProfileModal;
