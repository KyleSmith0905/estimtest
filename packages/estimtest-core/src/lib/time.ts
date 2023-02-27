const sleep = async (milliseconds = 0): Promise<void> => {
	return new Promise((resolve) => setTimeout(() => resolve(), milliseconds));
};

export { sleep };