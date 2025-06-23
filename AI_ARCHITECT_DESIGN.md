# **Architecture Design: AI Architect Feature for infrageni**

## **1. Overview and Goals**

### **Current State**

**infrageni** is a modern, web-based visual diagramming tool that allows users to manually create, arrange, and connect infrastructure components on a digital canvas. The application currently provides a rich, interactive experience for users who have a clear vision of the architecture they wish to design. However, it relies entirely on the user's knowledge and effort to translate concepts into diagrams.

### **User Problem**

Designing complex software and cloud architectures from a blank canvas is time-consuming and can be a significant barrier for developers, architects, and students. Users often spend more time on the mechanics of diagramming (dragging, dropping, connecting, arranging) than on the high-level design itself. This friction slows down brainstorming, documentation, and knowledge sharing.

### **Goals**

The "AI Architect" feature aims to solve this problem by introducing an intelligent design partner into the workflow. The primary goals are:

- **Increase User Productivity:** Drastically reduce the time it takes to create complex architecture diagrams by allowing users to generate them from a simple natural language description.
- **Provide a Starting Point:** Offer users a solid, well-structured starting point for their designs, which they can then refine and expand using the existing manual tools.
- **Democratize Design:** Enable users with less diagramming experience to create professional-looking and accurate architecture diagrams.

## **2. Functional and Non-Functional Requirements**

### **Functional Requirements**

- **F1. Natural Language Input:** The system must provide a dedicated UI element (e.g., a text input or command bar) to accept multi-sentence natural language text from the user.
- **F2. Intent Interpretation:** The system must interpret the user's text to identify:
  - **Architectural Components:** e.g., "microservice," "PostgreSQL database," "API gateway," "S3 bucket," "React frontend."
  - **Relationships:** e.g., "connects to," "reads from," "is behind," "sends requests to."
  - **Grouping/Boundaries:** e.g., "inside a VPC," "in the private subnet."
- **F3. Structured Data Generation:** The system must convert the interpreted intent into a structured, predictable JSON format representing the diagram's nodes (shapes) and edges (arrows).
- **F4. Visual Rendering:** The system must use the generated JSON to render a clean, auto-arranged visual diagram on the existing **Tldraw** canvas.
- **F5. Iterative Refinement:** The user must be able to issue follow-up commands to modify the existing diagram (e.g., "Now add a Redis cache between the API and the database").

### **Non-Functional Requirements**

- **NF1. Latency:** The end-to-end time from submitting the prompt to seeing the initial rendered diagram should be **under 8 seconds** for typical requests.
- **NF2. Accuracy:** The system should correctly interpret at least **90%** of common architectural patterns and components when described in clear, unambiguous language.
- **NF3. Scalability:** The backend infrastructure must be designed to handle at least **100 concurrent diagram generation requests** without significant performance degradation.
- **NF4. Cost-Effectiveness:** The solution must include strategies to manage and minimize LLM token consumption and compute costs, such as using more efficient models and implementing request limits.

## **3. High-Level Architecture**

The new services will be integrated with the existing **infrageni** frontend and a new backend. The architecture follows a microservices-oriented approach to separate concerns and ensure scalability.

```mermaid
graph TD
    subgraph User's Browser
        A[infrageni Frontend (React + Tldraw)]
    end

    subgraph New Backend Services (Node.js)
        B[Orchestration Service (Express API)]
        C[LLM Integration Layer]
        D[Diagram Layout Service (Dagre.js)]
    end

    subgraph External Services
        E[Large Language Model (e.g., Claude 3)]
    end

    subgraph Data Stores
        F[PostgreSQL Database]
    end

    A -- "1. POST /api/v1/ai-architect/generate\n(User Prompt)" --> B
    B -- "2. Authenticate & Construct Prompt" --> C
    C -- "3. Call LLM API" --> E
    E -- "4. Return Structured JSON" --> C
    C -- "5. Validated JSON" --> B
    B -- "6. Pass JSON to Layout Service" --> D
    D -- "7. Return JSON with x/y coordinates" --> B
    B -- "8. Store Diagram & History" --> F
    B -- "9. Send Final Diagram JSON to Client" --> A
```

## **4. Component Deep-Dive**

### **Frontend Client (Existing `apps/infrageni`)**

- **UI Components:**
  - A new, non-intrusive text input bar will be added to the main canvas interface, possibly in the top or bottom toolbar.
  - Loading indicators (e.g., a spinner or a "Generating..." message) will provide feedback to the user while the backend is processing the request.
- **Canvas Integration (`canvas.tsx`):**
  - Upon receiving the final diagram JSON from the **Orchestration Service**, the client will iterate through the `nodes` and `edges` arrays.
  - It will use the Tldraw `editor.createShape()` method to programmatically create each component and arrow on the canvas, using the coordinates and properties provided by the backend.
  - The existing `customShapeUtils` will be used to ensure the AI-generated shapes match the style and behavior of manually created ones.

### **Backend Orchestration Service (New Node.js/Express App)**

- **Responsibilities:**
  - Exposes the primary REST API endpoint: `POST /api/v1/ai-architect/generate`.
  - Handles user authentication and authorization.
  - Manages conversation state to allow for iterative diagram refinements.
  - Orchestrates the flow between the LLM layer, the layout service, and the database.
  - Validates incoming requests and outgoing data payloads.

### **LLM Integration & Prompt Engineering Layer**

- **LLM Choice:** **Claude 3 Sonnet**.
  - **Rationale:** It offers an excellent balance of performance, intelligence, and cost. Its large context window is beneficial for handling complex prompts and conversation history, and it has strong JSON output capabilities.
- **Prompt Engineering Strategy:**
  - The user's raw text will be wrapped in a carefully engineered system prompt.
  - This prompt will instruct the LLM to act as a solutions architect, analyze the text, and **only** output a JSON object that conforms to a specific, predefined schema.
  - **Few-shot examples** will be included in the prompt to provide the LLM with concrete examples of input text and desired JSON output, dramatically improving reliability.
- **Target JSON Schema (Example):**
  ```json
  {
    "nodes": [
      {
        "id": "node-1",
        "type": "component",
        "componentType": "aws.compute.ec2",
        "label": "React Frontend"
      },
      {
        "id": "node-2",
        "type": "component",
        "componentType": "aws.network.api-gateway",
        "label": "API Gateway"
      },
      {
        "id": "node-3",
        "type": "component",
        "componentType": "aws.database.rds-postgresql",
        "label": "PostgreSQL DB"
      }
    ],
    "edges": [
      {
        "id": "edge-1",
        "from": "node-1",
        "to": "node-2",
        "label": "HTTP Requests"
      },
      {
        "id": "edge-2",
        "from": "node-2",
        "to": "node-3",
        "label": "Reads/Writes"
      }
    ]
  }
  ```

### **Diagram Layout & Rendering Logic**

- This logic will reside in a dedicated service or module within the Node.js backend.
- It will use the **Dagre.js** library, a robust graph layout algorithm perfect for creating hierarchical, top-to-bottom layouts.
- **Process:**
  1.  Receives the raw JSON (nodes and edges) from the LLM.
  2.  Initializes a new Dagre graph object.
  3.  Iterates through the nodes and edges, adding them to the Dagre graph with estimated width and height.
  4.  Runs the layout algorithm.
  5.  Dagre calculates and assigns optimal `x` and `y` coordinates to each node.
  6.  This enhanced JSON (with coordinates) is then returned to the Orchestration Service.

### **Data Persistence**

- **Database:** **PostgreSQL**.
  - **Rationale:** Its relational nature is ideal for storing structured data like diagrams and conversation history. It's reliable, scalable, and has excellent support in the Node.js ecosystem (e.g., with the `pg` library or an ORM like Prisma).
- **Schema:**
  - `diagrams` table: Stores the final JSON of each generated diagram, linked to a user ID.
  - `conversations` table: Stores the history of prompts and responses for a given diagram session to support iterative refinements.
  - `feedback` table: Allows users to rate the accuracy of a generated diagram, providing valuable data for future fine-tuning.

## **5. Data Flow and Sequence**

1.  **User Input:** The user types "Create a web app with a React frontend, an API Gateway, and a PostgreSQL database" into the AI Architect input bar and submits.
2.  **Frontend Request:** The frontend sends a `POST` request to `/api/v1/ai-architect/generate` with the user's text as the payload.
3.  **Backend Orchestration:** The **Orchestration Service** receives the request. It authenticates the user and constructs a detailed prompt for the LLM, including the user's text, system instructions, few-shot examples, and the required JSON schema.
4.  **LLM Call:** The **LLM Integration Layer** sends the compiled prompt to the **Claude 3 Sonnet** API.
5.  **LLM Response:** The LLM processes the prompt and returns a JSON object containing the identified nodes and edges, but without positional data.
6.  **Validation & Layout:** The **Orchestration Service** validates the returned JSON against the expected schema. It then passes the valid JSON to the **Diagram Layout Service**.
7.  **Coordinate Calculation:** The **Layout Service** uses **Dagre.js** to calculate the `x` and `y` coordinates for each node and returns the enhanced JSON.
8.  **Persistence & Response:** The **Orchestration Service** saves the diagram and conversation turn to the **PostgreSQL** database and sends the final, layout-enhanced JSON back to the frontend client.
9.  **Frontend Rendering:** The **infrageni** client receives the JSON and uses the **Tldraw** `editor.createShape()` API to render the three components and two connecting arrows on the user's canvas.

## **6. Technology Stack and Justifications**

- **Backend Framework:** **Node.js / Express**
  - **Justification:** Aligns with the frontend's TypeScript ecosystem, allowing for shared code, types, and developer skills. It's fast, has a massive package ecosystem, and is well-suited for I/O-bound operations like handling API requests.
- **LLM Provider:** **Anthropic (Claude 3 Sonnet)**
  - **Justification:** Provides a great combination of cost, speed, and accuracy for this use case. Can be swapped out if needed.
- **Diagram Layout:** **Dagre.js**
  - **Justification:** A mature, special-purpose library for directed graph layout that solves the complex problem of auto-arranging nodes cleanly.
- **Database:** **PostgreSQL**
  - **Justification:** A powerful, open-source relational database that is highly reliable and perfect for storing the structured data this feature requires.
- **Deployment (Assumed):** **AWS Lambda / API Gateway** or **Docker Containers on ECS/EKS**
  - **Justification:** A serverless approach with Lambda would be highly scalable and cost-effective. A container-based approach would offer more control and is also highly scalable.

## **7. Risks and Mitigation Strategies**

- **Risk: LLM Hallucination/Inaccuracy**
  - **Mitigation:**
    1.  **Rigorous Prompt Engineering:** Use few-shot examples and strong system instructions.
    2.  **Schema Validation:** Strictly validate the LLM's JSON output. If it doesn't conform, retry the request or return an error.
    3.  **User Feedback Loop:** Implement a "thumbs up/down" feature for users to report inaccurate diagrams, providing data for prompt refinement.
- **Risk: Vendor Lock-in (LLM Provider)**
  - **Mitigation:** Create an abstraction layer (a "LLM Adapter") in the **LLM Integration Layer**. This will allow the backend to be switched from Claude to another provider (like OpenAI or Gemini) by simply implementing a new adapter, without changing the core application logic.
- **Risk: Cost Overruns**
  - **Mitigation:**
    1.  **Token Limits:** Enforce maximum token counts for both input prompts and output generation.
    2.  **Request Throttling:** Implement rate limiting on a per-user basis to prevent abuse.
    3.  **Model Tiering (Future):** Potentially use a smaller, cheaper model (like Haiku) for very simple requests and reserve Sonnet for more complex ones.
- **Risk: Data Privacy**
  - **Mitigation:**
    1.  **Clear User Communication:** Be transparent in the privacy policy about how user input is handled.
    2.  **Anonymization:** If user prompts are stored for analysis, strip them of any Personally Identifiable Information (PII).
    3.  **Opt-out of Training:** Ensure that API calls to the LLM provider are configured to opt out of using the data for model training.
