import {
	Component,
	Fragment,
	h,
	Host,
	Prop,
	State,
	Watch,
	Element,
	Method,
} from '@stencil/core';
import { defaultEstimtestAttributes, EstimtestAttributes } from 'estimtest-utils/config';
import { EstimtestExperiments, EstimtestExperimentsInternal, performTest, resetTest } from '../../lib/experiments';
import { HtmlRenderer, Parser } from 'commonmark';
import { autoResizeTextarea, conditionallySetInert, getEventValue } from '../../lib/dom';
import { ChevronIcon, CloseIcon, EstimtestLogo } from '../icons';

@Component({
	tag: 'estimtest-core',
	styleUrl: 'core.scss',
	shadow: true,
})
export class Estimtest {
	/**
	 * The experiments to be performed on the app. This is set by default to perform multiple
	 * standard tests. This field could also be a string. This field accepts an array of objects each
	 * with the properties:
	 *
	 * `name` A quick ~15 letters title summarizing the test\
	 * `description` A description explaining the test and why it's important. Supports Markdown (Commonmark-compliant).\
	 * `fontSize` The font size to set the page. Many users have difficulty reading text at the default font size, users fix this by increasing the default font size.
	 * `colorBlind` A change of colors on the page reflecting what colorblind users may see.
	 * `keyboardOnly` Many users may use keyboard navigation for a variety of reasons such as: Motor impairment, saving time, and more.
	 */
	@Prop() experiments?: string | EstimtestExperiments[];

	/**
	 * An element selector containing the parent of where the element should be at. You could use
	 * this property in the event that your code does not permit you to place the element there.
	 */
	@Prop() moveSelector: string;

	/**
	 * Whether to show the testing prompt on the bottom of the screen. Having this as false still
	 * imports the library but does not use it. Look at the [examples](examples) for sloppy
	 * implementations of fully removing Estimtest in production.
	 */
	@Prop() active?: string | boolean = true;

	@State() status: 'inactive' | 'prompted' | 'active' | 'finished' = 'inactive';

	// The config that is currently in effect
	@State() activeConfig?: EstimtestAttributes = defaultEstimtestAttributes;

	@State() activeTest?: EstimtestExperimentsInternal;

	@State() expandedTestActive?: boolean;

	@State() expandedTest?: EstimtestExperiments;

	@State() testDetailsDescription?: string;

	@State() testResults?: EstimtestExperimentsInternal[] = [];
	
	@State() exportedResultsActive?: boolean;

	@State() exportedResults?: string = '';

	@State() errors: Record<string, { message: string; visible: boolean }> = {};

	@Element() hostElement: HTMLEstimtestCoreElement;

	private testFeedbackElement?: HTMLTextAreaElement;

	@Watch('experiments')
	watchConfigHandler() {
		this.updateConfig();
	}

	@Watch('activeTest')
	watchActiveTestHandler() {
		autoResizeTextarea(this.testFeedbackElement);
	}

	componentWillLoad() {
		if (this.active.toString() === 'true') {
			this.promptBeginExperiments();
		}
	}

	componentDidLoad() {
		// Add custom font to page DOM since font-face doesn't work within Shadow DOM.
		const fontCssUrl = 'https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@300&display=swap';
		let element = document.querySelector(`link[href="${fontCssUrl}"]`);

		// Only inject the element if it's not yet present
		if (!element) {
			element = document.createElement('link');
			element.setAttribute('rel', 'stylesheet');
			element.setAttribute('href', fontCssUrl);
			document.head.appendChild(element);
		}
	}

	/**
	 * Provides the prompt to begin or restart experiments. This activates and resets the experiments
	 * as well.
	 */
	@Method()
	public async promptBeginExperiments() {
		resetTest(this.hostElement);
		this.status = 'prompted';
	}

	/**
	 * Starts the experiments using the config sent to this method.
	 * This does not need to be manually implemented, the UI elements perform the same event.
	 */
	@Method()
	public async startExperiments(config?: EstimtestAttributes) {
		this.testResults = [];
		this.updateConfig(config);
		this.activeTest = {
			index: 0,
			...this.activeConfig.experiments[0],
		};
		this.status = 'active';

		performTest(this.hostElement, this.activeTest, this.activeConfig);
	}

	/**
	 * Progress to the next test in the config.
	 * This does not need to be manually implemented, the UI elements perform the same event.
	 */
	@Method()
	public async nextExperiment(results: 'fail' | 'pass') {
		this.testResults.push({
			results: results,
			notes: this.activeTest.notes,
			...this.activeTest,
		});
		
		
		const nextIndex = this.activeTest.index + 1;
		if (nextIndex >= this.activeConfig.experiments.length) {
			this.finishExperiments();
			return;
		}
		
		this.activeTest = {
			index: nextIndex,
			...this.activeConfig.experiments[nextIndex],
		};

		// Delay the auto resize to ensure text is removed during resize
		setTimeout(() => {
			autoResizeTextarea(this.testFeedbackElement);
		});

		performTest(this.hostElement, this.activeTest, this.activeConfig);
	}

	private finishExperiments() {
		this.status = 'finished';
		resetTest(this.hostElement);
	}

	private updateConfig(config?: EstimtestAttributes) {
		// Warn user that the estimtest config could not be changed during testing.
		if (this.status === 'active') {
			this.errorHandler(
				'The configuration file could not be changed during active testing.'
			);
		}
		else if (config) {
			this.activeConfig = config;
		}
		// Build together a config from the multiple props.
		else {
			this.activeConfig = defaultEstimtestAttributes;
	
			if (typeof this.moveSelector === 'string') {
				this.activeConfig.moveSelector = this.moveSelector;
			}

			if (this.experiments !== undefined) {

				if (typeof this.experiments === 'string') {
					this.activeConfig.experiments = JSON.parse(this.experiments);
				}
				else {
					this.activeConfig.experiments = this.experiments;
				}
			}
		}
	}

	private async toggleTestDetails(test?: EstimtestExperiments) {
		this.expandedTestActive = !this.expandedTestActive;
		if (this.expandedTestActive) {
			this.expandedTest = test ?? this.activeTest;

			const reader = new Parser();
			const writer = new HtmlRenderer();
			const parsed = reader.parse(this.expandedTest.description);
			this.testDetailsDescription = writer.render(parsed);
		}
	}

	private exportResults() {
		this.exportedResultsActive = true;
		this.exportedResults = JSON.stringify(this.testResults, null, 2);

		// Print the exported results to the console.
		console.log(this.testResults);
	}

	private errorHandler(message: string) {
		const errorId = Math.random().toString(16).slice(2);
		this.errors[errorId] = {
			message: message,
			visible: true,
		};

		setInterval(() => {
			this.errors[errorId].visible = false;
		}, 5000);

		setInterval(() => {
			delete this.errors[errorId];
		}, 5500);
	}

	render() {
		if (this.active.toString() !== 'true') return <Fragment />;
		else if (this.status === 'inactive') return <Fragment />;

		return (
			<Host>
				<div class='full-screen'>
					<div>
						{Object.values(this.errors).map((element, i) => (
							<div key={i} class='absolute-top box'>
								<h2 class='title'>Error</h2>
								<p>{element.message}</p>
							</div>
						))}
					</div>
					{/* A box that prompts the user for to begin the experiments */}
					<div
						data-test="prompt-box"
						class={{
							'absolute-bottom box will-animate-blur': true,
							'animate-blur': this.status === 'prompted',
						}}
						ref={conditionallySetInert(this.status === 'prompted')}
					>
						<div class='flex-row'>
							<EstimtestLogo />
							<button class='button' onClick={() => this.startExperiments()}>
								Start Testing
							</button>
						</div>
					</div>
					{/* A box that shows the currently active test status */}
					<div
						data-test="test-box"
						class={{
							'absolute-bottom box will-animate-blur': true,
							'animate-blur': this.status === 'active',
						}}
						ref={conditionallySetInert(this.status === 'active')}
					>
						<div class='flex-column'>
							<div class='flex-row'>
								<p class='title'>{this.activeTest?.name ?? ''}</p>
								<p class='caption'>
									{this.activeTest?.index + 1}/{this.activeConfig?.experiments.length}
								</p>
								<button onClick={() => this.toggleTestDetails()} class='button'>
									<ChevronIcon
										direction={this.expandedTestActive ? 'down' : 'up'}
									/>
								</button>
							</div>
							<div class='flex-row'>
								<textarea
									class='auto-resize-textarea button'
									value={this.activeTest?.notes}
									ref={(el) => this.testFeedbackElement = el}
									onChange={(event) =>
										(this.activeTest = {
											...this.activeTest,
											notes: getEventValue(event),
										})
									}
									onInput={(event) =>
										(this.activeTest = {
											...this.activeTest,
											notes: getEventValue(event),
										})
									}
								/>
								<button class='button' onClick={() => this.nextExperiment('pass')}>
									Pass
								</button>
								<button class='button' onClick={() => this.nextExperiment('fail')}>
									Fail
								</button>
							</div>
						</div>
					</div>
					{/* A box that shows the test results */}
					<div
						data-test="finish-box"
						class={{
							'absolute-center box will-animate-blur': true,
							'animate-blur': this.status === 'finished',
						}}
						ref={conditionallySetInert(this.status === 'finished')}
					>
						<div class='flex-column'>
							<h2 class='title'>Estimtest Finished</h2>
							<div class='flex-column results-grid'>
								{this.testResults.map((result) => (
									<div class={`flex-row full-width ${result.results}`}>
										<p
											onClick={() => this.toggleTestDetails(result)}
											class='paragraph clickable bold'
										>
											{result.name}
										</p>
										<p
											class='paragraph'
											style={{
												opacity: result.notes === undefined ? '0.5' : '0.9',
											}}
										>
											{result.notes === undefined
												? 'No notes added'
												: result.notes}
										</p>
									</div>
								))}
							</div>
							<div class='flex-row'>
								<button onClick={() => this.exportResults()} class='button'>
									Export Results
								</button>
								<button onClick={() => this.promptBeginExperiments()} class='button'>
									Start Another Test
								</button>
							</div>
						</div>
					</div>
					{/* A box that contains additional info about the test */}
					<div
						data-test="details-box"
						class={{
							'absolute-center box will-animate-blur': true,
							'animate-blur': this.expandedTestActive,
						}}
						ref={conditionallySetInert(this.expandedTestActive)}
					>
						<div class='flex-column'>
							<div class='flex-row'>
								<h2 class='title'>{this.expandedTest?.name}</h2>
								<button class='button' onClick={() => this.toggleTestDetails()}>
									<CloseIcon />
								</button>
							</div>
							<div class='paragraph' innerHTML={this.testDetailsDescription} />
						</div>
					</div>
					{/* A box that contains a raw JSON of the text results */}
					<div
						class={{
							'absolute-center box will-animate-blur': true,
							'animate-blur': this.exportedResultsActive,
						}}
						ref={conditionallySetInert(this.exportedResultsActive)}
					>
						<div class='flex-column'>
							<h2 class='title'>Exported Test Results</h2>
							<p class='paragraph' innerHTML={this.exportedResults}></p>
							<button onClick={() => this.exportedResultsActive = false} class='button'>
								Back
							</button>
						</div>
					</div>
				</div>
			</Host>
		);
	}
}