---
id: "90waL5T2Bt14718z"
category: "platform/security"
tags: []
published_at: "2026-07-24T19:26:43.540Z"
---


Security
========

At BizKitHub we proactively develop and maintain technologies and processes to ensure the highest achievable level of security. Your privacy is our priority.

## Security at a glance

Our multi-layered security approach ensures your data is protected at every level of the platform.

### Data hosting

The database and application servers run on dedicated hardware in a data centre in France (EU), operated by a provider certified to ISO/IEC 27001. See [Infrastructure](/infrastructure-overview).

### Data segregation

Organization data is isolated at the database partition level with application-layer access controls.

### Access control

Production environment access is restricted with least-privilege principles and time-limited permissions.

### Continuous monitoring

Real-time monitoring of all operations with automated alerts for system anomalies and failures.

## Infrastructure

Customer records are processed in the European Union. The data centre that hosts the database and the application servers is certified to ISO/IEC 27001; payment card data never reaches BizKitHub at all, because card payments are handled entirely by the connected [payment gateways](/payment-gateway-overview).

### Separate services

The platform is split into independent services (API, administration, PDF generation, asset delivery, background workers) that communicate over encrypted connections. Partner services receive only the minimum data needed to process a request.

### Data storage

- **Records** live in a relational database in the EU that is not reachable from the public internet.
- **Files** are kept in object storage with redundant copies, encrypted at rest. See [Storage](/storage-overview).
- **Backups** are write-once and kept with two independent providers. See [Backup and recovery](/backup-overview).
- **E-mails** are delivered through the providers listed on the [sub-processors](/subprocessors-overview) page.

## Data segregation

Complete isolation of organization data at both the database and application layers.

### Database-level isolation

Organization data is isolated at the database partition level. Every row in every database table contains a unique organization identifier, and the database is configured for separate data storage and indexes per organization.

Application logic ensures that data from different customers and organizations can never be mixed, with full isolation always verified.

### Access control

When processing API requests and handling data within BizKitHub Core, we always load data for only one organization based on the current context. This protection is enforced at the database level, in application logic, and through API key verification.

## Security measures

Comprehensive security controls across all aspects of our operations.

### Physical security

- 24/7 data-center surveillance
- Biometric access controls
- Redundant systems and backups
- Regular security audits

### Network security

- TLS 1.2+ encryption for all data
- Continuous vulnerability scanning
- Intrusion detection and prevention
- Network traffic monitoring

### Application security

- Role-based access control (RBAC)
- Continuous access monitoring
- Documented approval processes

### Human resources

- Pre-employment background checks
- Non-disclosure agreements (NDAs)
- Regular security training
- Annual security policy acknowledgment

## Monitoring &amp; incident response

Continuous oversight and rapid response to any security events.

### Continuous monitoring

- **Real-time logging** — internal logging tools and processes.
- **Automated alerts** — instant notifications on system failures.
- **Error transparency** — transparent error logging for organizations.
- **24/7 oversight** — round-the-clock technical supervision.

### Incident response

- 24/7 incident response team
- Clearly defined procedures
- Ongoing team training
- Annual simulation exercises
- Immediate response to security threats

### Suspicious activity detection

BizKitHub invests significant resources in digital security protection. We proactively monitor and deflect attacks, track bot traffic, and develop advanced mechanisms for detecting suspicious activity.

## Data in transit protection

All data is encrypted during transmission using industry-standard protocols.

### TLS encryption

BizKitHub enforces TLS 1.2+ encryption for all data transmitted over public and private networks. All API services and internal microservice connections use the HTTPS protocol, which is always enforced.

<table>
<thead>
<tr><th>Layer</th><th>Coverage</th></tr>
</thead>
<tbody>
<tr><td>HTTPS</td><td>All API endpoints</td></tr>
<tr><td>TLS 1.2+</td><td>Database connections</td></tr>
<tr><td>Encrypted</td><td>Microservice communication</td></tr>
<tr><td>Secure</td><td>File transfers</td></tr>
</tbody>
</table>

## Compliance &amp; audits

BizKitHub maintains a security policy framework that is reviewed annually and enforced across the entire organization.

### Security policies

Employees are required to acknowledge and comply with security policies annually.

### Background checks

Reference checks are performed for all employees, including verification and trustworthiness testing.

### Non-disclosure

All employees and contractors sign non-disclosure agreements (NDAs).
