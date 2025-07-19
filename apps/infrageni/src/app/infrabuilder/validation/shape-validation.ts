import { BaseInfraShapeProps } from '../shapes/base';
import { GENERIC_COMPONENTS } from '../components';

// Validation result interface
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

// Validation rules interface
export interface ValidationRule<T = any> {
    name: string;
    validate: (value: T, context?: any) => ValidationResult;
    critical?: boolean; // If true, failure prevents shape creation
}

// Common validation utilities
export class ShapeValidator {
    
    // Validate numeric properties
    static validateNumber(value: any, min?: number, max?: number, required = true): ValidationResult {
        const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
        
        if (value === undefined || value === null) {
            if (required) {
                result.isValid = false;
                result.errors.push('Value is required');
            }
            return result;
        }
        
        if (typeof value !== 'number' || isNaN(value)) {
            result.isValid = false;
            result.errors.push('Value must be a valid number');
            return result;
        }
        
        if (min !== undefined && value < min) {
            result.isValid = false;
            result.errors.push(`Value must be at least ${min}`);
        }
        
        if (max !== undefined && value > max) {
            result.isValid = false;
            result.errors.push(`Value must be at most ${max}`);
        }
        
        return result;
    }
    
    // Validate string properties
    static validateString(value: any, minLength?: number, maxLength?: number, required = true): ValidationResult {
        const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
        
        if (value === undefined || value === null) {
            if (required) {
                result.isValid = false;
                result.errors.push('Value is required');
            }
            return result;
        }
        
        if (typeof value !== 'string') {
            result.isValid = false;
            result.errors.push('Value must be a string');
            return result;
        }
        
        if (minLength !== undefined && value.length < minLength) {
            result.isValid = false;
            result.errors.push(`Value must be at least ${minLength} characters`);
        }
        
        if (maxLength !== undefined && value.length > maxLength) {
            result.isValid = false;
            result.errors.push(`Value must be at most ${maxLength} characters`);
        }
        
        return result;
    }
    
    // Validate color properties
    static validateColor(value: any): ValidationResult {
        const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
        
        if (typeof value !== 'string') {
            result.isValid = false;
            result.errors.push('Color must be a string');
            return result;
        }
        
        // Valid color names or hex values
        const validColors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'violet'];
        const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        
        if (!validColors.includes(value) && !hexPattern.test(value)) {
            result.warnings.push(`Color '${value}' may not be supported. Use standard colors or hex values.`);
        }
        
        return result;
    }
    
    // Validate component ID
    static validateComponentId(value: any): ValidationResult {
        const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
        
        if (typeof value !== 'string') {
            result.isValid = false;
            result.errors.push('Component ID must be a string');
            return result;
        }
        
        const validComponent = GENERIC_COMPONENTS.find(c => c.id === value);
        if (!validComponent) {
            result.isValid = false;
            result.errors.push(`Invalid component ID: ${value}`);
        }
        
        return result;
    }
    
    // Validate boolean properties
    static validateBoolean(value: any, required = false): ValidationResult {
        const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
        
        if (value === undefined || value === null) {
            if (required) {
                result.isValid = false;
                result.errors.push('Value is required');
            }
            return result;
        }
        
        if (typeof value !== 'boolean') {
            result.isValid = false;
            result.errors.push('Value must be a boolean');
        }
        
        return result;
    }
}

// Shape property validation rules
export const BASE_SHAPE_RULES: Record<keyof BaseInfraShapeProps, ValidationRule> = {
    w: {
        name: 'width',
        validate: (value) => ShapeValidator.validateNumber(value, 20, 2000),
        critical: true
    },
    h: {
        name: 'height', 
        validate: (value) => ShapeValidator.validateNumber(value, 20, 2000),
        critical: true
    },
    color: {
        name: 'color',
        validate: (value) => ShapeValidator.validateColor(value),
        critical: false
    },
    label: {
        name: 'label',
        validate: (value) => ShapeValidator.validateString(value, 1, 100),
        critical: true
    },
    componentId: {
        name: 'componentId',
        validate: (value) => ShapeValidator.validateComponentId(value),
        critical: true
    },
    isBoundingBox: {
        name: 'isBoundingBox',
        validate: (value) => ShapeValidator.validateBoolean(value, false),
        critical: false
    },
    opacity: {
        name: 'opacity',
        validate: (value) => ShapeValidator.validateNumber(value, 0, 1, false),
        critical: false
    }
};

// Main validation function for shape properties
export function validateShapeProperties(props: Partial<BaseInfraShapeProps>): ValidationResult {
    const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
    
    // Validate each property
    for (const [propName, rule] of Object.entries(BASE_SHAPE_RULES)) {
        if (propName in props) {
            const propResult = rule.validate(props[propName as keyof BaseInfraShapeProps]);
            
            if (!propResult.isValid) {
                result.isValid = false;
                result.errors.push(`${rule.name}: ${propResult.errors.join(', ')}`);
            }
            
            result.warnings.push(...propResult.warnings);
        }
    }
    
    // Additional cross-property validations
    if (props.isBoundingBox && props.opacity === undefined) {
        result.warnings.push('Bounding box shapes should specify opacity for better visibility');
    }
    
    if (props.w && props.h && props.w > props.h * 3) {
        result.warnings.push('Shape has unusual aspect ratio (very wide)');
    }
    
    if (props.w && props.h && props.h > props.w * 3) {
        result.warnings.push('Shape has unusual aspect ratio (very tall)');
    }
    
    return result;
}

// Validate shape on creation or update
export function validateShape(shapeType: string, props: BaseInfraShapeProps): ValidationResult {
    const baseValidation = validateShapeProperties(props);
    
    // Helper function to normalize component IDs for validation
    const normalizeComponentId = (id: string): string => {
        // Remove provider prefixes (generic-, aws-, azure-, gcp-)
        return id.replace(/^(generic-|aws-|azure-|gcp-)/, '');
    };

    // Type-specific validations
    const typeValidations: Record<string, (props: BaseInfraShapeProps) => ValidationResult> = {
        vpc: (props) => {
            const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
            if (!props.isBoundingBox) {
                result.warnings.push('VPC shapes should typically be bounding boxes');
            }
            if (props.w && props.w < 300) {
                result.warnings.push('VPC shapes should be at least 300px wide for content');
            }
            return result;
        },
        subnet: (props) => {
            const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
            if (!props.isBoundingBox) {
                result.warnings.push('Subnet shapes should typically be bounding boxes');
            }
            return result;
        },
        'availability-zone': (props) => {
            const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
            if (!props.isBoundingBox) {
                result.warnings.push('Availability Zone shapes should typically be bounding boxes');
            }
            return result;
        }
    };
    
    const normalizedShapeType = normalizeComponentId(shapeType);
    if (typeValidations[normalizedShapeType]) {
        const typeResult = typeValidations[normalizedShapeType](props);
        baseValidation.warnings.push(...typeResult.warnings);
        baseValidation.errors.push(...typeResult.errors);
        if (!typeResult.isValid) {
            baseValidation.isValid = false;
        }
    }
    
    return baseValidation;
}

// Helper to format validation errors for user display
export function formatValidationErrors(result: ValidationResult): string {
    const messages: string[] = [];
    
    if (result.errors.length > 0) {
        messages.push(`Errors: ${result.errors.join('; ')}`);
    }
    
    if (result.warnings.length > 0) {
        messages.push(`Warnings: ${result.warnings.join('; ')}`);
    }
    
    return messages.join('\n');
}