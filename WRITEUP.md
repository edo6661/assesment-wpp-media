# System Design & Architecture Write-up

## 1. System Design and Structure

The system is designed as a decoupled Fullstack application, utilizing **React (Vite)** for the client-side and **Node.js (Express)** for the server-side.

**Backend Architecture:**
To ensure maintainability, scalability, and testability, the backend strictly follows **Clean Architecture** and Domain-Driven Design (DDD) principles. The codebase is divided into:

- **Domain Layer:** Defines core business rules, error handling (`AppError`), and Data Transfer Objects (Zod schemas).
- **Application Layer:** Contains the business logic orchestrator (`PredictUseCase`), ensuring the AI provider and Database repository interact without tight coupling.
- **Infrastructure Layer:** Handles external dependencies. This includes the `GeminiProvider` (external AI API) and `DataRepository` (Prisma ORM for MySQL). Dependency Injection is managed via a centralized `container.ts`.
- **Presentation Layer:** Manages HTTP requests and responses via Express Controllers and Routers.
- **Testability & Reliability:** By strictly adhering to Clean Architecture, the business logic (`PredictUseCase`) is fully isolated from external dependencies like Prisma and the Gemini API. This enabled a robust Test-Driven Development (TDD) approach using `vitest`. Core components, including use cases, validation middlewares, and error handlers, are thoroughly unit-tested without hitting the actual database or consuming AI API quotas.

**Frontend Architecture:**
The frontend utilizes **React Query** for efficient asynchronous state management, caching, and loading states. The UI is component-driven, featuring a dynamic `DataTable` that automatically adapts its columns based on the specific `intent` detected by the backend.

## 2. Handling AI Output and Uncertainty

The biggest challenge with Generative AI is its non-deterministic nature, specifically the risk of "hallucinations" or malformed outputs (e.g., returning markdown blocks instead of raw JSON).

To handle this, the system implements a robust two-step validation pipeline:

1. **Schema Enforcement at the AI Level:** I utilized Google Generative AI's `responseSchema` and `responseMimeType: "application/json"`. This acts as a strict guardrail, explicitly instructing the LLM on the exact keys and data types expected.
2. **Schema Validation at the Application Level:** Even with LLM-level constraints, the output is parsed and passed through a **Zod schema validator** (`predictionSchema`). If the AI hallucinates unexpected keys or wrong data types, Zod intercepts it and throws a structured error, preventing the application from crashing during the database query phase.

## 3. Translation of Natural Language to Data Query (Level 4 Implementation)

The flow of translating natural language to a query operates as follows:

- **Input:** User types: _"show me skincare products under 100k"_
- **Extraction:** Gemini processes this and returns structured data: `{ "intent": "product_search", "entities": { "category": "skincare", "price_max": 100000 } }`.
- **Execution:** The `DataRepository` takes this structured payload, uses a `switch` statement based on the `intent`, and dynamically constructs a Prisma query. For example, it maps `price_max` to Prisma's `lte` (less than or equal) operator, ensuring no hardcoded values are used. Additionally, the repository accepts dynamic limits passed from the client, ensuring queries remain optimized and scalable.

## 4. Trade-offs

While this architecture fulfills the requirements, several trade-offs were made:

- **Latency vs. Flexibility:** Standardizing a filter using standard UI dropdowns takes milliseconds. Using natural language requires an external network call to an LLM before the database can be queried. We trade speed for extreme user flexibility.
- **Prompt Injection Risks:** Since user input is fed directly into an LLM prompt, malicious users might attempt prompt injections to bypass instructions. While the current system mitigates this by enforcing strict JSON output and using parameterized queries via Prisma (preventing SQL injection), prompt manipulation remains an inherent LLM risk.
- **Scalability of Intent Mapping:** Currently, intents are hardcoded in a `switch` case inside the `DataRepository`. If the system grows to handle hundreds of intents, this repository would become a bottleneck. A future iteration would require a dynamic query builder or an Agentic approach where the AI directly safely constructs safe query parameters.
- **Pagination vs. AI Context:** While the system supports dynamic limits to prevent overwhelming payloads, implementing true cursor-based pagination for an AI-driven search presents unique challenges. The state of the NLP query must be preserved across paginated requests to ensure consistency. For this MVP, a dynamic limit constraint is prioritized for simplicity over complex cursor state management.
