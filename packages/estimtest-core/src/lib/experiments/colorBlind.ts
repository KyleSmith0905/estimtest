import { ColorBlindMatrix } from 'estimtest-utils/config';
import { EstimtestExperiments, EstimtestWrapper } from '.';

/**
 * Idea and colorblindness values come from {@link https://github.com/hail2u/color-blindness-emulation}
 */
const activateColorBlind = (wrapper: EstimtestWrapper, test: EstimtestExperiments) => {
	const commonColorblindness: Record<string, ColorBlindMatrix> = {
		protanopia:    [[0.567, 0.433, 0    ], [0.558, 0.442, 0    ], [0    , 0.242, 0.758]],
		protanomaly:   [[0.817, 0.183, 0    ], [0.333, 0.667, 0    ], [0    , 0.125, 0.875]],
		deuteranopia:  [[0.625, 0.375, 0    ], [0.7  , 0.3  , 0    ], [0    , 0.3  , 0.7  ]],
		deuteranomaly: [[0.8  , 0.2  , 0    ], [0.258, 0.742, 0    ], [0    , 0.142, 0.858]],
		tritanopia:    [[0.95 , 0.05 , 0    ], [0    , 0.433, 0.567], [0    , 0.475, 0.525]],
		tritanomaly:   [[0.967, 0.033, 0    ], [0    , 0.733, 0.267], [0    , 0.183, 0.817]],
		achromatopsia: [[0.299, 0.587, 0.114], [0.299, 0.587, 0.114], [0.299, 0.587, 0.114]],
		achromatomaly: [[0.618, 0.320, 0.062], [0.163, 0.775, 0.062], [0.163, 0.320, 0.516]],
	};

	let matrix: ColorBlindMatrix;
	if (typeof test.colorBlind === 'string') {
		matrix = commonColorblindness[test.colorBlind];
	}
	else {
		matrix = test.colorBlind;
	}
	
	const colorBlindFilter = `\
		<svg xmlns='http://www.w3.org/2000/svg'>\
			<filter id='estimtest-filter-color-blind'>\
				<feColorMatrix in='SourceGraphic' type='matrix' values='${matrix.map(e => `${e.join(' ')} 0 0`).join(' ')} 0 0 0 1 0'>\
				</feColorMatrix>\
			</filter>\
		</svg>\
	`;
	
	wrapper.foreground.style.setProperty('backdrop-filter', `url("data:image/svg+xml,${colorBlindFilter}#estimtest-filter-color-blind")`);
};

export { activateColorBlind };