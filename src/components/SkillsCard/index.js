import './index.css'

const SkillsCard = props => {
  const {skillDetails} = props
  const {imageUrl, name} = skillDetails

  return (
    <li className="skills-card-container">
      <div className="skills-card">
        <img src={imageUrl} className="skills-card-image" alt={name} />
        <h1 className="skills-card-name">{name}</h1>
      </div>
    </li>
  )
}

export default SkillsCard
