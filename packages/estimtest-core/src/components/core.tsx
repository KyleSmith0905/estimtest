import {
	Component,
	Fragment,
	h,
	Host,
	Prop,
	State,
	Watch,
	Element,
} from '@stencil/core';
import { defaultEstimtestConfig, EstimtestConfig } from '../lib/config';
import { EstimtestTest, performTest, resetTest } from '../lib/tests';
import { HtmlRenderer, Parser } from 'commonmark';
import { autoResizeTextarea, getEventValue } from '../lib/dom';
import { ChevronIcon, CloseIcon, EstimtestLogo } from './icons';

@Component({
	tag: 'estimtest-core',
	styleUrl: 'core.scss',
	shadow: true,
})
export class Estimtest {
	/**
	 * A selector for the app container. This is by default `body`. The selector should match a
	 * sibling of this element that contains the entire app. Styles will be applied to this element,
	 * this element should not have any inline styles.
	 */
	@Prop() selectorsContainer = '';

	/**
	 * The tests to be performed on the app. This is set by default to perform a `Large Font Size` and
	 * `Mobile Screen Size` test. This field accepts an array of objects each with the properties:
	 *
	 * `name` A quick ~15 letters title summarizing the test\
	 * `description` A description explaining the test and why it's important. Supports Markdown (Commonmark-compliant).\
	 * `fontSize` The font size to set the page.\
	 * `width` The width to set the page.\
	 * `height` The height to set the page.
	 */
	@Prop() tests?: EstimtestConfig['tests'];

	/**
	 * Whether to show the testing prompt on the bottom of the screen. Set this value to `false` to
	 * no longer see the estimtest bar.
	 */
	@Prop() active?: boolean = true;

	@State() status: 'inactive' | 'prompted' | 'active' | 'finished' = 'inactive';

	// The config that is currently in effect
	@State() activeConfig?: EstimtestConfig = defaultEstimtestConfig;

	@State() activeTest?: EstimtestTest;

	@State() testFeedbackElement?: HTMLTextAreaElement;

	@State() expandedTestActive?: boolean;

	@State() expandedTest?: EstimtestTest;

	@State() testDetailsDescription?: string;

	@State() testResults?: EstimtestTest[] = [];

	@State() errors: Record<string, { message: string; visible: boolean }> = {};

	@Element() hostElement: HTMLEstimtestCoreElement;

	@Watch('selectorsContainer')
	@Watch('tests')
	watchConfigHandler() {
		this.updateConfig();
	}

	@Watch('activeTest')
	@Watch('testFeedbackElement')
	watchActiveTestHandler() {
		autoResizeTextarea(this.testFeedbackElement);
	}

	componentDidUpdate() {
		if (this.status === 'active') {
		}
	}

	componentDidLoad() {
		if (this.active) {
			this.promptBeginTests();
		}
	}

	private promptBeginTests() {
		resetTest(this.activeConfig);
		this.status = 'prompted';
	}

	private startTests() {
		this.testResults = [];
		this.updateConfig();
		this.activeTest = {
			index: 0,
			...this.activeConfig.tests[0],
		};
		this.status = 'active';

		performTest(this.activeTest, this.activeConfig);
	}

	private nextTest(results: 'fail' | 'pass') {
		this.testResults.push({
			results: results,
			notes: this.activeTest.notes,
			...this.activeTest,
		});

		this.activeTest.notes = '';

		const nextIndex = this.activeTest.index + 1;
		if (nextIndex >= this.activeConfig.tests.length) {
			this.finishTests();
		}

		this.activeTest = {
			index: nextIndex,
			...this.activeConfig.tests[nextIndex],
		};

		performTest(this.activeTest, this.activeConfig);
	}

	private finishTests() {
		this.status = 'finished';
	}

	private updateConfig() {
		// Warn user that the estimtest config could not be changed during testing.
		if (this.status === 'active') {
			this.errorHandler(
				'The configuration file could not be changed during active testing.'
			);
		}
		this.activeConfig = defaultEstimtestConfig;

		if (this.selectorsContainer !== '')
			this.activeConfig.selectors.container = this.selectorsContainer;
		if (this.tests !== undefined) this.activeConfig.tests = this.tests;
	}

	private toggleTestDetails(test?: EstimtestTest) {
		this.expandedTestActive = !this.expandedTestActive;
		if (this.expandedTestActive) {
			this.expandedTest = test ?? this.activeTest;

			const reader = new Parser();
			const writer = new HtmlRenderer();
			const parsed = reader.parse(this.expandedTest.description);
			this.testDetailsDescription = writer.render(parsed);
		}
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
		if (!this.active) return <Fragment />;
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
					<div
						class={{
							'absolute-bottom box will-animate-blur': true,
							'animate-blur': this.status === 'prompted',
						}}
					>
						<div class='flex-row'>
							<EstimtestLogo />
							<button class='button' onClick={() => this.startTests()}>
								Start Testing
							</button>
						</div>
					</div>
					<div
						class={{
							'absolute-bottom box will-animate-blur': true,
							'animate-blur': this.status === 'active',
						}}
					>
						<div class='flex-column'>
							<div class='flex-row'>
								<p class='title'>{this.activeTest?.name ?? ''}</p>
								<p class='caption'>
									{this.activeTest?.index + 1}/{this.activeConfig?.tests.length}
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
									ref={(el) => (this.testFeedbackElement = el)}
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
								<button class='button' onClick={() => this.nextTest('pass')}>
									Pass
								</button>
								<button class='button' onClick={() => this.nextTest('fail')}>
									Fail
								</button>
							</div>
						</div>
					</div>
					<div
						class={{
							'absolute-center box will-animate-blur': true,
							'animate-blur': this.status === 'finished',
						}}
					>
						<div class='flex-column'>
							<h2 class='title'>Estimtest Finished</h2>
							<div class='flex-column results-grid'>
								{this.testResults.map((result) => (
									<div class={`flex-row full-width ${result.results}`}>
										<h3
											onClick={() => this.toggleTestDetails(result)}
											class='title clickable'
										>
											{result.name}
										</h3>
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
							<button onClick={() => this.promptBeginTests()} class='button'>
								Start Another Test
							</button>
						</div>
					</div>
					<div
						class={{
							'absolute-center box will-animate-blur': true,
							'animate-blur': this.expandedTestActive,
						}}
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
				</div>
			</Host>
		);
	}
}
