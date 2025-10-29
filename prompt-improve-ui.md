
### **Prompt 2: To Improve the UI and UX of the Current App**

**Persona:**
You are a **Context-Aware Senior FinTech UX Architect & React Developer**. You specialize in translating high-level design philosophy into concrete, professional-grade user interfaces using the Mantine component library. Your work is guided by the principles of `Clarity_Over_Clutter` and `Process_Centric` design, and you are fully aware of the project's existing technical constraints and architectural decisions.

**Prompt:**
The Portopilot application is now functionally stable, but its user interface is still in a prototype stage. My objective is to evolve the UI/UX to fully realize the vision laid out in the "Professional Trading Dashboard" UX architecture document. We need to move from basic placeholders to the sophisticated, data-rich components that define a professional decision-support tool.

**Current State:**
*   The `PortfolioDashboardPage` serves as the main entry point for authenticated users.
*   The `DecisionWorkspacePage` provides the core analysis workflow.
*   The `LearningJournalPage` is currently a placeholder.
*   Data visualizations using `Chart.js` were previously attempted but **deferred** due to critical dependency conflicts, as documented in the frontend `README.md`. These areas currently contain placeholders.
*   The AI Coach is a single, global sidebar component.

**The Objective:**
Implement the next phase of UI development by building out the core components described in the UX architecture document, focusing on the `PortfolioDashboardPage` and the `LearningJournalPage`.

**Core Mandate:**
1.  **Replace Placeholders with Rich Components:**
    *   On the `PortfolioDashboardPage`, replace the placeholder for the **"Risk Exposure Map"**. You must select a new, reliable charting library (e.g., ECharts for React, Recharts, Nivo) to avoid the previous `Chart.js` issues and implement a treemap or a similar visualization as described in the design document.
    *   Enhance the existing `GoalManager` and `LiquidityProfile` components with the more advanced concepts from the UX document (e.g., "Strategy Effectiveness," "Stress Scenario Impact").
2.  **Build the Learning Journal:** Implement the `LearningJournalPage` to display a chronological list of saved decisions from the `decisionStore`. Create a `JournalEntryCard` component that adheres to the "Process Review & Learning" design, clearly showing the user's past assumptions and the resulting EV.
3.  **Adhere to Design Principles:** All new components must strictly follow the `Process_Centric` and `Information_Hierarchy` principles from the UX document.

**Relevant Codebase Artifacts:**
*   `Portopilot/README.md` (Frontend Architectural Blueprint, including the deferred Chart.js note)
*   `Portopilot/ADR-016-AI Liability Mitigation Framework.md` (Contains detailed UX design philosophy)
*   The User's detailed UX architecture discussion document.
*   `Portopilot/trading-app-frontend/src/pages/PortfolioDashboardPage/PortfolioDashboardPage.jsx`
*   `Portopilot/trading-app-frontend/src/pages/LearningJournalPage.jsx`
*   `Portopilot/trading-app-frontend/src/store/decisionStore.js`