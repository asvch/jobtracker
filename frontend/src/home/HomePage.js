import React, { Component } from 'react';
import $ from 'jquery';
import SearchCard from '../search/SearchCard';
import JobDescription from '../Modals/JobDescription';
import { Spinner } from 'react-bootstrap';
import { baseApiURL } from '../api/base.ts';

const columns = [
	{
		label: 'Company Name',
		id: 'companyName'
	},
	{
		label: 'Job Title',
		id: 'jobTitle'
	},
	{
		label: 'Job Link',
		id: 'jobLink'
	},
	{
		label: 'Location',
		id: 'location'
	},
	{
		label: 'Date',
		id: 'date'
	},
	{
		label: '',
		id: 'func'
	}
];

export default class HomePage extends Component {
	constructor(props) {
		super(props);
		this.state = {
            recommendedJobs: [],
			searchText: '',
			rows: [],
			location: '',
			addedList: [],
			showJobDesc: false,
			selectedJob: null,
			searching: false
		};
	}

    componentDidMount() {
        this.fetchRecommendations();
    }

	search() {
		if (!this.state.searchText) {
			window.alert('Search bar cannot be empty!!');
			return;
		}
		this.setState({ searching: true });
		$.ajax({
			url: `${baseApiURL}/search`,
			method: 'get',
			data: {
				keywords: this.state.searchText,
				location: this.state.location,
				jobType: this.state.jobType
			},
			contentType: 'application/json',
			success: (data) => {
				const res = data.map((d, i) => {
					return {
						id: i,
						jobTitle: d.jobTitle,
						jobLink: d.jobLink,
						companyName: d.companyName,
						location: d.location,
						date: d.date,
						qualifications: d.qualifications,
						benefits: d.benefits,
						responsibilities: d.responsibilities
					};
				});
				this.setState({
					searching: false,
					rows: res
				});
			},
			error: () => {
				window.alert('Error while fetching jobs. Please try again later');
				this.setState({
					searching: false
				});
			}
		});
	}


    fetchRecommendations = async () => {
        try {
          const response = await fetch(`${baseApiURL}/getRecommendations`, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
              'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
              'Access-Control-Allow-Credentials': 'true'
            },
            method: 'GET'
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json(); // Parse JSON response
      
          // Check if data is an array before setting it to state
          if (Array.isArray(data)) {
            this.setState({ recommendedJobs: data });
          } else {
            console.error("Unexpected response format:", data);
            this.setState({ recommendedJobs: [] }); // Set to empty array if unexpected format
          }
        } catch (error) {
          console.error("Error fetching recommendations:", error);
          this.setState({ recommendedJobs: [] });
        }
      };
      

	deleteTheApplication(id) {
		const newRows = this.state.rows.filter((app) => {
			return app.id !== id;
		});
		const newAddedList = this.state.addedList.filter((app) => {
			return app.id !== id;
		});
		this.setState({
			rows: newRows,
			addedList: newAddedList
		});
	}

	// open the card modal according to the application in parameter
	showEditModal(job, mode) {
		// console.log(job)
		this.setState({
			showModal: true,
			job: job,
			modalMode: mode
		});
	}

	handleCloseEditModal() {
		this.setState({
			showModal: false,
			job: null
		});
	}

	addToWaitlist(job) {
		const newAddedList = this.state.addedList;
		newAddedList.push(job.id);
		// console.log(job)

		$.ajax({
			url: `${baseApiURL}/applications`,
			method: 'POST',
			data: JSON.stringify({
				application: job
			}),
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('token'),
				'Access-Control-Allow-Origin': 'http://127.0.0.1:3000',
				'Access-Control-Allow-Credentials': 'true'
			},
			contentType: 'application/json',
			success: (msg) => {
				console.log(msg);
				alert('Added item!');
			}
		});
		this.setState({
			addedList: newAddedList
		});
	}

	removeFromWaitlist(job) {
		const newAddedList = this.state.addedList.filter((v) => {
			return v !== job.id;
		});
		this.setState({
			addedList: newAddedList
		});
	}

	handleChange(event) {
		this.setState({ [event.target.id]: event.target.value });
	}

	setSalary(event) {
		this.setState({ [event.target.id]: event.target.value });
	}

	handleShowJobDesc(job) {
		this.setState({
			showJobDesc: !this.state.showJobDesc,
			selectedJob: job
		});
	}

	render() {
		const rows = this.state.rows;

        const { recommendedJobs } = this.state;

		let applicationModal = null;
		if (this.state.job) {
			applicationModal = (
				<SearchCard
					show={this.state.showModal}
					submitFunc={this.addToWaitlist.bind(this)}
					mode={this.state.modalMode}
					application={this.state.job}
					handleCloseEditModal={this.handleCloseEditModal.bind(this)}
					deleteApplication={this.deleteTheApplication.bind(this)}
				/>
			);
		}

		return (
			<div>
				<div className='d-flex my-5 mx-1' style={{ paddingLeft: '14%', justifyContent: 'flex-start' }}>
					<input
						type='text'
						id='searchText'
						className='form-control px-4 py-3 mx-1 w-70'
						placeholder='Keyword'
						aria-label='Username'
						aria-describedby='basic-addon1'
						value={this.state.searchText}
						onChange={this.handleChange.bind(this)}
						style={{ fontSize: 18, marginRight: 20 }}
					/>
					<input
						type='text'
						id='location'
						className='form-control px-4 py-3 mx-2 w-50'
						placeholder='Location'
						aria-label='Username'
						aria-describedby='basic-addon1'
						value={this.state.location}
						onChange={this.handleChange.bind(this)}
						style={{ fontSize: 18, marginRight: 20 }}
					/>
					<select
						id='jobType'
						className='form-control px-4 py-3 mx-2 w-50'
						value={this.state.jobType}
						onChange={this.handleChange.bind(this)}
						style={{ fontSize: 18, marginRight: 20 }}
					>
						<option value=''>Select Job Type</option>
						<option value='full-time'>Full-time</option>
						<option value='part-time'>Part-time</option>
						<option value='contract'>Contract</option>
						<option value='internship'>Internship</option>
					</select>
					<button
						type='button'
						className='px-4 py-3 custom-btn'
						onClick={this.search.bind(this)}
						disabled={this.state.searching}
					>
						Search
					</button>
				</div>
				{!this.state.searching && this.state.rows.length ? (
					<table
						className='table my-4'
						style={{
							boxShadow: '0px 5px 12px 0px rgba(0,0,0,0.1)',
							marginTop: 30,
							marginLeft: '10%',
							width: '95%',
							paddingRight: 10
						}}
					>
						<thead>
							<tr>
								{columns.map((column) => {
									return (
										<th
											className='p-3'
											key={column.id + '_th'}
											style={{
												fontSize: 18,
												fontWeight: '500',
												backgroundColor: '#2a6e85',
												color: '#fff'
											}}
										>
											{column.label}
										</th>
									);
								})}
							</tr>
						</thead>
						<tbody>
							{rows.map((row) => {
								return (
									<tr key={row.id}>
										{columns.map((column) => {
											const value = row[column.id];

											if (column.id === 'jobLink') {
												// Render the jobLink column as HTML
												return (
													<td className='p-3' key={column.id}>
														<div dangerouslySetInnerHTML={{ __html: value }} />
													</td>
												);
											}

											if (column.id !== 'func') {
												return (
													<td className='p-3' key={column.id}>
														{value}
													</td>
												);
											} else {
												const addButton = this.state.addedList.includes(row.id) ? (
													<button
														type='button'
														className='btn btn-outline-secondary'
														onClick={this.removeFromWaitlist.bind(this, row)}
													>
														Added
													</button>
												) : (
													<></>
												);
												return (
													<td key={row.id + '_func'} className='p-2'>
														{/* <div className="container"> */}
														<div className='d-flex justify-content-evenly'>
															{addButton}
															{/* <button
                                type="button"
                                // style={{
                                //   backgroundColor: "#e54b4b",
                                //   border: "none",
                                //   color: "#fff",
                                //   borderRad
                                // }}
                                className="delete-btn px-3 py-2"
                                onClick={this.deleteTheApplication.bind(
                                  this,
                                  row.id
                                )}
                                style={{
                                  marginLeft:'2px'
                                }}
                              >
                                {" "}
                                Delete{" "}
                              </button> */}
														</div>
														{/* <div className="row">
                                <div className="col-md-4">{addButton}</div>
                                &nbsp;&nbsp;
                                <div className="col-md-2">
                                  <button
                                    type="button"
                                    style={{
                                      backgroundColor: "#e54b4b",
                                      border: "none",
                                    }}
                                    className="btn btn-secondary"
                                    onClick={this.deleteTheApplication.bind(
                                      this,
                                      row.id
                                    )}
                                  >
                                    {" "}
                                    Delete{" "}
                                  </button>
                                </div>
                              </div> */}
														{/* </div> */}
													</td>
												);
											}
										})}
									</tr>
								);
							})}
						</tbody>
					</table>
				) : null}
				{this.state.searching && (
					<div className='d-flex justify-content-center my-5'>
						<Spinner animation='border' style={{ fontSize: 15 }} />
					</div>
				)}
				{this.state.showJobDesc && (
					<JobDescription selectedJob={this.state.selectedJob} setState={this.handleShowJobDesc.bind(this)} />
				)}
				{applicationModal}



                <h2 className='d-flex justify-content-center my-5'>Recommended Jobs</h2>
                <table
				className='table my-4'
				style={{
					boxShadow: '0px 5px 12px 0px rgba(0,0,0,0.1)',
					marginTop: 30,
					marginLeft: '10%'
				}}
			>
				<thead>
					<tr>
						<th
							className='p-3'
							style={{
								fontSize: 18,
								fontWeight: '500',
								backgroundColor: '#2a6e85',
								color: '#fff'
							}}
						>
							Company Name
						</th>
						<th
							className='p-3'
							style={{
								fontSize: 18,
								fontWeight: '500',
								backgroundColor: '#2a6e85',
								color: '#fff'
							}}
						>
							Job Title
						</th>
						<th
							className='p-3'
							style={{
								fontSize: 18,
								fontWeight: '500',
								backgroundColor: '#2a6e85',
								color: '#fff'
							}}
						>
							Link
						</th>
						<th
							className='p-3'
							style={{
								fontSize: 18,
								fontWeight: '500',
								backgroundColor: '#2a6e85',
								color: '#fff'
							}}
						>
							Location
						</th>
						{/* Add more fields as needed */}
					</tr>
				</thead>
				<tbody>
					{console.log(recommendedJobs)}
					{recommendedJobs.map((job, index) => (
						<tr key={index}>
							<td className='p-3'>{job.companyName}</td>
							<td className='p-3'>{job.jobTitle}</td>
                            <td>
                            <a target='_blank' rel='noopener noreferrer' href={job['jobLink']}>
								<button
									type='button'
									className='btn btn-primary d-flex align-items-center'
									style={{
										backgroundColor: '#2a6e85',
										margin: '5px',
										width: '100px',
										verticalAlign: 'middle'
									}}
								>
									Job Link
								</button>
							</a>
                            </td>
							<td className='p-3'>{job.location}</td>
						</tr>
					))}
				</tbody>
			</table>

			</div>
            
		);
	}
}
