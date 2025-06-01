import '@testing-library/jest-dom';

// Optional: define type augmentation
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      // add other custom matchers if needed
    }
  }
}
