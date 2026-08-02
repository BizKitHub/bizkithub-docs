---
id: "NO1CL6adJjVI1gd2"
category: "developers/promptbook"
tags: []
published_at: "2026-07-24T19:26:33.272Z"
---


Promptbook
==========

Advanced integration of an AI agent into the ticketing system for support automation and intelligent task management.

## Project Goal

Implementation of an advanced AI agent integration into the internal ticketing system, which automatically reacts to new tickets and performs initial triage plus action steps.

- Automatic reaction to new tickets
- Initial triage and action steps
- Faster request handling
- Scalable support system

## Process Workflow

### 1. Ticket creation

The user creates a new ticket via any of the available channels.

### 2. System processing

The system assigns an ID and basic parameters; the ticket is placed into the queue.

### 3. AI analysis

The AI agent performs analysis and decides on the next steps.

### 4. Automated actions

The agent performs the appropriate actions based on the type and content of the ticket.

### 5. Workflow continuation

The ticket continues through the standard process or is automatically closed.

## Input Channels for Tickets

The system supports several ways to create a new request:

- **E-mail** — automatic processing of incoming e-mails.
- **Admin interface** — direct ticket creation in the administration.
- **Contact form** — form on clients' websites.
- **Support web** — dedicated site for technical support.

## AI Integration — Technical View

### Input data

The AI agent receives a JSON payload with the complete ticket context, including:

- Ticket type and category
- Labels and priority
- Ticket text and problem description
- Metadata and parameters
- History of similar tickets

### Decision process

Based on data analysis the AI agent decides on next steps:

- Classification of the problem type
- Determination of priority and urgency
- Selection of an appropriate assignee
- Proposal of initial steps
- Automated actions

### Possible AI agent actions

- Add a public or internal comment
- Change ticket state (open, in progress, closed)
- Assign labels and categories
- Change priority based on severity
- Assign a responsible person
- Add documentation links
- Call the internal BizKitHub API
- Send notification e-mails

## Data Model

Main entities of the system:

### Core entities

- `issue` — main ticket
- `project` — project / organization
- `issueStatus` — ticket states. Every organisation inherits four seeded system statuses (New / In progress / Waiting / Done) that are read-only and translated into every supported locale. Custom refinement statuses can be added per-organisation within one of the four canonical categories; AI and automation always dispatch by category, never by label, so custom statuses never break the fallback.
- `SLA` — service level agreement

### Supporting entities

- `user` — system users
- `comment` — comments
- `attachment` — attachments
- `aiAction` — AI actions

**Note:** A detailed database table design has been prepared and the structure continues to evolve as implementation progresses.

## Benefits

- **Faster handling** — automated processing reduces first-response time.
- **Scalable support** — AI can process a large volume of tickets in parallel.
- **Consistent quality** — standardized procedures ensure uniform support quality.
- **Intelligent triage** — automatic problem-type recognition and assignment to the correct handler.

## Long-Term Vision

### 1. Expansion to internal queries

The AI will handle not only external tickets but also queries from internal employees, using full-text search across the whole organization.

### 2. Contextual recommendations

The AI will be able to surface relevant context and recommendations based on historical data and the organization's knowledge base.

### 3. Scalability and auditability

The system will be fully scalable, auditable, and customizable for different clients and SLA requirements.

## Technical Specifications

### API integration

- REST API communication
- JSON payload format
- Authorized API calls
- Real-time webhook notifications
- Audit logs for all actions

### Security and scaling

- Isolated conversations
- Request-response pattern
- Protection of sensitive data
- Horizontal scaling
- Monitoring and alerting

## Implementation Status

Promptbook AI integration is fully implemented and actively used in the BizKitHub production environment.

### Completed

- Technical integration
- AI decision logic
- Automated actions
- Monitoring system

### In operation

- Ticket processing
- Automatic classification
- Intelligent routing
- Performance optimization

### Future

- Feature expansion
- New AI models
- Advanced analytics
- Multi-tenant support
