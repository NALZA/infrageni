// Validation module exports
export * from './shape-validation';
export * from './shape-error-handler';
export * from './validation-test';

// Re-export commonly used types and functions
export type { ValidationResult } from './shape-validation';
export type { ErrorHandlerConfig } from './shape-error-handler';
export { 
    validateShapeProperties, 
    validateShape, 
    formatValidationErrors 
} from './shape-validation';
export { 
    ShapeErrorHandler, 
    ErrorHandlingMode, 
    globalShapeErrorHandler,
    handleShapeCreationError,
    handleShapeUpdateError
} from './shape-error-handler';
export {
    runValidationTests,
    testPersistence,
    runAllTests
} from './validation-test';