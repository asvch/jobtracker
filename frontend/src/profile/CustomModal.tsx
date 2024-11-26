import React, { useState } from 'react';
import Select from 'react-select';
import { Modal, ModalBody, ModalFooter } from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/esm/ModalHeader';
import axios from 'axios';
import { baseApiURL } from '../api/base.ts';

export enum ModalType {
	TEXT,
	LIST
}

interface CustomModalProps {
	options?: string[];
	name: string;
	profile: any;
	setModalOpen: (open: boolean) => void;
	updateProfile: (profile: any) => void;
	type: ModalType;
}

/**
 * CustomModal component renders a modal dialog for updating a specific profile field.
 *
 * @param {CustomModalProps} props - The properties passed to the CustomModal component.
 * @param {Array} props.options - The options for the select input when modalType is LIST.
 * @param {string} props.name - The name of the profile field to be updated.
 * @param {Object} props.profile - The current profile data.
 * @param {Function} props.setModalOpen - Function to set the modal open state.
 * @param {Function} props.updateProfile - Function to update the profile data.
 * @param {ModalType} props.type - The type of the modal, either TEXT or LIST.
 *
 * @returns {JSX.Element} The rendered CustomModal component.
 */
const CustomModal = (props: CustomModalProps) => {
	const { options, name, profile, setModalOpen, updateProfile, type: modalType } = props;
	const [data, setData] = useState(profile[name]);

	const handleSave = () => {
		console.log({ [name]: data });
		axios
			.post(
				`${baseApiURL}/updateProfile`,
				{
					[name]: data
				},
				{
					headers: {
						userid: localStorage.getItem('userId')!,
						Authorization: `Bearer ${localStorage.getItem('Token')}`
					}
				}
			)
			.then((res) => {
				// setProfile({ ...profile, [name]: data });
				updateProfile({ ...profile, [name]: data });
				setModalOpen(false);
			})
			.catch((err) => {
				console.log(err.message);
				setModalOpen(false);
			});
	};
	return (
		<Modal show={true} centered size='lg'>
			<ModalHeader style={{ backgroundColor: '#296E85', color: '#fff' }}>
				<h5 className='modal-title'>Set {name}</h5>
				<button
					type='button'
					className='btn-close'
					aria-label='Close'
					onClick={() => setModalOpen(false)}
					style={{ backgroundColor: '#fff' }}
				></button>
			</ModalHeader>
			<ModalBody>
				{modalType === ModalType.TEXT && (
					<input
						type='text'
						value={data}
						onChange={(e) => setData(e.target.value)}
						placeholder={`Enter ${name}`}
						style={{ border: 'none', outline: 'none', flex: 1 }}
					/>
				)}
				{modalType === ModalType.LIST && (
					<Select
						defaultValue={profile[name]}
						isSearchable
						isClearable
						isMulti
						options={options}
						onChange={(ele) => setData(ele)}
					/>
				)}
			</ModalBody>
			<ModalFooter>
				<button type='button' className='custom-btn px-3 py-2' onClick={handleSave}>
					Save
				</button>
			</ModalFooter>
		</Modal>
	);
};

export default CustomModal;
