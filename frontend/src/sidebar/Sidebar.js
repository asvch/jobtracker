import React, { Component } from 'react';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

import '../static/Sidebar.css';

const options = [
	{ label: 'Search', icon: 'fas fa-search', page: 'SearchPage' },
	{ label: 'Manage', icon: 'fas fa-folder', page: 'ManageResumePage' },
	{ label: 'Matches', icon: 'fas fa-check-double', page: 'MatchesPage' },
	{ label: 'New Application', icon: 'fas fa-file-alt', page: 'ApplicationPage' },
	{ label: 'My Applications', icon: 'fas fa-user-alt', page: 'MyApplicationPage' },
	{ label: 'Profile', icon: 'fas fa-user-alt', page: 'ProfilePage' },
	{ label: 'Create Resume', icon: 'fas fa-file', page: 'CreateResumePage' }
];

export default class Sidebar extends Component {
	render() {
		return (
			<div className='left-nav'>
				<div className='left-nav-item'>
					{options.map((option) => (
						<div key={option.label} onClick={() => this.props.switchPage(option.page)}>
							<i className={`${option.icon} fas left-nav-icon`}></i>
							<span className='left-nav-label'>{option.label}</span>
						</div>
					))}
					<div onClick={() => this.props.handleLogout()}>
						<i className='fas fa-sign-out-alt left-nav-icon'></i>
						<span className='left-nav-label'>LogOut</span>
					</div>
				</div>
			</div>
		);
	}
}
