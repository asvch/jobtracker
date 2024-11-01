import { useEffect, useState } from 'react';

/**
 * Custom hook that returns a debounced value. The value will only be updated
 * after the specified delay has passed without the value changing.
 *
 * @template T - The type of the value to be debounced.
 * @param {T} value - The value to be debounced.
 * @param {number} delay - The delay in milliseconds to wait before updating the debounced value.
 * @returns {T} - The debounced value.
 *
 * @example
 * const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
 */
const useDebouncedValue = <T>(value: T, delay: number): T => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Cleanup the timeout if value changes before the delay completes
		return () => clearTimeout(handler);
	}, [value, delay]);

	return debouncedValue;
};

export default useDebouncedValue;
