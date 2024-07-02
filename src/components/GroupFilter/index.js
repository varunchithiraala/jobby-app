import {BsSearch} from 'react-icons/bs'
import ProfileDetails from '../ProfileDetails'
import './index.css'

const GroupFilter = props => {
  const onChangeSearchInput = event => {
    const {changeSearchInput} = props
    changeSearchInput(event)
  }

  const onEnterSearchInput = event => {
    const {getJobs} = props
    if (event.key === 'Enter') {
      getJobs()
    }
  }

  const renderSearchInput = () => {
    const {getJobs, searchInput} = props
    return (
      <div className="search-input-container">
        <input
          type="search"
          className="search-input"
          value={searchInput}
          onChange={onChangeSearchInput}
          onKeyDown={onEnterSearchInput}
          placeholder="Search"
        />
        <button
          type="button"
          className="search-button"
          id="serachButton"
          onClick={getJobs}
          data-testid="searchButton"
          aria-label="search"
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  const onSelectEmployeeType = event => {
    const {changeEmployeeList} = props
    changeEmployeeList(event.target.value)
  }

  const renderTypeOfEmployment = () => {
    const {employmentTypesList} = props

    return (
      <div className="employment-type-container">
        <h1 className="employment-type-heading"> Type of Employment</h1>
        <ul className="employee-type-list-container">
          {employmentTypesList.map(eachEmployeeType => (
            <li
              key={eachEmployeeType.employmentTypeId}
              className="employee-item"
            >
              <input
                type="checkbox"
                className="check-input"
                id={eachEmployeeType.employmentTypeId}
                value={eachEmployeeType.employmentTypeId}
                onChange={onSelectEmployeeType}
              />
              <label
                className="check-label"
                htmlFor={eachEmployeeType.employmentTypeId}
              >
                {eachEmployeeType.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const renderSalaryRange = () => {
    const {salaryRangesList} = props
    return (
      <div className="salary-range-container">
        <h1 className="salary-range-heading">Salary Range</h1>
        <ul className="salary-range-list-container">
          {salaryRangesList.map(eachSalary => {
            const {changeSalary} = props
            const onClickSalary = () => {
              changeSalary(eachSalary.salaryRangeId)
            }
            return (
              <li
                className="salary-item"
                key={eachSalary.salaryRangeId}
                onClick={onClickSalary}
              >
                <input
                  type="radio"
                  className="check-input"
                  id={eachSalary.salaryRangeId}
                  name="salary"
                />
                <label
                  className="check-label"
                  htmlFor={eachSalary.salaryRangeId}
                >
                  {eachSalary.label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <div className="group-filter-container">
      {renderSearchInput()}
      <ProfileDetails />
      <hr className="horizontal-line" />
      {renderTypeOfEmployment()}
      <hr className="horizontal-line" />
      {renderSalaryRange()}
    </div>
  )
}

export default GroupFilter
