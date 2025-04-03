import { throwGracefulError } from './error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncFunction<T extends Record<string, any>, R> = (args: T) => Promise<R>;

/**
 * Ensures `dependent` runs only if `dependency` succeeds.
 *
 * @param dependent - The main function that runs after `dependency`.
 * @param dependency - The function that must succeed first.
 * @returns A wrapped function that takes an object and routes it properly.
 */
export function withDependencyOn<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>, // The shared object type
  DepRet, // Dependency return type
  DependentRet, // Dependent return type
>(
  dependent: AsyncFunction<T, DependentRet>,
  dependency: AsyncFunction<T, DepRet>
): (args: T) => Promise<DependentRet> {
  return async function (args: T): Promise<DependentRet> {
    try {
      // Run dependency function
      await dependency(args);
    } catch (error) {
      return throwGracefulError(
        `${withDependencyOn.name}: ${dependency.name} --> ${dependent.name}`,
        (error as Error).message
      ) as DependentRet;
    }

    // Run dependent function
    return await dependent(args);
  };
}
