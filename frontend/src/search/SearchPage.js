import React, { Component } from 'react'
import $ from 'jquery'
import SearchCard from './SearchCard'

const columns = [
  {
    label: 'Company Name',
    id: 'companyName'
  }, {
    label: 'Job title',
    id: 'jobTitle'
  }, {
    label: 'Date',
    id: 'date'
  }, {
    label: '',
    id: 'func'
  }
]

export default class SearchPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchText: '',
      rows: [],
      addedList: []
    }
  }

  search () {
    if (!this.state.searchText) {
      window.alert('Search bar cannot be empty!!')
      return
    }
    $.ajax({
      url: 'http://localhost:5000/search',
      method: 'get',
      data: {
        keywords: this.state.searchText
      },
      contentType: 'application/json',
      success: (data) => {
        const res = data.map((d, i) => {
          return {
            id: i,
            jobTitle: d.jobTitle,
            companyName: d.companyName,
            location: d.location
          }
        })
        this.setState({
          rows: res
        })
      }
    })
  }

  deleteTheApplication (id) {
    const newRows = this.state.rows.filter(app => {
      return app.id !== id
    })
    const newAddedList = this.state.addedList.filter(app => {
      return app.id !== id
    })
    this.setState({
      rows: newRows,
      addedList: newAddedList
    })
  }

  // open the card modal according to the application in parameter
  showEditModal (job, mode) {
    this.setState({
      showModal: true,
      job: job,
      modalMode: mode
    })
  }

  handleCloseEditModal () {
    this.setState({
      showModal: false,
      job: null
    })
  }

  addToWaitlist (job) {
    const newAddedList = this.state.addedList
    newAddedList.push(job.id)
    console.log(job)

    $.ajax({
      url: 'http://localhost:5000/application',
      method: 'POST',
      data: JSON.stringify({
        application: job
      }),
      contentType: 'application/json',
      success: (msg) => {
        console.log(msg)
      }
    })
    this.setState({
      addedList: newAddedList
    })
  }

  removeFromWaitlist (job) {
    const newAddedList = this.state.addedList.filter(v => {
      return v !== job.id
    })
    this.setState({
      addedList: newAddedList
    })
  }

  handleChange (event) {
    this.setState({ [event.target.id]: event.target.value })
  }

  render () {
    const rows = this.state.rows

    let applicationModal = null
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
      )
    }

    return (
      <div>
        <div className='container'>
          <div className='row'>
            <div className='col-6 input-group mb-3'>
              <input type='text' id='searchText' className='form-control' placeholder='Keyword' aria-label='Username' aria-describedby='basic-addon1' value={this.state.searchText} onChange={this.handleChange.bind(this)} />
            </div>
            <div>
              <button type='button' className='btn btn-secondary' onClick={this.search.bind(this)}>Search</button>
            </div>
          </div>
        </div>
        <table className='table'>
          <thead>
            <tr>
              {columns.map(column => {
                return <th key={column.id + '_th'}>{column.label}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              return (
                <tr key={row.id}>
                  {columns.map(column => {
                    const value = row[column.id]
                    if (column.id !== 'func') {
                      return <td key={column.id}>{value}</td>
                    } else {
                      const addButton = this.state.addedList.includes(row.id)
                        ? <button type='button' className='btn btn-outline-secondary' onClick={this.removeFromWaitlist.bind(this, row)}> Added </button>
                        : <button type='button' className='btn btn-secondary' onClick={this.showEditModal.bind(this, row)}> Add </button>
                      return (
                        <td key={row.id + '_func'}>
                          <div className='container'>
                            <div className='row'>
                              <div className='col-md-4'>
                                {addButton}
                              </div>
                                                    &nbsp;&nbsp;
                              <div className='col-md-2'>
                                <button type='button' style={{ backgroundColor: 'red' }} className='btn btn-secondary' onClick={this.deleteTheApplication.bind(this, row.id)}> Delete </button>
                              </div>
                            </div>
                          </div>

                        </td>
                      )
                    }
                  })}

                </tr>
              )
            })}
          </tbody>
        </table>

        {applicationModal}
      </div>
    )
  }
}
