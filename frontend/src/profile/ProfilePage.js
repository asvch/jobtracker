import React, { useState } from 'react';
import Modal, { ModalType } from './CustomModal.tsx';
import CustomProfileModal from './CustomProfileModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CONSTANTS } from '../data/Constants';
import { faEnvelope, faLocationDot, faPenToSquare, faPhone } from '@fortawesome/free-solid-svg-icons';

const ProfilePage = (props) => {
	const [activeModal, setActiveModal] = useState('');

	const profile = props.profile;

	const fields = [
		{ name: CONSTANTS.PROFILE.SKILLS, label: 'Skills', options: CONSTANTS.SKILLS },
		{ name: CONSTANTS.PROFILE.EXPERIENCE_LEVEL, label: 'Experience Level', options: CONSTANTS.EXPERIENCE_LEVEL },
		{ name: CONSTANTS.PROFILE.PREFERRED_LOCATIONS, label: 'Preferred Locations', options: CONSTANTS.COUNTRIES },
		{ name: CONSTANTS.PROFILE.SUMMARY, label: 'Summary' },
		{ name: CONSTANTS.PROFILE.GITHUB, label: 'GitHub Username' },
		{ name: CONSTANTS.PROFILE.CITIZENSHIP, label: 'Citizenship' },
		{ name: CONSTANTS.PROFILE.FAMILY_STATUS, label: 'Family Status' },
		{ name: CONSTANTS.PROFILE.LANGUAGES, label: 'Languages', options: CONSTANTS.SPOKEN_LANGUAGES },
		{ name: CONSTANTS.PROFILE.HOBBIES, label: 'Hobbies', options: CONSTANTS.HOBBIES }
	];

	const closeModal = () => setActiveModal('');

	const renderModal = () => {
		if (activeModal) {
			const options = fields.find((field) => field.name === activeModal)?.options;

			const modalProps = {
				name: activeModal,
				options,
				profile,
				type: options ? ModalType.LIST : ModalType.TEXT,
				setModalOpen: closeModal,
				updateProfile: props.updateProfile
			};

			if (activeModal === 'profile') {
				return <CustomProfileModal {...modalProps} />;
			}

			return <Modal {...modalProps} />;
		}
		return null;
	};

	return (
		<div className='container' style={{ marginLeft: '8%', marginTop: '4%' }}>
			<div className='row gx-5'>
				<div className='col-4 my-3'>
					<div
						className='card p-4'
						style={{
							boxShadow: '0px 5px 12px 0px rgba(0,0,0,0.1)'
						}}
					>
						<FontAwesomeIcon
							icon={faPenToSquare}
							size='1x'
							onClick={() => setActiveModal('profile')}
							cursor='pointer'
							style={{ position: 'absolute', top: '15', right: '15' }}
						/>
						<div className='text-center my-3'>
							<div
								className='text-center mt-3 d-inline-flex justify-content-center align-items-center'
								style={{
									height: '200px',
									width: '200px',
									borderRadius: '100%',
									backgroundColor: '#296E85',
									color: '#fff',
									boxShadow: '0px 5px 12px 10px rgba(0,0,0,0.1)'
								}}
							>
								<span style={{ fontSize: 60, letterSpacing: 1.2 }}>{profile.fullName}</span>
							</div>
						</div>
						<div className='text-center mt-3'>
							<h3 className='card-title mb-1'>{profile[CONSTANTS.PROFILE.NAME] || ''}</h3>
							<span style={{ fontSize: 20 }}>{profile[CONSTANTS.PROFILE.UNIVERSITY] || ''}</span>
						</div>
						<hr className='my-4' />
						<div className='row gy-4'>
							<div className='col-12 d-flex align-items-center'>
								<FontAwesomeIcon icon={faEnvelope} size='1x' />
								<span className='mx-2'>{profile[CONSTANTS.PROFILE.EMAIL] || ''}</span>
							</div>
							<div className='col-12 d-flex align-items-center'>
								<FontAwesomeIcon icon={faPhone} size='1x' />
								<span className='mx-2'>{profile[CONSTANTS.PROFILE.CONTACT] || ''}</span>
							</div>
							<div className='col-12 d-flex align-items-center'>
								<FontAwesomeIcon icon={faLocationDot} size='1x' />
								<span className='mx-2'>{profile[CONSTANTS.PROFILE.ADDRESS] || ''}</span>
							</div>
						</div>
					</div>
				</div>
				<div className='col-8 px-0'>
					{fields.map(({ name, label }) => (
						<div className='card my-3 p-2' style={{ boxShadow: '0px 5px 12px 0px rgba(0,0,0,0.1)' }} key={name}>
							<div className='card-body'>
								<div className='d-flex justify-content-between px-0 mb-3'>
									<h4 className='card-title mb-0 mx-1'>{label}</h4>
									<FontAwesomeIcon
										icon={faPenToSquare}
										size='1x'
										onClick={() => setActiveModal(name)}
										cursor='pointer'
										disabled={!profile[name]}
									/>
								</div>
								<div className='d-flex flex-wrap'>
									{(Array.isArray(profile[name]) ? profile[name].map((v) => v.label) : [profile[name]])?.map(
										(name, index) => (
											<span
												className='badge rounded-pill m-1 py-2 px-3'
												style={{
													border: '2px solid',
													backgroundColor: '#296e85',
													fontSize: 16,
													fontWeight: 'normal'
												}}
												key={index}
											>
												{name}
											</span>
										)
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			{renderModal()}
		</div>
	);
};

export default ProfilePage;
