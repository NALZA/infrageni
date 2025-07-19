# Claude Code Prompt: Extend Infrageni with Education Mode

## Context

I have an existing application called **Infrageni** that contains a system design diagramming tool built with tldraw. I want to extend this application by adding an **education mode** that teaches users system design patterns through example questions and explanations.

## Objectives

1. Add an education mode to the existing Infrageni application
2. Create a library of example system design questions with solutions
3. Implement teaching functionality that explains why specific patterns are used
4. Integrate seamlessly with the existing tldraw-based diagramming interface and existing Patterns library

## Requirements

### Core Features to Implement:

1. **Education Mode Toggle**

   - Add a mode switcher between "Design Mode" and "Education Mode"
   - Preserve existing functionality in Design Mode
   - Create new UI for Education Mode

2. **Question Library System**

   - Create a structured database/collection of system design questions
   - Include difficulty levels (Beginner, Intermediate, Advanced)
   - Categories: Web Architecture, Microservices, Data Storage, Caching, Load Balancing, etc.
   - Each question should include:
     - Problem statement
     - Requirements and constraints
     - Sample solution diagram
     - Step-by-step explanation
     - Pattern explanations

3. **Interactive Learning Interface**

   - Question browser/selector
   - Progress tracking
   - Solution reveal functionality
   - Pattern explanation panels

4. **Pattern Teaching System**
   - Library of common system design patterns
   - Explanations of when and why to use each pattern
   - Interactive annotations on diagrams
   - Best practices and anti-patterns

### Sample Questions to Include:

1. **Beginner Level:**

   - Design a URL shortener (like bit.ly)
   - Design a chat application
   - Design a photo sharing service

2. **Intermediate Level:**

   - Design a ride-sharing service
   - Design a news feed system
   - Design a distributed cache

3. **Advanced Level:**
   - Design a global content delivery network
   - Design a real-time collaboration system
   - Design a distributed search engine

### Technical Implementation:

- Extend existing React/TypeScript codebase (assuming standard web stack)
- Integrate with existing tldraw components
- Add new database models/schemas for questions and patterns
- Create new React components for education mode
- Implement state management for learning progress
- Add routing for education mode pages

### UI/UX Requirements:

- Maintain consistent design with existing application
- Add education-specific navigation
- Create diagram annotation system for explanations
- Implement progressive disclosure for solutions
- Add visual indicators for learning progress

## Expected Deliverables:

1. Extended application with education mode toggle
2. Question library with at least 15 example questions across difficulty levels
3. Pattern explanation system with common system design patterns
4. Interactive learning interface integrated with tldraw
5. Progress tracking functionality
6. Documentation for the new education features

## Technical Constraints:

- Must work with existing tldraw integration
- Maintain current application performance
- Follow existing code patterns and architecture
- Ensure responsive design for different screen sizes
- Support keyboard navigation for accessibility

## Success Criteria:

- Users can switch between design and education modes seamlessly
- Education mode provides structured learning path through system design concepts
- Diagrams are interactive with explanatory annotations
- Pattern explanations are clear and contextual
- Progress is tracked and persistent across sessions
- New patterns are added to the existing Patterns library

Please analyze the existing Infrageni codebase and implement the education mode extension following the requirements above. Focus on clean, maintainable code that integrates well with the existing architecture.
