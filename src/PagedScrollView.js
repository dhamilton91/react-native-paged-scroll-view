import React from 'react'

//Polyfill for Number.isNaN on Safari
//see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
Number.isNaN = Number.isNaN || (value => typeof value === "number" && isNaN(value));

const isPresent = datum => datum !== undefined && !Number.isNaN(datum);

const AddPaging = (ComposedComponent, scrollViewRefPropName) =>
	class extends React.Component {
		constructor(props) {
			super(props);

			this.refProp = {};
			this.refProp[scrollViewRefPropName || 'ref'] = this.getScrollViewRef.bind(this);

			// Important to remember these, but they're not really 'state' variables:
			this.scrollX = 0;
			this.scrollY = 0;
			this.initialized = false;

			// We'll consider these state variables although maybe we shouldn't:
			this.state = {
				totalPages: 0,
				currentPage: null
			};
		}

		initialize() {
			if (this.initialized) return;
			if (isPresent(this.state.totalPages) &&
				isPresent(this.state.currentPage)) {
				this.initialized = true;
				this.props.onInitialization && this.props.onInitialization(this)
			}
		}

		handleScroll(event) {
			// Still trigger the passed callback, if provided:
			this.props.onScroll && this.props.onScroll(event);

			const e = event.nativeEvent;

			// Get values from event:
			this.scrollViewWidth = e.layoutMeasurement.width;
			this.scrollViewHeight = e.layoutMeasurement.height;
			this.innerScrollViewWidth = e.contentSize.width;
			this.innerScrollViewHeight = e.contentSize.height;

			// These are important, but they're not state variables that trigger an update:
			this.scrollX = e.contentOffset.x;
			this.scrollY = e.contentOffset.y;

			this.setPages();
		}

		setPages() {
			const isHorizontal = this.props.horizontal;
			let totalPages;
			if (isHorizontal) {
				totalPages = Math.floor(this.innerScrollViewWidth / this.scrollViewWidth + 0.5);

				this.setState({
					totalPages: totalPages,
					currentPage: Math.min(Math.max(Math.floor(this.scrollX / this.scrollViewWidth + 0.5) + 1, 0), totalPages)
				});
			}
			else {
				totalPages = Math.floor(this.innerScrollViewHeight / this.scrollViewHeight + 0.5);

				this.setState({
					totalPages: totalPages,
					currentPage: Math.min(Math.max(Math.floor(this.scrollY / this.scrollViewHeight + 0.5) + 1, 0), totalPages)
				});
			}
		}

		componentWillUpdate(nextProps, nextState) {
			if (this.props.onPageChange) {
				let sendEvent = false;
				for (const key in nextState) {
					if (nextState.hasOwnProperty(key)) {
						const a = this.state[key];
						const b = nextState[key];
						if (a !== b && !Number.isNaN(b)) {
							sendEvent = true;
						}
					}
				}
				if (sendEvent) {
					this.props.onPageChange(nextState)
				}
			}
		}

		measureScrollView(cb) {
			if (this._scrollView && this._scrollView._scrollViewRef) {
				this._scrollView._scrollViewRef.measure((x, y, w, h) => {
					this.scrollViewWidth = w;
					this.scrollViewHeight = h;
					cb && cb()
				})
			}
		}

		measureInnerScrollView(cb) {
			if (this._scrollView && this._scrollView._innerViewRef) {
				this._scrollView._innerViewRef.measure((x, y, w, h) => {
					this.innerScrollViewWidth = w;
					this.innerScrollViewHeight = h;
					cb && cb();
				})
			}
		}

		_scrollTo(page) {
			const isHorizontal = this.props.horizontal;
			if (isHorizontal) {
				return {
					x: (Math.min(this.state.totalPages, Math.max(1, page)) - 1) * this.scrollViewWidth,
					y: 0
				}
			}
			else {
				return {
					x: 0,
					y: (Math.min(this.state.totalPages, Math.max(1, page)) - 1) * this.scrollViewHeight
				}
			}
		}

		scrollToPage(page, animated) {
			if (this._scrollView) {
				const scrollTo = this._scrollTo(page);
				scrollTo.animated = animated;
				this._scrollView.scrollTo(scrollTo);
			}
		}

		getCurrentPage() {
			return this.state.currentPage;
		}

		scrollToPrevious() {
			this.scrollToPage(this.state.currentPage - 1, false);
		}

		scrollToNext() {
			this.scrollToPage(this.state.currentPage + 1, false);
		}

		componentDidMount() {
			setTimeout(() => {
				let succeededCbs = 0;
				const totalCbs = 2;

				const computeNewState = () => {
					if (++succeededCbs < totalCbs) return;

					this.setPages();

					this.initialize();
				};

				// Trigger both measurements at the same time and compute the new state only
				// once they've both returned.
				this.measureInnerScrollView(computeNewState);
				this.measureScrollView(computeNewState);
			})
		}

		handleContentSizeChange(width, height) {
			this.props.onContentSizeChange && this.props.onContentSizeChange(width, height);

			// Get values from event:
			this.innerScrollViewWidth = width;
			this.innerScrollViewHeight = height;

			this.setPages();

			this.initialize();
		}

		getScrollViewRef(c) {
			this._scrollView = c
		}

		render() {
			return (
				<ComposedComponent
					scrollEventThrottle={this.props.scrollEventThrottle || 16}
					{...this.props}
					{...this.refProp}
					onScroll={this.handleScroll.bind(this)}
					onContentSizeChange={this.handleContentSizeChange.bind(this)}>
					{this.props.children}
				</ComposedComponent>
			)
		}
	};

export default AddPaging
