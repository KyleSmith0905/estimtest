type ColorBlindMatrix = [[number, number, number], [number, number, number], [number, number, number]];
type ColorBlind = (
	'protanopia' | 'protanomaly' |	'deuteranopia' | 'deuteranomaly'
	| 'tritanopia' |	'tritanomaly' | 'achromatopsia' | 'achromatomaly'
	| ColorBlindMatrix
)

interface EstimtestExperiments {
  name: string,
  description: string,
  // Test options
  fontSize?: number,
  colorBlind?: ColorBlind,
  keyboardOnly?: boolean,
}

interface EstimtestAttributes {
	experiments: EstimtestExperiments[];
	moveSelector?: string;
}

export { ColorBlindMatrix, ColorBlind, EstimtestExperiments, EstimtestAttributes }