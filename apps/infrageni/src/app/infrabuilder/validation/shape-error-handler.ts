import { BaseInfraShapeProps } from '../shapes/base';
import { ValidationResult, validateShape } from './shape-validation';

// Error handling modes
export enum ErrorHandlingMode {
    STRICT = 'strict',     // Prevent invalid shapes from being created
    PERMISSIVE = 'permissive', // Allow creation with warnings
    CORRECTIVE = 'corrective'  // Automatically correct invalid properties
}

// Error handler configuration
export interface ErrorHandlerConfig {
    mode: ErrorHandlingMode;
    showUserFeedback: boolean;
    logToConsole: boolean;
    throwOnCriticalErrors: boolean;
}

// Default configuration
export const DEFAULT_ERROR_CONFIG: ErrorHandlerConfig = {
    mode: ErrorHandlingMode.CORRECTIVE,
    showUserFeedback: false, // Can be enabled when UI feedback is implemented
    logToConsole: true,
    throwOnCriticalErrors: false
};

// Shape correction utilities
export class ShapeCorrector {
    
    // Correct invalid numeric properties
    static correctNumber(value: any, min: number, max: number, defaultValue: number): number {
        if (typeof value !== 'number' || isNaN(value)) {
            return defaultValue;
        }
        return Math.max(min, Math.min(max, value));
    }
    
    // Correct invalid string properties
    static correctString(value: any, maxLength: number, defaultValue: string): string {
        if (typeof value !== 'string') {
            return defaultValue;
        }
        return value.length > maxLength ? value.substring(0, maxLength) : value;
    }
    
    // Correct invalid color properties
    static correctColor(value: any): string {
        const validColors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'violet'];
        
        if (typeof value !== 'string' || !validColors.includes(value)) {
            return 'blue'; // Default color
        }
        
        return value;
    }
    
    // Correct invalid component ID
    static correctComponentId(value: any, validIds: string[]): string {
        if (typeof value !== 'string' || !validIds.includes(value)) {
            return validIds[0] || 'compute'; // Fallback to first valid ID or compute
        }
        
        return value;
    }
    
    // Auto-correct shape properties
    static correctShapeProperties(props: Partial<BaseInfraShapeProps>): BaseInfraShapeProps {
        const validComponentIds = ['vpc', 'subnet', 'availability-zone', 'compute', 'database', 'storage', 'external-system', 'user'];
        
        return {
            w: ShapeCorrector.correctNumber(props.w, 20, 2000, 120),
            h: ShapeCorrector.correctNumber(props.h, 20, 2000, 80),
            color: ShapeCorrector.correctColor(props.color),
            label: ShapeCorrector.correctString(props.label, 100, 'Unnamed Component'),
            componentId: ShapeCorrector.correctComponentId(props.componentId, validComponentIds),
            isBoundingBox: typeof props.isBoundingBox === 'boolean' ? props.isBoundingBox : false,
            opacity: props.opacity !== undefined 
                ? ShapeCorrector.correctNumber(props.opacity, 0, 1, 0.1)
                : undefined
        };
    }
}

// Main error handler class
export class ShapeErrorHandler {
    private config: ErrorHandlerConfig;
    
    constructor(config: Partial<ErrorHandlerConfig> = {}) {
        this.config = { ...DEFAULT_ERROR_CONFIG, ...config };
    }
    
    // Handle shape creation errors
    handleShapeCreation(shapeType: string, props: Partial<BaseInfraShapeProps>): BaseInfraShapeProps {
        const validation = validateShape(shapeType, props as BaseInfraShapeProps);
        
        if (this.config.logToConsole) {
            if (!validation.isValid) {
                console.error(`Shape creation validation failed for ${shapeType}:`, validation.errors);
            }
            if (validation.warnings.length > 0) {
                console.warn(`Shape creation warnings for ${shapeType}:`, validation.warnings);
            }
        }
        
        switch (this.config.mode) {
            case ErrorHandlingMode.STRICT:
                if (!validation.isValid) {
                    if (this.config.throwOnCriticalErrors) {
                        throw new Error(`Invalid shape properties for ${shapeType}: ${validation.errors.join(', ')}`);
                    }
                    // Return original props in strict mode, let tldraw handle it
                    return props as BaseInfraShapeProps;
                }
                break;
                
            case ErrorHandlingMode.CORRECTIVE:
                if (!validation.isValid) {
                    const correctedProps = ShapeCorrector.correctShapeProperties(props);
                    if (this.config.logToConsole) {
                        console.info(`Auto-corrected shape properties for ${shapeType}`);
                    }
                    return correctedProps;
                }
                break;
                
            case ErrorHandlingMode.PERMISSIVE:
                // Allow creation regardless of validation, just log
                break;
        }
        
        return props as BaseInfraShapeProps;
    }
    
    // Handle shape update errors
    handleShapeUpdate(shapeType: string, oldProps: BaseInfraShapeProps, newProps: BaseInfraShapeProps): BaseInfraShapeProps {
        const validation = validateShape(shapeType, newProps);
        
        if (this.config.logToConsole) {
            if (!validation.isValid) {
                console.error(`Shape update validation failed for ${shapeType}:`, validation.errors);
            }
            if (validation.warnings.length > 0) {
                console.warn(`Shape update warnings for ${shapeType}:`, validation.warnings);
            }
        }
        
        switch (this.config.mode) {
            case ErrorHandlingMode.STRICT:
                if (!validation.isValid) {
                    // Revert to old properties on validation failure
                    return oldProps;
                }
                break;
                
            case ErrorHandlingMode.CORRECTIVE:
                if (!validation.isValid) {
                    const correctedProps = ShapeCorrector.correctShapeProperties(newProps);
                    if (this.config.logToConsole) {
                        console.info(`Auto-corrected shape update for ${shapeType}`);
                    }
                    return correctedProps;
                }
                break;
                
            case ErrorHandlingMode.PERMISSIVE:
                // Allow update regardless of validation
                break;
        }
        
        return newProps;
    }
    
    // Show user feedback (placeholder for future UI implementation)
    private showUserFeedback(message: string, type: 'error' | 'warning' | 'info') {
        if (!this.config.showUserFeedback) return;
        
        // Placeholder for future toast notification or modal implementation
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
    
    // Update configuration
    updateConfig(newConfig: Partial<ErrorHandlerConfig>) {
        this.config = { ...this.config, ...newConfig };
    }
    
    // Get current configuration
    getConfig(): ErrorHandlerConfig {
        return { ...this.config };
    }
}

// Global error handler instance
export const globalShapeErrorHandler = new ShapeErrorHandler();

// Utility function for quick error handling
export function handleShapeCreationError(shapeType: string, props: Partial<BaseInfraShapeProps>): BaseInfraShapeProps {
    return globalShapeErrorHandler.handleShapeCreation(shapeType, props);
}

export function handleShapeUpdateError(shapeType: string, oldProps: BaseInfraShapeProps, newProps: BaseInfraShapeProps): BaseInfraShapeProps {
    return globalShapeErrorHandler.handleShapeUpdate(shapeType, oldProps, newProps);
}