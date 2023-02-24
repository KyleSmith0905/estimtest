import {
	Component,
	Fragment,
	h,
	Host,
	Prop,
	State,
	Watch,
} from '@stencil/core';
import { defaultEstimtestConfig, EstimtestConfig } from '../lib/config';
import { EstimtestTest, performTest } from '../lib/tests';
import { HtmlRenderer, Parser } from 'commonmark';

@Component({
	tag: 'estimtest-core',
	styleUrl: 'core.css',
	shadow: true,
})
export class EstimtestCore {
	@Prop()
	config?: EstimtestConfig;

	@Prop()
	active?: boolean = true;

	@State()
	status: 'inactive' | 'prompted' | 'active' | 'finished' = 'inactive';

	@State()
	activeConfig?: EstimtestConfig = defaultEstimtestConfig;

	@State()
	activeTest?: EstimtestTest;

	@State()
	testDetailsExpanded?: boolean;

	@State()
	testDetailsDescription?: string;

	@State()
	testResults?: EstimtestTest[];

	@State()
	errors: Record<string, { message: string; visible: boolean }> = {};

	@Watch('config')
	watchConfigHandler() {
		this.updateConfig();
	}

	componentDidLoad() {
		if (this.active) {
			this.promptBeginTests();
		}
	}

	promptBeginTests() {
		this.status = 'prompted';
	}

	startTests() {
		this.updateConfig();
		this.activeTest = {
			index: 0,
			...this.activeConfig.tests[0],
		};
		this.status = 'active';

		performTest(this.activeTest, this.activeConfig);
	}

	nextTest(results: 'fail' | 'pass') {
		this.testResults.push({
			results: results,
			notes: '',
			...this.activeTest,
		});

		const nextIndex = this.activeTest.index + 1;
		if (this.activeTest.index > this.activeConfig.tests.length) {
			this.finishTests();
		}

		this.activeTest = {
			index: nextIndex,
			...this.activeConfig.tests[nextIndex],
		};

		performTest(this.activeTest, this.activeConfig);
	}

	finishTests() {
		this.status = 'finished';
	}

	updateConfig() {
		// Warn user that the estimtest config could not be changed during testing.
		if (this.status === 'active') {
			this.errorHandler(
				'The configuration file could not be changed during active testing.'
			);
		}
		this.activeConfig = { ...defaultEstimtestConfig, ...this.config };
	}

  toggleTestDetails() {
    this.testDetailsExpanded = !this.testDetailsExpanded;
    if (this.testDetailsExpanded) {
      const reader = new Parser();
      const writer = new HtmlRenderer();
      const parsed = reader.parse(this.activeTest.description);
      this.testDetailsDescription = writer.render(parsed);
      console.log(this.testDetailsDescription);
    }
  }

	errorHandler(message: string) {
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
						{Object.values(this.errors).map((element) => (
							<div class='absolute-top box'>
								<h2 class='title'>Error</h2>
								<p>{element.message}</p>
							</div>
						))}
					</div>
					{this.status === 'prompted' && (
						<div class='absolute-bottom box'>
							<div class='flex-row'>
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
								<button class='button' onClick={() => this.startTests()}>
									Start Testing
								</button>
							</div>
						</div>
					)}
					{this.status === 'active' && (
						<Fragment>
							<div class='absolute-bottom box'>
								<div class='flex-column'>
									<div class='flex-row'>
										<p class='title'>{this.activeTest.name}</p>
										<p class='caption'>
											{this.activeTest.index + 1}/
											{this.activeConfig.tests.length}
										</p>
										<button
											onClick={() => this.toggleTestDetails()}
											class='button'
										>
											<svg style={{'--size': '1rem'}} class={{'upside-down': this.testDetailsExpanded, 'square': true}} viewBox='0 0 67.7 36'>
												<path
													fill='none'
													stroke='#fff'
													stroke-linecap='round'
													stroke-linejoin='round'
													stroke-width='16.9'
													d='m8.5 27.5 25.4-19 25.4 19'
												/>
											</svg>
										</button>
									</div>
									<div class='flex-row'>
										<span
											role='input'
											class='button fake-textarea'
											contenteditable='true'
										/>
										<button
											class='button'
											onClick={() => this.nextTest('pass')}
										>
											Pass
										</button>
										<button
											class='button'
											onClick={() => this.nextTest('fail')}
										>
											Fail
										</button>
									</div>
								</div>
							</div>
              <div class={{'absolute-center': true, 'box': true, 'will-animate-blur': true, 'animate-blur': this.testDetailsExpanded}}>
                <div class='flex-column'>
                  <div class='flex-row'>
                    <h2 class='title'>{this.activeTest.name}</h2>
                    <button class='button' onClick={() => this.toggleTestDetails()}>
                      <svg class='square' style={{'--size': '1rem'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 67.7 67.7">
                        <path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="16.9" d="m8.5 8.5 50.8 50.8m-50.8 0L59.3 8.5"/>
                      </svg>
                    </button>
                  </div>
                  <div class='paragraph' innerHTML={this.testDetailsDescription}/>
                </div>
              </div>
						</Fragment>
					)}
					{this.status === 'finished' && (
						<div class='absolute-center box'>
							<div class='flex-row'>
								<h2 class='title'>Estimtest Finished</h2>
								<button class='button'>Start Another Test</button>
							</div>
						</div>
					)}
				</div>
			</Host>
		);
	}
}
