---
id: "x7bgI0FdYCzlvvxl"
category: "system/smart-locks"
tags: []
published_at: "2026-04-24T06:57:26.914Z"
---


Smart locks
===========

Electronic locks are an increasingly common part of modern operations — from hotel receptions and co-working spaces to short-term rentals where physically handing over keys is not realistic. The `/iot-lock` module manages integration with the TTLock cloud and serves as a central dispatcher for all locks in an organization. It allows monitoring lock availability and battery status, issuing access passwords tied to reservations, remotely opening doors for visitors, and reviewing the history of all events recorded by the lock. This transforms the physical lock into a full-fledged operational tool connected to the rest of the system — reservations, contacts, notifications.
## Lock Overview
The main table displays all active locks belonging to the current organization (deleted records are hidden). The row order is designed so that the administrator can see at a glance what needs attention — active and online locks are at the top, offline or unavailable ones at the bottom. For each lock, the following is displayed:
- **Lock ID** — a numerical identifier assigned by the TTLock service.
- **Alias** — a user-friendly name, typically descriptive ("Main Entrance", "Apartment 3").
- **Connection status** — online or offline depending on whether a Wi-Fi gateway is available.
- **Availability (uptime)** — percentage reliability of the gateway over the last 30 days.
- **Battery charge** — current status in percentage.
- **Administrator** — the assigned responsible person, if set.
- **Hardware** — lock model and firmware version, if this information is available.
The table automatically refreshes every 5 seconds and adapts to the device size. Main actions above the table — **Add** for adding a lock, **Refresh** for requesting a fresh status from the cloud, and **Unlock** for immediate opening — are available according to the status of the given row and user permissions.
> ℹ️ The row order is neither alphabetical nor by date — it reflects operational importance so that offline or problematic devices are more visible at the bottom.
## Lock Lifecycle
Each lock goes through several phases that the system automatically monitors from initial pairing to continuous operation. The pairing itself takes place in two steps: first, the lock is physically connected to the TTLock mobile application on a phone (this is a manufacturer's specific step), then it is added in the administration using the **Add** button by entering its ID. After registration, the system automatically requests the current status from the cloud and populates hardware metadata — model, firmware, MAC address — to eliminate the need for manual entry.
In the operational phase, the system regularly updates the status of each lock. With each refresh, it records the battery level (history is archived for trends), connection status to the gateway, and any changes in firmware or alias. If the gateway goes offline, the event is logged in the system log, and an email is sent to the assigned administrator.
> 💡 You can obtain the lock ID in the TTLock mobile application in the detail of the specific lock. Without valid TTLock login credentials, the lock cannot be added to the system.
> ⚠️ If the battery level drops below 25%, the system generates a critical notification. The battery should be replaced as soon as possible — complete discharge could lead to the lock being inaccessible for remote control, leaving physical intervention via Bluetooth from the mobile application as the only solution.
For longer outages, the table row will display **Offline since** (start of the current outage) and **Last online** (last successful communication). After reconnection, the system automatically generates a new backup password and saves it with the lock record to ensure administrator access is always maintained even after an incident.
## Lock Detail
Clicking on a row opens a detail view divided into four tabs, which thematically separate daily operations from historical records and configuration.
The **Active Passwords** tab is the most frequently used operationally — it contains a list of valid access codes that can be used on the lock. For each password, its validity is shown (from – to, or labeled "Permanent"), an optional description ("Mr. Novak's reservation"), a link to a calendar event if the password was automatically generated for a reservation, and the current status. A new password is added via a modal form: you enter your own code or leave the field blank for the system to generate a random 8-digit code, then complete the optional name and validity range. Leaving the validity end empty creates a permanent password, typical for staff, for example.
The **Unlock History** tab provides a chronological overview of all events recorded by the lock — unlocking by app, keypad, fingerprint, automatic locking. For each event, success, hardware-recorded time, cloud delivery time, and the password used (if available, which only applies to keypad events) are displayed. Event type texts are translated into the user's currently selected language.
The **Battery Charge** tab displays a graph and table of historical battery level measurements. It primarily serves to estimate when the battery will need replacement and helps identify locks that discharge faster than others — typically due to a weaker signal to the gateway or aging hardware.
The **Settings** tab then gathers lock parameters that can be adjusted: alias, active/inactive flag (inactive locks are not refreshed or monitored), deleted flag (hiding from the main overview), and administrator assignment. The administrator is always a contact from the same organization and receives notifications about critical events — gateway outage, critical battery, API error.
> 💡 In practice, password types are divided by use: **permanent** for staff, **time-limited** for reservations and visits, and **one-time** or **short-term** for individual entries within hours to days.
> ⚠️ A password sent to the lock is immediately active on the hardware after creation. Deletion is bidirectional — the code disappears both in the system and on the lock itself, so a customer with an already inactive password cannot open the door even if connection to the cloud is lost.
## Remote Unlocking
The **Unlock** action sends an immediate command to open the door via the TTLock cloud. This is the most valued function of the module — an administrator can open the door for a visitor from the office without having to go there physically. However, the success of the operation depends on several conditions: the lock must be active (not deleted), it must have a connected Wi-Fi gateway, and the integration with TTLock must have valid login credentials.
> ⚠️ Without a connected gateway, the lock cannot be controlled remotely. The lock itself communicates with the cloud only via the gateway; if the gateway goes offline, the only way remains a Bluetooth connection from the customer's mobile application, which is local and unreachable from the administration.
## Integration Security
Communication with the TTLock cloud relies on four values configured in the module: **Client ID** and **Client Secret** identify the application to the TTLock developer portal, while **username** and **password** identify the specific account to which the locks are assigned. For routine password changes in the TTLock mobile application, only the new password needs to be entered in the administration — other fields remain preserved, simplifying routine maintenance.
At the authorization level, the same rules apply as in the rest of the system: a lock always belongs to a single organization, and every command (unlock, add or delete password) is verified against the current user's organization before being sent. Furthermore, each action stores the initiator's identity, so it is always traceable who opened the lock or to whom a code was issued. Error states (invalid data, API outage) are logged in the system log and can trigger a notification to the administrator.
> ℹ️ Stored secret values (Client Secret and TTLock account password) are never returned to the browser. The interface only displays an indicator of whether the value is stored in the system — the actual content is protected and not revealed even to the user who entered it.
## Notifications
The assigned administrator receives email alerts in situations requiring human intervention: the gateway goes offline, the battery level drops below a critical threshold, communication with the TTLock cloud repeatedly fails, or an extraordinary change in lock status occurs (e.g., an automatic alias switch). The goal is to ensure that no problematic lock goes unnoticed, even if the administrator is not actively viewing the overview.
> 💡 If no administrator is assigned to a lock, the system only logs the event and does not send an email notification. For production deployments, we therefore always recommend assigning an administrator — otherwise, no one might know about a gateway outage or dead battery in time.
