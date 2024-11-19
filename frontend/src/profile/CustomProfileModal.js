import axios from 'axios';
import React, { useState } from 'react';
import { Modal, ModalBody, ModalFooter, Form, Button } from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/esm/ModalHeader';
import { CONSTANTS } from '../data/Constants';
import { baseApiURL } from '../api/base.ts';

/**
 * Converts a file to a Base64 string.
 *
 * @param {File} file - The file to be converted.
 * @returns {Promise<string>} A promise that resolves to the Base64 string representation of the file.
 * @throws {Error} If the file cannot be converted to Base64.
 */
const convertFileToBase64 = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			resolve(reader.result); // This will contain the Base64 string
		};

		reader.onerror = () => {
			reject(new Error('Failed to convert file to Base64'));
		};

		reader.readAsDataURL(file); // Read the file as a Data URL (Base64)
	});
};

/**
 * CustomProfileModal component allows users to edit their profile details.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.profile - The user's profile data.
 * @param {Function} props.setModalOpen - Function to control the visibility of the modal.
 * @param {Function} props.updateProfile - Function to update the profile data.
 *
 * @returns {JSX.Element} The rendered CustomProfileModal component.
 */
const CustomProfileModal = (props) => {
	const { profile, setModalOpen, updateProfile } = props;
	const [data, setData] = useState(profile);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState(''); // new state for error message

	const skills = data[CONSTANTS.PROFILE.SKILLS];
	const experienceLevel = data[CONSTANTS.PROFILE.EXPERIENCE_LEVEL];
	const location = data[CONSTANTS.PROFILE.LOCATION];

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
							// userid: profile.id,
							// Authorization: `Bearer ${localStorage.getItem('userId')}`
							Authorization: `Bearer ${localStorage.getItem('token')}`
						}
					}
				);

				updateProfile({ ...profile, ...data });
				console.log(data);
				setModalOpen(false);
			} catch (err) {
				console.log(err.message);
				console.log('Error in HandleSave: ', data)
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
					<Form.Group className='mb-3' controlId='formFile'>
						<Form.Label>Profile Picture</Form.Label>
						<Form.Control
							type='file'
							accept='.png'
							onChange={async (e) => {
								const b64Image = await convertFileToBase64(e.target.files[0]);
								setData({ ...data, picture: b64Image });
							}}
						/>
						{profile.picture && (
							<Button variant='danger' onClick={() => setData({ ...data, picture: undefined })}>
								Delete
							</Button>
						)}
					</Form.Group>
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
