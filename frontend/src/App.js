import './static/App.css';

import React, { Component } from 'react';
import Sidebar from './sidebar/Sidebar';
import ApplicationPage from './application/ApplicationPage';
import HomePage from './home/HomePage.js';
import SearchPage from './search/SearchPage';
import LoginPage from './login/LoginPage';
import ManageResumePage from './resume/ManageResumePage';
import ProfilePage from './profile/ProfilePage';
import axios from 'axios';
import MatchesPage from './matches/MatchesPage';
import MyApplicationPage from './application/MyApplicationPage';
import CreateResumePage from './resume/CreateResumePage.tsx';
import { baseApiURL } from './api/base.ts';
import { Widget, addResponseMessage } from 'react-chat-widget';

import 'react-chat-widget/lib/styles.css';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		let mapRouter = {
			HomePage: <HomePage />,
			SearchPage: <SearchPage />,
			ApplicationPage: <ApplicationPage />,
			LoginPage: <LoginPage />,
			ManageResumePage: <ManageResumePage />,
			ProfilePage: <ProfilePage />,
			MatchesPage: <MatchesPage />,
			CreateResumePage: <CreateResumePage />,
			MyApplicationPage: <MyApplicationPage />
		};
		this.state = {
			currentPage: <LoginPage />,
			mapRouter: mapRouter,
			sidebar: false,
			userProfile: null
		};
		this.sidebarHandler = this.sidebarHandler.bind(this);
		this.updateProfile = this.updateProfile.bind(this);
	}

	updateProfile = (profile) => {
		console.log('Update Request: ', profile);
		this.setState({
			userProfile: profile,
			currentPage: <ProfilePage profile={profile} updateProfile={this.updateProfile} />
		});
	};

	async componentDidMount() {
		if (localStorage.getItem('token')) {
			const userId = localStorage.getItem('userId');
			await axios
				.get(`${baseApiURL}/getProfile`, {
					headers: {
						userid: userId,
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				})
				.then((res) => {
					this.sidebarHandler(res.data);
				})
				.catch((err) => console.log(err.message));
		}
	}

	sidebarHandler = (user) => {
		console.log(user);
		this.setState({
			currentPage: <ProfilePage profile={user} updateProfile={this.updateProfile.bind(this)} />,
			sidebar: true,
			userProfile: user
		});
	};

	handleLogout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('userId');
		this.setState({
			sidebar: false
		});
	};

	switchPage(pageName) {
		const currentPage =
			pageName === 'ProfilePage' ? (
				<ProfilePage profile={this.state.userProfile} updateProfile={this.updateProfile.bind(this)} />
			) : (
				this.state.mapRouter[pageName]
			);
		this.setState({
			currentPage: currentPage
		});
	}

	componentDidMount() {
        addResponseMessage('Welcome to this awesome chat!');
    }

	handleNewUserMessage = async (newMessage) => {
		console.log(`New message incoming! ${newMessage}`);
		// Now send the message throught the backend API
		
		// const response = "Absolutely!";

		try {
			const response = await fetch(`${baseApiURL}/getLLMresponse`, {
				method: 'POST', // Assuming you are using a POST request
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ message: newMessage }), // Send the user message as payload
			});

			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
			}
	
			const data = await response.json();
			const outputmsg = data.response;

			addResponseMessage(outputmsg);
		
		} catch (error) {
			console.error('Error fetching response:', error);
        	addResponseMessage('Sorry, something went wrong!');
		}

	};

	render() {
		var app;
		// console.log(this.state.sidebar)
		if (this.state.sidebar) {
			app = (
				<div className='main-page'>
					<Widget
						handleNewUserMessage={this.handleNewUserMessage}
						title="Job Expert"
          				subtitle="Ask Me Your Questions!"
					/>
					<Sidebar switchPage={this.switchPage.bind(this)} handleLogout={this.handleLogout} />
					<div className='main'>
						<div className='content'>
							<div className=''>
								<h1 className='text-center' style={{ marginTop: '2%', fontWeight: '300' }}>
								<b>Job Tracker</b>
								</h1>
								{/* <span className="btn-icon ">
                <button className="btn btn-danger btn-icon"><i className="fas fa-plus"></i>&nbsp;New</button>
              </span> */}
							</div>
							{this.state.currentPage}
						</div>
					</div>
				</div>
			);
		} else {
			app = (
				<div className='main-page'>
					<div className='main'>
						<div className='content'>
							<h1
								className='text-center'
								style={{
									marginTop: 30,
									padding: 0.4 + 'em',
									fontWeight: '300'
								}}
							>
								<b>Job Tracker</b>
							</h1>
							<div className=''>
								{/* <span className="btn-icon ">
              <button className="btn btn-danger btn-icon"><i className="fas fa-plus"></i>&nbsp;New</button>
            </span> */}
							</div>
							<LoginPage side={this.sidebarHandler} />
						</div>
					</div>
				</div>
			);
		}
		return app;
	}
}
