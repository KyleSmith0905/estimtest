import { FunctionalComponent, h } from '@stencil/core';

const EstimtestLogo: FunctionalComponent = () => {
	return (
		<svg
			class='square'
			style={{ '--size': '1.7rem' }}
			viewBox='0 0 110.07 135.47'
		>
			<title>Estimtest, a manual testing library</title>
			<path
				fill='#fff'
				d='M23.95 84.67H0v23.94l26.85 26.86h74.75V101.6H40.88ZM26.85 0 0 26.85V50.8h23.95l16.93-16.93h60.72V0Zm-2.9 50.8v33.87h86.12V50.8Z'
				color='#000'
			/>
		</svg>
	);
};

const CloseIcon: FunctionalComponent = () => {
  return (
    <svg
      class='square'
      style={{ '--size': '1rem' }}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 67.7 67.7'
    >
      <title>Close</title>
      <path
        fill='none'
        stroke='#fff'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='16.9'
        d='m8.5 8.5 50.8 50.8m-50.8 0L59.3 8.5'
      />
    </svg>
  )
};

const ChevronIcon: FunctionalComponent<{direction: 'up' | 'down'}> = ({direction}) => {
  return (
    <svg
      style={{ '--size': '1rem' }}
      class={{
        'upside-down': direction === 'down',
        square: true,
      }}
      viewBox='0 0 67.7 36'
    >
      <path
        fill='none'
        stroke='#fff'
        stroke-linecap='round'
        stroke-linejoin='round'
        stroke-width='16.9'
        d='m8.5 27.5 25.4-19 25.4 19'
      />
    </svg>
  )
};

export { EstimtestLogo, CloseIcon, ChevronIcon };
