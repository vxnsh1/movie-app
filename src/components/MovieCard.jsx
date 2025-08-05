import React from 'react'

const MovieCard = ({movie}) => {
  return (
    <div className='text-white'>
        {movie.title}
    </div>
  )
}

export default MovieCard