---
id: "glrAUmhiOSk6aYVJ"
category: "system/io-t-overview"
tags: []
published_at: "2026-04-24T06:57:27.033Z"
---


IoT overview
============

The `/iot` page is the entry point to the world of connected devices in the administration. It is not a standalone operational tool — that would be impractical, as each type of hardware (lock, sensor, gateway) has its own specifics and deserves a dedicated module. Instead, it serves as a hub and educational material: it introduces the concept of IoT within the system, explains how devices are authorized and to what they are bound, and most importantly, links to specialized modules where actual daily management takes place.
## What the page is for
The purpose of the page is not to duplicate the functions of individual devices, but to provide a comprehensive overview of what the system offers under the concept of IoT and what rules apply equally across all submodules. The administrator can orient themselves here in basic terminology, in available hardware categories, and in how the system protects access to devices. For unlocking, generating passwords, or modifying settings of a specific piece of hardware, it is then necessary to navigate to the corresponding dedicated module.
> ℹ️ The `/iot` page intentionally does not contain tables or interactive actions. To control a specific device, use the corresponding subordinate module from the navigation.
## What is IoT in the system context
In the administration, IoT (Internet of Things) refers to any physical device that is uniquely identifiable, can communicate with the system (either via manufacturer's cloud integration or a local gateway), and is linked to a specific organization. Typically, these are devices that provide telemetry data — battery status, availability, temperature — and simultaneously receive commands: open lock, add access code, change settings. Thanks to this, the administration becomes not only a record of business processes, but also a central controller of the physical world around the premises.
Practically, this means that from a single interface, using the same browser where orders are processed, one can also unlock a door for a visitor, check a camera's battery status, or assign an access code to a tenant.
## Currently supported categories
The portfolio of supported devices is gradually expanding according to the needs of organizations. At this moment, only one category is fully integrated into the system:
- **Smart Locks (TTLock)** — electronic locks controlled via the TTLock cloud and managed in the [Smart Locks (`/iot-lock`)](/iot-lock-overview) module.
> 💡 Other categories — environmental sensors, Wi-Fi gateways, cameras — can be gradually added. As soon as a new category becomes available, it will appear as a separate item in the main navigation and a link will also be added to this page to complete the overview.
## Authorization rules
All IoT devices in the system are bound to a specific organization — the one that registered them. This simple binding is the foundation of the security model: a user sees and controls exclusively devices of their organization, and every command sent is checked against the current login context. This prevents, for example, an administrator of one branch from accidentally opening a lock at another branch, even if they knew the device ID.
At the management level, an accountable person can also be assigned for each device category — an administrator who receives system notifications about critical events (outage, low battery, integration error). This transfers responsibility from an anonymous "team" to a specific individual.
> ⚠️ Login credentials for manufacturer cloud services (TTLock Client Secret, account passwords) are never returned to the browser in the user interface. The interface only displays whether these credentials are stored — their content is solely determined by the configured organization.
## Related modules
Specific daily management takes place in separate modules, to which this page links:
- **Smart Locks (`/iot-lock`)** — management of TTLock locks, access passwords, remote unlocking, and event history.
## How device data is refreshed
Device status in individual modules is refreshed automatically — typically every few seconds, so the administrator sees an up-to-date picture of operations. Historical data (battery level over time, unlock history, outage records) are archived long-term and serve as a basis for reporting and identifying recurring problems. A gateway outage or an integration error is recorded in the system log and can trigger an email notification to the assigned administrator.
> ℹ️ If the expected device does not appear in the overview of a specific module, it is usually because it was not registered to the correct organization, is marked as deleted, or its first telemetry message has not yet arrived. In such a case, the **Refresh** action in the target module or verification of integration settings can help.
