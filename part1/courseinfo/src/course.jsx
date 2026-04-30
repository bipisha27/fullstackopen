import React from 'react'

const Header = ({name}) => {
  return <h1>{name}</h1>
}

const Part = ({part}) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>
  )
}

const Course = ({course}) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
    </div>
  )
}

const Content = ({parts}) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <div>
      {parts.map(part => (
        <Part key={part.id} part={part} />
      ))}
      <p><strong>Total Exercises : {total}</strong></p>
    </div>
  )
}

export default Course