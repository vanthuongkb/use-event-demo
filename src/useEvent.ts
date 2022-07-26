import {useLayoutEffect, useRef, useCallback} from 'react';

/**
 * A Hook to define an event handler with an always-stable function identity.
 * @param handler
 * @param dependencies
 */
export const useEvent = <D extends Record<string, any>, T extends (dependencies: D, ...args: any[]) => any>(handler: T, dependencies: D): any => {
	// Ref to capture the handler
	const handlerRef = useRef<T | null>(null);

	// Ref to capture the latest dependencies to inject into the handler as first parameter
	const dependenciesRef = useRef(dependencies);
	dependenciesRef.current = dependencies;

	useLayoutEffect(() => {
		// The purpose of assign the handler inside the useLayoutEffect is to prevent user calling the handler while rendering.
		// It might cause infinite loop if that handler is updating a state
		// By this way, the handler will through Reading property from `null` if it's called during rendering phrase.
		handlerRef.current = handler;

		// Only assign the handler on mounting
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return useCallback((...args: any[]) => {
		// Disable the rule because after the layout effect runs, the handlerRef.current will always be available
		// @ts-ignore
		return handlerRef.current(dependenciesRef.current, ...args);
	}, []);
};
