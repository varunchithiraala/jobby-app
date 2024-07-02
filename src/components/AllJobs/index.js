import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import JobItemDetails from '../JobItemDetails'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllJobs extends Component {
  state = {
    profileData: [],
    jobsData: [],
    searchInput: '',
    radioInput: '',
    checkboxInputs: '',
    responseSuccess: true,
    apiStatus: apiStatusConstants.initial,
    apiJobsStatus: apiJobsStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const profileOptions = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const profileResponse = await fetch(profileApiUrl, profileOptions)
    if (profileResponse.ok) {
      const fetchedProfileData = [await profileResponse.json()]
      const updatedProfileData = fetchedProfileData.map(eachProfileData => ({
        name: eachProfileData.profile_details.name,
        profileImageUrl: eachProfileData.profile_data.profile_image_url,
        shortBio: eachProfileData.profile_details.short_bio,
      }))
      this.setState({
        profileData: updatedProfileData,
        responseSuccess: true,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobDetails = async () => {
    this.setState({apiJobsStatus: apiJobsStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, radioInput, checkboxInputs} = this.state
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const jobsOptions = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const jobsResponse = await fetch(jobsApiUrl, jobsOptions)
    if (jobsResponse) {
      const fetchedJobsData = jobsResponse.json()
      const updatedJobsData = fetchedJobsData.jobs.map(eachJobData => ({
        companyLogoUrl: eachJobData.company_logo_url,
        employementType: eachJobData.employement_type,
        id: eachJobData.id,
        jobDescription: eachJobData.job_description,
        location: eachJobData.location,
        packagePerAnnum: eachJobData.package_per_annum,
        rating: eachJobData.rating,
        title: eachJobData.title,
      }))
      this.setState({
        jobsData: updatedJobsData,
        apiJobsStatus: apiJobsStatusConstants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiJobsStatusConstants.failure})
    }
  }

  getRadioOption = event => {
    this.setState({radioInput: event.target.value}, this.getJobDetails)
  }

  getInputOption = event => {
    const {checkboxInputs} = this.state
    const inputNotInList = checkboxInputs.filter(
      eachInput => eachInput === event.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkboxInputs: [...prevState.checkboxInputs, event.target.id],
        }),
        this.getJobDetails,
      )
    } else {
      const filteredCheckboxData = checkboxInputs.filter(
        eachInput => eachInput !== event.target.id,
      )
      this.setState({checkboxInputs: filteredCheckboxData}, this.getJobDetails)
    }
  }

  renderProfileDetails = () => {
    const {profileData, responseSuccess} = this.state
    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileData[0]
      return (
        <div className="profile-details-container">
          <img
            src={profileImageUrl}
            className="profile-details-image"
            alt="profile"
          />
          <h1 className="profile-details-heading">{name}</h1>
          <p className="profile-details-description">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  retryProfileView = () => {
    this.renderProfileDetails()
  }

  renderProfileFailureView = () => (
    <div className="profile-failure-container">
      <button
        type="button"
        className="profile-failure-button"
        onClick={this.retryProfileView}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingview = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  retryJobs = () => {
    this.getJobDetails()
  }

  renderJobsView = () => {
    const {jobsData} = this.state
    const noOfJobs = jobsData.length
    return noOfJobs === 0 ? (
      <div className="no-jobs-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-jobs-view-image"
          alt="no jobs"
        />
        <h1 className="no-jobs-view-heading">No Jobs Found</h1>
        <p className="no-jobs-view-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    ) : (
      <ul className="job-items-list-container">
        {jobsData.map(eachJobItem => (
          <JobItemDetails key={eachJobItem.id} jobData={eachJobItem} />
        ))}
      </ul>
    )
  }

  renderJobsFailureView = () => (
    <div className="jobs-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="jobs-failure-view-image"
        alt="failure"
      />
      <h1 className="jobs-failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-view-description">
        We cannot seem to find the page you are looking for
      </p>
      <div className="jobs-failure-view-button-container">
        <button
          type="button"
          className="jobs-failure-view-button"
          onClick={this.retryJobs}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderProfileStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileDetails()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingview()
      default:
        return null
    }
  }

  renderJobsStatus = () => {
    const {apiJobsStatus} = this.state
    switch (apiJobsStatus) {
      case apiJobsStatusConstants.success:
        return this.renderJobsView()
      case apiJobsStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiJobsStatusConstants.inProgress:
        return this.renderLoadingview()
      default:
        return null
    }
  }

  getCheckBoxesView = () => (
    <ul className="checkboxes-view-container">
      {employmentTypesList.map(eachEmployeeType => (
        <li className="list-container" key={eachEmployeeType.employmentTypeId}>
          <input
            type="checkbox"
            className="input"
            id={eachEmployeeType.employmentTypeId}
            onChange={this.getInputOption}
          />
          <label className="label" htmlFor={eachEmployeeType.employmentTypeId}>
            {eachEmployeeType.label}
          </label>
        </li>
      ))}
    </ul>
  )

  getRadioButtonsView = () => (
    <ul className="radio-buttons-view-container">
      {salaryRangesList.map(eachSalaryRange => (
        <li className="list-container" key={eachSalaryRange.salaryRangeId}>
          <input
            type="radio"
            name="option"
            className="input"
            id={eachSalaryRange.salaryRangeId}
            onChange={this.getRadioOption}
          />
          <label className="label" htmlFor={eachSalaryRange.salaryRangeId}>
            {eachSalaryRange.label}
          </label>
        </li>
      ))}
    </ul>
  )

  getSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.target.value === 'Enter') {
      this.getJobDetails()
    }
  }

  onSubmitSearchInput = () => {
    this.getJobDetails()
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="all-jobs-container">
          <div className="side-bar-container">
            {this.renderProfileStatus()}
            <hr className="hr-line" />
            <h1 className="all-jobs-text">Type of Employement</h1>
            {this.getCheckBoxesView()}
            <hr className="hr-line" />
            <h1 className="all-jobs-text">Salary Range</h1>
            {this.getRadioButtonsView()}
          </div>
          <div className="jobs-container">
            <div>
              <input
                type="search"
                className="search-input"
                value={searchInput}
                onChange={this.getSearchInput}
                onKeyDown={this.onEnterSearchInput}
                placeholder="Search"
              />
              <button
                type="button"
                className="search-button"
                onClick={this.onSubmitSearchInput}
                data-testid="searchButton"
                aria-label="search"
              >
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default AllJobs
