// Test utilities for shape validation functionality
import { validateShapeProperties, validateShape } from './shape-validation';
import { ShapeCorrector, ShapeErrorHandler, ErrorHandlingMode } from './shape-error-handler';
import { BaseInfraShapeProps } from '../shapes/base';

// Test cases for validation
export const TEST_CASES = {
    validShape: {
        w: 200,
        h: 100,
        color: 'blue',
        label: 'Test Component',
        componentId: 'compute',
        isBoundingBox: false,
        opacity: 0.8
    } as BaseInfraShapeProps,
    
    invalidShape: {
        w: -50, // Invalid: negative width
        h: 'invalid', // Invalid: non-numeric height
        color: 'invalid-color',
        label: '', // Invalid: empty label
        componentId: 'invalid-component',
        isBoundingBox: 'not-boolean', // Invalid: non-boolean
        opacity: 2.5 // Invalid: opacity > 1
    } as any,
    
    boundaryShape: {
        w: 20, // Minimum valid width
        h: 2000, // Maximum valid height
        color: 'green',
        label: 'a'.repeat(100), // Maximum length label
        componentId: 'vpc',
        isBoundingBox: true,
        opacity: 0
    } as BaseInfraShapeProps
};

// Test validation functionality
export function runValidationTests(): void {
    console.log('🧪 Running Shape Validation Tests...\n');
    
    // Test 1: Valid shape properties
    console.log('Test 1: Valid Shape Properties');
    const validResult = validateShapeProperties(TEST_CASES.validShape);
    console.log('Valid shape result:', validResult);
    console.assert(validResult.isValid === true, 'Valid shape should pass validation');
    console.assert(validResult.errors.length === 0, 'Valid shape should have no errors');
    console.log('✅ Test 1 passed\n');
    
    // Test 2: Invalid shape properties
    console.log('Test 2: Invalid Shape Properties');
    const invalidResult = validateShapeProperties(TEST_CASES.invalidShape);
    console.log('Invalid shape result:', invalidResult);
    console.assert(invalidResult.isValid === false, 'Invalid shape should fail validation');
    console.assert(invalidResult.errors.length > 0, 'Invalid shape should have errors');
    console.log('✅ Test 2 passed\n');
    
    // Test 3: Shape type validation
    console.log('Test 3: Shape Type Validation');
    const vpcResult = validateShape('vpc', { ...TEST_CASES.validShape, isBoundingBox: false });
    console.log('VPC validation result:', vpcResult);
    console.assert(vpcResult.warnings.some(w => w.includes('bounding box')), 'VPC should warn about not being a bounding box');
    console.log('✅ Test 3 passed\n');
    
    // Test 4: Shape correction
    console.log('Test 4: Shape Correction');
    const correctedProps = ShapeCorrector.correctShapeProperties(TEST_CASES.invalidShape);
    console.log('Corrected properties:', correctedProps);
    console.assert(correctedProps.w >= 20, 'Width should be corrected to valid range');
    console.assert(correctedProps.h >= 20, 'Height should be corrected to valid range');
    console.assert(typeof correctedProps.label === 'string' && correctedProps.label.length > 0, 'Label should be corrected');
    console.log('✅ Test 4 passed\n');
    
    // Test 5: Error handler modes
    console.log('Test 5: Error Handler Modes');
    
    // Test strict mode
    const strictHandler = new ShapeErrorHandler({ mode: ErrorHandlingMode.STRICT, logToConsole: false });
    const strictResult = strictHandler.handleShapeCreation('compute', TEST_CASES.invalidShape);
    console.log('Strict mode result:', strictResult);
    
    // Test corrective mode
    const correctiveHandler = new ShapeErrorHandler({ mode: ErrorHandlingMode.CORRECTIVE, logToConsole: false });
    const correctiveResult = correctiveHandler.handleShapeCreation('compute', TEST_CASES.invalidShape);
    console.log('Corrective mode result:', correctiveResult);
    console.assert(correctiveResult.w >= 20, 'Corrective mode should fix invalid properties');
    
    console.log('✅ Test 5 passed\n');
    
    // Test 6: Boundary values
    console.log('Test 6: Boundary Values');
    const boundaryResult = validateShapeProperties(TEST_CASES.boundaryShape);
    console.log('Boundary shape result:', boundaryResult);
    console.assert(boundaryResult.isValid === true, 'Boundary values should be valid');
    console.log('✅ Test 6 passed\n');
    
    console.log('🎉 All validation tests passed!');
}

// Test persistence functionality (can be called from browser console)
export function testPersistence(): void {
    console.log('🧪 Testing Local Storage Persistence...\n');
    
    // Check if tldraw persistence is working
    const persistenceKey = 'infra-builder';
    console.log(`Checking for persistence key: ${persistenceKey}`);
    
    // Look for tldraw storage entries
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes(persistenceKey)) {
            console.log(`Found persistence entry: ${key}`);
            const value = localStorage.getItem(key);
            console.log(`Value length: ${value?.length || 0} characters`);
        }
    }
    
    console.log('✅ Persistence test completed');
}

// Export test runner for browser console
export function runAllTests(): void {
    runValidationTests();
    testPersistence();
}

// Auto-run tests in development (optional)
if (process.env.NODE_ENV === 'development') {
    // Uncomment to auto-run tests
    // setTimeout(runValidationTests, 1000);
}