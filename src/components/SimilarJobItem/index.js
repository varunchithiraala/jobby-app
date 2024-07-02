import {BsFillBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails
  return (
    <li className="similar-job-item">
      <div className="logo-title-location-container">
        <div className="similar-job-logo-title-container">
          <img
            src={companyLogoUrl}
            className="similar-job-logo"
            alt="similar job company logo"
          />
          <div className="title-rating-container">
            <h1 className="similar-job-title-heading">{title}</h1>
            <div className="rating-container">
              <BsStarFill className="similar-job-rating-icon" />
              <p className="similar-job-rating-heading">{rating}</p>
            </div>
          </div>
        </div>
        <h1 className="similar-job-description-heading">Description</h1>
        <p className="similar-job-description-text">{jobDescription}</p>
        <div className="location-employee-container">
          <div className="location-container">
            <MdLocationOn className="similar-job-location-icon" />
            <p className="similar-job-location-heading">{location}</p>
          </div>
          <div className="employee-type-container">
            <BsFillBriefcaseFill className="similar-job-brief-case-icon" />
            <p className="similar-job-employee-type-heading">
              {employmentType}
            </p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobItem
