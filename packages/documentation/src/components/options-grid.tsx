import React from 'react';
import styles from './options-grid.module.css';

const options = [
  {
    name: 'Font Size',
    description: 'Many users have difficulty reading text at the default font size, users fix this by increasing the default font size.',
    image: '/undraw/web-search.svg',
  },
  {
    name: 'Color Blindness',
    description: 'Color blindness affects some user\'s capability to discern between hues.',
    image: '/undraw/contrast.svg',
  },
  {
    name: 'Keyboard Only',
    description: 'whether it\'s due to motor impairment or agility, supporting a keyboard-only lifestyle is a must.',
    image: '/undraw/typewriter.svg',
  },
]

const OptionsGrid = () => {
  return (
    <div className={styles.optionsGrid}>
      {options.map((option) => (
        <div key={option.name} className={styles.optionsBox}>
          <img className={styles.optionsImage} src={option.image}/>
          <h2 className='no-margin'>{option.name}</h2>
          <p className='no-margin'>{option.description}</p>
        </div>
      ))}
    </div>
  )
}

export default OptionsGrid;